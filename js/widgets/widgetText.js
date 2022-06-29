class WidgetText{
  constructor(prop){
    this.settings = testJSON(prop.settings);
    this.rotateDuration = 12000;
    this.textData = [];
    this.prop = prop;
    if(this.settings.rotationOpt == "c"){
      this.rotateDuration = this.settings.rotate * 1000;
    }

    this.htmStr = '<div id="'+ this.prop.type +'-'+ this.prop.id +'" style="width:'+ this.prop.w +'px;height:'+ this.prop.h +'px;background:'+ window.hexToRgbA(this.settings.bg, this.settings.bga) +';font-family:' + this.settings.font.value +'">';
    if(this.prop.dtype == "s"){
      this.htmStr += '<div style="padding:0 10px;height:'+ this.prop.h +'px;font-size:'+ this.settings.size +'px;color:'+ this.settings.titleText +'" id="text-list" class="d-flex text-'+ this.settings.align +' align-'+ this.settings.align +' vAlign-'+ this.settings.vAlign +'"></div></div>';
    }
    this.htmStr += '</div>';
    setTimeout(()=>{this.init()}, 200);
    return this.htmStr;
  }
  init(){
    this.loadFeed();
  }

  loadFeed(){
    this.textData = [];
    this.htmStr = "";
    $.get(apiPath + "/crawlingText/" + this.prop.id.split("-")[2] +"?format=json&"+ new Date().getTime(), (data)=>{
      for(var i=0; i<data.channel.length; i++){
        this.textData.push(data.channel[i].title);
      }
      if(this.textData.length > 0){
        this.loadHtmlFx();
      }
    });
  }

  loadHtmlFx(){
    this.htmStr = "";
    if(this.prop.dtype == "c"){
      var textDir = this.settings.dir == "bt"?"up":"left";
      this.textFontSize = this.settings.fontSize?this.settings.fontSize:this.prop.h*0.60;
      this.htmStr += '<div style="font-family:'+ this.settings.font.value +';white-space:nowrap;font-weight:bold;font-size:'+ this.textFontSize +'px;height:'+ this.prop.h +'px;color:'+ this.settings.titleText +'">';
      // if(textDir == "up"){
      //   this.htmStr += '<marquee behavior="scroll" height="'+ this.prop.h*2 +'" direction="'+ textDir +'" class="text-'+ this.settings.align +'" scrollamount="'+ (this.settings.speed * 2) +'"><style type="text/css">#' + this.prop.type + '-'+ this.prop.id + ' .bull{color:'+ this.settings.bullet +'}</style>';
      // } else{
      //   this.htmStr += '<marquee behavior="scroll" height="'+ this.prop.h +'" style="line-height:'+ (this.prop.h - this.prop.h/22) +'px;font-size:'+ (this.prop.h - this.prop.h/3.4) +'px;" direction="'+ textDir +'" class="text-'+ this.settings.align +'" scrollamount="'+ (this.settings.speed * 2) +'"><style type="text/css">#' + this.prop.type + '-'+ this.prop.id + ' .bull{color:'+ this.settings.bullet +'}</style>';
      // }

      if(this.txtDir == "up"){
        this.htmStr += '<div class="marquee text-'+ this.settings.align +'" style="height:'+ this.prop.h +'px">';
      }
      else{
        this.htmStr += '<div class="marquee" style="height:'+ this.prop.h +'px;line-height:'+ (this.prop.h - this.prop.h/22) +'px;">';
      }

      var textStr = "";
      $.each(this.textData, function($index, text){
        if(textDir == "left"){
          textStr += '<span class="marR50"><span class="marR10 bull">&#9724;</span>'+ text +'</span>';
        } else{
          textStr += '<div class="marB20">'+ text +'</div>';
        }
      });
      this.htmStr += textStr + '</div></div>';
      $("#" + this.prop.type + "-" + this.prop.id).append(this.htmStr);
    } else{
      this.num = 0;
      $("#" + this.prop.type + "-" + this.prop.id + " #text-list").empty();
      $("#" + this.prop.type + "-" + this.prop.id + " #text-list").append(this.textData[this.num]);

      if(this.textData.length > 1){
        this.showNextItem = setInterval(()=>{
          this.num++;
          if(this.num >= this.textData.length){
            this.num = 0;
          }
          $("#" + this.prop.type + "-" + this.prop.id + " #text-list").empty();
          $("#" + this.prop.type + "-" + this.prop.id + " #text-list").append(this.textData[this.num]);
        }, this.rotateDuration);
        window.addTimer(this.showNextItem, "i", this.prop.fid);
      }
    }
    if(this.txtDir == "left"){
      this.elemW = parseInt($("#" + this.prop.type + "-" + this.prop.id + " .marquee")[0].scrollWidth);
      this.duration = parseInt(this.elemW/this.settings.speed);
      this.htmStr = '<style type="text/css">#' + this.prop.type + '-'+ this.prop.id + ' .bull{color:'+ this.settings.bullet +'} #' + this.prop.type + '-' + this.prop.id + ' .marquee{position:relative;animation-name:' + this.prop.type + '-' + this.prop.id + '-marqueeanim;animation-duration:' + this.duration + 's;animation-iteration-count:infinite;animation-timing-function:linear;}@keyframes ' + this.prop.type + '-' + this.prop.id + '-marqueeanim{from{margin-left:' + this.prop.w + 'px;}to{margin-left:-' + this.elemW + 'px;}}</style>';
    }
    else{
      this.elemH = parseInt($("#" + this.prop.type + "-" + this.prop.id + " .marquee")[0].scrollHeight);
      this.duration = parseInt(this.elemH/this.settings.speed);
      this.htmStr = '<style type="text/css">#' + this.prop.type + '-' + this.prop.id + ' .marquee{position:relative;animation-name:' + this.prop.type + '-' + this.prop.id + '-marqueeanim;animation-duration:' + this.duration + 's;animation-iteration-count:infinite;animation-timing-function:linear;}@keyframes ' + this.prop.type + '-' + this.prop.id + '-marqueeanim{from{top:' + this.prop.h + 'px;}to{top:-' + this.elemH + 'px;}}</style>';
    }
  }
}
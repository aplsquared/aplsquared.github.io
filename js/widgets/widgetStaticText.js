class WidgetStaticText{
  constructor(prop){
    this.settings = parseJSON(prop.settings);
    this.rotateDuration = 12000;
    this.textData = [];
    this.prop = prop;

    if(this.settings.rotationOpt == "c"){
      this.rotateDuration = this.settings.rotate * 1000;
    }

    this.htmStr = '<div id="'+ this.prop.type +'-'+ this.prop.id +'" style="width:'+ this.prop.w +'px;height:'+ this.prop.h +'px;background:'+ window.hexToRgbA(this.settings.bg, this.settings.bga) +';font-family:' + this.settings.font.value +'">';
    if(this.prop.dtype == "s"){
      this.htmStr += '<div style="padding:0;height:'+ this.prop.h +'px;font-size:'+ this.settings.size +'px;color:'+ this.settings.titleText +';" id="text-list" class="d-flex text-'+ this.settings.align +' align-'+ this.settings.align +' vAlign-'+ this.settings.vAlign +'"></div>';
    }
    this.htmStr += '</div>';
    setTimeout(()=>{this.init()}, 200);
    return this.htmStr;
  }

  init(){
    if(this.prop.txt){
      this.textData = [];
      for(var i=0; i<this.prop.txt.length; i++){
        this.textData.push({val: this.prop.txt[i].val, d: this.prop.txt[i].d});
      }
      if(this.textData.length > 0){
        this.loadHtmlFx();
      }
    }
    else{
      this.loadFeed();
    }
  }

  loadFeed(){
    this.textData = [];
    this.htmStr = "";
    $.get(apiPath + "/crawlingText/" + this.prop.id.split("-")[2] + "?format=json&" + new Date().getTime(), (data)=>{
      fs.writeFile(resourcePath + "/local/text-" + this.prop.id + ".json", JSON.stringify(data), (err) => { if(err)throw err; });
      for(var i=0; i<data.channel.length; i++){
        this.textData.push({val:data.channel[i].title, d:data.channel[i].d});
      }
      if(this.textData.length > 0){
        this.loadHtmlFx();
      }
    })
    .fail(function(){
      $.get(resourcePath + "/local/text-" + this.prop.id + ".json", (data)=>{
        for(var i=0; i<data.channel.length; i++){
          this.textData.push({val:data.channel[i].title, d:data.channel[i].d});
        }
        if(this.textData.length > 0){
          this.loadHtmlFx();
        }
      });
    });;
  }

  loadHtmlFx(){
    this.htmStr = "";
    if(this.prop.dtype == "c"){
      var textDir = this.settings.dir == "bt"?"up":"left";
      this.textFontSize = this.settings.fontSize?this.settings.fontSize:this.prop.h*0.60;
      this.htmStr += '<div style="font-family:'+ this.settings.font.value +';white-space:nowrap;font-weight:bold;font-size:'+ this.textFontSize +'px;height:'+ this.prop.h +'px;color:'+ this.settings.titleText +'">';
      if(textDir == "up"){
        this.htmStr += '<marquee behavior="scroll" height="'+ this.prop.h*2 +'" direction="'+ textDir +'" class="text-'+ this.settings.align +'" scrollamount="'+ (this.settings.speed * 2) +'"><style type="text/css">#' + this.prop.type + '-'+ this.prop.id + ' .bull{color:'+ this.settings.bullet +'}</style>';
      }
      else{
        this.htmStr += '<marquee behavior="scroll" height="'+ this.prop.h +'" style="line-height:'+ (this.prop.h - this.prop.h/22) +'px;font-size:'+ (this.prop.h - this.prop.h/3.4) +'px;" direction="'+ textDir +'" class="text-'+ this.settings.align +'" scrollamount="'+ (this.settings.speed * 2) +'"><style type="text/css">#' + this.prop.type + '-'+ this.prop.id + ' .bull{color:'+ this.settings.bullet +'}</style>';
      }
      var textStr = "";
      $.each(this.textData, function($index, text){
        if(textDir == "left"){
          textStr += '<span class="marR50"><span class="marR10 bull">&#9724;</span>'+ text.val +'</span>';
        } else{
          textStr += '<div class="marB20">'+ text.val +'</div>';
        }
      });
      this.htmStr += textStr + '</marquee></div>';
      $("#" + this.prop.type + "-" + this.prop.id).append(this.htmStr);
    }
    else{
      this.num = 0;
      $("#" + this.prop.type + "-" + this.prop.id + " #text-list").empty();
      $("#" + this.prop.type + "-" + this.prop.id + " #text-list").append(this.textData[this.num].val);

      if(this.textData.length > 1){
        if(this.settings.rotationOpt == "t"){
          this.showNextItem = setTimeout(()=>{
            this.showNextItemFx();
          }, (this.textData[this.num].d * 1000));
          //window.addTimer(this.showNextItem, "t", this.prop.fid);
        }
        else{
          this.showNextItem = setInterval(()=>{
            this.num++;
            if(this.num >= this.textData.length){
              this.num = 0;
            }
            $("#" + this.prop.type + "-" + this.prop.id + " #text-list").empty();
            $("#" + this.prop.type + "-" + this.prop.id + " #text-list").append(this.textData[this.num].val);
          }, this.rotateDuration);
          //window.addTimer(this.showNextItem, "i", this.prop.fid);
        }
      }
    }
  }

  showNextItemFx(){
    if(this.showNextItem){
      clearTimeout(this.showNextItem);
      this.showNextItem = null;
    }
    this.num++;
    if(this.num >= this.textData.length){
      this.num = 0;
    }
    $("#" + this.prop.type + "-" + this.prop.id + " #text-list").empty();
    $("#" + this.prop.type + "-" + this.prop.id + " #text-list").append(this.textData[this.num].val);

    this.showNextItem = setTimeout(()=>{
      this.showNextItemFx();
    }, (this.textData[this.num].d * 1000));
    //window.addTimer(this.showNextItem, "t", this.prop.fid);
  }

  updateText(obj){
    this.textData = [];
    this.prop.txt = obj.txt;
    this.prop.settings = this.settings = obj.settings;
    for(var i=0; i<this.prop.txt.length; i++){
      this.textData.push({val: this.prop.txt[i].val, d: this.prop.txt[i].d});
    }
    $("#" + this.prop.type + "-" + this.prop.id).css({"background": window.hexToRgbA(this.settings.bg, this.settings.bga), "font-family": this.settings.font.value});
    $("#" + this.prop.type + "-" + this.prop.id + " #text-list").css({"font-size": this.settings.size + "px", "color":this.settings.titleText});
    $("#" + this.prop.type + "-" + this.prop.id + " #text-list").removeClass();
    $("#" + this.prop.type + "-" + this.prop.id + " #text-list").addClass("d-flex text-" + this.settings.align + " align-" + this.settings.align + " vAlign-" + this.settings.vAlign);

    $("#" + this.prop.type + "-" + this.prop.id + " #text-list").empty();
    $("#" + this.prop.type + "-" + this.prop.id + " #text-list").append(this.textData[this.num].val);
  }

  removeFx(){
    if(this.showNextItem){
      clearTimeout(this.showNextItem);
    }

    this.rotateDuration = null;
    this.textFontSize = null;
    this.showNextItem = null;
    this.settings = null;
    this.textData = null;
    this.htmStr = null;
    this.prop = null;

    this.rotateDuration = undefined;
    this.textFontSize = undefined;
    this.showNextItem = undefined;
    this.settings = undefined;
    this.textData = undefined;
    this.htmStr = undefined;
    this.prop = undefined;
  }
}

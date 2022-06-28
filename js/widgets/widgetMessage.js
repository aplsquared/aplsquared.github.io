class WidgetMessage{
  constructor(prop){
    this.settings = JSON.parse(prop.settings);
    this.prop = prop;

    if(this.prop.img != ""){
      if(this.settings.imgPosition == "bg"){
        this.htmStr = '<div id="'+ this.prop.type +'-'+ this.prop.id +'" style="width:'+ this.prop.w +'px;height:'+ this.prop.h +'px;background:url(\'' + resourcePath + '/media/' + this.prop.img + '\') center center no-repeat;"><div class="msgTxtContainer"></div></div>';
      }
      else if(this.settings.imgPosition == "t" || this.settings.imgPosition == "l" || this.settings.imgPosition == "r"){
        this.htmStr = '<div id="'+ this.prop.type +'-'+ this.prop.id +'" style="width:'+ this.prop.w +'px;height:'+ this.prop.h +'px;"><div class="msgImgContainer"></div><div class="msgTxtContainer"></div></div>';
      }
      else if(this.settings.imgPosition == "b"){
        this.htmStr = '<div id="'+ this.prop.type +'-'+ this.prop.id +'" style="width:'+ this.prop.w +'px;height:'+ this.prop.h +'px;"><div class="msgTxtContainer"></div><div class="msgImgContainer"></div></div>';
      }
    }
    else{
      this.htmStr = '<div id="'+ this.prop.type +'-'+ this.prop.id +'" style="width:'+ this.prop.w +'px;height:'+ this.prop.h +'px;"><div class="msgTxtContainer"></div></div>';
    }
    if(this.prop.img != "" && this.settings.imgPosition == "t"){
      this.htmStr += '<div style="text-align:center;padding:20px"><img style="width:100%;height:auto;" src="' + resourcePath + '/media/' + this.prop.img + '"></div>';
    }

    if(this.prop.img != "" && this.settings.imgPosition == "b"){
      this.htmStr += '<div style="text-align:center;padding:20px"><img style="width:100%;height:auto;" src="' + resourcePath + '/media/' + this.prop.img + '"></div>';
    }
    this.htmStr += '</div></div>';
    setTimeout(()=>{this.init()}, 200);
    return this.htmStr;
  }

  init(){
    this.htmStr = "";
    if(this.prop.title != ""){
      this.htmStr = '<div style="font-size:' + this.settings.titleSize + 'px;color:' + this.settings.titleText + ';font-family:\'' + this.settings.titleFont.value + '\';text-align:center;margin-bottom:20px;font-weight:bold;">' + this.prop.title + '</div>';
    }
    if(this.prop.desc != ""){
      this.htmStr += '<div style="font-size:' + this.settings.descSize + 'px;color:' + this.settings.descText + ';font-family:\'' + this.settings.descFont.value + '\';text-align:center;font-weight:bold;">' + this.prop.desc + '</div>';
    }
    $("#" + this.prop.type + "-" + this.prop.id + " .msgTxtContainer").html(this.htmStr);
    if(this.prop.img != ""){
      if(this.settings.imgPosition == "t" || this.settings.imgPosition == "b"){
        $("#" + this.prop.type + "-" + this.prop.id + " .msgImgContainer").css({"height": parseInt(this.prop.h - ($("#" + this.prop.type + "-" + this.prop.id + " .msgTxtContainer").height() + 20)) + "px", "max-height": parseInt(this.prop.h - ($("#" + this.prop.type + "-" + this.prop.id + " .msgTxtContainer").height() + 20)) + "px", "text-align":"center", "overflow":"hidden"});
        this.htmStr = '<img style="height:100%;width:auto;" src="' + resourcePath + '/resized/fit-' + this.prop.img + '">';
      }
      else if(this.settings.imgPosition == "l"){
        $("#" + this.prop.type + "-" + this.prop.id + " .msgImgContainer").css({"float":"left", "width": parseInt(this.prop.w / 2) + "px", "max-width":parseInt(this.prop.w / 2) + "px", "text-align":"center", "overflow":"hidden"});
        $("#" + this.prop.type + "-" + this.prop.id + " .msgTxtContainer").css({"padding-left": (parseInt(this.prop.w / 2) + 20) + "px"});
        this.htmStr = '<img style="width:100%;height:auto;" src="' + resourcePath + '/resized/fit-' + this.prop.img + '">';
      }
      else if(this.settings.imgPosition == "r"){
        $("#" + this.prop.type + "-" + this.prop.id + " .msgImgContainer").css({"float":"right", "width": parseInt(this.prop.w / 2) + "px", "max-width":parseInt(this.prop.w / 2) + "px", "text-align":"center", "overflow":"hidden"});
        $("#" + this.prop.type + "-" + this.prop.id + " .msgTxtContainer").css({"padding-right": (parseInt(this.prop.w / 2) + 20) + "px"});
        this.htmStr = '<img style="width:100%;height:auto;" src="' + resourcePath + '/resized/fit-' + this.prop.img + '">';
      }
      $("#" + this.prop.type + "-" + this.prop.id + " .msgImgContainer").html(this.htmStr);
      if(this.settings.imgPosition == "l" || this.settings.imgPosition == "r" || this.settings.imgPosition == "bg"){
        $("#" + this.prop.type + "-" + this.prop.id + " .msgTxtContainer").css({"padding-top": parseInt((this.prop.h - $("#" + this.prop.type + "-" + this.prop.id + " .msgTxtContainer").height())/2) + "px"});
      }
    }
  }

  removeFx(){
    this.settings = null;
    this.htmStr = null;
    this.prop = null;

    this.settings = undefined;
    this.htmStr = undefined;
    this.prop = undefined;
  }
}

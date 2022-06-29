class WidgetWebPage {
  constructor(prop){
    this.clickable = false;
    this.htmStrObj = "";
    this.prop = prop;

    this.settings = parseJSON(this.prop.settings);

    if(this.settings.clickable && this.settings.clickable.a){
      this.htmStr = '<div id="'+ this.prop.type +'-'+ this.prop.id +'">';
      this.clickable = true;
    }
    else{
      this.htmStr = '<div id="slideIframe-'+ this.prop.type +'-'+ this.prop.id +'">';
    }
    this.reDuration = (this.settings.reloadOpt == "c")?this.settings.reload * 1000:900000;
    this.bg = (this.prop.bg =="")?"#000":this.prop.bg;

    this.scrollX = this.settings.x;
    this.scrollY = this.settings.y;
    this.w = parseInt(this.prop.w);
    this.h = parseInt(this.prop.h);

    if(this.settings.x > 0){
      this.scrollX = -this.settings.x;
      this.w = parseInt(this.prop.w) + this.settings.x;
    }
    if(this.settings.y > 0){
      this.scrollY = -this.settings.y;
      this.h = parseInt(this.prop.h) + this.settings.y;
    }
    if(!this.settings.scroll){
      this.w = this.w + 18;
    }
    console.log(this.settings);
    if(this.clickable){
      this.htmStrObj = '<img id="clickable" src="' + resourcePath + '/resized/fit-' + this.prop.fileName + '">';
      console.log(this.htmStrObj);
    }
    else{
      if(this.settings.container && this.settings.container == "wv"){
        this.htmStrObj = '<webview src="'+ this.prop.src +'" nodeintegration class="browser_container" style="position:relative;width:'+ this.w +'px;height:'+ this.h +'px;border:0;background:'+ this.bg +';left:'+ this.scrollX +'px;top:'+ this.scrollY +'px"></webview>';
      }
      else{
        this.htmStrObj = '<iframe src="'+ this.prop.src +'" nodeintegration class="browser_container" style="position:relative;width:'+ this.w +'px;height:'+ this.h +'px;border:0;background:'+ this.bg +';left:'+ this.scrollX +'px;top:'+ this.scrollY +'px"></iframe>';
      }
      this.refreshTimer = setInterval(()=>{
        $("#slideIframe-" + this.prop.type +'-'+ this.prop.id + " .browser_container").src = this.prop.src + "?" + new Date().getTime();
      }, this.reDuration);
      //window.addTimer(this.refreshTimer, "i", this.prop.fid);
    }

    if(!this.clickable && fsFrameId != ""){
      iframeArray.push({id:"slideIframe-" + this.prop.type + "-" + this.prop.id, src:this.htmStrObj})
      this.htmStr += "</div>";
    }
    else{
      this.htmStr += this.htmStrObj + "</div>";
      setTimeout(()=>{this.registerClickable()}, 1000);
    }
    return this.htmStr;
  }

  registerClickable(){
    $("#" + this.prop.type +'-'+ this.prop.id + " #clickable").click(()=>{
      console.log(this.prop);
    });
  }

  removeFx(){
    clearInterval(this.refreshTimer);

    this.reDuration = this.scrollX = this.scrollY = this.w = this.h = null;
    this.bg = this.htmStr = this.htmStrObj = null;
    this.refreshTimer = null;
    this.clickable = null;
    this.settings = null;
    this.prop = null;

    this.reDuration = this.scrollX = this.scrollY = this.w = this.h = undefined;
    this.bg = this.htmStr = this.htmStrObj = undefined;
    this.refreshTimer = undefined;
    this.clickable = undefined;
    this.settings = undefined;
    this.prop = undefined;
  }
}

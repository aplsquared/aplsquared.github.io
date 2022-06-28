class WidgetBrowser {
  constructor(prop){
    this.reDuration = 900000;
    this.htmStrObj = "";
    this.prefix = "";
    this.prop = prop;
    this.gsUrl = "";
    this.bg = "";

    this.htmStr = '<div id="slideIframe-'+ this.prop.type +'-'+ this.prop.id +'">';

    if(this.prop.settings){
      this.settings = JSON.parse(this.prop.settings);
    }
    if(this.prop.settings && this.settings.reloadOpt && this.settings.reloadOpt == "c"){
      this.reDuration = this.settings.reload * 1000;
    }
    if(this.prop.bg == ""){
      this.bg = "#000";
    }
    if(this.prop.type == "unisys" || this.prop.type == "webpage"){
      //this.reDuration = 60000;
      this.bg = this.settings.bg;
    }

    if(this.prop.type == "livestream"){
      this.htmStrObj = '<iframe src="'+ apiPath +'/livestream/'+ this.prop.id.split("-")[2] +'/'+ this.prop.w +'/'+ this.prop.h +'" style="width:'+ this.prop.w +'px;height:'+ this.prop.h +'px;overflow:hidden;border:0;background:'+ this.bg +'"></iframe>';
    }
    else if(this.prop.type == "unisys"){
      this.htmStrObj = '<iframe src="'+ apiPath +'/unisysqueue/'+ this.prop.id.split("-")[2] + '" style="width:'+ this.prop.w +'px;height:'+ this.prop.h +'px;overflow:hidden;border:0;background:'+ this.bg +'"></iframe>';
      // this.refreshTimer = setInterval(()=>{
      //   $("#slideIframe-" + this.prop.type +'-'+ this.prop.id + " iframe").src += '';
      // }, this.reDuration);
      // window.addTimer(this.refreshTimer, "i", this.prop.fid);
    }
    else if(this.prop.type == "traffic"){
      this.htmStrObj = '<iframe name="google-disable-x-frame-options" scrolling="no" src="'+ apiPath +"/traffic/"+ this.prop.id.split("-")[2] +'?h='+ this.prop.h +'&w='+ this.prop.w +'" nodeintegration style="width:'+ this.prop.w +'px;height:'+ this.prop.h +'px;border:0;background:'+ this.bg +'"></iframe>';
    }
    else if(this.prop.type == "calendarofeventsview"){
      this.htmStrObj = '<iframe name="google-disable-x-frame-options" scrolling="no" src="'+ apiPath +"/calendarOfEventsViewHTML/"+ this.prop.id.split("-")[2] +'?h='+ this.prop.h +'&w='+ this.prop.w +'" nodeintegration style="width:'+ this.prop.w +'px;height:'+ this.prop.h +'px;border:0;background:'+ this.bg +'"></iframe>';
    }
    else if(this.prop.type == "nextvehicle"){
      this.htmStrObj = '<iframe name="google-disable-x-frame-options" scrolling="no" src="'+ apiPath +"/nextvehicle/"+ this.prop.id.split("-")[2] +'?h='+ this.prop.h +'&w='+ this.prop.w +'" nodeintegration style="width:'+ this.prop.w +'px;height:'+ this.prop.h +'px;border:0;background:'+ this.bg +'"></iframe>';
    }
    else if(this.prop.type == "vimeo"){
      this.prefix = "?autoplay=1&loop=1&muted=";
      if(this.prop.src.toString().indexOf("?") >= 0){
        this.prefix = "&autoplay=1&loop=1&muted=";
      }
      this.mute = 0;
      this.cc = 0;
      if(this.settings && this.settings.cc){
        this.cc = 1;
      }
      if(this.prop.sound == "no"){
        this.mute = 1;
      }
      this.htmStrObj = '<iframe name="google-disable-x-frame-options" scrolling="no" src="https://player.vimeo.com/video/'+ this.prop.src + this.prefix + this.mute + '&texttrack=en&controls=0" nodeintegration style="width:'+ this.prop.w +'px;height:'+ this.prop.h +'px;border:0;background:'+ this.bg +'"></iframe>';
    }
    else if(this.prop.type == "webpage"){
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
    else if(this.prop.type == "webwidget"){
      this.htmStrObj = '<iframe src="'+ apiPath +"/webwidget/"+ this.prop.id.split("-")[2] +'" nodeintegration style="width:'+ this.prop.w +'px;height:'+ this.prop.h +'px;border:0;background:'+ this.bg +'"></iframe>';
    }
    else if(this.prop.type == "googleslide"){
      this.gsUrl = this.prop.src;
      if(this.gsUrl.indexOf('rm=minimal') == -1){
        this.gsUrl += "&rm=minimal";
      }
      this.htmStrObj = '<webview src="'+ this.gsUrl +'" nodeintegration style="width:'+ this.prop.w +'px;height:'+ this.prop.h +'px;border:0;background:'+ this.bg +'"></webview>';
      if(this.prop.settings && this.settings.reloadOpt && this.settings.reloadOpt == "c"){
        this.refreshTimer = setInterval(()=>{
          this.htmStrObj = '<webview src="'+ this.gsUrl +'" nodeintegration style="width:'+ this.prop.w +'px;height:'+ this.prop.h +'px;border:0;background:'+ this.bg +'"></webview>';
          $("#slideIframe-" + this.prop.type +'-'+ this.prop.id).empty().append(this.htmStrObj);
        }, this.reDuration);
      }
    }
    else if(this.prop.type == "youtube"){
      this.mute = 0;
      this.cc = 0;
      if(this.settings && this.settings.cc){
        this.cc = 1;
      }
      if(this.prop.sound == "no"){
        this.mute = 1;
      }
      this.htmStrObj = '<iframe src="https://www.youtube.com/embed/'+ this.prop.src +'?autoplay=1&loop=1&cc_load_policy='+ this.cc +'&mute='+ this.mute +'&controls=0&enablejsapi=1&playlist='+ this.prop.src + '" nodeintegration style="width:'+ this.prop.w +'px;height:'+ this.prop.h +'px;border:0;background:'+ this.bg +'"></iframe>';
    }
    else if(this.prop.type == "slack"){
      this.htmStrObj = '<iframe src="'+ apiPath +"/slackHtml/"+ this.prop.id.split("-")[2] +'" nodeintegration style="width:'+ this.prop.w +'px;height:'+ this.prop.h +'px;border:0;background:'+ this.bg +'"></iframe>';
    }
    else if(this.prop.type == "powerbi"){
      this.htmStrObj = '<iframe src="'+ apiPath +"/powerbiHtml/"+ this.prop.id.split("-")[2] +'?did=' + did + '" nodeintegration style="width:'+ this.prop.w +'px;height:'+ this.prop.h +'px;border:0;background:'+ this.bg +'"></iframe>';
      // if(this.prop.settings && this.settings.reloadOpt && this.settings.reloadOpt == "c"){
      //   this.refreshTimer = setInterval(()=>{
      //     this.htmStrObj = '<iframe src="'+ apiPath +"/powerbiHtml/"+ this.prop.id.split("-")[2] +'?did=' + did + '" nodeintegration style="width:'+ this.prop.w +'px;height:'+ this.prop.h +'px;border:0;background:'+ this.bg +'"></iframe>';
      //     $("#slideIframe-" + this.prop.type +'-'+ this.prop.id).empty().append(this.htmStrObj);
      //   }, this.reDuration);
      // }
    }
    else if(this.prop.type == "facebook"){
      if (this.settings.mute) {
        this.htmStrObj = '<iframe src="'+ apiPath +"/facebookVideoMute?href=" + this.prop.src + '&width=100%&mute=' + this.settings.mute + '&' + new Date().getTime() + '" nodeintegration style="width:'+ this.prop.w +'px;height:'+ this.prop.h +'px;border:0;background:'+ this.bg +'"></iframe>';
      }
      else {
        this.htmStrObj = '<iframe src="'+ apiPath +"/facebookVideo?href=" + this.prop.src + '&width=100%&mute=' + this.settings.mute + '&' + new Date().getTime() + '" nodeintegration style="width:'+ this.prop.w +'px;height:'+ this.prop.h +'px;border:0;background:'+ this.bg +'"></iframe>';
      }
    }

    if(fsFrameId != ""){
      iframeArray.push({id:"slideIframe-" + this.prop.type + "-" + this.prop.id, src:this.htmStrObj})
      this.htmStr += "</div>";
    }
    else{
      this.htmStr += this.htmStrObj + "</div>";
    }
    return this.htmStr;
  }

  removeFx(){
    if(this.refreshTimer){
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
      this.refreshTimer = undefined;
    }

    this.htmStrObj = this.prefix = this.gsUrl = this.bg = null;
    this.reDuration = null;
    this.htmStr = null;
    this.prop = null;

    this.htmStrObj = this.prefix = this.gsUrl = this.bg = undefined;
    this.reDuration = undefined;
    this.htmStr = undefined;
    this.prop = undefined;
  }
}

class WidgetLiveStream{
  constructor(prop){
    this.htmStrObj = "";
    this.listSrc = "";
    this.htmStr = "";
    this.vidSrc = "";
    this.prop = prop;

    this.htmStr = '<div id="slideIframe-'+ this.prop.type +'-'+ this.prop.id +'">';
    this.lsUrl = this.prop.src.toLowerCase();

    if(this.prop.dtype == "hls"){
      this.htmStrObj = '<iframe src="'+ apiPath + '/hls?cid=' + this.prop.id.split("-")[2] + '&cl=' + this.prop.cl + '&mute=' + this.prop.mute + '" style="width:'+ this.prop.w +'px;height:'+ this.prop.h +'px;border:0;background:'+ this.bg +'"></iframe>';
      if(fsFrameId != ""){
        iframeArray.push({id:"slideIframe-" + this.prop.type + "-" + this.prop.id, src:this.htmStrObj})
        this.htmStr += "</div>";
      }
      else{
        this.htmStr += this.htmStrObj + "</div>";
      }
    }
    else if(this.prop.dtype == "yt"){
      if(this.lsUrl.indexOf("&list=") >= 0){
        this.listSrc = this.prop.src.split("&list=")[1].split("&")[0];
      }
      if(this.lsUrl.indexOf("?v=") >= 0){
        this.vidSrc = this.prop.src.split("?v=")[1].split("&")[0];
      }

      if(this.listSrc != ""){
        this.htmStrObj = '<iframe src="https://www.youtube.com/embed/'+ this.vidSrc +'?autoplay=1&loop=1&controls=0&enablejsapi=1&playlist='+ this.listSrc + '&mute=' + this.prop.mute + '" nodeintegration style="width:'+ this.prop.w +'px;height:'+ this.prop.h +'px;border:0;background:'+ this.bg +'"></iframe>';
      }
      else{
        this.htmStrObj = '<iframe src="https://www.youtube.com/embed/'+ this.vidSrc +'?autoplay=1&loop=1&controls=0&enablejsapi=1&mute=' + this.prop.mute + '" nodeintegration style="width:'+ this.prop.w +'px;height:'+ this.prop.h +'px;border:0;background:'+ this.bg +'"></iframe>';
      }
      if(fsFrameId != ""){
        iframeArray.push({id:"slideIframe-" + this.prop.type + "-" + this.prop.id, src:this.htmStrObj})
        this.htmStr += "</div>";
      }
      else{
        this.htmStr += this.htmStrObj + "</div>";
      }
    }
    if(this.prop.dtype == "https"){
      this.htmStrObj = '<iframe src="' + this.prop.src + '" style="width:'+ this.prop.w +'px;height:'+ this.prop.h +'px;border:0;background:'+ this.bg +'"></iframe>';
      if(fsFrameId != ""){
        iframeArray.push({id:"slideIframe-" + this.prop.type + "-" + this.prop.id, src:this.htmStrObj})
        this.htmStr += "</div>";
      }
      else{
        this.htmStr += this.htmStrObj + "</div>";
      }
    }
    else if(this.prop.dtype == "rtsp"){
      this.htmStr = '<div id="lsplayer-' + this.prop.type + '-' + this.prop.id + '" style="height:' + this.prop.h + 'px;"><div id="lsplayer-' + this.prop.type + '-' + this.prop.id + '-vid" style="height:' + this.prop.h + 'px;"></div></div>';
      setTimeout(()=>{this.init()}, 200);
    }
    return this.htmStr;
  }

  init(){}

  removeFx(){
    this.htmStrObj = this.listSrc = this.htmStr = this.vidSrc = null;
    this.prop = null;

    this.htmStrObj = this.listSrc = this.htmStr = this.vidSrc = undefined;
    this.prop = undefined;
  }
}

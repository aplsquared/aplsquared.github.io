class WidgetRadio{
  constructor(prop){
    this.prop = prop;
    this.htmStr = '<div id="'+ this.prop.type + '-' + this.prop.id +'"></div>';

    setTimeout(()=>{this.init()}, 100);
    return this.htmStr;
  }

  init(){
    this.radio = document.createElement('audio');
    this.radio.src = this.prop.src;
    this.radio.controls = false;
    this.radio.autoplay = true;
    this.radio.loop = true;

    if(!convertBoolean(this.prop.sound)){
      this.radio.muted = true;
    }
    else{
      this.radio.volume = this.prop.volume*.1;
    }

    if(fsFrameId != ""){
      this.radio.pause();
    }
    $("#" + this.prop.type + "-" + this.prop.id).append(this.radio);
  }

  removeFx(){
    this.radio.src = "";
    this.radio.load();

    this.htmStr = null;
    this.radio = null;
    this.prop = null;

    this.htmStr = undefined;
    this.radio = undefined;
    this.prop = undefined;
  }
}

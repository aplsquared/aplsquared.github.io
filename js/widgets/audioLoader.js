class AudioLoader{
  constructor(prop){
    this.prop = prop;
    this.htmStr = '<div id="'+ this.prop.type + '-' + this.prop.id +'"></div>';

    setTimeout(()=>{this.init()}, 100);
    return this.htmStr;
  }

  init(){
    this.audio = document.createElement('audio');
    this.audio.src = resourcePath + '/media/' + this.prop.src;
    this.audio.controls = false;
    this.audio.autoplay = true;
    this.audio.loop = true;

    if(!convertBoolean(this.prop.sound)){
      this.audio.muted = true;
    }
    if(fsFrameId != ""){
      this.audio.pause();
    }
    $("#" + this.prop.type + "-" + this.prop.id).append(this.audio);
  }

  removeFx(){
    this.audio.src = "";
    this.audio.load();

    this.htmStr = null;
    this.audio = null;
    this.prop = null;

    this.htmStr = undefined;
    this.audio = undefined;
    this.prop = undefined;
  }
}

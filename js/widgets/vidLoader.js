class VidLoader{
  constructor(prop){
    this.prop = prop;
    this.scaledW = 0;
    this.scaledH = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.track;
    this.vid;

    this.htmStr = '<div id="'+ this.prop.type + '-' + this.prop.id +'" style="width:'+ this.prop.w +'px;height:'+ this.prop.h +'px"></div>';

    setTimeout(()=>{this.init()}, 100);
    return this.htmStr;
  }

  init(){
    this.vid = document.createElement('video');
    $(this.vid).on('loadeddata', ()=>{
      if(fsFrameId != "" && this.prop.fid != "fs"){
        this.vid.pause();
      }
      this.fitImgToFrame();
    });

    if(this.prop.ccn && this.prop.ccn != ""){
      this.vid.addEventListener("loadedmetadata", ()=> {
        this.track = document.createElement("track");
        this.track.kind = "captions";
        this.track.label = "English";
        this.track.srclang = "en";
        this.track.default = true;
        this.track.src = resourcePath + '/media/' + this.prop.ccn;

        this.track.addEventListener("load", ()=>{
          this.track.mode = "showing";
          this.vid.textTracks[0].mode = "showing";
        });

        this.vid.appendChild(this.track);
      });
    }

    // this.vid.src = resourcePath + '/media/' + this.prop.src;
    this.vid.src = resolveBlobURL(this.prop.id);
    this.vid.id = this.prop.type + "-" + this.prop.id;
    this.vid.autoplay = true;
    this.vid.loop = true;

    if(convertBoolean(this.prop.mute)){
      this.vid.muted = true;
    }
    $("#" + this.prop.type + "-" + this.prop.id).append(this.vid);
  }

  fitImgToFrame(){
    this.scaleY = this.prop.h / $(this.vid).height();
    this.scaleX = this.prop.w / $(this.vid).width();

    if(this.prop.scale == "fit"){
      if(this.scaleX < this.scaleY){
        $(this.vid).css({"transform-origin": "0 0", "transform":"scale(" + this.scaleX + "," + this.scaleX + ")"});
      } else{
        $(this.vid).css({"transform-origin": "0 0", "transform":"scale(" + this.scaleY + "," + this.scaleY + ")"});
      }
    }
    else if(this.prop.scale == "crop"){
      if(this.scaleX > this.scaleY){
        $(this.vid).css({"transform-origin": "0 0", "transform":"scale(" + this.scaleX + "," + this.scaleX + ")"});
      } else{
        $(this.vid).css({"transform-origin": "0 0", "transform":"scale(" + this.scaleY + "," + this.scaleY + ")"});
      }
    }
    else{
      $(this.vid).css({"width": this.prop.w + "px", "height": this.prop.h + "px", "object-fit": "fill"});
    }

    this.scaledH = $(this.vid)[0].getBoundingClientRect().height;
    this.scaledW = $(this.vid)[0].getBoundingClientRect().width;
    this.xAlign = this.prop.a.split("-")[1];
    this.yAlign = this.prop.a.split("-")[0];

    if(this.xAlign == "l"){
      $(this.vid).css("margin-left", "0px");
    } else if(this.xAlign == "c"){
      $(this.vid).css("margin-left", Math.floor((this.prop.w - this.scaledW) / 2));
    } else if(this.xAlign == "r"){
      $(this.vid).css("margin-left", Math.floor(this.prop.w - this.scaledW));
    }

    if(this.yAlign == "t"){
      $(this.vid).css("margin-top", "0px");
    } else if(this.yAlign == "m"){
      $(this.vid).css("margin-top", Math.floor((this.prop.h - this.scaledH) / 2));
    } else if(this.yAlign == "b"){
      $(this.vid).css("margin-top", Math.floor(this.prop.h - this.scaledH));
    }
  }

  removeFx(){
    if(this.vid){
      this.vid.src = "";
      this.vid.load();
    }

    this.scaledW = this.scaledH = this.scaleX = this.scaleY = null;
    this.htmStr = null;
    this.track = null;
    this.prop = null;
    this.vid = null;

    this.scaledW = this.scaledH = this.scaleX = this.scaleY = undefined;
    this.htmStr = undefined;
    this.track = undefined;
    this.prop = undefined;
    this.vid = undefined;
  }
}

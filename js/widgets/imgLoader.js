class ImgLoader{
  constructor(prop, isFs=false, isLive=false, isTP=false){
    this.outputHeight = prop.h;
    this.outputWidth = prop.w;
    this.img = new Image();
    this.isfsScale = "";
    this.live = isLive;
    this.prop = prop;
    this.isTP = isTP;
    this.scaledW = 0;
    this.scaledH = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.fs = isFs;

    this.htmStr = '<div id="'+ this.prop.type + '-' + this.prop.id +'" style="width:'+ this.prop.w +'px;height:'+ this.prop.h +'px"></div>';

    setTimeout(()=>{this.init()}, 100);
    return this.htmStr;
  }

  init(){
    if(this.fs){
      this.isfsScale = "fs";
      this.prop.h = screenH;
      this.prop.w = screenW;
    }

    $(this.img).on('load', ()=>{
      this.fitImgToFrame();
    });
    if(this.live){
      this.img.src = this.prop.src;
    }
    else{
      this.img.src = resolveBlobURL(this.prop.id);
    }
    $("#" + this.prop.type + "-" + this.prop.id).append(this.img);
  }

  fitImgToFrame(){
    this.scaledH = $(this.img)[0].getBoundingClientRect().height;
    this.scaledW = $(this.img)[0].getBoundingClientRect().width;
    this.xAlign = this.prop.a.split("-")[1];
    this.yAlign = this.prop.a.split("-")[0];

    this.scaleX = this.prop.w / this.scaledW;
    this.scaleY = this.prop.h / this.scaledW;


    // console.warn(this.scaleX < this.scaleY);

    // console.error(this.scaleX, " - ", this.scaleY);

    // if(this.scaleX < this.scaleY){
    //   $(this.img).css({"transform-origin":"0 0", "transform":"scale("+ this.scaleX +","+ this.scaleX +")"});
    // } else{
    //   $(this.img).css({"transform-origin":"0 0", "transform":"scale("+ this.scaleY +","+ this.scaleY +")"});
    // }
    
    $(this.img).css({"object-fit":"scale-down", "width":"100%", "height":"100%"});

    this.scaledH = $(this.img)[0].getBoundingClientRect().height;
    this.scaledW = $(this.img)[0].getBoundingClientRect().width;

    // console.warn(this.scaledH, " - ", this.scaledW);

    if(this.xAlign == "l"){
      $(this.img).css("margin-left", "0px");
    } else if(this.xAlign == "c"){
      $(this.img).css("margin-left", Math.floor((this.prop.w - this.scaledW) / 2));
    } else if(this.xAlign == "r"){
      $(this.img).css("margin-left", Math.floor(this.prop.w - this.scaledW));
    }

    if(this.yAlign == "t"){
      $(this.img).css("margin-top", "0px");
    } else if(this.yAlign == "m"){
      $(this.img).css("margin-top", Math.floor((this.prop.h - this.scaledH) / 2));
    } else if(this.yAlign == "b"){
      $(this.img).css("margin-top", Math.floor(this.prop.h - this.scaledH));
    }
  }

  removeFx(){
    this.outputHeight = this.outputWidth = this.scaledW = this.scaledH = this.scaleX = this.scaleY = this.scaledH = this.scaledW = this.scaleX = this.scaleY = null;
    this.isfsScale = this.xAlign = this.yAlign = null;
    this.fs = this.live = this.isTP = null;
    this.img.src= "";
    this.prop = null;
    this.img = null;

    this.outputHeight = this.outputWidth = this.scaledW = this.scaledH = this.scaleX = this.scaleY = this.scaledH = this.scaledW = this.scaleX = this.scaleY = undefined;
    this.isfsScale = this.xAlign = this.yAlign = undefined;
    this.fs = this.live = this.isTP = undefined;
    this.prop = undefined;
    this.img = undefined;
  }
}

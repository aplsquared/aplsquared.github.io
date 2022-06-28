class WidgetF45ContentScroller {
  constructor(prop){
    this.settings = parseJSON(prop.settings);
    this.contentArr = [];
    this.vidList = [];
    this.prop = prop;
    this.rotateTimer;
    this.f45Content;
    this.container;
    this.minY = 0;
    this.num = 0;
    this.curVid;

    this.htmStr = '<div id="'+ this.prop.type +'-'+ this.prop.id +'" style="width:' + this.prop.w + 'px;height:' + this.prop.h + 'px;overflow:hidden;">';
    this.htmStr += '<div class="f45contentContainer">';
    for(var i=0; i<this.prop.content.length; i++){
      this.vidList.push({id:i, d:this.prop.content[i].d, h:this.settings.h + this.settings.g});
      if(this.prop.content[i].type.toLowerCase() == "video"){
        this.f45content = new WidgetF45VidLoader({ id:i, type:this.prop.content[i].type.toLowerCase(), src:this.prop.content[i].fileName, w:this.prop.content[i].w, h:this.prop.content[i].h, duration:this.prop.content[i].d * 1000, fs:"no", settings:this.settings});
      }
      else{
        this.f45content = new WidgetF45ImgLoader({ id:i, type:this.prop.content[i].type.toLowerCase(), a:"m-c", src:this.prop.content[i].fileName, w:this.prop.content[i].w, h:this.prop.content[i].h, duration:this.prop.content[i].d * 1000, fs:"no", settings:this.settings});
      }
      this.htmStr += this.f45content.htmStr;
    }
    this.htmStr += '</div></div>';
    setTimeout(()=>{this.init()}, 200);

    return this.htmStr;
  }

  init(){
    this.container = $("#"+ this.prop.type +'-'+ this.prop.id + " .f45contentContainer");
    this.minY = this.prop.h - this.container.height();
    TweenMax.to($("#"+ this.prop.type +'-'+ this.prop.id + " #vid-" + this.num + " .overlay"), 0.5, {opacity: 0});
    this.rotateTimer = setTimeout(()=>{this.rotate();}, this.vidList[this.num].d * 1000);
    window.addTimer(this.rotateTimer, "t", this.prop.fid);
  }

  rotate(){
    if(this.rotateTimer){
      clearTimeout(this.rotateTimer);
      this.rotateTimer = null;
    }

    if(parseInt(this.container.css("marginTop")) > this.minY){
      TweenMax.to(this.container, 0.5, {marginTop: parseInt(this.container.css("marginTop")) - this.vidList[this.num].h});
    }
    this.num++;
    if(this.num >= this.vidList.length){
      this.num = 0;
      if(parseInt(this.container.css("marginTop")) != 0){
        TweenMax.to(this.container, 0.5, {marginTop: 0});
      }
    }
    for(var i=0; i<this.vidList.length; i++){
      if(i == this.num){
        TweenMax.to($("#"+ this.prop.type +'-'+ this.prop.id + " #vid-" + i + " .overlay"), 0.5, {opacity: 0});
      }
      else{
        TweenMax.to($("#"+ this.prop.type +'-'+ this.prop.id + " #vid-" + i + " .overlay"), 0.5, {opacity: 1});
      }
    }
    this.rotateTimer = setTimeout(()=>{this.rotate();}, this.vidList[this.num].d * 1000);
    //window.addTimer(this.rotateTimer, "t", this.prop.fid);
  }

  removeFx(){
    if(this.contentArr.length > 0){
      for(var i=0; i<this.contentArr.length; i++){
        this.contentArr[i].removeFx();
        this.contentArr[i] = null;
        this.contentArr[i] = undefined;
      }
    }

    if(this.rotateTimer){
      clearTimeout(this.rotateTimer);
    }

    this.contentArr = this.vidList = null;
    this.prop = this.settings = null;
    this.minY = this.num = null;
    this.rotateTimer = null;
    this.f45Content = null;
    this.container = null;
    this.htmStr = null;
    this.curVid = null;

    this.contentArr = this.vidList = undefined;
    this.prop = this.settings = undefined;
    this.minY = this.num = undefined;
    this.rotateTimer = undefined;
    this.f45Content = undefined;
    this.container = undefined;
    this.htmStr = undefined;
    this.curVid = undefined;
  }
}

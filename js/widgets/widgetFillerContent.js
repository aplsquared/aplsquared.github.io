class WidgetFillerContent{
  constructor(prop){
    this.settings = JSON.parse(prop.settings);
    this.itemChangeTimer;
    this.prop = prop;
    this.fillerObj;
    this.rNum = 0;
    this.curItem;

    this.htmStr = '<div id="' + this.prop.type + '-' + this.prop.id + '" style="width:' + this.prop.w + 'px;height:' + this.prop.h + 'px;overflow:hidden;"></div>';
    setTimeout(()=>{this.init()}, 200);
    return this.htmStr;
  }

  init(){
    if(this.prop.content && this.prop.content.length > 0){
      for(var i=0; i<this.prop.content.length; i++){
        this.prop.content[i].src = this.prop.content[i].fileName;
        this.prop.content[i].a = this.prop.a;
        this.prop.content[i].w = this.prop.w;
        this.prop.content[i].h = this.prop.h;
      }
      this.loadContent();
    }
  }

  loadContent(){
    if(this.settings.pbs == "r"){
      this.rNum = Math.floor((Math.random() * this.prop.content.length));
    }
    else{
      $.get(resourcePath + "/local/filler-" + this.prop.id + ".json", (data)=> {
        this.rNum = JSON.parse(data).i + 1;
        if(this.rNum >= this.prop.content.length){
          this.rNum = 0;
        }
        fs.writeFile(resourcePath + "/local/filler-" + this.prop.id + ".json", '{"i":' + this.rNum + '}', (err) => { if(err)throw err; });
      })
      .fail(()=>{
        this.rNum = 0;
        fs.writeFile(resourcePath + "/local/filler-" + this.prop.id + ".json", '{"i":' + this.rNum + '}', (err) => { if(err)throw err; });
      });
    }

    this.curItem = this.prop.content[this.rNum];
    if(this.curItem.type == "image" || this.curItem.type == "vector" || this.curItem.type == "powerpoint" || this.curItem.type == "word"){
      this.fillerObj = new ImgLoader(this.curItem);
      $("#" + this.prop.type + '-' + this.prop.id).empty().append(this.fillerObj.htmStr);
    }
    else if(this.curItem.type == "video"){
      this.fillerObj = new VidLoader(this.curItem);
      $("#" + this.prop.type + '-' + this.prop.id).empty().append(this.fillerObj.htmStr);
    }

    if(this.prop.content.length > 1){
      this.itemChangeTimer = new Timer(()=>{this.loadContent()}, vm.curItem.duration * 1000);
    }
  }

  removeFx(){
    if(vm.curItem && vm.curItem.type == "video"){
      this.fillerObj.removeFx();
    }

    if(this.itemChangeTimer){
      this.itemChangeTimer.clear();
    }

    this.itemChangeTimer = null;
    this.fillerObj = null;
    this.settings = null;
    this.htmStr = null;
    this.rNum = null;
    this.prop = null;

    this.itemChangeTimer = undefined;
    this.fillerObj = undefined;
    this.settings = undefined;
    this.htmStr = undefined;
    this.rNum = undefined;
    this.prop = undefined;
  }
}

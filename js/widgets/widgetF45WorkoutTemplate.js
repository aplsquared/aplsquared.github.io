class F45WorkoutTemplate {
  constructor(prop) {
    this.templateFeed;
    this.curTemplate;
    this.prop = prop;
    this.n = 0;

    this.htmStr = '<div id="' + this.prop.type + '-' + this.prop.id + '" class="workout-template" style="width:' + this.prop.w + 'px;height:' + this.prop.h + 'px;"></div>';
    setTimeout(()=>{this.init()}, 200);
    return this.htmStr;
  }

  init(){
    this.templateFeed = this.prop.scene;
    this.drawTemplate();
  }

  drawTemplate(){
    window.clearAllTimers();
    frameObjArr = [];
    $("#" + this.prop.type + '-' + this.prop.id).empty();
    $.each(this.templateFeed, (index, item)=>{
      if(item.type == "content" || item.type == "dContent"){
        var frame = new Frame({id:item.id + "-" + index, a:"c-m", w:item.w, h:item.h, x:item.x, y:item.y, z:item.z, bg:item.bg, bga:item.bga, transition:feed.device[0].transition, tz:feed.device[0].timeZone, items:item.item?item.item:[]});
        frameObjArr.push(frame);
        fTimerArr.push({id:item.id + "-" + index, timers:[]});
        $("#" + this.prop.type + "-" + this.prop.id).append(frame.htmStr);
      }
    });
  }

  removeFx(){
    this.templateFeed = this.prop = null;
    this.curTemplate = null;
    this.htmStr = null;
    this.n = null;

    this.templateFeed = this.prop = undefined;
    this.curTemplate = undefined;
    this.htmStr = undefined;
    this.n = undefined;
  }
}

class WidgetCountDown {
  constructor(prop) {
    this.settings = JSON.parse(prop.settings);
    this.beep = new Audio("img/beep.mp3");
    this.curDate = new Date();
    this.timerCount = 0;
    this.timeDiff = 0;
    this.curTime = 0;
    this.beepOn = 10;
    this.htmStr = "";
    this.updateTimer;
    this.prop = prop;
    this.mi = 0;
    this.h = 0;
    this.m = 0;
    this.s = 0;

    if(this.prop.dtype == "u"){
      this.targetDate = new Date(this.curDate.getFullYear(), this.curDate.getMonth(), this.curDate.getDate(), this.settings.up.timeStr.split(":")[0], this.settings.up.timeStr.split(":")[1]);
    }
    else{
      this.targetDate = new Date(this.curDate.getFullYear(), this.curDate.getMonth(), this.curDate.getDate(), this.settings.down.timeStr.split(":")[0], this.settings.down.timeStr.split(":")[1]);
    }
    this.targetTime = this.targetDate.getTime();

    this.htmStr ='<div id="count-' + this.prop.id + '" style="width:'+ this.prop.w +'px;height:'+ this.prop.h +'px;font-size:' + this.settings.countSize + 'px; color:' + this.settings.countText + ';font-family:' + this.settings.countFont.value + '"></div>';
    setTimeout(()=>{this.init()}, 200);
    return this.htmStr;
  }

  init(){
    this.updateTimer = setInterval(() => {
      this.updateCountdownTime();
    }, 1000);
    window.addTimer(this.updateTimer, "i", this.prop.fid);
  }

  updateCountdownTime(){
    this.curDate = new Date();
    this.curTime = this.curDate.getTime();
    this.timeDiff = this.targetTime - this.curTime;
    if(this.timeDiff < 0){
      $("#count-" + this.prop.id).html("00:00:00");
      clearTimeout(this.updateTimer);
    }
    else{
      this.s = parseInt((this.timeDiff / 1000) % 60);
      this.m = parseInt((this.timeDiff / 60000) % 60);
      this.h = parseInt((this.timeDiff / 3600000) % 24);
      $("#count-" + this.prop.id).html(window.padStr(this.h) + ":" + padStr(this.m) + ":" + padStr(this.s));
      if(this.prop.beep){
        if(this.s % 15 == 0){
          if(this.s != this.beepOn){
            this.beepOn = this.s;
            this.beep.play();
          }
        }
      }
    }
  }
}

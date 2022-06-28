class WidgetF45 {
  constructor(prop) {
    this.longBeep = new Audio("img/beep2.mp3");
    this.settings = JSON.parse(prop.settings);
    this.beep = new Audio("img/beep.mp3");
    this.countdownType = "during";
    this.curDate = new Date();
    this.nearestWorkout = 500;
    this.todayWorkouts = [];
    this.itemChangeTimer;
    this.timerCount = 0;
    this.updateTimerCI;
    this.updateTimerT;
    this.updateTimerI;
    this.timeDiff = 0;
    this.curTime = 0;
    this.htmStr = "";
    this.prop = prop;
    this.beepOn = 10;
    this.fileExtArr;
    this.ssNum = 0;
    this.content;
    this.fileExt;
    this.mi = 0;
    this.h = 0;
    this.m = 0;
    this.s = 0;
    this.ssImg;
    this.ssVid;

    for(var i=0; i<this.prop.content.length; i++){
     if(this.prop.content[i].day == curDate.getDay()){
       this.prop.content[i].stStr = this.prop.content[i].st;
       this.prop.content[i].etStr = this.prop.content[i].et;
       this.prop.content[i].st = new Date(this.curDate.getFullYear(), this.curDate.getMonth(), this.curDate.getDate(), this.prop.content[i].st.split(":")[0], this.prop.content[i].st.split(":")[1]).getTime();
       // this.prop.content[i].et = this.prop.content[i].st + (((this.prop.content[i].exercise + this.prop.content[i].rest) * this.prop.content[i].repetition) * 1000);
       this.prop.content[i].et = this.prop.content[i].st + (this.prop.content[i].exercise * 1000);
       this.todayWorkouts.push(this.prop.content[i])
     }
    }

    if(this.todayWorkouts.length > 1){
      this.todayWorkouts.sort(function(a, b) {
        return a.st - b.st;
      });
      console.log(this.todayWorkouts);
    }

    this.htmStr = '<div id="f45-' + this.prop.id + '" style="width:'+ this.prop.w +'px;text-align:center;height:'+ this.prop.h +'px;background:' + window.hexToRgbA(this.settings.timerBg, this.settings.timerBga) + ';font-size:200px;color:' + this.settings.timerText + ';font-family:' + this.settings.timerFont.value + '"></div>';
    setTimeout(()=>{this.checkNearest()}, 200);
    return this.htmStr;
  }

  checkNearest(){
    this.curTime = new Date().getTime();
    this.nearestWorkout = 500;
    for(var i=0; i<this.todayWorkouts.length; i++){
      if(this.curTime < this.todayWorkouts[i].st || (this.curTime > this.todayWorkouts[i].st && this.curTime < this.todayWorkouts[i].et)){
        this.nearestWorkout = i;
        break;
      }
    }
    console.log("this.nearestWorkout: " + this.nearestWorkout);
    if(this.nearestWorkout != 500){
      this.curTime = new Date().getTime();
      if((this.todayWorkouts[this.nearestWorkout].st - this.curTime) > 60000){
        if(this.prop.adverts.length > 0){
          this.ssNum = 0;
          this.loadSS();
          this.updateTimerT = setTimeout(()=>{
            $("#f45-" + this.prop.id).empty();
            clearTimeout(this.updateTimerT);
            this.checkContent();
          }, ((this.todayWorkouts[this.nearestWorkout].st - this.curTime) - 60000));
        }
        else{
          this.checkContent();
        }
      }
      else{
        this.checkContent();
      }
    }
    else{
      if(this.prop.adverts.length > 0){
        this.ssNum = 0;
        this.loadSS();
      }
      console.log("No workout today 1");
    }
  }

  checkContent(){
    this.curTime = new Date().getTime();
    if(this.itemChangeTimer){
      clearTimeout(this.itemChangeTimer);
      this.itemChangeTimer = null;
    }
    if(this.curTime < this.todayWorkouts[this.nearestWorkout].st){
      console.log("pre");
      this.countdownType = "pre";
      this.targetTime = this.todayWorkouts[this.nearestWorkout].st;
      $("#f45-" + this.prop.id).html('<div style="font-size:120px;">Next workout in:</div><div id="time" style="margin-top:' + parseInt((this.prop.h/2)-200) + 'px;"></div>');
      this.updateTimerI = setInterval(() => {
        this.updateCountdownTime();
      }, 1);
      window.addTimer(this.updateTimerI, "i", this.prop.fid);
    }
    else if(this.curTime > this.todayWorkouts[this.nearestWorkout].st && this.curTime < this.todayWorkouts[this.nearestWorkout].et){
      console.log("during");
      if(this.todayWorkouts[this.nearestWorkout].type == "timer"){
        console.log("timer");
        this.countdownType = "during";
        this.targetTime = this.todayWorkouts[this.nearestWorkout].et;
        $("#f45-" + this.prop.id).html('<div id="time" style="margin-top:' + parseInt((this.prop.h/2)-100) + 'px;color:#3ba8ff;"></div>');
        this.updateTimerI = setInterval(() => {
          this.updateCountdownTime();
        }, 1);
        window.addTimer(this.updateTimerI, "i", this.prop.fid);
      }
      else if(this.todayWorkouts[this.nearestWorkout].type == "route"){
        console.log("route");
        $("#f45-" + this.prop.id).html('<div style="width:1370px;height:1080px;float:right;background:url(img/f45-route.png);"></div><div class="cTime" style="text-align:center;padding:' + parseInt((this.prop.h/2)-180) + 'px 1370px 0 0;color:#3ba8ff;"></div>');
        this.updateTimerT = setTimeout(()=>{
          console.log("check new content");
          $("#f45-" + this.prop.id).empty();
          clearTimeout(this.updateTimerT);
          // this.checkNearest();
          this.showPostTimer();
        }, this.todayWorkouts[this.nearestWorkout].et - new Date().getTime());

        this.targetTime = this.todayWorkouts[this.nearestWorkout].et;
        this.updateTimerCI = setInterval(() => {
          this.updateCountdownContentTime();
        }, 1);
        window.addTimer(this.updateTimerCI, "i", this.prop.fid);
      }
      else{
        console.log("Load content");
        this.todayWorkouts[this.nearestWorkout].src = this.todayWorkouts[this.nearestWorkout].fileName;
        this.todayWorkouts[this.nearestWorkout].a = "m-c";
        if(this.todayWorkouts[this.nearestWorkout].type == "image" || this.todayWorkouts[this.nearestWorkout].type == "vector" || this.todayWorkouts[this.nearestWorkout].type == "powerpoint" || this.todayWorkouts[this.nearestWorkout].type == "word"){
          this.content = new ImgLoader(this.todayWorkouts[this.nearestWorkout]);
        }
        else if(this.todayWorkouts[this.nearestWorkout].type == "video"){
          this.content = new VidLoader(this.todayWorkouts[this.nearestWorkout]);
        }
        $("#f45-" + this.prop.id).html(this.content.htmStr);
        $("#f45-" + this.prop.id).append('<div class="cTime" style="position:absolute;left:544px;width:524px;text-align:center;top:1650px;z-index:9999999999999;font-size:100px;color:#3ba8ff;font-family:' + this.settings.timerFont.value + '"></div>');

        console.log("check after: " + (this.todayWorkouts[this.nearestWorkout].et - new Date().getTime()));
        this.updateTimerT = setTimeout(()=>{
          console.log("check new content");
          $("#f45-" + this.prop.id).empty();
          clearTimeout(this.updateTimerT);
          // this.checkNearest();
          this.showPostTimer();
        }, this.todayWorkouts[this.nearestWorkout].et - new Date().getTime());

        this.targetTime = this.todayWorkouts[this.nearestWorkout].et;
        this.updateTimerCI = setInterval(() => {
          this.updateCountdownContentTime();
        }, 1);
        window.addTimer(this.updateTimerCI, "i", this.prop.fid);
      }
    }
    else{
      console.log("No workout today.");
    }
  }

  showPostTimer(){
    this.countdownType = "post";
    this.targetTime = new Date().getTime() + 60000;
    if(this.prop.longBeep){
      this.longBeep.play();
    }
    $("#f45-" + this.prop.id).html('<div style="font-size:90px;">Workout Complete!<br>Time to Stretch:</div><div id="time" style="margin-top:' + parseInt((this.prop.h/2)-200) + 'px;"></div>');
    this.updateTimerI = setInterval(() => {
      this.updateCountdownTime();
    }, 1);
    window.addTimer(this.updateTimerI, "i", this.prop.fid);
  }

  updateCountdownTime(){
    this.curDate = new Date();
    this.curTime = this.curDate.getTime();
    this.timeDiff = this.targetTime - this.curTime;
    if(this.timeDiff < 0){
      console.log("timer fin");
      $("#f45-" + this.prop.id + " #time").html("00:00:00");
      $("#f45-" + this.prop.id + " #time").empty();
      clearTimeout(this.updateTimerI);
      if(this.countdownType == "during"){
        this.showPostTimer();
      }
      else{
        this.checkNearest();
      }
    }
    else{
      //this.mi = parseInt((this.timeDiff) % 60);
      this.s = parseInt((this.timeDiff / 1000) % 60);
      this.m = parseInt((this.timeDiff / 60000) % 60);
      this.h = parseInt((this.timeDiff / 3600000) % 24);
      $("#f45-" + this.prop.id + " #time").html(window.padStr(this.h) + ":" + padStr(this.m) + ":" + padStr(this.s));
      if(this.s % 15 == 0){
        if(this.prop.beep){
          if(this.s != this.beepOn){
            this.beepOn = this.s;
            this.beep.play();
          }
        }
      }
    }
  }

  updateCountdownContentTime(){
    this.curTime = new Date().getTime();
    this.timeDiff = this.targetTime - this.curTime;
    if(this.timeDiff < 0){
      console.log("timer fin");
      $("#f45-" + this.prop.id + " .cTime").html("00:00:00");
      $("#f45-" + this.prop.id + " .cTime").empty();
      clearTimeout(this.updateTimerCI);
    }
    else{
      $("#f45-" + this.prop.id + " .cTime").html(window.padStr(parseInt(this.timeDiff / 1000)));
      //this.mi = parseInt((this.timeDiff) % 60);
      // this.s = parseInt((this.timeDiff / 1000) % 60);
      // this.m = parseInt((this.timeDiff / 60000) % 60);
      // this.h = parseInt((this.timeDiff / 3600000) % 24);
      // if(this.h > 0){
      //   $("#f45-" + this.prop.id + " .cTime").html(window.padStr(this.h) + ":" + padStr(this.m) + ":" + padStr(this.s));
      // }
      // else{
      //   $("#f45-" + this.prop.id + " .cTime").html(padStr(this.m) + ":" + padStr(this.s));
      // }
      // if(this.s % 15 == 0){
      //   if(this.s != this.beepOn){
      //     this.beepOn = this.s;
      //     this.beep.play();
      //   }
      // }
    }
  }

  loadSS(){
    this.fileExtArr = this.prop.adverts[this.ssNum].src.split(".");
		this.fileExt = this.fileExtArr[this.fileExtArr.length - 1];
    $("#f45-" + this.prop.id).empty();

    if(this.ssImg){
      this.ssImg = null;
    }
    if(this.ssVid){
      this.ssVid = null;
    }
    if(this.itemChangeTimer){
      clearTimeout(this.itemChangeTimer);
      this.itemChangeTimer = null;
    }

    if(this.fileExt == "png" || this.fileExt == "jpg" || this.fileExt == "jpeg" || this.fileExt == "gif"){
      this.ssImg = new Image();
      $(this.ssImg).on('load', ()=>{
        this.fitImgToFrame();
      });
      if(fs.existsSync(resourcePath + '/resized/fit-' + this.prop.adverts[this.ssNum].fileName)){
        this.ssImg.src = resourcePath + '/resized/fit-' + this.prop.adverts[this.ssNum].fileName;
      }
      $("#" + this.prop.type + '-' + this.prop.id).append(this.ssImg);
    }
    else if(this.fileExt == "mp4"){
      console.log("mp4");
      this.content = new VidLoader({id:this.prop.id, type:"video", src:this.prop.adverts[this.ssNum].fileName, sound:"yes", duration:this.prop.adverts[this.ssNum].duration, fs:false, scale:"fit", a:"m-c" });
      //this.htmStr = '<video id="' + this.prop.type + '-' + this.prop.id + '" width="' + this.prop.w + '" height="' + this.prop.h + '" loop autoplay><source src="' + resourcePath + '/media/' + this.prop.adverts[this.ssNum].fileName + '" type="video/mp4"></video>';
      $("#" + this.prop.type + '-' + this.prop.id).html(this.content);
    }

    if(this.prop.adverts.length > 1){
      this.itemChangeTimer = setTimeout(()=>{this.loadNextItemFx()}, this.prop.adverts[this.ssNum].d * 1000);
      window.addTimer(this.itemChangeTimer, "t", this.prop.fid);
    }
  }

  loadNextItemFx(){
    this.ssNum++;
    if(this.ssNum >= this.prop.adverts.length){
      this.ssNum = 0;
    }
    this.loadSS();
  }

  fitImgToFrame(){
    this.scaleX = this.prop.w / $(this.ssImg).width();
    this.scaleY = this.prop.h / $(this.ssImg).height();

    if(this.scaleX < this.scaleY){
      $(this.ssImg).css({"transform-origin": "0 0", "transform":"scale(" + this.scaleX + "," + this.scaleX + ")"});
    } else{
      $(this.ssImg).css({"transform-origin": "0 0", "transform":"scale(" + this.scaleY + "," + this.scaleY + ")"});
    }

    this.scaledW = $(this.ssImg)[0].getBoundingClientRect().width;
    this.scaledH = $(this.ssImg)[0].getBoundingClientRect().height;
    $(this.ssImg).css("margin-top", Math.floor((this.prop.h - this.scaledH) / 2));
    $(this.ssImg).css("margin-left", Math.floor((this.prop.w - this.scaledW) / 2));
  }
}

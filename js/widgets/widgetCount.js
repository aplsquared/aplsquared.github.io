class WidgetCount {
  constructor(prop) {
    this.settings = JSON.parse(prop.settings);
    this.mInterval = 10000;
    this.interval = null;
    var fid = prop.fid;
    this.countStr = "";
    this.textStr = "";
    this.htmStr = "";
    this.prop = prop;
    this.start = "";
    this.end = "";
    this.count = 0;
    this.now = "";
    this.time = 0;

    if (this.prop.dtype == "d") {
      if (this.settings.down.type == 'a') {
        this.count = this.settings.down.end;
      } else if (this.settings.down.type == 'c') {
        this.count = 0;
        this.now = new Date().getTime();
        console.error(this.now);
        this.end = Date.parse(this.settings.down.dateStr + " " + this.settings.down.timeStr);
        if (this.now < this.end) {
          if (this.settings.cType == 's') {
            this.count = (this.end - this.now) / 1000;
          } else if (this.settings.cType == 'm') {
            var sec = (this.end - this.now) / 1000;
            this.count = Math.floor(sec / 60);
          } else if (this.settings.cType == 'h') {
            var sec = (this.end - this.now) / 1000;
            this.count = Math.floor(sec / 3600);
          } else if (this.settings.cType == 'd') {
            var sec = (this.end - this.now) / 1000;
            this.count = Math.floor(sec / (3600*24));
          } else if (this.settings.cType == 'w') {
            var sec = (this.end - this.now) / 1000;
            this.count = Math.floor(sec / (3600*24*7));
          } else if (this.settings.cType == 'M') {
            var sec = (this.end - this.now) / 1000;
            this.count = Math.floor(sec / (3600*24*30));
          }
          this.count = parseInt(this.count);
        }
      }
    }
    else if (this.prop.dtype == "u"){
      if (this.settings.up.type == "a"){
        this.count = 0;
      }
      else if (this.settings.up.type == "c") {
        this.count = 0;
        this.now = new Date().getTime();
        this.start = Date.parse(this.settings.up.dateStr + " " + this.settings.up.timeStr);
      }
    }

    this.htmStr ='<div id="count-' + this.prop.id + '" style="width:'+ this.prop.w +'px;height:'+ this.prop.h*0.85 +'px;background-color:'+ window.hexToRgbA(this.settings.bg, this.settings.bga) +'">'
    this.htmStr += '</div>';
    setTimeout(()=>{this.loadContent()}, 200);
    return this.htmStr;
  }

  loadContent(){
    if (this.settings.cType == 's') {
      this.time = 1000;
    }
    else if (this.settings.cType == 'm') {
      this.time = 60000;
    }
    else if (this.settings.cType == 'h') {
      this.time = 60 * 60 * 1000;
    }
    else if (this.settings.cType == 'd') {
      this.time = 60 * 60 * 1000 * 24;
    }
    else if (this.settings.cType == 'w') {
      this.time = 60 * 60 * 1000 * 24 * 7;
    }
    else if (this.settings.cType == 'M') {
      this.time = 60 * 60 * 1000 * 24 * 30;
    }

    this.textStr = "";
    if (this.settings.title) {
      this.textStr += '<div class="d-flex"><div id="title" class="text-ellipsis" style="font-size:' + this.settings.titleSize + 'px; color:' + this.settings.titleText + ';font-family:' + this.settings.titleFont.value + '">' + this.settings.title + '</div><div id="cnt" style="font-size:' + this.settings.countSize + 'px; color:' + this.settings.countText + ';font-family:' + this.settings.countFont.value + '">' + this.count + '</div></div>';
    }
    else {
      this.textStr += '<div id="cnt" style="font-size:' + this.settings.countSize + 'px; color:' + this.settings.countText + ';font-family:' + this.settings.countFont.value + '">' + this.count + '</div>';
    }
    $("#count-" + this.prop.id).html(this.textStr);

    if (this.settings.titleP == 't') {
      $('#count-'+this.prop.id).addClass('countPT');
      $('#count-'+this.prop.id+' > div').removeClass('d-flex');
    }
    else if (this.settings.titleP == 'b') {
      $('#count-'+this.prop.id).addClass('countPT');
      $('#count-'+this.prop.id+' > div').addClass('d-grid').removeClass('d-flex');
      $('#count-'+this.prop.id+' #title').css('grid-row', '2');
    }
    else if (this.settings.titleP == 'r') {
      $('#count-'+this.prop.id+' #title').css('order', '2');
      $('#count-'+this.prop.id+' #cnt').css('order', '1');
      $('#count-'+this.prop.id+' #cnt').addClass('marR5');
    }
    else if (this.settings.titleP == 'l') {
      $('#count-'+this.prop.id+' #title').css('order', '1');
      $('#count-'+this.prop.id+' #cnt').css('order', '2');
      $('#count-'+this.prop.id+' #title').addClass('marR5');
    }
    this.startTimerFx(this.count);
  }

  startTimerFx(count){
    if (this.prop.dtype == "d") {
      if(count > 0){
        var intervalTime = this.time;
        var timerCount = count;
        if(this.settings.down.type == 'c'){
          var timerCount = getTimeDifference(this.now, this.end, this.settings.cType);
          if(this.settings.cType == 'm'){
            var ts = Math.abs(this.now - this.end);
            intervalTime = ts % 60000;
          }
          else if(this.settings.cType == 'h'){
            if(timerCount >= 60) {
              timerCount = parseInt(timerCount / 60);
            }
            else {
              timerCount = 0;
            }
            var ts = Math.abs(this.now - this.end);
            intervalTime = ts % 3600000;
          }
          else if(this.settings.cType == 'd'){
            var ts = Math.abs(this.now - this.end);
            intervalTime = ts % 86400000;
          }
          else if(this.settings.cType == 'w'){
            var ts = Math.abs(this.now - this.end);
            intervalTime = ts % 604800000;
          }
        }
        if(this.settings.cType == 'M'){
          intervalTime = this.mInterval;
        }
        this.currentTime = new Date().getTime();
        this.outerInterval = setInterval(() => {
          if(this.settings.cType == 'M'){
            if(this.settings.down.type == 'c'){
              if(timerCount > 0){
                timerCount = getTimeDifference(new Date().getTime(), this.end, this.settings.cType);
                intervalTime = this.mInterval;
              }
            }
            else {
              var count = getTimeDifference(this.currentTime, new Date().getTime(), this.settings.cType);
              if(count > 0){
                timerCount = timerCount - count;
                this.currentTime = new Date().getTime();
                if(timerCount == 0){
                  clearInterval(this.outerInterval);
                  //window.addTimer(this.outerInterval, "i", this.prop.fid);
                }
              }
            }
            $('#count-'+this.prop.id+' #cnt').html(timerCount);
            if(timerCount == 0){
              if(this.settings.down.type == 'c'){
                clearInterval(this.outerInterval);
                //window.addTimer(this.outerInterval, "i", this.prop.fid);
              }
            }
          }
          else {
            clearInterval(this.outerInterval);
            timerCount = timerCount - 1;
            $('#count-'+this.prop.id+' #cnt').html(timerCount);
            if(timerCount > 0){
              if(this.settings.cType == 's'){
                intervalTime = 1000;
              }
              else if(this.settings.cType == 'm'){
                intervalTime = 60000;
              }
              else if(this.settings.cType == 'h'){
                intervalTime = 3600000;
              }
              else if(this.settings.cType == 'd'){
                intervalTime = 86400000;
              }
              else if(this.settings.cType == 'w'){
                intervalTime = 604800000;
              }
              this.interval = setInterval(() => {
                timerCount = timerCount - 1;
                if(timerCount == 0){
                  clearInterval(this.interval);
                }
                $('#count-'+this.prop.id+' #cnt').html(timerCount);
              }, intervalTime);
              //window.addTimer(this.interval, "i", this.prop.fid);
            }
          }
        }, intervalTime);
        //window.addTimer(this.outerInterval, "i", this.prop.fid);
      }
    }
    else {
      var timerCount = count;
      var intervalTime = this.time;
      if (this.settings.up.type == 'c') {
        if(this.now < this.start){
          var diffCount = getTimeDifference(this.now, this.start, this.settings.cType);
          this.outerInterval = setInterval(() => {
            var isTrue = (new Date().toString() == new Date(this.start).toString() ? true : false);
            if(isTrue){
              clearInterval(this.outerInterval);
              if(this.settings.cType == 'h'){
                intervalTime = 60 * 60 * 1000;
              }
              else if(this.settings.cType == 'd'){
                intervalTime = 60 * 60 * 1000 * 24;
              }
              else if(this.settings.cType == 'w'){
                intervalTime = 60 * 60 * 1000 * 24 * 7;
              }
              else if(this.settings.cType == 'M'){
                this.start = new Date().getTime();
                intervalTime = this.mInterval;
              }
              this.interval = setInterval(() => {
                if(this.settings.cType == 'M'){
                  timerCount = getTimeDifference(new Date().getTime(), this.start, this.settings.cType);
                }
                else {
                  timerCount = timerCount + 1;
                }
                $('#count-'+this.prop.id+' #cnt').html(timerCount);
              }, intervalTime);
              //window.addTimer(this.interval, "i", this.prop.fid);
            }
          }, 1000);
          //window.addTimer(this.outerInterval, "i", this.prop.fid);
        }
        else {
          var diffCount = getTimeDifference(this.now, this.start, this.settings.cType);
          var intervalTime = this.time;
          if(this.settings.cType == 'm'){
            var ts = Math.abs(new Date().getTime() - this.start);
            intervalTime = 60000 - (ts % 60000);
          }
          else if(this.settings.cType == 'h'){
            if(diffCount > 60) {
              diffCount = parseInt(diffCount / 60);
            }
            else {
              diffCount = 0;
            }
            var ts = Math.abs(this.now - this.start);
            intervalTime = 3600000 - (ts % 3600000);
          }
          else if (this.settings.cType == 'd'){
            var timestamp = Math.abs(this.now - this.start);
            var day = parseInt(timestamp/86400000);
            var remainingTimeStamp = timestamp - (day * 86400000);
            intervalTime = Math.abs(remainingTimeStamp - 86400000);
          }
          else if (this.settings.cType == 'w'){
            var timestamp = Math.abs(this.now - this.start);
            var week = parseInt(timestamp/604800000);
            var remainingTimeStamp = timestamp - (week * 604800000);
            intervalTime = Math.abs(remainingTimeStamp - 604800000);
          }
          else if(this.settings.cType == 'M'){
            intervalTime = this.mInterval;
          }
          $('#count-'+this.prop.id+' #cnt').html(diffCount);
          this.outerInterval = setInterval(() => {
            clearInterval(this.outerInterval);
            if(this.settings.cType == 's'){
              diffCount = diffCount + 1;
              intervalTime = 1000;
            }
            else if(this.settings.cType == 'm'){
              diffCount = diffCount + 1;
              intervalTime = 60000;
            }
            else if(this.settings.cType == 'h'){
              diffCount = diffCount + 1;
              intervalTime = 60 * 60 * 1000;
            }
            else if(this.settings.cType == 'd'){
              diffCount = diffCount + 1;
              intervalTime = 60 * 60 * 1000 * 24;
            }
            else if(this.settings.cType == 'w'){
              diffCount = diffCount + 1;
              intervalTime = 60 * 60 * 1000 * 24 * 7;
            }
            $('#count-'+this.prop.id+' #cnt').html(diffCount);
            this.interval = setInterval(() => {
              if(this.settings.cType == 'M'){
                diffCount = getTimeDifference(new Date().getTime(), this.start, this.settings.cType);
                intervalTime = this.mInterval;
              } else {
                diffCount = diffCount + 1;
              }
              $('#count-'+this.prop.id+' #cnt').html(diffCount);
            }, intervalTime);
            //window.addTimer(this.interval, "i", this.prop.fid);
          }, intervalTime);
          //window.addTimer(this.outerInterval, "i", this.prop.fid);
        }
      }
      else {
        var intervalTime = this.time;
        if(this.settings.cType == 'M'){
          this.start = new Date().getTime();
          intervalTime = this.mInterval;
        }
        this.interval = setInterval(() => {
          if(this.settings.cType == 'M'){
            timerCount = getTimeDifference(new Date().getTime(), this.start, this.settings.cType);
          }
          else {
            timerCount = timerCount + 1;
          }
          $('#count-'+this.prop.id+' #cnt').html(timerCount);
        }, intervalTime);
        //window.addTimer(this.interval, "i", this.prop.fid);
      }
    }
  }

  removeFx(){
    if(this.outerInterval){
      clearInterval(this.outerInterval);
    }
    if(this.interval){
      clearInterval(this.interval);
    }

    this.countStr = this.textStr = this.htmStr = this.start = this.end = this.now = null;
    this.mInterval = this.count = this.time = null;
    this.outerInterval = this.interval = null;
    this.prop = this.settings = null;

    this.countStr = this.textStr = this.htmStr = this.start = this.end = this.now = undefined;
    this.mInterval = this.count = this.time = undefined;
    this.outerInterval = this.interval = undefined;
    this.prop = this.settings = undefined;
  }
}

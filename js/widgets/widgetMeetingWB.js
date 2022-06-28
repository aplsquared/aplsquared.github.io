class WidgetMeetingWB {
  constructor(prop) {
    this.settings = JSON.parse(prop.settings);
    this.showLogo = this.settings.logoOpt;
    this.meetingsFeed = {events:[]};
    this.maxH = parseInt(prop.h);
    this.eventStackArr = [];
    this.rotateTime = 12000;
    this.titleW = "w100";
    this.ssDirPath = "";
    this.qsParam = "";
    this.refreshTimer;
    this.rotateTimer;
    this.prop = prop;
    this.ssNum = 0;
    this.dateStr;
    this.num = 0;
    this.curVid;
    this.ssImg;
    this.ssVid;

    if(this.settings.rotationOpt == "c"){
      this.rotateTime = this.settings.rotate * 1000;
    }

    if(this.prop.type == "touchlinkmeetings"){
      this.ssDirPath = this.settings.feed.ss;
    }

    if(this.settings.isTime && this.settings.isRoom){
      this.titleW = "w65";
    }
    else if(this.settings.isTime && !this.settings.isRoom){
      this.titleW = "w85";
    }
    else if(!this.settings.isTime && this.settings.isRoom){
      this.titleW = "w80";
    }

    if(this.prop.dtype == "ae"){
      this.qsParam = "/all";
    }

    this.htmStr = '<div id="' + this.prop.type + '-' + this.prop.id + '" style="height:' + this.prop.h + 'px;"></div>';
    setTimeout(()=>{this.init()}, 200);
    return this.htmStr;
  }

  init(){
    this.loadMeetingFeed();
    this.refreshTimer = setInterval(()=>{this.loadMeetingFeed();}, 300000);
    //window.addTimer(this.refreshTimer, "i", this.prop.fid);
  }

  loadMeetingFeed(){
    $.get(apiPath + '/' + this.prop.type + '/' + this.prop.id.split("-")[2] + "/" + mac + this.qsParam + "?format=json&" + new Date().getTime(), (data)=>{
      this.meetingsFeed = data;
      $("#" + this.prop.type + '-' + this.prop.id).css({"background": ""}).empty();

      if(this.rotateTimer){
        clearInterval(this.rotateTimer);
        this.rotateTimer = null;
      }
      if(this.itemChangeTimer){
        clearTimeout(this.itemChangeTimer);
        this.itemChangeTimer = null;
      }

      if(this.meetingsFeed.events.length > 0){
        this.htmStr = "";
        $("#" + this.prop.type + '-' + this.prop.id).css({"background": window.hexToRgbA(this.settings.bg, this.settings.bga)});
        if(this.settings.header.active){
          this.htmStr = '<div id="header" class="d-flex" style="background:' + window.hexToRgbA(this.settings.headerBg, this.settings.headerBga) + ';color:' + this.settings.headerText + ';font-family:\''+ this.settings.headerFont.value +'\';font-size:' + this.settings.headerSize + 'px;font-weight:bold;"><div class="d-flex ' + this.titleW + ' pad10" style="overflow:hidden;">' + this.settings.header.column1 + '</div>';
          if(this.settings.isTime){
            this.htmStr += '<div class="d-flex w15 pad10 text-center" style="border-left:1px solid rgba(0, 0, 0, 0.1);border-right:1px solid rgba(0, 0, 0, 0.1);overflow:hidden;">' + this.settings.header.column2 + '</div>';
          }
          if(this.settings.isRoom){
            this.htmStr += '<div class="d-flex w20 pad10 text-center" style="overflow:hidden;">' + this.settings.header.column3 + '</div>';
          }
          this.htmStr += '</div>';
        }
        this.htmStr += '<style type="text/css">#' + this.prop.type + '-' + this.prop.id + ' #event-list{background:' + window.hexToRgbA(this.settings.bg, this.settings.bga) + '}#' + this.prop.type + '-' + this.prop.id + ' #event-list .event-item{background:' + window.hexToRgbA(this.settings.rowBg, this.settings.rowBga) + ';}#' + this.prop.type + '-' + this.prop.id + ' #event-list .event-item:nth-child(even){background:' + window.hexToRgbA(this.settings.altBg, this.settings.altBga) + ';}#' + this.prop.type + '-' + this.prop.id + ' #event-list  .event-item .title{color:' + this.settings.titleText + ';font-family:\''+ this.settings.titleFont.value +'\';font-size:' + this.settings.titleSize + 'px;font-weight:bold;overflow:hidden;}#' + this.prop.type + '-' + this.prop.id + ' #event-list .event-item .time{border-left:1px solid rgba(0, 0, 0, 0.1);border-right:1px solid rgba(0, 0, 0, 0.1);text-align:center;color:' + this.settings.timeText + ';font-family:\''+ this.settings.timeFont.value +'\';font-size:' + this.settings.timeSize + 'px;overflow:hidden;}#' + this.prop.type + '-' + this.prop.id + ' #event-list .event-item .room{text-align:center;color:' + this.settings.roomText + ';font-family:\''+ this.settings.roomFont.value +'\';font-size:' + this.settings.roomSize + 'px;overflow:hidden;}#' + this.prop.type + '-' + this.prop.id + ' #event-list .event-item:nth-child(even) .title{color:' + this.settings.altTitleText + ';}#' + this.prop.type + '-' + this.prop.id + ' #event-list .event-item:nth-child(even) .time{color:' + this.settings.altTimeText + ';}#' + this.prop.type + '-' + this.prop.id + ' #event-list .event-item:nth-child(even) .room{color:' + this.settings.altRoomText + ';}#' + this.prop.type + '-' + this.prop.id + ' #event-list .event-item .room-floor-container{posititon:relative;}#' + this.prop.type + '-' + this.prop.id + ' #event-list .event-item .room-floor-container .room-floor{text-align:center;}#' + this.prop.type + '-' + this.prop.id + ' #event-list .event-item .room-floor-container .room-floor:nth-child(1){animation-name:fade;animation-fill-mode:both;animation-iteration-count:infinite;animation-duration:5s;animation-direction:alternate-reverse;}#' + this.prop.type + '-' + this.prop.id + ' #event-list .event-item .room-floor-container .room-floor:nth-child(2){animation-name:fade;animation-fill-mode:both;animation-iteration-count:infinite;animation-duration:5s;animation-direction:alternate;}@keyframes fade{0%, 50%{visibility:hidden;} 100%{visibility:visible;}}</style>';
        this.htmStr += '<div id="event-list-container"></div>';
        $("#" + this.prop.type + '-' + this.prop.id).html(this.htmStr);
        if($("#" + this.prop.type + '-' + this.prop.id + " #header").length > 0){
          this.maxH = this.maxH - $("#" + this.prop.type + '-' + this.prop.id + " #header").outerHeight();
        }
        this.stackEventItems();
      }
      else{
        $("#" + this.prop.type + '-' + this.prop.id).css({"background": window.hexToRgbA(this.settings.ssbg, this.settings.ssbga)});
        if(this.meetingsFeed.ss.length > 0){
          this.ssNum = 0;
          this.loadSS();
        }
      }
    });
  }

  stackEventItems(){
    this.eventStackArr = [];
    this.curArr = [];
    $("#" + this.prop.type + '-' + this.prop.id + " #event-list-container").append('<div id="event-list"></div>');

    for(var i=0; i<this.meetingsFeed.events.length; i++){
      this.htmStr = '<div class="event-item d-flex"><div class="d-flex ' + this.titleW + ' title pad10" style="overflow:hidden;">';
      if(this.showLogo){
        this.htmStr += '<div style="float:left;width:70px;height:70px;padding:5px;line-height:70px;text-align:center;margin-right:10px;background:rgba(0,0,0,0.1);">';
        if(this.meetingsFeed.events[i].logosrc == undefined || this.meetingsFeed.events[i].logosrc == ""){
          this.htmStr += '<img src="./img/cal-na.png">';
        }
        else{
          this.htmStr += '<img src="' + timPath + this.ssDirPath + this.meetingsFeed.events[i].logosrc + '&h=70&w=70&zc=2">';
        }
        this.htmStr += '</div>';
      }
      this.htmStr += '<div>' + this.meetingsFeed.events[i].title;
      if(this.settings.mt && this.settings.mt.draType == "o"){
        if(this.meetingsFeed.events[i].startdate == this.meetingsFeed.events[i].enddate){
          this.dateStr = this.meetingsFeed.events[i].startdate;
        }
        else{
          this.dateStr = this.meetingsFeed.events[i].startdate + ' - ' + this.meetingsFeed.events[i].enddate;
        }
        this.htmStr += '<div class="time" style="text-align:left;border:0px;font-weight:normal;padding-top:10px;color:' + this.settings.timeText + ';font-family:\'' + this.settings.timeFont.value + '\';font-size:' + (this.settings.timeSize/ 1.5) + 'px;">' + this.dateStr + '</div>';
      }
      this.htmStr += '</div></div>';
      if(this.settings.isTime){
        this.htmStr += '<div class="d-flex flex-column w15 time pad10 text-bold"><div style="padding-bottom:10px;border-bottom:1px solid rgba(0, 0, 0, 0.1);overflow:hidden;">' + this.meetingsFeed.events[i].starttime.toLowerCase() + '</div><div style="padding-top:10px;overflow:hidden;">' + this.meetingsFeed.events[i].endtime.toLowerCase() + '</div></div>';
      }
      if(this.settings.isRoom){
        this.htmStr += '<div class="d-flex flex-column w20 pad10 room">';
        if(this.meetingsFeed.events[i].floor && this.meetingsFeed.events[i].floor != ""){
          this.htmStr += '<div class="room-floor-container"><div class="room-floor" style="position:absolute;width:20%;">' + this.meetingsFeed.events[i].floor + '</div><div class="room-floor">' + this.meetingsFeed.events[i].location + '</div></div>'
        }
        else{
          this.htmStr += '<div>' + this.meetingsFeed.events[i].location + '</div>';
        }
        this.htmStr += '</div>';
      }
      this.htmStr += '</div>';
      $("#" + this.prop.type + '-' + this.prop.id + " #event-list").append(this.htmStr);
      if($("#" + this.prop.type + '-' + this.prop.id + " #event-list").outerHeight() > this.maxH){
        if(this.curArr.length > 0){
          this.eventStackArr.push(this.curArr);
          this.curArr = [];
          this.curArr.push(i);
          $("#" + this.prop.type + '-' + this.prop.id + " #event-list-container").empty().append('<div id="event-list"></div>');
          $("#" + this.prop.type + '-' + this.prop.id + " #event-list").append(this.htmStr);
        }
        else{
          console.log("height is too low to accomodate even single event.");
        }
      }
      else{
        this.curArr.push(i);
      }
    }
    if(this.curArr.length > 0){
      this.eventStackArr.push(this.curArr);
    }
    if(this.eventStackArr.length > 1){
      $("#" + this.prop.type + '-' + this.prop.id + " #event-list-container").empty();
      this.listStyle = "opacity:0";
      this.htmStr = "";
      this.num = 0;
      if(this.prop.transition == "n"){
        this.listStyle = "display:none";
      }
      for(var i=0; i<this.eventStackArr.length; i++){
        if(i == 0){
          this.htmStr += '<div id="event-list" class="list-' + i + '" style="position:absolute;width:' + this.prop.w + 'px;">';
        }
        else{
          this.htmStr += '<div id="event-list" class="list-' + i + '" style="position:absolute;width:' + this.prop.w + 'px;' + this.listStyle + '">';
        }
        for(var j=0; j<this.eventStackArr[i].length; j++){
          this.htmStr += '<div class="event-item d-flex"><div class="d-flex ' + this.titleW + ' title pad10" style="overflow:hidden;">';
          if(this.showLogo){
            this.htmStr += '<div style="float:left;width:70px;height:70px;padding:5px;line-height:70px;text-align:center;margin-right:10px;background:rgba(0,0,0,0.1);">';
            if(this.meetingsFeed.events[this.eventStackArr[i][j]].logosrc == undefined || this.meetingsFeed.events[this.eventStackArr[i][j]].logosrc == ""){
              this.htmStr += '<img src="./img/cal-na.png">';
            }
            else{
              this.htmStr += '<img src="' + timPath + this.ssDirPath + this.meetingsFeed.events[this.eventStackArr[i][j]].logosrc + '&h=70&w=70&zc=2">';
            }
            this.htmStr += '</div>';
          }
          this.htmStr += '<div>' + this.meetingsFeed.events[this.eventStackArr[i][j]].title;
          if(this.settings.mt && this.settings.mt.draType == "o"){
            if(this.meetingsFeed.events[i].startdate == this.meetingsFeed.events[i].enddate){
              this.dateStr = this.meetingsFeed.events[i].startdate;
            }
            else{
              this.dateStr = this.meetingsFeed.events[i].startdate + ' - ' + this.meetingsFeed.events[i].enddate;
            }
            this.htmStr += '<div class="time" style="text-align:left;border:0px;font-weight:normal;padding-top:10px;font-family:\'' + this.settings.timeFont.value + '\';font-size:' + (this.settings.timeSize/ 1.5) + 'px;">' + this.dateStr + '</div>';
          }
          this.htmStr += '</div></div>';
          if(this.settings.isTime){
            this.htmStr += '<div class="d-flex flex-column w15 time pad10 text-bold"><div style="padding-bottom:10px;border-bottom:1px solid rgba(0, 0, 0, 0.1);overflow:hidden;">' + this.meetingsFeed.events[this.eventStackArr[i][j]].starttime.toLowerCase() + '</div><div style="padding-top:10px;overflow:hidden;">' + this.meetingsFeed.events[this.eventStackArr[i][j]].endtime.toLowerCase() + '</div></div>';
          }
          if(this.settings.isRoom){
            this.htmStr += '<div class="d-flex flex-column w20 pad10 room">';
            if(this.meetingsFeed.events[this.eventStackArr[i][j]].floor && this.meetingsFeed.events[this.eventStackArr[i][j]].floor != ""){
              this.htmStr += '<div class="room-floor-container"><div class="room-floor" style="position:absolute;width:20%;">' + this.meetingsFeed.events[this.eventStackArr[i][j]].floor + '</div><div class="room-floor">' + this.meetingsFeed.events[this.eventStackArr[i][j]].location + '</div></div>'
            }
            else{
              this.htmStr += '<div>' + this.meetingsFeed.events[this.eventStackArr[i][j]].location + '</div>';
            }
            this.htmStr += '</div>';
          }
          this.htmStr += '</div>';
        }
        this.htmStr += '</div>';
      }
      $("#" + this.prop.type + '-' + this.prop.id + " #event-list-container").append(this.htmStr);
      this.rotateTimer = setInterval(()=>{
        if(this.prop.transition == "f"){
          $("#" + this.prop.type + '-' + this.prop.id + " #event-list-container #event-list.list-" + this.num).css({"opacity":0});
        }
        else{
          $("#" + this.prop.type + '-' + this.prop.id + " #event-list-container #event-list.list-" + this.num).css({"display":"none"});
        }
        this.num++;
        if(this.num >= this.eventStackArr.length){
          this.num = 0;
        }
        if(this.prop.transition == "f"){
          TweenMax.to($("#" + this.prop.type + '-' + this.prop.id + " #event-list-container #event-list.list-" + this.num), 0.5, {opacity:1});
        }
        else{
          $("#" + this.prop.type + '-' + this.prop.id + " #event-list-container #event-list.list-" + this.num).css("display", "block");
        }
      }, this.rotateTime);
      //window.addTimer(this.rotateTimer, "i", this.prop.fid);
    }
  }

  loadSS(){
    this.fileExtArr = this.meetingsFeed.ss[this.ssNum].src.split(".");
		this.fileExt = this.fileExtArr[this.fileExtArr.length - 1];
    this.isLoaded = false;
    this.htmStr = '';
    $("#" + this.prop.type + '-' + this.prop.id).empty();

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
      if(this.prop.type == "touchlinkmeetings"){
        this.ssImg.src = this.ssDirPath + this.meetingsFeed.ss[this.ssNum].src;
        this.isLoaded = true;
      }
      else{
        if(fs.existsSync(resourcePath + '/resized/fit-' + this.meetingsFeed.ss[this.ssNum].src)){
          this.ssImg.src = resourcePath + '/resized/fit-' + this.meetingsFeed.ss[this.ssNum].src;
          this.isLoaded = true;
        }
      }
      $("#" + this.prop.type + '-' + this.prop.id).append(this.ssImg);
    }
    else if(this.fileExt == "mp4"){
      if(this.prop.type == "touchlinkmeetings"){
        this.htmStr = '<video id="' + this.prop.type + '-' + this.prop.id + '" width="' + this.prop.w + '" height="' + this.prop.h + '" loop autoplay><source src="' + this.ssDirPath + this.meetingsFeed.ss[this.ssNum].src + '" type="video/mp4"></video>';
        this.isLoaded = true;
      }
      else{
        if(fs.existsSync(resourcePath + '/media/' + this.meetingsFeed.ss[this.ssNum].src)){
          this.htmStr = '<video id="' + this.prop.type + '-' + this.prop.id + '" width="' + this.prop.w + '" height="' + this.prop.h + '" loop autoplay><source src="' + resourcePath + '/media/' + this.meetingsFeed.ss[this.ssNum].src + '" type="video/mp4"></video>';
          this.isLoaded = true;
        }
      }
      $("#" + this.prop.type + '-' + this.prop.id).append(this.htmStr);
      if(fsFrameId != ""){
        $("video#" + this.prop.type + '-' + this.prop.id).get(0).pause();
      }
    }

    if(this.meetingsFeed.ss.length > 1){
      if(this.isLoaded){
        this.itemChangeTimer = setTimeout(()=>{this.loadNextItemFx()}, this.meetingsFeed.ss[this.ssNum].d * 1000);
        //window.addTimer(this.itemChangeTimer, "t", this.prop.fid);
      }
      else{
        this.loadNextItemFx();
      }
    }
  }

  loadNextItemFx(){
    this.ssNum++;
    if(this.ssNum >= this.meetingsFeed.ss.length){
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

  removeFx(){
    if(this.itemChangeTimer){
      clearTimeout(this.itemChangeTimer);
    }
    if(this.rotateTimer){
      clearInterval(this.rotateTimer);
    }
    clearInterval(this.refreshTimer);

    this.titleW = this.ssDirPath = this.qsParam = this.dateStr = null;
    this.maxH = this.rotateTime = this.ssNum = this.num = null;
    this.itemChangeTimer = null;
    this.eventStackArr = null;
    this.meetingsFeed = null;
    this.refreshTimer = null;
    this.rotateTimer = null;
    this.settings = null;
    this.showLogo = null;
    this.curVid = null;
    this.ssImg = null;
    this.ssVid = null;
    this.prop = null;

    this.titleW = this.ssDirPath = this.qsParam = this.dateStr = undefined;
    this.maxH = this.rotateTime = this.ssNum = this.num = undefined;
    this.itemChangeTimer = undefined;
    this.eventStackArr = undefined;
    this.meetingsFeed = undefined;
    this.refreshTimer = undefined;
    this.rotateTimer = undefined;
    this.settings = undefined;
    this.showLogo = undefined;
    this.curVid = undefined;
    this.ssImg = undefined;
    this.ssVid = undefined;
    this.prop = undefined;
  }
}

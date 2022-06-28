class WidgetMeetingRB {
  constructor(prop) {
    this.settings = JSON.parse(prop.settings);
    this.meetingsFeed = {events:[]};
    this.itemChangeTimer;
    this.ssDirPath = "";
    this.prop = prop;
    this.ssNum = 0;
    this.dateStr;
    this.ssImg;
    this.ssVid;

    console.log(this.prop);

    if(this.prop.type == "touchlinkmeetings"){
      this.ssDirPath = this.settings.feed.ss;
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
    $.get(apiPath + '/' + this.prop.type + '/' + this.prop.id.split("-")[2] + "/" + mac + "?format=json&" + new Date().getTime(), (data)=>{
      this.meetingsFeed = data;
      $("#" + this.prop.type + '-' + this.prop.id).css({"background": ""}).empty();
      if(this.itemChangeTimer){
        clearTimeout(this.itemChangeTimer);
        this.itemChangeTimer = null;
      }
      if(this.meetingsFeed.event.id && this.meetingsFeed.event.id != 0){
        this.htmStr = "";
        $("#" + this.prop.type + '-' + this.prop.id).css({"background": window.hexToRgbA(this.settings.bg, this.settings.bga)});
        this.htmStr += '<div id="rbinfo" style="text-align:center;">';
        if(this.settings.logoOpt && this.meetingsFeed.event.logo != ""){
          this.htmStr += '<div style="height:110px;margin-bottom:20px;"><img src="' + this.ssDirPath + this.meetingsFeed.event.logo + '" style="border:5px solid #ccc"></div>';
        }
        this.htmStr += '<div style="color:' + this.settings.titleText + ';font-family:\'' + this.settings.titleFont.value + '\';font-size:' + this.settings.titleSize + 'px;margin-bottom:10px;">' + this.meetingsFeed.event.title + '</div>';
        if(this.meetingsFeed.event.subTitle && this.meetingsFeed.event.subTitle != ""){
          this.htmStr += '<div style="color:' + this.settings.subtitleText + ';font-family:\'' + this.settings.subtitleFont.value + '\';font-size:' + this.settings.subtitleSize + 'px;margin-bottom:10px;">' + this.meetingsFeed.event.subTitle + '</div>';
        }
        if((this.meetingsFeed.event.stos == undefined) || convertBoolean(this.meetingsFeed.event.stos)){
          this.htmStr += '<div style="color:' + this.settings.timeText + ';font-family:\'' + this.settings.timeFont.value + '\';font-size:' + this.settings.timeSize + 'px;">' + this.meetingsFeed.event.starttime + ' - ' + this.meetingsFeed.event.endtime + '</div>';
        }
        if(this.settings.mt && this.settings.mt.draType == "o"){
          if(this.meetingsFeed.event.startdate == this.meetingsFeed.event.enddate){
            this.dateStr = this.meetingsFeed.event.startdate;
          }
          else{
            this.dateStr = this.meetingsFeed.event.startdate + ' - ' + this.meetingsFeed.event.enddate;
          }
          this.htmStr += '<div style="padding-top:10px;color:' + this.settings.timeText + ';font-family:\'' + this.settings.timeFont.value + '\';font-size:' + (this.settings.timeSize/ 1.5) + 'px;">' + this.dateStr + '</div>';
        }
        this.htmStr += '</div>';
        $("#" + this.prop.type + '-' + this.prop.id).html(this.htmStr);
        $("#" + this.prop.type + '-' + this.prop.id + " #rbinfo").css({"padding-top": parseInt((this.prop.h - $("#" + this.prop.type + '-' + this.prop.id + " #rbinfo").outerHeight()) / 2)});
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

  loadSS(){
    this.fileExtArr = this.meetingsFeed.ss[this.ssNum].src.split(".");
		this.fileExt = this.fileExtArr[this.fileExtArr.length - 1];
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
      }
      else{
        if(fs.existsSync(resourcePath + '/resized/fit-' + this.meetingsFeed.ss[this.ssNum].src)){
          this.ssImg.src = resourcePath + '/resized/fit-' + this.meetingsFeed.ss[this.ssNum].src;
        }
      }
      $("#" + this.prop.type + '-' + this.prop.id).append(this.ssImg);
    }
    else if(this.fileExt == "mp4"){
      if(this.prop.type == "touchlinkmeetings"){
        this.htmStr = '<video id="' + this.prop.type + '-' + this.prop.id + '" width="' + this.prop.w + '" height="' + this.prop.h + '" loop autoplay><source src="' + this.ssDirPath + this.meetingsFeed.ss[this.ssNum].src + '" type="video/mp4"></video>';
      }
      else{
        this.htmStr = '<video id="' + this.prop.type + '-' + this.prop.id + '" width="' + this.prop.w + '" height="' + this.prop.h + '" loop autoplay><source src="' + resourcePath + '/media/' + this.meetingsFeed.ss[this.ssNum].src + '" type="video/mp4"></video>';
      }
      $("#" + this.prop.type + '-' + this.prop.id).append(this.htmStr);
      if(fsFrameId != ""){
        $("video#" + this.prop.type + '-' + this.prop.id).get(0).pause();
      }
    }

    if(this.meetingsFeed.ss.length > 1){
      this.itemChangeTimer = setTimeout(()=>{this.loadNextItemFx()}, this.meetingsFeed.ss[this.ssNum].d * 1000);
      //window.addTimer(this.itemChangeTimer, "t", this.prop.fid);
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
    clearInterval(this.refreshTimer);

    this.ssDirPath = this.dateStr = null;
    this.itemChangeTimer = null;
    this.meetingsFeed = null;
    this.refreshTimer = null;
    this.settings = null;
    this.ssNum = null;
    this.ssImg = null;
    this.ssVid = null;
    this.prop = null;

    this.ssDirPath = this.dateStr = undefined;
    this.itemChangeTimer = undefined;
    this.meetingsFeed = undefined;
    this.refreshTimer = undefined;
    this.settings = undefined;
    this.ssNum = undefined;
    this.ssImg = undefined;
    this.ssVid = undefined;
    this.prop = undefined;
  }
}

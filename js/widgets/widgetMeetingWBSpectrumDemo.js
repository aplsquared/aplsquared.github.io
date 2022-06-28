class WidgetMeetingWBSpectrumDemo {
  constructor(prop) {
    this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.settings = JSON.parse(prop.settings);
    this.showLogo = this.settings.logoOpt;
    this.meetingsFeed = {events:[]};
    this.maxH = parseInt(prop.h);
    this.curDate = new Date();
    this.eventStackArr = [];
    this.rotateTime = 12000;
    this.titleW = "w100";
    this.itemChangeTimer;
    this.ssDirPath = "";
    this.qsParam = "";
    this.refreshTimer;
    this.prop = prop;
    this.ssNum = 0;
    this.calHtmStr;
    this.dateStr;
    this.num = 0;
    this.curVid;
    this.ssImg;
    this.ssVid;
    this.mTemp;
    this.estH;
    this.estM;
    this.eetH;
    this.eetM;

    if(this.settings.rotationOpt == "c"){
      this.rotateTime = this.settings.rotate * 1000;
    }

    this.htmStr = '<div id="' + this.prop.type + '-' + this.prop.id + '" style="height:' + this.prop.h + 'px;width:' + this.prop.w + 'px;background:#ddd;">';
    this.htmStr += '<style type="text/css">#' + this.prop.type + '-' + this.prop.id + ' #calBgTable{color:#555;background:#caced2;}#' + this.prop.type + '-' + this.prop.id + ' #calBgTable td{border:1px solid #bec2c5;border-left:0;border-bottom:0;}#' + this.prop.type + '-' + this.prop.id + ' #calBgTable tr td:nth-child(even){border-right:0;}#' + this.prop.type + '-' + this.prop.id + ' #calBgTable td div:nth-child(odd){border-bottom:1px dashed #bec2c5;text-align:center;}</style>';
    this.htmStr += '<table width="100%" cellspacing="10" cellpadding="0" border="0"><tr><td valign="top"><div style="height:' + (this.prop.h - 100) + 'px;padding:40px;background:#002f56;"><div style="text-align:center;font-family:\'Myriad Pro Bold Condenced\';font-size:72px;color:#fff">North Tower 1A</div><div style="background:#f0f0f0;margin-top:100px;padding:40px;border-radius:4px;"><div id="curEvent" style="font-size:60px;text-align:center;color:#00325a;margin:50px 0;"></div><div id="curEventTime" style="text-align:center;color:#fff;font-weight:bold;font-size:42px;margin:50px;"></div></div><div style="position:absolute;bottom:50px;left:50px;"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="width:250px;text-align:left;"><img src="img/spectrum-next.png"></td><td><div id="nxtEvt" style="color:#f0f0f0;font-family:\'Segoe UI\';font-size:42px;"></div><div id="nxtEvtTime" style="color:#f0f0f0;font-family:\'Segoe UI\';font-size:28px;font-weight:bold;margin-top:5px;"></div></td></tr></table></div></div></td>';

    if(this.prop.template == "t1"){
      this.htmStr += '<td valign="top" style="width:450px;"><div style="height:60px;background:#0090cd;margin-bottom:1px;padding:15px;text-align:left;color:#fff;font-family:\'Myriad Pro Bold Condenced\';font-size:42px;"><div style="position:absolute;margin-top:10px;">' + this.months[this.curDate.getMonth()] + ' ' + this.curDate.getDate() + ', ' + this.curDate.getFullYear() +'</div></div><div id="calendar"><div id="calEventList"></div><table width="100%" cellpadding="0" cellspacing="0" border="0" id="calBgTable"><tr><td style="width:60px;"><div>00:00</div><div>&nbsp;</div></td><td><div>&nbsp;</div><div>&nbsp;</div></td></tr><tr><td><div>01:00</div><div>&nbsp;</div></td><td><div>&nbsp;</div><div>&nbsp;</div></td></tr><tr><td><div>02:00</div><div>&nbsp;</div></td><td><div>&nbsp;</div><div>&nbsp;</div></td></tr><tr><td><div>03:00</div><div>&nbsp;</div></td><td><div>&nbsp;</div><div>&nbsp;</div></td></tr><tr><td><div>04:00</div><div>&nbsp;</div></td><td><div>&nbsp;</div><div>&nbsp;</div></td></tr><tr><td><div>05:00</div><div>&nbsp;</div></td><td><div>&nbsp;</div><div>&nbsp;</div></td></tr><tr><td><div>06:00</div><div>&nbsp;</div></td><td><div>&nbsp;</div><div>&nbsp;</div></td></tr><tr><td><div>07:00</div><div>&nbsp;</div></td><td><div>&nbsp;</div><div>&nbsp;</div></td></tr><tr><td><div>08:00</div><div>&nbsp;</div></td><td><div>&nbsp;</div><div>&nbsp;</div></td></tr><tr><td><div>09:00</div><div>&nbsp;</div></td><td><div>&nbsp;</div><div>&nbsp;</div></td></tr><tr><td><div>10:00</div><div>&nbsp;</div></td><td><div>&nbsp;</div><div>&nbsp;</div></td></tr><tr><td><div>11:00</div><div>&nbsp;</div></td><td><div>&nbsp;</div><div>&nbsp;</div></td></tr><tr><td><div>12:00</div><div>&nbsp;</div></td><td><div>&nbsp;</div><div>&nbsp;</div></td></tr><tr><td><div>13:00</div><div>&nbsp;</div></td><td><div>&nbsp;</div><div>&nbsp;</div></td></tr><tr><td><div>14:00</div><div>&nbsp;</div></td><td><div>&nbsp;</div><div>&nbsp;</div></td></tr><tr><td><div>15:00</div><div>&nbsp;</div></td><td><div>&nbsp;</div><div>&nbsp;</div></td></tr><tr><td><div>16:00</div><div>&nbsp;</div></td><td><div>&nbsp;</div><div>&nbsp;</div></td></tr><tr><td><div>17:00</div><div>&nbsp;</div></td><td><div>&nbsp;</div><div>&nbsp;</div></td></tr><tr><td><div>18:00</div><div>&nbsp;</div></td><td><div>&nbsp;</div><div>&nbsp;</div></td></tr><tr><td><div>19:00</div><div>&nbsp;</div></td><td><div>&nbsp;</div><div>&nbsp;</div></td></tr><tr><td><div>20:00</div><div>&nbsp;</div></td><td><div>&nbsp;</div><div>&nbsp;</div></td></tr><tr><td><div>21:00</div><div>&nbsp;</div></td><td><div>&nbsp;</div><div>&nbsp;</div></td></tr><tr><td><div>22:00</div><div>&nbsp;</div></td><td><div>&nbsp;</div><div>&nbsp;</div></td></tr><tr><td><div>23:00</div><div>&nbsp;</div></td><td><div>&nbsp;</div><div>&nbsp;</div></td></tr></table></div></td>';
    }

    this.htmStr += '</tr></table></div>';
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
      if(this.meetingsFeed.events.length > 0){
        $("#" + this.prop.type + '-' + this.prop.id + " #curEvent").html(this.meetingsFeed.events[0].title);
        $("#" + this.prop.type + '-' + this.prop.id + " #curEventTime").html('<span style="background:#00325a;padding:5px 30px;border-radius:4px;">' + this.meetingsFeed.events[0].starttime + ' - ' + this.meetingsFeed.events[0].endtime + '</span>');

        $("#" + this.prop.type + '-' + this.prop.id + " #nxtEvt").html(this.meetingsFeed.events[1].title);
        $("#" + this.prop.type + '-' + this.prop.id + " #nxtEvtTime").html(this.meetingsFeed.events[1].starttime + ' - ' + this.meetingsFeed.events[1].endtime);

        if(this.prop.template == "t1"){
          if(this.meetingsFeed.events.length > 2){
            for(var i=2; i<this.meetingsFeed.events.length; i++){
              this.calHtmStr = "";
              this.estH = parseInt(this.meetingsFeed.events[i].starttime.split(":")[0]);
              if(this.meetingsFeed.events[i].starttime.split(" ")[1] == "PM"){
                this.estH += 12;
              }
              this.mTemp = parseInt(this.meetingsFeed.events[i].starttime.split(":")[1].split(" ")[0]);
              this.estM = this.mTemp/60;
              this.estH += this.estM;

              this.eetH = parseInt(this.meetingsFeed.events[i].endtime.split(":")[0]);
              if(this.meetingsFeed.events[i].endtime.split(" ")[1] == "PM"){
                this.eetH += 12;
              }
              this.mTemp = parseInt(this.meetingsFeed.events[i].endtime.split(":")[1].split(" ")[0]);
              this.eetM = this.mTemp/60;
              this.eetH += this.eetM;

              console.log(this.estH + " - " + this.eetH);

              this.calHtmStr = '<div style="background:rgba(41, 142, 226, 0.3);position:absolute;z-index:' + (100 + i) + ';margin-left:60px;margin-top:' + (40 * this.estH) + 'px;width:450px;border-bottom:1px solid #002f56;height:' + (40 * (this.eetH - this.estH)) + 'px"><div style="margin:5px;font-weight:bold;font-size:16px;">' + this.meetingsFeed.events[i].title + '</div></div>'
              $("#" + this.prop.type + '-' + this.prop.id + " #calEventList").append(this.calHtmStr);
            }
          }
        }

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
    if(this.rotateTimer){
      clearInterval(this.rotateTimer);
    }
    clearInterval(this.refreshTimer);

    this.mTemp = this.estH = this.estM = this.eetH = this.eetM = this.maxH = this.rotateTime = null;
    this.titleW = this.ssDirPath = this.qsParam = this.calHtmStr = this.dateStr = null;
    this.months = this.eventStackArr = null;
    this.maxH = this.rotateTime = null;
    this.ssNum = this.num = null;
    this.itemChangeTimer = null;
    this.refreshTimer = null;
    this.meetingsFeed = null;
    this.settings = null;
    this.showLogo = null;
    this.curDate = null;
    this.curVid = null;
    this.ssImg = null;
    this.ssVid = null;
    this.prop = null;

    this.mTemp = this.estH = this.estM = this.eetH = this.eetM = this.maxH = this.rotateTime = undefined;
    this.titleW = this.ssDirPath = this.qsParam = this.calHtmStr = this.dateStr = undefined;
    this.months = this.eventStackArr = undefined;
    this.ssNum = this.num = undefined;
    this.itemChangeTimer = undefined;
    this.refreshTimer = undefined;
    this.meetingsFeed = undefined;
    this.settings = undefined;
    this.showLogo = undefined;
    this.curDate = undefined;
    this.curVid = undefined;
    this.ssImg = undefined;
    this.ssVid = undefined;
    this.prop = undefined;
  }
}

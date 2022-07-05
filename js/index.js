/*Dev*/
// var storageHost = "https://dev2.lsquared.com";
// var apiPath = "https://dev2.lsquared.com/api/v1/feed";
// var environment = "LS-AZCARC-1001";
// var bucket = "/dev-lsquared-hub/";

/*RC*/
// var storageHost = "https://rc.lsquared.com";
// var apiPath = "https://rc.lsquared.com/api/v1/feed";
// var environment = "LS-AZCARC-1001";
// var bucket = "/rc-lsquared-hub/";

/*US*/
// var storageHost = "https://us.lsquared.com";
// var apiPath = "https://us.lsquared.com/api/v1/feed";
// var environment = "LS-AZUSUS-1001";
// var bucket = "/lsquared-hub/";

/*Hub*/
var storageHost = "https://hub.lsquared.com";
var apiPath = "https://hub.lsquared.com/api/v1/feed";
var environment = "LS-AWUSPRO-1001";
var bucket = "/lsquared-hub/";

var clientVersion = "2.0.15";

var tzname = "Eastern Standard Time";
var dateFormat = "mmddyyyy";
var tz = "America/Toronto";

var unusedFilesRemoved = false;
var tempActiveFrameList = "";
var isDownloading = false;
var downloadedFiles = "";
var reloadCanvas = false;
var isDuplicate = false;
var isRegPopup = false;
var restrictStartTime;
var defaultImage = "";
var resourcePath = "";
var isUsable = false;
var isReload = false;
var isReport = false;
var feedVersion = 0;
var restrictEndTime;
var fsFrameId = "";
var frameStr = "";
var apiEndpoint;
var deviceInfo;
var curNum = 0;
var did = "";
var curDate;
var offTime;
var onTime;
var fObj;
var fst;
var fet;
var st;
var et;

var activeFrameList = [];
var frameTimeArr = [];
var unusedFiles = [];
var downloadArr = [];
var mediaList = [];
var fTimerArr = [];
var fileList = [];
var frameArr = [];
var feed = {};

function readyToStart(){
  curDate = new Date();
// ip.address()
  deviceInfo = {mac:mac, app:clientVersion, os:4, client:4, res:screenW + "x" + screenH, computerName:"", local_addr:"", appStart:curDate.getTime(), info:{DiskTotal:"", DiskUsed:"", MemoryTotal:"", MemoryUsed:""}};
  deviceInfo = {mac:mac, app:clientVersion, os:4, client:4, res:screenW + "x" + screenH, appStart:curDate.getTime(), info:{}};
  // setTimeout(function(){loadLocalFeed();}, getNearestMinuteDiff());
  setTimeout(function(){getPlaylist(true)}, 2000);
  setTimeout(function(){setDeviceInfo()}, 20000);
  setInterval(function(){getPlaylist()}, 30000);
  setTimeout(function(){wakeLockFx()}, 2000);
  
}

function getPlaylist(init = false){
  updateToolbar("refresh", true);
  curDate = new Date();

  if(init){
    apiEndpoint = apiPath + "/deviceversion/" + mac + "/true?start=true&" + new Date().getTime();
  } else{
    apiEndpoint = apiPath + "/deviceversion/" + mac;
  }


  // logMsg("deviceversion: " + apiEndpoint);

  $.get(apiEndpoint, function(data){
    updateToolbar("refresh", false);
    setOnlineStatus(true);
    console.error("device status get sussecc");
    data = parseJSON(data);

    // logMsg("apiEndpoint: get true");

    if(data.code && data.code == 19008){
      if(!isRegPopup){
        registrationFx(true);
        showWaiting(true);
        removeFeed();
      }
    } else{
      if(isRegPopup){
        registrationFx(false);
        setDeviceInfo();
      }

      if(feedVersion != data.desc){
        if(!isDownloading){
          $.get(storageHost + bucket + "feed/json/" + mac + ".json?" + new Date().getTime(), function(data){
            feed = parseJSON(data);
            if(feed.device[0].version != feedVersion){
              writeFeed(feed);
              setVarsFromFeed();
              // checkDeviceProp();
              // checkDeviceFx();
              readMedia(true);
            }
          });
        }
      }
    }
  })
  .fail(function(){
    updateToolbar("refresh", false);
    setOnlineStatus(false);
    console.error("device status get fail");
    logMsg("apiEndpoint: get false");
    readIDBFeed();
  });
}

function setDeviceInfo(){
  getStorageFx();
  $.post(apiPath + "/setDeviceInfo", deviceInfo, function(data){})
  .fail(function(){
    setTimeout(function(){setDeviceInfo()}, 30000);
  });
}

function setOnlineStatus(status){
  if(status){
    $("#identify .status .value").text("Online");
    $("#identify .status .check").show();
  }
  else{
    $("#identify .status .value").text("Offline");
    $("#identify .status .check").hide();
  }
  console.error("setOnlineStatus ", !status);
  updateToolbar("offline", !status);
}

function generateDownloadableResourceArr(reload = false){
  reloadCanvas = reload;
  isDuplicate = false;
  downloadArr = [];
  mediaList = [];

  if(feed.downloadable && feed.downloadable.length > 0){
    for(var i=0; i<feed.downloadable.length; i++){
      isDuplicate = false;
      for(var j=0; j<mediaList.length; j++){
        if(feed.downloadable[i].name == mediaList[j].name){
          isDuplicate = true;
          break;
        }
      }
      if(!isDuplicate){
        mediaList.push(feed.downloadable[i]);
      }
    }
    if(mediaList.length > 0){
      for(var k=0; k<mediaList.length; k++){
        isFileExists = false;
        for(var i=0; i<downloadedMediaArr.length; i++){
          if(downloadedMediaArr[i].id == mediaList[k].id){
            isFileExists = true;
            break;
          }
        }
        if(!isFileExists){
          downloadArr.push({id:mediaList[k].id, type:mediaList[k].type, src:mediaList[k].src, fileName:mediaList[k].name, fileSize:mediaList[k].size, scale:mediaList[k].scale, w:mediaList[k].w, h:mediaList[k].h, d:mediaList[k].d});
        }
      }
      if(feed.device[0].feedRestriction != "false" && downloadArr.length > 0){
        curDate = new Date();
        restrictStartTime = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), feed.device[0].feedRestriction.split("-")[0].split(":")[0], feed.device[0].feedRestriction.split("-")[0].split(":")[1]);
        restrictEndTime = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), feed.device[0].feedRestriction.split("-")[1].split(":")[0], feed.device[0].feedRestriction.split("-")[1].split(":")[1]);

        for(var i=downloadArr.length-1; i>=0; i--){
          if(!convertBoolean(downloadArr[i].d)){
            if((restrictStartTime.getTime() < curDate.getTime()) && (restrictEndTime.getTime() > curDate.getTime())){
              // Do nothing - Keep the file in downloadable list
            } else{
              downloadArr.splice(i, 1);
            }
          }
        }
      }
      if(downloadArr.length > 0){
        updateToolbar("download", true);
        unusedFilesRemoved = false;
        isDownloading = true;
        downloadedFiles = "";
        curNum = 0;
        downloadFile();
      } else{
        // generatePlaylist();
        curMediaId = 0;
        getBlobURL();
      }
    } else{
      // generatePlaylist();
      curMediaId = 0;
      getBlobURL();
    }
  } else{
    console.warn("generateDownloadableResourceArr7777");
    generatePlaylist();
    curMediaId = 0;
    // getBlobURL();
  }
}


function downloadFile(){
  fetchFileFromNetwork(downloadArr[curNum]);
}

function downloadNext(){
  curNum++;
  if(curNum >= downloadArr.length){
    console.log("all files downloaded");
    updateToolbar("download", false);
    isDownloading = false;
    curNum = 0;
    readMediaAfterDownload();
    //generatePlaylist();
  } else{
    downloadFile();
  }
}

// function getStorageFx(){
//   if(navigator.storage && navigator.storage.estimate){
//     const quota = await navigator.storage.estimate();
//     // quota.usage -> Number of bytes used.
//     // quota.quota -> Maximum number of bytes available.
//     const percentageUsed = (quota.usage / quota.quota) * 100;
//     console.log(`You've used ${percentageUsed}% of the available storage.`);
//     logMsg(`You've used ${percentageUsed}% of the available storage.`);
//     const remaining = quota.quota - quota.usage;
//     console.log(`You can write up to ${remaining} more bytes.`);
//     logMsg(`You can write up to ${remaining} more bytes.`);

//   }
// }
// getStorageFx();

function generatePlaylist(){
  tempActiveFrameList = "";
  curDate = new Date();

  if(onTime != undefined && curDate.getTime() >= offTime && curDate.getTime() < onTime){
    activeFrameList = [];
    cleanEverything();
    showWaiting(false);
    $("#blank").html('<div style="background-color:#000;width:' + screenW + 'px;height:' + screenH + 'px;"></div>');
  } else{
    if(feed.layout && feed.layout[0].frame){
      $.each(feed.layout, function(index, layout){
        $.each(layout.frame, function(index, frame){
          fst = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), frame.st.split(" ")[1].split(":")[0], frame.st.split(" ")[1].split(":")[1], frame.st.split(" ")[1].split(":")[2]);
          fet = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), frame.et.split(" ")[1].split(":")[0], frame.et.split(" ")[1].split(":")[1], frame.et.split(" ")[1].split(":")[2]);
          if((fst.getTime() < curDate.getTime()) && (fet.getTime() > curDate.getTime())){
            frame.active = true;
            tempActiveFrameList += frame.sort + "|";

            $.each(frame.item, function(index, item){
              if(item.type == "image" || item.type == "video" || item.type == "audio" || item.type == "vector" || item.type == "word" || item.type == "powerpoint" || item.type == "qrCode"){
                isFileExists = false;
                for(var i=0; i<downloadedMediaArr.length; i++){
                  if(downloadedMediaArr[i].id == item.id){
                    isFileExists = true;
                    break;
                  }
                }
                if(!isFileExists){
                  item.active = false;
                } else{
                  item.active = true;
                }
              } else if(item.type == "calendarOfEvents" || item.type == "googleCalendar" || item.type == "outlookCalendar" || item.type == "meeting" || item.type == "openHour" || item.type == "quote" || item.type == "fillerContent" || item.type == "template" || item.type == "f45"){
                item.active = true;
                $.each(item.content, function(index, content){
                  if(content.type == "image" || content.type == "video" || content.type == "audio" || content.type == "vector" || content.type == "word" || content.type == "powerpoint" || content.type == "qrCode" || item.type == "template"){
                    isFileExists = false;
                    for(var i=0; i<downloadedMediaArr.length; i++){
                      if(downloadedMediaArr[i].id == content.id){
                        isFileExists = true;
                        break;
                      }
                    }
                    if(!isFileExists){
                      item.active = false;
                    } else{
                      item.active = true;
                    }
                  } else{
                    content.active = true;
                  }
                });
              } else{
                item.active = true;
              }
            });
          } else{
            frame.active = false;
          }
        });
      });

      if((tempActiveFrameList != activeFrameList) || reloadCanvas){
        activeFrameList = tempActiveFrameList;
        reloadCanvas = false;
        cleanEverything();

        if(feed.device && convertBoolean(feed.device[0].blank)){
          showWaiting(false);
          $("#blank").html('<div style="background-color:#000;width:' + screenW + 'px;height:' + screenH + 'px;"></div>');
        } else{
          if(activeFrameList.length > 0){
            showWaiting(false);
            redraw();
          } else{
            showWaiting(true);
          }
        }
      }
    } else{
      // defaultImage = feed.device[0].defaultImageName;
      if(feed.device && convertBoolean(feed.device[0].blank)){
        activeFrameList = [];
        showWaiting(false);
        $("#blank").html('<div style="background-color:#000;width:' + screenW + 'px;height:' + screenH + 'px;"></div>');
      } else{
        redraw();
        activeFrameList = [];
        cleanEverything();
        showWaiting(true);
      }
    }
  }

  if(!unusedFilesRemoved){
    console.log("remove unused");
    removeUnusedResources();
  }
  if(feed.device[0].odss == "true"){
    //saveScreenshot("od");
  }
}

function removeUnusedResources(){
  unusedFiles = [];
  fileList = [];
  for(var i=0; i<downloadedMediaArr.length; i++){
    isUsable = false;
    for(var j=0; j<mediaList.length; j++){
      if(downloadedMediaArr[i].id == mediaList[j].id){
        isUsable = true;
        break;
      }
    }
    if(!isUsable){
      unusedFiles.push(downloadedMediaArr[i].id);
    }
  }
  if(unusedFiles.length > 0){
    for(var i=0; i<unusedFiles.length; i++){
      removeMedia(unusedFiles[i])
    }
  }
  unusedFilesRemoved = true;
  //content confirmation
}

function redraw(){
  console.log("redraw");
  getScreenSize();

  if(frameArr.length > 0){
    for(var i=0; i<frameArr.length; i++){
      frameArr[i].unloadContent();
      frameArr[i] = null;
      frameArr[i] = undefined;
    }
  }

  defaultImage = feed.device[0].defaultImageName;
  curDate = new Date();
  activeFrameArr = [];
  clearAllTimers();
  frameArr = [];
  fsFrameId = "";
  frameStr = "";
  $("#fs").empty();

  if(feed.layout){
    $("#container").html('<div id="fl" style="background-color:' + feed.layout[0].bg + ';width:' + feed.layout[0].w + 'px;height:' + feed.layout[0].h + 'px;"></div>');

    $.each(feed.layout[0].frame, function(index, item){
      frameTimeArr = item.st.split(" ")[1].split(":");
      st = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), frameTimeArr[0], frameTimeArr[1], frameTimeArr[2]);

      frameTimeArr = item.et.split(" ")[1].split(":");
      et = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), frameTimeArr[0], frameTimeArr[1], frameTimeArr[2]);

      if((st.getTime() < curDate.getTime()) && (et.getTime() > curDate.getTime())){
        fObj = {id:item.sort, a:item.align, w:item.w, h:item.h, x:item.x, y:item.y, z:item.z, bg:item.bg, bga:item.bga, transition:feed.device[0].transition, tz:feed.device[0].timeZone, items:item.item};
        var frame = new Frame(fObj);
        fTimerArr.push({id:item.sort, timers:[]});
        frameArr.push(frame);
        // frameStr += '<div id="' + item.sort + '" class="frame" data-slide-id="' + new Date().getTime() + '" style="width:' + item.w + 'px;height:' + item.h + 'px;left:' + item.x + 'px;top:' + item.y + 'px;z-index:' + item.z + ';background-color:' + item.bg + ';"></div>';
        $("#fl").append(frame.htmStr);//frameStr += frame.htmStr;
      }
    });
  }
  setTimeout(()=>{checkBlankContainer();}, 500);
}

function checkBlankContainer(){
  if($("#fl").children().length == 0 && $("#fs").children().length == 0 && $("#f45").children().length == 0){
    cleanEverything();
    showWaiting(true);
  }
}

function cleanEverything(){
  $('div[id^="container-1-"]').remove();
  $('div[id^="container-2-"]').remove();
  $("#container").empty();
  $(".frame").remove();
  $("#blank").empty();
  $("#fl").remove();
  $("#fs").empty();
  $("#em").empty();
  clearAllTimers();
  fsFrameId = "";
}


function setVarsFromFeed(){
  // if(feed.device[0].weboss && feed.device[0].weboss != ""){
  //   weboss = JSON.parse(feed.device[0].weboss);
  //   if(weboss.gs.as.tvt){
  //     for(var i=0; i<weboss.gs.as.days.length; i++){
  //       if(weboss.gs.as.days[i].label == curDate.getDay()){
  //         offTime = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), weboss.gs.as.days[i].et.split(":")[0], weboss.gs.as.days[i].et.split(":")[1]);
  //         onTime = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), weboss.gs.as.days[i].st.split(":")[0], weboss.gs.as.days[i].st.split(":")[1]);
  //       }
  //     }
  //   }
  // }

  isReport = convertBoolean(feed.device[0].reports);
  feedVersion = feed.device[0].version;
  tzname = feed.device[0].tzname;
  tz = feed.device[0].timeZone;
  did = feed.device[0].id;
}


function registrationFx(caller){
  isRegPopup = caller;
  if(caller){
    $('#dialog button').prop('disabled', false);
    $('#dialog .err-quad').hide();
    $("#logoBottom").show();
    activeFrameList = [];
    $("#mac").html(mac);
    $("#dialog").show();
    defaultImage = "";
    showWaiting(false);
    cleanEverything();
  } else{
    $("#container").show();
    $("#blank").empty();
    $("#dialog").hide();
    showWaiting(true);
  }
}


function showWaiting(show){
  // console.warn("showWaiting - ", show);
  if(show){
    isWaiting = true;
    // if(defaultImage != ""){
    //   if(fs.existsSync(resourcePath + "/media/"+ defaultImage)){
    //     $("#logoBottom").hide();
    //     $("#waiting").hide();
    //    $("#container").html('<div id="fl" style="background-color:#000;height:' + screenH + 'px;position:relative;line-height:' + screenH + 'px;"><img src="' + resourcePath + '/resized/fit-' + defaultImage + '" style="position:absolute;display:block;max-width:100%;max-height:100%;margin:auto;vertical-align:middle;width:auto;height:auto;top: 0;bottom: 0;left: 0;right: 0;"></div>');
    //   }
    //   else{
    //     $("#logoBottom").show();
    //     $("#waiting").show();
    //     waitingTxtFx();
    //   }
    // }
    // else{
      $("#logoBottom").show();
      $("#waiting").show();
      waitingTxtFx();
    // }
  } else{
    isWaiting = false;
    $("#waiting").hide();
    if($("#dialog").is(":hidden")){
      $("#logoBottom").hide();
    }
  }
}



function clearAllTimers(){
  for(var i=0; i<fTimerArr.length; i++){
    for(var j=0; j<fTimerArr[i].timers.length; j++){
      if(fTimerArr[i].timers[j].type == "i"){
        window.clearInterval(fTimerArr[i].timers[j].timer);
        fTimerArr[i].timers[j].timer = null;
      } else{
        window.clearTimeout(fTimerArr[i].timers[j].timer);
        fTimerArr[i].timers[j].timer = null;
      }
    }
    fTimerArr[i].timers = [];
  }
  fTimerArr = [];
}

function clearTimer(fid, origin){
  for(var i=0; i<fTimerArr.length; i++){
    if(fTimerArr[i].id == fid){
      for(var j=0; j<fTimerArr[i].timers.length; j++){
        if(origin){
          if(fTimerArr[i].timers[j].origin == origin){
            if(fTimerArr[i].timers[j].type == "i"){
              window.clearInterval(fTimerArr[i].timers[j].timer);
              fTimerArr[i].timers[j].timer = null;
            } else{
              window.clearTimeout(fTimerArr[i].timers[j].timer);
              fTimerArr[i].timers[j].timer = null;
            }
          }
        } else{
          if(fTimerArr[i].timers[j].type == "i"){
            window.clearInterval(fTimerArr[i].timers[j].timer);
            fTimerArr[i].timers[j].timer = null;
          } else{
            window.clearTimeout(fTimerArr[i].timers[j].timer);
            fTimerArr[i].timers[j].timer = null;
          }
        }
      }
      fTimerArr[i].timers = [];
    }
  }
}

function addTimer(timer, type, id, origin="other", timerObj = null){
  for(var i=0; i<fTimerArr.length; i++){
    if(fTimerArr[i].id == id){
      fTimerArr[i].timers.push({timer:timer, type:type, origin:origin, timerObj:timerObj});
      break;
    }
  }
}

var Timer = function(callback, delay){
  this.timerId;
  this.start;
  this.remaining = delay;
  this.pause = function(id){
    window.clearTimeout(this.timerId);
    this.remaining -= Date.now() - this.start;
  };
  this.resume = function(id){
    this.start = Date.now();
    window.clearTimeout(this.timerId);
    this.timerId = window.setTimeout(callback, this.remaining);
  };
  this.clear = function(){
    window.clearTimeout(this.timerId);
  };
  this.resume();
};

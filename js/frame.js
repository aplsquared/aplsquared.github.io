class Frame{
  constructor(prop){
    this.prop = prop;
    this.htmStr = '<div id="' + this.prop.id + '" class="frame" style="width:' + this.prop.w + 'px;height:' + this.prop.h + 'px;left:' + this.prop.x + 'px;top:' + this.prop.y + 'px;z-index:' + this.prop.z + ';background:' + this.hexToRgbA(this.prop.bg, this.prop.bga) + '"><div id="' + this.prop.id + "-c1" + '" class="container"></div><div  id="' + this.prop.id + "-c2" + '" class="container"></div></div>';
    this.id = parseInt(this.prop.id.split("-")[0]);
    this.itemChangeTimer = null;
    this.isCurObjUpdate = false;
    this.freeMcId = "";
    this.curMcId = "";
    this.itemArr = [];
    this.isFs = false;
    this.f45Content;
    this.f45Adverts;
    this.f45LongBeep;
    this.curItemId;
    this.countBeep;
    this.curItem;
    this.f45Beep;
    this.num = 0;
    this.itemObj;
    this.curDate;
    this.freeMc;
    this.curMc;

    if(this.prop.items && this.prop.items.length > 0){
      this.generateItemArr(this.itemArr);
    }

    return this.htmStr;
  }

  generateItemArr(itemArr){
    $.each(this.prop.items, (index, item)=>{
      if(item.active){
        item.type = item.type.toLowerCase();
        // itemArr.push(item);
        if(item.type.toLowerCase() == "audio"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), src:item.fileName, sound:item.sound, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "agc"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), src:item.src, wc:item.wc.toLowerCase(), settings:item.settings, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "animation"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), src:item.svg, settings:item.settings, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "blank" || item.type.toLowerCase() == "blankprefix" || item.type.toLowerCase() == "blanksuffix"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "count"){
          // this.countBeep = false;
          // for(var j=0; j<deviceProp.length; j++){
          //   if(deviceProp[j].label == "Beep"){
          //     if(typeof deviceProp[j].value === "string"){
          //       this.countBeep = convertBoolean(deviceProp[j].value);
          //     }
          //     else{
          //       this.countBeep = deviceProp[j].value;
          //     }
          //     break;
          //   }
          // }
          // itemArr.push({id:item.id, type:item.type.toLowerCase(), filename:item.type.toLowerCase(), dtype:item.dType, beep:this.countBeep, settings:item.settings, duration:item.duration * 1000});
          itemArr.push({id:item.id, type:item.type.toLowerCase(), filename:item.type.toLowerCase(), dtype:item.dType, settings:item.settings, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "schedulecalendar" || item.type.toLowerCase() == "calendarofeventsview"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), filename:item.type.toLowerCase(), dtype:item.dType, settings:item.settings, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "crawlingtext" || item.type.toLowerCase() == "text"){
          if(!item.id){
            item.id = this.prop.id + "-" + this.prop.label;
          }
          itemArr.push({id:item.id, type:item.type.toLowerCase(), filename:item.type.toLowerCase(), dtype:item.dType, txt:item.txt, settings:item.settings, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "csvchart" || item.type.toLowerCase() == "currency" || item.type.toLowerCase() == "fifa" || item.type.toLowerCase() == "fschrome" || item.type.toLowerCase() == "template"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), src:item.src, duration:item.duration * 1000});
        }
        // else if(item.type.toLowerCase() == "calendarofevents"){
        //   itemArr.push({id:item.id, type:item.type.toLowerCase(), title:item.title, calendarId:item.calendarId, timezone:item.timeZone, font:item.font, titleColor:item.titleTextColor,
        //   listItemBgColor:item.listItemBgColor, settings:item.settings, src:item.src, listItemTextColor:item.listItemTextColor, duration:item.duration * 1000});
        // }
        else if(item.type.toLowerCase() == "date-time"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), src:item.src, settings:item.settings, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "excelsheet"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), src:item.src, settings:item.settings, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "f45"){
          // this.f45Content = [];
          // this.f45Adverts = [];
          // if(item.content){
          //   for(var i=0; i<item.content.length; i++){
          //     if(item.content[i].screenid == screenId){
          //       this.f45Content.push(item.content[i]);
          //     }
          //   }
          // }
          // if(item.advt){
          //   for(var i=0; i<item.advt.length; i++){
          //     this.f45Adverts.push(item.advt[i]);
          //   }
          // }
          // this.f45LongBeep = false;
          // this.f45Beep = false;
          // for(var j=0; j<deviceProp.length; j++){
          //   if(deviceProp[j].label == "Beep"){
          //     if(typeof deviceProp[j].value === "string"){
          //       this.f45Beep = convertBoolean(deviceProp[j].value);
          //     }
          //     else{
          //       this.f45Beep = deviceProp[j].value;
          //     }
          //   }
          //   else if(deviceProp[j].label == "Long Beep"){
          //     if(typeof deviceProp[j].value === "string"){
          //       this.f45LongBeep = convertBoolean(deviceProp[j].value);
          //     }
          //     else{
          //       this.f45LongBeep = deviceProp[j].value;
          //     }
          //   }
          // }

          itemArr.push({id:item.id, type:item.type.toLowerCase(), content:this.f45Content, adverts:this.f45Adverts, beep:this.f45Beep, longBeep:this.f45LongBeep, settings:item.settings, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "f45countdowncircle" || item.type.toLowerCase() == "countdowncircle"){
          if(!item.id){
            item.id = this.prop.id + "-" + this.prop.label;
          }
          itemArr.push({id:item.id, type:"f45countdowncircle", settings:item.settings, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "f45contentscroller" || item.type.toLowerCase() == "contentscroller"){
          if(!item.id){
            console.log("no item id");
            item.id = this.prop.id + "-" + this.prop.label;
          }
          itemArr.push({id:item.id, type:"f45contentscroller", content:item.content, settings:item.settings, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "f45contenttile" || item.type.toLowerCase() == "contenttile"){
          if(!item.id){
            console.log("no item id");
            item.id = this.prop.id + "-" + this.prop.label;
          }
          itemArr.push({id:item.id, type:"f45contenttile", content:item.content, settings:item.settings, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "f45hydrate" || item.type.toLowerCase() == "hydrate"){
          if(!item.id){
            console.log("no item id");
            item.id = this.prop.id + "-" + this.prop.label;
          }
          itemArr.push({id:item.id, type:"f45hydrate", settings:item.settings, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "f45movestation" || item.type.toLowerCase() == "movestation"){
          if(!item.id){
            console.log("no item id");
            item.id = this.prop.id + "-" + this.prop.label;
          }
          itemArr.push({id:item.id, type:"f45movestation", settings:item.settings, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "f45progressbar" || item.type.toLowerCase() == "progressbar"){
          if(!item.id){
            console.log("no item id");
            item.id = this.prop.id + "-" + this.prop.label;
          }
          itemArr.push({id:item.id, type:"f45progressbar", settings:item.settings, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "f45progressbarwithbreak" || item.type.toLowerCase() == "progressbarwithbreak"){
          if(!item.id){
            console.log("no item id");
            item.id = this.prop.id + "-" + this.prop.label;
          }
          itemArr.push({id:item.id, type:"f45progressbarwithbreak", items:item.list, settings:item.settings, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "f45stay" || item.type.toLowerCase() == "stay"){
          if(!item.id){
            console.log("no item id");
            item.id = this.prop.id + "-" + this.prop.label;
          }
          itemArr.push({id:item.id, type:"f45stay", settings:item.settings, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "f45work" || item.type.toLowerCase() == "work"){
          if(!item.id){
            console.log("no item id");
            item.id = this.prop.id + "-" + this.prop.label;
          }
          itemArr.push({id:item.id, type:"f45work", settings:item.settings, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "facebook" || item.type.toLowerCase() == "fbworkplace" || item.type.toLowerCase() == "linkedin"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), src:item.src, filename:urlToStr(item.src), dtype:item.dType, settings:item.settings, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "fillercontent"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), content:item.content, src:item.active == "1", sound:item.sound, settings:item.settings, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "flight"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), src:item.src, airportName:item.fileName, dtype:item.dType, settings:item.settings, duration:item.duration * 1000});
        }
        /*else if(item.type.toLowerCase() == "googlecalendar"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), title:item.title, calendarId:item.calendarId, timezone:item.timeZone, font:item.font, titleColor:item.titleTextColor,
          listItemBgColor:item.listItemBgColor, listItemTextColor:item.listItemTextColor, duration:item.duration * 1000});
        }*/
        else if(item.type.toLowerCase() == "googleslide"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), src:item.src, settings:item.settings, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "imagesrc"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), src:item.src, duration:12000});
        }
        else if(item.type.toLowerCase() == "instagram"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), filename:urlToStr(item.src), dtype:item.dType, settings:item.settings, sound:item.sound, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "iotbutton"){
          var iotBg = "";
          var iotCommonAudio = "";
          if(item.content){
            iotBg = item.content[0].fileName;
          }

          if(item.sound){
            iotCommonAudio = item.sound[0].fileName;
          }
          itemArr.push({id:item.id, type:item.type.toLowerCase(), cred:item.ep, iotbg:iotBg, cmAudio:iotCommonAudio, list:item.list, ss:item.ss, settings:item.settings, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "livestream"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), src:item.url, dtype:item.dType, mute:item.mute, cl:item.cl, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "imenu" || item.type.toLowerCase() == "quote" || item.type.toLowerCase() == "traffic"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), settings:item.settings, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "meeting" || item.type.toLowerCase() == "calendarofevents"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), dtype:item.dType.toLowerCase(), src:item.src, settings:item.settings, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "message"){
          var msgData = {};
          var msgImg = "";
          if(item.data != ""){
            msgData = JSON.parse(item.data);
            if(msgData.contentid != 0){
              for(var i=0; i<feed.downloadable.length; i++){
                if(feed.downloadable[i].id.split("-")[2] == msgData.contentid){
                  msgImg = feed.downloadable[i].name;
                }
              }
            }
          }
          itemArr.push({id:item.id, type:item.type.toLowerCase(), title:msgData.title, desc:msgData.desc, img:msgImg, settings:item.settings, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "msteams"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), src:item.src, settings:item.settings, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "news"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), dtype:item.dType.toLowerCase(), filename:urlToStr(item.fileName), provider:item.fileName, src:item.src, settings:item.settings, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "nextvehicle"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "openhour"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), lang:item.lang, img:item.fileName, settings:item.settings, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "outlookcalendar" || item.type.toLowerCase() == "googlecalendar"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), dtype:item.dType.toLowerCase(), template:item.template, settings:item.settings, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "patientwait"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), src:item.src, dtype:item.dType, settings:item.settings, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "powerbi"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "qrcode"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), src:item.fileName, scale:item.scale, fs:"no", duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "queue"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), src:item.src, dtype:item.dType.toLowerCase(), settings:item.settings, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "radio"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), src:item.src, volume:item.volume, sound:item.sound, mute:item.mute, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "rss"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), dtype:item.dType.toLowerCase(), filename:urlToStr(item.src), provider:item.fileName, src:item.src, settings:item.settings, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "slack"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "stock"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), dtype:item.dType.toLowerCase(), src:item.src, settings:item.settings, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "telax"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), duration:item.duration * 1000, src:item.src, color:item.color, dtype:item.dType});
        }
        else if(item.type.toLowerCase() == "twitter"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), filename:item.src, settings:item.settings, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "ungerboeck" || item.type.toLowerCase() == "readerboard" || item.type.toLowerCase() == "touchlinkmeetings"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), dtype:item.dType, settings:item.settings, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "unisys"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), src:item.src, location:item.location, settings:item.settings, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "video" || item.type.toLowerCase() == "f45video"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), src:item.fileName, ccn:item.ccn, ccp:item.ccp, ccs:item.ccs, ccv:item.ccv, mute:item.mute, duration:item.duration * 1000, settings:item.settings, fs:item.fs, scale:item.scale});
        }
        else if(item.type.toLowerCase() == "vimeo"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), sound:item.sound, src:item.src, duration:item.duration * 1000, fs:item.fs});
        }
        else if(item.type.toLowerCase() == "web" || item.type.toLowerCase() == "webpage"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), src:item.src, fileName:item.fileName, settings:item.settings, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "webcam"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), settings:item.settings, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "sunsmart" || item.type.toLowerCase() == "webwidget"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), src:item.src, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "weblogin"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), src:item.src, settings:item.settings, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "weather"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), woeid:item.src, forecast:item.forecast, settings:item.settings, duration:item.duration * 1000});
        }
        else if(item.type.toLowerCase() == "youtube"){
          itemArr.push({id:item.id, type:item.type.toLowerCase(), src:item.src, sound:item.sound, params:item.params, settings:item.settings, duration:item.duration * 1000});
        }
        else {
          itemArr.push({id:item.id, type:item.type.toLowerCase(), src:item.fileName, duration:item.duration * 1000, fileSize:0, fs:item.fs, scale:item.scale});
        }
      }
  });
    if(itemArr.length > 0){
      setTimeout(()=>{this.init()}, 200);
    }
  }

  init(){
    this.freeMcId = this.prop.id + "-c1";
    this.curMcId = this.prop.id + "-c2";
    this.freeMc = $("#" + this.freeMcId);
    this.curMc = $("#" + this.curMcId);

    if(this.prop.transition == "f"){
      this.freeMc.css("opacity", 0);
      this.curMc.css("opacity", 0);
    }
    else{
      this.freeMc.css("visibility", "hidden");
      this.curMc.css("visibility", "hidden");
    }
    this.startDisplay();

    if(this.itemArr.length > 1 || isReport){
      //this.itemChangeTimer = setTimeout(()=>{this.loadNextItemFx()}, this.itemArr[this.num].duration);
      this.itemChangeTimer = new Timer(()=>{this.loadNextItemFx()}, this.itemArr[this.num].duration);
      window.addTimer(this.itemChangeTimer.timerId, "t", this.prop.id, "frame", this.itemChangeTimer);
    }
  }

  loadNextItemFx(){
    if(isReport){
      this.curDate = new Date();
      if(this.itemArr[this.num].id){
        // TODO write PoP report
      }
    }

    if(this.itemArr.length > 1){
      this.curItem.removeFx();
      this.num += 1;
      if(this.num >= this.itemArr.length){
        this.num = 0;
      }
      window.clearTimer(this.prop.id);
      try{
        window.webFrame.clearCache();
      }
      catch(e){}
      this.startDisplay();
    }

    if(this.itemArr.length > 1 || isReport){
      if(this.itemChangeTimer){
        window.clearTimer(this.prop.id, "frame");
        this.itemChangeTimer = null;
      }
      this.itemChangeTimer = new Timer(()=>{this.loadNextItemFx()}, this.itemArr[this.num].duration);
      window.addTimer(this.itemChangeTimer.timerId, "t", this.prop.id, "frame", this.itemChangeTimer);
    }
  }

  unloadContent(){
    if(this.curItem){
      this.curItem.removeFx();
    }

    this.htmStr = this.freeMcId = this.curMcId = this.curItemId = this.id = null;
    this.isCurObjUpdate = this.isFs = this.countBeep = null;
    this.itemChangeTimer = null;
    this.itemArr = null;
    this.curItem = null;
    this.itemObj = null;
    this.curDate = null;
    this.freeMc = null;
    this.curMc = null;
    this.prop = null;
    this.num = null;

    this.f45LongBeep = null;
    this.f45Content = null;
    this.f45Adverts = null;
    this.f45Beep = null;

    this.htmStr = this.freeMcId = this.curMcId = this.curItemId = this.id = undefined;
    this.isCurObjUpdate = this.isFs = this.countBeep = undefined;
    this.itemChangeTimer = undefined;
    this.curItem = undefined;
    this.itemArr = undefined;
    this.itemObj = undefined;
    this.curDate = undefined;
    this.freeMc = undefined;
    this.curMc = undefined;
    this.prop = undefined;
    this.num = undefined;

    this.f45LongBeep = undefined;
    this.f45Content = undefined;
    this.f45Adverts = undefined;
    this.f45Beep = undefined;
  }

  startDisplay(){
    this.curItemId = this.itemArr[this.num].id;
    this.itemObj = this.itemArr[this.num];
    this.itemObj.transition = this.prop.transition;
    this.itemObj.fid = this.prop.id;
    this.itemObj.tz = this.prop.tz;
    this.itemObj.bg = this.prop.bg;
    this.itemObj.a = this.prop.a;
    this.itemObj.w = this.prop.w;
    this.itemObj.h = this.prop.h;

    if(this.itemArr[this.num].fs == "yes"){
      this.isFs = true;
      this.transition();
      var fs = new FullScreen(this.itemArr[this.num], this.itemArr.length, this.itemObj.fid);
      $("#fs").empty();
      $("#fs").append(fs.htmStr);
    }
    else{
      if(fsFrameId == this.itemObj.fid){
        console.log("fs - clear timer 1");
        window.clearTimer(this.itemObj.fid);
        $("#fs").empty();
        window.fsPlay();
      }
      this.isFs = false;
      if(this.itemArr[this.num].type == "image" || this.itemArr[this.num].type == "vector" || this.itemArr[this.num].type == "powerpoint" || this.itemArr[this.num].type == "qrcode" || this.itemArr[this.num].type == "word" || this.itemArr[this.num].type == "survey"){
        var img = new ImgLoader(this.itemObj);
        this.freeMc.append(img.htmStr);
        this.curItem =img;
      }
      if(this.itemArr[this.num].type == "f45image"){
        var img = new ImgLoader(this.itemObj, false, false, true);
        this.freeMc.append(img.htmStr);
        this.curItem = img;
      }
      else if(this.itemArr[this.num].type == "audio"){
        var audio = new AudioLoader(this.itemObj);
        this.freeMc.append(audio);
        this.curItem = audio;
      }
      else if(this.itemArr[this.num].type == "blank" || this.itemArr[this.num].type == "blankprefix" || this.itemArr[this.num].type == "blanksuffix"){
        var blank = new WidgetF45Blank(this.itemObj);
        this.freeMc.append(blank);
        this.curItem = blank;
      }
      else if(this.itemArr[this.num].type == "f45video"){
        var vid = new VidLoaderF45(this.itemObj);
        this.freeMc.append(vid);
        this.curItem = vid;
      }
      else if(this.itemArr[this.num].type == "video"){
        var vid = new VidLoader(this.itemObj);
        this.freeMc.append(vid.htmStr);
        this.curItem = vid;
      }
      else if(this.itemArr[this.num].type == "calendarofeventsview"){
        var coev = new WidgetBrowser(this.itemObj);
        this.freeMc.append(coev.htmStr);
        this.curItem = coev;
      }
      else if(this.itemArr[this.num].type == "crawlingtext" || this.itemArr[this.num].type == "text"){
        var text;
        if(this.itemArr[this.num].dtype == "c"){
          text = new WidgetCrawlingText(this.itemObj);
        }
        else{
          text = new WidgetStaticText(this.itemObj);
        }
        this.freeMc.append(text.htmStr);
      } else if(this.itemArr[this.num].type == "count"){
        var count = new WidgetCount(this.itemObj);
        this.freeMc.append(count.htmStr);
        this.curItem = count;
      }
      else if(this.itemArr[this.num].type == "date-time"){
        var dateTime = new WidgetDateTime(this.itemObj);
        this.freeMc.append(dateTime.htmStr);
        this.curItem = dateTime;
      }
      else if(this.itemArr[this.num].type == "excelsheet"){
        var excelSheet = new WidgetExcel(this.itemObj);
        this.freeMc.append(excelSheet.htmStr);
        this.curItem = excelSheet;
      }
      else if(this.itemArr[this.num].type == "f45"){
        var f45 = new WidgetF45(this.itemObj);
        this.freeMc.append(f45.htmStr);
        this.curItem = f45;
      }
      else if(this.itemArr[this.num].type == "animation"){
        var f45Animation = new WidgetF45Animation(this.itemObj);
        this.freeMc.append(f45Animation.htmStr);
        this.curItem = f45Animation;
      }
      else if(this.itemArr[this.num].type == "f45countdowncircle"){
        var count = new WidgetF45CountdownCircle(this.itemObj);
        this.freeMc.append(count.htmStr);
        this.curItem = count;
      }
      else if(this.itemArr[this.num].type == "f45contentscroller"){
        var scroll = new WidgetF45ContentScroller(this.itemObj);
        this.freeMc.append(scroll.htmStr);
        this.curItem = scroll;
      }
      else if(this.itemArr[this.num].type == "f45contenttile"){
        var tile = new WidgetF45ContentTile(this.itemObj);
        this.freeMc.append(tile.htmStr);
        this.curItem = tile;
      }
      else if(this.itemArr[this.num].type == "f45hydrate"){
        var hydrate = new WidgetF45Hydrate(this.itemObj);
        this.freeMc.append(hydrate.htmStr);
        this.curItem = hydrate;
      }
      else if(this.itemArr[this.num].type == "f45movestation"){
        var station = new WidgetF45Movestation(this.itemObj);
        this.freeMc.append(station.htmStr);
        this.curItem = station;
      }
      else if(this.itemArr[this.num].type == "f45progressbar"){
        var progress = new WidgetF45ProgressBar(this.itemObj);
        this.freeMc.append(progress.htmStr);
        this.curItem = progress;
      }
      else if(this.itemArr[this.num].type == "f45progressbarwithbreak"){
        var progressBreak = new WidgetF45ProgressBarWithBreak(this.itemObj);
        this.freeMc.append(progressBreak.htmStr);
        this.curItem = progressBreak;
      }
      else if(this.itemArr[this.num].type == "f45stay"){
        var stay = new WidgetF45Stay(this.itemObj);
        this.freeMc.append(stay.htmStr);
        this.curItem = stay;
      }
      else if(this.itemArr[this.num].type == "f45work"){
        var work = new WidgetF45Work(this.itemObj);
        this.freeMc.append(work.htmStr);
        this.curItem = work;
      }
      else if(this.itemArr[this.num].type == "f45workout"){
        var workout = new WidgetF45WorkHeart(this.itemObj);
        this.freeMc.append(workout.htmStr);
        this.curItem = workout;
      }
      else if(this.itemArr[this.num].type == "facebook" || this.itemArr[this.num].type == "fbworkplace"){
        var facebook;
        if(this.itemArr[this.num].dtype == "t"){
          facebook = new WidgetListView(this.itemObj);
        }
        else if(this.itemArr[this.num].dtype == "m"){
          facebook = new WidgetThumbView(this.itemObj);
        }
        else if(this.itemArr[this.num].dtype == "v"){
          facebook = new WidgetBrowser(this.itemObj);
        }
        this.freeMc.append(facebook.htmStr);
        this.curItem = facebook;
      }
      else if(this.itemArr[this.num].type == "fillercontent"){
        var filler = new WidgetFillerContent(this.itemObj);
        this.freeMc.append(filler.htmStr);
        this.curItem = filler;
      }
      else if(this.itemArr[this.num].type == "flight"){
        var flight = new WidgetFlight(this.itemObj);
        this.freeMc.append(flight.htmStr);
        this.curItem = flight;
      }
      else if(this.itemArr[this.num].type == "fschrome"){
        var fsc = new WidgetWebLogin(this.itemObj);
        this.freeMc.append(fsc.htmStr);
        this.curItem = fsc;
      }
      else if(this.itemArr[this.num].type == "googleslide"){
        var gSlide = new WidgetBrowser(this.itemObj);
        this.freeMc.append(gSlide.htmStr);
        this.curItem = gSlide;
      }
      else if(this.itemArr[this.num].type == "imagesrc"){
        var img = new ImgLoader(this.itemObj, false, true);
        this.freeMc.append(img.htmStr);
        this.curItem = img;
      }
      else if(this.itemArr[this.num].type == "instagram"){
        var instagram;
        if(this.itemArr[this.num].dtype == "t"){
          instagram = new WidgetListView(this.itemObj);
        }
        else{
          instagram = new WidgetThumbView(this.itemObj);
        }
        this.freeMc.append(instagram.htmStr);
        this.curItem = instagram;
      }
      else if(this.itemArr[this.num].type == "iotbutton"){
        var iotBtn = new IoTButton(this.itemObj);
        this.freeMc.append(iotBtn.htmlStr);
        this.curItem = iotBtn;
      }
      else if(this.itemArr[this.num].type == "livestream"){
        var livestream = new WidgetLiveStream(this.itemObj);
        this.freeMc.append(livestream.htmStr);
        this.curItem = livestream;
      }
      else if(this.itemArr[this.num].type == "meeting" || this.itemArr[this.num].type == "outlookcalendar" || this.itemArr[this.num].type == "googlecalendar" || this.itemArr[this.num].type == "calendarofevents" || this.itemArr[this.num].type == "touchlinkmeetings"){
        var meeting;
        if(this.itemArr[this.num].dtype == "wb" || this.itemArr[this.num].dtype == "wc" || this.itemArr[this.num].dtype == "ae"){
          meeting = new WidgetBrowser(this.itemObj);
          // if(this.itemArr[this.num].type == "outlookcalendar"){
          //   meeting = new WidgetMeetingWBSpectrumDemo(this.itemObj);
          // }
          // else{
          //   meeting = new WidgetMeetingWB(this.itemObj);
          // }
        }
        else if(this.itemArr[this.num].dtype == "r" || this.itemArr[this.num].dtype == "rb"){
          meeting = new WidgetMeetingRB(this.itemObj);
        }
        this.freeMc.append(meeting.htmStr);
        this.curItem = meeting;
      }
      else if(this.itemArr[this.num].type == "message"){
        var message = new WidgetMessage(this.itemObj);
        this.freeMc.append(message.htmStr);
        this.curItem = message;
      }
      else if(this.itemArr[this.num].type == "msteams"){
        var teams = new WidgetWebLogin(this.itemObj);
        this.freeMc.append(teams.htmStr);
        this.curItem = teams;
      }
      else if(this.itemArr[this.num].type == "news"){
        var news;
        if(this.itemArr[this.num].dtype == "crawl"){
          news = new WidgetCrawlingText(this.itemObj);
        }
        else{
          news = new WidgetListView(this.itemObj);
        }
        this.freeMc.append(news.htmStr);
        this.curItem = news;
      }
      else if(this.itemArr[this.num].type == "nextvehicle"){
        var nextVehicle = new WidgetBrowser(this.itemObj);
        this.freeMc.append(nextVehicle.htmStr);
        this.curItem = nextVehicle;
      }
      else if(this.itemArr[this.num].type == "openhour"){
        var openHour = new WidgetOpenHour(this.itemObj);
        this.freeMc.append(openHour.htmStr);
        this.curItem = openHour;
      }
      else if(this.itemArr[this.num].type == "patientwait"){
        var patientwait;
        if(this.itemArr[this.num].dtype == "q"){
          patientwait = new WidgetPatientWaitQueue(this.itemObj);
        }
        else if(this.itemArr[this.num].dtype == "a"){
          patientwait = new WidgetPatientWaitTime(this.itemObj);
        }
        this.freeMc.append(patientwait.htmStr);
        this.curItem = patientwait;
      }
      else if(this.itemArr[this.num].type == "powerbi"){
        var powerbi = new WidgetBrowser(this.itemObj);
        this.freeMc.append(powerbi.htmStr);
        this.curItem = powerbi;
      }
      else if(this.itemArr[this.num].type == "queue"){
        var queue = new WidgetQueue(this.itemObj);
        this.freeMc.html(queue.htmStr);
        this.curItem = queue;
      }
      else if(this.itemArr[this.num].type == "quote"){
        var quote = new WidgetQuote(this.itemObj);
        this.freeMc.html(quote.htmStr);
        this.curItem = quote;
      }
      else if(this.itemArr[this.num].type == "radio"){
        var radio = new WidgetRadio(this.itemObj);
        this.freeMc.append(radio);
        this.curItem = radio;
      }
      else if(this.itemArr[this.num].type == "rss"){
        var rss;
        if(this.itemArr[this.num].dtype == "crawl"){
          rss = new WidgetCrawlingText(this.itemObj);
        }
        else{
          rss = new WidgetListView(this.itemObj);
        }
        this.freeMc.append(rss.htmStr);
        this.curItem = rss;
      }
      else if(this.itemArr[this.num].type == "slack"){
        var slack = new WidgetBrowser(this.itemObj);
        this.freeMc.append(slack.htmStr);
        this.curItem = slack;
      }
      else if(this.itemArr[this.num].type == "stock"){
        var stock = new WidgetStock(this.itemObj);
        this.freeMc.append(stock.htmStr);
        this.curItem = stock;
      }
      else if(this.itemArr[this.num].type == "template"){
        var template = new Templates(this.itemObj);
        this.freeMc.append(template.htmStr);
        this.curItem = template;
      }
      else if(this.itemArr[this.num].type == "traffic"){
        var traffic = new WidgetBrowser(this.itemObj);
        this.freeMc.append(traffic.htmStr);
        this.curItem = traffic;
      }
      else if(this.itemArr[this.num].type == "twitter"){
        var twitter = new WidgetListView(this.itemObj);
        this.freeMc.append(twitter.htmStr);
        this.curItem = twitter;
      }
      else if(this.itemArr[this.num].type == "unisys"){
        // var unisys = new WidgetUnisys(this.itemObj);
        var unisys = new WidgetBrowser(this.itemObj);
        this.freeMc.append(unisys.htmStr);
        this.curItem = unisys;
      }
      else if(this.itemArr[this.num].type == "vimeo"){
        var vimeo = new WidgetBrowser(this.itemObj);
        this.freeMc.append(vimeo.htmStr);
        this.curItem = vimeo;
      }
      else if(this.itemArr[this.num].type == "weather"){
        var weather = new WidgetWeather(this.itemObj);
        this.freeMc.append(weather.htmStr);
        this.curItem = weather;
      }
      else if(this.itemArr[this.num].type == "webpage"){
        var webpage = new WidgetWebPage(this.itemObj);
        this.freeMc.append(webpage.htmStr);
        this.curItem = webpage;
      }
      else if(this.itemArr[this.num].type == "webcam"){
        var webcam = new WidgetWebCam(this.itemObj);
        this.freeMc.append(webcam.htmStr);
        this.curItem = webcam;
      }
      else if(this.itemArr[this.num].type == "weblogin"){
        var web = new WidgetWebLogin(this.itemObj);
        this.freeMc.append(web.htmStr);
        this.curItem = web;
      }
      else if(this.itemArr[this.num].type == "webwidget"){
        var iframe = new WidgetBrowser(this.itemObj);
        this.freeMc.append(iframe.htmStr);
        this.curItem = iframe;
      }
      else if(this.itemArr[this.num].type == "youtube"){
        var youtube = new WidgetBrowser(this.itemObj);
        this.freeMc.append(youtube.htmStr);
        this.curItem = youtube;
      }

      this.transition();
    }
  }

  transition(){
    if(this.prop.transition == "f"){
      TweenMax.to(this.freeMc, 0.5, {opacity:1});
      TweenMax.to(this.curMc, 0.5, {opacity:0});
      setTimeout(()=>{this.tweenComplete()}, 500);
    } else{
      this.freeMc.css({'visibility':'visible'});
      this.curMc.css({'visibility':'hidden'});
      this.curMc.empty();

      this.freeMc = $("#" + this.curMcId);
      this.curMc = $("#" + this.freeMcId);

      this.freeMcId = this.freeMc.attr("id");
      this.curMcId = this.curMc.attr("id");
    }
  }

  tweenComplete(){
    //TweenMax.killTweensOf(this.freeMc);
    //TweenMax.killTweensOf(this.curMc);
    this.curMc.empty();

    this.freeMc = $("#" + this.curMcId);
    this.curMc = $("#" + this.freeMcId);

    this.freeMcId = this.freeMc.attr("id");
    this.curMcId = this.curMc.attr("id");
  }

  hexToRgbA(hex, alpha){
    var c;
    if(hex == ""){
      return "";
    }
    else{
      if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c = hex.substring(1).split('');
        if(c.length == 3){
          c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255,(c >> 8) & 255, c & 255].join(',') + ', ' + alpha + ')';
      } else{
        return "rgba('255, 255, 255', " + alpha + ")";
      }
    }
  }

  updateItem(item, index){
    if((typeof index !== "undefined" && index == this.num) || this.curItemId == item.id){
      if(this.itemArr[this.num].type == "text"){
        this.curItem.updateText(item);
      }
      else if(item.type == "f45video"){
        this.curMc.empty();
        var vid = new VidLoaderF45(item);
        this.curMc.append(vid);
        this.curItem = vid;

      }
      else if(item.type == "f45image"){
        this.curMc.empty();
        var img = new ImgLoader(item, false, false, true);
        this.curMc.append(img.htmStr);
        this.curItem = img;
      }
      else if(item.type == "f45countdowncircle"){
        this.curItem.updateItem(item);
      }
      else if(item.type == "f45progressbar"){
        this.curItem.updateItem(item);
      }
    }
  }

  // getSvg(name, color, bg){
  //   console.warn('GET SVG');

  //   // return $.get("./img/"+name+".svg", function(svg){
  //   //   $("."+name).html(svg);
  //   //   $("."+name+" svg").css({"height": "30px", "padding": "8px", "background": bg, "fill": color, "vertical-align": "middle"});
  //   //   // <object type="image/svg+xml" data="../src/img/flight.svg" class="icon"></object>
  //   //});
  // }
}

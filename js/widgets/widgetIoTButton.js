class IoTButton{
  constructor(prop){
    this.iotBtnClientId = 'lsquaredmqtt_' + Math.random().toString(16).substr(2, 8);
    this.cssPref = "#" + prop.type + '-' + prop.id;
    this.settings = parseJSON(prop.settings);
    this.list = parseJSON(prop.list);
    this.cred = parseJSON(prop.cred);
    this.cmAudio = prop.cmAudio;
    this.isFileExists = false;
    this.isDuplicate = false;
    this.tempContainerH = 0;
    this.tempMsgQueue = [];
    this.isHidden = false;
    this.idExists = false;
    this.itemChangeTimer;
    this.tempQueueH = 0;
    this.audioArr = [];
    this.msgQueue = [];
    this.audioStr = "";
    this.curAudio = "";
    this.tempCurH = 0;
    this.audioNum = 0;
    this.iotBtnClient;
    this.prop = prop;
    this.scaledH = 0;
    this.scaledW = 0;
    this.scaleX = 0;
    this.scaleY = 0;
    this.fileExtArr;
    this.hideTimer;
    this.curMsgObj;
    this.ssNum = 0;
    this.isLoaded;
    this.mapping;
    this.fileExt;
    this.certUrl;
    this.curMsg;
    this.ssImg;
    this.ssVid;
    this.n = 0;
    this.audio;

    this.certFiles = [{type:"cert", name:this.cred.dvcCert.split("/")[this.cred.dvcCert.split("/").length - 1], src:this.cred.dvcCert, str:""}, {type:"key", name:this.cred.privateKey.split("/")[this.cred.privateKey.split("/").length - 1], src:this.cred.privateKey, str:""}, {type:"ca", name:this.cred.rootCACert.split("/")[this.cred.rootCACert.split("/").length - 1], src:this.cred.rootCACert, str:""}];
    this.htmlStr = '<audio id="iotAudio-' + this.prop.type + '-' + this.prop.id + '"></audio><div id="' + this.prop.type + '-' + this.prop.id + '" style="width:' + (this.prop.w - 40) + 'px;height:' + (this.prop.h - 40) + 'px;background-color:' + window.hexToRgbA(this.settings.bg, this.settings.bga) + ';padding:20px;" class="iotBtnBg"><style type="text/css">';
    this.htmlStr += this.cssPref + ' .iotBtnQueueDiv .queueItem .tilt{position:relative;margin:20px;padding:10px 10px 10px 15px;transform:skew(-8deg);transform-origin:bottom left;}';
    this.htmlStr += this.cssPref + ' .iotBtnQueueDiv .queueItem:nth-child(even) .tilt{font-family:' + this.settings.altFont.value + ';font-size:' + this.settings.altSize + 'px;background:' + window.hexToRgbA(this.settings.altBg, this.settings.altBga) + ';color:' + this.settings.altText + '}';
    this.htmlStr += this.cssPref + ' .iotBtnQueueDiv .queueItem:nth-child(odd) .tilt{font-family:' + this.settings.qFont.value + ';font-size:' + this.settings.qSize + 'px;background:' + window.hexToRgbA(this.settings.qBg, this.settings.qBga) + ';color:' + this.settings.qText + '}';
    this.htmlStr += this.cssPref + ' .iotBtnQueueDiv .queueItem .tilt>div{transform:skew(8deg);transform-origin:bottom left;}';

    if(this.prop.iotbg != ""){
      this.htmlStr += this.cssPref + '.iotBtnBg{background-image:url(\'' + resourcePath + '/resized/fit-' + this.prop.iotbg + '\');background-repeat:no-repeat;background-position:center;}';
    }

    if(this.settings.orientation == "l"){
      this.curDivW = parseInt((this.prop.w - 40) * (this.settings.grid/100));
      this.qDivW = this.prop.w - (this.curDivW + 41);
      this.qiW = parseInt((this.qDivW - 40) / this.settings.qcol);

      this.htmlStr += this.cssPref + ' .iotBtnCurDiv{text-align:center;font-style:italic;padding-right:' + this.qDivW + 'px;}';
      this.htmlStr += this.cssPref + ' .iotBtnSep{border-width:1px;border-style: solid;border-left:0;border-image:linear-gradient(' + window.hexToRgbA(this.settings.sep, 0) + ', ' + window.hexToRgbA(this.settings.sep, 1) + ', ' + window.hexToRgbA(this.settings.sep, 0) + ') 0 100%;}';
      this.htmlStr += this.cssPref + ' .iotBtnQueueDiv{float:right;width:' + this.qDivW + 'px;}';
    }
    else{
      this.curDivH = parseInt((this.prop.h - 40) * (this.settings.grid/100));
      this.qDivH = this.prop.h - (this.curDivH + 41);
      this.qiW = parseInt((this.prop.w - 40) / this.settings.qcol);

      this.htmlStr += this.cssPref + ' .iotBtnCurDiv{text-align:center;font-style:italic;}';
      this.htmlStr += this.cssPref + ' .iotBtnSep{border:0px;border-bottom:1px solid;border-image:linear-gradient(to right, ' + window.hexToRgbA(this.settings.sep, 0) + ', ' + window.hexToRgbA(this.settings.sep, 1) + ', ' + window.hexToRgbA(this.settings.sep, 0) + ');border-image-slice: 1;border-bottom:1px solid ' + this.settings.sep + ';height:' + this.curDivH + 'px;}';
      this.htmlStr += this.cssPref + ' .iotBtnQueueDiv{height:' + this.qDivH + 'px;}';
    }
    this.htmlStr += this.cssPref + ' .iotBtnQueueDiv .queueItem{vertical-align:top;display:inline-block;width:' + this.qiW + 'px;text-align:center;overflow:hidden;}</style><div class="iotBtnSS hide" style="margin:-20px 0 0 -20px"></div><div class="iotBtnContainer hide">';

    if(this.settings.orientation == "l"){
      this.htmlStr +='<div class="iotBtnQueueDiv">';
      if(this.settings.qTitle != ""){
        this.htmlStr += '<div style="color:' + this.settings.qtText + ';font-family:' + this.settings.qtFont.value + ';font-size:' + this.settings.qtSize + 'px;margin-bottom:40px;padding:10px 20px;">' + this.settings.qTitle + '</div>';
      }
      this.htmlStr += '<ul id="iotBtnQueueList" style="padding:0 20px;list-style:none;"></ul></div>';
      this.htmlStr += '<div class="iotBtnCurDiv"><div class="iotBtnSep">';
      if(this.settings.title != ""){
        this.htmlStr += '<div style="color:' + this.settings.titleText + ';font-family:' + this.settings.titleFont.value + ';font-size:' + this.settings.titleSize + 'px;margin-bottom:40px;padding:10px 20px;">' + this.settings.title + '</div>';
      }
      this.htmlStr += '<div id="curId" style="color:' + this.settings.numText + ';font-family:' + this.settings.numFont.value + ';font-size:' + this.settings.numSize + 'px;"></div></div></div><div style="clear:both;"></div>';
    }
    else{
      this.htmlStr += '<div class="iotBtnCurDiv"><div class="iotBtnSep">';
      if(this.settings.title != ""){
        this.htmlStr += '<div style="color:' + this.settings.titleText + ';font-family:' + this.settings.titleFont.value + ';font-size:' + this.settings.titleSize + 'px;margin-bottom:40px;padding:10px 20px;">' + this.settings.title + '</div>';
      }
      this.htmlStr += '<div id="curId" style="color:' + this.settings.numText + ';font-family:' + this.settings.numFont.value + ';font-size:' + this.settings.numSize + 'px;"></div></div></div>';

      this.htmlStr +='<div class="iotBtnQueueDiv">';
      if(this.settings.qTitle != ""){
        this.htmlStr += '<div style="text-align:center;color:' + this.settings.qtText + ';font-family:' + this.settings.qtFont.value + ';font-size:' + this.settings.qtSize + 'px;margin-bottom:40px;padding:30px 20px 10px 20px;">' + this.settings.qTitle + '</div>';
      }
      this.htmlStr += '<ul id="iotBtnQueueList" style="padding:0;list-style:none;"></ul></div>';
    }
    this.htmlStr += '</div></div>';

    setTimeout(()=>{this.checkCert()}, 200);
    return this.htmlStr;
  }

  placementExists(p){
    this.idExists = false;
    this.curAudio = "";
    for(var i=0; i<this.list.length; i++){
      if(this.list[i].p.toLowerCase() == p){
        this.idExists = true;
        if(this.list[i].s){
          this.curAudio = this.list[i].s.url.split("/")[this.list[i].s.url.split("/").length - 1];
        }
        break;
      }
    }
    //this.audioArr = [];
    if(this.cmAudio != "" && this.curAudio != ""){
      this.audioArr.push(resourcePath + "/media/"+ this.cmAudio);
    }
    if(this.curAudio != ""){
      this.audioArr.push(resourcePath + "/media/"+ this.curAudio);
    }
    return this.idExists;
  }

  checkCert(){
    this.isFileExists = fs.existsSync(resourcePath + "/local/"+ this.certFiles[this.n].name);
    if(this.prop.ss){
      this.loadSS();
    }

    if(this.isFileExists){
      this.certFiles[this.n].str = fs.readFileSync(resourcePath + "/local/"+ this.certFiles[this.n].name);
      this.checkNextCert();
    }
    else{
      $.get(this.certFiles[this.n].src, (data)=>{
        this.certFiles[this.n].str = data;
        fs.writeFileSync(resourcePath + "/local/" + this.certFiles[this.n].name, data, (err) => {
          if(err)throw err;
        });
        this.checkNextCert();
      })
      .fail(function(){
        if(this.certFiles[this.n].type == "cert"){
          this.certUrl = "src/js/libraries/iot-cred/9c16144e3adb1bf3364c52b86cac54e4727cfcf72e0ecd6f291830de6aa84345-certificate.pem.crt";
        }
        else if(this.certFiles[this.n].type == "key"){
          this.certUrl = "src/js/libraries/iot-cred/9c16144e3adb1bf3364c52b86cac54e4727cfcf72e0ecd6f291830de6aa84345-private.pem.key";
        }
        else if(this.certFiles[this.n].type == "ca"){
          this.certUrl = "src/js/libraries/iot-cred/AmazonRootCA1.pem";
        }
        this.certFiles[this.n].str = fs.readFileSync(this.certUrl);
        this.checkNextCert();
      });
    }
  }

  checkNextCert(){
    this.n++;
    if(this.n == this.certFiles.length){
      this.initConn();
    }
    else{
      this.checkCert();
    }
  }

  initConn(){
    // this.audio = $("#iotAudio-" + this.prop.type + '-' + this.prop.id);
    this.audio = document.createElement('audio');
    this.audio.controls = false;
    this.audio.autoplay = true;
    this.audio.loop = false;
    this.audio.addEventListener('ended', (event) => {
      this.audioNum++;
      if(this.audioNum < this.audioArr.length){
        this.audio.src = this.audioArr[this.audioNum];
        this.audio.load();
        this.audio.play();
      }
      else{
        this.audioArr = [];
      }
    });

    this.options = {
      key: this.certFiles[this.certFiles.findIndex(x => x.type === "key")].str,
      cert: this.certFiles[this.certFiles.findIndex(x => x.type === "cert")].str,
      ca: [ this.certFiles[this.certFiles.findIndex(x => x.type === "ca")].str ]
    };

    this.iotBtnClient = mqtt.connect(this.cred.ep, this.options);

    this.iotBtnClient.on('error', (err) => {
      console.log('Connection error: ', err)
      client.end()
    });

    this.iotBtnClient.on('reconnect', () => {
      console.log('Reconnecting...')
    });

    this.iotBtnClient.on('connect', () => {
      console.log('Client connected:' + this.iotBtnClientId)
      this.audioArr = [];
      iotBtnClient = this.iotBtnClient;
      this.iotBtnClient.subscribe('lsquared-iotbutton', {
        qos: 0
      });
      // this.iotBtnClient.publish('lsquared-iotbutton', 'Electron connection demo...!', {
      //   qos: 0,
      //   retain: false
      // })
    });

    this.iotBtnClient.on('message', (topic, message, packet) => {
      this.curMsgObj = JSON.parse(message.toString());
      this.curMsg = "";

      if(this.placementExists(this.curMsgObj.name.toLowerCase())){
        if(this.curMsgObj.did && this.curMsgObj.did != ""){
          this.curMsg = this.curMsgObj.did;
        }
        else{
          for(var i=0; i<this.list.length; i++){
            if(this.list[i].p.toLowerCase() == this.curMsgObj.name.toLowerCase()){
              this.curMsg = this.list[i].v;
              break;
            }
          }
          if(this.curMsg == ""){
            this.curMsg = this.curMsgObj.name;
          }
        }
        if(this.curMsg != ""){
          this.updateMsgQueue();
        }
      }
    });
  }

  updateMsgQueue(){
    this.isDuplicate = false;
    this.audioStr = "";
    for(var i=0; i<this.msgQueue.length; i++){
      if(this.msgQueue[i].msg == this.curMsg){
        this.msgQueue.splice(i, 1);
        break;
      }
    }
    if(this.msgQueue.length > this.settings.qmax){
      this.msgQueue.splice(0, 1);
    }
    this.msgQueue.push({id:new Date().getTime(), msg:this.curMsg, t:this.settings.hd, rm:false});
    $("#" + this.prop.type + "-" + this.prop.id + " #iotBtnQueueList").empty();
    for(var i=(this.msgQueue.length-1); i>=0; i--){
      if(i == (this.msgQueue.length-1)){
        $("#" + this.prop.type + "-" + this.prop.id + " #curId").html('<div id="item-' + this.msgQueue[i].id + '" style="white-space:nowrap;overflow:hidden;">' + this.msgQueue[i].msg + '</div>');
      }
      else{
        $("#" + this.prop.type + "-" + this.prop.id + " #iotBtnQueueList").append('<li class="queueItem"><div id="item-' + this.msgQueue[i].id + '" class="tilt" style="white-space:nowrap;"><div style="overflow:hidden;">' + this.msgQueue[i].msg + '</div></div></li>');
      }
    }

    $(this.cssPref + ' .iotBtnSS').empty();
    $(this.cssPref + ' .iotBtnSS').hide();
    $(this.cssPref).addClass("iotBtnBg");

    if(this.itemChangeTimer){
      clearTimeout(this.itemChangeTimer);
      this.itemChangeTimer = null;
    }

    $(this.cssPref + ' .iotBtnContainer').show();
    this.alignToFrame();

    if(!this.hideTimer){
      this.hideTimer = setInterval(()=>{
        this.hideItem();
      }, 1000);
      //window.addTimer(this.hideTimer, "i", this.prop.fid);
    }
    /*this.audio.src = "";
    this.audioNum = 0;
    this.audio.load();*/

    if(this.audio.paused && this.audioArr.length > 0){
      this.audioNum = 0;
      this.audio.src = this.audioArr[this.audioNum];
      this.audio.load();
      this.audio.play();
    }
  }

  hideItem(){
    this.isHidden = false;
    for(var i=0; i<this.msgQueue.length; i++){
      this.msgQueue[i].t -= 1;
      if(this.msgQueue[i].t <= 0){
        $("#" + this.prop.type + "-" + this.prop.id + " #item-" + this.msgQueue[i].id).remove();
        this.msgQueue[i].rm = true;
        this.isHidden = true;
      }
    }

    if(this.isHidden){
      this.tempMsgQueue = [];
      for(var j=0; j<this.msgQueue.length; j++){
        if(!this.msgQueue[j].rm){
          this.tempMsgQueue.push(this.msgQueue[j]);
        }
      }
      this.msgQueue = this.tempMsgQueue;

      if(this.msgQueue.length == 0){
        $(this.cssPref + ' .iotBtnContainer').css({"margin-top":0});
        $(this.cssPref + ' .iotBtnContainer').hide();
        clearInterval(this.hideTimer);
        this.hideTimer = null;
        // this.audio.src = "";
        // this.audioNum = 0;
        // this.audio.load();
        if(this.prop.ss){
          this.loadSS();
        }
      }
      else{
        this.alignToFrame();
      }
    }
  }

  alignToFrame(){
    this.tempContainerH = $(this.cssPref + ' .iotBtnContainer').height();
    this.tempQueueH = $(this.cssPref + ' .iotBtnQueueDiv').height();
    this.tempCurH = $(this.cssPref + ' .iotBtnCurDiv').height();

    if(this.settings.orientation == "l"){
      $(this.cssPref + ' .iotBtnContainer').css({"margin-top":parseInt(((this.prop.h - 40) - this.tempContainerH)/2)});
      // if(this.tempCurH < this.tempContainerH){
      //   $(this.cssPref + ' .iotBtnCurDiv').css({"margin-top":parseInt((this.tempContainerH - this.tempCurH)/2)});
      // }
      // else if(this.tempQueueH < this.tempContainerH){
      //   $(this.cssPref + ' .iotBtnQueueDiv').css({"margin-top":parseInt((this.tempContainerH - this.tempQueueH)/2)});
      // }
    }
  }

  loadSS(){
    this.fileExtArr = this.prop.ss[this.ssNum].fileName.split(".");
		this.fileExt = this.fileExtArr[this.fileExtArr.length - 1];
    $(this.cssPref + " .iotBtnContainer").hide();
    $(this.cssPref).removeClass("iotBtnBg");
    $(this.cssPref + " .iotBtnSS").empty();
    $(this.cssPref + " .iotBtnSS").show();
    this.isLoaded = false;
    this.audioArr = [];
    this.htmStr = "";

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
      if(fs.existsSync(resourcePath + '/resized/fit-' + this.prop.ss[this.ssNum].fileName)){
        this.ssImg.src = resourcePath + '/resized/fit-' + this.prop.ss[this.ssNum].fileName;
        this.isLoaded = true;
      }
      $(this.cssPref + " .iotBtnSS").append(this.ssImg);
    }
    else if(this.fileExt == "mp4"){
      if(fs.existsSync(resourcePath + '/media/' + this.prop.ss[this.ssNum].fileName)){
        this.htmStr = '<video id="' + this.prop.type + '-' + this.prop.id + '" width="' + this.prop.w + '" height="' + this.prop.h + '" loop autoplay><source src="' + resourcePath + '/media/' + this.prop.ss[this.ssNum].fileName + '" type="video/mp4"></video>';
        this.isLoaded = true;
      }
      $(this.cssPref + " .iotBtnSS").append(this.htmStr);
      if(fsFrameId != ""){
        $("video#" + this.prop.type + '-' + this.prop.id).get(0).pause();
      }
    }

    if(this.prop.ss.length > 1){
      if(this.isLoaded){
        this.itemChangeTimer = setTimeout(()=>{this.loadNextItemFx()}, this.prop.ss[this.ssNum].duration * 1000);
        //window.addTimer(this.itemChangeTimer, "t", this.prop.fid);
      }
      else{
        this.loadNextItemFx();
      }
    }
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

  loadNextItemFx(){
    this.ssNum++;
    if(this.ssNum >= this.prop.ss.length){
      this.ssNum = 0;
    }
    this.loadSS();
  }

  checkMapping(){
    if(fs.existsSync(resourcePath + "/local/"+ this.prop.type + "-map-" + this.prop.id + ".json")){
      this.mapping = parseJSON(fs.readFileSync(resourcePath + "/local/"+ this.prop.type + "-map-" + this.prop.id + ".json"));
      if(this.mapping.v != this.prop.mapv){
        this.loadMapping();
      }
    }
    else{
      this.loadMapping();
    }
  }

  loadMapping(){
    $.get(storageHost + bucket + "feed/json/" + mac + ".json?" + new Date().getTime(), (data)=>{
      this.mapping = parseJSON(data);
      fs.writeFileSync(resourcePath + "/local/" + this.prop.type + "-map-" + this.prop.id + ".json", data, (err) => {
        if(err)throw err;
      });
      this.initConn();
    })
    .fail(function(){
      this.initConn();
    });
  }

  removeFx(){
    if(this.itemChangeTimer){
      clearTimeout(this.itemChangeTimer);
    }

    if(this.hideTimer){
      clearTimeout(this.hideTimer);
    }

    this.iotBtnClient.end();
    this.audio.src = "";
    this.audio.load();

    this.tempContainerH = this.tempQueueH = this.tempCurH = this.audioNum = this.scaledH = this.scaledW = this.scaleX = this.scaleY = this.ssNum = this.n = null;
    this.cmAudio = this.fileExt = this.curMsg = this.certUrl = this.iotBtnClientId = this.cssPref = this.audioStr = this.curAudio = null;
    this.isLoaded = this.isFileExists = this.isDuplicate = this.idExists = this.isHidden = null;
    this.curMsgObj = this.mapping = this.prop = this.settings = this.list = this.cred = null;
    this.fileExtArr = this.tempMsgQueue = this.audioArr = this.msgQueue = null;
    this.itemChangeTimer = this.hideTimer = null;
    this.iotBtnClient = null;
    this.audio = null;
    this.ssImg = null;
    this.ssVid = null;

    this.tempContainerH = this.tempQueueH = this.tempCurH = this.audioNum = this.scaledH = this.scaledW = this.scaleX = this.scaleY = this.ssNum = this.n = undefined;
    this.cmAudio = this.fileExt = this.curMsg = this.certUrl = this.iotBtnClientId = this.cssPref = this.audioStr = this.curAudio = undefined;
    this.isLoaded = this.isFileExists = this.isDuplicate = this.idExists = this.isHidden = undefined;
    this.curMsgObj = this.mapping = this.prop = this.settings = this.list = this.cred = undefined;
    this.fileExtArr = this.tempMsgQueue = this.audioArr = this.msgQueue = undefined;
    this.itemChangeTimer = this.hideTimer = undefined;
    this.iotBtnClient = undefined;
    this.audio = undefined;
    this.ssImg = undefined;
    this.ssVid = undefined;
  }

}

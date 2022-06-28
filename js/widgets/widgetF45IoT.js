class F45IoT{
  constructor(prop){
    this.f45IoTClientId = 'lsquaredmqtt_' + Math.random().toString(16).substr(2, 8);
    this.isPatchApplied = false;
    this.isFileExists = false;
    this.itemDeleted = false;
    this.f45IoTClient;
    this.prop = prop;
    this.certFiles;
    this.curMsgObj;
    this.changeObj;
    this.fileName;
    this.n = 0;
    this.cred;

    prop.cred = null; // TO BE DELETED BEFORE PUSHING TO PRODUCTION

    if(prop.cred){
      this.cred = parseJSON(prop.cred);
      this.certFiles = [{type:"cert", name:this.cred.dvcCert.split("/")[this.cred.dvcCert.split("/").length - 1], src:this.cred.dvcCert, str:""}, {type:"key", name:this.cred.privateKey.split("/")[this.cred.privateKey.split("/").length - 1], src:this.cred.privateKey, str:""}, {type:"ca", name:this.cred.rootCACert.split("/")[this.cred.rootCACert.split("/").length - 1], src:this.cred.rootCACert, str:""}];
      if(!this.cred.ep){
        this.cred.ep = "mqtt://a125i0t7e1ta7u-ats.iot.us-west-2.amazonaws.com:8883";
      }
    }
    else{
      this.cred = {ep:"mqtt://a125i0t7e1ta7u-ats.iot.us-west-2.amazonaws.com:8883"};
      this.certFiles = [
        {
          type: "cert",
          name: "9c16144e3adb1bf3364c52b86cac54e4727cfcf72e0ecd6f291830de6aa84345-certificate.pem.crt",
          src: "https://lsquared.com/ToDownload/iotBtnTestCerts/9c16144e3adb1bf3364c52b86cac54e4727cfcf72e0ecd6f291830de6aa84345-certificate.pem.crt",
          str: ""
        },
        {
          type: "key",
          name: "9c16144e3adb1bf3364c52b86cac54e4727cfcf72e0ecd6f291830de6aa84345-private.pem.key",
          src: "https://lsquared.com/ToDownload/iotBtnTestCerts/9c16144e3adb1bf3364c52b86cac54e4727cfcf72e0ecd6f291830de6aa84345-private.pem.key",
          str:""
        },
        {
          type:"ca",
          name:"AmazonRootCA1.pem",
          src:"https://lsquared.com/ToDownload/iotBtnTestCerts/AmazonRootCA1.pem",
          str:""
        }];
    }

    setTimeout(()=>{this.checkCert()}, 200);
    return this.htmlStr;
  }

  checkCert(){
    this.isFileExists = fs.existsSync(resourcePath + "/local/"+ this.certFiles[this.n].name);

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
    this.options = {
      key: this.certFiles[this.certFiles.findIndex(x => x.type === "key")].str,
      cert: this.certFiles[this.certFiles.findIndex(x => x.type === "cert")].str,
      ca: [ this.certFiles[this.certFiles.findIndex(x => x.type === "ca")].str ]
    };

    this.f45IoTClient = mqtt.connect(this.cred.ep, this.options);

    this.f45IoTClient.on('error', (err) => {
      console.log('Connection error: ', err)
      client.end()
    });

    this.f45IoTClient.on('reconnect', () => {
      console.log('Reconnecting...')
    });

    this.f45IoTClient.on('connect', () => {
      console.log('Client connected:' + this.f45IoTClientId)
      f45IoTClient = this.f45IoTClient;
      this.f45IoTClient.subscribe('F45-iot-topic', {
        qos: 0
      })
      this.f45IoTClient.subscribe(mac, {
        qos: 0
      })

    });

    this.f45IoTClient.on('message', (topic, message, packet) => {
      this.curMsgObj = JSON.parse(message.toString());
      console.log(this.curMsgObj);

      for(var i=0; i<this.curMsgObj.length; i++){
        if(this.curMsgObj[i].type == "story"){
          getPlaybookMaster();
        }
        else if(this.curMsgObj[i].type == "playbook"){
          for(var j=0; j<playbookMaster.playbook.length; j++){
            if(playbookMaster.playbook[j].id == this.curMsgObj[i].id){
              for(var k=0; k<this.curMsgObj[i].story.length; k++){
                this.isPatchApplied = false;
                for(var l=0; l<playbookMaster.playbook[j].story.length; l++){
                  if(playbookMaster.playbook[j].story[l].id == this.curMsgObj[i].story[k].id){
                    playbookMaster.playbook[j].story[l] = this.curMsgObj[i].story[k];
                    this.isPatchApplied = true;
                    break;
                  }
                }
              }
            }
          }
          if(this.curMsgObj[i].save){
            patchArr.push(this.curMsgObj[i]);
          }
          checkWorkoutTime();
        }
        else if(this.curMsgObj[i].type == "scene"){
          for(var j=0; j<playbookMaster.scenes.length; j++){
            if(playbookMaster.scenes[j].id == this.curMsgObj[i].sid){
              for(var k=0; k<playbookMaster.scenes[j].fr.length; k++){
                if(playbookMaster.scenes[j].fr[k].id == this.curMsgObj[i].fid){
                  if(this.curMsgObj[i].stype == "e" || this.curMsgObj[i].stype == "d"){
                    for(var l=0; l<playbookMaster.scenes[j].fr[k].item.length; l++){
                      if(playbookMaster.scenes[j].fr[k].item[l].id == this.curMsgObj[i].itemid){
                        if(this.curMsgObj[i].stype == "e"){
                          playbookMaster.scenes[j].fr[k].item[l] = this.curMsgObj[i].item;
                        }
                        else{
                          playbookMaster.scenes[j].fr[k].item.spice(l, 1);
                        }
                        this.isPatchApplied = true;
                        break;
                      }
                    }
                  }
                  else if(this.curMsgObj[i].stype == "a"){
                    playbookMaster.scenes[j].fr[k].spice(this.curMsgObj[i].i, 0, this.curMsgObj[i].item);
                    this.isPatchApplied = true;
                    break;
                  }
                }
                if(this.isPatchApplied) break;
              }
            }
            if(this.isPatchApplied) break;
          }
          console.log(appMode);
          if(appMode == "f45" || appMode == "workout"){
            this.updateCurWorkout();
          }
        }
      }
    });
  }

  updateCurWorkout(){
    for(var i=0; i<this.curMsgObj.length; i++){
      if(this.curMsgObj[i].stype == "a" || this.curMsgObj[i].stype == "e"){
        for(var j=0; j<frameObjArr.length; j++){
          if(frameObjArr[j].id == Number(this.curMsgObj[i].sid.toString() + this.curMsgObj[i].fid.toString())){
            if(this.curMsgObj[i].item.type == "content"){
              this.changeObj = {id:this.curMsgObj[i].itemid, type:"", src:this.curMsgObj[i].item.fileName, duration:this.curMsgObj[i].item.d * 1000, a:"c-m", bg:"", fid:this.curMsgObj[i].fid, h:frameObjArr[j].itemArr[0].h, w:frameObjArr[j].itemArr[0].w, scale:frameObjArr[j].itemArr[0].scale, transition:"n", tz:frameObjArr[j].itemArr[0].tz};
              this.fileName = this.curMsgObj[i].item.fileName.split(".");
              if(this.fileName[this.fileName.length - 1] == "mp4"){
                this.changeObj.type = "f45video";
              }
              else{
                this.changeObj.type = "f45image";
              }
            }
            else if(this.curMsgObj[i].item.type == "text"){
              this.changeObj = {id:this.curMsgObj[i].itemid, type:"text", dtype:this.curMsgObj[i].item.dType, duration:this.curMsgObj[i].item.d * 1000, a:"c-m", bg:"", fid:this.curMsgObj[i].fid, filename:this.curMsgObj[i].item.type, h:frameObjArr[j].itemArr[0].h, w:frameObjArr[j].itemArr[0].w, transition:"n", tz:frameObjArr[j].itemArr[0].tz, settings:this.curMsgObj[i].item.settings, txt:this.curMsgObj[i].item.txt};
            }
            else if(this.curMsgObj[i].item.type.toLowerCase() == "countdowncircle" || this.curMsgObj[i].item.type.toLowerCase() == "f45countdowncircle"){
              this.changeObj = { id:this.curMsgObj[i].itemid, type:"f45countdowncircle", settings:this.curMsgObj[i].item.settings, duration:this.curMsgObj[i].item.d * 1000 };
            }
            else if(this.curMsgObj[i].item.type.toLowerCase() == "progressbar" || this.curMsgObj[i].item.type.toLowerCase() == "f45progressbar"){
              this.changeObj = { id:this.curMsgObj[i].itemid, type:"f45progressbar", settings:this.curMsgObj[i].item.settings, duration:this.curMsgObj[i].item.d * 1000 };
            }

            if(this.curMsgObj[i].stype == "a"){
              if(frameObjArr[j].itemArr[0].type == "blankprefix"){
                this.curMsgObj[i].i += 1;
              }
              frameObjArr[j].itemArr.splice(this.curMsgObj[i].i, 0, this.changeObj);
            }
            else{
              for(var k=0; k<frameObjArr[j].itemArr.length; k++){
                if(frameObjArr[j].itemArr[k].id == this.curMsgObj[i].itemid){
                  frameObjArr[j].itemArr[k] = this.changeObj;
                  break;
                }
              }
            }
            frameObjArr[j].updateItem(this.changeObj, this.curMsgObj[i].i);
            break;
          }
        }
      }
    }
  }

  removeFx(){
    this.isPatchApplied = this.isFileExists = this.itemDeleted = null;
    this.prop = this.cred = this.curMsgObj = this.changeObj = null;
    this.f45IoTClientId = this.fileName = null;
    this.f45IoTClient = null;
    this.certFiles = null;
    this.n = null;

    this.isPatchApplied = this.isFileExists = this.itemDeleted = undefined;
    this.prop = this.cred = this.curMsgObj = this.changeObj = undefined;
    this.f45IoTClientId = this.fileName = undefined;
    this.f45IoTClient = undefined;
    this.certFiles = undefined;
    this.n = undefined;
  }
}

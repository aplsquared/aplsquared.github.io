class F45IoT{
  constructor(prop){
    this.f45IoTClientId = 'lsquaredmqtt_' + Math.random().toString(16).substr(2, 8);
    this.isFileExists = false;
    this.itemDeleted = false;
    this.f45IoTClient;
    this.prop = prop;
    this.itemUpdated;
    this.certFiles;
    this.curMsgObj;
    this.changeObj;
    this.fileName;
    this.n = 0;
    this.cred;

    prop.cred = null; // TO BE DELETED BEFORE PUSHING TO PRODUCTION

    if(prop.cred){
      this.cred = parseJSON(prop.cred);
    }
    else{
      this.cred = {dvcCert: "src/js/libraries/iot-cred/9c16144e3adb1bf3364c52b86cac54e4727cfcf72e0ecd6f291830de6aa84345-certificate.pem.crt", privateKey: "src/js/libraries/iot-cred/9c16144e3adb1bf3364c52b86cac54e4727cfcf72e0ecd6f291830de6aa84345-private.pem.key", rootCACert: "src/js/libraries/iot-cred/AmazonRootCA1.pem", ep: "mqtt://a125i0t7e1ta7u-ats.iot.us-west-2.amazonaws.com:8883"};
    }
    this.certFiles = [{type:"cert", name:this.cred.dvcCert.split("/")[this.cred.dvcCert.split("/").length - 1], src:this.cred.dvcCert, str:""}, {type:"key", name:this.cred.privateKey.split("/")[this.cred.privateKey.split("/").length - 1], src:this.cred.privateKey, str:""}, {type:"ca", name:this.cred.rootCACert.split("/")[this.cred.rootCACert.split("/").length - 1], src:this.cred.rootCACert, str:""}];

    setTimeout(()=>{this.checkCert()}, 200);
    return this.htmlStr;
  }

  checkCert(){
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

    // this.isFileExists = fs.existsSync(resourcePath + "/local/"+ this.certFiles[this.n].name);
    //
    // if(this.isFileExists){
    //   this.certFiles[this.n].str = fs.readFileSync(resourcePath + "/local/"+ this.certFiles[this.n].name);
    //   this.checkNextCert();
    // }
    // else{
    //   $.get(this.certFiles[this.n].src, (data)=>{
    //     this.certFiles[this.n].str = data;
    //     fs.writeFileSync(resourcePath + "/local/" + this.certFiles[this.n].name, data, (err) => {
    //       if(err)throw err;
    //     });
    //     this.checkNextCert();
    //   })
    //   .fail(()=>{
    //     if(this.certFiles[this.n].type == "cert"){
    //       this.certUrl = "src/js/libraries/iot-cred/9c16144e3adb1bf3364c52b86cac54e4727cfcf72e0ecd6f291830de6aa84345-certificate.pem.crt";
    //     }
    //     else if(this.certFiles[this.n].type == "key"){
    //       this.certUrl = "src/js/libraries/iot-cred/9c16144e3adb1bf3364c52b86cac54e4727cfcf72e0ecd6f291830de6aa84345-private.pem.key";
    //     }
    //     else if(this.certFiles[this.n].type == "ca"){
    //       this.certUrl = "src/js/libraries/iot-cred/AmazonRootCA1.pem";
    //     }
    //     this.certFiles[this.n].str = fs.readFileSync(this.certUrl);
    //     this.checkNextCert();
    //   });
    // }
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
        this.itemDeleted = false;
        if(this.curMsgObj[i].stype == "d"){
          for(var j=0; j<frameObjArr.length; j++){
            if(frameObjArr[j].id == Number(this.curMsgObj[i].sid.toString() + this.curMsgObj[i].fid.toString())){
              for(var k=0; k<frameObjArr[j].itemArr.length; k++){
                if(this.curMsgObj[i].itemid == frameObjArr[j].itemArr[k].id){
                  frameObjArr[j].itemArr.splice(k, 1);
                  console.log(frameObjArr[j].itemArr);
                  this.itemDeleted = true;
                  break;
                }
              }
            }
            if(this.itemDeleted){
              break;
            }
          }
        }
      }

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
                if(frameObjArr[j].itemArr[0].type == "blankprefix"){
                  this.curMsgObj[i].i += 1;
                }
                frameObjArr[j].itemArr.splice(this.curMsgObj[i].i, 0, this.changeObj);
                console.log(frameObjArr[j].itemArr);
                frameObjArr[j].updateItem(this.changeObj, this.curMsgObj[i].i);
              }
              else if(this.curMsgObj[i].item.type == "text"){
                this.changeObj = {id:this.curMsgObj[i].itemid, type:"text", dtype:this.curMsgObj[i].item.dType, duration:this.curMsgObj[i].item.d * 1000, a:"c-m", bg:"", fid:this.curMsgObj[i].fid, filename:this.curMsgObj[i].item.type, h:frameObjArr[j].itemArr[0].h, w:frameObjArr[j].itemArr[0].w, transition:"n", tz:frameObjArr[j].itemArr[0].tz, settings:this.curMsgObj[i].item.settings, txt:this.curMsgObj[i].item.txt};
                if(this.curMsgObj[i].stype == "a"){
                  if(frameObjArr[j].itemArr[0].type == "blankprefix"){
                    this.curMsgObj[i].i += 1;
                  }
                  frameObjArr[j].itemArr.splice(this.curMsgObj[i].i, 0, this.changeObj);
                  console.log(frameObjArr[j].itemArr);
                }
                else{
                  for(var k=0; k<frameObjArr[j].itemArr.length; k++){
                    if(frameObjArr[j].itemArr[k].id == this.curMsgObj[i].itemid){
                      frameObjArr[j].itemArr[k] = this.changeObj;
                      console.log(frameObjArr[j].itemArr);
                      break;
                    }
                  }
                }
                frameObjArr[j].updateItem(this.changeObj, this.curMsgObj[i].i);
              }
              else if(this.curMsgObj[i].item.type.toLowerCase() == "countdowncircle" || this.curMsgObj[i].item.type.toLowerCase() == "f45countdowncircle"){
                this.changeObj = { id:this.curMsgObj[i].itemid, type:"f45countdowncircle", settings:this.curMsgObj[i].item.settings, duration:this.curMsgObj[i].item.d * 1000 };
                if(this.curMsgObj[i].stype == "a"){
                  if(frameObjArr[j].itemArr[0].type == "blankprefix"){
                    this.curMsgObj[i].i += 1;
                  }
                  frameObjArr[j].itemArr.splice(this.curMsgObj[i].i, 0, this.changeObj);
                  console.log(frameObjArr[j].itemArr);
                }
                else{
                  for(var k=0; k<frameObjArr[j].itemArr.length; k++){
                    if(frameObjArr[j].itemArr[k].id == this.curMsgObj[i].itemid){
                      frameObjArr[j].itemArr[k] = this.changeObj;
                      console.log(frameObjArr[j].itemArr);
                      break;
                    }
                  }
                }
                frameObjArr[j].updateItem(this.changeObj, this.curMsgObj[i].i);
              }
              else if(this.curMsgObj[i].item.type.toLowerCase() == "progressbar" || this.curMsgObj[i].item.type.toLowerCase() == "f45progressbar"){
                this.changeObj = { id:this.curMsgObj[i].itemid, type:"f45progressbar", settings:this.curMsgObj[i].item.settings, duration:this.curMsgObj[i].item.d * 1000 };
                if(this.curMsgObj[i].stype == "a"){
                  if(frameObjArr[j].itemArr[0].type == "blankprefix"){
                    this.curMsgObj[i].i += 1;
                  }
                  frameObjArr[j].itemArr.splice(this.curMsgObj[i].i, 0, this.changeObj);
                  console.log(frameObjArr[j].itemArr);
                }
                else{
                  for(var k=0; k<frameObjArr[j].itemArr.length; k++){
                    if(frameObjArr[j].itemArr[k].id == this.curMsgObj[i].itemid){
                      frameObjArr[j].itemArr[k] = this.changeObj;
                      console.log(frameObjArr[j].itemArr);
                      break;
                    }
                  }
                }
                frameObjArr[j].updateItem(this.changeObj, this.curMsgObj[i].i);
              }
              break;
            }
          }
        }
      }
    });
  }
}

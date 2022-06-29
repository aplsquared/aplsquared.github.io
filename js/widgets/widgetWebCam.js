class WidgetWebCam{
  constructor(prop){
    this.visibilityCssStr = "visibility:hidden;"
    this.settings = JSON.parse(prop.settings);
    this.rotateDuration = 12000;
    this.maxHeight = prop.h;
    this.prop = prop;

    this.htmStr = '<div id="' + this.prop.type + '-' + this.prop.id + '" style="width:' + this.prop.w + 'px;height:' + this.prop.h +'px"></div>';
    setTimeout(()=>{
      this.webCamFx();
    }, 100);
    return this.htmStr;
  }

  webCamFx(){
    const WebCamera = require('webcamjs');
    var enabled = false;
    if(WebCamera){
      WebCamera.reset();
      if(!enabled) {
        enabled = true;
        WebCamera.set({
          image_format: 'jpeg',
          jpeg_quality: this.settings.quality,
          // flip_horiz: true, //(mirror mode)
          constraints: {
            frameRate: this.settings.fps,
            // width: { exact: this.prop.w },
            // height: { exact: this.prop.h }
          }
        });
        WebCamera.attach('#' + this.prop.type + '-' + this.prop.id);
      }
      else {
        enabled = false;
        WebCamera.reset();
      }
    }
  }

  removeFX(){
    this.rotateDuration = this.maxHeight = null;
    this.visibilityCssStr = this.htmStr = null;
    this.settings = this.prop = null;

    this.rotateDuration = this.maxHeight = undefined;
    this.visibilityCssStr = this.htmStr = undefined;
    this.settings = this.prop = undefined;
  }
}

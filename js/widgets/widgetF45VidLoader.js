class WidgetF45VidLoader{
  constructor(prop){
    this.prop = prop;
    this.htmStr = '<div id="vid-' + this.prop.id + '" style="position:relative;margin-bottom:' + this.prop.settings.g + 'px;line-height:2px;"><video width="' + this.prop.settings.w + '" height="' + this.prop.settings.h + '" autoplay loop src="' + resourcePath + '/tp/' + this.prop.src + '"></video><div class="overlay" style="position:absolute;top:0;z-index:1;width:' + this.prop.settings.w + 'px;height:' + this.prop.settings.h + 'px;background:' + window.hexToRgbA(this.prop.settings.bg, this.prop.settings.bga) + '"></div></div>';

    return this.htmStr;
  }

  removeFx(){
    this.htmStr = null;
    this.prop = null;

    this.htmStr = undefined;
    this.prop = undefined;
  }

}

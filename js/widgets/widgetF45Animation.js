class WidgetF45Animation{
  constructor(prop){
    this.prop = prop;
    this.settings = parseJSON(prop.settings);

    this.htmStr = '<div id="' + this.prop.type + '-' + this.prop.id + '" class="f45anim" style="width:' + this.prop.w + 'px;height:' + this.prop.h + 'px;background:' + window.hexToRgbA(this.settings.bg, this.settings.bga) + '">' + this.prop.src + '</div>';
    return this.htmStr;
  }

  removeFx(){
    this.prop = this.settings = null;
    this.htmStr = null;

    this.prop = this.settings = undefined;
    this.htmStr = undefined;
  }
}

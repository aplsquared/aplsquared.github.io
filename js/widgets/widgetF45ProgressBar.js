class WidgetF45ProgressBar {
  constructor(prop){
    this.prop = prop;
    this.htmStr = "";
    this.calcH = this.prop.h;
    this.calcW = this.prop.w;
    this.settings = parseJSON(prop.settings);

    this.htmStr = `<div id="`+ this.prop.type +`-`+ this.prop.id +`" style="width:` + this.prop.w + `px;height:` + this.prop.h + `px;">`;

    this.calcH = 10 + ((this.settings.voff + this.settings.blr)*2);
    this.calcW = this.prop.w - ((this.settings.hoff + this.settings.blr + this.settings.h) * 2);

    this.htmStr += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ` + this.prop.w + ` ` + this.prop.h + `" width="` + this.prop.w + `" height="` + this.prop.h + `">
      <defs>
        <filter id="dropShadow" width="` + this.prop.w + `" height="` + this.prop.h + `">
          <feDropShadow dx="` + this.settings.hoff + `" dy="` + this.settings.voff + `" stdDeviation="` + this.settings.blr + `" flood-color="` + this.settings.glc + `"></feDropShadow>
        </filter>
      </defs>
      <g>
        <circle r="0.1" cx="0" cy="0" visibility="hidden"></circle>
        <path d="M` + this.calcW + `,` + this.calcH  + ` L` + (this.settings.blr * 2) + `,` + this.calcH  + `" stroke-width="` + (this.settings.h)  + `" stroke="` + this.settings.bg + `" stroke-linecap="round"></path>
      </g>
      <g id="Artboard" style="filter: url(#dropShadow);">
        <circle r="0.1" cx="0" cy="0" visibility="hidden"></circle>
        <path id="bar" d="M` + (this.settings.blr) + `,` + this.calcH  + ` L` + (this.settings.blr) + `,` + this.calcH  + `" stroke-width="` + (this.settings.h)  + `" stroke="` + this.settings.fill + `" stroke-linecap="round"></path>
      </g>
    </svg></div>`

    setTimeout(()=>{this.init()}, 200);

    return this.htmStr;
  }

  updateItem(obj){
    this.prop.settings = this.settings = obj.settings;
    $("#" + this.prop.type + "-" + this.prop.id + " #bar").css("background", this.settings.fill);
    $("#" + this.prop.type + "-" + this.prop.id).css("background", window.hexToRgbA(this.settings.bg, this.settings.bga));
  }

  init(){
    if(this.settings.gl){
      TweenMax.to($('#' + this.prop.type +'-'+ this.prop.id + ' #bar'), this.settings.d, {attr:{d: "M" + (this.calcW + (this.settings.blr * 2)) + "," + this.calcH  + " L" + (this.settings.blr * 2) + "," + this.calcH }, ease:"linear"});
    }
    else{
      TweenMax.to($('#' + this.prop.type +'-'+ this.prop.id + ' #bar'), this.settings.d, {width:this.prop.w, ease:"linear"});
    }
  }

  removeFx(){
    try{
      TweenMax.killTweensOf($('#' + this.prop.type +'-'+ this.prop.id + ' #bar'));
    }
    catch(e){}

    this.prop = this.settings = null;
    this.calcH = this.calcW = null;
    this.htmStr = null;

    this.prop = this.settings = undefined;
    this.calcH = this.calcW = undefined;
    this.htmStr = undefined;
  }
}

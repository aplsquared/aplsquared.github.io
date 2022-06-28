class WidgetF45ProgressBarWithBreak {
  constructor(prop){
    this.settings = parseJSON(prop.settings);
    this.curBarId = "0-0-0";
    this.hydrateArr = [];
    this.breakArr = [];
    this.barArr = [];
    this.prop = prop;
    this.fillTimer;
    this.unitW = 0;
    this.curX = 0;
    this.num = 0;

    this.hydrateArr = this.prop.items.filter(item => item.type.indexOf('Hydrate') !== -1);
    this.breakArr = this.prop.items.filter(item => item.type.indexOf('Break') !== -1);
    this.barArr = this.prop.items.filter(item => item.type.indexOf('Bar') !== -1);
    this.unitW = this.prop.w - (this.prop.h * this.hydrateArr.length);
    this.unitW = this.unitW / ((this.barArr.length * 2) + (this.breakArr.length));

    this.htmStr = '<div id="'+ this.prop.type +'-'+ this.prop.id +'" style="width:' + this.prop.w + 'px;height:' + this.prop.h + 'px;overflow:hidden;">';
    for(var i=0; i<this.prop.items.length; i++){
      if(this.prop.items[i].type == "Bar"){
        this.htmStr += '<div style="width:' + (this.unitW / 2) + 'px;height:' + this.prop.h + 'px;border-radius:' + (this.unitW / 4) + 'px;overflow:hidden;background:' + window.hexToRgbA(this.settings.bg, this.settings.bga) + ';float:left;"><div id="fill-' + i + '" style="background:#fff;height:' + this.prop.h + 'px;width:0%;"></div></div>';
      }
      else if(this.prop.items[i].type == "Break"){
        this.htmStr += '<div style="width:' + ((this.unitW * 2) + this.unitW / 2) + 'px;height:' + this.prop.h + 'px;float:left;"></div>';
      }
      else if(this.prop.items[i].type == "Hydrate"){
        this.htmStr += '<div style="width:' + (this.prop.h) + 'px;height:' + (this.prop.h) + 'px;float:left;"><svg class="hydrate" version="1.0" xmlns="http://www.w3.org/2000/svg" width="' + (this.prop.h/2) + '" height="' + (this.prop.h/2) + '" viewBox="0 0 512.000000 512.000000" style="margin-top:' + (this.prop.h/4) + 'px;margin-left:' + (this.prop.h/4) + 'px;" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="' + window.hexToRgbA(this.settings.bg, this.settings.bga) + '" stroke="none"><path d="M2475 5104 c-22 -8 -55 -29 -74 -47 -18 -17 -352 -509 -741 -1092 -745 -1119 -785 -1184 -864 -1411 -80 -233 -111 -451 -103 -714 9 -297 62 -513 192 -787 108 -226 214 -373 397 -548 137 -132 262 -220 433 -305 163 -81 268 -118 426 -154 565 -126 1162 11 1594 364 103 84 260 252 338 360 75 105 211 372 252 494 142 427 141 884 -5 1301 -76 217 -122 292 -860 1400 -389 583 -723 1074 -741 1092 -62 59 -160 78 -244 47z m689 -1534 c344 -517 619 -940 647 -997 57 -112 109 -267 135 -398 27 -135 25 -415 -4 -551 -115 -536 -456 -933 -934 -1088 -164 -53 -222 -61 -448 -61 -226 0 -284 8 -446 60 -479 156 -820 552 -936 1089 -31 144 -31 427 -1 569 31 143 71 258 129 374 31 64 280 447 650 1003 329 495 601 899 604 899 3 0 274 -404 604 -899z"/></g></svg></div>';
        i++;
      }
    }
    this.htmStr += '</div>';

    setTimeout(()=>{this.startFill()}, 50);
    return this.htmStr;
  }

  startFill(){
    if(this.prop.items[this.num].type == "Bar"){
      TweenMax.to($('#'+ this.prop.type +'-'+ this.prop.id +' #fill-'+ this.num), this.prop.items[this.num].d, {width:"100%", ease:"linear"});
    }
    if(this.num < this.prop.items.length){
      this.fillTimer = setTimeout(()=>{
        this.num++;
        this.startFill();
      }, this.prop.items[this.num].d * 1000);
      //window.addTimer(this.fillTimer, "t", this.prop.fid);
    }
  }

  removeFx(){
    if(this.fillTimer){
      clearTimeout(this.fillTimer);
      this.fillTimer = null;
      this.fillTimer = undefined;
    }

    try{
      TweenMax.killTweensOf($('#'+ this.prop.type +'-'+ this.prop.id +' #fill-'+ this.num));
    }
    catch(e){}

    this.hydrateArr = this.breakArr = this.barArr = null;
    this.unitW = this.curX = this.num = null;
    this.curBarId = this.htmStr = null;
    this.settings = this.prop = null;

    this.hydrateArr = this.breakArr = this.barArr = undefined;
    this.unitW = this.curX = this.num = undefined;
    this.curBarId = this.htmStr = undefined;
    this.settings = this.prop = undefined;
  }
}

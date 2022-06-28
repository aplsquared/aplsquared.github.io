class WidgetF45CountdownCircle {
  constructor(prop){
    this.visibilityCssStr = "visibility:hidden;"
    this.settings = parseJSON(prop.settings);
    this.curTime = new Date().getTime();
    this.maxHeight = prop.h;
    this.prop = prop;
    this.prop.startPoint = 0;

    this.ccVal = 100;
    this.timerVal = 0 + this.prop.startPoint;
    this.timerDuration = 100 / this.settings.d;
    this.unit = this.settings.d - this.prop.startPoint;

    this.spp = 100 - ((this.prop.startPoint/this.settings.d) * 100);
    if(this.spp <= 0){
      this.spp = 0;
    }

    this.htmStr = '<div id="'+ this.prop.type +'-'+ this.prop.id +'" style="width:'+ this.prop.w +'px;height:'+ this.prop.h +'px;padding:10px;background:'+ window.hexToRgbA(this.settings.bg, this.settings.bga) +'">';
      this.htmStr += `<style type="text/css">
        #`+ this.prop.type +'-'+ this.prop.id + ` .cc-chart path{fill:none;stroke-width:` + this.settings.st + `;transition:stroke-dasharray 1s linear;}
        #`+ this.prop.type +'-'+ this.prop.id + ` .cc-fill{stroke:`+this.settings.fill+`;stroke-dasharray:`+this.spp+`, 100;`;
          if(this.settings.rc){
            this.htmStr += 'stroke-linecap:round;';
          }
          // if(this.settings.gl){
          //   this.htmStr += 'filter: drop-shadow(' + this.settings.hoff + 'px ' + this.settings.voff + 'px ' + this.settings.blr + 'px ' + this.settings.glc + ');'
          // }
        this.htmStr += `}
        #`+ this.prop.type +'-'+ this.prop.id + ` .cc-bg{stroke:`+window.hexToRgbA(this.settings.barBg, this.settings.barBga)+`;stroke-dasharray:100, 100}
        #`+ this.prop.type +'-'+ this.prop.id + ` .cc-unit{position:absolute;top:45%;left:50%;transform:translate(-50%, -50%);color:`+this.settings.text+`;font-size:`+this.settings.size+`px;font-weight:bold;font-family:`+this.settings.font.value+`}
      </style>

      <div id="cc-`+ this.prop.id +`">`;
        if(this.settings.c){
          this.htmStr += `<svg class="cc-chart" viewBox="0 0 36 36" style="width:`+ (this.prop.w - 20) +`px;height:`+ (this.prop.h - 20) +`px;">
            <defs>
              <filter id="shadow">
                <feDropShadow dx="` + this.settings.hoff + `" dy="` + this.settings.voff + `" stdDeviation="` + this.settings.blr + `" flood-color="` + this.settings.glc + `"/>
              </filter>
            </defs>
            <path class="cc-bg" d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
            <path class="cc-fill" style="filter:url(#shadow);" d="M18 2.0845  a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
          </svg>`;
        }
        this.htmStr += `<div class="cc-unit">`+ this.unit +`</div></div>`;
    setTimeout(()=>{this.init()}, 200);
    return this.htmStr;
  }

  updateTimer(){
    if(this.spp > 0){
      this.unit--;
      this.timerVal++;
      this.ccVal = 100 - (this.timerDuration * this.timerVal);
      $("#"+ this.prop.type +"-"+ this.prop.id +" .cc-fill").css({"stroke-dasharray":this.ccVal+", 100"});
      if(this.unit < 0){
        this.unit = 0;
      }
      $("#"+ this.prop.type +"-"+ this.prop.id +" .cc-unit").text(this.unit+1);
    }
    else{
      if(this.ccInterval){
        clearTimeout(this.ccInterval);
      }
    }
  }

  updateItem(obj){
    this.prop.settings = this.settings = obj.settings;
    this.htmStr = `#`+ this.prop.type +'-'+ this.prop.id + ` .cc-chart path{fill:none;stroke-width:3;transition:stroke-dasharray 1s linear}
      #`+ this.prop.type +'-'+ this.prop.id + ` .cc-fill{stroke:`+this.settings.fill+`;stroke-dasharray:`+this.spp+`, 100}
      #`+ this.prop.type +'-'+ this.prop.id + ` .cc-bg{stroke:`+window.hexToRgbA(this.settings.barBg, this.settings.barBga)+`;stroke-dasharray:100, 100}
      #`+ this.prop.type +'-'+ this.prop.id + ` .cc-unit{position:absolute;top:45%;left:50%;transform:translate(-50%, -50%);color:`+this.settings.text+`;font-size:`+this.settings.size+`px;font-weight:bold;font-family:`+this.settings.font.value+`}`;
    $("#" + this.prop.type + "-" + this.prop.id + " style").empty();
    $("#" + this.prop.type + "-" + this.prop.id + " style").append(this.htmStr);
  }

  init(){
    this.htmStr = "";
    $("#"+ this.prop.type + "-" + this.prop.id).css({"background":window.hexToRgbA(this.settings.bg, this.settings.bga)});

    this.updateTimer();
    this.ccInterval = setInterval(() => {
      this.updateTimer();
    }, 1000);
    // window.addTimer(this.ccInterval, "i", this.prop.fid);
  }

  removeFx(){
    if(this.ccInterval){
      clearInterval(this.ccInterval);
      this.ccInterval = null;
      this.ccInterval = undefined;
    }

    this.curTime = this.maxHeight = this.prop.startPoint = this.ccVal = this.timerVal = this.timerDuration = this.unit = this.spp = null;
    this.visibilityCssStr = this.htmStr = null;
    this.settings = this.prop = null;

    this.curTime = this.maxHeight = this.prop.startPoint = this.ccVal = this.timerVal = this.timerDuration = this.unit = this.spp = undefined;
    this.visibilityCssStr = this.htmStr = undefined;
    this.settings = this.prop = undefined;
  }
}

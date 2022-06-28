class WidgetF45Movestation{
  constructor(prop){
    this.settings = parseJSON(prop.settings);
    this.prop = prop;

    this.htmStr = `<div id="`+ this.prop.type +'-'+ this.prop.id +`" class="m-c" style="width:`+ this.prop.w +`px;height:`+ this.prop.h +`px;background:`+ window.hexToRgbA(this.settings.bg, this.settings.bga) +`">
      <style type="text/css">
        #`+ this.prop.type +'-'+ this.prop.id +` .titleText{color:`+this.settings.text+`;font-family:`+this.settings.font.value+`;font-size:`+this.settings.size+`px}
        #`+ this.prop.type +'-'+ this.prop.id +` .arrow{fill:`+this.settings.icColor+`;opacity:1;transform:translateY(0);animation:`+ this.prop.type +'-'+ this.prop.id +`-arrow 1s infinite}
        @keyframes `+ this.prop.type +'-'+ this.prop.id +`-arrow{0%{transform:translateY(-50px);opacity:0} 50%{transform:translateY(50px);opacity:1} 75%{transform:translateY(50px);opacity:0} 100%{transform:translateY(0);opacity:0}}
      </style>
      <div style="width:`+ (this.prop.w - 60) +`px;height:`+ (this.prop.h - 60) +`px">`;
        if(this.settings.p == "t" && this.settings.txt !== ""){
          this.htmStr += `<div class="titleText" style="padding-top:10px">`+ this.settings.txt +`</div>`;
        }
        this.htmStr += `<svg class="move hide" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width:` + (this.prop.w - 60) + `px;height:` + (this.prop.h - 60) + `px;">
          <path fill="`+this.settings.icColor+`" stroke="null" d="m255.99999,10c-135.89516,0 -245.99999,110.10484 -245.99999,245.99999s110.10484,245.99999 245.99999,245.99999s245.99999,-110.10484 245.99999,-245.99999s-110.10484,-245.99999 -245.99999,-245.99999zm0,444.38708c-109.60886,0 -198.38709,-88.77822 -198.38709,-198.38709s88.77822,-198.38709 198.38709,-198.38709s198.38709,88.77822 198.38709,198.38709s-88.77822,198.38709 -198.38709,198.38709z"/>
          <path class="arrow" stroke="null" id="svg_2" d="m350.26853,239.16236l11.06696,11.14976c4.68601,4.72107 4.68601,12.35514 0,17.02598l-96.86079,97.63572c-4.68601,4.72107 -12.26338,4.72107 -16.89954,0l-96.91065,-97.63572c-4.68601,-4.72107 -4.68601,-12.35514 0,-17.02598l11.06696,-11.14976c4.73586,-4.77129 12.46279,-4.67084 17.09895,0.2009l57.22913,60.52009l0,-144.34417c0,-6.67981 5.33407,-12.05379 11.96428,-12.05379l15.95237,0c6.6302,0 11.96428,5.37398 11.96428,12.05379l0,144.34417l57.22913,-60.52009c4.63616,-4.92197 12.36309,-5.02241 17.09895,-0.2009z"/>
        </svg>`
        if(this.settings.p == "b" && this.settings.txt !== ""){
          this.htmStr += `<div class="titleText" style="position:absolute;bottom:0;right:0;left:0;padding:10px 0">`+ this.settings.txt +`</div>`;
        }
      this.htmStr += `</div>
    </div>`;
    setTimeout(()=>{this.init()}, 200);
    return this.htmStr;
  }

  init(){
    this.htmStr = "";
    $("#" + this.prop.type + "-" + this.prop.id + ' .move').css("height", this.prop.h - ($("#" + this.prop.type + "-" + this.prop.id + " .titleText").innerHeight() * 2) + "px").show();
  }

  removeFx(){
    this.settings = this.prop = null;
    this.htmStr = null;

    this.settings = this.prop = undefined;
    this.htmStr = undefined;
  }
}

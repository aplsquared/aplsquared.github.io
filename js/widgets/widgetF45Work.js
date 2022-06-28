class WidgetF45Work {
  constructor(prop){
    this.settings = parseJSON(prop.settings);
    this.prop = prop;

    this.htmStr = `<div id="`+ this.prop.type +'-'+ this.prop.id +`" class="m-c" style="width:`+ this.prop.w +`px;height:`+ this.prop.h +`px;background:`+ window.hexToRgbA(this.settings.bg, this.settings.bga) +`">
      <style type="text/css">
        #`+ this.prop.type +'-'+ this.prop.id +` .titleText{color:`+this.settings.text+`;font-family:`+this.settings.font.value+`;font-size:`+this.settings.size+`px}
        #`+ this.prop.type +'-'+ this.prop.id +` .heart{fill:`+this.settings.icColor+`;transform:translateY(0);animation:`+ this.prop.type +'-'+ this.prop.id +`-heartbeat 2s infinite}
        @keyframes `+ this.prop.type +'-'+ this.prop.id +`-heartbeat{0%{transform:scale(.75)} 20%{transform:scale(1)} 40%{transform:scale(.75)} 60%{transform:scale(1)} 80%{transform:scale(.75)}100%{transform:scale(.75)}}
      </style>
      <div style="width:`+ this.prop.w +`px;height:`+ this.prop.h +`px">`;
        if(this.settings.p == "t" && this.settings.txt !== ""){
          this.htmStr += `<div class="titleText" style="padding:10px 0">`+ this.settings.txt +`</div>`;
        }
        this.htmStr += `<svg class="heart hide" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width:` + this.prop.w + `px;height:` + this.prop.h + `px;">
            <path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path>
          </svg>`;
        if(this.settings.p == "b" && this.settings.txt !== ""){
          this.htmStr += `<div class="titleText" style="position:absolute;bottom:0;right:0;left:0;padding:10px 0">`+ this.settings.txt +`</div>`;
        }
      this.htmStr += `</div></div>`;

    setTimeout(()=>{this.init()}, 200);
    return this.htmStr;
  }

  init(){
    $("#" + this.prop.type + '-' + this.prop.id + ' .heart').css("height", this.prop.h - ($("#" + this.prop.type + "-" + this.prop.id + " .titleText").height() * 2) + "px").show();
  }

  removeFx(){
    this.settings = this.prop = null;
    this.htmStr = null;

    this.settings = this.prop = undefined;
    this.htmStr = undefined;
  }
}

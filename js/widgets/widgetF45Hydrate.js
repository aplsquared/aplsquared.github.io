class WidgetF45Hydrate{
  constructor(prop){
    this.settings = parseJSON(prop.settings);
    this.prop = prop;

    this.htmStr = `<div id="`+ this.prop.type +'-'+ this.prop.id +`" class="m-c" style="width:`+ this.prop.w +`px;height:`+ this.prop.h +`px;background:` + window.hexToRgbA(this.settings.bg, this.settings.bga) + `">
      <style type="text/css">
        #`+ this.prop.type +'-'+ this.prop.id +` .titleText{color:`+this.settings.text+`;font-family:`+this.settings.font.value+`;font-size:`+this.settings.size+`px}
        #`+ this.prop.type +'-'+ this.prop.id +` .hydrate{fill:`+this.settings.icColor+`;padding-top:10px;opacity:1;transform:translateY(0);animation:`+ this.prop.type +'-'+ this.prop.id +`-drop 1.5s infinite}
        @keyframes `+ this.prop.type +'-'+ this.prop.id +`-drop{0%{transform:translateY(-10px);opacity:0} 50%{transform:translateY(50px);opacity:1} 75%{transform:translateY(50px);opacity:0} 100%{transform:translateY(0);opacity:0}}
      </style>
      <div style="width:`+ this.prop.w +`px;height:`+ this.prop.h +`px">`;
        if(this.settings.p == "t" && this.settings.txt !== ""){
          this.htmStr += `<div class="titleText" style="padding:200px 0">`+ this.settings.txt +`</div>`;
        }
        this.htmStr += `<svg class="hydrate hide" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" style="width:` + (this.prop.w/4) + `px;height:` + (this.prop.h/4) + `px;">
          <path fill="`+this.settings.icColor+`" d="M205.22 22.09c-7.94-28.78-49.44-30.12-58.44 0C100.01 179.85 0 222.72 0 333.91 0 432.35 78.72 512 176 512s176-79.65 176-178.09c0-111.75-99.79-153.34-146.78-311.82zM176 448c-61.75 0-112-50.25-112-112 0-8.84 7.16-16 16-16s16 7.16 16 16c0 44.11 35.89 80 80 80 8.84 0 16 7.16 16 16s-7.16 16-16 16z"></path>
        </svg>`;
        if(this.settings.p == "b" && this.settings.txt !== ""){
          this.htmStr += `<div class="titleText" style="position:absolute;bottom:0;right:0;left:0;padding:0 0 200px 0">`+ this.settings.txt +`</div>`;
        }
      this.htmStr += `</div></div>`;
    setTimeout(()=>{this.init()}, 200);
    return this.htmStr;
  }

  init(){
    this.htmStr = "";
    $("#" + this.prop.type + "-" + this.prop.id + ' .hydrate').css("height", this.prop.h - 30 - ($("#" + this.prop.type + "-" + this.prop.id + " .titleText").innerHeight() * 2) + "px").show();
  }

  removeFx(){
    this.settings = this.prop = null;
    this.htmStr = null;

    this.settings = this.prop = undefined;
    this.htmStr = undefined;
  }
}

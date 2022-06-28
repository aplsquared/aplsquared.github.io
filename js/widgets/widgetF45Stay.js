class WidgetF45Stay{
  constructor(prop){
    this.settings = parseJSON(prop.settings);
    this.prop = prop;

    this.htmStr = `<div id="`+ this.prop.type +'-'+ this.prop.id +`" class="m-c" style="width:`+ this.prop.w +`px;height:`+ this.prop.h +`px;background:`+ window.hexToRgbA(this.settings.bg, this.settings.bga) +`">
      <style type="text/css">
        #`+ this.prop.type +'-'+ this.prop.id +` .titleText{color:`+this.settings.text+`;font-family:`+this.settings.font.value+`;font-size:`+this.settings.size+`px}
        #`+ this.prop.type +'-'+ this.prop.id +` .stay path{fill:`+this.settings.icColor+`;transform-origin:center}
        #`+ this.prop.type +'-'+ this.prop.id +` .effect{animation:`+ this.prop.type +'-'+ this.prop.id +`-stay 2s infinite}
        #`+ this.prop.type +'-'+ this.prop.id +` .hand{animation:`+ this.prop.type +'-'+ this.prop.id +`-zoonInOut 2s infinite}
        @keyframes `+ this.prop.type +'-'+ this.prop.id +`-stay{0%{transform:scale(0.8);opacity:0.5;} 100%{transform:scale(1);opacity:0}}
        @keyframes `+ this.prop.type +'-'+ this.prop.id +`-zoonInOut{0%{transform:scale(0.3) translate(5%, 0)} 50%{transform:scale(0.4) translate(5%, 0)} 100%{transform:scale(0.3) translate(5%, 0)}}
      </style>`;

      if(this.settings.dType == "hf"){
        this.htmStr += `<div style="width:`+ (this.prop.w - 60) +`px;height:`+ (this.prop.h - 60) +`px;">`;
      }
      else{
        this.htmStr += `<div style="width:`+ (this.prop.w - 60) +`px;height:`+ (this.prop.h - 60) +`px">`;
      }
        if(this.settings.p == "t" && this.settings.txt !== "" && this.settings.dType !== "hwt" && this.settings.dType !== "hf"){
          this.htmStr += `<div class="titleText" style="padding:10px 0">`+ this.settings.titleText +`</div>`;
        }
        this.htmStr += `<svg class="stay hide" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" style="width:` + this.prop.w + `px;height:` + this.prop.h + `px;">`;
          if(this.settings.dType == "hf"){
            this.htmStr += `<path d="M441.5 39.8C432.9 25.1 417.1 16 400 16H176c-17.1 0-32.9 9.1-41.5 23.8l-112 192c-8.7 14.9-8.7 33.4 0 48.4l112 192c8.6 14.7 24.4 23.8 41.5 23.8h224c17.1 0 32.9-9.1 41.5-23.8l112-192c8.7-14.9 8.7-33.4 0-48.4l-112-192z"></path>`;
          } else{
            this.htmStr += `<path style="transform:scale(.80);" d="M441.5 39.8C432.9 25.1 417.1 16 400 16H176c-17.1 0-32.9 9.1-41.5 23.8l-112 192c-8.7 14.9-8.7 33.4 0 48.4l112 192c8.6 14.7 24.4 23.8 41.5 23.8h224c17.1 0 32.9-9.1 41.5-23.8l112-192c8.7-14.9 8.7-33.4 0-48.4l-112-192zM400 448H176L64 256 176 64h224l112 192-112 192z"></path>`;
            this.htmStr += `<path class="effect" d="M441.5 39.8C432.9 25.1 417.1 16 400 16H176c-17.1 0-32.9 9.1-41.5 23.8l-112 192c-8.7 14.9-8.7 33.4 0 48.4l112 192c8.6 14.7 24.4 23.8 41.5 23.8h224c17.1 0 32.9-9.1 41.5-23.8l112-192c8.7-14.9 8.7-33.4 0-48.4l-112-192zM400 448H176L64 256 176 64h224l112 192-112 192z"></path>`;
          }
          if(this.settings.dType == "hwh"){
            this.htmStr += `<path class="hand" d="M408.781 128.007C386.356 127.578 368 146.36 368 168.79V256h-8V79.79c0-22.43-18.356-41.212-40.781-40.783C297.488 39.423 280 57.169 280 79v177h-8V40.79C272 18.36 253.644-.422 231.219.007 209.488.423 192 18.169 192 40v216h-8V80.79c0-22.43-18.356-41.212-40.781-40.783C121.488 40.423 104 58.169 104 80v235.992l-31.648-43.519c-12.993-17.866-38.009-21.817-55.877-8.823-17.865 12.994-21.815 38.01-8.822 55.877l125.601 172.705A48 48 0 0 0 172.073 512h197.59c22.274 0 41.622-15.324 46.724-37.006l26.508-112.66a192.011 192.011 0 0 0 5.104-43.975V168c.001-21.831-17.487-39.577-39.218-39.993z"></path>`;
          } else if(this.settings.dType == "hwt"){
            this.htmStr += `<text x="50%" y="50%" alignment-baseline="central" text-anchor="middle" style="fill:`+this.settings.text+`;font-family:`+this.settings.font.value+`;font-size:`+(this.settings.size/1.8)+`px;">`+ this.settings.txt +`</text>`;
          }
        `</svg>`;
        if(this.settings.p == "b" && this.settings.txt !== "" && this.settings.dType !== "hwt" && this.settings.dType !== "hf"){
          this.htmStr += `<div class="titleText" style="position:absolute;bottom:0;right:0;left:0;padding:10px 0">`+ this.settings.txt +`</div>`;
        }
      this.htmStr += `</div></div>`;
    setTimeout(()=>{this.init()}, 200);
    return this.htmStr;
  }

  init(){
    $("#" + this.prop.type + '-' + this.prop.id + ' .stay').css("height", this.prop.h - ($("#" + this.prop.type + "-" + this.prop.id + " .titleText").height() * 2) + "px").show();
  }

  removeFx(){
    this.settings = this.prop = null;
    this.htmStr = null;

    this.settings = this.prop = undefined;
    this.htmStr = undefined;
  }
}

class WidgetUnisys {
  constructor(prop) {
    this.settings = JSON.parse(prop.settings);
    this.maxH = parseInt(prop.h);
    this.rotateTime = 12000;
    this.isBing = false;
    this.stackArr = [];
    this.apiPath = "";
    this.curArr = [];
    this.rotateTimer;
    this.prop = prop;
    this.desc = "";
    this.key = "";
    this.num = 0;
    this.feed;

    this.env = [{env:"trd", url:"https://dcl-dev.idxtest.com/rest/v1/DisneyCruise/digitalsignage?$sort=reservation", key:"ckx5uDb1wfgUGurIVtkLkA"},
    {env:"trp", url:"https://dcl.idxtest.com/rest/v1/DisneyCruise/digitalsignage?$sort=reservation", key:"RKmaBhqP77mgrzid6vt9_Q"},
    {env:"sd", url:"https://disney-app-dev-vinyl.idxtest.com/rest/v1/DisneyCruise/digitalsignage?$sort=reservation", key:"dpEXVujKLZew-qOU3oQJZg"},
    {env:"sp", url:"https://disney.idxtest.com/rest/v1/DisneyCruise/digitalsignage?$sort=reservation", key:"rp23Zub5-Ihh2DgTtLVkfw"}];

    for(var i=0; i<this.env.length; i++){
      if(this.env[i].env == this.prop.src){
        this.apiPath = this.env[i].url;
        this.key = this.env[i].key;
        break;
      }
    }

    if(this.settings.rotationOpt == "c"){
      this.rotateTime = this.settings.rotate * 1000;
    }

    this.htmStr = '<div id="' + this.prop.type + '-' + this.prop.id + '" style="width:'+ this.prop.w +'px;height:'+ this.prop.h +'px;background:' + window.hexToRgbA(this.settings.bg, this.settings.bga) + '">';
    // this.htmStr += '<style type="text/css">#' + this.prop.type + '-' + this.prop.id + ' #item-list>div{padding:10px;background:' + window.hexToRgbA(this.settings.rowBg, this.settings.rowBga) + ';font-family:' + this.settings.rowFont.value + ';}#' + this.prop.type + '-' + this.prop.id + ' #item-list>div:nth-child(even){background:' + window.hexToRgbA(this.settings.altBg, this.settings.altBga) + ';font-family:' + this.settings.altRowFont.value + ';}#' + this.prop.type + '-' + this.prop.id + ' #item-list>div .title{color:' + this.settings.titleText + ';font-size:' + this.settings.titleSize + 'px;font-weight:bold;margin-bottom:8px;}#' + this.prop.type + '-' + this.prop.id + ' #item-list>div:nth-child(even) .title{color:' + this.settings.altTitleText + ';}#' + this.prop.type + '-' + this.prop.id + ' #item-list>div .subtitle{color:' + this.settings.subtitleText + ';font-size:' + this.settings.subtitleSize + 'px;float:none;font-weight:normal;margin-left:10px;}#' + this.prop.type + '-' + this.prop.id + ' #item-list>div:nth-child(even) .subtitle{color:' + this.settings.altSubtitleText + ';}#' + this.prop.type + '-' + this.prop.id + ' #item-list>div .desc{color:' + this.settings.descText + ';font-size:' + this.settings.descSize + 'px;}#' + this.prop.type + '-' + this.prop.id + ' #item-list>div:nth-child(even) .desc{color:' + this.settings.altDescText + ';}</style>';

    this.htmStr += '<div id="header" style="padding:20px;text-align:center;background:' + window.hexToRgbA(this.settings.headerBg, this.settings.headerBga) + ';font-family:' + this.settings.headerFont.value + ';font-size:' + this.settings.headerSize + 'px;color:' + this.settings.headerText + ';"><span id="cruise"></span></div>';

    this.htmStr += '<div id="item-list-container"></div></div>';
    setTimeout(()=>{this.init()}, 200);
    return this.htmStr;
  }

  init(){
    this.loadLiveFeed();
    this.refreshTimer = setInterval(()=>{this.loadLiveFeed();}, 60000);
    //window.addTimer(this.refreshTimer, "i", this.prop.fid);
  }

  loadLiveFeed(){
    // $.ajaxSetup({headers:{'X-APi-Key': this.key}});

    $.get({url:this.apiPath + "&location=" + this.prop.location, headers:{'X-APi-Key':this.key}}, (data)=>{
      this.feed = [];
      for(var i=0; i<data.items.length; i++){
        if(data.items[i].embarkationLane !== null){
          this.feed.push({reservation:data.items[i].reservation, cruise:data.items[i].cruiseNo, lane:data.items[i].embarkationLane});
        }
        else if(data.items[i].debarkationLane !== null){
          this.feed.push({reservation:data.items[i].reservation, cruise:data.items[i].cruiseNo, lane:data.items[i].debarkationLane});
        }
      }
      if(this.feed.length > 0){
        $("#" + this.prop.type + '-' + this.prop.id + " #item-list-container").empty();
        $("#" + this.prop.type + '-' + this.prop.id + " #cruise").text("DISNEY DREAM CRUISE #" + this.feed[0].cruise);
        this.stackListItems();
      }
      else{
        $("#" + this.prop.type + '-' + this.prop.id + " #item-list-container").empty();
      }
    });
  }

  stackListItems(){
    console.log(this.prop.h - $("#" + this.prop.type + '-' + this.prop.id + " #header").outerHeight());
    // this.stackArr = [];
    // this.curArr = [];
    // $("#" + this.prop.type + '-' + this.prop.id + " #item-list-container").empty().append('<div id="item-list"></div>');
    // for(var i=0; i<this.feed.items.length; i++){
    //   this.htmStr = '<div>';
    //   if(this.feed.items[i].img != ""){
    //     this.htmStr += '<img class="' + this.prop.type + '-avatar" src="'+ this.feed.items[i].img +'">';
    //   }
    //   this.htmStr += '<div class="title">' + this.feed.items[i].title;
    //   if(this.prop.type == "twitter"){
    //     this.htmStr += '<span class="subtitle">@' + this.prop.filename  + ' - ' + this.feed.items[i].date + '</span>';
    //   }
    //   this.htmStr += '</div><div class="desc">' + this.feed.items[i].desc + '</div></div>';
    //   $("#" + this.prop.type + '-' + this.prop.id + " #item-list").append(this.htmStr);
    //   if($("#" + this.prop.type + '-' + this.prop.id + " #item-list").outerHeight() > this.maxH){
    //     if(this.curArr.length > 0){
    //       this.stackArr.push(this.curArr);
    //       this.curArr = [];
    //       this.curArr.push(i);
    //       $("#" + this.prop.type + '-' + this.prop.id + " #item-list-container").empty().append('<div id="item-list" style="visibility:hidden"></div>');
    //       $("#" + this.prop.type + '-' + this.prop.id + " #item-list").append(this.htmStr);
    //     }
    //     else{
    //       console.log("height is too low to accomodate even single item.");
    //     }
    //   }
    //   else{
    //     this.curArr.push(i);
    //   }
    // }
    // if(this.curArr.length > 0){
    //   this.stackArr.push(this.curArr);
    // }
    // if(this.rotateTimer){
    //   clearInterval(this.rotateTimer);
    // }
    // if(this.stackArr.length > 1){
    //   $("#" + this.prop.type + '-' + this.prop.id + " #item-list-container").empty();
    //   this.listStyle = "opacity:0;";
    //   this.htmStr = "";
    //   this.num = 0;
    //   if(this.prop.transition == "n"){
    //     this.listStyle = "visibility:hidden;";
    //   }
    //   for(var i=0; i<this.stackArr.length; i++){
    //     if(i == 0){
    //       this.htmStr += '<div id="item-list" class="list-' + i + '" style="position:absolute;width:' + this.prop.w + 'px;">';
    //     }
    //     else{
    //       this.htmStr += '<div id="item-list" class="list-' + i + '" style="position:absolute;width:' + this.prop.w + 'px;' + this.listStyle + '">';
    //     }
    //     for(var j=0; j<this.stackArr[i].length; j++){
    //       this.htmStr += '<div>';
    //       if(this.feed.items[this.stackArr[i][j]].img != ""){
    //         this.htmStr += '<img class="' + this.prop.type + '-avatar" src="'+ this.feed.items[this.stackArr[i][j]].img +'">';
    //       }
    //       this.htmStr += '<div class="title">' + this.feed.items[this.stackArr[i][j]].title;
    //       if(this.prop.type == "twitter"){
    //         this.htmStr += '<span class="subtitle">@' + this.prop.filename  + ' - ' + this.feed.items[this.stackArr[i][j]].date + '</span>';
    //       }
    //       this.htmStr += '</div><div class="desc">' + this.feed.items[this.stackArr[i][j]].desc + '</div></div>';
    //     }
    //     this.htmStr += '</div>';
    //   }
    //   $("#" + this.prop.type + '-' + this.prop.id + " #item-list-container").append(this.htmStr);
    //   this.rotateTimer = setInterval(()=>{
    //     if(this.prop.transition == "f"){
    //       $("#" + this.prop.type + '-' + this.prop.id + " #item-list-container #item-list.list-" + this.num).css({"opacity":0});
    //     }
    //     else{
    //       $("#" + this.prop.type + '-' + this.prop.id + " #item-list-container #item-list.list-" + this.num).css({"visibility":"hidden"});
    //     }
    //     this.num++;
    //     if(this.num >= this.stackArr.length){
    //       this.num = 0;
    //     }
    //     if(this.prop.transition == "f"){
    //       TweenMax.to($("#" + this.prop.type + '-' + this.prop.id + " #item-list-container #item-list.list-" + this.num), 0.5, {opacity:1});
    //     }
    //     else{
    //       $("#" + this.prop.type + '-' + this.prop.id + " #item-list-container #item-list.list-" + this.num).css("visibility", "visible");
    //     }
    //   }, this.rotateTime);
    //   window.addTimer(this.rotateTimer, "i", this.prop.fid);
    // }
  }

  removeFx(){
    if(this.rotateTimer){
      clearInterval(this.rotateTimer);
    }
    clearInterval(this.refreshTimer);

    this.apiPath = this.desc = this.key = this.htmStr = null;
    this.stackArr = this.curArr = this.env = null;
    this.maxH = this.rotateTime = this.num = null;
    this.prop = this.settings = this.feed = null;
    this.refreshTimer = null;
    this.rotateTimer = null;
    this.isBing = null;

    this.apiPath = this.desc = this.key = this.htmStr = undefined;
    this.stackArr = this.curArr = this.env = undefined;
    this.maxH = this.rotateTime = this.num = undefined;
    this.prop = this.settings = this.feed = undefined;
    this.refreshTimer = undefined;
    this.rotateTimer = undefined;
    this.isBing = undefined;
  }
}

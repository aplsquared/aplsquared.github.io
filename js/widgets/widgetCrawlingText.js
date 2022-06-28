class WidgetCrawlingText{
  constructor(prop){
    this.settings = JSON.parse(prop.settings);
    this.txtDir = "left";
    this.isBing = false;
    this.duration = 20;
    this.refreshTimer;
    this.prop = prop;
    this.feed;

    if(this.settings.dir){
      this.txtDir = this.settings.dir == "bt"?"up":"left";
    }

    if(this.prop.filename.split("-")[0] == "Bing"){
      this.isBing = true;
    }

    this.htmStr = '<div id="'+ this.prop.type +'-'+ this.prop.id +'" style="width:'+ this.prop.w +'px;height:'+ this.prop.h +'px;background:'+ window.hexToRgbA(this.settings.bg, this.settings.bga) +';font-family:' + this.settings.font.value +'"></div>';
    setTimeout(()=>{this.init()}, 200);
    return this.htmStr;
  }

  init(){
    if(this.prop.type == "crawlingtext"){
      this.loadLiveFeed();
    }
    else{
      if(fs.existsSync(resourcePath + "/local/text" + this.prop.id + "-" + this.prop.filename + ".json")){
        this.fileStats = fs.statSync(resourcePath + "/local/" + this.prop.id + "-" + this.prop.filename + ".json");
        if(((new Date().getTime() - new Date(this.fileStats.mtime).getTime())/1000) > 900){
          fs.unlinkSync(resourcePath + "/local/" + this.prop.id + "-" + this.prop.filename + ".json");
          this.loadLiveFeed();
        }
        else{
          this.loadLocalFeed();
        }
      }
      else{
        this.loadLiveFeed();
      }
    }
  }

  loadLocalFeed(){
    var feedObj = {title:"", logo:"", items:[]};
    $.get(resourcePath + "/local/" + this.prop.id + "-" + this.prop.filename + ".json", (data)=>{
      feedObj = JSON.parse(data);
      if(feedObj.items.length > 0){
        this.feed = feedObj;
        feedObj = null;
        this.loadHtmlFx();
      }
    })
    .fail(function(){
      this.loadLiveFeed();
    });

    if(this.refreshTimer){
      window.clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
    this.refreshTimer = setTimeout(()=>{this.loadLiveFeed();}, 900000);
    //window.addTimer(this.refreshTimer, "t", this.prop.fid);
  }

  loadLiveFeed(){
    var feedObj = {title:"", logo:"", items:[]};
    if(this.prop.type == "news" || this.prop.type == "rss"){
      if(this.isBing){
        this.apiPath = apiPath + "/bingnews/" + this.prop.id.split("-")[2] + "?" + new Date().getTime();
      }
      else{
        this.apiPath = apiPath + "/reverseCall?url=" + this.prop.src + "&" + new Date().getTime();
      }
    }
    else if(this.prop.type == "twitter" || this.prop.type == "instagram" || this.prop.type == "facebook" || this.prop.type == "crawlingtext"){
      this.apiPath = apiPath + "/" + this.prop.type + "/" +  this.prop.id.split("-")[2] + "?format=json&" + new Date().getTime();
    }
    $.get(this.apiPath, (data)=>{
      if(this.prop.type == "news" || this.prop.type == "rss"){
        if(this.isBing){
          feedObj.title = this.prop.provider;
          feedObj.logo = "";
          for(var i=0; i<data.news.length; i++){
            feedObj.items.push({img:"", title:data.news[i].title, desc:data.news[i].desc, date:""});
          }
        }
        else{
          data = $.parseXML(data);
          feedObj.title = $(data).find('rss channel > title').text();
          feedObj.logo = $(data).find('rss channel > image url').text();
          $(data).find('rss channel item').each(function(){
            feedObj.items.push({img:"", title:$(this).find('title').text(), desc:$('<span>').html($(this).find('description').text()).find('img').remove().end().text(), date:""});
          });
        }
      }
      else if(this.prop.type == "twitter"){
        feedObj.title = data.tweet[0].title;
        feedObj.logo = "";
        for(var i=0; i<data.tweet.length; i++){
          feedObj.items.push({img:data.tweet[i].img, title:data.tweet[i].title, desc:data.tweet[i].desc, date:data.tweet[i].date});
        }
      }
      else if(this.prop.type == "instagram"){
        feedObj.title = data.info[0].label;
        feedObj.logo = "";
        for(var i=0; i<data.gallery.length; i++){
          feedObj.items.push({img:data.gallery[i].thumb, title:data.gallery[i].msg, desc:"", date:""});
        }
      }
      else if(this.prop.type == "facebook"){
        feedObj.title = data.facebook.info.name;
        feedObj.logo = "";
        for(var i=0; i<data.facebook.gallery.length; i++){
          feedObj.items.push({img:data.facebook.gallery[i].thumb, title:data.facebook.gallery[i].msg, desc:"", date:""});
        }
      }
      else if(this.prop.type == "crawlingtext"){
        feedObj.title = "";
        feedObj.logo = "";
        for(var i=0; i<data.channel.length; i++){
          feedObj.items.push({img:"", title:data.channel[i].title, desc:"", date:""});
        }
      }

      if(feedObj.items.length > 0){
        fs.writeFile(resourcePath + "/local/" + this.prop.id + "-" + this.prop.filename + ".json", JSON.stringify(feedObj), (err) => { if(err)throw err; });
        this.feed = feedObj;
        feedObj = null;
        this.loadHtmlFx();
      }

      if(this.refreshTimer){
        window.clearTimeout(this.refreshTimer);
        this.refreshTimer = null;
      }
      this.refreshTimer = setTimeout(()=>{this.loadLiveFeed();}, 900000);
      //window.addTimer(this.refreshTimer, "t", this.prop.fid);

    })
    .fail(function(){
      if(this.refreshTimer){
        window.clearTimeout(this.refreshTimer);
        this.refreshTimer = null;
      }
      this.refreshTimer = setTimeout(()=>{this.loadLiveFeed();}, 30000);
      //window.addTimer(this.refreshTimer, "t", this.prop.fid);
    });
  }

  loadHtmlFx(){
    this.htmStr = "";
    $("#" + this.prop.type + "-" + this.prop.id).empty();
    this.textFontSize = (this.settings.dir == "bt" || this.settings.fontSizeOpt == "c")?this.settings.fontSize:(this.prop.h - this.prop.h/3.4);
    if(this.txtDir == "up"){
      this.htmStr += '<div style="font-size:'+ this.textFontSize +'px;font-weight:bold;color:'+ this.settings.titleText +';">';
      this.htmStr += '<div class="marquee text-'+ this.settings.align +'" style="height:'+ this.prop.h +'px">';
    }
    else{
      this.htmStr += '<div style="font-size:'+ this.textFontSize +'px;font-weight:bold;color:'+ this.settings.titleText +';white-space:nowrap;">';
      this.htmStr += '<div class="marquee" style="height:'+ this.prop.h +'px;line-height:'+ (this.prop.h - this.prop.h/22) +'px;">';
    }
    for(var i=0; i<this.feed.items.length; i++){
      if(this.txtDir == "left"){
        this.htmStr += '<span><span class="bull">&#9724;</span> '+ this.feed.items[i].title +' </span>'
      }
      else{
        this.htmStr += '<div class="marB20 pad5">'+ this.feed.items[i].title +'</div>';
      }
    }
    this.htmStr += '</div></div>';
    $("#" + this.prop.type + "-" + this.prop.id).append(this.htmStr);

    if(this.txtDir == "left"){
      this.elemW = parseInt($("#" + this.prop.type + "-" + this.prop.id + " .marquee")[0].scrollWidth);
      this.duration = parseInt(this.elemW/this.settings.speed);
      this.htmStr = '<style type="text/css">#' + this.prop.type + '-'+ this.prop.id + ' .bull{color:'+ this.settings.bullet +'} #' + this.prop.type + '-' + this.prop.id + ' .marquee{position:relative;animation-name:' + this.prop.type + '-' + this.prop.id + '-marqueeanim;animation-duration:' + this.duration + 's;animation-iteration-count:infinite;animation-timing-function:linear;}@keyframes ' + this.prop.type + '-' + this.prop.id + '-marqueeanim{from{margin-left:' + this.prop.w + 'px;}to{margin-left:-' + this.elemW + 'px;}}</style>';
    }
    else{
      this.elemH = parseInt($("#" + this.prop.type + "-" + this.prop.id + " .marquee")[0].scrollHeight);
      this.duration = parseInt(this.elemH/this.settings.speed);
      this.htmStr = '<style type="text/css">#' + this.prop.type + '-' + this.prop.id + ' .marquee{position:relative;animation-name:' + this.prop.type + '-' + this.prop.id + '-marqueeanim;animation-duration:' + this.duration + 's;animation-iteration-count:infinite;animation-timing-function:linear;}@keyframes ' + this.prop.type + '-' + this.prop.id + '-marqueeanim{from{top:' + this.prop.h + 'px;}to{top:-' + this.elemH + 'px;}}</style>';
    }

    $("#" + this.prop.type + "-" + this.prop.id).append(this.htmStr);
  }

  removeFx(){
    if(this.refreshTimer){
      clearTimeout(this.refreshTimer);
    }

    this.refreshTimer = null;
    this.settings = null;
    this.duration = null;
    this.txtDir = null;
    this.isBing = null;
    this.prop = null;
    this.feed = null;

    this.refreshTimer = undefined;
    this.settings = undefined;
    this.duration = undefined;
    this.txtDir = undefined;
    this.isBing = undefined;
    this.prop = undefined;
    this.feed = undefined;
  }
}

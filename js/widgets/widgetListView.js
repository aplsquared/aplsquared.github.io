class WidgetListView {
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
    this.fileStats;
    this.desc = "";
    this.num = 0;
    this.feed;

    if(this.prop.filename.split("-")[0] == "Bing"){
      this.isBing = true;
    }

    if(this.settings.rotationOpt == "c"){
      this.rotateTime = this.settings.rotate * 1000;
    }

    this.htmStr = '<div id="' + this.prop.type + '-' + this.prop.id + '" style="width:'+ this.prop.w +'px;height:'+ this.prop.h +'px;background:' + window.hexToRgbA(this.settings.bg, this.settings.bga) + '">';
    this.htmStr += '<style type="text/css">#' + this.prop.type + '-' + this.prop.id + ' #item-list>div{padding:10px;background:' + window.hexToRgbA(this.settings.rowBg, this.settings.rowBga) + ';font-family:' + this.settings.rowFont.value + ';}#' + this.prop.type + '-' + this.prop.id + ' #item-list>div:nth-child(even){background:' + window.hexToRgbA(this.settings.altBg, this.settings.altBga) + ';font-family:' + this.settings.altRowFont.value + ';}#' + this.prop.type + '-' + this.prop.id + ' #item-list>div .title{color:' + this.settings.titleText + ';font-size:' + this.settings.titleSize + 'px;font-weight:bold;margin-bottom:8px;}#' + this.prop.type + '-' + this.prop.id + ' #item-list>div:nth-child(even) .title{color:' + this.settings.altTitleText + ';}#' + this.prop.type + '-' + this.prop.id + ' #item-list>div .subtitle{color:' + this.settings.subtitleText + ';font-size:' + this.settings.subtitleSize + 'px;float:none;font-weight:normal;margin-left:10px;}#' + this.prop.type + '-' + this.prop.id + ' #item-list>div:nth-child(even) .subtitle{color:' + this.settings.altSubtitleText + ';}#' + this.prop.type + '-' + this.prop.id + ' #item-list>div .desc{color:' + this.settings.descText + ';font-size:' + this.settings.descSize + 'px;}#' + this.prop.type + '-' + this.prop.id + ' #item-list>div:nth-child(even) .desc{color:' + this.settings.altDescText + ';}</style>';
    if(this.settings.hTextOpt != "n"){
      this.htmStr += '<div style="padding:4px 10px;background:' + window.hexToRgbA(this.settings.headerBg, this.settings.headerBga) + ';font-family:' + this.settings.headerFont.value + ';font-size:' + this.settings.headerSize + 'px;color:' + this.settings.headerText + ';font-weight:bold;">';
      if(this.prop.type == "twitter"){
        this.htmStr += '<svg style="fill:'+ this.settings.headerText +';height:' + this.settings.headerSize + 'px;" class="marR10 vAlign-m" xmlns="https://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="M512,97.248c-19.04,8.352-39.328,13.888-60.48,16.576c21.76-12.992,38.368-33.408,46.176-58.016 c-20.288,12.096-42.688,20.64-66.56,25.408C411.872,60.704,384.416,48,354.464,48c-58.112,0-104.896,47.168-104.896,104.992 c0,8.32,0.704,16.32,2.432,23.936c-87.264-4.256-164.48-46.08-216.352-109.792c-9.056,15.712-14.368,33.696-14.368,53.056 c0,36.352,18.72,68.576,46.624,87.232c-16.864-0.32-33.408-5.216-47.424-12.928c0,0.32,0,0.736,0,1.152 c0,51.008,36.384,93.376,84.096,103.136c-8.544,2.336-17.856,3.456-27.52,3.456c-6.72,0-13.504-0.384-19.872-1.792 c13.6,41.568,52.192,72.128,98.08,73.12c-35.712,27.936-81.056,44.768-130.144,44.768c-8.608,0-16.864-0.384-25.12-1.44 C46.496,446.88,101.6,464,161.024,464c193.152,0,298.752-160,298.752-298.688c0-4.64-0.16-9.12-0.384-13.568 C480.224,136.96,497.728,118.496,512,97.248z" data-original="#03A9F4" data-old_color="#1da1f2"/></g></svg>';
      }
      else if(this.prop.type == "instagram"){
        this.htmStr += '<svg style="fill:'+ this.settings.headerText +';height:' + this.settings.headerSize + 'px;" class="marR10 vAlign-m" xmlns="https://www.w3.org/2000/svg" viewBox="0 0 50 50"><g><path style="fill:{{info.path}};" d="M24.825,29.796c2.739,0,4.972-2.229,4.972-4.97c0-1.082-0.354-2.081-0.94-2.897c-0.903-1.252-2.371-2.073-4.029-2.073 c-1.659,0-3.126,0.82-4.031,2.072c-0.588,0.816-0.939,1.815-0.94,2.897C19.854,27.566,22.085,29.796,24.825,29.796z"/> <polygon style="fill:{{info.path}};" points="35.678,18.746 35.678,14.58 35.678,13.96 35.055,13.962 30.891,13.975 30.907,18.762"/> <path style="fill:{{info.path}};" d="M24.826,0C11.137,0,0,11.137,0,24.826c0,13.688,11.137,24.826,24.826,24.826c13.688,0,24.826-11.138,24.826-24.826 C49.652,11.137,38.516,0,24.826,0z M38.945,21.929v11.56c0,3.011-2.448,5.458-5.457,5.458H16.164 c-3.01,0-5.457-2.447-5.457-5.458v-11.56v-5.764c0-3.01,2.447-5.457,5.457-5.457h17.323c3.01,0,5.458,2.447,5.458,5.457V21.929z"/> <path d="M32.549,24.826c0,4.257-3.464,7.723-7.723,7.723c-4.259,0-7.722-3.466-7.722-7.723c0-1.024,0.204-2.003,0.568-2.897 h-4.215v11.56c0,1.494,1.213,2.704,2.706,2.704h17.323c1.491,0,2.706-1.21,2.706-2.704v-11.56h-4.217 C32.342,22.823,32.549,23.802,32.549,24.826z"/></g></svg>';
      }
      else if(this.prop.type == "facebook"){
        this.htmStr += '<svg style="fill:'+ this.settings.headerText +';height:' + this.settings.headerSize + 'px;" class="marR10 vAlign-m" xmlns="https://www.w3.org/2000/svg" viewBox="0 0 456 456"><g><path style="fill:{{info.path}};" d="M0,0v455.73h242.704V279.691h-59.33v-71.864h59.33v-60.353c0-43.893,35.582-79.475,79.475-79.475 h62.025v64.622h-44.382c-13.947,0-25.254,11.307-25.254,25.254v49.953h68.521l-9.47,71.864h-59.051V455.73H455.73V0H0z"/></g></svg>';
      }
      else if(this.prop.type == "fbworkplace"){
        this.htmStr += '<svg style="fill:'+ this.settings.headerText +';height:' + this.settings.headerSize + 'px;" class="marR10 vAlign-m" xmlns="https://www.w3.org/2000/svg" viewBox="0 0 24 24"><g><path style="fill:{{info.path}};" d="M12,0A12,12,0,1,0,24,12,12,12,0,0,0,12,0Zm6.37,15.84a2,2,0,0,1-1.47.66h-.35a2,2,0,0,1-1.86-1.34l-.76-2.28-1.09,2.46a2,2,0,0,1-1.79,1.16,2,2,0,0,1-1.88-1.26L7,9.68A.5.5,0,0,1,7.5,9h2a.5.5,0,0,1,.47.34l1.09,3.28,1.09-2.46a2,2,0,0,1,3.65.18L16.69,13A3.28,3.28,0,0,0,17,11.5C16.74,8.07,14.87,6,12,6a6,6,0,0,0-6,6.65,6.11,6.11,0,0,0,3.28,4.66,5.61,5.61,0,0,0,4.07.53.49.49,0,0,1,.43.09.5.5,0,0,1,.19.39v2a.5.5,0,0,1-.41.49A9,9,0,0,1,12,21a8.86,8.86,0,0,1-6.25-2.89A8.55,8.55,0,0,1,3,12a9,9,0,0,1,9-9c4.49,0,7.7,3.4,8,8.47A6.59,6.59,0,0,1,18.37,15.84Z"/></g></svg>';
      }
      this.htmStr += '<span id="headerTxt">' + this.settings.hText + '</span></div>';
    }
    this.htmStr += '<div id="item-list-container"></div></div>';
    setTimeout(()=>{this.init()}, 200);
    return this.htmStr;
  }

  init(){
    if(fs.existsSync(resourcePath + "/local/" + this.prop.id + "-" + this.prop.dtype + "-" + this.prop.filename + ".json")){
      this.fileStats = fs.statSync(resourcePath + "/local/" + this.prop.id + "-" + this.prop.dtype + "-" + this.prop.filename + ".json");
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
    this.refreshTimer = setInterval(()=>{this.loadLiveFeed();}, 300000);
    //window.addTimer(this.refreshTimer, "i", this.prop.fid);
  }

  loadLocalFeed(){
    var feedObj = {title:"", logo:"", items:[]};
    $.get(resourcePath + "/local/" + this.prop.id + "-" + this.prop.dtype + "-" + this.prop.filename + ".json", (data)=>{
      feedObj = JSON.parse(data);
      if(feedObj.items.length > 0){
        this.feed = feedObj;
        feedObj = null;
        if(this.settings.hTextOpt == "a"){
          $("#" + this.prop.type + "-" + this.prop.id + " #headerTxt").text(this.feed.title);
        }
        if($("#" + this.prop.type + "-" + this.prop.id + " #headerTxt").length > 0){
          this.maxH = this.prop.h - $("#" + this.prop.type + "-" + this.prop.id + " #headerTxt").outerHeight();
        }
        this.stackListItems();
      }
    })
    .fail(function(){
      this.loadLiveFeed();
    });
  }

  loadLiveFeed(){
    var feedObj = {title:"", logo:"", items:[]};
    if(this.prop.type == "news" || this.prop.type == "rss"){
      if(this.isBing){
        this.apiPath = apiPath + "/bingnews/" + this.prop.id.split("-")[2] + "?" + new Date().getTime();
      }
      else{
        this.apiPath = apiPath + "/reverseCall?url="+ this.prop.src + "&" + new Date().getTime();
      }
    }
    else{
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
          if(data.gallery[i].msg && data.gallery[i].msg != ""){
            feedObj.items.push({img:data.gallery[i].thumb, title:data.gallery[i].msg, desc:"", date:""});
          }
        }
      }
      else if(this.prop.type == "facebook"){
        feedObj.title = data.facebook.info.name;
        feedObj.logo = "";
        for(var i=0; i<data.facebook.gallery.length; i++){
          feedObj.items.push({img:data.facebook.gallery[i].thumb, title:data.facebook.gallery[i].msg, desc:"", date:""});
        }
      }
      else if(this.prop.type == "fbworkplace"){
        feedObj.title = data.workplace.info.name;
        feedObj.logo = "";
        for(var i=0; i<data.workplace.gallery.length; i++){
          feedObj.items.push({img:data.workplace.gallery[i].thumb, title:data.workplace.gallery[i].msg, desc:"", date:""});
        }
      }

      if(feedObj.items.length > 0){
        $("#" + this.prop.type + '-' + this.prop.id + " #item-list-container").empty();
        fs.writeFile(resourcePath + "/local/" + this.prop.id + "-" + this.prop.filename + ".json", JSON.stringify(feedObj), (err) => { if(err)throw err; });
        this.feed = feedObj;
        feedObj = null;
        if(this.settings.hTextOpt == "a"){
          $("#" + this.prop.type + "-" + this.prop.id + " #headerTxt").text(this.feed.title);
        }
        if($("#" + this.prop.type + "-" + this.prop.id + " #headerTxt").length > 0){
          this.maxH = this.prop.h - $("#" + this.prop.type + "-" + this.prop.id + " #headerTxt").outerHeight();
        }
        this.stackListItems();
      }
    });
  }

  stackListItems(){
    this.stackArr = [];
    this.curArr = [];
    $("#" + this.prop.type + '-' + this.prop.id + " #item-list-container").empty().append('<div id="item-list"></div>');
    for(var i=0; i<this.feed.items.length; i++){
      this.htmStr = '<div>';
      if(this.feed.items[i].img != ""){
        if(this.prop.type == "instagram"){
          this.htmStr += '<img class="' + this.prop.type + '-avatar" src="'+ this.feed.items[i].img +'" onerror="this.src = \'./img/insta.png\';">';
        }
        else{
          this.htmStr += '<img class="' + this.prop.type + '-avatar" src="'+ this.feed.items[i].img +'">';
        }
      }
      this.htmStr += '<div class="title">' + this.feed.items[i].title;
      if(this.prop.type == "twitter"){
        this.htmStr += '<span class="subtitle">@' + this.prop.filename  + ' - ' + this.feed.items[i].date + '</span>';
      }
      this.htmStr += '</div><div class="desc">' + this.feed.items[i].desc + '</div></div>';
      $("#" + this.prop.type + '-' + this.prop.id + " #item-list").append(this.htmStr);
      if($("#" + this.prop.type + '-' + this.prop.id + " #item-list").outerHeight() > this.maxH){
        if(this.curArr.length > 0){
          this.stackArr.push(this.curArr);
          this.curArr = [];
          this.curArr.push(i);
          $("#" + this.prop.type + '-' + this.prop.id + " #item-list-container").empty().append('<div id="item-list" style="visibility:hidden"></div>');
          $("#" + this.prop.type + '-' + this.prop.id + " #item-list").append(this.htmStr);
        }
        else{
          console.log("height is too low to accomodate even single item.");
        }
      }
      else{
        this.curArr.push(i);
      }
    }
    if(this.curArr.length > 0){
      this.stackArr.push(this.curArr);
    }
    if(this.rotateTimer){
      clearInterval(this.rotateTimer);
    }
    if(this.stackArr.length > 1){
      $("#" + this.prop.type + '-' + this.prop.id + " #item-list-container").empty();
      this.listStyle = "opacity:0;";
      this.htmStr = "";
      this.num = 0;
      if(this.prop.transition == "n"){
        this.listStyle = "visibility:hidden;";
      }
      for(var i=0; i<this.stackArr.length; i++){
        if(i == 0){
          this.htmStr += '<div id="item-list" class="list-' + i + '" style="position:absolute;width:' + this.prop.w + 'px;">';
        }
        else{
          this.htmStr += '<div id="item-list" class="list-' + i + '" style="position:absolute;width:' + this.prop.w + 'px;' + this.listStyle + '">';
        }
        for(var j=0; j<this.stackArr[i].length; j++){
          this.htmStr += '<div>';
          if(this.feed.items[this.stackArr[i][j]].img != ""){
            if(this.prop.type == "instagram"){
              this.htmStr += '<img class="' + this.prop.type + '-avatar" src="'+ this.feed.items[this.stackArr[i][j]].img +'" onerror="this.src = \'./img/insta.png\';">';
            }
            else{
              this.htmStr += '<img class="' + this.prop.type + '-avatar" src="'+ this.feed.items[this.stackArr[i][j]].img +'">';
            }
            //this.htmStr += '<img class="' + this.prop.type + '-avatar" src="'+ this.feed.items[this.stackArr[i][j]].img +'">';
          }
          this.htmStr += '<div class="title">' + this.feed.items[this.stackArr[i][j]].title;
          if(this.prop.type == "twitter"){
            this.htmStr += '<span class="subtitle">@' + this.prop.filename  + ' - ' + this.feed.items[this.stackArr[i][j]].date + '</span>';
          }
          this.htmStr += '</div><div class="desc">' + this.feed.items[this.stackArr[i][j]].desc + '</div></div>';
        }
        this.htmStr += '</div>';
      }
      $("#" + this.prop.type + '-' + this.prop.id + " #item-list-container").append(this.htmStr);
      this.rotateTimer = setInterval(()=>{
        if(this.prop.transition == "f"){
          $("#" + this.prop.type + '-' + this.prop.id + " #item-list-container #item-list.list-" + this.num).css({"opacity":0});
        }
        else{
          $("#" + this.prop.type + '-' + this.prop.id + " #item-list-container #item-list.list-" + this.num).css({"visibility":"hidden"});
        }
        this.num++;
        if(this.num >= this.stackArr.length){
          this.num = 0;
        }
        if(this.prop.transition == "f"){
          TweenMax.to($("#" + this.prop.type + '-' + this.prop.id + " #item-list-container #item-list.list-" + this.num), 0.5, {opacity:1});
        }
        else{
          $("#" + this.prop.type + '-' + this.prop.id + " #item-list-container #item-list.list-" + this.num).css("visibility", "visible");
        }
      }, this.rotateTime);
      //window.addTimer(this.rotateTimer, "i", this.prop.fid);
    }
  }

  removeFx(){
    if(this.rotateTimer){
      clearInterval(this.rotateTimer);
    }
    clearInterval(this.refreshTimer);

    this.maxH = this.rotateTime = this.num = null;
    this.stackArr = this.curArr = null;
    this.apiPath = this.desc = null;
    this.refreshTimer = null;
    this.rotateTimer = null;
    this.fileStats = null;
    this.settings = null;
    this.isBing = null;
    this.prop = null;
    this.feed = null;

    this.maxH = this.rotateTime = this.num = undefined;
    this.stackArr = this.curArr = undefined;
    this.apiPath = this.desc = undefined;
    this.refreshTimer = undefined;
    this.rotateTimer = undefined;
    this.fileStats = undefined;
    this.settings = undefined;
    this.isBing = undefined;
    this.prop = undefined;
    this.feed = undefined;
  }
}

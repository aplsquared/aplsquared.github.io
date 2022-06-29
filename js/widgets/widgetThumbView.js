class WidgetThumbView {
  constructor(prop) {
    this.rotateTime = 12000;
    this.maxH = parseInt(prop.h);
    this.apiPath = "";
    this.rotateTimer;
    this.prop = prop;
    this.num = 0;
    this.feed;

    this.htmStr = '<div id="' + this.prop.type + '-' + this.prop.id + '" style="width:'+ this.prop.w +'px;height:'+ this.prop.h +'px;"><div id="thumb-container"></div></div>';
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
    this.refreshTimer = setInterval(()=>{this.loadLiveFeed();}, 900000);
    //window.addTimer(this.refreshTimer, "i", this.prop.fid);
  }

  loadLocalFeed(){
    var feedObj = {title:"", logo:"", items:[]};
    $.get(resourcePath + "/local/" + this.prop.id + "-" + this.prop.dtype + "-" + this.prop.filename + ".json", (data)=>{
      feedObj = JSON.parse(data);
      if(feedObj.items.length > 0){
        this.feed = feedObj;
        feedObj = null;
        this.loadHtmlFx();
      }
    })
    .fail(()=>{
      this.loadLiveFeed();
    });
  }

  loadLiveFeed(){
    var feedObj = {title:"", logo:"", items:[]};
    this.apiPath = apiPath + "/" + this.prop.type + "/" +  this.prop.id.split("-")[2] + "?format=json&" + new Date().getTime();
    $.get(this.apiPath, (data)=>{
      if(this.prop.type == "twitter"){
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
          feedObj.items.push({img:data.gallery[i].src, title:"", desc:"", date:""});
        }
      }
      else if(this.prop.type == "facebook"){
        feedObj.title = data.facebook.info.name;
        feedObj.logo = "";
        for(var i=0; i<data.facebook.gallery.length; i++){
          feedObj.items.push({img:data.facebook.gallery[i].src, title:"", desc:"", date:""});
        }
      }
      else if(this.prop.type == "fbworkplace"){
        feedObj.title = data.workplace.info.name;
        feedObj.logo = "";
        for(var i=0; i<data.workplace.gallery.length; i++){
          feedObj.items.push({img:data.workplace.gallery[i].src, title:"", desc:"", date:"", type:data.workplace.gallery[i].typ});
        }
      }

      if(feedObj.items.length > 0){
        fs.writeFile(resourcePath + "/local/" + this.prop.id + "-" + this.prop.dtype + "-" + this.prop.filename + ".json", JSON.stringify(feedObj), (err) => { if(err)throw err; });
        this.feed = feedObj;
        feedObj = null;
        this.loadHtmlFx();
      }
    });
  }

  loadHtmlFx(){
    this.listStyle = "opacity:0";
    if(this.prop.transition == "n"){
      this.listStyle = "visibility:hidden;";
    }
    this.htmStr = "";
    this.num = 0;
    for(var i=0; i<this.feed.items.length; i++){
      if(this.feed.items[i].img != ""){
        if(i == 0){
          if(this.feed.items[i].type && this.feed.items[i].type == "video"){
            this.htmStr += '<div class="thumb-' + i + '" style="position:absolute;"><video id="v' + i + '" width="' + this.prop.w + '" height="' + this.prop.h + '" src="' + this.feed.items[i].img + '" loop autoplay></video></div>';
          }
          else{
            this.htmStr += '<div class="thumb-' + i + '" style="position:absolute;width:100%;height:' + this.prop.h + 'px;background-image:url(\'' + this.feed.items[i].img + '\');background-repeat:no-repeat;background-size:contain;background-position:center center;"></div>';
          }
        }
        else{
          if(this.feed.items[i].type && this.feed.items[i].type == "video"){
            this.htmStr += '<div class="thumb-' + i + '" style="position:absolute;' + this.listStyle + '"><video id="v' + i + '" width="' + this.prop.w + '" height="' + this.prop.h + '" src="' + this.feed.items[i].img + '" loop></video></div>';
          }
          else{
            this.htmStr += '<div class="thumb-' + i + '" style="position:absolute;width:100%;height:' + this.prop.h + 'px;background-image:url(\'' + this.feed.items[i].img + '\');background-repeat:no-repeat;background-size:contain;background-position:center center;' + this.listStyle + '"></div>';
          }
        }
      }
    }
    $("#" + this.prop.type + '-' + this.prop.id + " #thumb-container").append(this.htmStr);
    if($("#" + this.prop.type + '-' + this.prop.id + " #thumb-container>div").length > 1){
      this.rotateTimer = setInterval(()=>{
        if(this.prop.transition == "f"){
          $("#" + this.prop.type + '-' + this.prop.id + " #thumb-container div.thumb-" + this.num).css({"opacity":0});
        }
        else{
          $("#" + this.prop.type + '-' + this.prop.id + " #thumb-container div.thumb-" + this.num).css({"visibility":"hidden"});
        }
        if($("#" + this.prop.type + '-' + this.prop.id + " #thumb-container video#v" + this.num)){
          $("#" + this.prop.type + '-' + this.prop.id + " #thumb-container video#v" + this.num).get(0).pause();
          $("#" + this.prop.type + '-' + this.prop.id + " #thumb-container video#v" + this.num).get(0).currentTime = 0;
          $("#" + this.prop.type + '-' + this.prop.id + " #thumb-container div.thumb-" + this.num).css({"visibility":"hidden"});
        }
        this.num++;
        if(this.num >= $("#" + this.prop.type + '-' + this.prop.id + " #thumb-container>div").length){
          this.num = 0;
        }
        if(this.prop.transition == "f"){
          TweenMax.to($("#" + this.prop.type + '-' + this.prop.id + " #thumb-container div.thumb-" + this.num), 0.5, {opacity:1});
        }
        else{
          $("#" + this.prop.type + '-' + this.prop.id + " #thumb-container div.thumb-" + this.num).css("visibility", "visible");
        }
        if($("#" + this.prop.type + '-' + this.prop.id + " #thumb-container video#v" + this.num)){
          $("#" + this.prop.type + '-' + this.prop.id + " #thumb-container video#v" + this.num).get(0).play();
          $("#" + this.prop.type + '-' + this.prop.id + " #thumb-container div.thumb-" + this.num).css({"visibility":"visible"});
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

    this.htmStr = this.listStyle = this.apiPath = null;
    this.num = this.rotateTime = this.maxH = null;
    this.refreshTimer = this.rotateTimer = null;
    this.fileStats = null;
    this.prop = null;
    this.feed = null;

    this.htmStr = this.listStyle = this.apiPath = undefined;
    this.num = this.rotateTime = this.maxH = undefined;
    this.refreshTimer = this.rotateTimer = undefined;
    this.fileStats = undefined;
    this.prop = undefined;
    this.feed = undefined;
  }
}

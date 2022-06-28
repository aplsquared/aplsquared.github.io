class WidgetQuote {
  constructor(prop){
    this.visibilityCssStr = "visibility:hidden;"
    this.settings = JSON.parse(prop.settings);
    this.quoteObj = {cid:prop.id, item:null};
    this.rotateDuration = 12000;
    this.maxHeight = prop.h;
    this.rotateTimer;
    this.prop = prop;
    this.quotes = [];
    this.num = 0;

    if(this.settings.rotationOpt == "c"){
        this.rotateDuration = this.settings.rotate * 1000;
    }

    if(this.prop.transition == "f"){
        this.visibilityCssStr = "opacity:0;";
    }
    this.htmStr = '<div id="' + this.prop.type + '-' + this.prop.id + '" class="m-c" style="height:'+ this.prop.h + 'px;background-color:' + window.hexToRgbA(this.settings.bg, this.settings.bga) +' ">'+
        '<style type="text/css">#' + this.prop.type + '-' + this.prop.id + ' .quote{font-family:'+ this.settings.quotesFont.value +';color:'+ this.settings.quotesText +';font-size:'+ this.settings.quotesSize +'px;text-align:center;}#' + this.prop.type + '-' + this.prop.id + ' .author{font-family:'+ this.settings.authorFont.value +';color:'+ this.settings.authorText +';font-size:'+ this.settings.authorSize +'px;text-align:right;}</style>'+
        '<div id="quote-list-container"></div>'+
    '</div>';
    setTimeout(()=>{this.init()}, 200);
    return this.htmStr;
  }

  init(){
    this.loadFeed();
  }

  loadFeed(){
    var quotesData = {info:{}, items:[]};
    this.htmStr = "";
    $.ajax({
    url: apiPath + "/quotes/" + this.prop.id.split("-")[2] +"?"+ new Date().getTime(),
    dataType: 'xml',
    async: false,
    success: (data)=>{
      $(data).find('quotes quote').each(function(){
        quotesData.items.push({quote:$(this).attr('quote'), author:$(this).attr('author')});
      });
      quotesData.info = {img:$(data).find('quotes info').attr('bgImg'), isBgActive:$(data).find('quotes info').attr('isBgActive')};
    }, error:function(err){console.error(err)}
    });
    this.quotes = quotesData;
    this.loadHtmlFx();
  }

  loadHtmlFx(){
    this.htmStr = "";
    this.num = 0;
    var qBg = "";
    if(this.quotes.info.isBgActive && this.quotes.info.img){
      qBg = this.quotes.info.img;
    }
    $("#" + this.prop.type + "-" + this.prop.id + " #quote-list-container").empty();
    $("#" + this.prop.type + "-" + this.prop.id + " #quote-list-container").append('<div id="quote-list"></div>');
    $("#" + this.prop.type + "-" + this.prop.id).css({"background": "url("+ resourcePath +'/resized/fit-'+ qBg +") no-repeat center "+ window.hexToRgbA(this.settings.bg, this.settings.bga), "background-size":"contain"});
    if(this.quotes.items.length > 1){
      for(var i=0; i<this.quotes.items.length; i++){
        this.htmStr = '<div class="pAbsolute d-flex list-'+ i +'" style="height:'+ this.prop.h +'px;' + (i==0?'':this.visibilityCssStr) + '"><div class="pad10 align-self-center"><div class="quote">'+ this.quotes.items[i].quote +'</div><div class="author">'+ this.quotes.items[i].author +'</div></div></div>';
        $("#" + this.prop.type + '-' + this.prop.id + ' #quote-list').append(this.htmStr);
      }
      if(this.prop.transition == "f"){
        TweenMax.to($("#" + this.prop.type + "-" + this.prop.id + " .list-" + this.num), 0.5, {opacity:1});
      }
      else{
        $("#" + this.prop.type + "-" + this.prop.id + " .list-" + this.num).css("visibility", "visible");
      }
      this.rotateTimer = setInterval(()=>{
        if(this.prop.transition == "f"){
          $("#" + this.prop.type + '-' + this.prop.id + " .list-" + this.num).css({"opacity":0});
        } else{
          $("#" + this.prop.type + '-' + this.prop.id + " .list-" + this.num).css({"visibility":"hidden"});
        }
        this.num++;
        if(this.num >= this.quotes.items.length){
          this.num = 0;
        }
        if(this.prop.transition == "f"){
          TweenMax.to($("#" + this.prop.type + '-' + this.prop.id + " .list-" + this.num), 0.5, {opacity:1});
        }
        else{
          $("#" + this.prop.type + '-' + this.prop.id + " .list-" + this.num).css("visibility", "visible");
        }
      }, this.rotateDuration);
      //window.addTimer(this.rotateTimer, "i", this.prop.fid);
    }
    else if(this.quotes.items.length == 1){
      this.htmStr += '<div class="d-flex" style="height:'+ this.prop.h +'px"><div class="pad10 align-self-center">'+
        '<div class="quote">'+ this.quotes.items[0].quote +'</div>'+
        '<div class="author">'+ this.quotes.items[0].author +'</div>'+
        '</div></div>';
      $("#" + this.prop.type + '-' + this.prop.id + ' #quote-list').append(this.htmStr);
    }
  }

  removeFx(){
    if(this.rotateTimer){
      clearInterval(this.rotateTimer);
    }

    this.rotateDuration = this.maxHeight = this.num = null;
    this.visibilityCssStr = this.htmStr = null;
    this.settings = this.quoteObj = null;
    this.rotateTimer = null;
    this.quotes = null;
    this.prop = null;

    this.rotateDuration = this.maxHeight = this.num = undefined;
    this.visibilityCssStr = this.htmStr = undefined;
    this.settings = this.quoteObj = undefined;
    this.rotateTimer = undefined;
    this.quotes = undefined;
    this.prop = undefined;
  }
}

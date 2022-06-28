class WidgetQueue{
  constructor(prop){
    this.visibilityCssStr = "visibility:hidden;"
    this.settings = JSON.parse(prop.settings);
    this.queueObj = {cid:prop.id, item:null};
    this.rotateDuration = 12000;
    this.reDuration = 90000;
    this.roDuration = 12000;
    this.maxHeight = prop.h;
    this.refreshTimer;
    this.rotateTimer;
    this.prop = prop;
    this.queue = "";
    this.num = 0;

    if(this.settings.rotateOpt == "c"){
      this.roDuration = this.settings.rotate * 1000;
    }
    if(this.settings.reloadOpt == "c"){
      this.reDuration = this.settings.reload * 1000;
    }
    if(this.settings.rotationOpt == "c"){
      this.rotateDuration = this.settings.rotate * 1000;
    }
    if(this.prop.transition == "f"){
      this.visibilityCssStr = "opacity:0;";
    }

    this.htmStr = '<div id="'+ this.prop.type +'-'+ this.prop.id +'" class="m-c" style="width:'+ this.prop.w +'px;height:'+ this.prop.h +'px;background:'+ window.hexToRgbA(this.settings.bg, this.settings.bga) +'">';
      if(this.prop.dtype == "tabular"){
        this.htmStr += '<style type="text/css">#tHead{color:'+ this.settings.headerText +';font-family:'+ this.settings.headerFont.value +';background:'+ window.hexToRgbA(this.settings.headerBg, this.settings.headerBga) +';}#'+ this.prop.type +'-'+ this.prop.id +' #tBody .row{background:'+ window.hexToRgbA(this.settings.rowBg, this.settings.rowBga) +';font-family:'+ this.settings.rowFont.value +';color:'+ this.settings.rowText +'}#'+ this.prop.type +'-'+ this.prop.id +' #tBody .row:nth-child(even){background:'+ window.hexToRgbA(this.settings.altBg, this.settings.altBga) +';font-family:'+ this.settings.altFont.value +';color:'+ this.settings.altText +';}#'+ this.prop.type +'-'+ this.prop.id +'#'+ this.prop.type +'-'+ this.prop.id +' #tFoot{color:'+ this.settings.footerText +';font-family:'+ this.settings.footerFont.value +';background:'+ window.hexToRgbA(this.settings.footerBg, this.settings.footerBga) +';}</style>';
        this.htmStr += '<div class="excelTbl">';
          this.htmStr += '<div id="tHead" class="th"></div>';
          this.htmStr += '<div id="tBody"></div>';
          this.htmStr += '<div id="tFoot" class="footer"></div>';
        this.htmStr += '</div>';
      } else if(this.prop.dtype == "normal"){
      }
    this.htmStr += '</div>';

    setTimeout(()=>{this.init()}, 200);
    return this.htmStr;
  }

  init(){
    this.loadFeed();
    this.refreshTimer = setInterval(()=>{this.loadFeed();}, this.reDuration);
    //window.addTimer(this.refreshTimer, "i", this.prop.fid);
  }

  loadFeed(){
    var queueData = "";
    this.htmStr = "";
    if(this.prop.dtype == "normal"){
      $.ajax({
        url: apiPath +"/queue/"+ this.prop.src +"?"+ new Date().getTime(),
        dataType: "xml",
        async: false,
        success: (data)=>{
          queueData = {current:$(data).find("queue info").attr("current"), next:$(data).find("queue info").attr("next"), prefix:$(data).find("queue info").attr("prefix"), suffix:$(data).find("queue info").attr("suffix")};
          this.queue = queueData;
          this.loadHtmlFx();
        }, error: function(err){console.error(err)}
      });
    } else{
      $.ajax({
        url: this.prop.src +"?"+ new Date().getTime(),
        dataType: "json",
        async: false,
        success: (data)=>{
          queueData = data.data;
          this.queue = queueData;
          this.loadHtmlFx();
        }, error: function(err){console.error(err)}
      });
    }

  }

  loadHtmlFx(){
    this.htmStr = "";
    this.num = 0;
    $("#"+ this.prop.type + "-" + this.prop.id).css({"background": window.hexToRgbA(this.settings.bg, this.settings.bga)});
    if(this.prop.dtype == "normal"){
      this.htmStr += '<div class="pad10 pull-left">'+
        '<span class="marR10" style="color:'+ this.settings.titleText +';font-family:'+ this.settings.titleFont.value +'">Now Serving:</span>'+
        '<span style="color:'+ this.settings.prefixText +';font-family:'+ this.settings.prefixFont.value +'">'+ this.queue.prefix +'</span>'+
        '<span class="marLR10" style="color:'+ this.settings.curText +';font-family:'+ this.settings.curFont.value +'">'+ this.queue.current +'</span>'+
        '<span style="color:'+ this.settings.suffixText +';font-family:'+ this.settings.suffixFont.value +'">'+ this.queue.suffix +'</span>'+
      '</div>';
      $("#"+ this.prop.type +"-"+ this.prop.id).empty();
      $("#"+ this.prop.type +"-"+ this.prop.id).append('<div id="container" style="transform-origin:0 0;float:left;visibility:hidden;"></div>');
      $("#"+ this.prop.type +"-"+ this.prop.id + " #container").html(this.htmStr);
      this.fitToFrame();
    } else{
      this.hCol = this.queue.head.columns;
      this.rCol = this.queue.row;

      $("#"+ this.prop.type +"-"+ this.prop.id +" #tHead").empty();
      for(var i = 0; i < this.hCol.length; i++){
        $("#"+ this.prop.type +"-"+ this.prop.id +" #tHead").append('<div class="cell" style="width:'+ this.prop.w / this.hCol.length +'px;">'+ this.hCol[i].label +'</div>');
      }

      if(this.rCol.length > 0){
        $("#"+ this.prop.type +"-"+ this.prop.id +" #tBody").empty();
        $("#"+ this.prop.type +"-"+ this.prop.id +" #tBody").append('<div id="list"></div>');
        this.containerArr = [];
        this.tempArr = [];
        this.num = 0;

        for(var i = 0; i < this.rCol.length; i++){
          this.htmStr = '<div class="row" id="row-'+ i +'" style="visibility:hidden;">';
            for(var j = 0; j < this.rCol[i].columns.length; j++){
              this.htmStr += '<div class="cell" style="width:'+ this.prop.w / this.hCol.length +'px;">'+ this.rCol[i].columns[j].label +'</div>';
            }
          this.htmStr += '</div>';

          $("#"+ this.prop.type +"-"+ this.prop.id +" #tBody #list").append(this.htmStr);
          if(($("#"+ this.prop.type +"-"+ this.prop.id +" #tBody #list").outerHeight() + ($("#"+ this.prop.type +"-"+ this.prop.id +" #tBody #list").children().length * 15)) > this.maxHeight){
            this.containerArr.push(this.tempArr);
            this.tempArr = [];
            this.tempArr.push({index:i});
            $("#"+ this.prop.type +"-"+ this.prop.id +" #tBody #list").empty();
          } else{
            this.tempArr.push({index:i});
          }
        }
        if(this.tempArr.length > 0){
          this.containerArr.push(this.tempArr);
        }

        $("#"+ this.prop.type +"-"+ this.prop.id +" #tBody").empty();
        for(var j=0; j<this.containerArr.length; j++){
          $("#"+ this.prop.type +"-"+ this.prop.id +" #tBody").append('<div id="list-'+ j +'" style="'+ this.visibilityCssStr +'position:absolute;width:'+ this.prop.w +'px;"></div>');
          for(var k=0; k<this.containerArr[j].length; k++){
            this.htmStr = '<div class="row" id="row-'+ i +'">';
              for(var l = 0; l < this.rCol[this.containerArr[j][k].index].columns.length; l++){
                this.htmStr += '<div class="cell" style="width:'+ this.prop.w / this.hCol.length +'px;">'+ this.rCol[this.containerArr[j][k].index].columns[l].label +'</div>';
              }
            this.htmStr += '</div>';
            $("#"+ this.prop.type +"-"+ this.prop.id +" #tBody #list-"+ j).append(this.htmStr);
          }
        }

        if(this.prop.transition == "f"){
          TweenMax.to($("#"+ this.prop.type +"-"+ this.prop.id +" #tBody #list-"+ this.num), 0.5, {opacity:1});
        } else{
          $("#"+ this.prop.type +"-"+ this.prop.id +" #tBody #list-"+ this.num).css("visibility", "visible");
        }
        this.pageCount = 1;
        if(this.rotateTimer){
          clearInterval(this.rotateTimer);
          this.rotateTimer = null;
        }
        this.rotateTimer = setInterval(()=>{
          if(this.prop.transition == "f"){
            TweenMax.to($("#"+ this.prop.type +"-"+ this.prop.id +" #tBody #list-"+ this.num), 0.5, {opacity:0});
          } else{
            $("#"+ this.prop.type +"-"+ this.prop.id +" #tBody #list-"+ this.num).css("visibility", "hidden");
          }
          this.num++;
          this.pageCount++;
          if(this.num >= $("#"+ this.prop.type +"-"+ this.prop.id +" #tBody>div").length){
            this.num = 0;
            this.pageCount = 1;
          }
          if(this.prop.transition == "f"){
            TweenMax.to($("#"+ this.prop.type +"-"+ this.prop.id +" #tBody #list-"+ this.num), 0.5, {opacity:1});
          } else{
            $("#"+ this.prop.type +"-"+ this.prop.id +" #tBody #list-"+ this.num).css("visibility", "visible");
          }
          $("#"+ this.prop.type +"-"+ this.prop.id +" #tFoot").html("<div>Page "+ this.pageCount +" of "+ this.containerArr.length +"</div>");
        }, this.roDuration);
        //window.addTimer(this.rotateTimer, "i", this.prop.fid);
        $("#"+ this.prop.type +"-"+ this.prop.id +" #tFoot").html("<div>Page "+ this.pageCount +" of "+ this.containerArr.length +"</div>");
      }
    }
  }

  fitToFrame(){
    this.scaleX = (this.prop.w) / $("#"+ this.prop.type +"-"+ this.prop.id +" #container").width();
    this.scaleY = (this.prop.h) / $("#"+ this.prop.type +"-"+ this.prop.id +" #container").height();

    if(this.scaleX < this.scaleY){
      $("#"+ this.prop.type +"-"+ this.prop.id +" #container").css("transform", "scale("+ this.scaleX +","+ this.scaleX +")");
    } else{
      $("#"+ this.prop.type +"-"+ this.prop.id +" #container").css("transform", "scale("+ this.scaleY +","+ this.scaleY +")");
    }

    this.scaledH = $("#"+ this.prop.type +"-"+ this.prop.id +" #container")[0].getBoundingClientRect().height;
    this.scaledW = $("#"+ this.prop.type +"-"+ this.prop.id +" #container")[0].getBoundingClientRect().width;
    this.xAlign = this.prop.a.split("-")[1];
    this.yAlign = this.prop.a.split("-")[0];

    if(this.xAlign == "l"){
      $("#"+ this.prop.type +"-"+ this.prop.id +" #container").css("margin-left", "0px");
    } else if(this.xAlign == "c"){
      $("#"+ this.prop.type +"-"+ this.prop.id +" #container").css("margin-left", Math.floor((this.prop.w - this.scaledW) / 2));
    } else if(this.xAlign == "r"){
      $("#"+ this.prop.type +"-"+ this.prop.id +" #container").css("margin-left", Math.floor(this.prop.w - this.scaledW));
    }

    if(this.yAlign == "t"){
      $("#"+ this.prop.type +"-"+ this.prop.id +" #container").css("margin-top", "0px");
    } else if(this.yAlign == "m"){
      $("#"+ this.prop.type +"-"+ this.prop.id +" #container").css("margin-top", Math.floor((this.prop.h - this.scaledH) / 2));
    } else if(this.yAlign == "b"){
      $("#"+ this.prop.type +"-"+ this.prop.id +" #container").css("margin-top", Math.floor(this.prop.h - this.scaledH));
    }
    $("#"+ this.prop.type +"-"+ this.prop.id +" #container").css("visibility", "visible");
  }

  removeFx(){
    if(this.rotateTimer){
      clearInterval(this.rotateTimer);
    }
    clearInterval(this.refreshTimer);

    this.rotateDuration = this.reDuration = this.roDuration = this.maxHeight = this.num = this.pageCount = this.scaleX = this.scaleY = this.scaledH = this.scaledW = null;
    this.visibilityCssStr = this.queue = this.htmStr = this.xAlign = this.yAlign = null;
    this.settings = this.queueObj = this.rCol = null;
    this.containerArr = this.tempArr = null;
    this.refreshTimer = null;
    this.rotateTimer = null;
    this.prop = null;

    this.rotateDuration = this.reDuration = this.roDuration = this.maxHeight = this.num = this.pageCount = this.scaleX = this.scaleY = this.scaledH = this.scaledW = undefined;
    this.visibilityCssStr = this.queue = this.htmStr = this.xAlign = this.yAlign = undefined;
    this.settings = this.queueObj = this.rCol = undefined;
    this.containerArr = this.tempArr = undefined;
    this.refreshTimer = undefined;
    this.rotateTimer = undefined;
    this.prop = undefined;
  }
}

class WidgetStock{
    constructor(prop){
      this.settings = JSON.parse(prop.settings);
      this.maxH = parseInt(prop.h);
      this.rotateTime = 12000;
      this.stockStackArr = [];
      this.textStr = "";
      this.rotateTimer;
      this.curArr = [];
      this.prop = prop;

      if(this.settings.rotationOpt == "c"){
        this.rotateTime = this.settings.rotate * 1000;
      }

      //this.htmStr = '<div id="'+ this.prop.type +'-'+ this.prop.id +'" style="width:'+ this.prop.w +'px;height:'+ this.prop.h +'px;background:'+ window.hexToRgbA(this.settings.bg, this.settings.bga) +';font-family:' + this.settings.font.value +'">';
      this.htmStr = '<div id="'+ this.prop.type +'-'+ this.prop.id +'" style="width:'+ this.prop.w +'px;height:'+ this.prop.h +'px;" >';
      // if(this.prop.dtype == "s"){
      //   this.htmStr += '<div style="padding:0 20px;"><div style="height:'+ this.prop.h +'px"><div class="text-'+ this.settings.align +' pad10" style="font-size:'+ this.settings.size +'px;color:'+ this.settings.titleText +'"></div></div></div></div>';
      // }
      this.htmStr += '</div>';
      setTimeout(()=>{this.init()}, 200);
      return this.htmStr;
    }

    init(){
      this.loadFeed();
      this.refreshTimer = setInterval(()=>{this.loadFeed();}, 900000);
      //window.addTimer(this.refreshTimer, "i", this.prop.fid);
    }

    loadFeed(){
      var stockData = [];
      this.htmStr = "";
      $.get(apiPath + "/stock_wtd/" + this.prop.id.split("-")[2] +"?"+ new Date().getTime(), (data)=>{
        if(data.data && data.data.length > 0){
          this.stockData = data.data;
          if(this.rotateTimer){
            clearInterval(this.rotateTimer);
            this.rotateTimer = null;
          }
          this.loadHtmlFx();
        }
      })
      .fail(function(){});
    }

    loadHtmlFx(){
      this.htmStr = "";
      if(this.prop.dtype == "m"){
        $("#" + this.prop.type + "-" + this.prop.id).empty();
        if(this.settings.template == "t1"){
          this.textFontSize = (this.settings.fontSizeOpt == "c")?this.settings.fontSize:(this.prop.h - this.prop.h/3.4); //this.prop.h*0.60;
          this.htmStr = '<div style="font-family:\'' + this.settings.font.value + '\';font-size:'+ this.textFontSize +'px;font-weight:bold;color:'+ this.settings.titleText +';white-space:nowrap;">';
          this.htmStr += '<div class="marquee" style="height:'+ this.prop.h +'px;line-height:'+ (this.prop.h - this.prop.h/22) +'px;">';

          // this.htmStr += '<div class="flex-c" style="background:'+ window.hexToRgbA(this.settings.bg, this.settings.bga) +';white-space:nowrap;font-weight:bold;font-size:'+ this.textFontSize +'px;height:'+ this.prop.h +'px;">'+
          // '<marquee behavior="scroll" direction="left" scrollamount="'+ (this.settings.speed * 2) +'">';
          this.textStr = "";
          for(var i=0; i < this.stockData.length; i++){
            this.colorCnp = this.stockData[i].day_change>0?this.settings.cp:this.settings.cn;
            this.textStr += '<span class="marR20"><span class="marR10" style="color:'+ this.settings.b +'"> &#9724; </span><span style="color:'+ this.settings.s +'">'+ this.stockData[i].symbol +'</span> <span style="color:'+ this.settings.n +'">'+ this.stockData[i].name +',</span> <span style="color:'+ this.settings.p +'">'+ this.stockData[i].price +',</span> <span style="color:'+ this.colorCnp +'">';
            if(Number(this.stockData[i].day_change) > 0){
              this.textStr += '+' + this.stockData[i].day_change;
            }
            else{
              this.textStr += this.stockData[i].day_change;
            }
            this.textStr += '</span></span>';
          }
          this.htmStr += this.textStr + '</div></div>';
          $("#" + this.prop.type + "-" + this.prop.id).append(this.htmStr);

          this.elemW = parseInt($("#" + this.prop.type + "-" + this.prop.id + " .marquee")[0].scrollWidth);
          this.duration = parseInt(this.elemW/this.settings.speed);
          this.htmStr = '<style type="text/css">#' + this.prop.type + '-'+ this.prop.id + ' .bull{color:'+ this.settings.b +'} #' + this.prop.type + '-' + this.prop.id + ' .marquee{position:relative;animation-name:' + this.prop.type + '-' + this.prop.id + '-marqueeanim;animation-duration:' + this.duration + 's;animation-iteration-count:infinite;animation-timing-function:linear;}@keyframes ' + this.prop.type + '-' + this.prop.id + '-marqueeanim{from{margin-left:' + this.prop.w + 'px;}to{margin-left:-' + this.elemW + 'px;}}</style>';
          $("#" + this.prop.type + "-" + this.prop.id).append(this.htmStr);
        }
        else if(this.settings.template == "t2"){
          this.htmStr = '<style type="text/css">#'+ this.prop.type + '-' + this.prop.id +' #header{background:'+ window.hexToRgbA(this.settings.hb, this.settings.hba) +';color:'+ this.settings.ht +';font-family:\''+ this.settings.hf.value +'\';font-size:' + this.settings.hs + 'px;}#'+ this.prop.type + '-' + this.prop.id +' #header div{overflow:hidden;}#' + this.prop.type + '-' + this.prop.id + ' #stock-list .row{background:'+ window.hexToRgbA(this.settings.rb, this.settings.rba) +';font-family:\'' + this.settings.rf.value +'\';font-size:' + this.settings.rs + 'px;}#'+ this.prop.type + '-' + this.prop.id +' #stock-list .row div{overflow:hidden;text-overflow:ellipsis;}#'+ this.prop.type + '-' + this.prop.id +' #stock-list .row:nth-child(even){background:'+ window.hexToRgbA(this.settings.ab, this.settings.aba) +';}</style>';
          if(this.settings.header.active){
            this.htmStr += '<div id="header" class="stockH d-flex"><div class="d-flex align-items-center justify-content-start pad10 bdrR w40">' + this.settings.header.column1 + '</div><div class="d-flex align-items-center justify-content-center pad10 bdrR w20">' + this.settings.header.column2 + '</div><div class="d-flex align-items-center justify-content-center pad10 bdrR w20">' + this.settings.header.column3 + '</div><div class="d-flex align-items-center justify-content-center pad10 w20">' + this.settings.header.column4 + '</div></div>';
          }
          this.htmStr += '<div id="stock-list-container"></div>';
          $("#" + this.prop.type + "-" + this.prop.id).html(this.htmStr);

          if($("#" + this.prop.type + '-' + this.prop.id + " #header").length > 0){
            this.maxH = this.maxH - $("#" + this.prop.type + '-' + this.prop.id + " #header").outerHeight();
          }
          this.stackStockItems();

        }
      }
      else if(this.prop.dtype == "s"){
        $("#" + this.prop.type + '-' + this.prop.id).css({"background": window.hexToRgbA(this.settings.bg, this.settings.bga)});
        if(this.stockData.length == 1){
          this.stockData = this.stockData[0];
        }
        $("#" + this.prop.type + "-" + this.prop.id).empty();
        this.htmStr = '<div id="container" style="transform-origin:0 0;float:left;visibility:hidden;font-family:\'' + this.settings.font.value + '\';"><div class="stock-single"><div><h2 style="color:'+ this.settings.s +';font-size:28px">'+ this.stockData.symbol +'</h2><div style="color:'+ this.settings.n +';font-size:28px">'+ this.stockData.name +'</div></div><div class="price" style="color:'+ this.settings.p +';font-size:68px;white-space:nowrap;">'+ this.stockData.price
        if(this.stockData.day_change > 0){
          this.htmStr += '<span class="dayChange" style="color:'+ this.settings.cp +';font-size:32px"><svg viewBox="0 0 448 512" fill="'+ this.settings.cp +'" style="height:26px"><path d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"/></svg>'+ this.stockData.day_change +'</span>';
        } else if(this.stockData.day_change < 0){
          this.htmStr += '<span class="dayChange" style="color:'+ this.settings.cn +';font-size:32px"><svg viewBox="0 0 448 512" fill="'+ this.settings.cn +'" style="height:26px"><path d="M413.1 222.5l22.2 22.2c9.4 9.4 9.4 24.6 0 33.9L241 473c-9.4 9.4-24.6 9.4-33.9 0L12.7 278.6c-9.4-9.4-9.4-24.6 0-33.9l22.2-22.2c9.5-9.5 25-9.3 34.3.4L184 343.4V56c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24v287.4l114.8-120.5c9.3-9.8 24.8-10 34.3-.4z"/></svg>'+ this.stockData.day_change +'</span>';
        } else{
          this.htmStr += '<span class="dayChange" style="color:#ccc;font-size:32px">'+ this.stockData.day_change +'</span>';
        }
        this.htmStr += '</div><div style="color:'+ this.settings.e +';font-size:28px">'+ this.stockData.stock_exchange_short +'</div></div></div></div>';
        $("#" + this.prop.type + "-" + this.prop.id).append(this.htmStr);
        this.fitToFrame();
      }
      else{
        if(this.stockData.length > 0){
          this.containerArr = [];
          this.tempArr = [];
          this.num = 0;
          $("#" + this.prop.type + "-" + this.prop.id).empty();
          $("#" + this.prop.type + "-" + this.prop.id).append(this.stockData[this.num]);
          this.showNextItem = setInterval(()=>{
            this.num++;
            if(this.stockData.length <= this.num){
              this.num = 0;
            }
            $("#" + this.prop.type + "-" + this.prop.id).empty();
            $("#" + this.prop.type + "-" + this.prop.id).append(this.stockData[this.num]);
          }, this.rotateTime);
          //window.addTimer(this.showNextItem, "i", this.prop.fid);
        }
      }
    }

    stackStockItems(){
      this.stockStackArr = [];
      this.curArr = [];
      $("#" + this.prop.type + '-' + this.prop.id + " #stock-list-container").append('<div id="stock-list"></div>');

      for(var i=0; i<this.stockData.length; i++){
        this.colorCnp = this.stockData[i].day_change>=0?this.settings.cp:this.settings.cn;
        this.htmStr ='<div id="row-'+ i +'" class="d-flex row"><div class="d-flex flex-column pad10 bdrR bdrB w40"><span style="color:'+ this.settings.s +'">'+ this.stockData[i].symbol +'</span><span style="color:'+ this.settings.n +'">'+ this.stockData[i].name +'</span></div><div class="d-flex align-items-center pad10 bdrR bdrB w20" style="color:'+ this.settings.p +'">'+ this.stockData[i].price +'</div><div class="d-flex align-items-center pad10 bdrR bdrB w20" style="color:'+ this.colorCnp +'">'+ this.stockData[i].day_change +'</div><div class="d-flex align-items-center pad10 bdrB w20" style="color:'+ this.colorCnp +'">'+ this.stockData[i].change_pct +'%</div></div>';
        $("#" + this.prop.type + '-' + this.prop.id + " #stock-list").append(this.htmStr);
        if($("#" + this.prop.type + '-' + this.prop.id + " #stock-list").outerHeight() > this.maxH){
          if(this.curArr.length > 0){
            this.stockStackArr.push(this.curArr);
            this.curArr = [];
            this.curArr.push(i);
            $("#" + this.prop.type + '-' + this.prop.id + " #stock-list-container").empty().append('<div id="stock-list"></div>');
            $("#" + this.prop.type + '-' + this.prop.id + " #stock-list").append(this.htmStr);
          }
          else{
            console.log("height is too low to accomodate even single stock.");
          }
        }
        else{
          this.curArr.push(i);
        }
      }
      if(this.curArr.length > 0){
        this.stockStackArr.push(this.curArr);
      }

      if(this.stockStackArr.length > 1){
        $("#" + this.prop.type + '-' + this.prop.id + " #stock-list-container").empty();
        this.listStyle = "opacity:0";
        this.htmStr = "";
        this.num = 0;
        if(this.prop.transition == "n"){
          this.listStyle = "visibility:hidden";
        }
        for(var i=0; i<this.stockStackArr.length; i++){
          if(i == 0){
            this.htmStr += '<div id="stock-list" class="list-' + i + '" style="position:absolute;width:' + this.prop.w + 'px;">';
          }
          else{
            this.htmStr += '<div id="stock-list" class="list-' + i + '" style="position:absolute;width:' + this.prop.w + 'px;' + this.listStyle + '">';
          }
          for(var j=0; j<this.stockStackArr[i].length; j++){
            this.colorCnp = this.stockData[this.stockStackArr[i][j]].day_change>0?this.settings.cp:this.settings.cn;
            this.htmStr +='<div class="d-flex row"><div class="d-flex flex-column pad10 bdrR bdrB w40"><span style="color:'+ this.settings.s +'">'+ this.stockData[this.stockStackArr[i][j]].symbol +'</span><span style="color:'+ this.settings.n +'">'+ this.stockData[this.stockStackArr[i][j]].name +'</span></div><div class="d-flex align-items-center pad10 bdrR bdrB w20" style="color:'+ this.settings.p +'">'+ this.stockData[this.stockStackArr[i][j]].price +'</div><div class="d-flex align-items-center pad10 bdrR bdrB w20" style="color:'+ this.colorCnp +'">'+ this.stockData[this.stockStackArr[i][j]].day_change +'</div><div class="d-flex align-items-center pad10 bdrB w20" style="color:'+ this.colorCnp +'">'+ this.stockData[this.stockStackArr[i][j]].change_pct +'%</div></div>';
          }
          this.htmStr += '</div>';
        }
        $("#" + this.prop.type + '-' + this.prop.id + " #stock-list-container").append(this.htmStr);
        this.rotateTimer = setInterval(()=>{
          if(this.prop.transition == "f"){
            $("#" + this.prop.type + '-' + this.prop.id + " #stock-list-container #stock-list.list-" + this.num).css({"opacity":0});
          }
          else{
            $("#" + this.prop.type + '-' + this.prop.id + " #stock-list-container #stock-list.list-" + this.num).css({"visibility":"hidden"});
          }
          this.num++;
          if(this.num >= this.stockStackArr.length){
            this.num = 0;
          }
          if(this.prop.transition == "f"){
            TweenMax.to($("#" + this.prop.type + '-' + this.prop.id + " #stock-list-container #stock-list.list-" + this.num), 0.5, {opacity:1});
          }
          else{
            $("#" + this.prop.type + '-' + this.prop.id + " #stock-list-container #stock-list.list-" + this.num).css("visibility", "visible");
          }
        }, this.rotateTime);
        //window.addTimer(this.rotateTimer, "i", this.prop.fid);
      }
    }

    fitToFrame(){
      this.scaleX = (this.prop.w) / $("#" + this.prop.type + "-" + this.prop.id + " #container").width();
      this.scaleY = (this.prop.h) / $("#" + this.prop.type + "-" + this.prop.id + " #container").height();

      if(this.scaleX < this.scaleY){
        $("#" + this.prop.type + "-" + this.prop.id + " #container").css("transform", "scale(" + this.scaleX + "," + this.scaleX + ")");
      } else{
        $("#" + this.prop.type + "-" + this.prop.id + " #container").css("transform", "scale(" + this.scaleY + "," + this.scaleY + ")");
      }

      this.scaledH = $("#" + this.prop.type + "-" + this.prop.id + " #container")[0].getBoundingClientRect().height;
      this.scaledW = $("#" + this.prop.type + "-" + this.prop.id + " #container")[0].getBoundingClientRect().width;
      this.xAlign = this.prop.a.split("-")[1];
      this.yAlign = this.prop.a.split("-")[0];

      if(this.xAlign == "l"){
        $("#" + this.prop.type + "-" + this.prop.id + " #container").css("margin-left", "0px");
      } else if(this.xAlign == "c"){
        $("#" + this.prop.type + "-" + this.prop.id + " #container").css("margin-left", Math.floor((this.prop.w - this.scaledW) / 2));
      } else if(this.xAlign == "r"){
        $("#" + this.prop.type + "-" + this.prop.id + " #container").css("margin-left", Math.floor(this.prop.w - this.scaledW));
      }

      if(this.yAlign == "t"){
        $("#" + this.prop.type + "r-" + this.prop.id + " #container").css("margin-top", "0px");
      } else if(this.yAlign == "m"){
        $("#" + this.prop.type + "-" + this.prop.id + " #container").css("margin-top", Math.floor((this.prop.h - this.scaledH) / 2));
      } else if(this.yAlign == "b"){
        $("#" + this.prop.type + "-" + this.prop.id + " #container").css("margin-top", Math.floor(this.prop.h - this.scaledH));
      }
      $("#" + this.prop.type + "-" + this.prop.id + " #container").css("visibility", "visible");
    }

    removeFx(){
      clearInterval(this.refreshTimer);
      if(this.showNextItem){
        clearInterval(this.showNextItem);
      }
      if(this.rotateTimer){
        clearInterval(this.rotateTimer);
      }

      this.duration = this.elemW = this.maxH = this.rotateTime = this.num = this.scaleX = this.scaleY = this.scaledH = this.scaledW = null;
      this.stockStackArr = this.curArr = this.containerArr = this.tempArr = null;
      this.htmStr = this.textStr = this.listStyle = this.xAlign = this.yAlign = null;
      this.refreshTimer = this.showNextItem = this.rotateTimer = null;
      this.stockData = this.settings = null;
      this.textFontSize = null;
      this.colorCnp = null;
      this.prop = null;

      this.duration = this.elemW = this.maxH = this.rotateTime = this.num = this.scaleX = this.scaleY = this.scaledH = this.scaledW = undefined;
      this.stockStackArr = this.curArr = this.containerArr = this.tempArr = undefined;
      this.htmStr = this.textStr = this.listStyle = this.xAlign = this.yAlign = undefined;
      this.refreshTimer = this.showNextItem = this.rotateTimer = undefined;
      this.stockData = this.settings = undefined;
      this.textFontSize = undefined;
      this.colorCnp = undefined;
      this.prop = undefined;
    }
  }

class WidgetFlight{
  constructor(prop){
    this.settings = JSON.parse(prop.settings);
    this.endpoint = "/flightyyz/";
    this.reDuration = 900000;
    this.roDuration = 12000;
    this.containerArr = [];
    this.statusLower = "";
    this.rowHeight = 80;
    this.tempArr = [];
    this.refreshTimer;
    this.rotateTimer;
    this.prop = prop;
    this.status = "";
    this.fontFamily;
    this.flightObj;
    this.fontColor;
    this.fontSize;
    this.flight;
    this.bg;

    if(this.settings.rotationOpt == "c"){
      this.roDuration = this.settings.rotate * 1000;
    }
    window.getSvg('flight', 'hIcon', '#ffffff');

    this.htmStr = '<div id="' + this.prop.type + '-' + this.prop.id + '" class="flight" style="width:'+ this.prop.w +'px;height:'+ this.prop.h +'px;background-color:'+ window.hexToRgbA(this.settings.bg, this.settings.bga) +';"><div style="overflow:hidden;height:'+ this.prop.h +'px">';

    this.htmStr += '<div id="header"><div class="flightHeadH d-flex align-items-center padLR10" style="background-color:'+ window.hexToRgbA(this.settings.headerBg, this.settings.headerBga) +';"><div id="headerTxt" class="wHeader" style="font-family:' + this.settings.headerFont.value + ';font-size:' + this.settings.headerSize + 'px;color:' + this.settings.headerText + ';"><div class="icon hIcon"></div><div>' + (this.prop.dtype == "Arrival" ? "Arrival Schedule for " : "Departure Schedule for ") + this.prop.airportName +'</div></div></div><div style="background-color:'+ window.hexToRgbA(this.settings.headerBg, 0.8) +'; font-family:'+ this.settings.headerFont.value +'; color:'+ this.settings.headerText +';" class="fSHeader d-flex"><div style="width:'+ (this.prop.w * 0.20 - 65) +'px; padding-left:65px;" class="padLR10">Flights</div><div style="width:'+ (this.prop.w * 0.30 - 4) +'px; padding-left:4px;" class="padLR10">City</div><div style="width:'+ this.prop.w * 0.15 +'px;" class="padLR10">Time</div><div style="width:'+ this.prop.w * 0.15 +'px;" class="padLR10">Terminal</div><div class="text-r padLR10" style="width:'+ (this.prop.w * 0.20 - 38) +'px;">Status</div><div style="padding-right:20px">&nbsp;</div></div></div>';
    this.htmStr += '<div id="mContainer"></div>';
    this.htmStr += '<div class="w100 flightFooter" style="background:'+window.hexToRgbA(this.settings.headerBg, this.settings.headerBga)+'"></div>';
    this.htmStr += '</div></div>';

    setTimeout(()=>{this.init()}, 200);
    return this.htmStr;
  }

  init(){
    this.loadFeed();
    this.refreshTimer = setInterval(()=>{this.loadFeed();}, this.reDuration);
    //window.addTimer(this.refreshTimer, "i", this.prop.fid);
  }

  loadFeed(){
    this.htmStr = "";
    if(this.prop.src.toLowerCase() == "yul"){
      this.endpoint = "/flightyul/";
    }

    $.get(apiPath + this.endpoint + this.prop.id.split("-")[2] + "?format=json&" + new Date().getTime(), (data)=>{
      this.flight = data.flight;
      this.loadHtmlFx();
    })
    .fail(function(){});
  }

  loadHtmlFx(){
    this.htmStr = "";
    if(this.flight.length > 0){
      $("#" + this.prop.type + "-" + this.prop.id + " #mContainer").empty();
      $("#" + this.prop.type + "-" + this.prop.id + " #mContainer").append('<div id="rows"></div>');
      this.containerArr = [];
      this.tempArr = [];
      this.num = 0;

      if(this.rotateTimer){
        clearInterval(this.rotateTimer);
      }

      for (var i = 0; i < this.flight.length; i++) {
        if (i % 2 == 0){
          this.fontFamily = this.settings.rowFont.value;
          this.fontSize = this.settings.rowSize;
        } else{
          this.fontFamily = this.settings.altFont.value;
          this.fontSize = this.settings.altSize;
        }

        this.htmStr = '<div id="row-' + i + '" style="visibility:hidden;"><div class="padLR10 d-flex align-items-center" style="font-size:'+ this.fontSize +'px;min-height:'+ this.rowHeight +'px;font-family:'+ this.fontFamily +'"><div class="text-overflow" style="width:'+ this.prop.w * 0.20 +'px;"><div class="pull-left"><div><img src="./img/airlines/default.png"></div></div><div style="margin-left:55px"><div class="flightName">'+ this.flight[i].FlightNumber +'</div><div class="text-xs airlineName" style="color:'+ this.settings.airline +'">'+ this.flight[i].AirlineName +'</div></div></div><div class="text-overflow" style="width:'+ this.prop.w * 0.30 +'px;">'+ this.flight[i].City + '</div><div class="text-overflow" style="width:' + this.prop.w * 0.15 + 'px;">' + this.flight[i].ScheduledTime.split(",")[1] +'</div><div class="text-overflow" style="width:'+ this.prop.w * 0.15 +'px;color:'+ this.settings.terminal +'">'+ this.flight[i].Terminal +'</div><div class="text-overflow padR10 d-flex align-items-center" style="width:'+ this.prop.w * 0.20 +'px;color:'+ this.settings.statusDefault +'"><div class="text-overflow marR10 flex-grow-1">'+ this.flight[i].Remarks +'</div><div class="boxIcon"></div></div><div class="clearfix"></div></div>';
        this.htmStr += '</div>';

        $("#" + this.prop.type + "-" + this.prop.id + " #mContainer #rows").append(this.htmStr);
        if(($("#" + this.prop.type + "-" + this.prop.id + " #mContainer #rows").outerHeight() + $("#" + this.prop.type + "-" + this.prop.id + " #header").outerHeight()) > this.prop.h){
          this.containerArr.push(this.tempArr);
          this.tempArr = [];
          i = i-1;
          $("#" + this.prop.type + "-" + this.prop.id + " #mContainer #rows").empty();
        }
        else{
          this.tempArr.push({index:i});
        }
      }
      if(this.tempArr.length > 0){
        this.containerArr.push(this.tempArr);
      }

      $("#" + this.prop.type + "-" + this.prop.id + " #mContainer").empty();
      for(var j=0; j<this.containerArr.length; j++){
        $("#" + this.prop.type + "-" + this.prop.id + " #mContainer").append('<div id="rows-' + j + '" style="position:absolute;visibility:hidden;width:' + this.prop.w + 'px;"></div>');
        for(var k=0; k<this.containerArr[j].length; k++){
          if (k % 2 == 0){
            this.bg = window.hexToRgbA(this.settings.rowBg, this.settings.rowBga);
            this.fontFamily = this.settings.rowFont.value;
            this.fontSize = this.settings.rowSize;
          }
          else {
            this.bg = window.hexToRgbA(this.settings.altBg, this.settings.altBga);
            this.fontFamily = this.settings.altFont.value;
            this.fontSize = this.settings.altSize;
          }

          this.flightObj = this.flight[this.containerArr[j][k].index];
          this.status = this.flightObj.Remarks;
          if(this.status == "-"){
            this.status = "On Time";
          }
          this.statusLower = this.status.toLowerCase();

          if (this.statusLower == 'delayed' || this.statusLower == "revised time"){
            this.fontColor = this.settings.delayedText;
          }
          else if (this.statusLower == 'on time'){
            this.fontColor = this.settings.ontimeText;
          }
          else if (this.statusLower == 'Cancel' || this.statusLower == 'Cancelled' || this.statusLower == "canceled"){
            this.fontColor = this.settings.canceledText;
          }
          else if (this.statusLower == 'arrived' || this.statusLower == 'departed' || this.statusLower == 'Left' || this.statusLower == "advanced"){
            this.fontColor = this.settings.arrivedText;
          }
          else {
            this.fontColor = this.settings.flight;
          }

          this.htmStr = '<div class="padLR10 d-flex align-items-center" style="font-size:'+ this.fontSize +'px;min-height:'+ this.rowHeight +'px;background:'+ this.bg +';font-family:'+ this.fontFamily +'"><div class="text-overflow" style="width:'+ this.prop.w * 0.20 +'px;"><div class="pull-left"><div><img src="./img/airlines/' + this.flightObj.AirlineCode + '.png" onerror="this.src = \'./img/airlines/default.png\';" style="padding:8px;"></div></div><div style="margin-left:55px"><div class="flightName" style="color:'+ this.fontColor +'">'+ this.flightObj.FlightNumber +'</div><div class="text-xs airlineName" style="color:'+ this.settings.airline +'">'+ this.flightObj.AirlineName +'</div></div></div><div class="text-overflow padLR10" style="width:'+ this.prop.w * 0.30 +'px;color:'+ this.settings.city +'"><span class="text-ellipsis">'+ this.flightObj.City + '</span></div><div class="text-overflow padLR10" style="width:' + this.prop.w * 0.15 + 'px;color:' + this.settings.time + '">' + this.flightObj.ScheduledTime.split(",")[1] +'</div><div class="text-overflow padLR10" style="width:'+ this.prop.w * 0.15 +'px;color:'+ this.settings.terminal +'">'+ this.flightObj.Terminal +'</div><div class="text-overflow d-flex align-items-center" style="width:'+ this.prop.w * 0.20 +'px;color:'+ this.settings.statusDefault +'"><div class="text-overflow flex-grow-1 text-r marR10">'+ this.status +'</div><div class="boxIcon" style="background:'+ this.fontColor +';"></div></div><div class="clearfix"></div></div>';
          $("#" + this.prop.type + "-" + this.prop.id + " #mContainer #rows-" + j).append(this.htmStr);
        }
      }

      this.num = 0;
      this.pageCount = 1;
      $("#" + this.prop.type + "-" + this.prop.id + " #mContainer #rows-" + this.num).css("visibility", "visible");
      this.rotateTimer = setInterval(()=>{
        $("#" + this.prop.type + "-" + this.prop.id + " #mContainer #rows-" + this.num).css("visibility", "hidden");
        this.num++;
        this.pageCount++;
        if(this.num >= $("#" + this.prop.type + "-" + this.prop.id + " #mContainer>div").length){
          this.num = 0;
          this.pageCount = 1;
        }
        $("#" + this.prop.type + "-" + this.prop.id + " #mContainer #rows-"+ this.num).css("visibility", "visible");
      }, this.roDuration);
      //window.addTimer(this.rotateTimer, "i", this.prop.fid);
    }
  }

  removeFx(){
    if(this.rotateTimer){
      clearInterval(this.rotateTimer);
    }
    clearInterval(this.refreshTimer);

    this.reDuration = this.roDuration = this.rowHeight = null;
    this.endpoint = this.status = this.statusLower = null;
    this.containerArr = this.tempArr = null;
    this.refreshTimer = null;
    this.rotateTimer = null;
    this.fontFamily = null;
    this.flightObj = null;
    this.fontColor = null;
    this.settings = null;
    this.fontSize = null;
    this.flight = null;
    this.prop = null;
    this.bg = null;

    this.reDuration = this.roDuration = this.rowHeight = undefined;
    this.endpoint = this.status = this.statusLower = undefined;
    this.containerArr = this.tempArr = undefined;
    this.refreshTimer = undefined;
    this.rotateTimer = undefined;
    this.fontFamily = undefined;
    this.flightObj = undefined;
    this.fontColor = undefined;
    this.settings = undefined;
    this.fontSize = undefined;
    this.flight = undefined;
    this.prop = undefined;
    this.bg = undefined;
  }
}

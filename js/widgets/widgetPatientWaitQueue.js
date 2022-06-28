class WidgetPatientWaitQueue{
  constructor(prop){
    this.settings = JSON.parse(prop.settings);
    this.endpoint = this.settings.ep;
    this.maxH = parseInt(prop.h);
    this.addableCount = 0;
    this.addable = true;
    this.pwApiPath = "";
    this.stackArr = [];
    this.dateArr = [];
    this.timeArr = [];
    this.curArr = [];
    this.prop = prop;
    this.rotateTimer;
    this.itemNum = 0;
    this.listNum = 0;
    this.pName = "";
    this.apptDate;
    this.curDate;
    this.feed;

    if (this.settings.environment == "p") {
			this.pwtApiPath = "http://PWT_WebServices.Lifelabs.com:86/LLBooking/webservice.asmx/" + this.endpoint + "?SiteID=" + this.prop.src + "&";
		}
		else if(this.settings.environment == "t"){
			this.pwtApiPath = "http://sdwvwwpwt102:82/release/webservice.asmx/" + this.endpoint + "?SiteID=" + this.prop.src + "&";
		}
		else if(this.settings.environment == "tr"){
			this.pwtApiPath = "http://sdwvwwpwt102:83/Training/webservice.asmx/" + this.endpoint + "?SiteID=" + this.prop.src + "&";
		}

    this.htmStr = '<div id="' + this.prop.type + '-' + this.prop.id + '" style="position:relative;width:' + this.prop.w + 'px;height:' + this.prop.h + 'px;background:' + window.hexToRgbA(this.settings.bg, this.settings.bga) + ';font-weight:bold">';
    if(this.settings.header.hText != ""){
      this.htmStr += '<div id="header" style="background:' + window.hexToRgbA(this.settings.header.bg, this.settings.header.bga) + ';padding:10px;font-family:' + this.settings.header.font.value + ';font-size:' + this.settings.header.size + 'px;text-align:center;color:' + this.settings.header.text + ';">' + this.settings.header.hText + '</div>';
    }
    this.htmStr += '<style type="text/css">#' + this.prop.type + '-' + this.prop.id + ' #wq-list{font-family:' + this.settings.rowFont.value + ';font-size:' + this.settings.rowSize + 'px;line-height:62px;color:' + this.settings.arrived + '}#' + this.prop.type + '-' + this.prop.id + ' #wq-list .wq-list-item:nth-child(odd){background:' + window.hexToRgbA(this.settings.rowBg, this.settings.rowBga) + ';}#' + this.prop.type + '-' + this.prop.id + ' #wq-list .wq-list-item:nth-child(even){background:' + window.hexToRgbA(this.settings.altBg, this.settings.altBga) + ';}#' + this.prop.type + '-' + this.prop.id + ' #wq-list .wq-list-item .img-container{float:left;padding:10px;width:62px;}#' + this.prop.type + '-' + this.prop.id + ' #wq-list .wq-list-item .img{height:62px;line-height:62px;background-color:' + this.settings.iconColor + ';}#' + this.prop.type + '-' + this.prop.id + ' #wq-list .wq-list-item:nth-child(even) .img{background-color:' + this.settings.altIconColor + ';}#' + this.prop.type + '-' + this.prop.id + ' #wq-list .wq-list-item .name{height:62px;line-height:62px;text-align:left;}#' + this.prop.type + '-' + this.prop.id + ' #wq-list .wq-list-item .name div{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}#' + this.prop.type + '-' + this.prop.id + ' #wq-list .wq-list-item .time{float:right;width:120px;height:62px;line-height:62px;padding:10px 10px 10px 0;overflow:hidden;text-align:right;}#' + this.prop.type + '-' + this.prop.id + ' #wq-list .wq-list-item .number{float:right;width:40px;height:62px;line-height:62px;padding:10px;text-align:center;background:' + window.hexToRgbA(this.settings.numberBg, this.settings.numberBga) + ';color:' + this.settings.numberText + ';font-family:' + this.settings.numberFont.value + ';font-size:' + this.settings.numberSize + 'px;}#' + this.prop.type + '-' + this.prop.id + ' #wq-list .wq-list-item:nth-child(even) .number{background:' + window.hexToRgbA(this.settings.numberBg, (this.settings.numberBga - 0.2)) + ';}</style>';
    this.htmStr += '<div id="wait-queue-container"></div>';
    if(this.settings.footer.fText != ""){
      this.htmStr += '<div id="footer" style="position:absolute;bottom:0;width:100%;background:' + window.hexToRgbA(this.settings.footer.bg, this.settings.footer.bga) + ';padding:10px;font-family:' + this.settings.footer.font.value + ';font-size:' + this.settings.footer.size + 'px;color:' + this.settings.footer.text + ';">' + this.settings.footer.fText + '</div>';
    }
    this.htmStr += '</div>';
    setTimeout(()=>{this.init()}, 200);
    return this.htmStr;
  }

  init(){
    this.maxH = parseInt(this.prop.h - ($("#" + this.prop.type + "-" + this.prop.id + " #header").height() + $("#" + this.prop.type + "-" + this.prop.id + " #footer").height()));
    this.loadFeed();

    this.refreshTimer = setInterval(()=>{this.loadFeed();}, this.settings.reload * 1000);
    //window.addTimer(this.refreshTimer, "i", this.prop.fid);
  }

  loadFeed(){
    if(fs.existsSync(resourcePath + "/queue.php.xml")){
      this.pwtApiPath = resourcePath + "/queue.php.xml?"
    }
    $.ajax({
      url: this.pwtApiPath + new Date().getTime(),
      dataType: "xml",
      async: false,
      success: (data)=>{
        this.feed = $(data).find("DocumentElement Appt");
        if(this.feed.length == 0){
          this.fillBlankRows();
        }
        else{
          this.stackListItems();
        }
      },
      error: function(err){
        console.log(err);
      }
    });
  }


  stackListItems(){
    this.addableCount = 0;
    this.stackArr = [];
    this.curArr = [];
    this.itemNum = 0;
    this.listNum = 0;

    $("#" + this.prop.type + '-' + this.prop.id + " #wait-queue-container").empty().append('<div id="wq-list"></div>');
    for(var i=0; i<this.feed.length; i++){
      this.addable = true;
      if ($(this.feed[i]).find("BookingType").text() == "CSR" || $(this.feed[i]).find("BookingType").text() == "WEB") {
				if ($(this.feed[i]).find("TimeArrived").text() == "") {
					this.curDate = new Date();
					this.dateArr = $(this.feed[i]).find("StartTime").text().split("T")[0].split("-");
					this.timeArr = $(this.feed[i]).find("StartTime").text().split("T")[1].split("-")[0].split(":");
					this.apptDate = new Date(this.dateArr[0], this.dateArr[1]-1, this.dateArr[2], this.timeArr[0], this.timeArr[1], this.timeArr[2]);

					if ((parseInt(this.curDate.getTime() / 1000) - parseInt(this.apptDate.getTime() / 1000)) >  3600) {
						this.addable = false;
					}
				}
			}
			if (this.addable) {
        this.addableCount++;
        this.listItemObj = new WidgetPatientWaitQueueItem({fname:$(this.feed[i]).find("FirstName").text(), lname:$(this.feed[i]).find("LastName").text(), stime:$(this.feed[i]).find("StartTime").text(), atime:$(this.feed[i]).find("TimeArrived").text(), type:$(this.feed[i]).find("BookingType").text(), parentApptId:$(this.feed[i]).find("parentApptId").text(), estimatedWaitTime:$(this.feed[i]).find("EstimatedWaitTime").text(), w:this.prop.w, num:this.itemNum, ep:this.endpoint, settings:this.settings});
        $("#" + this.prop.type + '-' + this.prop.id + " #wq-list").append(this.listItemObj.htmStr);
        this.itemNum++;
        if($("#" + this.prop.type + '-' + this.prop.id + " #wq-list").outerHeight() > this.maxH){
          if(this.curArr.length > 0){
            this.stackArr.push(this.curArr);
            this.curArr = [];
            this.curArr.push(i);
            $("#" + this.prop.type + '-' + this.prop.id + " #wait-queue-container").empty().append('<div id="wq-list"></div>');
            $("#" + this.prop.type + '-' + this.prop.id + " #wq-list").append(this.listItemObj.htmStr);
          }
          else{
            console.log("height is too low to accomodate even single item.");
          }
        }
        else{
          this.curArr.push(i);
        }
      }
    }
    if (this.addableCount == 0) {
			this.fillBlankRows();
		}
    if(this.curArr.length > 0){
      this.stackArr.push(this.curArr);
    }
    if(this.rotateTimer){
      clearInterval(this.rotateTimer);
    }
    if(this.stackArr.length > 1){
      $("#" + this.prop.type + '-' + this.prop.id + " #wait-queue-container").empty();
      this.listStyle = "opacity:0;";
      this.htmStr = "";
      this.listNum = 0;
      this.itemNum = 0;
      if(this.prop.transition == "n"){
        this.listStyle = "visibility:hidden;";
      }
      for(var i=0; i<this.stackArr.length; i++){
        if(i == 0){
          this.htmStr += '<div id="wq-list" class="list-' + i + '" style="position:absolute;width:' + this.prop.w + 'px;">';
        }
        else{
          this.htmStr += '<div id="wq-list" class="list-' + i + '" style="position:absolute;width:' + this.prop.w + 'px;' + this.listStyle + '">';
        }
        for(var j=0; j<this.stackArr[i].length; j++){
          this.listItemObj = new WidgetPatientWaitQueueItem({fname:$(this.feed[this.stackArr[i][j]]).find("FirstName").text(), lname:$(this.feed[this.stackArr[i][j]]).find("LastName").text(), stime:$(this.feed[this.stackArr[i][j]]).find("StartTime").text(), atime:$(this.feed[this.stackArr[i][j]]).find("TimeArrived").text(), type:$(this.feed[this.stackArr[i][j]]).find("BookingType").text(), parentApptId:$(this.feed[this.stackArr[i][j]]).find("parentApptId").text(), estimatedWaitTime:$(this.feed[this.stackArr[i][j]]).find("EstimatedWaitTime").text(), w:this.prop.w, num:this.itemNum, ep:this.endpoint, settings:this.settings});
          this.htmStr += this.listItemObj.htmStr;
          this.itemNum++;
        }
        this.htmStr += '</div>';
      }
      $("#" + this.prop.type + '-' + this.prop.id + " #wait-queue-container").append(this.htmStr);
      this.rotateTimer = setInterval(()=>{
        if(this.prop.transition == "f"){
          $("#" + this.prop.type + '-' + this.prop.id + " #wait-queue-container #wq-list.list-" + this.listNum).css({"opacity":0});
        }
        else{
          $("#" + this.prop.type + '-' + this.prop.id + " #wait-queue-container #wq-list.list-" + this.listNum).css({"visibility":"hidden"});
        }
        this.listNum++;
        if(this.listNum >= this.stackArr.length){
          this.listNum = 0;
        }
        if(this.prop.transition == "f"){
          TweenMax.to($("#" + this.prop.type + '-' + this.prop.id + " #wait-queue-container #wq-list.list-" + this.listNum), 0.5, {opacity:1});
        }
        else{
          $("#" + this.prop.type + '-' + this.prop.id + " #wait-queue-container #wq-list.list-" + this.listNum).css("visibility", "visible");
        }
      }, 12000);
      //window.addTimer(this.rotateTimer, "i", this.prop.fid);
    }
  }

  fillBlankRows() {
    $("#" + this.prop.type + '-' + this.prop.id + " #wait-queue-container").empty().append('<div id="wq-list"></div>');
    for (var i = 0; i < 50; i++) {
      $("#" + this.prop.type + '-' + this.prop.id + " #wait-queue-container #wq-list").append('<div class="wq-list-item" style="height:62px;line-height:62px;">&nbsp;</div>');
      if(($("#" + this.prop.type + '-' + this.prop.id + " #wq-list").outerHeight() + 62) > this.maxH){
        break;
      }
		}
	}

  removeFx(){
    if(this.rotateTimer){
      clearInterval(this.rotateTimer);
    }
    clearInterval(this.refreshTimer);

    this.endpoint = this.listStyle = this.htmStr = this.pName = this.pwApiPath = null;
    this.maxH = this.addableCount = this.itemNum = this.listNum = null;
    this.stackArr = this.dateArr = this.timeArr = this.curArr = null;
    this.apptDate = this.curDate = null;
    this.feed = this.prop = null;
    this.refreshTimer = null;
    this.rotateTimer = null;
    this.listItemObj = null;
    this.settings = null;
    this.addable = null;

    this.endpoint = this.listStyle = this.htmStr = this.pName = this.pwApiPath = undefined;
    this.maxH = this.addableCount = this.itemNum = this.listNum = undefined;
    this.stackArr = this.dateArr = this.timeArr = this.curArr = undefined;
    this.apptDate = this.curDate = undefined;
    this.feed = this.prop = undefined;
    this.refreshTimer = undefined;
    this.rotateTimer = undefined;
    this.listItemObj = undefined;
    this.settings = undefined;
    this.addable = undefined;
  }
}

class WidgetPatientWaitTime{
  constructor(prop){
    this.settings = JSON.parse(prop.settings);
    this.isLoaded = false;
    this.pwApiPath = "";
    this.prop = prop;
    this.apicall;

    if (this.settings.environment == "p") {
			this.pwtApiPath = "http://PWT_WebServices.Lifelabs.com:86/LLBooking/webservice.asmx/GetWaitTimeForPSCTV?SiteID=" + this.prop.src + "&";
		}
		else if (this.settings.environment == "t") {
			this.pwtApiPath = "http://sdwvwwpwt102:82/release/webservice.asmx/GetWaitTimeForPSCTV?SiteID=" + this.prop.src + "&";
		}
		else if (this.settings.environment == "tr") {
			this.pwtApiPath = "http://sdwvwwpwt102:83/Training/webservice.asmx/GetWaitTimeForPSCTV?SiteID=" + this.prop.src + "&";
		}

    this.htmStr = '<div id="' + this.prop.type + '-' + this.prop.id + '" style="width:' + this.prop.w + 'px;height:' + this.prop.h + 'px;background:' + window.hexToRgbA(this.settings.bg, this.settings.bga) + ';text-align:center;font-weight:bold">';
    if(this.settings.header.hText != ""){
      this.htmStr += '<div style="background:' + window.hexToRgbA(this.settings.header.bg, this.settings.header.bga) + ';padding:10px;font-family:' + this.settings.header.font.value + ';font-size:' + this.settings.header.size + 'px;color:' + this.settings.header.text + ';">' + this.settings.header.hText + '</div>';
    }
    this.htmStr += '<div id="wait-time" style="padding:0 10px;font-family:' + this.settings.font.value +';font-size:' + this.settings.size + 'px;color:'  + this.settings.text + ';"></div></div>';
    setTimeout(()=>{this.init()}, 200);
    return this.htmStr;
  }

  init(){
    this.loadFeed();
    this.refreshTimer = setInterval(()=>{this.loadFeed();}, this.settings.reload * 1000);
    window.addTimer(this.refreshTimer, "i", this.prop.fid);
  }

  loadFeed(){
    if(fs.existsSync(resourcePath + "/time.php.xml")){
      this.pwtApiPath = resourcePath + "/time.php.xml?"
    }
    this.apicall = $.ajax({
      url: this.pwtApiPath + new Date().getTime(),
      dataType: "xml",
      async: false,
      success: (data)=>{
        this.localFeed = $(data).find("DocumentElement Appt WaitTime");
        this.isLoaded = true;
        if(this.localFeed.length == 0){
          $("#" + this.prop.type + "-" + this.prop.id + " #wait-time").html("0");
        }
        else{
          $("#" + this.prop.type + "-" + this.prop.id + " #wait-time").html(this.localFeed.text());
        }
      },
      error: function(err){
        console.log(err);
      }
    });
  }

  removeFx(){
    if(!this.isLoaded){
      try{
        this.apicall.abort();
      }
      catch(e){}
      this.apicall = null;
    }

    this.pwApiPath = this.htmStr = null;
    this.settings = this.prop = null;
    this.isLoaded = null;
    this.apicall = null;

    this.pwApiPath = this.htmStr = undefined;
    this.settings = this.prop = undefined;
    this.isLoaded = undefined;
    this.apicall = undefined;
  }
}

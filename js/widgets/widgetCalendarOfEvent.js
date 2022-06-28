class WidgetCalendarOfEvent{
    constructor(prop){
        this.settings = JSON.parse(prop.settings);
        this.roDuration = 12000;
        this.reDuration = 900000;
        this.maxHeight = prop.h;
        this.containerArr = [];
        this.tempArr = [];
        this.refreshTimer;
        this.rotateTimer;
        this.prop = prop;
        this.rbCount = 0;
        this.sCount = 0;
        this.feedDetail;
        this.ssTimer;
        this.rbTimer;
        this.num = 0;

        if(this.settings.rotateOpt == "c"){
            this.roDuration = this.settings.rotate * 1000;
        }
        if(this.settings.reloadOpt == "c"){
            this.reDuration = this.settings.reload * 1000;
        }

        if(this.prop.transition == "f"){
            this.visibilityCssStr = "opacity:0;";
        }

        this.htmStr = '<div id="' + this.prop.type + '-' + this.prop.id + '" style="width:' + this.prop.w + 'px;height:' + this.prop.h + 'px;background:' + this.hexToRgbA(this.settings.bg, this.settings.bga) + '">';

        this.htmStr += '<div class="mContainer">';
        if(this.prop.src == 'wb'){
            this.htmStr += '<style type="text/css">#tHead{color:' + this.settings.headerText + ';font-family:' + this.settings.headerFont.value + ';background:' + this.hexToRgbA(this.settings.headerBg, this.settings.headerBga) + '}</style>';
            if(this.settings.header.active){
                this.htmStr += '<div id="tHead" class="calendarHeaderText" style="display:flex; background: transparent;"><div class="pad10" style="width:'+ this.prop.w / 100 * 60 +'px;"></div></div>';
            }
        }
        this.htmStr += '<div id="tBody"></div>';
        this.htmStr += '</div>';

        setTimeout(()=>{this.init()}, 200);
        return this.htmStr;
    }

    init(){
        this.loadES();
        this.refreshTimer = setInterval(()=>{this.loadES()}, this.reDuration);
        // window.addTimer(this.refreshTimer, "i", this.prop.fid);
    }

    loadES(){
        this.htmStr = "";
        // console.warn('URL', apiPath + "/calendarOfEvents/" + this.prop.id.split("-")[2] + "/" + mac);
        var screenSaver = [];
        var calendar = [];
        $.ajax({
            url: apiPath + "/calendarOfEvents/" + this.prop.id.split("-")[2] + "/" + mac, // apiPath + "/excelSheet/"+ this.prop.id.split("-")[2],
            dataType: 'xml',
            async: false,
            success:(data) =>{
                this.calendarObj = data;
                console.warn(this.calendarObj);

                $(data).find('calendarOfEvents screensavers ss').each(function () {
                    screenSaver.push({path:$(this).attr('path')});
                });

                $(data).find('calendarOfEvents events event').each(function(){
                    calendar.push({ title:$(this).attr('title'), description:$(this).attr('description'), logo:$(this).attr('logo'), starttime:$(this).attr('starttime'), endtime:$(this).attr('endtime'), dType:$(this).attr('dType'), dType:$(this).attr('dType'), location:$(this).attr('location'), floor:$(this).attr('floor'), device:$(this).attr('device')});
                });
                this.screenSaver = screenSaver;
                this.calendar = calendar;
            },
            error: function(err){
                console.error(err);
            }
        });
        this.loadHtmlFx();
    }

    loadHtmlFx(){
        console.warn('CalendarObject',this.calendar);
        this.htmStr = "";
        this.hCol = this.calendar;
        if(this.calendar.length > 0){
            if(this.prop.src == 'rb'){
                this.showNextRoomBoard = () => {
                    if (this.rbCount == this.calendar.length){
                        this.rbCount = 0;
                    } else {
                        this.displayRb();
                    }
                }
                this.displayRb();
                this.rbTimer = setInterval(()=>{
                    this.showNextRoomBoard();
                }, this.roDuration);
                //window.addTimer(this.rbTimer, "i", this.prop.fid);
            } else if(this.prop.src == 'wb'){
                if(this.settings.header.active){
                    $("#" + this.prop.type + "-" + this.prop.id + " #tHead").empty();
                    $("#" + this.prop.type + "-" + this.prop.id + " #tHead").append('<div class="pad10" style="width:'+ this.prop.w / 100 * 60 +'px;">'+ this.settings.header.column1 +'</div><div class=" pad10 text-c" style="width:'+ this.prop.w / 100 * 15 +'px;">'+ this.settings.header.column2 +'</div><div class="pad10 text-c" style="width:'+ this.prop.w / 100 * 25 + 'px;">'+ this.settings.header.column3 +'</div></div>');
                } else {
                    $("#tHead").empty();
                }

                $("#" + this.prop.type + "-" + this.prop.id + " #tBody").empty();
                $("#" + this.prop.type + "-" + this.prop.id + " #tBody").append('<div id="rows"></div>');
                this.containerArr = [];
                this.tempArr = [];
                this.num = 0;
                this.feedDetail = 0;

                for (var i = 0; i < this.calendar.length; i++) {
                    this.feedDetail = this.calendar[i];

                    this.htmStr = '<div id="row-' + i + '" style="visibility: hidden;"><div class="wb-row d-flex"><div class="pull-left padTB10" style="width:' + this.prop.w / 100 * 60 + 'px;font-family:' + this.settings.titleFont.value + ';"><div class="padLR10 wb-title"><div class="wb-logo"><img src="' + this.feedDetail.logo + '"></div><span class="calendarTitle">' + this.feedDetail.title + '</span></div></div><div class="pull-left wb-time" style="width:' + this.prop.w / 100 * 15 + 'px;color:'+ this.settings.timeText +';font-family:' + this.settings.timeFont.value + '"><div>' + this.feedDetail.starttime + '</div><div>' + this.feedDetail.endtime + '</div></div><div class="wb-room pad10 word-break d-flex align-items-center justify-content-center" style="width:' + this.prop.w / 100 * 25 + 'px;color:'+ this.settings.roomText +';font-family:' + this.settings.roomFont.value + ';"><div class="padLR10">' + this.feedDetail.location + '</div></div><div class="clearfix"></div></div>';
                    this.htmStr += '</div>';

                    $("#" + this.prop.type + "-" + this.prop.id + " #tBody #rows").append(this.htmStr);

                    if(($("#" + this.prop.type + "-" + this.prop.id + " #tBody #rows").outerHeight() + ($("#" + this.prop.type + "-" + this.prop.id + " #tBody #rows").children().length * 15)) > this.maxHeight){
                        this.containerArr.push(this.tempArr);
                        this.tempArr = [];
                        this.tempArr.push({index:i});
                        $("#" + this.prop.type + "-" + this.prop.id + " #tBody #rows").empty();
                    }
                    else{
                        this.tempArr.push({index:i});
                    }
                }
                if(this.tempArr.length > 0){
                    this.containerArr.push(this.tempArr);
                }

                $("#" + this.prop.type + "-" + this.prop.id + " #tBody").empty();
                for(var j=0; j<this.containerArr.length; j++){
                    $("#" + this.prop.type + "-" + this.prop.id + " #tBody").append('<div id="rows-' + j + '" style="' + this.visibilityCssStr + 'position:absolute;width:' + this.prop.w + 'px;"></div>');
                    for(var k=0; k<this.containerArr[j].length; k++){
                        // alert(this.containerArr[j][k].index);
                        var bg;
                        var titleColor;
                        var timeColor;
                        var roomColor;
                        if (k % 2 == 0) {
                            bg = this.hexToRgbA(this.settings.rowBg, this.settings.rowBga);
                            titleColor = this.settings.titleText;
                            timeColor = this.settings.timeText;
                            roomColor = this.settings.roomText;
                        } else {
                            bg = this.hexToRgbA(this.settings.altBg, this.settings.altBga);
                            titleColor = this.settings.altTitleText;
                            timeColor = this.settings.altTimeText;
                            roomColor = this.settings.altRoomText;
                        }
                        this.htmStr = '<div class="wb-row d-flex" style="background:'+ bg +';"><div class="pull-left padTB10" style="width:' + this.prop.w / 100 * 60 + 'px;font-family:' + this.settings.titleFont.value + '; color:'+ titleColor +'"><div class="padLR10 wb-title"><div class="wb-logo"><img src="' + this.calendar[this.containerArr[j][k].index].logo + '"></div><span class="calendarTitle">' + this.calendar[this.containerArr[j][k].index].title + '</span></div></div><div class="pull-left wb-time" style="width:' + this.prop.w / 100 * 15 + 'px;color:'+ timeColor +';font-family:' + this.settings.timeFont.value + '"><div>' + this.calendar[this.containerArr[j][k].index].starttime + '</div><div>' + this.calendar[this.containerArr[j][k].index].endtime + '</div></div><div class="wb-room pad10 word-break d-flex align-items-center justify-content-center" style="width:' + this.prop.w / 100 * 25 + 'px;color:'+ roomColor +';font-family:' + this.settings.roomFont.value + ';"><div class="padLR10">' + this.calendar[this.containerArr[j][k].index].location + '</div></div><div class="clearfix"></div></div>';

                        this.htmStr += '</div>';
                        $("#" + this.prop.type + "-" + this.prop.id + " #tBody #rows-" + j).append(this.htmStr);
                    }
                }
                if(this.prop.transition == "f"){
                    TweenMax.to($("#" + this.prop.type + "-" + this.prop.id + " #tBody #rows-" + this.num), 0.5, {opacity:1});
                }
                else{
                    $("#" + this.prop.type + "-" + this.prop.id + " #tBody #rows-" + this.num).css("visibility", "visible");
                }

                this.pageCount = 1;
                this.rotateTimer = setInterval(()=>{
                    if(this.prop.transition == "f"){
                        TweenMax.to($("#" + this.prop.type + "-" + this.prop.id + " #tBody #rows-" + this.num), 0.5, {opacity:0});
                    }
                    else{
                        $("#" + this.prop.type + "-" + this.prop.id + " #tBody #rows-" + this.num).css("visibility", "hidden");
                    }
                    this.num++;
                    this.pageCount++;
                    if(this.num >= $("#" + this.prop.type + "-" + this.prop.id + " #tBody>div").length){
                        this.num = 0;
                        this.pageCount = 1;
                    }
                    console.warn('num',this.num);
                    if(this.prop.transition == "f"){
                        TweenMax.to($("#" + this.prop.type + "-" + this.prop.id + " #tBody #rows-" + this.num), 0.5, {opacity:1});
                    }
                    else{
                        $("#" + this.prop.type + "-" + this.prop.id + " #tBody #rows-"+ this.num).css("visibility", "visible");
                    }
                }, this.roDuration);
                //window.addTimer(this.rotateTimer, "i", this.prop.fid);
            }
        } else {
            $("#tHead").empty();
            this.showNextScreenSaver = ()=>{
                if (this.sCount == this.screenSaver.length){
                    this.sCount = 0;
                } else {
                    this.displaySs();
                }
            }

            if (this.screenSaver.length > 0){
                this.displaySs();
                console.warn(this.roDuration);

                this.ssTimer = setInterval(()=>{
                    this.showNextScreenSaver();
                }, this.roDuration);
                //window.addTimer(this.ssTimer, "i", this.prop.fid);
            }
        }
    }

    displayRb(){
        var image = (this.calendar[this.rbCount].logo ? '<div><img src="'+ this.calendar[this.rbCount].logo +'"></div>' : '');
        var roomBoard = "<div id='rowContainer' class='text-c roomBoard' style='height:"+ this.prop.h +"px;'>"+image+"<div style='color:"+this.settings.titleText+";font-family:"+this.settings.titleFont.value+";font-size:"+this.settings.titleSize+"px'>"+this.calendar[this.rbCount].title+"</div><div style='color:"+this.settings.timeText+";font-family:"+this.settings.timeFont.value+";font-size:"+this.settings.timeSize+"px;'>"+this.calendar[this.rbCount].starttime+" - "+this.calendar[this.rbCount].endtime+"</div></div>";
        console.warn('roomBoard', "#" + this.prop.type + "-" + this.prop.id + " .mContainer");

        $("#" + this.prop.type + "-" + this.prop.id + " .mContainer").html(roomBoard);
        this.rbCount++;
    }

    displaySs(){
        $("#tBody").css({"background": this.hexToRgbA(this.settings.ssbg, this.settings.ssbga), "height": this.prop.h});
        $("#tBody").addClass("d-flex justify-content-center align-items-center");
        var ext = this.screenSaver[this.sCount].path.split('.').pop();
        if (ext == 'png' || ext == 'jpg' || ext == 'jpeg') {
            var ss = '<img src="'+ resourcePath +'/media/'+ this.screenSaver[this.sCount].path +'" class="img-responsive" style="vertical-align:middle;height: width:'+ this.prop.w +'px;">';
        } else {
            var ss = '<video width="'+ this.prop.w +'" height="'+ this.prop.h +'" autoplay loop><source src="'+ resourcePath +'/media/'+ this.screenSaver[this.sCount].path +'" type="video/mp4">' +
                '</video>';
        }
        $("#tBody").html(ss);
        this.sCount++;
    }

    hexToRgbA(hex, alpha){
        var c;
        if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
            c = hex.substring(1).split('');
            if(c.length == 3){
                c = [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c = '0x' + c.join('');
            return 'rgba(' + [(c >> 16) & 255,(c >> 8) & 255, c & 255].join(',') + ', ' + alpha + ')';
        } else{
            return "rgba('255, 255, 255', " + alpha + ")";
        }
    }

    removeFx(){
      if(this.rotateTimer){
        clearInterval(this.rotateTimer);
        this.rotateTimer = null;
        this.rotateTimer = undefined;
      }

      if(this.ssTimer){
        clearInterval(this.ssTimer);
        this.ssTimer = null;
        this.ssTimer = undefined;
      }

      if(this.rbTimer){
        clearInterval(this.rbTimer);
        this.rbTimer = null;
        this.rbTimer = undefined;
      }
      
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
      this.refreshTimer = undefined;

      this.roDuration = this.reDuration = this.rbCount = this.sCount = this.num = this.maxHeight = null;
      this.containerArr = this.tempArr = null;
      this.feedDetail = null;
      this.settings = null;
      this.prop = null;

      this.roDuration = this.reDuration = this.rbCount = this.sCount = this.num = this.maxHeight = undefined;
      this.containerArr = this.tempArr = undefined;
      this.feedDetail = undefined;
      this.settings = undefined;
      this.prop = undefined;
    }
}

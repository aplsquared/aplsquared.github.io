class WidgetPatientWaitQueueItem{
  constructor(prop){
    this.txtColor = prop.settings.arrived;
    this.txtW = prop.w - 130;
    this.timeStr = "";
    this.prop = prop;
    this.bookingImg;
    this.pName = "";
    this.type = "";
    this.txtP = 0;

    if (this.prop.stime != "") {
			this.timeStr = this.prop.stime.split("T")[1].split("-")[0];
			this.timeStr = this.timeStr.substring(0, this.timeStr.length - 3);
			this.timeStr = this.convert12Hour(Number(this.timeStr.split(":")[0])) + ":" + this.padStr(this.timeStr.split(":")[1]);
		}

    if (this.prop.parentApptId && this.prop.parentApptId != 0) {
			this.type = "appointment";
		}
		else {
			if (this.prop.type == "CSR" || this.prop.type == "WEB") {
				this.type = "appointment";
			}
			else if (this.prop.type == "PSC") {
				this.type = "walkin";
			}
			else if (this.prop.type == "") {
				this.type = "";
			}
		}

		if (this.type == "appointment") {
			if (this.prop.atime == "" && this.prop.parentApptId == 0){
        this.txtColor = this.prop.settings.unarrived;
			}

			if (this.prop.settings.iconA == "a1") {
				this.bookingImg = "appointment-view1.svg";
			}
			else if (this.prop.settings.iconA == "a2") {
				this.bookingImg = "appointment-view2.svg";
			}
			else if (this.prop.settings.iconA == "a3") {
				this.bookingImg = "appointment-view3.svg";
			}
		}
		else if (this.type == "walkin") {
			if (this.prop.stime == this.prop.atime){
        this.txtColor = this.prop.settings.walkIn;
				if (this.prop.settings.iconW == "w1") {
					this.bookingImg = "walkin-view1.svg";
				}
				else if (this.prop.settings.iconW == "w2") {
					this.bookingImg = "walkin-view2.svg";
				}
				else if (this.prop.settings.iconW == "w3") {
					this.bookingImg = "walkin-view3.svg";
				}
				else if (this.prop.settings.iconW == "w4") {
					this.bookingImg = "walkin-view4.svg";
				}
			}
			else{
				if (this.prop.atime == ""){
          this.txtColor = this.prop.settings.uCheckIn;
				}
				else{
          this.txtColor = this.prop.settings.aCheckIn;
				}
				if (this.prop.settings.iconC == "c1") {
					this.bookingImg = "walkin-netcheckin-view1.svg";
				}
				else if (this.prop.settings.iconC == "w1") {
					this.bookingImg = "walkin-view1.svg";
				}
				else if (this.prop.settings.iconC == "w2") {
					this.bookingImg = "walkin-view2.svg";
				}
				else if (this.prop.settings.iconC == "w3") {
					this.bookingImg = "walkin-view3.svg";
				}
				else if (this.prop.settings.iconC == "w4") {
					this.bookingImg = "walkin-view4.svg"
				}
			}
			this.timeStr = this.prop.estimatedWaitTime + "m";
		}

    this.htmStr = '<div class="wq-list-item">';
    if(this.bookingImg != "") {
      this.htmStr += '<div class="img-container"><div class="img" style="-webkit-mask:url(img/patient-wait/' + this.bookingImg + ') no-repeat center;mask:url(img/patient-wait/' + this.bookingImg + ') no-repeat center;-webkit-mask-size:62px 62px;mask-size:62px 62px;"></div></div>';
      this.txtW -= 82;
      this.txtP = 82;
    }
    if(this.prop.ep == "GetPatientQueueForPSCTV"){
      this.txtW -= 60;
    }
    if(this.prop.ep == "GetPatientQueueForPSCTV"){
      this.htmStr += '<div class="number">' + (this.prop.num + 1) + '</div>';
    }
    this.htmStr += '<div class="time" style="color:' + this.txtColor + '">' + this.timeStr + '</div>';
    this.htmStr += '<div class="name" style="width:' + (this.txtW - 5) + 'px;padding:10px 0 10px ' + this.txtP + 'px;color:' + this.txtColor + '"><div>' + this.convertTextCase(this.prop.fname, this.prop.lname) + '</div></div>';
    this.htmStr += '</div>';

    return this.htmStr;
  }

  convertTextCase(fname, lname) {
		if (this.prop.settings.template == "t1") {
			this.pName = fname + " " + lname.substring(0, 1) + ".";
		}
		else if (this.prop.settings.template == "t2") {
			this.pName = fname.substring(0,1) + ". " + lname.substring(0,1) + ".";
		}
		else if (this.prop.settings.template == "t3") {
			this.pName = fname.substring(0,1) + ". " + lname.substring(0,3).toUpperCase();
		}

		if (this.prop.settings.textFormat == "u") {
			this.pName = this.pName.toUpperCase();
		}
		else if (this.prop.settings.textFormat == "l") {
			this.pName = this.pName.toLowerCase();
		}
		return this.pName;
	}

  convert12Hour(hours){
		var new_hour = String(hours);
		if(hours > 12){
			hours = hours - 12;
			new_hour = String(hours);
		}
		return new_hour;
	}

  padStr(str) {
		if (str.length < 2) {
			str = "0" + str;
		}
		return str;
	}

  removeFx(){
    this.bookingImg = this.txtColor = this.timeStr = this.pName = this.type = null;
    this.txtW = this.txtP = null;
    this.prop = null;

    this.bookingImg = this.txtColor = this.timeStr = this.pName = this.type = undefined;
    this.txtW = this.txtP = undefined;
    this.prop = undefined;
  }

}

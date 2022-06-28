class WidgetDateTime {
  constructor(prop) {
    this.settings = JSON.parse(prop.settings);
    this.curTime = new Date();
    this.isLocalTime = true;
    this.xAlign = "c";
    this.yAlign = "m";
    this.hourStr = "";
    this.ampmStr = "";
    this.dateStr = "";
    this.minStr = "";
    this.htmStr = "";
    this.prop = prop;
    this.months = [];
    this.scaledW = 0;
    this.scaledH = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.days = [];
    this.hours = 0;
    this.mins = 0;
    this.curW = 0;

    if(this.settings.template == "t1" || this.settings.template == "t5"){
      if(this.settings.lang == "en_US"){
        this.months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        this.days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      }
      else if(this.settings.lang == "fr_FR"){
        this.months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
        this.days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
      }
      else if(this.settings.lang == "es_ES"){
        this.months = ["enero", "febrero", "marzo", "abril", "Mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
        this.days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
      }
      else if(this.settings.lang == "pt_PT"){
        this.months = ["Janeiro", "Fevereiro", "Marchar", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        this.days = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
      }
    }
    else if(this.settings.template == "t2" || this.settings.template == "t6" || this.settings.template == "t7"){
      if(this.settings.lang == "en_US"){
        this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      }
      else if(this.settings.lang == "fr_FR"){
        this.months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
      }
      else if(this.settings.lang == "es_ES"){
        this.months = ["enero", "febrero", "marzo", "abril", "Mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
      }
      else if(this.settings.lang == "pt_PT"){
        this.months = ["Janeiro", "Fevereiro", "Marchar", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
      }
    }

    this.htmStr = '<div id="'+ this.prop.id +'" style="width:'+ this.prop.w +'px;height:'+ this.prop.h +'px"><div id="dt-'+ this.prop.id +'" style="transform-origin:0 0;float:left;visibility:hidden;">';
    if(this.settings.template == 't1' || this.settings.template == 't3'){
      if(this.settings.format == "24h"){
        this.curW = 200;
      } else{
        this.curW = 185;
      }
      this.htmStr += '<div class="text-bold" style="margin:0 auto;font-family:\''+ this.settings.font.value +'\';width:'+ this.curW +'px;">'+
        '<div id="hourStr" class="blocks" style="text-align:center;float:left;background:'+ window.hexToRgbA(this.settings.bg, this.settings.bga) +';border-radius:4px;color:'+ this.settings.timeText +';width:75px;font-size:40px;padding:4px 0;"></div>';
      if(this.settings.format == "24h"){
        this.htmStr += '<div style="text-align:center;float:left;color:'+ window.hexToRgbA(this.settings.bg, this.settings.bga) +';width:40px;font-size:40px;padding:4px 0;">h</div>';
      } else{
        this.htmStr += '<div class="blink" style="text-align:center;float:left;color:'+ window.hexToRgbA(this.settings.bg, this.settings.bga) +';width:25px;font-size:40px;padding:4px 0;">:</div>';
      }
      this.htmStr += '<div style="text-align:center;float:left;background:'+ window.hexToRgbA(this.settings.bg, this.settings.bga) +';border-radius:4px;color:'+ this.settings.timeText +';width:85px;font-size:40px;padding:4px 0;"><span id="minStr"></span><span id="ampmStr" style="font-weight:normal;font-size:14px;margin-left:4px;"></span></div><div class="clearfix"></div>';
      if(this.settings.template == 't1'){
        this.htmStr += '</div>';
        this.htmStr += '<div id="dateStr" style="white-space:nowrap;color:'+ this.settings.dateText +';font-family:\''+ this.settings.font.value +'\';font-size:20px;text-align:center;margin-top:5px"></div>';
      }
    }
    else if(this.settings.template == 't2'){
      this.htmStr += '<div class="text-c" style="margin-top:-10px;white-space:nowrap;color:'+ this.settings.timeText +';font-family:'+ this.settings.font.value +';font-weight:bold;font-size:35px;"><span id="hourStr"></span>';
      if(this.settings.format == "24h"){
        this.htmStr += '<span>h</span>';
      } else{
        this.htmStr += '<span class="blink">:</span>';
      }
      this.htmStr += '<span id="minStr"></span> <span id="ampmStr"></span>';
      this.htmStr += '</div>';
      this.htmStr += '<div id="dateStr" style="white-space:nowrap;color:'+ this.settings.dateText +';font-family:'+ this.settings.font.value +';font-size:24px;text-align:center;font-weight:bold;"></div>';
    }
    else if(this.settings.template == 't4'){
      this.htmStr += '<div class="text-bold text-c" style="color:'+ this.settings.timeText +';font-family:'+ this.settings.font.value +';font-size:52px;padding:10px 0">';
      this.htmStr += '<span id="hourStr"></span>';
      if(this.settings.format == "24h"){
        this.htmStr += '<span>h</span>';
      } else{
        this.htmStr += '<span class="blink">:</span>';
      }
      this.htmStr += '<span id="minStr"></span> <span id="ampmStr"></span>';
      this.htmStr += '</div>';
    }
    else if(this.settings.template == 't5'){
      this.htmStr += '<div id="dateStr" class="text-c" style="white-space:nowrap;color:'+ this.settings.dateText +';font-family:'+ this.settings.font.value +';font-size:'+ prop.w*0.085 +'px"></div>';
    }
    else if(this.settings.template == 't6'){
      this.htmStr += '<div id="dateStr" class="text-c text-bold" style="white-space:nowrap;color:'+ this.settings.dateText +';font-family:'+ this.settings.font.value +';font-size:'+ prop.w*0.085 +'px"></div>';
    }
    else if(this.settings.template == 't7'){
      this.htmStr += '<div id="dateStr" style="white-space:nowrap;color:'+ this.settings.dateText +';font-family:'+ this.settings.font.value +';font-size:24px;text-align:center;font-weight:bold;"></div>';
      this.htmStr += '<div class="text-c" style="white-space:nowrap;color:'+ this.settings.timeText +';font-family:'+ this.settings.font.value +';font-weight:bold;font-size:35px;"><span id="hourStr"></span>';
      if(this.settings.format == "24h"){
        this.htmStr += '<span>h</span>';
      } else{
        this.htmStr += '<span class="blink">:</span>';
      }
      this.htmStr += '<span id="minStr"></span> <span id="ampmStr"></span>';
      this.htmStr += '</div>';
    }
    this.htmStr += '</div></div>';

    if(prop.tz == prop.src){
      this.isLocalTime = true;
      setTimeout(()=>{this.setTime()}, 200);
    } else{
      this.isLocalTime = false;
      setTimeout(()=>{this.loadTzTime()}, 200);
    }
    this.itemChangeTimer = new Timer(()=>{this.dateTimeFx()}, 60000);
    return this.htmStr;
  }

  convertAMPM(){
    if(this.settings.format == "12"){
      if(this.hours >= 12){
        if(this.hours > 12){
          this.hours = this.hours - 12;
        }
        this.hourStr = this.hours.toString();
        this.ampmStr = "PM";
      } else if(this.hours <= 11){
        this.hourStr = this.hours.toString();
        this.ampmStr = "AM";
      }
    } else{
      this.hourStr = this.hours.toString();
    }
  }

  dateTimeFx(){
    if(this.isLocalTime){
      this.curTime = new Date();
    }
    else{
      this.curTime = new Date(this.curTime.getTime() + 60000);
    }
    this.setTime();
    this.itemChangeTimer.clear();
    this.itemChangeTimer = null;
    this.itemChangeTimer = new Timer(()=>{this.dateTimeFx()}, 60000);
  }

  pad(){
    this.minStr = this.mins.toString();
    if(this.minStr.length < 2){
      this.minStr = "0" + this.minStr;
    }
  }

  setTime(){
    this.mins = this.curTime.getMinutes();
    this.hours = this.curTime.getHours();
    this.pad(this.mins);
    this.convertAMPM();

    if(this.settings.template == "t1" || this.settings.template == "t5"){
      if(this.settings.lang == "en_US"){
        this.dateStr = this.days[this.curTime.getDay()] +" "+ this.months[this.curTime.getMonth()] +". "+ this.curTime.getDate() +", "+ this.curTime.getFullYear();
      } else{
        this.dateStr = this.days[this.curTime.getDay()] +" "+ this.curTime.getDate() +", "+ this.months[this.curTime.getMonth()] +" "+ this.curTime.getFullYear();
      }
    }
    else if(this.settings.template == "t2" || this.settings.template == "t6"){
      if(this.settings.lang == "en_US"){
        this.dateStr = this.months[this.curTime.getMonth()] +" "+ this.curTime.getDate();
      } else{
        this.dateStr = this.curTime.getDate() +", "+ this.months[this.curTime.getMonth()];
      }
    }
    else if(this.settings.template == "t7"){
      if(this.settings.lang == "en_US"){
        this.dateStr = this.months[this.curTime.getMonth()] +" "+ this.curTime.getDate();
      }
      else{
        this.dateStr = this.curTime.getDate() +" "+ this.months[this.curTime.getMonth()];
      }
    }

    $("#dt-" + this.prop.id + " #hourStr").html(this.hourStr);
    $("#dt-" + this.prop.id + " #minStr").html(this.minStr);
    if(this.settings.format == "12"){
      $("#dt-" + this.prop.id + " #ampmStr").html(this.ampmStr);
    }
    if(this.settings.template == 't1' || this.settings.template == 't2' || this.settings.template == 't5' || this.settings.template == 't6' || this.settings.template == 't7'){
      $("#dt-" + this.prop.id + " #dateStr").html(this.dateStr);
    }
    this.fitToFrame();
  }

  loadTzTime(){
    $.get(apiPath +"/time?timezone="+ this.prop.src + "&" + new Date().getTime(), (data)=>{
      this.curTime = new Date(data.split("-")[0], Number(data.split("-")[1]) - 1, data.split("-")[2].split(" ")[0], data.split(":")[0].split(" ")[1], data.split(":")[1], data.split(":")[2], "00");
      this.setTime();
    });
  }

  fitToFrame(){
    this.scaleX = (this.prop.w - 20) / $("#dt-" + this.prop.id).width();
    this.scaleY = (this.prop.h - 20) / $("#dt-" + this.prop.id).height();

    if(this.scaleX < this.scaleY){
      $("#dt-" + this.prop.id).css("transform","scale(" + this.scaleX + "," + this.scaleX + ")");
    } else{
      $("#dt-" + this.prop.id).css("transform","scale(" + this.scaleY + "," + this.scaleY + ")");
    }

    this.scaledH = $("#dt-" + this.prop.id)[0].getBoundingClientRect().height;
    this.scaledW = $("#dt-" + this.prop.id)[0].getBoundingClientRect().width;
    this.xAlign = this.prop.a.split("-")[1];
    this.yAlign = this.prop.a.split("-")[0];

    if(this.xAlign == "l"){
      $("#dt-" + this.prop.id).css("margin-left", "0px");
    } else if(this.xAlign == "c"){
      $("#dt-" + this.prop.id).css("margin-left", Math.floor((this.prop.w - this.scaledW) / 2));
    } else if(this.xAlign == "r"){
      $("#dt-" + this.prop.id).css("margin-left", Math.floor(this.prop.w - this.scaledW));
    }

    if(this.yAlign == "t"){
      $("#dt-" + this.prop.id).css("margin-top", "0px");
    } else if(this.yAlign == "m"){
      $("#dt-" + this.prop.id).css("margin-top", Math.floor((this.prop.h - this.scaledH) / 2));
    } else if(this.yAlign == "b"){
      $("#dt-" + this.prop.id).css("margin-top", Math.floor(this.prop.h - this.scaledH));
    }
    $("#dt-" + this.prop.id).css("visibility", "visible");
  }

  removeFx(){
    this.itemChangeTimer.clear();
    this.itemChangeTimer = null;

    this.xAlign = this.yAlign = this.hourStr = this.ampmStr = this.dateStr = this.minStr = this.htmStr = null;
    this.scaledW = this.scaledH = this.scaleX = this.scaleY = this.hours = this.mins = this.curW = null;
    this.months = this.days = null;
    this.isLocalTime = null;
    this.settings = null;
    this.curTime = null;
    this.prop = null;

    this.xAlign = this.yAlign = this.hourStr = this.ampmStr = this.dateStr = this.minStr = this.htmStr = undefined;
    this.scaledW = this.scaledH = this.scaleX = this.scaleY = this.hours = this.mins = this.curW = undefined;
    this.itemChangeTimer = undefined;
    this.months = this.days = undefined;
    this.isLocalTime = undefined;
    this.settings = undefined;
    this.curTime = undefined;
    this.prop = undefined;
  }
}

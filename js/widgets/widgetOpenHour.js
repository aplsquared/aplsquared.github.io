class WidgetOpenHour {
  constructor(prop) {
    this.settings = JSON.parse(prop.settings);
    this.pickupStr = "";
    this.hoursStr = "";
    this.htmStr = "";
    this.prop = prop;
    this.days = [];

    if(this.prop.lang == "en_US" || this.prop.lang == ""){
			this.days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
			this.pickupStr = this.settings.pickupEn;
			this.hoursStr = this.settings.hoursEn;
		}
		else if(this.prop.lang == "fr_FR"){
			this.days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
      this.pickupStr = this.settings.pickupFr;
			this.hoursStr = this.settings.hoursFr;
		}
		else if(this.prop.lang == "es_ES"){
			this.days = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
      this.pickupStr = this.settings.pickupEs;
			this.hoursStr = this.settings.hoursEs;
		}

    this.htmStr =
      '<div id="openhour-' + this.prop.id + '" style="width:'+ this.prop.w +'px;height:'+ this.prop.h*0.85 +'px;background-color:'+ window.hexToRgbA(this.settings.bg, this.settings.bga) +'">'+
        '<div class="text-c" style="height:'+ this.prop.h*0.15 +'px;line-height:'+ this.prop.h*0.15 +'px"><svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 299.998 299.998" version="1.1" xmlns:xlink="https://www.w3.org/1999/xlink" x="0" y="0" xml:space="preserve" class="vAlign-b" style="opacity:0.2;height:'+ (this.prop.h*0.15 - this.prop.h*0.05) +'px;"><g><path d="M149.997,0C67.157,0,0.001,67.158,0.001,149.995s67.156,150.003,149.995,150.003s150-67.163,150-150.003 S232.836,0,149.997,0z M160.355,168.337c-0.008,0.394-0.067,0.788-0.122,1.183c-0.039,0.296-0.057,0.599-0.124,0.89 c-0.067,0.303-0.182,0.602-0.28,0.905c-0.117,0.366-0.226,0.731-0.379,1.076c-0.029,0.06-0.039,0.124-0.065,0.184 c-0.226,0.482-0.488,0.934-0.775,1.362c-0.018,0.026-0.042,0.052-0.06,0.078c-0.327,0.48-0.7,0.916-1.092,1.325 c-0.109,0.112-0.22,0.213-0.335,0.319c-0.345,0.329-0.708,0.63-1.094,0.905c-0.119,0.086-0.233,0.176-0.358,0.259 c-0.495,0.324-1.014,0.609-1.554,0.843c-0.117,0.052-0.239,0.083-0.358,0.13c-0.456,0.176-0.918,0.322-1.395,0.433 c-0.171,0.041-0.34,0.078-0.514,0.109c-0.612,0.112-1.232,0.189-1.86,0.189c-0.127,0-0.257-0.039-0.384-0.044 c-0.602-0.023-1.198-0.07-1.771-0.192c-0.179-0.039-0.355-0.117-0.534-0.166c-0.534-0.145-1.056-0.306-1.554-0.529 c-0.057-0.029-0.117-0.034-0.174-0.06l-57.515-27.129c-5.182-2.443-7.402-8.626-4.959-13.808 c2.443-5.179,8.626-7.402,13.808-4.959l42.716,20.144V62.249c0-5.729,4.645-10.374,10.374-10.374s10.374,4.645,10.374,10.374 V168.15h0.002C160.373,168.212,160.355,168.274,160.355,168.337z"/></g></svg></div>'+
        '<div style="padding:0 20px;">'+
          '<div style="height:'+ this.prop.h*0.55 +'px">'+
              '<div class="text-ellipsis" style="color:'+ this.settings.hourTxt +';font-family:'+ this.settings.hourFont.value +';font-size:'+ this.prop.h*0.036 +'px;">'+ this.hoursStr +'</div>'+
              '<div class="oh-hr"></div>'+
              '<div id="list" style="color:'+ this.settings.rowTxt +';font-family:'+ this.settings.rowFont.value +';font-size:'+ this.prop.h*0.03 +'px;"></div>'+
          '</div>'+
          '<div style="height:'+ this.prop.h*0.15 +'px">'+
            '<div class="text-ellipsis" style="color:'+ this.settings.pickuptTxt +';font-family:'+ this.settings.pickupFont.value +';font-size:'+ this.prop.h*0.036 +'px;">'+ this.pickupStr +'</div>'+
            '<div class="oh-hr"></div>'+
            '<div style="color:'+ this.settings.rowTxt +';font-family:'+ this.settings.rowFont.value +';font-size:'+ this.prop.h*0.03 +'px;">'+
                '<div id="pickDay" class="w50 pull-left"></div>'+
                '<div id="pickTime" class="w50 pull-left text-r"></div>'+
            '</div>'+
          '</div>'+
        '</div>'+
        '<div class="text-c" style="background-color:'+ window.hexToRgbA(this.settings.footerBg, this.settings.footerBga) +';height:'+ this.prop.h*0.15 +'px;line-height:'+ this.prop.h*0.15 +'px">';
        if(this.prop.img != ""){
          this.htmStr += '<img src="'+ resourcePath +'/media/'+ this.prop.img +'" class="img-responsive">';
        }
        this.htmStr += '</div>'+
      '</div>';
    setTimeout(()=>{this.loadOpenHour()}, 200);
    return this.htmStr;
  }

  loadOpenHour(){
    this.htmStr = "";
    $.get(storageHost + bucket + "openHours/"+ this.prop.id.split("-")[2] +"/"+ mac +".json?"+ new Date().getTime(), (data)=>{
      this.ohData = data;
      if(this.ohData.open){
        for(var i=0; i<this.ohData.open.length; i++){
          this.htmStr += '<div class="pad5 d-flex">'+
            '<div class="w50">'+ this.days[Number(this.ohData.open[i].day)] +'</div>'+
            '<div class="w50 text-r">'+ this.ohData.open[i].time +'</div>'+
          '</div>';
        };
        $("#openhour-" + this.prop.id + " #list").html(this.htmStr);

        if(this.ohData.pickup.day.split("-")[0] && this.ohData.pickup.day.split("-")[1]){
          $("#openhour-" + this.prop.id + " #pickDay").html(this.days[this.ohData.pickup.day.split("-")[0]] + " - " + this.days[this.ohData.pickup.day.split("-")[1]]);
        } else if(this.ohData.pickup.day.split("-")[0]){
          $("#openhour-" + this.prop.id + " #pickDay").html(this.days[this.ohData.pickup.day.split("-")[0]]);
        } else if(this.ohData.pickup.day.split("-")[1]){
          $("#openhour-" + this.prop.id + " #pickDay").html(this.days[this.ohData.pickup.day.split("-")[1]]);
        }
        $("#openhour-" + this.prop.id + " #pickTime").html(this.ohData.pickup.time);
      }
    });
  }

  removeFx(){
    this.pickupStr = this.hoursStr = this.htmStr = this.htmStr = null;
    this.settings = null;
    this.ohData = null;
    this.prop = null;
    this.days = null;

    this.pickupStr = this.hoursStr = this.htmStr = this.htmStr = undefined;
    this.settings = undefined;
    this.ohData = undefined;
    this.prop = undefined;
    this.days = undefined;
  }
};

let getIdBWeather = "hello";
class WidgetWeather{
  constructor(prop){
    this.settings = JSON.parse(prop.settings);
    this.refreshTimer;
    this.prop = prop;
    this.weather;

    if(this.prop.forecast == "1"){
      if(this.settings.lang == "en_US"){
        this.days = ["Today", "Tomorrow"];
      } else if(this.settings.lang == "fr_FR"){
        this.days = ["aujourd'hui", "demain"];
      } else if(this.settings.lang == "es_ES"){
        this.days = ["hoy dia", "mañana"];
      } else if(this.settings.lang == "pt_PT"){
        this.days = ["Hoje", "Amanhã"];
      }
    }

    this.htmStr = '<div id="weather-' + this.prop.id + '" class="weather" style="width:'+ this.prop.w +'px;height:'+ this.prop.h +'px;"></div>';
    setTimeout(()=>{this.init()}, 200);
    return this.htmStr;
  }

  init(){
    this.loadFeed();
    this.refreshTimer = setInterval(()=>{this.loadFeed();}, 900000);
    //window.addTimer(this.refreshTimer, "i", this.prop.fid);
  }

  loadFeed(){
    $.get(apiPath +"/azureweather/"+ this.prop.woeid +"/json?lang="+ this.settings.lang + "&unit=" + this.settings.unit + "&forecast=" + this.prop.forecast + "&wsu=" + this.settings.wsu + "&" + new Date().getTime(), (data)=>{
      this.weather = data;

      writeWeather(this.prop.woeid, this.weather);

      console.warn( "first success" );
      this.loadHtml();
    })
    .fail(()=>{
      readIDBWeather(this.prop.woeid);
      setTimeout(() => {
        console.error( "error ", getIdBWeather);
        this.weather = getIdBWeather;
        console.warn(this.weather);
        this.loadHtml();
        
      }, 1000);
    })
    .always(()=>{
      console.log( "finished" );
    });
  }

  loadHtml(){
    this.forecast = this.weather.forecast;
    this.htmStr = "";

    if(this.prop.forecast == "1"){
      if(this.settings.orientation == "h"){
        this.htmStr += '<table width="100%" cellpadding="0" cellspacing="5" border="0" style="color:'+ this.settings.tint +';font-family:'+ this.settings.font.value +'"><tr>';
        for(var i=0; i<this.forecast.length; i++){
          this.imgPath = "img/weather/"+ this.forecast[i].icon + ".svg";
          this.htmStr += '<td><div class="forecast" style="border:3px solid ' + this.settings.tint + '">';
          if(i < 2){
            this.htmStr += '<div class="wfH">'+ this.days[i] +'</div>';
          } else{
            this.htmStr += '<div class="wfH">'+ this.forecast[i].dt.split(",")[0] +'</div>';
          }
          this.htmStr += '<div class="pad5">' +
            '<div style="margin:0 auto;width:72px;height:72px;background-color:' + this.settings.tint + ';-webkit-mask: url(' + this.imgPath + ') no-repeat center;mask: url(' + this.imgPath + ') no-repeat center;-webkit-mask-size:72px 72px;mask-size:72px 72px;"></div>'+
            '</div><div class="pad5 text-bold">'+ Math.round(this.forecast[i].temp_max) + '&deg;' + this.settings.unit.toUpperCase() + ' / ' + Math.round(this.forecast[i].temp_min) +'&deg;' + this.settings.unit.toUpperCase() + '</div></div></td>';
          if(i == 4){
            break;
          }
        }
        this.htmStr += '</tr></table>';
      } else{
        this.htmStr += '<div style="color:' + this.settings.tint + ';font-family:'+ this.settings.font.value +'">';
        for(var i=0; i<this.forecast.length; i++){
          this.imgPath = "img/weather/"+ this.forecast[i].icon + ".svg";
          this.htmStr += '<div class="forecast" style="margin-bottom:5px;border:3px solid ' + this.settings.tint + '">';
          if(i < 2){
            this.htmStr += '<div class="wfH">'+ this.days[i] +'</div>';
          } else{
            this.htmStr += '<div class="wfH">'+ this.forecast[i].dt.split(",")[0] +'</div>';
          }
          this.htmStr += '<div class="pad5">' +
            '<div style="margin:0 auto;width:72px;height:72px;background-color:' + this.settings.tint + ';-webkit-mask: url(' + this.imgPath + ') no-repeat center;mask: url(' + this.imgPath + ') no-repeat center;-webkit-mask-size:72px 72px;mask-size:72px 72px;"></div>'+
            '</div><div class="pad5 text-bold">'+ Math.round(this.forecast[i].temp_max) + '&deg;' + this.settings.unit.toUpperCase() + ' / ' + Math.round(this.forecast[i].temp_min) +'&deg;' + this.settings.unit.toUpperCase() + '</div></div>';
          if(i == 4){
            break;
          }
        }
        this.htmStr += '</div>';
      }
    } else if(this.prop.forecast == "2"){
      this.wsu = "m/s";
      if(this.settings.wsu == "mh"){
        this.wsu = "m/h";
      } else if(this.settings.wsu == "kh"){
        this.wsu = "km/h";
      }
      if(this.settings.orientation == "h"){
        this.imgPath = "img/weather/"+ this.weather.current.icon +".svg";
        this.htmStr = '<table cellpadding="0" cellspacing="0" border="0" style="color:#fff;width:885px;font-family:' + this.settings.font.value + '">';
        this.htmStr += '<tr><td width="350" valign="top"><div style="background:' + this.settings.tint + ';border-radius:6px;"><div style="padding:10px">'+
          '<div style="height:200px;"><div style="float:right;margin:20px 20px 0 0;"><div style="margin:0 auto;width:72px;height:72px;background-color:#fff;-webkit-mask: url('+ this.imgPath + ') no-repeat center;mask:url(' + this.imgPath + ') no-repeat center;-webkit-mask-size:72px 72px;mask-size:72px 72px;"></div></div>'+
          '<div><div style="font-size:48px;">'+ this.weather.current.temp +'&deg;'+ this.settings.unit.toUpperCase() +'</div><div style="font-size:20px;">'+ this.weather.current.desc +'</div><div style="font-size:16px;">' + this.weather.current.temp_max + '&deg;' + this.settings.unit.toUpperCase() + ' / ' + this.weather.current.temp_min + '&deg;' + this.settings.unit.toUpperCase() + '</div></div></div>'+
          '<div style="padding:10px;background-color:rgba(0, 0, 0, 0.1);font-size:16px;height:22px;line-height:22px;">'+ this.weather.current.city +', '+ this.weather.current.country +'</div></div><div style="background:#fff;border-radius:0 0 6px 6px;font-weight:bold;font-size:28px;color:'+ this.settings.tint +';text-align:center;" class="d-flex align-items-center"><div class="pad8" style="border-right:1px solid #ccc"><svg style="fill:'+ this.settings.tint +'" class="marR10 w20 vAlign-b" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35.35 38.29"><path d="M919,518.9s-9.67,11.41-9.67,19.43a9.67,9.67,0,0,0,19.34,0C928.67,530.31,919,518.9,919,518.9Z" transform="translate(-909.33 -518.9)"/><path d="M937.2,534.69s-7.47,8.82-7.47,15a7.48,7.48,0,1,0,14.95,0C944.68,543.51,937.2,534.69,937.2,534.69Z" transform="translate(-909.33 -518.9)"/></svg> '+ this.weather.current.humidity +'%</div><div class="pad8"><svg style="fill:'+ this.settings.tint +'" class="marR10 w20 vAlign-b" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" xml:space="preserve"><g><path d="M426.667,106.667c-47.128,0-85.333,38.205-85.333,85.333H384c0-23.564,19.103-42.667,42.667-42.667 s42.667,19.102,42.667,42.667s-19.103,42.667-42.667,42.667H128v42.667h298.667C473.795,277.333,512,239.128,512,192 S473.795,106.667,426.667,106.667z"/></g><g><path d="M339.778,320H85.333v42.667h254.445c23.564,0,42.667,19.103,42.667,42.667v1.555c0,22.705-18.406,41.112-41.112,41.112 v42.667c46.27,0,83.778-37.509,83.778-83.778v-1.555C425.112,358.205,386.907,320,339.778,320z"/></g><g><rect y="234.667" width="85.333" height="42.667"/></g><g><path d="M213.077,21.333c-46.411,0-84.035,37.624-84.035,84.035v5.392h42.667v-5.392C171.709,82.521,190.23,64,213.077,64 s41.368,18.521,41.368,41.368v1.299c0,23.564-19.103,42.667-42.667,42.667H42.667V192h169.112 c47.128,0,85.333-38.205,85.333-85.333v-1.299C297.112,58.957,259.488,21.333,213.077,21.333z"/></g></svg>' + this.weather.current.wind +' '+ this.wsu +'</div></div></div></td>' +
          '<td width="530" valign="top">'+
        '<div>';
        for(var i=0; i<this.forecast.length; i++){
          this.imgPath = "img/weather/"+ this.forecast[i].icon +".svg";
          this.htmStr += '<div class="forecast2" style="border:3px solid ' + this.settings.tint + '">' +
            '<div class="pad5" style="min-height:111px;max-height:111px;">'+
              '<div><div style="float:right;margin:5px 5px 0 0;"><div style="margin:0 auto;width:72px;height:72px;background-color:' + this.settings.tint + ';-webkit-mask: url('+ this.imgPath + ') no-repeat center;mask:url(' + this.imgPath + ') no-repeat center;-webkit-mask-size:72px 72px;mask-size:72px 72px;"></div></div>'+
              '<div style="font-size:18px;color:' + this.settings.tint + '"><div style="margin-bottom:5px;font-weight:bold;">' + Math.round(this.forecast[i].temp_max) +'&deg;'+ this.settings.unit.toUpperCase() + ' / ' + Math.round(this.forecast[i].temp_min) + '&deg;' + this.settings.unit.toUpperCase() + '</div><div>' + this.forecast[i].desc + '</div></div></div>'+
            '</div>'+
            '<div class="wfF" style="color:'+ this.settings.tint +';white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+ this.forecast[i].dt +'</div>'+
          '</div>';
          if(i == 1){
            this.htmStr += '</div><div style="clear:left"></div><div>';
          }
          if(i == 3){
            break;
          }
        }
        this.htmStr += '</div></td></tr></table>';
      } else{
        this.imgPath = "img/weather/"+ this.weather.current.icon +".svg";
        this.htmStr = '<div style="color:#fff;width:350px;font-family:' + this.settings.font.value + '">';
        this.htmStr += '<div><div style="background:' + this.settings.tint + ';border-radius:6px;margin-bottom:5px;"><div style="padding:10px">'+
          '<div style="height:205px;"><div style="float:right;margin:20px 20px 0 0;"><div style="margin:0 auto;width:72px;height:72px;background-color:#fff;-webkit-mask: url('+ this.imgPath + ') no-repeat center;mask:url(' + this.imgPath + ') no-repeat center;-webkit-mask-size:72px 72px;mask-size:72px 72px;"></div></div>'+
          '<div><div style="font-size:48px;">' + this.weather.current.temp + '&deg;' + this.settings.unit.toUpperCase() + '</div><div style="font-size:20px;">' + this.weather.current.desc + '</div><div style="font-size:16px;">' + this.weather.current.temp_max + '&deg;' + this.settings.unit.toUpperCase() + ' / ' + this.weather.current.temp_min + '&deg;' + this.settings.unit.toUpperCase() + '</div></div></div>'+
          '<div style="padding:10px;background-color:rgba(0, 0, 0, 0.1)">' + this.weather.current.city + ', ' + this.weather.current.country + '</div></div><div style="background:#fff;border-radius:0 0 6px 6px;font-weight:bold;text-align:center;height:60px;line-height:60px;font-size:28px;color:' + this.settings.tint + ';"><div style="float:left;width:50%;border-right:1px solid #ccc;"><svg style="fill:' + this.settings.tint + ';vertical-align:middle;height:40px;margin-right:10px;" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35.35 38.29"><path d="M919,518.9s-9.67,11.41-9.67,19.43a9.67,9.67,0,0,0,19.34,0C928.67,530.31,919,518.9,919,518.9Z" transform="translate(-909.33 -518.9)"/><path d="M937.2,534.69s-7.47,8.82-7.47,15a7.48,7.48,0,1,0,14.95,0C944.68,543.51,937.2,534.69,937.2,534.69Z" transform="translate(-909.33 -518.9)"/></svg>' + this.weather.current.humidity + '%</div><div style="white-space:nowrap;overflow:hidden;"><svg style="fill:'+ this.settings.tint +';vertical-align:middle;height:40px;margin-right:10px;" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" xml:space="preserve"><g><path d="M426.667,106.667c-47.128,0-85.333,38.205-85.333,85.333H384c0-23.564,19.103-42.667,42.667-42.667 s42.667,19.102,42.667,42.667s-19.103,42.667-42.667,42.667H128v42.667h298.667C473.795,277.333,512,239.128,512,192 S473.795,106.667,426.667,106.667z"/></g><g><path d="M339.778,320H85.333v42.667h254.445c23.564,0,42.667,19.103,42.667,42.667v1.555c0,22.705-18.406,41.112-41.112,41.112 v42.667c46.27,0,83.778-37.509,83.778-83.778v-1.555C425.112,358.205,386.907,320,339.778,320z"/></g><g><rect y="234.667" width="85.333" height="42.667"/></g><g><path d="M213.077,21.333c-46.411,0-84.035,37.624-84.035,84.035v5.392h42.667v-5.392C171.709,82.521,190.23,64,213.077,64 s41.368,18.521,41.368,41.368v1.299c0,23.564-19.103,42.667-42.667,42.667H42.667V192h169.112 c47.128,0,85.333-38.205,85.333-85.333v-1.299C297.112,58.957,259.488,21.333,213.077,21.333z"/></g></svg>' + this.weather.current.wind + ' ' + this.wsu + '</div></div></div></div>' +
        '<div>';
        for(var i=0; i<this.forecast.length; i++){
          this.imgPath = "img/weather/"+ this.forecast[i].icon + ".svg";
          this.htmStr += '<div class="forecast3" style="border:3px solid ' + this.settings.tint + '">'+
            '<div class="pad5" style="min-height:111px;max-height:111px;">'+
              '<div>'+
                '<div style="float:right;margin:5px 5px 0 0;"><div style="margin:0 auto;width:72px;height:72px;background-color:' + this.settings.tint + ';-webkit-mask: url(' + this.imgPath + ') no-repeat center;mask: url(' + this.imgPath + ') no-repeat center;-webkit-mask-size:72px 72px;mask-size:72px 72px;"></div></div>'+
                '<div style="font-size:18px;color:' + this.settings.tint + '"><div style="margin:5px 0 10px 0;font-weight:bold;">' + Math.round(this.forecast[i].temp_max) + '&deg;' + this.settings.unit.toUpperCase() + ' / ' + Math.round(this.forecast[i].temp_min) + '&deg;' + this.settings.unit.toUpperCase() + '</div><div>' + this.forecast[i].desc + '</div></div>'+
              '</div>'+
            '</div>'+
            '<div class="wfF" style="color:' + this.settings.tint + '">' + this.forecast[i].dt + '</div>'+
          '</div>';
          if(i == 3){
            break;
          }
        }
        this.htmStr += '</div>';
        this.htmStr += '</div>'
      }
    } else{
      if(this.settings.template == "t1"){
        this.imgPath = "img/weather/"+ this.weather.current.icon + ".svg";
        this.htmStr += '<table width="'+ this.prop.w + '">'+
          '<tbody>'+
            '<tr>'+
              '<td>'+
                '<div style="float:right;margin-right:10px;width:100px;height:100px;background-color:' + this.settings.tint + ';-webkit-mask: url(' + this.imgPath + ') no-repeat center;mask: url(' + this.imgPath + ') no-repeat center;-webkit-mask-size:100px 100px;mask-size:100px 100px;"></div>'+
              '</td>'+
              '<td class="text-left" style="color:'+ this.settings.tint +';font-family:'+ this.settings.font.value +';margin-left:10px">'+
                '<div style="font-size:50px;font-weight:bold;">'+ Math.trunc(this.weather.current.temp) +'&deg;'+ this.settings.unit.toUpperCase() +'</div>'+
                '<div style="font-size:22px;margin:5px 0;text-transform:capitalize;white-space:nowrap;">'+ this.weather.current.desc +'</div>'+
                '<div style="font-size:18px;white-space:nowrap;">'+ this.weather.current.city + ", " + this.weather.current.country +'</div>'+
              '</td>'+
            '</tr>'+
          '</tbody>'+
        '</table>';
      } else if(this.settings.template == "t2"){
        //https://s3-us-west-2.amazonaws.com/lsquared-hub/cl/widgets/client/openweather/static/swf/01n.swf
        this.imgPath = "img/weather/"+ this.weather.current.icon + ".svg";
        this.htmStr += '<table>'+
          '<tbody style="color:'+ this.settings.tint +';font-family:'+ this.settings.font.value +';">'+
            '<tr>'+
              '<td class="text-c">';
              this.htmStr += '<div style="width:62px;height:62px;background-color:' + this.settings.tint + ';-webkit-mask: url(' + this.imgPath + ') no-repeat center;mask: url(' + this.imgPath + ') no-repeat center;-webkit-mask-size:62px 62px;mask-size:62px 62px;"></div>';
              // if(this.settings.imgSubType == "plain"){
              //   this.htmStr += '<div style="width:62px;height:62px;background-color:' + this.settings.tint + ';-webkit-mask: url(' + this.imgPath + ') no-repeat center;mask: url(' + this.imgPath + ') no-repeat center;-webkit-mask-size:62px 62px;mask-size:62px 62px;"></div>';
              // }
              // else{
              //   this.htmStr += '<img style="width:72px;height:72px;" src="'+ this.imgPath +'">';
              // }
              this.htmStr += '</td>'+
              '<td class="text-left" style="margin-left:10px">'+
                '<div style="font-size:50px;font-weight:bold;">'+ Math.trunc(this.weather.current.temp) +'&deg;'+ this.settings.unit +'</div>'+
              '</td>'+
            '</tr>'+
            '<tr class="text-c" style="font-size:22px;margin:5px 0;font-weight:bold;vertical-align:top;height:35%;">'+
            '<td colspan="2">H: '+ Math.trunc(this.weather.current.temp_max) +'&deg;'+ this.settings.unit +'<span class="marLR20">|</span> L: '+ Math.trunc(this.weather.current.temp_min) +'&deg;'+ this.settings.unit +'</td>'+
            '</tr>'+
          '</tbody>'+
        '</table>';
      } else if(this.settings.template == "t3"){
        this.imgPath = "img/weather/"+ this.weather.current.icon + ".svg";
        this.htmStr += '<table>'+
          '<tbody style="color:'+ this.settings.tint +';font-family:'+ this.settings.font.value +';">'+
            '<tr>'+
              '<td class="text-c">'+
                '<div style="float:right;margin-right:10px;width:72px;height:72px;background-color:' + this.settings.tint + ';-webkit-mask: url(' + this.imgPath + ') no-repeat center;mask: url(' + this.imgPath + ') no-repeat center;-webkit-mask-size:72px 72px;mask-size:72px 72px;"></div>'+
              '</td>'+
              '<td class="text-left" style="margin-left:10px">'+
                '<div style="font-size:50px;font-weight:bold;">'+ Math.trunc(this.weather.current.temp) +'&deg;'+ this.settings.unit +'</div>'+
              '</td>'+
            '</tr>'+
            '<tr class="text-c" style="font-size:22px;font-weight:bold;vertical-align:top;height:35%;">'+
            '<td colspan="2"><svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 448 512" style="fill:'+ this.settings.tint +';height:18px"><path d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"/></svg> '+ Math.trunc(this.weather.current.temp_max) +'&deg;'+ this.settings.unit +' | <svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 448 512" style="fill:'+ this.settings.tint +';height:18px"><path d="M413.1 222.5l22.2 22.2c9.4 9.4 9.4 24.6 0 33.9L241 473c-9.4 9.4-24.6 9.4-33.9 0L12.7 278.6c-9.4-9.4-9.4-24.6 0-33.9l22.2-22.2c9.5-9.5 25-9.3 34.3.4L184 343.4V56c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24v287.4l114.8-120.5c9.3-9.8 24.8-10 34.3-.4z"/></svg> '+ Math.trunc(this.weather.current.temp_min) +'&deg;'+ this.settings.unit +'</div></td>'+
            '</tr>'+
          '</tbody>'+
        '</table>';
      }
    }

    $("#weather-" + this.prop.id).empty();
    $("#weather-" + this.prop.id).append('<div id="container" style="transform-origin:0 0;float:left;visibility:hidden;"></div>');//
    $("#weather-" + this.prop.id + " #container").html(this.htmStr);
    this.fitToFrame();
  }

  fitToFrame(){
    this.scaleX = (this.prop.w) / $("#weather-" + this.prop.id + " #container").width();
    this.scaleY = (this.prop.h) / $("#weather-" + this.prop.id + " #container").height();

    if(this.scaleX < this.scaleY){
      $("#weather-" + this.prop.id + " #container").css("transform", "scale(" + this.scaleX + "," + this.scaleX + ")");
    } else{
      $("#weather-" + this.prop.id + " #container").css("transform", "scale(" + this.scaleY + "," + this.scaleY + ")");
    }

    this.scaledH = $("#weather-" + this.prop.id + " #container")[0].getBoundingClientRect().height;
    this.scaledW = $("#weather-" + this.prop.id + " #container")[0].getBoundingClientRect().width;
    this.xAlign = this.prop.a.split("-")[1];
    this.yAlign = this.prop.a.split("-")[0];

    if(this.xAlign == "l"){
      $("#weather-" + this.prop.id + " #container").css("margin-left", "0px");
    } else if(this.xAlign == "c"){
      $("#weather-" + this.prop.id + " #container").css("margin-left", Math.floor((this.prop.w - this.scaledW) / 2));
    } else if(this.xAlign == "r"){
      $("#weather-" + this.prop.id + " #container").css("margin-left", Math.floor(this.prop.w - this.scaledW));
    }

    if(this.yAlign == "t"){
      $("#weather-" + this.prop.id + " #container").css("margin-top", "0px");
    } else if(this.yAlign == "m"){
      $("#weather-" + this.prop.id + " #container").css("margin-top", Math.floor((this.prop.h - this.scaledH) / 2));
    } else if(this.yAlign == "b"){
      $("#weather-" + this.prop.id + " #container").css("margin-top", Math.floor(this.prop.h - this.scaledH));
    }
    $("#weather-" + this.prop.id + " #container").css("visibility", "visible");
  }

  getSvgFC(name, className, color, url, bg){
    var svgUrl = "./img/";
    if(url){
      svgUrl = url;
    }
    // console.error(svgUrl+name+".svg", className, color);

    return $.get(svgUrl+name+".svg", function(svg){
      $("."+className).html(svg);
      $("."+className+" svg").css({"height":"30px", "fill":color, "vertical-align":"middle"});
      // <object type="image/svg+xml" data="../src/img/flight.svg" class="icon"></object>
    });
  }

  removeFx(){
    clearInterval(this.refreshTimer);

    this.htmStr = this.wsu = this.imgPath = this.xAlign = this.yAlign = null;
    this.scaleX = this.scaleY = this.scaledH = this.scaledW = null;
    this.prop = this.weather = this.forecast = null;
    this.refreshTimer = null;
    this.settings = null;
    this.days = null;

    this.htmStr = this.wsu = this.imgPath = this.xAlign = this.yAlign = undefined;
    this.scaleX = this.scaleY = this.scaledH = this.scaledW = undefined;
    this.prop = this.weather = this.forecast = undefined;
    this.refreshTimer = undefined;
    this.settings = undefined;
    this.days = undefined;
  }
}

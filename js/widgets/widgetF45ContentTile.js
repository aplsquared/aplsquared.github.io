class WidgetF45ContentTile {
  constructor(prop){
    this.settings = parseJSON(prop.settings);
    this.curW = prop.w;
    this.prop = prop;
    this.htmStr = "";

    if(this.settings.tileType == "2"){
      this.curW = ((this.prop.w/2)-15);
    }

    this.htmStr = '<div id="'+ this.prop.type +'-'+ this.prop.id +'" style="width:'+ this.prop.w +'px;height:'+ this.prop.h +'px;overflow:hidden;">'+
      '<style type="text/css">'+
        '#'+ this.prop.type +'-'+ this.prop.id +' .tile-container{display:flex;flex-flow:row wrap;place-content:start;align-items:stretch}'+
        '#'+ this.prop.type +'-'+ this.prop.id +' .tile-column{display:flex;flex-flow:column nowrap;justify-content:flex-end;margin-bottom:30px;width:'+this.curW+'px;background:'+window.hexToRgbA(this.settings.bg, this.settings.bga)+'}'+
        '#'+ this.prop.type +'-'+ this.prop.id +' .col-12{float:left;width:'+this.prop.w+'px;background:'+window.hexToRgbA(this.settings.bg, this.settings.bga)+'}'+
        '#'+ this.prop.type +'-'+ this.prop.id +' .tileLabel{background:'+this.settings.lBg+';color:'+this.settings.text+';font-family:'+this.settings.font.value+';font-size:'+this.settings.size+'px}';
        if(this.settings.tileType == "2"){
          this.htmStr += '#'+ this.prop.type +'-'+ this.prop.id +' .tile-column:nth-child(odd){margin-right:10px}';
        }
        if(this.settings.lPosition == "t"){
          this.htmStr += '#'+ this.prop.type +'-'+ this.prop.id +' .tile-column{flex-flow:column-reverse nowrap}';
        }
        if(this.settings.lPosition == "l"){
          this.htmStr += '#'+ this.prop.type +'-'+ this.prop.id +' .tile-column{flex-flow:row-reverse nowrap}';
        }
        if(this.settings.lPosition == "r"){
          this.htmStr += '#'+ this.prop.type +'-'+ this.prop.id +' .tile-column{flex-flow:row nowrap}';
        }
      this.htmStr +='</style>';

      this.htmStr += '<div class="tile-container">';
      for(var i=0; i<this.prop.content.length; i++){
        console.log(this.prop.content[i].type);
        var dataObj;
        if(this.prop.content[i].type == "image" || this.prop.content[i].type == "vector" || this.prop.content[i].type == "powerpoint" || this.prop.content[i].type == "word"){
          dataObj = '<img src="'+ resourcePath +'/media/'+ this.prop.content[i].fileName +'" class="img-responsive">';
        }
        else if(this.prop.content[i].type == "video"){
          dataObj = '<video autoplay loop src="'+ resourcePath +'/tp/'+ this.prop.content[i].fileName +'" class="img-responsive"></video>';
        }
        this.htmStr += '<div class="tile-column">';
          if(this.settings.p == "l" || this.settings.p == "r"){
            this.htmStr += '<div class="text-center" style="width:'+ (this.curW - this.settings.w) +'px">'+ dataObj +'</div>';
            this.htmStr += '<div style="width:'+ this.settings.w +'px;height:100%" class="tileLabel"><div style="padding:5px 10px">'+ this.prop.content[i].label +'</div></div>';
          }
          else if(this.settings.p == "t" || this.settings.p == "b"){
            this.htmStr += '<div class="text-center">'+ dataObj +'</div>';
            this.htmStr += '<div class="tileLabel text-center"><div style="padding:5px 10px">'+ this.prop.content[i].label +'</div></div>';
          }
        this.htmStr +='</div>';
      }
      this.htmStr += '</div>'+
    '</div>';
    return this.htmStr;
  }

  removeFx(){
    this.settings = null;
    this.htmStr = null;
    this.curW = null;
    this.prop = null;

    this.settings = undefined;
    this.htmStr = undefined;
    this.curW = undefined;
    this.prop = undefined;
  }
}

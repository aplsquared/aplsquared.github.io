class WidgetSurvey{
  constructor(prop){
    this.settings = testJSON(prop.settings);
    this.prop = prop;

    this.htmStr = '<div id="'+ this.prop.type +'-'+ this.prop.id +'" style="width:'+ this.prop.w +'px;height:'+ this.prop.h +'px;">'+
      '<div class="text-center">'+
        '<img src="'+ tim + bucket + this.prop.src +'&w='+ this.prop.w +'&h='+ this.prop.h +'&zc=3' +'">'+
      '</div>'+
    '</div>';
    return this.htmStr;
  }
}
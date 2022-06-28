class WidgetF45Blank{
  constructor(prop){
    this.htmStr = '<div id="'+ prop.type + '-' + prop.id +'">';
    return this.htmStr;
  }

  removeFx(){
    this.htmStr = null;
    this.htmStr = undefined;
  }
}

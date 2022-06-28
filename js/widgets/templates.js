class Templates {
  constructor(prop) {
    this.templateItemArr = [];
    this.isLocalFeed = false;
    this.templateFeed = {};
    this.localFeedObj = [];
    this.localFeedUrl = "";
    this.frameArr = [];
    this.tempStr = "";
    this.prop = prop;
    this.localFeed;

    this.htmStr = '<div id="' + this.prop.type + '-' + this.prop.id + '" class="template" style="width:' + this.prop.w + 'px;height:' + this.prop.h + 'px;"></div>';
    setTimeout(()=>{this.init()}, 200);
    return this.htmStr;
  }

  init(){
    this.loadTemplateFeed();
  }

  loadTemplateFeed(){
    $.get(apiPath + "/template/" + this.prop.id.split("-")[2] +"/"+ mac +"?format=json&"+ new Date().getTime(), (data)=> {
      if(this.tempStr != JSON.stringify(data)){
        fs.writeFile(resourcePath + "/local/template-" + this.prop.id + ".json", JSON.stringify(data), (err) => { if(err)throw err; });
        this.localFeedUrl = data.info[0].feed;
        this.tempStr = JSON.stringify(data);
        this.templateFeed = data;

        if(this.localFeedUrl != "" && data.info[0].rlf == 1){
          this.isLocalFeed = true;
          this.loadLocalFeed();
        }
        else{
          this.isLocalFeed = false;
          this.drawTemplate();
        }
      }
    })
    .fail(()=>{
      if(this.tempStr == ""){
        $.get(resourcePath + "/local/template-" + this.prop.id + ".json", (data)=> {
          if(this.tempStr != data){
            this.localFeedUrl = data.info[0].feed;
            this.templateFeed = JSON.parse(data);
            this.tempStr = data;

            if(this.localFeedUrl != "" && data.info[0].rlf == 1){
              this.isLocalFeed = true;
              this.loadLocalFeed();
            }
            else{
              this.isLocalFeed = false;
              this.drawTemplate();
            }
          }
        })
        .fail(function(){});
      }
    });
  }

  loadLocalFeed(){
    this.localFeedObj = [];
    $.ajax({
      url: this.localFeedUrl,
      dataType: "xml",
      async: false,
      success: (data)=>{
        this.localFeed = $(data).find("products items item");
        for(var i=0; i<this.localFeed.length; i++){
          this.tempNode = $(this.localFeed[i]);
          this.localFeedObj.push({id:this.tempNode.find("pos_number").text(), val:this.tempNode.find("amount").text()});
        }
        this.drawTemplate();
      },
      error: function(request, status, err){
        this.drawTemplate();
      }
    });
  }

  drawTemplate(){
    $("#" + this.prop.type + '-' + this.prop.id).empty();

    if(this.templateItemArr.length > 0){
      for(var i=0; i<this.templateItemArr.length; i++){
        this.templateItemArr[i].unloadContent();
        this.templateItemArr[i] = null;
        this.templateItemArr[i] = undefined;
      }
    }

    if(this.frameArr.length > 0){
      for(var i=0; i<this.frameArr.length; i++){
        this.frameArr[i].unloadContent();
        this.frameArr[i] = null;
        this.frameArr[i] = undefined;
      }
    }

    this.templateItemArr = [];
    this.frameArr = [];

    $.each(this.templateFeed.frames, (index, item)=>{
      if(item.type == "content" || item.type == "dContent"){
        var frame = new Frame({id:item.id + "-" + index, a:item.align, w:item.w, h:item.h, x:item.x, y:item.y, z:item.z, bg:item.bg, bga:item.bga, transition:feed.device[0].transition, tz:feed.device[0].timeZone, items:item.item});
        fTimerArr.push({id:item.id + "-" + index, timers:[]});
        this.frameArr.push(frame);
        $("#" + this.prop.type + "-" + this.prop.id).append(frame.htmStr);
      }
      else{
        if(this.isLocalFeed && this.localFeedObj.length > 0){
          for(var j=0; j<this.localFeedObj.length; j++){
            if(("{{" + this.localFeedObj[j].id + "}}") == item.item[0].text){
              item.item[0].text = this.localFeedObj[j].val;
              break;
            }
          }
        }
        var templateItem = new TemplateItem({id:item.id, a:item.align, type:item.type, w:item.w, h:item.h, x:item.x, y:item.y, z:item.z, bg:item.bg, bga:item.bga, items:item.item, show:item.showafter, hide:item.hideafter});
        $("#" + this.prop.type + "-" + this.prop.id).append(templateItem.htmStr);
        this.templateItemArr.push(templateItem);
      }
    });
  }

  removeFx(){
    if(this.templateItemArr.length > 0){
      for(var i=0; i<this.templateItemArr.length; i++){
        this.templateItemArr[i].removeFx();
        this.templateItemArr[i] = null;
        this.templateItemArr[i] = undefined;
      }
    }

    if(this.frameArr.length > 0){
      for(var i=0; i<this.frameArr.length; i++){
        this.frameArr[i].unloadContent();
        this.frameArr[i] = null;
        this.frameArr[i] = undefined;
      }
    }

    this.localFeedObj = this.templateItemArr = this.frameArr = null;
    this.htmStr = this.localFeedUrl = this.tempStr = null;
    this.prop = this.templateFeed = null;
    this.isLocalFeed = null;
    this.localFeed = null;
    this.tempNode = null;

    this.localFeedObj = this.templateItemArr = this.frameArr = undefined;
    this.htmStr = this.localFeedUrl = this.tempStr = undefined;
    this.prop = this.templateFeed = undefined;
    this.isLocalFeed = undefined;
    this.localFeed = undefined;
    this.tempNode = undefined;
  }
}

class CoD {
  constructor(){
    this.isFsChrome = false;
    this.listLeftMargin = 0;
    this.tabLeftMargin = 0;
    this.listTopMargin = 0;
    this.codFocus = "list";
    this.selectedItem = 0;
    this.selectedCat = 0;
    this.selectedTab = 0;
    this.thumbSrc = "";
    this.seekHideTimer;
    this.hoverItem = 0;
    this.hoverTab = 0;
    this.htmStr = "";
    this.idleTimer;
    this.codVidObj;
    this.settings;
    this.category;
    this.content;
    this.webpage;
    this.webUrl;
    this.frame;
  }

  resetIdleTimer(){
    if(this.idleTimer){
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
    if(appMenuIdleTime > 0){
      this.idleTimer = setTimeout(function(){cod.goBackToDS();}, appMenuIdleTime);
    }
  }

  updateCoD(){
    console.log("update cod");
    this.codFocus = "list";
    this.selectedItem = 0;
    this.selectedCat = 0;
    this.selectedTab = 0;
    $("#cod").empty();
    this.hoverItem = 0;
    this.hoverTab = 0;

    if(codObj.length > 0){
      this.htmStr = '<div id="cod-content" style="width:' + screenW + 'px;height:' + screenH + 'px;"><div class="vid-seek hide" style="width:' + (screenW - 40) + 'px"><span></span></div><div class="vid-pause hide"></div><div class="vid-skip" style="top:' + (screenH - 64)/2 + 'px;left:' + (screenW - 64)/2 + 'px;"><div class="next"><img src="./img/cod/next.png"><div>10 Seconds</div></div><div class="prev"><img src="./img/cod/prev.png"><div>10 Seconds</div></div></div><div class="cod-content-container"></div></div>'
      this.htmStr += '<div class="tab" style="width:max-content;overflow:hidden;"><ul style="margin-left:0;">';
      for(var i=0; i<codObj.length; i++){
        // this.settings = JSON.parse(codObj[i].settings);
        this.htmStr += '<li onclick="tabFx(' + i + ')">' + codObj[i].name + '</li>';
      }
      this.htmStr += '</ul></div><div class="thumb-list-container" style="width:' + screenW + 'px;height:' + screenH + 'px;"><div class="thumb-container" style="margin-top:0px;"></div></div>'
    }
    $("#cod").html(this.htmStr);
    this.loadCoDList();
    $("#cod .thumb-container").find('.thumb:first').addClass("selected");
  }

  goBackToDS(){
    console.log("go to ds");
    if(this.idleTimer){
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
    ipc.send('appModeChange', "ds");
    $("#app-menu .menu-item").removeClass("hover");
    $("#app-menu .menu-item:nth-child(1)").addClass("hover");
    appMenuSelected = 1;
    cleanEverything();
    $("#cod").empty();
    $("#cod").hide();
    appMode = "ds";
    redraw();
  }

  loadCoDList(index){
    this.htmStr = "";
    this.resetIdleTimer();
    $("#cod .thumb-container").empty();
    $("#cod .tab li").removeClass("selected");
    $("#cod .tab li:nth-child(" + (this.selectedTab + 1) + ")").addClass("selected");

    for(var i=0; i<codObj[this.selectedTab].cat.length; i++){
      this.category = codObj[this.selectedTab].cat[i];
      this.htmStr += '<div class="title">' + this.category.label + '</div><div class="list-container-' + i + '" style="width:max-content;overflow:hidden;margin-left:0;">';
      for(var j=0; j<this.category.content.length; j++){
        this.content = this.category.content[j];
        if(this.content.type == "video"){
          this.thumbSrc = resourcePath + "/media/" + this.content.fileName.split(".mp4")[0] + ".jpg";
        }
        else if(this.content.type == "image"){
          this.thumbSrc = resourcePath + "/media/" + this.content.fileName;
        }
        else if(this.content.type == "cg"){
          this.thumbSrc = "./img/cod/cg-thumb.png";
        }
        else if(this.content.type.toLowerCase() == "webpage"){
          if(this.content.src.toLowerCase().indexOf("captivate") >= 0){
            this.thumbSrc = "./img/cod/captivate-thumb.png";
          }
          else{
            this.thumbSrc = "./img/cod/web-thumb.png";
          }
        }
        else if(this.content.type.toLowerCase() == "livestream"){
          // if(this.content.src.toLowerCase().indexOf("captivate") >= 0){
          //   this.thumbSrc = "./img/cod/captivate-thumb.png";
          // }
          // else{
          //   this.thumbSrc = "./img/cod/web-thumb.png";
          // }
          this.thumbSrc = "./img/cod/livestream.png";
        }
        else if(this.content.type.toLowerCase() == "powerbi"){
          this.thumbSrc = "./img/cod/powerbi.png";
        }
        if(this.content.type == "video"){
          this.htmStr += '<div id="cod-' + i + '-' + j + '" class="thumb" style="flex-direction:column;" onclick="cod.contentClickFx(' + i + ', ' + j + ');"><div class="thumb-img"><span class="thumb-inner"><img src="' + this.thumbSrc + '" style="display:block"></span><span class="thumb-info"><span class="thumb-time">' + new Date(parseInt(this.content.duration) * 1000).toISOString().substr(14, 5) + '</span><span class="thumb-vid"></span></span></div><div class="label">' + this.content.label + '</div></div>'
        }
        else{
          this.htmStr += '<div id="cod-' + i + '-' + j + '" class="thumb" style="flex-direction:column;" onclick="cod.contentClickFx(' + i + ', ' + j + ');"><div><img src="' + this.thumbSrc + '"></div><div class="label">' + this.content.label + '</div></div>'
        }
      }
      this.htmStr += '</div>';
    }
    $("#cod .thumb-container").html(this.htmStr)
  }

  tabFx(index){
    this.selectedTab = this.hoverTab;
    this.loadCoDList();
  }

  contentClickFx(cat, item){
    this.codFocus = "content";
    this.hoverItem = item;
    this.resetIdleTimer();

    $("#cod .thumb").removeClass("selected");
    $("#cod .thumb#cod-" + cat + "-" + item).addClass("selected");
    this.selectedItem = codObj[this.selectedTab].cat[cat].content[item];
    this.showContentFx();
  }

  closeCoDBrowser(){
    this.handleKeyEvent("back");
  }

  showContentFx(){
    this.isFsChrome = false;
    if(this.selectedItem.type == "cg"){
      this.frame = new Frame({id:this.selectedItem.id, a:"m-c", w:screenW, h:screenH, x:0, y:0, z:0, bg:"#000000", bga:0, transition:"n", tz:feed.device[0].timeZone, items:this.selectedItem.content});
    }
    else if(this.selectedItem.type.toLowerCase() == "webpage"){
      this.webUrl = this.selectedItem.src.toLowerCase();
      if(this.webUrl.indexOf("captivateprime") >= 0){
        this.isFsChrome = true;
        window.execCmd("taskkill  /IM chrome.exe /F");
        setTimeout(()=>{
          window.execApp(chromePath, ["--kiosk", this.selectedItem.src]);
        }, 500);
      }
      else{
        console.log("non captivate");
        this.frame = {htmStr: '<div id="slideIframe-'+ this.selectedItem.type +'-'+ this.selectedItem.id +'"><div style="position:fixed;z-index:99999999999999999999;top:20px;right:20px;" onclick="cod.closeCoDBrowser()"><a href="javascript:null;""><img src="./img/cod/close.png"></a></div><webview src="'+ this.selectedItem.src +'" nodeintegration style="position:relative;width:'+ screenW +'px;height:'+ screenH +'px;border:0;background:'+ this.selectedItem.bg +';"></webview></div>'};
      }
    }
    else{
      this.frame = new Frame({id:this.selectedItem.id, a:"m-c", w:screenW, h:screenH, x:0, y:0, z:0, bg:"#000000", bga:0, transition:"n", tz:feed.device[0].timeZone, items:[this.selectedItem]});
    }

    if(!this.isFsChrome){
      fTimerArr = [];
      fTimerArr.push({id:this.selectedItem.id, timers:[]});

      if(this.selectedItem.type.toLowerCase() == "livestream" || this.selectedItem.type.toLowerCase() == "powerbi"){
        $("#cod-content .cod-content-container").html('<div style="position:fixed;z-index:99999999999999999999;top:20px;right:20px;" onclick="cod.closeCoDBrowser()"><a href="javascript:null;""><img src="./img/cod/close.png"></a></div>' + this.frame.htmStr);
      }
      else{
        $("#cod-content .cod-content-container").html(this.frame.htmStr);
      }
      if($("#cod-content").find("video").length > 0){
        $("#cod-content").find("video").get(0).play();
        $("#cod .vid-pause").hide();
      }
      $("#cod-content").show();
    }
    if(this.idleTimer){
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
  }

  handleKeyEvent(key){
    console.log("key: " + key);
    this.resetIdleTimer();

    if(key == "left"){
      if(this.codFocus == "tab"){
        this.hoverTab--;
        if(this.hoverTab < 0){
          this.hoverTab = 0;
        }
        $("#cod .thumb").removeClass("selected");
        $("#cod .tab ul li").removeClass("hover");
        $("#cod .tab ul li:nth-child(" + (this.hoverTab + 1) + ")").addClass("hover");

        this.tabLeftMargin = Number($("#cod .tab ul").css("margin-left").split("px")[0]);
        if((this.tabLeftMargin + ($("#cod .tab li.hover").offset().left - $("#cod .tab li.hover").width())) < 0){
          $("#cod .tab ul").css({"margin-left":(this.tabLeftMargin + ($("#cod .tab li.hover").width() + 200) > 0)?0:this.tabLeftMargin + ($("#cod .tab li.hover").width() + 200)});
        }
      }
      else if(this.codFocus == "list"){
        this.hoverItem--;
        if(this.hoverItem < 0){
          this.hoverItem = 0;
        }
        $("#cod .thumb").removeClass("selected");
        $("#cod .thumb#cod-" + (this.selectedCat) + "-" + this.hoverItem).addClass("selected");

        this.listLeftMargin = Number($("#cod .list-container-" + this.selectedCat).css("margin-left").split("px")[0]);
        if((((this.hoverItem * 260) - 260) - Math.abs(this.listLeftMargin)) < 0){
          $("#cod .list-container-" + this.selectedCat).css({"margin-left":(this.listLeftMargin + 520 > 0)?0:this.listLeftMargin + 520});
        }
      }
    }
    else if(key == "right"){
      if(this.codFocus == "tab"){
        this.hoverTab++;
        if(this.hoverTab >= codObj.length){
          this.hoverTab = codObj.length - 1;
        }
        $("#cod .thumb").removeClass("selected");
        $("#cod .tab ul li").removeClass("hover");
        $("#cod .tab ul li:nth-child(" + (this.hoverTab + 1) + ")").addClass("hover");

        this.tabLeftMargin = Number($("#cod .tab ul").css("margin-left").split("px")[0]);
        if(this.tabLeftMargin + ($("#cod .tab li.hover").offset().left + $("#cod .tab li.hover").width()) > (screenW + this.tabLeftMargin)){
          $("#cod .tab ul").css({"margin-left":this.tabLeftMargin - ($("#cod .tab li.hover").width() + 200)});
        }
      }
      else if(this.codFocus == "list"){
        this.hoverItem++;
        if(this.hoverItem >= codObj[this.selectedTab].cat[this.selectedCat].content.length){
          this.hoverItem = codObj[this.selectedTab].cat[this.selectedCat].content.length - 1;
        }
        $("#cod .thumb").removeClass("selected");
        $("#cod .thumb#cod-" + (this.selectedCat) + "-" + this.hoverItem).addClass("selected");

        this.listLeftMargin = Number($("#cod .list-container-" + this.selectedCat).css("margin-left").split("px")[0]);
        if((((this.hoverItem * 260) + 260) - Math.abs(this.listLeftMargin)) > screenW){
          $("#cod .list-container-" + this.selectedCat).css({"margin-left":this.listLeftMargin - 520});
        }
      }
    }
    else if(key == "up"){
      this.selectedCat--;
      if(this.selectedCat < 0){
        this.codFocus = "tab";
        this.selectedCat = 0;
        this.hoverTab = this.selectedTab;
        $("#cod .thumb").removeClass("selected");
        $("#cod .tab ul li").removeClass("hover");
        $("#cod .tab ul li:nth-child(" + (this.hoverTab + 1) + ")").addClass("hover");
      }
      else{
        this.listLeftMargin = Number($("#cod .list-container-" + this.selectedCat).css("margin-left").split("px")[0]);
        if(this.listLeftMargin != 0){
          this.hoverItem += parseInt(Math.abs(this.listLeftMargin)/260);
        }
        if(this.hoverItem >= codObj[this.selectedTab].cat[this.selectedCat].content.length){
          this.hoverItem = codObj[this.selectedTab].cat[this.selectedCat].content.length - 1;
        }
        $("#cod .thumb").removeClass("selected");
        $("#cod .tab ul li").removeClass("hover");
        $("#cod .thumb#cod-" + (this.selectedCat) + "-" + this.hoverItem).addClass("selected");

        this.listTopMargin = Number($("#cod .thumb-container").css("margin-top").split("px")[0]);
        if((($("#cod .thumb#cod-" + (this.selectedCat) + "-" + this.hoverItem).position().top) - Math.abs(this.listTopMargin)) < 0){
          $("#cod .thumb-container").css({"margin-top":(this.listTopMargin + 500 > 0)?0:this.listTopMargin + 500});
        }
      }
    }
    else if(key == "down"){
      if(this.codFocus == "tab"){
        this.codFocus = "list";
        this.hoverTab = 0;
        this.hoverItem = 0;
        $("#cod .thumb").removeClass("selected");
        $("#cod .tab ul li").removeClass("hover");
        $("#cod .thumb#cod-" + (this.selectedCat) + "-" + this.hoverItem).addClass("selected");
      }
      else if(this.codFocus == "list"){
        this.selectedCat++;
        if(this.selectedCat >= codObj[this.selectedTab].cat.length){
          this.selectedCat = codObj[this.selectedTab].cat.length - 1;
        }
        this.listLeftMargin = Number($("#cod .list-container-" + this.selectedCat).css("margin-left").split("px")[0]);
        if(this.listLeftMargin != 0){
          this.hoverItem += parseInt(Math.abs(this.listLeftMargin)/260);
        }
        if(this.hoverItem >= codObj[this.selectedTab].cat[this.selectedCat].content.length){
          this.hoverItem = codObj[this.selectedTab].cat[this.selectedCat].content.length - 1;
        }
        $("#cod .thumb").removeClass("selected");
        $("#cod .tab ul li").removeClass("hover");
        $("#cod .thumb#cod-" + (this.selectedCat) + "-" + this.hoverItem).addClass("selected");

        this.listTopMargin = Number($("#cod .thumb-container").css("margin-top").split("px")[0]);
        if((this.listTopMargin + $("#cod .thumb#cod-" + (this.selectedCat) + "-" + this.hoverItem).position().top + $("#cod .thumb#cod-" + (this.selectedCat) + "-" + this.hoverItem).height()) > (screenH + this.listTopMargin)){
          $("#cod .thumb-container").css({"margin-top":this.listTopMargin - 500});
        }
      }
    }
    else if(key == "ok"){
      if(this.codFocus == "tab"){
        if(this.selectedTab != this.hoverTab){
          this.selectedTab = this.hoverTab;
          this.loadCoDList();
        }
      }
      else if(this.codFocus == "list"){
        this.codFocus = "content";
        this.selectedItem = codObj[this.selectedTab].cat[this.selectedCat].content[this.hoverItem];
        this.showContentFx();
      }
      else if(this.codFocus == "content"){
        this.codFocus = "list";
        $("#cod-content .cod-content-container").empty();
        console.log("cod - clear timer 1");
        window.clearTimer(this.selectedItem.id);
        $("#cod .vid-pause").hide();
        $("#cod-content").hide();
        this.frame = null;
      }
    }
    else if(key == "prev"){
      if(this.selectedItem.type == "video"){
        $("#cod-content").find("video").get(0).currentTime -= 10;
        $("#cod .vid-skip .prev").show().fadeOut("slow");
        $("#cod .vid-seek").show();
        if(this.seekHideTimer){
          clearTimeout(this.seekHideTimer);
          this.seekHideTimer = null;
        }
        this.seekHideTimer = setTimeout(function(){$("#cod .vid-seek").hide();}, 2000);
      }
    }
    else if(key == "next"){
      if(this.selectedItem.type == "video"){
        if($("#cod-content").find("video").get(0).currentTime){
          $("#cod-content").find("video").get(0).currentTime += 10;
          $("#cod .vid-skip .next").show().fadeOut("slow");
          $("#cod .vid-seek").show();
          if(this.seekHideTimer){
            clearTimeout(this.seekHideTimer);
            this.seekHideTimer = null;
          }
          this.seekHideTimer = setTimeout(function(){$("#cod .vid-seek").hide();}, 2000);
        }
      }
    }
    else if(key == "play"){
      if(this.selectedItem.type == "video"){
        if($("#cod-content").find("video").length > 0){
          $("#cod-content").find("video").get(0).play();
          $("#cod .vid-pause").hide();
          if(this.seekHideTimer){
            clearTimeout(this.seekHideTimer);
            this.seekHideTimer = null;
          }
          this.seekHideTimer = setTimeout(function(){$("#cod .vid-seek").hide();}, 2000);
        }
      }
    }
    else if(key == "pause"){
      if(this.selectedItem.type == "video"){
        $("#cod-content").find("video").get(0).pause();
        $("#cod .vid-pause").show();
        $("#cod .vid-seek").show();
      }
    }
    else if(key == "back"){
      if(this.codFocus == "content"){
        this.codFocus = "list";
        $("#cod-content .cod-content-container").empty();
        window.clearTimer(this.selectedItem.id);
        ipc.send('appModeChange', "cod");
        $("#cod .vid-pause").hide();
        $("#cod-content").hide();
        appMode = "cod";
        this.frame = null;
      }
    }
  }
}

class WidgetExcel{
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

    this.htmStr = '<div id="' + this.prop.type + '-' + this.prop.id + '" style="width:' + this.prop.w + 'px;height:' + this.prop.h + 'px;background:' + window.hexToRgbA(this.settings.bg, this.settings.bga) + '">';
    this.htmStr += '<style type="text/css">#tHead{color:' + this.settings.headerText + ';font-family:' + this.settings.headerFont.value + ';background:' + window.hexToRgbA(this.settings.headerBg, this.settings.headerBga) + ';}#' + this.prop.type + '-' + this.prop.id + ' #tBody .row{background:' + window.hexToRgbA(this.settings.rowBg, this.settings.rowBga) + ';font-family:' + this.settings.rowFont.value + ';color:' + this.settings.rowText + '}#' + this.prop.type + '-' + this.prop.id + ' #tBody .row:nth-child(even){background:' + window.hexToRgbA(this.settings.altBg, this.settings.altBga) + ';font-family:' + this.settings.altFont.value + ';color:' + this.settings.altText + ';}#' + this.prop.type + '-' + this.prop.id + '#' + this.prop.type + '-' + this.prop.id + ' #tFoot{color:' + this.settings.footerText + ';font-family:' + this.settings.footerFont.value + ';background:' + window.hexToRgbA(this.settings.footerBg, this.settings.footerBga) + ';}</style>';
    this.htmStr += '<div class="excelTbl">';
    this.htmStr += '<div id="tHead" class="th"></div>';
    this.htmStr += '<div id="tBody"></div>';
    this.htmStr += '<div id="tFoot" class="footer"></div>';
    this.htmStr += '</div></div>';

    setTimeout(()=>{this.init()}, 200);
    return this.htmStr;
  }

  init(){
    this.loadES();
    this.refreshTimer = setInterval(()=>{this.loadES()}, this.reDuration);
    //window.addTimer(this.refreshTimer, "i", this.prop.fid);
  }

  loadES(){
    this.htmStr = "";
    $.ajax({
      url: this.prop.src, // apiPath + "/excelSheet/"+ this.prop.id.split("-")[2],
      dataType: 'json',
      async: false,
      success:(data) =>{
        this.excelObj = data;
      },
      error: function(err){
        console.error(err);
      }
    });
    this.loadHtmlFx();
  }

  loadHtmlFx(){
    this.htmStr = "";
    this.hCol = this.excelObj.data.head.columns;
    $("#" + this.prop.type + "-" + this.prop.id + " #tHead").empty();
    for(var i = 0; i < this.hCol.length; i++){
      $("#" + this.prop.type + "-" + this.prop.id + " #tHead").append('<div class="cell" style="width:' + this.prop.w / this.hCol.length + 'px;">' + this.hCol[i].label + '</div>');
    }
    this.rCol = this.excelObj.data.row;
    if(this.rCol.length > 0){
      $("#" + this.prop.type + "-" + this.prop.id + " #tBody").empty();
      $("#" + this.prop.type + "-" + this.prop.id + " #tBody").append('<div id="list"></div>');
      this.containerArr = [];
      this.tempArr = [];
      this.num = 0;

      for(var i = 0; i < this.rCol.length; i++){
        // $("#" + this.prop.type + "-" + this.prop.id + " #tBody").append('<div class="row" id="row-' + i + '">');
        // for(var j = 0; j < this.rCol[i].columns.length; j++){
        //     console.warn(this.rCol[i].columns.length);
        //     $("#" + this.prop.type + "-" + this.prop.id + " #tBody #row-" + i).append('<div class="cell">' + this.rCol[i].columns[j].label + '</div>');
        // }
        // $("#" + this.prop.type + "-" + this.prop.id + " #tBody").append('</div>');

        this.htmStr = '<div class="row" id="row-' + i + '" style="visibility:hidden;">';
        for(var j = 0; j < this.rCol[i].columns.length; j++){
            this.htmStr += '<div class="cell" style="width:' + this.prop.w / this.hCol.length + 'px;">' + this.rCol[i].columns[j].label + '</div>';
        }
        this.htmStr += '</div>';

        $("#" + this.prop.type + "-" + this.prop.id + " #tBody #list").append(this.htmStr);

        if(($("#" + this.prop.type + "-" + this.prop.id + " #tBody #list").outerHeight() + ($("#" + this.prop.type + "-" + this.prop.id + " #tBody #list").children().length * 15)) > this.maxHeight){
          this.containerArr.push(this.tempArr);
          this.tempArr = [];
          this.tempArr.push({index:i});
          $("#" + this.prop.type + "-" + this.prop.id + " #tBody #list").empty();
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
        $("#" + this.prop.type + "-" + this.prop.id + " #tBody").append('<div id="list-' + j + '" style="' + this.visibilityCssStr + 'position:absolute;width:' + this.prop.w + 'px;"></div>');
        for(var k=0; k<this.containerArr[j].length; k++){
          this.htmStr = '<div class="row" id="row-' + i + '">';
            for(var l = 0; l < this.rCol[this.containerArr[j][k].index].columns.length; l++){
              this.htmStr += '<div class="cell" style="width:' + this.prop.w / this.hCol.length + 'px;">' + this.rCol[this.containerArr[j][k].index].columns[l].label + '</div>';
            }
          this.htmStr += '</div>';
          $("#" + this.prop.type + "-" + this.prop.id + " #tBody #list-" + j).append(this.htmStr);
        }
      }

      if(this.prop.transition == "f"){
        TweenMax.to($("#" + this.prop.type + "-" + this.prop.id + " #tBody #list-" + this.num), 0.5, {opacity:1});
      }
      else{
        $("#" + this.prop.type + "-" + this.prop.id + " #tBody #list-" + this.num).css("visibility", "visible");
      }
      this.pageCount = 1;
      if(this.rotateTimer){
        clearInterval(this.rotateTimer);
        this.rotateTimer = null;
      }
      this.rotateTimer = setInterval(()=>{
        if(this.prop.transition == "f"){
          TweenMax.to($("#" + this.prop.type + "-" + this.prop.id + " #tBody #list-" + this.num), 0.5, {opacity:0});
        }
        else{
          $("#" + this.prop.type + "-" + this.prop.id + " #tBody #list-" + this.num).css("visibility", "hidden");
        }
        this.num++;
        this.pageCount++;
        if(this.num >= $("#" + this.prop.type + "-" + this.prop.id + " #tBody>div").length){
          this.num = 0;
          this.pageCount = 1;
        }
        if(this.prop.transition == "f"){
          TweenMax.to($("#" + this.prop.type + "-" + this.prop.id + " #tBody #list-" + this.num), 0.5, {opacity:1});
        }
        else{
          $("#" + this.prop.type + "-" + this.prop.id + " #tBody #list-" + this.num).css("visibility", "visible");
        }
        $("#" + this.prop.type + "-" + this.prop.id + " #tFoot").html('<div>Page ' + this.pageCount + ' of ' + this.containerArr.length +'</div>');
      }, this.roDuration);

      $("#" + this.prop.type + "-" + this.prop.id + " #tFoot").html('<div>Page ' + this.pageCount + ' of ' + this.containerArr.length +'</div>');
    }
  }

  removeFx(){
    if(this.rotateTimer){
      clearInterval(this.rotateTimer);
    }
    clearInterval(this.refreshTimer);

    this.roDuration = this.reDuration = this.maxHeight = this.num = null;
    this.containerArr = this.tempArr = null;
    this.refreshTimer = null;
    this.rotateTimer = null;
    this.settings = null;
    this.prop = null;

    this.roDuration = this.reDuration = this.maxHeight = this.num = undefined;
    this.containerArr = this.tempArr = undefined;
    this.refreshTimer = undefined;
    this.rotateTimer = undefined;
    this.settings = undefined;
    this.prop = undefined;
  }
}

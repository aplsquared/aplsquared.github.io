//prefixes of implementation that we want to test
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

if(!window.indexedDB){
  window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

var db;
var mac;

const dbName = 'LSquaredIDB';
// const dbExisting = (await window.indexedDB.databases()).map(db => db.name).includes(dbName);

databaseExists(dbName, function(yesno){
  if(!yesno){
    console.log("db not exists");

    var request = window.indexedDB.open("LSquaredIDB", 1);

    request.onerror = function(event){
      console.log("error: ", event);
    };

    request.onsuccess = function(event){
      db = request.result;
      console.log("success: "+ db);
    };

    request.onupgradeneeded = function(event){
      console.log("db onupgrade");
      db = event.target.result;
      var objectStore = db.createObjectStore("config", {keyPath:"id"});
      objectStore.add({id:1, mac:getRandomToken()});

      db.createObjectStore("feed", {keyPath:"id"});
      db.createObjectStore("media", {keyPath:"id"});
      db.createObjectStore("weather", {keyPath:"id"}); //weather

      // db.createObjectStore("appImg", {keyPath: "id"});

      // for(var i=0;i<appImgArr.length; i++){
      //   const fileBlobImg = fetch(storageHost + diractory + appImgArr[i].src).then(response => response.blob());
      //   var curId = appImgArr[i].id;
      //   var curName = appImgArr[i].name;
      //   // Only run the next code when both promises have fulfilled
      //   Promise.all([fileBlobImg]).then(values => {
      //     // display the media fetched from the network with displayMediaFx()
      //     // console.warn(values[0], fetchData.src, fetchData.type);
      //     //displayMediaFx(values[0], fetchData.name, fetchData.type);
      //     // store it in the IDB using storeMediaFx()
      //     storeAppImgFx(values[0], curId, curName);

      //     // Open transaction, get object store; make it a readwrite so we can write to the IDB
      //     // const imgObjStore = db.transaction(['appImg'], 'readwrite').objectStore('appImg');

      //     // //console.warn(imgObjStore);

      //     // // Create a media record to add to the IDB
      //     // var record = {file:fileBlobImg, name:element}
      //     // // Add the record to the IDB using add()
      //     // var request = imgObjStore.add(record);
      //     // request.addEventListener('success', () => {
      //     //   //console.log('Record addition attempt finished');
      //     //   // downloadNext();
      //     // });
      //     // request.addEventListener('error', () => {
      //     //   console.error(request.error);
      //     //   // downloadNext();
      //     // });
      //   });
      // };

    }
  } else{
    var request = window.indexedDB.open("LSquaredIDB", 1);
    request.onerror = function(event){
      console.log("error: ");
    };

    request.onsuccess = function(event){
      db = request.result;
      readMac();
    };
  }
});

// function storeAppImgFx(fileBlob, id, name, type){
//     //console.log(fileBlob);
//   // console.warn("fileBlob ", fileBlob, " name ", name, " type ", type);

//   // Open transaction, get object store; make it a readwrite so we can write to the IDB
//   const imgObjStore = db.transaction(['appImg'], 'readwrite').objectStore('appImg');

//   //console.warn(imgObjStore);

//   // Create a media record to add to the IDB
//   var record = {id:id, file:fileBlob, name:name}
//   // Add the record to the IDB using add()
//   var request = imgObjStore.add(record);
//   request.addEventListener('success', () => {
//     //console.log('Record addition attempt finished');
//     // downloadNext();
//   });
//   request.addEventListener('error', () => {
//     console.error(request.error);
//     // downloadNext();
//   });
// }

function databaseExists(dbname, callback){
  var req = indexedDB.open(dbname);
  var existed = true;
  req.onsuccess = function (){
    req.result.close();
    if(!existed){
      indexedDB.deleteDatabase(dbname);
    }
    callback(existed);
  }
  req.onupgradeneeded = function (){
    existed = false;
  }
}

var blobURLs = [];
var curMediaId = 0;

function getBlobURL(){
  var transaction = db.transaction(["media"], "readonly");
  var objectStore = transaction.objectStore("media");
  // console.warn(downloadedMediaArr);

  if(downloadedMediaArr.length){
    var request = objectStore.get(downloadedMediaArr[curMediaId].id);

    request.onerror = function(event){
      console.log("Unable to retrieve daa from database!");
      blobURLs.push({id:downloadedMediaArr[curMediaId].id, src:""});
      getNextBlob();
    };

    request.onsuccess = function(event){
      var imgFile = event.target.result;
      var imgURL = URL.createObjectURL(imgFile.file);
      blobURLs.push({id:downloadedMediaArr[curMediaId].id, src:imgURL});
      getNextBlob();
    };
  } else{
    showWaiting(true);
    console.warn("downloadedMediaArr!23231");
  }
}

function getNextBlob(){
  curMediaId++;
  if(curMediaId < downloadedMediaArr.length){
    getBlobURL();
  }
  else{
    // console.log(blobURLs);
    generatePlaylist();
  }
}

async function fetchMedia(id){
  var transaction = db.transaction(["media"], "readonly");
  var objectStore = transaction.objectStore("media");
  var request = objectStore.get(id);

  request.onerror = function(event){
    console.log("Unable to retrieve daa from database!");
    return "";
  };

  request.onsuccess = function(event){
    var imgFile = event.target.result;
    console.log(imgFile)
    var imgURL = URL.createObjectURL(imgFile.file);
    console.log(imgURL);
    return imgURL;
  };
}



function readMac(){
  var transaction = db.transaction(["config"]);
  var objectStore = transaction.objectStore("config");
  var request = objectStore.get(1);

  request.onerror = function(event){
    console.log("Unable to retrieve mac from database!");
  };

  request.onsuccess = function(event){
    console.log(request.result.mac)
    mac = request.result.mac;
    readyToStart();
  };
}

function readIDBFeed(){
  console.warn("readIDBFeed--1");
  var transaction = db.transaction(["feed"]);
  var objectStore = transaction.objectStore("feed");
  var request = objectStore.get(1);

  request.onerror = function(event){
    console.error("Unable to retrieve feed from database!");
    if(!isRegPopup){
      registrationFx(true);
      showWaiting(true);
    }
  };

  request.onsuccess = function(event){
    feed = parseJSON(request.result.feed);
    console.log(feed);
    console.log("feedVersion: " + feedVersion);
    console.log("feed.device[0].version: " + feed.device[0].version);

    if(feedVersion != feed.device[0].version){
      console.log("in if");
      setVarsFromFeed();
      readMedia(true);
    }
    else{
      console.log("in else");
      setVarsFromFeed();
      readMedia(false);
    }
  };
}

function readAll(){
  var objectStore = db.transaction("employee").objectStore("employee");

  objectStore.openCursor().onsuccess = function(event){
    var cursor = event.target.result;

    if(cursor){
      console.log("Name for id " + cursor.key + " is " + cursor.value.name + ", Age: " + cursor.value.age + ", Email: " + cursor.value.email);
      cursor.continue();
    } else{
      console.error("No more entries!");
    }
  };
}

var downloadedMediaArr = [];
function readMedia(reload){
  console.warn("readMedia");
  downloadedMediaArr = [];

  var objectStore = db.transaction("media").objectStore("media");

  objectStore.openCursor().onsuccess = function(event){
    var cursor = event.target.result;
    if(cursor){
      downloadedMediaArr.push({id:cursor.key});
      //alert("Name for id " + cursor.key + " is " + cursor.value.name + ", Age: " + cursor.value.age + ", Email: " + cursor.value.email);
      cursor.continue();
    } else {
      // console.log("Read downloaded media completed.");
      generateDownloadableResourceArr(reload);
    }
  };
}

function readMediaAfterDownload(){
  console.log("after download");
  downloadedMediaArr = [];

  var objectStore = db.transaction("media").objectStore("media");
  objectStore.openCursor().onsuccess = function(event){
    var cursor = event.target.result;
    if(cursor){
      downloadedMediaArr.push({id:cursor.key});
      // alert("Name for id " + cursor.key + " is " + cursor.value.name + ", Age: " + cursor.value.age + ", Email: " + cursor.value.email);
      cursor.continue();
    } else{
      console.log("No more entries!");
      // generatePlaylist();
      curMediaId = 0;
      getBlobURL();
    }
  };
}

function fetchFileFromNetwork(fetchData){
  // then expose their response bodies as blobs
  const fileBlob = fetch(storageHost + bucket + fetchData.src).then(response => response.blob());
  // console.warn(fileBlob);

  // Only run the next code when both promises have fulfilled
  Promise.all([fileBlob]).then(values => {
    // store it in the IDB using storeMediaFx()
    storeMediaFx(values[0], fetchData.id, fetchData.fileName, fetchData.type);
  });
}

function storeMediaFx(fileBlob, id, name, type){
  // Open transaction, get object store; make it a readwrite so we can write to the IDB
  const mediaObjStore = db.transaction(['media'], 'readwrite').objectStore('media');

  // Create a media record to add to the IDB
  var record = {id:id, file:fileBlob, name:name, type:type};
  console.warn("record ", record.name);
  logMsg("C Downloading: " + record.name);
  // Add the record to the IDB using add()
  var request = mediaObjStore.add(record);
  request.addEventListener('success', ()=>{
    //console.log('Record addition attempt finished');
    logMsg("C Downloaded: " + record.name);
    downloadNext();
  });
  request.addEventListener('error', ()=>{
    console.error(request.error);
    logMsg("C Download Error: " + record.name);
    downloadNext();
  });
}


function writeFeed(feed){
  var request = db.transaction(["feed"], "readwrite")
  .objectStore("feed")
  .put({id:1, feed:feed});

  request.onsuccess = function(event){
    console.log("Feed has been added to your database.");
  };

  request.onerror = function(event){
  //   console.log("Unable to add feed");
  }
}

function writeWeather(wId, weather){
  var request = db.transaction(["weather"], "readwrite")
  .objectStore("weather")
  .put({id:wId, weather:weather});

  request.onsuccess = function(event){
    console.log("Weather has been added to your database.");
  };

  request.onerror = function(event){
  //   console.log("Unable to add feed");
  }
}

function readIDBWeather(wId){
  console.warn("readIDBWeather--1");

  var transaction = db.transaction(["weather"]);
  var objectStore = transaction.objectStore("weather");
  var request = objectStore.get(wId);

  request.onerror = function(event){
    console.error("Unable to retrieve weather from database!");
  };

  request.onsuccess = function(event){
    console.warn(parseJSON(request.result.weather));
    getIdBWeather = parseJSON(request.result.weather);
  };
}

function removeMedia(id){
  var request = db.transaction(["media"], "readwrite")
  .objectStore("media")
  .delete(id);

  request.onsuccess = function(event){
    console.log("Media removed");
  };
}

function removeFeed(id){
  var request = db.transaction(["feed"], "readwrite")
  .objectStore("feed")
  .delete(1);

  request.onsuccess = function(event){
    console.log("Feed removed");
  };
}




function add(){
  var request = db.transaction(["employee"], "readwrite")
  .objectStore("employee")
  .add({ id: "00-03", name: "Kenny", age: 19, email: "kenny@planet.org" });

  request.onsuccess = function(event){
    console.log("Kenny has been added to your database.");
  };

  request.onerror = function(event){
    console.log("Unable to add data\r\nKenny is aready exist in your database! ");
  }
}

function read(){
  var transaction = db.transaction(["employee"]);
  var objectStore = transaction.objectStore("employee");
  var request = objectStore.get("00-03");

  request.onerror = function(event){
    console.error("Unable to retrieve daa from database!");
  };

  request.onsuccess = function(event){
    // Do something with the request.result!
    if(request.result){
      console.log("Name: " + request.result.name + ", Age: " + request.result.age + ", Email: " + request.result.email);
    } else {
      console.error("Kenny couldn't be found in your database!");
    }
  };
}

function remove(){
  var request = db.transaction(["employee"], "readwrite")
  .objectStore("employee")
  .delete("00-03");

  request.onsuccess = function(event){
    console.log("Kenny's entry has been removed from your database.");
  };
}


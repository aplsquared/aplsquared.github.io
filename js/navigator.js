function wakeLockFx(){
  if('wakeLock' in navigator){
    console.log("Wake Lock is supported.");
    logMsg("Wake Lock is supported.");
  
    let wakeLock;
  
    async function acquireLock(){
      console.warn(wakeLock);
      console.warn(wakeLock);

      
      if(!wakeLock || wakeLock.released){
        console.log(navigator);
        console.warn(navigator.wakeLock);
        wakeLock = await navigator.wakeLock.request("screen");
        console.log("Wake Lock is acquired.");
        logMsg("Wake Lock is acquired.");
      }
  
      wakeLock.addEventListener('release', () => {
        console.log('Wake Lock is released.');
        logMsg('Wake Lock is released.');
        acquireLock();
      });
    }
    acquireLock();
  
    function releaseLock(){
      wakeLock.release().then(() => {
        console.log("Wake Lock released.");
        logMsg("Wake Lock released.");
      });
    }
    setInterval(function(){acquireLock()}, 120000);
  } else{
    console.error("Wake Lock is not supported!");
    logMsg("Wake Lock is not supported!");
  }
}


const ONE_MEG = 1000000;
/* Format the number into something nice if possible */
function formatToMB(val, decimals){
  // const opts = {
  //   maximumFractionDigits: 0,
  // };
  // let result;
  // try {
  //   result = new Intl.NumberFormat('en-us', opts).format(val / ONE_MEG);
  // } catch (ex) {
  //   result = Math.round(val / ONE_MEG);
  // }
  if(val != null){
    val = val / 1024;
    if(val == 0) return '0 KB';
    if(val > 0 && val < 1) return (val).toFixed(2) +' KB';
    var k = 1024; // or 1000 for binary
    var dm = decimals + 1 || 2;
    var sizes = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var i = Math.floor(Math.log(val) / Math.log(k));
    return parseFloat((val / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  
  // return `${result} MB`;
}

// angular.module('hub').filter('filesize', function(){
//   return function(filesize, decimals){
//     if(filesize != null){
//       filesize = filesize / 1024;
//       if(filesize == 0) return '0 KB';
//       if(filesize > 0 && filesize < 1) return (filesize).toFixed(2) +' KB';
//       var k = 1024; // or 1000 for binary
//       var dm = decimals + 1 || 2;
//       var sizes = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
//       var i = Math.floor(Math.log(filesize) / Math.log(k));
//       return parseFloat((filesize / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
//     }
//   }
// });



function getStorageFx(){
  const elemQuota = document.getElementById('quota');
  const elemUsed = document.getElementById('used');
  const elemRemaining = document.getElementById('remaining');
  console.warn(elemQuota);


  if('storage' in navigator){
    console.log("Storage is supported.");
    
    navigator.storage.estimate().then((estimate) => {
      console.warn(estimate);
      console.log('quota', (estimate.usage / estimate.quota * 100).toFixed(2));
  
      
      elemQuota.textContent = "Helllo";
      
      const remaining = estimate.quota - estimate.usage;
      elemQuota.textContent = formatToMB(estimate.quota);
      elemUsed.textContent = formatToMB(estimate.usage);
      elemRemaining.textContent = formatToMB(remaining);
      
      console.error("quota ", formatToMB(estimate.quota));
      console.error("usage ", formatToMB(estimate.usage));
      console.error("remaining ", formatToMB(remaining));
      
  
    }).catch((err) => {
      console.error('*** Unable to update quota ***', err);
    }).then(() => {
      console.warn("Then");
    });

  } else{
    console.log("Storage is Not supported!");
  }


  // if(navigator.storage && navigator.storage.persist){
  //   console.log(navigator.storage.persist);
  //   navigator.storage.persist().then(function(persistent){
  //     console.error(persistent);
  //     if(persistent){
  //       console.log("Storage will not be cleared except by explicit user action");
  //     }
  //     else{
  //       console.log("Storage may be cleared by the UA under storage pressure.");
  //     }
  //   });
  // }


  // if(navigator.storage && navigator.storage.persist){
  //   console.log(navigator.storage.persist);
  //   navigator.storage.persisted().then(function(persistent){
  //     console.warn(persistent);
  //     if(persistent){
  //       console.log("Storage will not be cleared except by explicit user action");
  //     }
  //     else{
  //       console.log("Storage may be cleared by the UA under storage pressure.");
  //     }
  //   });
  // }

}
setTimeout(() => {
  getStorageFx();
}, 1000);
setInterval(() => {
  getStorageFx();
}, 10000);
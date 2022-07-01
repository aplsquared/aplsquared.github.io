function wakeLockFx(){
  if('wakeLock' in navigator){
    console.log("Wake Lock is supported.");
    logMsg("Wake Lock is supported.");
  
    let wakeLock;
  
    async function acquireLock(){
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
    setInterval(function(){acquireLock()}, 30000);
  } else{
    console.error("Wake Lock is not supported!");
    logMsg("Wake Lock is not supported!");
  }
}
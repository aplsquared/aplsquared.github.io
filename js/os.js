// if('wakeLock' in navigator){
//   let lock;

//   // button.addEventListener('click', async () => {
//     // if (lock) {
//     //   console.log(`Release button pressed.`);
//     //   lock.release();
//     //   return;
//     // }
//     const requestWakeLock = async () => {
//       try {
//         console.log(`Acquire button pressed.`);
//         lock = await navigator.wakeLock.request('screen');
//         // label.textContent = 'Acquired';
//         console.log(`lock acquired.`);

//         lock.addEventListener('release', () => {
//           // label.textContent = 'Released';
//           console.log(`lock released.`);
//           lock = null;
//         });
//       } catch (e) {
//         // label.textContent = `${e.name}: ${e.message}`;
//         console.log(`Caught ${e.name} lock: ${e.message}`);
//       }
//     // });
//     }
    

// } else{
//   // label.textContent = 'Not supported';
//   console.error('Not supported');
// }



// let isWakeLock = true;
// if('WakeLock' in window && 'request' in window.WakeLock){
//   console.log('#IF WakeLock');
//   logMsg('#IF WakeLock');
//   let wakeLock = null;
//   const requestWakeLock = () => {
//     const controller = new AbortController();
//     const signal = controller.signal;
//     window.WakeLock.request('screen', {signal}).catch((e) => {
//       if(e.name === 'AbortError'){
//         isWakeLock = false;
//         // statusDiv.textContent = 'Wake Lock was aborted';
//         console.log('Wake Lock was aborted');
//         logMsg('Wake Lock was aborted');
//       } else{
//         // statusDiv.textContent = `${e.name}, ${e.message}`;
//         console.error(`${e.name}, ${e.message}`);
//         logMsg(`${e.name}, ${e.message}`);
//       }
//     });
//     isWakeLock = true;
//     // statusDiv.textContent = 'Wake Lock is active';
//     console.log('Wake Lock is active');
//     logMsg('Wake Lock is active');
//     return controller;
//   };

//   if(isWakeLock){
//     wakeLock = requestWakeLock();
//   } else{
//     wakeLock.abort();
//     wakeLock = null;
//   }

// }
// else if('wakeLock' in navigator && 'request' in navigator.wakeLock){
//   console.log('#Else IF WakeLock');
//   logMsg('#Else IF WakeLock');

//   let wakeLock = null;
//   const requestWakeLock = async ()=>{
//     console.warn("requestWakeLock else if");
//     try{
//       wakeLock = await navigator.wakeLock.request('screen');
//       wakeLock.addEventListener('release', (e)=>{
//         console.log(e);
//         isWakeLock = false;
//         // statusDiv.textContent = 'Wake Lock was released';
//         console.log('Wake Lock was released');
//         logMsg('Wake Lock was released');
//       });
//       isWakeLock = true;
//       // statusDiv.textContent = 'Wake Lock is active';
//       console.log('Wake Lock is active');
//       logMsg('Wake Lock is active');
//     } catch(e){
//       isWakeLock = false;
//       // statusDiv.textContent = `${e.name}, ${e.message}`;
//       console.error(`${e.name}, ${e.message}`);
//       logMsg(`${e.name}, ${e.message}`);
//     }
//   };

//   console.warn("isWakeLock!234");
//   if(isWakeLock){
//     requestWakeLock();
//   } else{
//     try{
//       wakeLock.release();
//       wakeLock = null;
//       console.log("I am in try...!")
//     } catch(e){console.log("I am in catch...!")}
//   }
// }
// else{
//   console.log('#Else WakeLock');
//   logMsg('#Else WakeLock');
//   // statusDiv.textContent = 'Wake Lock API not supported.';
//   console.error('Wake Lock API not supported.');
//   logMsg('Wake Lock API not supported.');
// }
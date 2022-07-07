importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.0.0/workbox-sw.js');
const staticCacheName = 'LSquared-s-v1';
const dynamicCacheName = 'LSquared-d-v1';
const clientVersion = '2.0.19';

// console.warn(new DeviceUUID().get());

console.warn('SW loaded');

const assets = [
  '/',
  'index.html',
  'js/common.js',
  'js/index.js',
  'js/frame.js',
  'js/idb.js',
  'js/widgets/imgLoader.js',
  'js/widgets/vidLoader.js',
  'js/widgets/templates.js',
  'js/widgets/audioLoader.js',
  'js/widgets/widgetBrowser.js',
  'js/widgets/widgetCount.js',
  'js/widgets/widgetCrawlingText.js',
  'js/widgets/widgetDateTime.js',
  'js/widgets/widgetExcel.js',
  'js/widgets/widgetFillerContent.js',
  'js/widgets/widgetFlight.js',
  'js/widgets/widgetListView.js',
  'js/widgets/widgetLiveStream.js',
  'js/widgets/widgetMeetingRB.js',
  'js/widgets/widgetMeetingWB.js',
  'js/widgets/widgetMessage.js',
  'js/widgets/widgetOpenHour.js',
  'js/widgets/widgetQueue.js',
  'js/widgets/widgetQuote.js',
  'js/widgets/widgetRadio.js',
  'js/widgets/widgetStock.js',
  'js/widgets/widgetSurvey.js',
  'js/widgets/widgetText.js',
  'js/widgets/widgetThumbView.js',
  'js/widgets/widgetWeather.js',
  'js/widgets/widgetWebCam.js',
  'js/library/jquery-3.6.0.min.js',
  'js/library/TweenMax.min.js',
  'css/style.css',
  'css/flex.css',

  'img/bg.png',
  'img/bg-p.png',
  'img/cal-na.png',
  'img/check.png',
  'img/check-white.png',
  'img/client-update.png',
  'img/download.gif',
  'img/error.png',
  'img/info.png',
  'img/insta.png',
  'img/loading.png',
  'img/logo-sm-colored.png',
  'img/logo.ico',
  'img/network-off.png',
  'img/no-network-intro1.png',
  'img/no-network-intro2.png',
  'img/no-network-intro3.png',
  'img/no-network.png',
  'img/spectrum-next.png',
  'img/squared.png',
  'img/webos-logo.jpg',

  'img/fb.svg',
  'img/next.svg',
  'img/wifi.svg',
  'img/clock.svg',
  'img/flight.svg',
  'img/twitter.svg',
  'img/calendar.svg',
  'img/linkedin.svg',
  'img/instagram.svg',
]

// self.addEventListener('install', e => {
//  e.waitUntil(
//    caches.open('video-store').then(function(cache) {
//      return cache.addAll([
//        '/',
//        'index.html',
//        'index.js',
//        'style.css'
//      ]);
//    })
//  );
// });

// self.addEventListener('fetch', e => {
//   console.log(e.request.url);
//   e.respondWith(
//     caches.match(e.request).then(response => response || fetch(e.request))
//   );
// });

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(staticCacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener('activate', e => {
  console.log('Servie worker has been activated');
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== staticCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', e => {
  // console.log(e.request.url);
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});

// self.addEventListener('fetch', e => {
//   console.log(e.request.url);
//   e.respondWith(
//     // caches.match(e.request).then(response => response || fetch(e.request))
//     caches
//       .match(e.request)
//       .then(cacheRes => {
//         return cacheRes || fetch(e.request).then(fetchRes => {
//           return caches.open(dynamicCacheName).then(cache =>{
//             cache.put(e.request.url, fetchRes.clone());
//             return fetchRes;
//           })
//         });
//       })
//   )
// });


// https://developers.google.com/web/tools/workbox/reference-docs/latest/workbox.routing#registerRoute
workbox.routing.registerRoute(
  /index\.html/,
  // https://developers.google.com/web/tools/workbox/reference-docs/latest/workbox.strategies
  workbox.strategies.networkFirst({
    cacheName: 'workbox:html',
  })
);

workbox.routing.registerRoute(
  new RegExp('.*\.js'),
  workbox.strategies.networkFirst({
    cacheName: 'workbox:js',
  })
);

workbox.routing.registerRoute(
  // Cache CSS files
  /.*\.css/,
  // Use cache but update in the background ASAP
  workbox.strategies.staleWhileRevalidate({
    // Use a custom cache name
    cacheName: 'workbox:css',
  })
);

workbox.routing.registerRoute(
  // Cache image files
  /.*\.(?:png|jpg|jpeg|svg|gif)/,
  // Use the cache if it's available
  workbox.strategies.cacheFirst({
    // Use a custom cache name
    cacheName: 'workbox:image',
    plugins: [
      new workbox.expiration.Plugin({
        // Cache only 20 images
        maxEntries: 20,
        // Cache for a maximum of a week
        maxAgeSeconds: 7 * 24 * 60 * 60,
      })
    ],
  })
);

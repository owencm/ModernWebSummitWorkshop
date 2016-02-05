var version = '5';
var dataCacheName = 'weatherData-v' + version;
var cacheName = 'weatherPWA-v' + version;
var filesToCache = [
  './',
  './index.html',
  './scripts/app.js',
  './images/icons/icon-256x256.png'
];

self.addEventListener('install', (e) => {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log('[ServiceWorker] Caching App Shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', (e) => {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        console.log('[ServiceWorker] Removing old cache', key);
        if (key !== cacheName) {
          return caches.delete(key);
        }
      }));
    })
  );
});

var nosw = 0;
self.addEventListener('fetch', (e) => {
  var url = new URL(e.request.url);
  if(nosw || (url.search.indexOf("nosw=1") >= 0)) {
    console.log('[ServiceWorker] Skipping the ServiceWorker');
    nosw = 1;
    return; // Fall through to the network
  }

  console.log('[ServiceWorker] Fetch', e.request.url);
  if (e.request.url.indexOf('data/') != -1) {
    e.respondWith(
      fetch(e.request)
        .then((response) => {
          return caches.open(dataCacheName).then((cache) => {
            cache.put(e.request.url, response.clone());
            console.log('[ServiceWorker] Fetched & Cached', e.request.url);
            return response;
          });
        })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then((response) => {
        return response || fetch(e.request);
      })
    );
  }
});

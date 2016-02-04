var dataCacheName = 'weatherData-v1';
var cacheName = 'weatherPWA-step-celebrate-1';
var filesToCache = [
  './',
  './index.html',
  './scripts/app.js',
  './images/clear.png',
  './images/cloudy-scattered-showers.png',
  './images/cloudy.png',
  './images/fog.png',
  './images/ic_add_white_24px.svg',
  './images/ic_refresh_white_24px.svg',
  './images/partly-cloudy.png',
  './images/rain.png',
  './images/scattered-showers.png',
  './images/sleet.png',
  './images/snow.png',
  './images/thunderstorm.png',
  './images/wind.png'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching App Shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        console.log('[ServiceWorker] Removing old cache', key);
        if (key !== cacheName) {
          return caches.delete(key);
        }
      }));
    })
  );
});

var nosw = 0;
self.addEventListener('fetch', function(e) {
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
        .then(function(response) {
          return caches.open(dataCacheName).then(function(cache) {
            cache.put(e.request.url, response.clone());
            console.log('[ServiceWorker] Fetched&Cached Data');
            console.log(e.request.url);
            return response;
          });
        })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }
});

self.addEventListener('push', function(e) {
  console.log('[ServiceWorker] Received push event');
  e.waitUntil(
    fetch('pushdata').then(function(response) {
      var title = 'Weather PWA';
      var body = response;
      var icon = '/images/icons/icon-192x192.png';
      var tag = 'static-tag';
      self.registration.showNotification(title, {
        body: body,
        icon: icon,
        tag: tag
      });
    }).catch(function(e) {
      throw new Error('Failed to show a notification in response to a push message');
    });
  );
});

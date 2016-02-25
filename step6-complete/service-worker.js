importScripts('../node_modules/sw-toolbox/sw-toolbox.js');
var version = '6';
var dataCacheName = 'weatherData-v'+version;
var cacheName = 'weatherPWA-step-celebrate-'+version;
var filesToCache = [
  './',
  './index.html',
  './scripts/app.js',
  './styles/inline.css',
  './images/icons/icon-256x256.png'
];

toolbox.options.cache.name = cacheName;
toolbox.precache(filesToCache);

self.addEventListener('install', function(e) {
  e.waitUntil(self.skipWaiting());
});

// activate event
self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        console.log('[ServiceWorker] Removing old cache', key);
        if ((key !== dataCacheName || key !== cacheName) && key.indexOf("$$$inactive$$$") === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});

var nosw = 0;
self.addEventListener('fetch', function(e) {
  var url = new URL(e.request.url);
  if (nosw || (url.search.indexOf("nosw=1") >= 0)) {
    nosw = 1;
    return;
  }
});

self.addEventListener('push', function(e) {
  console.log('[ServiceWorker] Received push event');
  e.waitUntil(
    fetch('/pushdata').then(function(response) {
      return response.json();
    }).then(function(data) {
      var title = 'Weather PWA';
      var body = data.msg;
      var icon = '/images/icons/icon-256x256.png';
      var tag = 'static-tag';
      return self.registration.showNotification(title, {
        body: body,
        icon: icon,
        tag: tag
      });
    }, function(err) {
      console.error(err);
    })
  );
});

toolbox.router.get('/(.*)', toolbox.cacheFirst, {
  cache: { name: cacheName }
});

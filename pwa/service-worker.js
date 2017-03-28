var cacheName = 'crashtest-002';
var filesToCache = [
  '/',
  '/app.css',
  '/app.js'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  //e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    }).then(function() {
      // `skipWaiting()` forces the waiting ServiceWorker to become the
      // active ServiceWorker, triggering the `onactivate` event.
      // Together with `Clients.claim()` this allows a worker to take effect
      // immediately in the client(s).
      console.log('[ServiceWorker] all files cached')
      // return self.skipWaiting();
    })
  //);
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  //e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
    .then(function () {
      console.log('[ServiceWorker] in activate: self.client.claim')
      // self.clients.claim();
    })
  //);
});


self.addEventListener('fetch', function(event) {
  console.log('[ServiceWorker] ::fetch ', event.request.url)
  // // Ignore non-get request like when accessing the admin panel
  if (event.request.method !== 'GET') { return; }
  // // Don't try to handle non-secure assets because fetch will fail
  // if (/http:/.test(event.request.url)) { return; }

  // Here's where we cache all the things!
  event.respondWith(
    // Open the cache created when install
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] ::fetch caches loaded')
      // Go to the network to ask for that resource
      return fetch(event.request).then(function(networkResponse) {
        console.log('[ServiceWorker] ::fetch response', networkResponse.url)
        // Add a copy of the response to the cache (updating the old version)
        cache.put(event.request, networkResponse.clone());
        // Respond with it
        return networkResponse;
      }, function() {
        // If there is no internet connection, try to match the request
        // to some of our cached resources
        console.log('[ServiceWorker] ::fetch failed, use cache', networkResponse.url)
        return cache.match(event.request);
      })
    }, function () {
      console.log('[ServiceWorker] ::fetch caches FAILED')
      return fetch(event.request).then(function(networkResponse) {
        console.log('[ServiceWorker] ::fetch response', networkResponse.url)
        // Add a copy of the response to the cache (updating the old version)
        cache.put(event.request, networkResponse.clone());
        // Respond with it
        return networkResponse;
      }).catch(function(e) {
        // Do nothing.
        console.warn('Catch in second fetch', e)
      });
    })
  );
});

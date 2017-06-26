



var version = 'v1';console.log(version)
var cacheItems = [
  
  'css/basic.css',
  'css/main.css',
  'css/responsive.css',
  'js/utils.js',
  'js/mod/mod.js',
  'js/mod/xhr.js',
  'js/mod/dialog.js',
  'js/mod/notif.js',
  'js/mod/scroll.js',
  'js/mod/pagination.js',
  'js/state.js',
  'js/settings.js',
  'js/title.js',
  'js/verticalnav.js',
  'js/static.js',
  'js/main.js',
  'js/init.js',
  'pages/read/read.js',
  'pages/search/search.js',
  'pages/read/read.css',
  'pages/search/search.css',
  'data/meta.json'
];





self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(version).then(function(cache) {
      return cache.addAll(cacheItems);
    })
  );
});



// delete old version
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (version !== key) {
          return caches.delete(key);
        }
      }));
    })
  );
});


// on each network request
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming self
        // once by cache and once by the browser for fetch, we need
        // to clone the response.
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(version)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});



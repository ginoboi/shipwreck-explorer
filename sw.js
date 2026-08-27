const CACHE_NAME = 'shipwreck-explorer-v4';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './images/app_icon.png',
  './images/alec_avatar.png',
  './images/titanic.jpg',
  './images/bismarck.jpg',
  './images/maryrose.jpg',
  './images/vasa.jpg',
  './images/lusitania.jpg',
  './images/britannia.jpg',
  './images/bg_math.jpg',
  './images/bg_filipino.jpg',
  './images/bg_english.jpg',
  './images/bg_general.jpg',
  './images/yamato_trials_1941.jpg',
  './images/yamato_moored_1943.jpg',
  './images/yamato_wreck_diorama.webp',
  './images/yamato_wreck_illustration.png',
  './images/costa_before.jpg',
  './images/costa_aground.jpg',
  './images/costa_giglio.jpg',
  './images/costa_parbuckling.jpg'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      // Cache core assets, but don't fail if some are missing
      return cache.addAll(ASSETS_TO_CACHE).catch(function(err) {
        console.log('Some assets failed to cache on install:', err);
        return Promise.resolve();
      });
    }).then(function() {
      // Cache all generated images
      return caches.open(CACHE_NAME).then(function(cache) {
        var imageUrls = [
          'images/00bc1a1d7_generated_image.png',
          'images/2fcb3de5d_generated_image.png',
          'images/47992817f_generated_image.png',
          'images/506f7ebf5_generated_image.png',
          'images/5cb0bcf99_generated_image.png',
          'images/65fa0fe26_generated_image.png',
          'images/68437c92c_generated_image.png',
          'images/76922149a_generated_image.png',
          'images/96fb94652_generated_image.png',
          'images/b5232893b_generated_image.png',
          'images/bec0564d4_generated_image.png',
          'images/ca410f128_generated_image.png',
          'images/d30c77e84_generated_image.png',
          'images/d96622078_generated_image.png',
          'images/e35f4a9e9_generated_image.png',
          'images/e7e4cf7d0_generated_image.png',
          'images/eaec65658_generated_image.png',
          'images/f56a730d3_generated_image.png',
          'images/ff2d5e854_generated_image.png'
        ];
        return Promise.all(imageUrls.map(function(url) {
          return cache.add(url).catch(function() { return Promise.resolve(); });
        }));
      });
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.filter(function(name) {
          return name !== CACHE_NAME;
        }).map(function(name) {
          return caches.delete(name);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  var request = event.request;
  
  if (request.method !== 'GET') return;
  
  var url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  
  // For audio files, cache-first
  if (url.pathname.startsWith('/audio/') || url.pathname.endsWith('.mp3')) {
    event.respondWith(
      caches.match(request).then(function(cached) {
        if (cached) return cached;
        return fetch(request).then(function(response) {
          if (response.ok) {
            var clone = response.clone();
            caches.open(CACHE_NAME).then(function(cache) {
              cache.put(request, clone);
            });
          }
          return response;
        }).catch(function() {
          return new Response('', { status: 404 });
        });
      })
    );
    return;
  }
  
  // For everything else, network-first with cache fallback
  event.respondWith(
    fetch(request).then(function(response) {
      if (response.ok && (response.type === 'basic' || response.type === 'default')) {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(request, clone);
        });
      }
      return response;
    }).catch(function() {
      return caches.match(request).then(function(cached) {
        return cached || caches.match('./index.html');
      });
    })
  );
});

const CACHE_NAME = 'mstq-sukien-pwa-v5';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './style.css',
  './script.js',
  './register-sw.js',
  './icon-192.png',
  './icon-512.png',
  './icon-192-any.png',
  './icon-512-any.png',
  './icon-48.png',
  './icon-96.png',
  './images/logo.png',
  './images/screenshot1.png',
  './images/screenshot2.png',
  './images/screenshot3.png',
  './lib/tailwindcss.min.css',
  './lib/chart.min.js',
  './lib/xlsx.full.min.js',
  './lib/html2canvas.min.js',
  './lib/Sortable.min.js',
  './lib/fonts/Inter-Regular.woff2',
  './lib/fonts/Inter-Medium.woff2',
  './lib/fonts/Inter-SemiBold.woff2',
  './lib/fonts/Inter-Bold.woff2'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache).catch(error => {
        console.error('Lỗi khi cache tài nguyên:', error);
      });
    })
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http')) return;
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;
      return fetch(event.request).then(networkResponse => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        }).catch(err => {
          console.warn('Không thể cache response:', event.request.url, err);
        });
        return networkResponse;
      }).catch(err => {
        console.warn('Không thể lấy và không có trong cache:', event.request.url, err);
      });
    })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  event.waitUntil(self.clients.claim());
});

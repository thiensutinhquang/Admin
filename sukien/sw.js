// Tên của bộ nhớ cache — phiên bản dành riêng cho sự kiện
const CACHE_NAME = 'mstq-sukien-pwa-v1';

// Danh sách các tệp cần cache để app sự kiện hoạt động offline
const urlsToCache = [
  './',                 // Cache index.html (ứng dụng chính)
  './index.html',
  './manifest.json',   // manifest riêng cho sukien
  './style.css',       // nếu có file CSS riêng
  './script.js',       // nếu có JavaScript riêng
  './images/logo.png', // nếu có logo
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// Sự kiện 'install': cache tài nguyên
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Service Worker (sukien): Đang cài đặt và cache...');
      return cache.addAll(urlsToCache);
    })
  );
});

// Sự kiện 'fetch': ưu tiên lấy từ cache trước
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

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
        });

        return networkResponse;
      }).catch(err => {
        console.warn('Không thể lấy được và không có trong cache:', event.request.url);
      });
    })
  );
});

// Sự kiện 'activate': xóa cache cũ nếu cần
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Service Worker (sukien): Đang xoá cache cũ:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

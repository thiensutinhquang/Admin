// Tên của bộ nhớ cache, thay đổi phiên bản khi có cập nhật lớn
const CACHE_NAME = 'event-manager-pwa-v3';

// Danh sách các tệp cần được cache để ứng dụng hoạt động offline
const urlsToCache = [
  './', // Cache trang chính
  './Noidungdangkyvannghe.html',
  './manifest.json',
  './style.css', // Thêm CSS nếu bạn có
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// Sự kiện 'install': được kích hoạt khi service worker được cài đặt lần đầu
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Đã mở cache và đang tải tài nguyên...');
        return cache.addAll(urlsToCache);
      })
  );
});

// Sự kiện 'fetch': mỗi khi có một yêu cầu mạng từ ứng dụng
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || event.request.url.includes('firestore.googleapis.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Trả về từ cache nếu có
        }

        return fetch(event.request).then(response => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });

          return response;
        }).catch(error => {
          console.warn('Không thể fetch và không có trong cache:', event.request.url);
        });
      })
  );
});

// Sự kiện 'activate': dọn dẹp cache cũ khi phiên bản thay đổi
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Service Worker: Đang xoá cache cũ:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

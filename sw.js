// Tên của bộ nhớ cache, thay đổi phiên bản khi có cập nhật lớn
const CACHE_NAME = 'event-manager-pwa-v2';

// Danh sách các tệp cần được cache để ứng dụng hoạt động offline
const urlsToCache = [
  './', // Cache trang chính (index)
  './Noidungdangkyvannghe.html', // Cache file HTML cụ thể
  './manifest.json', // Cache file manifest
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// Sự kiện 'install': được kích hoạt khi service worker được cài đặt lần đầu
self.addEventListener('install', event => {
  // Chờ cho đến khi các tệp đã được cache thành công
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Đã mở cache và đang tải tài nguyên...');
        // Thêm tất cả các URL vào cache
        return cache.addAll(urlsToCache);
      })
  );
});

// Sự kiện 'fetch': được kích hoạt mỗi khi có một yêu cầu mạng từ ứng dụng
self.addEventListener('fetch', event => {
  // Bỏ qua các yêu cầu không phải là GET hoặc các yêu cầu tới Firestore
  if (event.request.method !== 'GET' || event.request.url.includes('firestore.googleapis.com')) {
    return;
  }
  
  // Chiến lược: Cache First (Ưu tiên Cache)
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Nếu tìm thấy trong cache, trả về ngay lập tức
        if (response) {
          return response;
        }
        
        // Nếu không, thực hiện yêu cầu mạng
        return fetch(event.request).then(
          (response) => {
            // Kiểm tra xem response có hợp lệ không
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Sao chép response để có thể đưa vào cache và trả về cho trình duyệt
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Sự kiện 'activate': dọn dẹp các cache cũ không còn được sử dụng
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Đang xoá cache cũ:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

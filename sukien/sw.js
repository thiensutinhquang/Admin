// Tên của bộ nhớ cache — phiên bản dành riêng cho sự kiện
// Tăng phiên bản này mỗi khi bạn thay đổi nội dung của Service Worker hoặc urlsToCache
const CACHE_NAME = 'mstq-sukien-pwa-v5'; // Đã tăng phiên bản cache lên v5

// Danh sách các tệp cần cache để app sự kiện hoạt động offline
// Đảm bảo tất cả các đường dẫn này là chính xác và các tệp tồn tại cục bộ!
const urlsToCache = [
  './',                 // Cache index.html (ứng dụng chính)
  './index.html',
  './manifest.json',   // manifest riêng cho sukien
  './style.css',       // file CSS chính
  './script.js',       // file JavaScript chính

  // Icons (đảm bảo các tệp này tồn tại trong thư mục gốc)
  './icon-192.png',
  './icon-512.png',
  './icon-192-any.png', // Icon mới cho purpose "any"
  './icon-48.png',      // Icon cho file handlers
  './icon-96.png',      // Icon cho shortcuts
  
  // Apple Touch Icons (đảm bảo các tệp này tồn tại trong thư mục /icons/)
  './icons/icon-180.png',
  './icons/icon-152.png',
  './icons/icon-120.png',

  // Images (đảm bảo các tệp này tồn tại trong thư mục /images/)
  './images/logo.png',
  './images/screenshot1.png',
  './images/screenshot2.png',
  './images/screenshot3.png', // Ảnh chụp màn hình bổ sung
  // './images/widget-screenshot-calendar.png', // Đã loại bỏ nếu không triển khai widgets

  // Thư viện JavaScript và CSS được tải cục bộ (Đảm bảo các tệp này tồn tại trong /lib/)
  './lib/tailwindcss.min.css',
  './lib/chart.min.js',
  './lib/xlsx.full.min.js',
  './lib/html2canvas.min.js',
  './lib/Sortable.min.js',

  // Fonts được tải cục bộ (Đảm bảo các tệp này tồn tại trong /lib/fonts/)
  './lib/fonts/Inter-Regular.woff2',
  './lib/fonts/Inter-Medium.woff2', // Chỉ thêm nếu bạn sử dụng trọng lượng này
  './lib/fonts/Inter-SemiBold.woff2', // Chỉ thêm nếu bạn sử dụng trọng lượng này
  './lib/fonts/Inter-Bold.woff2'     // Chỉ thêm nếu bạn sử dụng trọng lượng này

  // './widgets/calendar.html' // Đã loại bỏ nếu không triển khai widgets
];

// Sự kiện 'install': cache tài nguyên
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Service Worker (sukien): Đang cài đặt và cache...');
      return cache.addAll(urlsToCache).catch(error => {
        console.error('Lỗi khi cache tài nguyên:', error);
        // Có thể log lỗi cụ thể để biết tệp nào bị lỗi
        // Hoặc đưa ra cảnh báo cho người dùng rằng ứng dụng có thể không hoạt động ngoại tuyến hoàn toàn
      });
    })
  );
});

// Sự kiện 'fetch': ưu tiên lấy từ cache trước
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return; // Chỉ cache các yêu cầu GET

  // Bỏ qua các yêu cầu có scheme không phải http(s) (ví dụ: chrome-extension://)
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        // console.log('Phục vụ từ cache:', event.request.url); // Có thể gây nhiều log
        return response;
      }

      return fetch(event.request).then(networkResponse => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          // console.log('Không cache response này:', event.request.url, networkResponse); // Có thể gây nhiều log
          return networkResponse;
        }

        // Clone response vì nó là stream và chỉ có thể được đọc một lần
        const responseToCache = networkResponse.clone();
        
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
          // console.log('Đã cache response từ network:', event.request.url); // Có thể gây nhiều log
        }).catch(err => {
            console.warn('Không thể cache response (put):', event.request.url, err);
        });

        return networkResponse;
      }).catch(err => {
        // Xử lý khi không có trong cache VÀ không thể lấy từ network
        console.warn('Không thể lấy được và không có trong cache:', event.request.url, err);
        // Đây là nơi bạn có thể trả về một trang offline tùy chỉnh nếu muốn
        // Ví dụ: return caches.match('/offline.html');
      });
    })
  );
});

// Sự kiện 'activate': xóa cache cũ nếu cần và kiểm soát client
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
  // Đảm bảo Service Worker kiểm soát ngay lập tức các client đang mở
  event.waitUntil(self.clients.claim());
});

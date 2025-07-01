// Tên của bộ nhớ cache — phiên bản dành riêng cho sự kiện
const CACHE_NAME = 'mstq-sukien-pwa-v2'; [cite_start]// Đã tăng phiên bản để kích hoạt cập nhật Service Worker [cite: 63]

// Danh sách các tệp cần cache để app sự kiện hoạt động offline
// Đảm bảo tất cả các đường dẫn này là chính xác và các tệp tồn tại cục bộ!
const urlsToCache = [
  [cite_start]'./',                 // Cache index.html (ứng dụng chính) [cite: 64]
  [cite_start]'./index.html', [cite: 64]
  [cite_start]'./manifest.json',   // manifest riêng cho sukien [cite: 64]
  [cite_start]'./style.css',       // nếu có file CSS riêng [cite: 64]
  [cite_start]'./script.js',       // nếu có JavaScript riêng [cite: 64]
  [cite_start]'./images/logo.png', // nếu có logo [cite: 64]
  [cite_start]'./icon-192.png',    // Icon chính [cite: 28]
  [cite_start]'./icon-512.png',    // Icon kích thước lớn [cite: 28]
  './icon-192-any.png', // Icon mới cho mục đích 'any' (nếu bạn tạo)
  './icon-48.png',     // Icon cho file handlers (nếu bạn tạo)
  [cite_start]'./images/screenshot1.png', // Ảnh chụp màn hình [cite: 29]
  [cite_start]'./images/screenshot2.png', // Ảnh chụp màn hình [cite: 30]
  './images/screenshot3.png', // Ảnh chụp màn hình bổ sung (nếu bạn tạo)

  // Cập nhật các đường dẫn này để trỏ đến các tệp cục bộ sau khi bạn đã tải xuống
  './lib/tailwindcss.min.css', 
  './lib/chart.min.js',        
  './lib/xlsx.full.min.js',    
  './lib/html2canvas.min.js',  
  './lib/Sortable.min.js',     

  // Giữ lại các URL của Google Fonts nếu chúng vẫn được cho phép bởi CSP/CORS
  [cite_start]'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', [cite: 64]
  'https://fonts.gstatic.com/s/inter/v12/...' // (Thêm các URL font cụ thể từ CSS nếu có, hoặc nếu bạn tự host font)
];

// Sự kiện 'install': cache tài nguyên
[cite_start]self.addEventListener('install', event => { [cite: 65]
  event.waitUntil(
    [cite_start]caches.open(CACHE_NAME).then(cache => { [cite: 65]
      [cite_start]console.log('Service Worker (sukien): Đang cài đặt và cache...'); [cite: 65]
      [cite_start]return cache.addAll(urlsToCache).catch(error => { // Thêm .catch để bắt lỗi cache [cite: 65]
        console.error('Lỗi khi cache tài nguyên:', error);
      });
    })
  );
});

// Sự kiện 'fetch': ưu tiên lấy từ cache trước
[cite_start]self.addEventListener('fetch', event => { [cite: 66]
  if (event.request.method !== 'GET') return; [cite_start]// Chỉ cache các yêu cầu GET [cite: 66]

  // Bỏ qua các yêu cầu có scheme không phải http(s) (ví dụ: chrome-extension://)
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    [cite_start]caches.match(event.request).then(response => { [cite: 66]
      if (response) {
        console.log('Phục vụ từ cache:', event.request.url);
        [cite_start]return response; [cite: 66]
      }

      [cite_start]return fetch(event.request).then(networkResponse => { [cite: 66]
        [cite_start]if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') { [cite: 66]
          console.log('Không cache response này:', event.request.url, networkResponse);
          return networkResponse;
        }

        [cite_start]// Clone response vì nó là stream và chỉ có thể được đọc một lần [cite: 67]
        [cite_start]const responseToCache = networkResponse.clone(); [cite: 67]
        
        [cite_start]caches.open(CACHE_NAME).then(cache => { [cite: 67]
          [cite_start]cache.put(event.request, responseToCache); [cite: 67]
          console.log('Đã cache response từ network:', event.request.url);
        }).catch(err => {
            console.warn('Không thể cache response:', event.request.url, err);
        });

        [cite_start]return networkResponse; [cite: 67]
      }).catch(err => {
        // Xử lý khi không có trong cache VÀ không thể lấy từ network
        [cite_start]console.warn('Không thể lấy được và không có trong cache:', event.request.url, err); [cite: 67]
        // Có thể trả về một trang offline tùy chỉnh ở đây nếu cần
        // Ví dụ: return caches.match('/offline.html');
      });
    })
  );
});

// Sự kiện 'activate': xóa cache cũ nếu cần
[cite_start]self.addEventListener('activate', event => { [cite: 68]
  [cite_start]const cacheWhitelist = [CACHE_NAME]; [cite: 68]
  event.waitUntil(
    [cite_start]caches.keys().then(cacheNames => { [cite: 68]
      return Promise.all(
        [cite_start]cacheNames.map(cacheName => { [cite: 69]
          [cite_start]if (!cacheWhitelist.includes(cacheName)) { [cite: 69]
            [cite_start]console.log('Service Worker (sukien): Đang xoá cache cũ:', cacheName); [cite: 69]
            [cite_start]return caches.delete(cacheName); [cite: 69]
          }
        })
      );
    })
  );
  // Đảm bảo Service Worker kiểm soát ngay lập tức các client đang mở
  event.waitUntil(self.clients.claim());
});

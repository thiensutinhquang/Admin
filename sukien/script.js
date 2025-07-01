// script.js - Logic chính của ứng dụng
document.addEventListener('DOMContentLoaded', () => {
    console.log('Sự kiện: DOM đã sẵn sàng.');

    // --- Logic demo hiện có (từ script.js.txt bạn cung cấp) ---
    const btn = document.getElementById('btn-demo');
    if (btn) {
        btn.addEventListener('click', () => {
            alert('Bạn vừa nhấn vào nút demo!');
        });
    }

    // --- Logic xử lý cho File Handlers ---
    // Điều này sẽ được kích hoạt khi ứng dụng được mở thông qua một tệp
    if ('launchQueue' in window && 'files' in LaunchParams.prototype) {
        window.launchQueue.setConsumer(async launchParams => {
            if (!launchParams.files.length) {
                console.log('Không có tệp nào được mở.');
                return;
            }

            for (const fileHandle of launchParams.files) {
                try {
                    const file = await fileHandle.getFile();
                    const fileName = file.name;
                    const fileType = file.type;

                    console.log(`Đang xử lý tệp: ${fileName} (${fileType})`);

                    // Ví dụ: Đọc nội dung tệp CSV hoặc JSON
                    if (fileType === 'text/csv' || fileType === 'application/json') {
                        const text = await file.text();
                        console.log('Nội dung tệp:', text);
                        // Ở đây bạn sẽ thêm logic thực tế để phân tích và hiển thị dữ liệu
                        // Ví dụ: parse CSV/JSON và cập nhật giao diện người dùng
                        alert(`Đã mở tệp: ${fileName}\nLoại: ${fileType}\nKiểm tra console để xem nội dung.`);
                    } else {
                        alert(`Tệp không được hỗ trợ: ${fileName} (${fileType})`);
                    }

                } catch (error) {
                    console.error('Lỗi khi xử lý tệp:', error);
                    alert('Lỗi khi mở tệp. Vui lòng thử lại.');
                }
            }
        });
        console.log('File Handler Consumer đã được thiết lập.');
    } else {
        console.warn('API File Handling không được hỗ trợ hoặc không khả dụng.');
    }

    // --- Logic xử lý cho Protocol Handlers ---
    // Điều này sẽ được kích hoạt khi ứng dụng được mở thông qua một URL tùy chỉnh (ví dụ: web+sukien://...)
    // Trong Manifest, chúng ta đã định nghĩa "url": "/handle-protocol?url=%s"
    const handleProtocol = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const customUrl = urlParams.get('url');

        if (customUrl) {
            console.log('Đã nhận URL từ protocol handler:', customUrl);
            // Ở đây bạn sẽ thêm logic thực tế dựa trên URL nhận được
            // Ví dụ: Chuyển hướng người dùng đến một phần cụ thể của ứng dụng
            alert(`Đã kích hoạt ứng dụng qua giao thức tùy chỉnh với URL: ${customUrl}`);
            // Xóa tham số khỏi URL để tránh xử lý lại khi tải lại trang
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete('url');
            window.history.replaceState({}, document.title, newUrl.toString());
        }
    };

    // Gọi hàm xử lý protocol ngay khi DOMContentLoaded, vì URL có thể chứa tham số protocol
    handleProtocol();
    console.log('Protocol Handler logic đã được khởi tạo.');

    // --- Đăng ký Service Worker (Mã này nằm trong index.html, nhưng nhắc lại cho ngữ cảnh) ---
    // if ('serviceWorker' in navigator) {
    //     window.addEventListener('load', () => {
    //         navigator.serviceWorker.register('./sw.js')
    //             .then(reg => console.log('✅ Service Worker đã đăng ký:', reg.scope))
    //             .catch(err => console.error('❌ Lỗi khi đăng ký Service Worker:', err));
    //     });
    // }

    console.log('script.js đã tải và chạy.');
});

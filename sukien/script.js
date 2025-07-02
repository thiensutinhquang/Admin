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

                    // Ví dụ: Đọc nội dung tệp CSV, JSON hoặc XLSX
                    if (fileType === 'text/csv' || fileType === 'application/json' || fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const content = e.target.result;
                            console.log('Nội dung tệp:', content);
                            alert(`Đã mở tệp: ${fileName}\nLoại: ${fileType}\nKiểm tra console để xem nội dung.`);
                            // **TODO: Thêm logic thực tế để phân tích và hiển thị dữ liệu từ tệp**
                            // Ví dụ: if (fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') { /* Xử lý XLSX */ }
                        };
                        // Đọc tệp dưới dạng văn bản (đối với CSV/JSON) hoặc binary (đối với XLSX)
                        if (fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                             reader.readAsArrayBuffer(file); // XLSX cần ArrayBuffer
                        } else {
                             reader.readAsText(file); // CSV/JSON đọc dạng text
                        }
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
    const handleProtocol = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const customUrl = urlParams.get('url');

        if (customUrl) {
            console.log('Đã nhận URL từ protocol handler:', customUrl);
            alert(`Đã kích hoạt ứng dụng qua giao thức tùy chỉnh với URL: ${customUrl}`);
            // **TODO: Thêm logic thực tế dựa trên URL nhận được**
            // Ví dụ: Chuyển hướng người dùng đến một phần cụ thể của ứng dụng
            // Xóa tham số khỏi URL để tránh xử lý lại khi tải lại trang
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete('url');
            window.history.replaceState({}, document.title, newUrl.toString());
        }
    };
    handleProtocol();
    console.log('Protocol Handler logic đã được khởi tạo.');

    // --- Logic xử lý cho Shortcuts (Phím tắt) ---
    const handleShortcuts = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const action = urlParams.get('action');

        if (action) {
            console.log('Đã nhận hành động từ phím tắt:', action);
            alert(`Đã kích hoạt hành động phím tắt: ${action}`);
            // **TODO: Thêm logic thực tế để thực hiện hành động tương ứng với phím tắt**
            switch (action) {
                case 'new-event':
                    console.log('Mở form tạo sự kiện mới...');
                    // Ví dụ: showNewEventForm();
                    break;
                case 'view-report':
                    console.log('Điều hướng đến phần báo cáo...');
                    // Ví dụ: navigateToReportPage();
                    break;
                default:
                    console.log('Hành động phím tắt không xác định.');
            }
            // Xóa tham số khỏi URL để tránh xử lý lại khi tải lại trang
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete('action');
            window.history.replaceState({}, document.title, newUrl.toString());
        }
    };
    handleShortcuts();
    console.log('Shortcuts logic đã được khởi tạo.');

    // --- Ghi chú về Widgets ---
    // Logic cho Widgets được xử lý trong các tệp HTML/JS riêng của widget (ví dụ: ./widgets/calendar.html),
    // và không nằm trực tiếp trong script.js này.
    console.log('Logic cho Widgets được xử lý trong các tệp HTML/JS riêng của widget (nếu triển khai).');

    console.log('script.js đã tải và chạy.');
});

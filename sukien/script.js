// script.js - Logic chính của ứng dụng
document.addEventListener('DOMContentLoaded', () => {
    console.log('Sự kiện: DOM đã sẵn sàng.');

    // --- Logic demo hiện có ---
    const btn = document.getElementById('btn-demo');
    if (btn) {
        btn.addEventListener('click', () => {
            alert('Bạn vừa nhấn vào nút demo!');
        });
    }

    // --- Logic xử lý cho File Handlers ---
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

                    if (fileType === 'text/csv' || fileType === 'application/json' || fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                        // Logic thực tế để đọc và xử lý tệp CSV/JSON/XLSX
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const content = e.target.result;
                            console.log('Nội dung tệp:', content);
                            alert(`Đã mở tệp: ${fileName}\nLoại: ${fileType}\nKiểm tra console để xem nội dung.`);
                            // Ở đây bạn sẽ thêm logic để phân tích và hiển thị dữ liệu
                            // Ví dụ: Nếu là XLSX, sử dụng thư viện XLSX.js để đọc
                            if (fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                                // Assume XLSX library is loaded via ./lib/xlsx.full.min.js
                                // const workbook = XLSX.read(content, { type: 'binary' });
                                // console.log('Workbook:', workbook);
                                // alert('File XLSX đã được đọc. Kiểm tra console.');
                            }
                        };
                        reader.readAsBinaryString(file); // Đối với XLSX, đọc dưới dạng binary string
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
    const handleProtocol = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const customUrl = urlParams.get('url');

        if (customUrl) {
            console.log('Đã nhận URL từ protocol handler:', customUrl);
            alert(`Đã kích hoạt ứng dụng qua giao thức tùy chỉnh với URL: ${customUrl}`);
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
            // Thực hiện hành động tương ứng:
            switch (action) {
                case 'new-event':
                    // Logic để mở form tạo sự kiện mới
                    console.log('Mở form tạo sự kiện mới...');
                    break;
                case 'view-report':
                    // Logic để điều hướng đến phần báo cáo
                    console.log('Điều hướng đến phần báo cáo...');
                    break;
                // Thêm các case khác cho các phím tắt khác
                default:
                    console.log('Hành động phím tắt không xác định.');
            }
            // Xóa tham số khỏi URL
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete('action');
            window.history.replaceState({}, document.title, newUrl.toString());
        }
    };
    handleShortcuts();
    console.log('Shortcuts logic đã được khởi tạo.');


    // --- Logic xử lý cho Widgets (Nếu bạn triển khai phần này) ---
    // Logic của widget sẽ nằm trong tệp HTML riêng của widget (ví dụ: widgets/calendar.html)
    // và không nằm trực tiếp trong script.js này.
    console.log('Logic cho Widgets được xử lý trong các tệp HTML/JS riêng của widget.');


    console.log('script.js đã tải và chạy.');
});

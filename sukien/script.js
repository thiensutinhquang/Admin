// script.js - Mẫu đơn giản
document.addEventListener('DOMContentLoaded', () => {
  console.log('Sự kiện: DOM đã sẵn sàng.');

  const btn = document.getElementById('btn-demo');
  if (btn) {
    btn.addEventListener('click', () => {
      alert('Bạn vừa nhấn vào nút demo!');
    });
  }
});

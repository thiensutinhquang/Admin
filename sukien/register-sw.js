if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('✅ Service Worker đã đăng ký:', reg.scope))
      .catch(err => console.error('❌ Lỗi khi đăng ký Service Worker:', err));
  });
}

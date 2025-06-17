self.addEventListener('install', event => {
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  clients.claim();
});
// يمكن إضافة كاش مخصص لاحقًا

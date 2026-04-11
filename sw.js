const CACHE_NAME = 'mydashboard-v1';
const ASSETS = [
  '/my-dashboard/',
  '/my-dashboard/index.html',
  '/my-dashboard/manifest.json',
  '/my-dashboard/icon-192.png',
  '/my-dashboard/icon-512.png',
];

// インストール時にキャッシュ
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// 古いキャッシュを削除
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// フェッチ：キャッシュ優先、なければネットワーク
self.addEventListener('fetch', e => {
  // Google APIへのリクエストはキャッシュしない
  if (e.request.url.includes('googleapis.com') ||
      e.request.url.includes('googleusercontent.com') ||
      e.request.url.includes('accounts.google.com')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

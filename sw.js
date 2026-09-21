const CACHE_NAME = 'household-budget-v6';
const ASSETS = [
'./',
'./index.html',
'./manifest.json',
'./icon-192.png',
'./icon-512.png'
];

self.addEventListener('install', function (event) {
event.waitUntil(
caches.open(CACHE_NAME).then(function (cache) { return cache.addAll(ASSETS); })
);
self.skipWaiting();
});

self.addEventListener('activate', function (event) {
event.waitUntil(
caches.keys().then(function (keys) {
return Promise.all(keys.filter(function (k) { return k !== CACHE_NAME; }).map(function (k) { return caches.delete(k); }));
})
);
self.clients.claim();
});

// Cache-first for the static shell; network requests to Firebase/Fonts pass through normally.
self.addEventListener('fetch', function (event) {
if (event.request.method !== 'GET') return;
const url = new URL(event.request.url);
if (url.origin !== self.location.origin) return;
event.respondWith(
caches.match(event.request).then(function (cached) {
return cached || fetch(event.request);
})
);
});

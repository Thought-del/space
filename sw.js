const CACHE_NAME = 'space-tourism-v2';
const urlsToCache = [
    '/',
    '/index.html',
    '/404.html',
    '/css/dist/output.css',
    '/js/main.js',
    '/js/moduls/constantins.js',
    '/js/moduls/menu.js',
    '/js/moduls/renderContent.js',
    '/js/moduls/sliders.js',
    '/js/moduls/translate.js',
    '/js/moduls/planet-3d.js',
    '/js/moduls/utils.js',
    '/data/en-data.json',
    '/data/ru-data.json',
    '/data/locales/en.json',
    '/data/locales/ru.json',
    '/assets/shared/logo.svg',
    '/assets/icons/favicon-32x32.png'
];

self.addEventListener('install', event => {
    event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    if (url.origin !== location.origin) return;
    
    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;
            return fetch(event.request).then(response => {
                const clone = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                return response;
            });
        }).catch(() => {
            if (event.request.mode === 'navigate') return caches.match('/404.html');
            return new Response('Offline', { status: 404 });
        })
    );
});
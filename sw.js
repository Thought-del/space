const BASE_PATH = '/space';
const CACHE_NAME = 'space-tourism-v3';
const urlsToCache = [
    `${BASE_PATH}/`,
    `${BASE_PATH}/index.html`,
    `${BASE_PATH}/404.html`,
    `${BASE_PATH}/css/dist/output.css`,
    `${BASE_PATH}/js/main.js`,
    `${BASE_PATH}/js/moduls/constantins.js`,
    `${BASE_PATH}/js/moduls/menu.js`,
    `${BASE_PATH}/js/moduls/renderContent.js`,
    `${BASE_PATH}/js/moduls/sliders.js`,
    `${BASE_PATH}/js/moduls/translate.js`,
    `${BASE_PATH}/js/moduls/planet-3d.js`,
    `${BASE_PATH}/js/moduls/utils.js`,
    `${BASE_PATH}/data/en-data.json`,
    `${BASE_PATH}/data/ru-data.json`,
    `${BASE_PATH}/data/locales/en.json`,
    `${BASE_PATH}/data/locales/ru.json`,
    `${BASE_PATH}/assets/shared/logo.svg`,
    `${BASE_PATH}/assets/icons/favicon-32x32.png`
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    if (url.origin !== location.origin) return;
    
    event.respondWith(
        fetch(event.request).then(response => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, clone);
            });
            return response;
        }).catch(() => {
            return caches.match(event.request).then(cached => {
                if (cached) return cached;
                if (event.request.mode === 'navigate') return caches.match(`${BASE_PATH}/404.html`);
                return new Response('Offline', { status: 404 });
            });
        })
    );
});

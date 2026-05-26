import { IS_DEV, BASE_PATH } from "./moduls/constantins.js";
import { initMenu } from "./moduls/menu.js";
import { initRenderPages, renderPage, reloadDataForLanguage } from "./moduls/renderContent.js";
import { initI18n, switchLanguage, getCurrentLang } from "./moduls/translate.js";

if (IS_DEV) {
    window.__APP__ = { version: '1.0.0', modules: {} };
}

function initListener() {
    initMenu();
}

async function initRender() {
    await initRenderPages(getCurrentLang());
}

function showUpdateNotification() {
    const div = document.createElement('div');
    div.className = 'fixed bottom-4 left-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50 animate-fade-in';
    div.innerHTML = `
        <div class="flex justify-between items-center">
            <span>🚀 Доступна новая версия!</span>
            <button id="update-btn" class="bg-white text-blue-500 px-3 py-1 rounded ml-4 font-bold">Обновить</button>
        </div>
    `;
    document.body.appendChild(div);
    document.getElementById('update-btn').addEventListener('click', () => {
        window.location.reload();
    });
}

function registerServiceWorker() {
    if ('serviceWorker' in navigator && !IS_DEV) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register(`${BASE_PATH}/sw.js`)
                .then(reg => {
                    console.log('SW registered:', reg.scope);
                    reg.onupdatefound = () => {
                        const installingWorker = reg.installing;
                        if (installingWorker) {
                            installingWorker.onstatechange = () => {
                                if (installingWorker.state === 'installed') {
                                    if (navigator.serviceWorker.controller) {
                                        showUpdateNotification();
                                    }
                                }
                            };
                        }
                    };
                })
                .catch(err => console.error('SW error:', err));
        });
    }
}

async function init() {
    await initI18n();
    initListener();
    await initRender();
    registerServiceWorker();

    document.querySelectorAll('[data-lang]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const newLang = btn.dataset.lang;
            if (!newLang) return;
            await switchLanguage(newLang);
            await reloadDataForLanguage(newLang);
            let currentPage = document.querySelector('.header-nav[aria-current="page"], .menu-nav[aria-current="page"]')?.dataset.page;
            if (!currentPage) currentPage = localStorage.getItem('currentPage') || 'home';
            await renderPage(currentPage);
        });
    });
}

document.addEventListener('DOMContentLoaded', init);

if (IS_DEV) {
    window.__APP__.reinit = { menu: initMenu, render: initRenderPages };
}

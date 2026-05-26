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

function registerServiceWorker() {
    if ('serviceWorker' in navigator && !IS_DEV) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register(`${BASE_PATH}/sw.js`)
                .then(reg => console.log('SW registered:', reg.scope))
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
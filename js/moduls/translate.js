let currentLang = 'en';
let translations = {};
const supportedLangs = ['en', 'ru'];

async function loadTranslations(lang) {
    const response = await fetch(`/data/locales/${lang}.json`);
    translations = await response.json();
    currentLang = lang;
    document.documentElement.lang = lang;
}

export function translatePage(root = document) {
    root.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (translations[key]) el.textContent = translations[key];
    });
    root.querySelectorAll('[data-i18n-aria]').forEach(el => {
        const key = el.dataset.i18nAria;
        if (translations[key]) el.setAttribute('aria-label', translations[key]);
    });
}

function detectBrowserLanguage() {
    const browserLang = navigator.language.split('-')[0];
    return supportedLangs.includes(browserLang) ? browserLang : 'en';
}

export async function initI18n() {
    const saved = localStorage.getItem('lang');
    const lang = saved || detectBrowserLanguage();
    await loadTranslations(lang);
    translatePage(document);
}

export async function switchLanguage(lang) {
    if (!supportedLangs.includes(lang)) return;
    localStorage.setItem('lang', lang);
    await loadTranslations(lang);
    translatePage();
}

export function getCurrentLang() {
    return currentLang;
}

export function t(key) {
    return translations[key] || key;
}
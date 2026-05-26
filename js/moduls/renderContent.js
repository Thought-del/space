import { IS_DEV, SELECTORS, BASE_PATH } from "./constantins.js";
import { initPlanet, updatePlanetTexture, destroyPlanet } from "./planet-3d.js";
import { initDestinationSlider, initCrewSlider, initTechnologySlider } from "./sliders.js";
import { t, translatePage } from './translate.js';
import { showError } from './utils.js';

let currentData = {};
let container, pageBtns;

const imageMap = {
    'Луна': 'moon', 'Марс': 'mars', 'Европа': 'europa', 'Титан': 'titan',
    'Дуглас Хёрли': 'douglas-hurley', 'Марк Шаттлворт': 'mark-shuttleworth',
    'Виктор Гловер': 'victor-glover', 'Ануше Ансари': 'anousheh-ansari',
    'Ракета-носитель': 'launch-vehicle', 'Космодром': 'spaceport', 'Капсула': 'space-capsule'
};

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function getImageFileName(name, type) {
    const englishName = imageMap[name] || name.toLowerCase().replace(/\s/g, '-');
    const base = `${BASE_PATH}/assets`;
    if (type === 'crew') return `${base}/crew/image-${englishName}.webp`;
    if (type === 'technology-landscape') return `${base}/technology/image-${englishName}-landscape.jpg`;
    if (type === 'technology-portrait') return `${base}/technology/image-${englishName}-portrait.jpg`;
    if (type === 'destination' && (englishName === 'europa' || englishName === 'titan')) 
        return `${base}/destination/image-${englishName}.webp`;
    return `${base}/destination/image-${englishName}.webp`;
}

function updateActiveNavButtons(pageName) {
    document.querySelectorAll('.header-nav, .menu-nav').forEach(btn => {
        btn.setAttribute('aria-current', btn.dataset.page === pageName ? 'page' : 'false');
    });
}

async function loadData(lang = 'en') {
    try {
        const res = await fetch(`${BASE_PATH}/data/${lang}-data.json`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        currentData = await res.json();
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        showError(t('error_loading_data'));
        if (lang !== 'en') {
            const fallback = await fetch(`${BASE_PATH}/data/en-data.json`);
            currentData = await fallback.json();
        }
    }
}

function setBackground(mobile, tablet, desktop) {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    const url = isMobile ? mobile : isTablet ? tablet : desktop;
    document.body.style.backgroundImage = `url('${url}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.offsetHeight;
}

function renderPageContent(html, pageName) {
    container.innerHTML = html;
    translatePage(container);
    updateActiveNavButtons(pageName);
}

export async function renderPage(pageName) {
    let data = null;
    
    if (pageName !== 'home') {
        if (!currentData || !Object.keys(currentData).length) return;
        data = currentData[pageName];
        if (!data) return;
    }

    if (pageName === 'home') {
        setBackground(
            `${BASE_PATH}/assets/home/background-home-mobile.jpg`,
            `${BASE_PATH}/assets/home/background-home-tablet.jpg`,
            `${BASE_PATH}/assets/home/background-home-desktop.jpg`
        );

        renderPageContent(`
            <h1 class="sr-only">${t('page_title')}</h1>
            <section id="home-section" class="flex flex-col gap-[clamp(2rem,15vh,12rem)] lg:flex-row lg:gap-0 lg:px-[clamp(1.5rem,4vw,5rem)] 2xl:px-0 lg:justify-between" aria-labelledby="home-title">
                <div class="text-center px-[clamp(0.5rem,4vw,7.5rem)] lg:text-left lg:max-w-140 lg:px-0 2xl:max-w-200 lg:py-12">
                    <span class="uppercase text-[clamp(1rem,1.25vw,1.25rem)] font-normal tracking-widest text-gray-400 inline-block mb-[clamp(0.5rem,1vw,0.75rem)]">${t('hero_subtitle')}</span>
                    <h2 class="uppercase text-[clamp(4rem,5vw,8rem)] font-normal tracking-wider text-white mb-[clamp(0.25rem,1.5vw,1.5rem)]" id="home-title">${t('hero_title')}</h2>
                    <p class="text-gray-400 text-[clamp(1rem,2vw,1.5rem)]">${t('hero_description')}</p>
                </div>
                <div class="text-center bg-white mb-8 md:mb-0 rounded-[50%] flex items-center justify-center w-[clamp(10rem,50vw,18rem)] h-[clamp(10rem,50vw,18rem)] mx-auto lg:mt-[clamp(4rem,4vw,7.5rem)] lg:mx-0">
                    <span class="uppercase text-xl font-normal tracking-[0.15em] inline-block md:text-3xl 3xl:text-4xl">${t('hero_explore')}</span>
                </div>
            </section>
        `, 'home');
        return;
    }

    const is3D = !REDUCED_MOTION && pageName === 'destinations';

    if (pageName === 'destinations') {
        setBackground(
            `${BASE_PATH}/assets/destination/background-destination-mobile.jpg`,
            `${BASE_PATH}/assets/destination/background-destination-tablet.jpg`,
            `${BASE_PATH}/assets/destination/background-destination-desktop.jpg`
        );
        
        renderPageContent(`
            <h1 class="sr-only">${t('page_title')}</h1>
            <section class="md:flex flex-col md:gap-12 lg:flex-row" aria-labelledby="destination-title" aria-live="polite" aria-atomic="true">
                <div class="text-center -mt-6 lg:flex-[1.5] md:text-left lg:max-w-[60%]" data-destination-header>
                    <span class="inline-block text-gray-700 uppercase tracking-widest mr-2 md:ml-6 lg:text-xl lg:ml-28">01</span>
                    <p class="inline-block text-white uppercase tracking-widest lg:text-xl">${t('destination_pick')}</p>
                    <div id="planet-container" class="w-64 h-64 mx-auto mt-4 md:w-80 md:h-80 lg:w-116 lg:h-116 ${!is3D ? 'hidden' : ''}">
                        <div id="planet-loader" class="absolute inset-0 flex items-center justify-center"><div class="loader"></div></div>
                    </div>
                    <div id="destination-3d-model" class="w-52 h-52 mt-4 mx-auto md:mt-6 lg:mt-12 md:w-72 md:h-72 lg:w-100 lg:h-100 ${is3D ? 'hidden' : ''}">
                        <img src="" width="400" height="400" class="w-full h-full object-contain mx-auto planet-3d-effect" decoding="async" loading="lazy" alt="">
                    </div>
                </div>
                <div class="px-6 pb-6 lg:flex-1 lg:max-w-[40%]">
                    <ul class="flex justify-center gap-8 mb-8 lg:justify-start">
                        ${data.map((item, idx) => `<li><button type="button" class="destination-nav" data-destination-nav="${item.name}" aria-current="${idx === 0}">${item.name}</button></li>`).join('')}
                    </ul>
                    <div class="overflow-hidden w-full">
                        <div class="flex" data-destination-slider-track>
                            ${data.map(item => `<div class="destination-slide w-full shrink-0" data-destination-slide="${item.name}">
                                <div><h2 class="destination-planet-title">${item.name}</h2><p class="destination-desc">${item.description}</p></div>
                                <div class="destination-info-container">
                                    <div><span class="destination-note">${t('destination_distance')}</span><p class="destination-info">${item.distance}</p></div>
                                    <div><span class="destination-note">${t('destination_travel')}</span><p class="destination-info">${item.travel}</p></div>
                                </div>
                            </div>`).join('')}
                        </div>
                    </div>
                </div>
            </section>
        `, 'destinations');

        setTimeout(() => {
            if (is3D) initPlanet('planet-container', `${BASE_PATH}/assets/destination/8k_moon.jpg`);
            initDestinationSlider(data, is3D);
        }, 100);
        return;
    }

    if (pageName === 'crew') {
        setBackground(
            `${BASE_PATH}/assets/crew/background-crew-mobile.jpg`,
            `${BASE_PATH}/assets/crew/background-crew-tablet.jpg`,
            `${BASE_PATH}/assets/crew/background-crew-desktop.jpg`
        );
        
        renderPageContent(`
            <h1 class="sr-only">${t('page_title')}</h1>
            <section aria-labelledby="crew-title" aria-live="polite" aria-atomic="true">
                <div class="text-center mb-12 md:text-left md:ml-8 lg:ml-20">
                    <span class="inline-block text-gray-700 uppercase tracking-widest mr-2 lg:text-xl">02</span>
                    <p class="inline-block text-white uppercase tracking-widest lg:text-xl">${t('crew_meet')}</p>
                </div>
                <div class="flex flex-col-reverse lg:flex-row md:flex-col">
                    <div class="text-center lg:text-left flex flex-col-reverse md:flex-col lg:max-w-[50%] lg:justify-center lg:gap-20 lg:pl-20">
                        <div class="overflow-hidden h-80 md:h-50 lg:h-auto">
                            <div class="flex flex-row" data-crew-slider-track>
                                ${data.map(m => `<div class="crew-slide w-full shrink-0" data-crew-slide="${m.name}">
                                    <span class="crew-role">${m.role}</span>
                                    <h2 class="crew-star-title">${m.name}</h2>
                                    <p class="crew-desc">${m.bio}</p>
                                </div>`).join('')}
                            </div>
                        </div>
                        <ul class="flex mx-auto mb-4 gap-4 lg:mx-0 lg:mb-0" data-crew-navs>
                            ${data.map((m, i) => `<li><button type="button" class="crew-nav" data-crew-nav="${m.name}" aria-current="${i === 0}"></button></li>`).join('')}
                        </ul>
                    </div>
                    <div class="lg:flex-1 lg:flex lg:items-end lg:justify-center">
                        <img src="${getImageFileName(data[0].name, 'crew')}" width="400" height="500" class="mx-auto mt-6 mb-4 h-80 md:h-1/2 w-auto md:mb-0 lg:h-full lg:mt-auto" data-crew-img alt="${data[0].name}">
                    </div>
                </div>
            </section>
        `, 'crew');
        
        setTimeout(() => {
            initCrewSlider(data);
        }, 100);
        
        return;
    }

    if (pageName === 'technology') {
            setBackground(`${BASE_PATH}/assets/technology/background-technology-mobile.jpg`, `${BASE_PATH}/assets/technology/background-technology-tablet.jpg`, `${BASE_PATH}/assets/technology/background-technology-desktop.jpg`);
            renderPageContent(`
                <h1 class="sr-only">${t('page_title')}</h1>
                <section aria-labelledby="technology-title" aria-live="polite" aria-atomic="true">
                    <div class="text-center -mt-8 md:text-left md:mt-16 lg:mt-0"><span class="inline-block text-gray-700 uppercase tracking-widest mr-2 md:ml-8 lg:text-xl">03</span><p class="inline-block text-white uppercase tracking-widest lg:text-xl">${t('technology_launch')}</p>
                    <div class="mt-6 md:flex flex-col 1_5xl:flex-row-reverse gap-10">
                        <picture class="lg:w-[30%] lg:mx-auto 1_5xl:mx-0 shrink-0" data-tech-img><source srcset="${getImageFileName(data[0].name, 'technology-portrait')}" media="(min-width: 1024px)"><img src="${getImageFileName(data[0].name, 'technology-landscape')}" width="400" height="300" class="w-full h-auto mb-4" alt="${data[0].name}"></picture>
                        <div class="flex flex-col lg:w-70% md:px-8 md:flex-row md:items-center md:gap-8">
                            <ul class="flex gap-6 mx-auto mb-6 md:flex-col" data-tech-navs>${data.map((_, i) => `<li><button type="button" class="tech-nav" data-tech-nav="${data[i].name}" aria-current="${i === 0}">${i + 1}</button></li>`).join('')}</ul>
                            <div class="overflow-hidden"><div class="flex" data-tech-slider-track>${data.map(item => `<div class="tech-slide" data-tech-slide="${item.name}"><span class="uppercase text-white/70 mb-1">${t('technology_subtitle')}</span><h2 class="tech-rockets-title">${item.name}</h2><p class="tech-desc">${item.description}</p></div>`).join('')}</div></div>
                        </div>
                    </div>
                </section>
            `, 'technology');
            setTimeout(() => initTechnologySlider(data), 100);
    }
}

export async function initRenderPages(currentLang = 'en') {
    container = SELECTORS.renderContainer;
    pageBtns = SELECTORS.pageBtns;
    if (!container || !pageBtns?.length) return;
    
    pageBtns.forEach(link => {
        link.addEventListener('click', (e) => {
            const page = e.currentTarget.dataset.page;
            if (!page) return;
            pageBtns.forEach(btn => btn.setAttribute('aria-current', 'false'));
            e.currentTarget.setAttribute('aria-current', 'page');
            localStorage.setItem('currentPage', page);
            history.pushState({ page }, '', `${BASE_PATH}/#${page}`);
            renderPage(page);
        });
    });
    
    window.addEventListener('popstate', (e) => {
        if (!currentData || !Object.keys(currentData).length) return;
        const page = e.state?.page || 'home';
        renderPage(page);
    });
    
    await loadData(currentLang);
    const page = getInitialPage();
    await renderPage(page);
}

function getInitialPage() {
    const hash = window.location.hash.replace('#', '');
    const saved = localStorage.getItem('currentPage');
    const pages = ['home', 'destinations', 'crew', 'technology'];
    if (hash && pages.includes(hash)) return hash;
    return pages.includes(saved) ? saved : 'home';
}

export async function reloadDataForLanguage(lang) { await loadData(lang); }
export { loadData };
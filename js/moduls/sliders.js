import { IS_DEV, BASE_PATH } from "./constantins.js";

let destinationSlider, crewSlider, technologySlider;

const imageMap = {
    'Луна': 'moon', 'Марс': 'mars', 'Европа': 'europa', 'Титан': 'titan',
    'Дуглас Хёрли': 'douglas-hurley', 'Марк Шаттлворт': 'mark-shuttleworth',
    'Виктор Гловер': 'victor-glover', 'Ануше Ансари': 'anousheh-ansari',
    'Ракета-носитель': 'launch-vehicle', 'Космодром': 'spaceport', 'Капсула': 'space-capsule'
};

function getImagePath(name, type) {
    const en = imageMap[name] || name.toLowerCase().replace(/\s/g, '-');
    const base = `${BASE_PATH}/assets`;
    if (type === 'destination') return `${base}/destination/image-${en}.webp`;
    if (type === 'crew') return `${base}/crew/image-${en}.webp`;
    if (type === 'technology-landscape') return `${base}/technology/image-${en}-landscape.jpg`;
    if (type === 'technology-portrait') return `${base}/technology/image-${en}-portrait.jpg`;
    return '';
}

function is3DPlanet(name) { return name === 'Луна' || name === 'Moon' || name === 'Марс' || name === 'Mars'; }
function get3DTexturePath(name) { return name === 'Луна' || name === 'Moon' ? `${BASE_PATH}/assets/destination/8k_moon.jpg` : `${BASE_PATH}/assets/destination/8k_mars.jpg`; }

export function initDestinationSlider(data, use3D = true) {
    const track = document.querySelector('[data-destination-slider-track]');
    const navButtons = document.querySelectorAll('[data-destination-nav]');
    const planetContainer = document.querySelector('#planet-container');
    const imgContainer = document.querySelector('#destination-3d-model');
    const img = imgContainer?.querySelector('img');
    
    if (!track || !navButtons.length) return;
    
    function switchPlanetType(name) {
        if (use3D && is3DPlanet(name)) {
            planetContainer?.classList.remove('hidden');
            imgContainer?.classList.add('hidden');
            const texPath = get3DTexturePath(name);
            if (texPath && window.updatePlanetTexture) window.updatePlanetTexture(texPath);
        } else {
            planetContainer?.classList.add('hidden');
            imgContainer?.classList.remove('hidden');
            const imgPath = getImagePath(name, 'destination');
            if (img && img.src !== imgPath) { img.src = imgPath; img.classList.add('planet-3d-effect'); }
        }
    }
    
    const updateSlide = (index) => {
        const slideWidth = track.children[0]?.offsetWidth || 0;
        track.style.transform = `translateX(-${index * slideWidth}px)`;
        navButtons.forEach((btn, i) => btn.setAttribute('aria-current', i === index));
        switchPlanetType(data[index].name);
        if (destinationSlider) destinationSlider.currentIndex = index;
    };
    
    navButtons.forEach((btn, idx) => { btn.addEventListener('click', () => updateSlide(idx)); });
    
    destinationSlider = { track, navButtons, currentIndex: 0, updateSlide };
    updateSlide(0);
    if (IS_DEV) console.log('Слайдер Destinations инициализирован');
}

export function initCrewSlider(data) {
    const track = document.querySelector('[data-crew-slider-track]');
    const navButtons = document.querySelectorAll('[data-crew-nav]');
    const crewImg = document.querySelector('[data-crew-img]');
    if (!track || !navButtons.length) return;
    
    const slides = track.children;
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.removeProperty('height');
    }
    
    const updateSlide = (index) => {
        const slideWidth = track.children[0]?.offsetWidth || 0;
        track.style.transform = `translateX(-${index * slideWidth}px)`;
        navButtons.forEach((btn, i) => btn.setAttribute('aria-current', i === index));
        if (crewImg && data[index]) {
            crewImg.src = getImagePath(data[index].name, 'crew');
            crewImg.alt = data[index].name;
        }
        if (crewSlider) crewSlider.currentIndex = index;
    };
    
    navButtons.forEach((btn, idx) => { btn.addEventListener('click', () => updateSlide(idx)); });
    
    crewSlider = { track, navButtons, currentIndex: 0, updateSlide };
    updateSlide(0);
    if (IS_DEV) console.log('Слайдер Crew инициализирован');
}

export function initTechnologySlider(data) {
    const track = document.querySelector('[data-tech-slider-track]');
    const navButtons = document.querySelectorAll('[data-tech-nav]');
    const techImg = document.querySelector('[data-tech-img] img');
    const techSource = document.querySelector('[data-tech-img] source');
    if (!track || !navButtons.length) return;
    
    const updateSlide = (index) => {
        const slideWidth = track.children[0]?.offsetWidth || 0;
        track.style.transform = `translateX(-${index * slideWidth}px)`;
        navButtons.forEach((btn, i) => btn.setAttribute('aria-current', i === index));
        if (data[index]) {
            const landscape = getImagePath(data[index].name, 'technology-landscape');
            const portrait = getImagePath(data[index].name, 'technology-portrait');
            if (techImg && techImg.src !== landscape) techImg.src = landscape;
            if (techSource && techSource.srcset !== portrait) techSource.srcset = portrait;
        }
        if (technologySlider) technologySlider.currentIndex = index;
    };
    
    navButtons.forEach((btn, idx) => { btn.addEventListener('click', () => updateSlide(idx)); });
    
    technologySlider = { track, navButtons, currentIndex: 0, updateSlide };
    updateSlide(0);
    if (IS_DEV) console.log('Слайдер Technology инициализирован');
}

window.addEventListener('keydown', (e) => {
    const activePage = document.querySelector('.header-nav[aria-current="page"]')?.dataset.page;
    const isDesktop = window.innerWidth >= 1440;

    if (activePage === 'destinations' && destinationSlider) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            const total = destinationSlider.track.children.length;
            let newIndex = destinationSlider.currentIndex - 1;
            if (newIndex < 0) newIndex = total - 1;
            destinationSlider.updateSlide(newIndex);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            const total = destinationSlider.track.children.length;
            let newIndex = destinationSlider.currentIndex + 1;
            if (newIndex >= total) newIndex = 0;
            destinationSlider.updateSlide(newIndex);
        }
    }
    else if (activePage === 'crew' && crewSlider) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            const total = crewSlider.track.children.length;
            let newIndex = crewSlider.currentIndex - 1;
            if (newIndex < 0) newIndex = total - 1;
            crewSlider.updateSlide(newIndex);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            const total = crewSlider.track.children.length;
            let newIndex = crewSlider.currentIndex + 1;
            if (newIndex >= total) newIndex = 0;
            crewSlider.updateSlide(newIndex);
        }
    }
    else if (activePage === 'technology' && technologySlider) {
        if (isDesktop) {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                const total = technologySlider.track.children.length;
                let newIndex = technologySlider.currentIndex - 1;
                if (newIndex < 0) newIndex = total - 1;
                technologySlider.updateSlide(newIndex);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                const total = technologySlider.track.children.length;
                let newIndex = technologySlider.currentIndex + 1;
                if (newIndex >= total) newIndex = 0;
                technologySlider.updateSlide(newIndex);
            }
        } else {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const total = technologySlider.track.children.length;
                let newIndex = technologySlider.currentIndex - 1;
                if (newIndex < 0) newIndex = total - 1;
                technologySlider.updateSlide(newIndex);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                const total = technologySlider.track.children.length;
                let newIndex = technologySlider.currentIndex + 1;
                if (newIndex >= total) newIndex = 0;
                technologySlider.updateSlide(newIndex);
            }
        }
    }
});
const BASE_PATH = '/space';
const IS_DEV = false;

const SELECTORS = {
    menu: document.querySelector('[data-menu]'),
    openMenu: document.querySelector('[data-open-menu]'),
    closeMenu: document.querySelector('[data-close-menu]'),
    pageBtns: document.querySelectorAll('[data-page]'),
    renderContainer: document.querySelector('[data-container]'),
}

export { SELECTORS, IS_DEV, BASE_PATH }
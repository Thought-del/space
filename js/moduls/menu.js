import { SELECTORS } from "./constantins.js";

let lastFocusedElement = null;
let menu, openBtn, closeBtn, menuLinks;

function openMenu() {
    lastFocusedElement = document.activeElement;
    menu.classList.remove('-translate-x-full');
    menu.classList.add('translate-x-0');
    menu.setAttribute('aria-hidden', 'false');
    closeBtn.focus();
    menu.addEventListener('keydown', trapFocus);
    document.body.classList.add('open-menu');
}

function closeMenu() {
    menu.classList.remove('translate-x-0');
    menu.classList.add('-translate-x-full');
    menu.setAttribute('aria-hidden', 'true');
    menu.removeEventListener('keydown', trapFocus);
    if (lastFocusedElement) lastFocusedElement.focus();
    document.body.classList.remove('open-menu');
}

function trapFocus(e) {
    if (e.key !== 'Tab') return;
    const focusable = menu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
    }
}

export function initMenu() {
    openBtn = SELECTORS.openMenu;
    closeBtn = SELECTORS.closeMenu;
    menu = SELECTORS.menu;
    menuLinks = document.querySelectorAll('.menu-nav');
    if (!openBtn || !closeBtn || !menu || !menuLinks?.length) return;
    openBtn.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !menu.hasAttribute('hidden')) closeMenu();
    });
}
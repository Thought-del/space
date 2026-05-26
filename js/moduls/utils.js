import { t } from './translate.js';

export function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed bottom-4 left-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 animate-fade-in';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

export function showLoader(containerId, show) {
    const container = document.getElementById(containerId);
    if (!container) return;
    let loader = container.querySelector('.loader-overlay');
    if (show && !loader) {
        loader = document.createElement('div');
        loader.className = 'loader-overlay absolute inset-0 flex items-center justify-center bg-black/50 rounded-full';
        loader.innerHTML = '<div class="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>';
        container.appendChild(loader);
    } else if (!show && loader) loader.remove();
}
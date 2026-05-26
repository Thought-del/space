import * as THREE from 'three';
import { BASE_PATH, IS_DEV } from './constantins.js';

let currentPlanet = null;
let currentRenderer = null;
let textureCache = {};
let loading = false;

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function showLoader(show) {
    const loader = document.getElementById('planet-loader');
    if (loader) loader.style.display = show ? 'flex' : 'none';
}

function preloadTextures() {
    const textures = [`${BASE_PATH}/assets/destination/8k_moon.jpg`, `${BASE_PATH}/assets/destination/8k_mars.jpg`];
    textures.forEach(src => { new THREE.TextureLoader().load(src, t => textureCache[src] = t); });
}

export function initPlanet(containerId, texturePath) {
    if (REDUCED_MOTION) return;
    const container = document.getElementById(containerId);
    if (!container) return;
    if (currentRenderer?.domElement) currentRenderer.domElement.remove();
    container.innerHTML = '<div id="planet-loader" style="display:flex" class="absolute inset-0 items-center justify-center"><div class="loader"></div></div>';
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.z = 3;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    currentRenderer = renderer;
    
    let texture = textureCache[texturePath];
    if (!texture) {
        loading = true;
        showLoader(true);
        texture = new THREE.TextureLoader().load(texturePath, () => { loading = false; showLoader(false); });
        textureCache[texturePath] = texture;
    } else showLoader(false);
    
    const planet = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), new THREE.MeshStandardMaterial({ map: texture, roughness: 0.8, metalness: 0.1 }));
    scene.add(planet);
    currentPlanet = planet;
    
    const sunLight = new THREE.DirectionalLight(0xffffff, 2);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);
    scene.add(new THREE.AmbientLight(0x404060, 1.5));
    
    const stars = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ size: 0.02, color: 0xffffff, transparent: true, opacity: 0.8 }));
    const starsPositions = new Float32Array(1500);
    for (let i = 0; i < 1500; i++) starsPositions[i] = (Math.random() - 0.5) * 20;
    stars.geometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
    scene.add(stars);
    
    let isDragging = false, prevMouse = { x: 0, y: 0 }, rotSpeed = { x: 0, y: 0 };
    const autoSpeed = 0.002;
    
    // МЫШЬ
    container.addEventListener('mousedown', e => { isDragging = true; prevMouse = { x: e.clientX, y: e.clientY }; });
    window.addEventListener('mouseup', () => isDragging = false);
    window.addEventListener('mousemove', e => {
        if (!isDragging) return;
        rotSpeed.y = (e.clientX - prevMouse.x) * 0.01;
        rotSpeed.x = (e.clientY - prevMouse.y) * 0.01;
        prevMouse = { x: e.clientX, y: e.clientY };
    });
    
    container.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isDragging = true;
        const touch = e.touches[0];
        prevMouse = { x: touch.clientX, y: touch.clientY };
    }, { passive: false });
    
    container.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!isDragging) return;
        const touch = e.touches[0];
        const deltaX = touch.clientX - prevMouse.x;
        const deltaY = touch.clientY - prevMouse.y;
        rotSpeed.y = deltaX * 0.01;
        rotSpeed.x = deltaY * 0.01;
        prevMouse = { x: touch.clientX, y: touch.clientY };
    }, { passive: false });
    
    container.addEventListener('touchend', () => {
        isDragging = false;
    });
    
    container.addEventListener('wheel', e => { e.preventDefault(); camera.position.z += e.deltaY * 0.01; camera.position.z = Math.max(1.5, Math.min(5, camera.position.z)); });
    
    function animate() {
        requestAnimationFrame(animate);
        if (currentPlanet) {
            currentPlanet.rotation.y += autoSpeed + rotSpeed.y;
            currentPlanet.rotation.x += rotSpeed.x;
        }
        rotSpeed.y *= 0.95; rotSpeed.x *= 0.95;
        stars.rotation.y += 0.0002;
        renderer.render(scene, camera);
    }
    animate();
    window.addEventListener('resize', () => { camera.aspect = container.clientWidth / container.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(container.clientWidth, container.clientHeight); });
}

export function updatePlanetTexture(texturePath) {
    if (REDUCED_MOTION || !currentPlanet) return;
    let texture = textureCache[texturePath];
    if (texture) { currentPlanet.material.map = texture; currentPlanet.material.needsUpdate = true; }
    else {
        showLoader(true);
        new THREE.TextureLoader().load(texturePath, t => { textureCache[texturePath] = t; currentPlanet.material.map = t; currentPlanet.material.needsUpdate = true; showLoader(false); });
    }
}

export function destroyPlanet() {
    if (currentRenderer?.domElement) currentRenderer.domElement.remove();
    currentPlanet = null; currentRenderer = null;
}

window.updatePlanetTexture = updatePlanetTexture;
preloadTextures();

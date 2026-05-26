# 🚀 Space Tourism

[![GitHub Pages](https://img.shields.io/badge/Deployed-GitHub%20Pages-blue)](https://Thought-del.github.io/space-tourism/)
[![PWA](https://img.shields.io/badge/PWA-Enabled-green)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![Three.js](https://img.shields.io/badge/Three.js-r160-blue)](https://threejs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

**English** | [**Русский**](#русский)

---

## English

Interactive PWA application for virtual space travel. Explore the Moon, Mars, Europa and Titan with stunning 3D graphics, smooth animations and full responsiveness.

🔗 **Live Demo:** [https://Thought-del.github.io/space/](https://Thought-del.github.io/space/)

### ✨ Features

| Feature | Description |
|---------|-------------|
| 🌍 **3D Planets** | Moon and Mars with interactive 3D models (drag to rotate, scroll to zoom) |
| 🪐 **2D Planets** | Europa and Titan with CSS rotation animation |
| 📱 **Responsive** | Perfect layout for mobile, tablet and desktop |
| 🌐 **Multilingual** | English / Russian with language persistence |
| 🎮 **Keyboard Controls** | Arrow keys to navigate sliders (← → / ↑ ↓ on desktop) |
| 📦 **PWA** | Install on phone or computer, works offline |
| ⚡ **Service Worker** | Smart caching strategy for offline access |
| ♿ **Accessibility** | ARIA labels, keyboard navigation, focus management |

### 🛠 Tech Stack

- **HTML5** — Semantic markup
- **CSS3 / TailwindCSS** — Styling and responsive design
- **JavaScript (ES6+)** — Core logic, sliders, i18n
- **Three.js** — 3D graphics rendering
- **PWA / Service Worker** — Offline mode and installation

### 📁 Project Structure

```
space-tourism/
├── index.html              # Main page
├── 404.html                # Error page
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker
├── robots.txt              # SEO robots
├── sitemap.xml             # Sitemap
├── assets/                 # Images, icons
│   ├── home/
│   ├── destination/
│   ├── crew/
│   ├── technology/
│   └── shared/
├── css/dist/output.css     # Compiled Tailwind
├── js/
│   ├── main.js             # Entry point
│   └── moduls/             # Modules: sliders, 3D, i18n
└── data/                   # Content and translations
    ├── en-data.json
    ├── ru-data.json
    └── locales/
```

### 🚀 Installation & Local Development

```bash
# Clone repository
git clone https://github.com/Thought-del/space-tourism.git

# Navigate to project
cd space-tourism

# Open with Live Server (VS Code) or any HTTP server
# For Python: python -m http.server 8000
```

### 📱 PWA Installation

1. Open the site in Chrome / Edge
2. Click the **Install** icon in the address bar
3. The app will appear on your desktop / home screen

### 🎮 Slider Controls

| Page | Keys |
|------|------|
| Destinations | ← → |
| Crew | ← → |
| Technology (mobile/tablet) | ← → |
| Technology (desktop 1440px+) | ↑ ↓ |

### 🌍 Language Switching

- **EN** — English (default)
- **RU** — Русский

Language preference is saved to `localStorage`.

### 📦 Deployment

This project uses **GitHub Actions** for automatic deployment.  
On every push to `main` branch, the site is automatically built and deployed to GitHub Pages.

### 👨‍💻 Author

**Petr Romanyuk**  
- Telegram: [@thought217](https://t.me/thought217)
- GitHub: [thought-del](https://github.com/Thought-del)

### 📄 License

MIT — free for personal and commercial use.

---

## Русский

Интерактивное PWA-приложение для виртуального путешествия по космосу. Исследуйте Луну, Марс, Европу и Титан с потрясающей 3D-графикой, плавными анимациями и полной адаптивностью.

🔗 **Демо:** [https://Thought-del.github.io/space/](https://Thought-del.github.io/space/)

### ✨ Возможности

| Функция | Описание |
|---------|----------|
| 🌍 **3D планеты** | Луна и Марс с интерактивными 3D-моделями (перетаскивание мышью, зум) |
| 🪐 **2D планеты** | Европа и Титан с CSS-анимацией вращения |
| 📱 **Адаптивность** | Идеальная вёрстка для мобильных, планшетов и десктопов |
| 🌐 **Мультиязычность** | Английский / Русский с сохранением выбора |
| 🎮 **Управление с клавиатуры** | Стрелки для навигации по слайдерам (← → / ↑ ↓ на десктопе) |
| 📦 **PWA** | Установка на телефон или компьютер, работа офлайн |
| ⚡ **Service Worker** | Умная стратегия кэширования |
| ♿ **Доступность** | ARIA-метки, навигация с клавиатуры, управление фокусом |

### 🛠 Технологии

- **HTML5** — Семантическая разметка
- **CSS3 / TailwindCSS** — Стилизация и адаптив
- **JavaScript (ES6+)** — Логика, слайдеры, i18n
- **Three.js** — 3D-графика
- **PWA / Service Worker** — Офлайн-режим и установка

### 📁 Структура проекта

```
space-tourism/
├── index.html              # Главная страница
├── 404.html                # Страница ошибки
├── manifest.json           # PWA манифест
├── sw.js                   # Service Worker
├── robots.txt              # Для поисковых роботов
├── sitemap.xml             # Карта сайта
├── assets/                 # Изображения, иконки
│   ├── home/
│   ├── destination/
│   ├── crew/
│   ├── technology/
│   └── shared/
├── css/dist/output.css     # Скомпилированный Tailwind
├── js/
│   ├── main.js             # Точка входа
│   └── moduls/             # Модули: слайдеры, 3D, переводы
└── data/                   # Контент и переводы
    ├── en-data.json
    ├── ru-data.json
    └── locales/
```

### 🚀 Установка и запуск

```bash
# Клонировать репозиторий
git clone https://github.com/Thought-del/space-tourism.git

# Перейти в папку проекта
cd space-tourism

# Открыть через Live Server (VS Code) или любой HTTP-сервер
# Для Python: python -m http.server 8000
```

### 📱 Установка PWA

1. Откройте сайт в Chrome / Edge
2. Нажмите на иконку **Установить** в адресной строке
3. Приложение появится на рабочем столе / экране телефона

### 🎮 Управление слайдерами

| Страница | Клавиши |
|----------|---------|
| Направления | ← → |
| Экипаж | ← → |
| Технологии (планшет/мобилка) | ← → |
| Технологии (десктоп 1440px+) | ↑ ↓ |

### 🌐 Переключение языка

- **EN** — Английский (по умолчанию)
- **RU** — Русский

Выбор языка сохраняется в `localStorage`.

### 📦 Деплой

Проект использует **GitHub Actions** для автоматического деплоя.  
При каждом пуше в ветку `main` сайт автоматически собирается и публикуется на GitHub Pages.

### 👨‍💻 Автор

**Пётр Романюк**  
- Telegram: [@thought217](https://t.me/Thought217)
- GitHub: [thought-del](https://github.com/thought-del

### 📄 Лицензия

MIT — свободно для личного и коммерческого использования.

---

## 🤝 Вклад / Contributing

PRs and issues are welcome! If you find a bug or have a suggestion, feel free to open an issue.

---

⭐ If you like this project, give it a star on GitHub!
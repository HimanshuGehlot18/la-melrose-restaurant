---
name: mobile-app-dev
description: Use this skill when developing cross-platform mobile apps (React Native, Flutter), native Android/iOS integrations, Progressive Web Apps (PWA), offline sync, or touch gesture systems.
---

# Mobile Application & PWA Engineering

This skill provides comprehensive mobile development patterns, offline synchronization architectures, cross-platform workflows (React Native / Flutter), and Progressive Web App (PWA) optimization.

---

## 1. Progressive Web App (PWA) Manifest & Service Worker

### Modern Web App Manifest (`manifest.json`)
```json
{
  "name": "Cinematic Portfolio",
  "short_name": "Portfolio",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0A0C10",
  "theme_color": "#D4AF37",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### Offline Caching Service Worker Recipe
```javascript
const CACHE_NAME = 'cinematic-cache-v1';
const ASSETS = ['/', '/index.html', '/src/index.css', '/src/main.js'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});
```

---

## 2. Touch Gestures & Inertial Physics

* **Swipe Detection Matrix**:
```javascript
export function onSwipe(element, { onSwipeLeft, onSwipeRight, threshold = 60 }) {
  let touchStartX = 0;
  let touchEndX = 0;

  element.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  element.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (diff > threshold && onSwipeRight) onSwipeRight();
    if (diff < -threshold && onSwipeLeft) onSwipeLeft();
  }, { passive: true });
}
```

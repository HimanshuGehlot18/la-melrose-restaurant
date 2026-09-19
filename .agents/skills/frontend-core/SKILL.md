---
name: frontend-core
description: Use this skill when building complex frontend web applications, organizing reactive state, optimizing DOM rendering, wiring modern Web APIs, and structuring component architectures.
---

# Frontend Core Architecture & State Engineering

This skill provides advanced patterns for modern frontend development, reactive state management, DOM performance, and Web API integration.

---

## 1. Lightweight Reactive State Pattern (Vanilla / Framework-Agnostic)

```javascript
export class Store {
  constructor(initialState = {}) {
    this.state = new Proxy(initialState, {
      set: (target, key, value) => {
        target[key] = value;
        this.notify(key, value);
        return true;
      },
    });
    this.subscribers = new Map();
  }

  subscribe(key, callback) {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    this.subscribers.get(key).add(callback);
    return () => this.subscribers.get(key).delete(callback);
  }

  notify(key, value) {
    if (this.subscribers.has(key)) {
      this.subscribers.get(key).forEach((cb) => cb(value));
    }
  }
}
```

---

## 2. High-Performance DOM Observer Patterns

### IntersectionObserver for Scroll Reveal & Lazy Loading
```javascript
export function initScrollReveal(selector = '.reveal-on-scroll') {
  const elements = document.querySelectorAll(selector);
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target); // Trigger once & free memory
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}
```

---

## 3. Memory Leak Prevention & Event Delegation

* **Always use Event Delegation** for lists and dynamic elements:
```javascript
// Good: Single listener on parent container
container.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const action = button.dataset.action;
  handleAction(action, button.dataset.id);
});
```
* **Cleanup on Element Removal**: Always disconnect observers, clear `setInterval`/`requestAnimationFrame`, and remove event listeners when tearing down components.

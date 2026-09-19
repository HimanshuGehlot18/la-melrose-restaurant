---
name: responsive-ui
description: Use this skill when implementing responsive web designs, mobile-first layouts, CSS clamp fluid typography, glassmorphism UI styles, and touch ergonomics.
---

# Responsive UI & Glassmorphism Design Engineering

This skill provides modern responsive web design techniques, fluid typography, glassmorphism surface styling, and mobile-first ergonomics.

---

## 1. Modern Fluid Typography & Spacing with `clamp()`

Eliminate jerky media query font jumps with continuous fluid scaling:

```css
:root {
  /* Fluid Body: 15px at 320px screen -> 18px at 1440px screen */
  --font-body: clamp(0.9375rem, 0.875rem + 0.3125vw, 1.125rem);

  /* Fluid H2: 24px at 320px -> 40px at 1440px */
  --font-h2: clamp(1.5rem, 1.1429rem + 1.7857vw, 2.5rem);

  /* Fluid Hero Display: 36px at 320px -> 72px at 1440px */
  --font-hero: clamp(2.25rem, 1.4643rem + 3.9286vw, 4.5rem);

  /* Fluid Container Padding */
  --gutter: clamp(1rem, 0.5rem + 2.5vw, 3.5rem);
}
```

---

## 2. Ultra-Premium Glassmorphism Surface Recipe

To achieve high-end, futuristic frosted glass that looks crisp on all screens:

```css
.glass-panel {
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  
  /* Specular Light Edge Highlight */
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-top-color: rgba(255, 255, 255, 0.18); /* Directional light falloff */
  
  border-radius: 16px;
  box-shadow: 
    0 10px 30px -10px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.3s ease;
}

.glass-panel:hover {
  transform: translateY(-4px);
  border-color: rgba(212, 175, 55, 0.35);
  box-shadow: 
    0 20px 40px -15px rgba(0, 0, 0, 0.7),
    0 0 20px rgba(212, 175, 55, 0.15);
}
```

---

## 3. Mobile Ergonomics & Safe Areas

```css
/* Respect iOS Home Indicator & Notch */
.bottom-nav-bar {
  padding-bottom: calc(1rem + env(safe-area-inset-bottom));
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

/* Eliminate tap delay on mobile browsers */
button, a, input {
  touch-action: manipulation;
}

/* Accessibility: User prefers reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

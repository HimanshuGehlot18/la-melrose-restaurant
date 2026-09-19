---
name: vite-performance
description: Use this skill when configuring Vite, tuning bundle splitting, minimizing build output, preloading assets, optimizing Core Web Vitals, or aiming for a 100/100 Google Lighthouse score.
---

# Vite Build Optimization & Web Performance Engineering

This skill provides advanced Vite configuration patterns, bundle splitting strategies, critical asset preloading, and performance tuning to achieve 100/100 Lighthouse scores.

---

## 1. High-Performance `vite.config.js` Blueprint

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Eliminate console.log in production
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Isolate vendor chunks to maximize browser caching
          lucide: ['lucide'],
          confetti: ['canvas-confetti'],
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 600,
    cssCodeSplit: true,
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});
```

---

## 2. Core Web Vitals Optimization Checklist

| Metric | Target | Tactical Solution |
| :--- | :--- | :--- |
| **LCP** (Largest Contentful Paint) | $< 1.2\text{s}$ | Preload hero images/fonts with `<link rel="preload" as="image" href="...">`. |
| **FID / INP** (Interaction to Next Paint) | $< 150\text{ms}$ | Offload heavy physics/calculations to Web Workers or `requestIdleCallback`. |
| **CLS** (Cumulative Layout Shift) | $< 0.05$ | Explicitly specify `width` and `height` attributes on all `<img>` and `<canvas>` elements. |

---

## 3. Asset Pipeline & Modern Image Formats

* **Format Priority**: Serve `AVIF` first, fallback to `WebP`, fallback to optimized `PNG/JPG`.
```html
<picture>
  <source srcset="/assets/hero.avif" type="image/avif">
  <source srcset="/assets/hero.webp" type="image/webp">
  <img src="/assets/hero.jpg" alt="Hero Art" width="1200" height="800" loading="eager" decoding="async">
</picture>
```
* **Font Subsetting**: Preload only critical font weights (e.g. 400, 700) using `display=swap` to eliminate Flash of Invisible Text (FOIT).

---
name: qa-testing-automation
description: Use this skill when writing automated unit tests (Vitest, Jest), End-to-End browser tests (Playwright, Cypress), performance stress testing (k6), or setting up continuous test suites.
---

# QA Engineering & Test Automation Architecture

This skill provides comprehensive testing frameworks, automated test runners, End-to-End (E2E) browser testing recipes, and load testing scripts.

---

## 1. Unit & Integration Testing Recipe (Vitest)

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ParticleEngine } from './particleEngine.js';

describe('ParticleEngine', () => {
  let canvas;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
  });

  it('should initialize with correct particle capacity', () => {
    const engine = new ParticleEngine(canvas, 100);
    expect(engine.particles.length).toBe(100 * 6);
  });

  it('should reset out-of-bounds particles cleanly', () => {
    const engine = new ParticleEngine(canvas, 10);
    engine.particles[1] = -50; // Force y out of bounds
    engine.render();
    expect(engine.particles[1]).toBeGreaterThanOrEqual(0);
  });
});
```

---

## 2. Playwright End-to-End (E2E) Browser Test Suite

```typescript
import { test, expect } from '@playwright/test';

test.describe('Portfolio Interactive Journey', () => {
  test('should load cinematic hero and render interactive elements without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('http://localhost:5173');

    // Verify Hero Visibility
    const heroTitle = page.locator('h1');
    await expect(heroTitle).toBeVisible();

    // Verify Canvas Element
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    // Ensure zero runtime JS errors occurred
    expect(errors).toHaveLength(0);
  });
});
```

---

## 3. High-Load API Stress Testing with k6

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },  // Ramp up to 50 concurrent users
    { duration: '1m', target: 200 },  // Spike to 200 users
    { duration: '30s', target: 0 },    // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<250'], // 95% of requests must complete under 250ms
  },
};

export default function () {
  const res = http.get('http://localhost:3000/api/projects');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
```

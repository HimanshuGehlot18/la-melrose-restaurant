---
name: ui-ux-design
description: Use this skill when designing UI/UX systems, establishing design tokens, crafting micro-interactions, structuring user journeys, auditing accessibility (WCAG), or creating design systems.
---

# UI/UX Product Design & Systems Engineering

This skill provides industry-standard UI/UX methodologies, design token architecture, interaction design patterns, and accessibility guidelines for world-class digital products.

---

## 1. Design Token Hierarchy

### CSS Variables Design Tokens Template
```css
:root {
  /* Color Palette - HSL Tailored */
  --color-canvas: hsl(222, 47%, 7%);
  --color-surface: hsl(222, 40%, 11%);
  --color-surface-hover: hsl(222, 35%, 16%);
  --color-border: hsl(222, 20%, 22%);
  --color-border-focus: hsl(43, 96%, 56%);

  --color-text-primary: hsl(0, 0%, 98%);
  --color-text-secondary: hsl(215, 20%, 65%);
  --color-text-muted: hsl(215, 15%, 45%);

  --color-accent-gold: hsl(43, 96%, 56%);
  --color-accent-cyan: hsl(190, 95%, 50%);

  /* Spacing Scale (4px / 8px Grid) */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1.0rem;   /* 16px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2.0rem;   /* 32px */
  --space-12: 3.0rem;  /* 48px */

  /* Elevation Shadows */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.4);
  --shadow-glow: 0 0 24px rgba(212, 175, 55, 0.25);

  /* Animation Timings */
  --ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 150ms;
  --duration-normal: 300ms;
}
```

---

## 2. The 5 Core UI Interaction States

Every interactive element (button, input, card, menu item) must have defined visual representations for all five states:

1. **Default State**: Clear visual affordance (border, subtle background, readable label).
2. **Hover State**: Elevation shift, border illumination, or background tint (`150ms` transition).
3. **Active / Pressed State**: Subtle scale-down (`transform: scale(0.98)`), immediate tactile response.
4. **Focus-Visible State**: High-contrast outline (`2px solid var(--color-accent-gold)` with `2px offset`) for keyboard navigation.
5. **Disabled State**: Reduced opacity (`0.45`), `cursor: not-allowed`, pointer-events disabled.

---

## 3. WCAG 2.1 AA Accessibility Standards

* **Contrast Ratios**:
  * Normal text ($< 18.5\text{px}$ regular): Minimum **4.5:1** contrast against background.
  * Large text ($\ge 18.5\text{px}$ bold or $\ge 24\text{px}$ regular): Minimum **3.0:1** contrast.
  * Interactive UI components & icons: Minimum **3.0:1** contrast.
* **Touch Targets**: Minimum **44px × 44px** hit area on touchscreens.
* **Screen Reader Semantics**: Use native semantic HTML elements (`<main>`, `<nav>`, `<article>`, `<button>`) with descriptive `aria-label` where text is absent.

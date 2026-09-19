---
name: graphic-design-visuals
description: Use this skill when creating graphic designs, vector SVG illustrations, marketing collateral, hero banners, thumbnail compositions, color palettes, and social media visuals.
---

# Graphic Design & Visual Asset Engineering

This skill equips the agent with graphic design principles, scalable vector graphics (SVG) generation workflows, color harmonies, and compositional techniques for digital media and promotional assets.

---

## 1. Composition & Visual Hierarchy Frameworks

### The Golden Ratio & Rule of Thirds
* **Focal Anchor Points**: Place key visual elements at intersection points (33% and 66% width/height).
* **Z-Pattern / F-Pattern Flow**:
  * Top-Left: Logo / Brandmark
  * Top-Right: Primary Call-to-Action / Navigation
  * Center: Hero Graphic / Visual Motif
  * Bottom-Left / Center: Key Value Headline
  * Bottom-Right: Conversion Trigger

### Layered Depth in 2D Graphics
1. **Background Layer**: Atmospheric gradients, subtle geometric grids, grain overlay (`feTurbulence`), or celestial dust.
2. **Midground Layer**: Subject matter, framed containers, UI cards, illustration paths.
3. **Foreground Layer**: Specular highlights, lens flairs, floating badges, light leaks.

---

## 2. Programmatic SVG Generation Recipes

### Ultra-Clean Responsive SVG Template
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%" fill="none">
  <defs>
    <!-- Premium Gradient -->
    <linearGradient id="goldSheen" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F6D365" stop-opacity="1" />
      <stop offset="50%" stop-color="#FDA085" stop-opacity="1" />
      <stop offset="100%" stop-color="#F6D365" stop-opacity="0.8" />
    </linearGradient>

    <!-- Subtle Glow Filter -->
    <filter id="divineGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background Canvas -->
  <rect width="800" height="600" fill="#0A0C10" />

  <!-- Focal Art Element -->
  <circle cx="400" cy="300" r="140" stroke="url(#goldSheen)" stroke-width="3" filter="url(#divineGlow)" />
</svg>
```

---

## 3. Social Media & Asset Dimension Standards

| Platform / Format | Optimal Resolution | Aspect Ratio | Safe Area Considerations |
| :--- | :--- | :--- | :--- |
| **OpenGraph / Twitter Card** | $1200 \times 630\text{ px}$ | 1.91:1 | Keep text inside center $1000 \times 500\text{ px}$ safe zone. |
| **YouTube Thumbnail** | $1280 \times 720\text{ px}$ | 16:9 | Avoid bottom-right corner (timestamp overlay). |
| **Instagram / Mobile Reel Poster**| $1080 \times 1920\text{ px}$ | 9:16 | Center square $1080 \times 1080\text{ px}$ is grid preview. |
| **Square Avatar / Brand Icon** | $512 \times 512\text{ px}$ | 1:1 | Must be legible as circular crop down to 32px. |

---

## 4. Visual Quality Checklist

- [ ] Is vector graphic crisp and scalable without pixelation at $2\times$ and $3\times$ retina displays?
- [ ] Are shadows soft and diffused (`rgba(0,0,0,0.4)` with large blur) rather than harsh black lines?
- [ ] Does typography maintain sufficient breathing space (padding $> 2\times$ font size)?
- [ ] Has color banding in linear gradients been mitigated with subtle dithering or grain?

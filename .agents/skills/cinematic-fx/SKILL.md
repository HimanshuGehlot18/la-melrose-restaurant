---
name: cinematic-fx
description: Use this skill when implementing canvas particle systems, celestial/divine visual effects, Web Audio API soundscapes, audio visualizers, and multi-layer parallax scrolling.
---

# Cinematic FX & Canvas Particle Architecture

This skill provides advanced runbooks and implementation patterns for cinematic web experiences, canvas particle physics, Web Audio synthesis, and multi-layer parallax.

---

## 1. High-Performance Canvas Particle System Pattern

### Zero-Allocation Particle Pool (60fps on Mobile)
```javascript
export class ParticleEngine {
  constructor(canvas, maxParticles = 120) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true });
    this.particles = new Float32Array(maxParticles * 6); // x, y, vx, vy, size, alpha
    this.maxParticles = maxParticles;
    this.init();
    this.bindEvents();
  }

  init() {
    for (let i = 0; i < this.maxParticles; i++) {
      this.resetParticle(i);
    }
  }

  resetParticle(i) {
    const offset = i * 6;
    this.particles[offset] = Math.random() * this.canvas.width; // x
    this.particles[offset + 1] = Math.random() * this.canvas.height; // y
    this.particles[offset + 2] = (Math.random() - 0.5) * 0.8; // vx
    this.particles[offset + 3] = -0.3 - Math.random() * 0.7; // vy (upward float)
    this.particles[offset + 4] = 1.0 + Math.random() * 2.5; // size
    this.particles[offset + 5] = 0.2 + Math.random() * 0.8; // alpha
  }

  render(glowColor = '#D4AF37') {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < this.maxParticles; i++) {
      const offset = i * 6;
      this.particles[offset] += this.particles[offset + 2];
      this.particles[offset + 1] += this.particles[offset + 3];

      // Screen wrap
      if (this.particles[offset + 1] < -10) {
        this.resetParticle(i);
        this.particles[offset + 1] = canvas.height + 10;
      }

      ctx.save();
      ctx.globalAlpha = this.particles[offset + 5];
      ctx.fillStyle = glowColor;
      ctx.shadowBlur = 10;
      ctx.shadowColor = glowColor;
      ctx.beginPath();
      ctx.arc(
        this.particles[offset],
        this.particles[offset + 1],
        this.particles[offset + 4],
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.restore();
    }
  }
}
```

---

## 2. Web Audio API Ambient Soundscape & Visualizer

### Audio Context & Real-Time FFT Analyser
```javascript
export class AmbientSoundscape {
  constructor() {
    this.ctx = null;
    this.analyser = null;
    this.dataArray = null;
  }

  init() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 64; // Fast, lightweight frequency bins
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
  }

  getBassEnergy() {
    if (!this.analyser) return 0;
    this.analyser.getByteFrequencyData(this.dataArray);
    // Average lowest 4 frequency bins
    const bass = (this.dataArray[0] + this.dataArray[1] + this.dataArray[2] + this.dataArray[3]) / 4;
    return bass / 255; // Normalized 0.0 -> 1.0
  }
}
```

---

## 3. Cinematic Mouse & Scroll Parallax (Lerp Math)

```javascript
// Linear interpolation for buttery-smooth damping
const lerp = (start, end, factor) => start + (end - start) * factor;

let targetX = 0, targetY = 0;
let currentX = 0, currentY = 0;

window.addEventListener('mousemove', (e) => {
  targetX = (e.clientX / window.innerWidth - 0.5) * 40; // Max 40px tilt
  targetY = (e.clientY / window.innerHeight - 0.5) * 40;
});

function animateParallax() {
  currentX = lerp(currentX, targetX, 0.08);
  currentY = lerp(currentY, targetY, 0.08);

  const heroElement = document.querySelector('.cinematic-hero-layer');
  if (heroElement) {
    heroElement.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
  }
  requestAnimationFrame(animateParallax);
}
```

---
name: threejs-3d
description: Use this skill when developing 3D web scenes using Three.js, loading GLTF/GLB models, setting up shaders, lighting, camera controls, post-processing bloom, or optimizing WebGL performance.
---

# Three.js 3D & WebGL Engineering

This skill provides production recipes and architectural patterns for creating high-performance, cinematic 3D web scenes using Three.js and WebGL.

---

## 1. Production WebGL Boilerplate Setup

```javascript
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function createThreeScene(container) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05070a, 0.03);

  const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 2, 8);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance',
    alpha: true,
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Clamp to 2 for battery/GPU safety
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  // Cinematic 3-Point Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  const keyLight = new THREE.DirectionalLight(0xd4af37, 2.5); // Golden key
  keyLight.position.set(5, 8, 5);
  const rimLight = new THREE.DirectionalLight(0x3b82f6, 1.8); // Cyan-blue rim
  rimLight.position.set(-5, 3, -5);

  scene.add(ambientLight, keyLight, rimLight);

  return { scene, camera, renderer };
}
```

---

## 2. GLTF/GLB Loading with DRACO Compression & Animation Mixer

```javascript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

export function loadModel(scene, path, onLoaded) {
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);

  loader.load(path, (gltf) => {
    const model = gltf.scene;
    model.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    scene.add(model);

    let mixer = null;
    if (gltf.animations.length > 0) {
      mixer = new THREE.AnimationMixer(model);
      const action = mixer.clipAction(gltf.animations[0]);
      action.play();
    }
    if (onLoaded) onLoaded({ model, mixer });
  });
}
```

---

## 3. Resource Disposal & Memory Leak Prevention

```javascript
export function disposeThreeScene(scene, renderer) {
  scene.traverse((object) => {
    if (object.geometry) object.geometry.dispose();
    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach((mat) => mat.dispose());
      } else {
        object.material.dispose();
      }
    }
  });
  renderer.dispose();
}
```

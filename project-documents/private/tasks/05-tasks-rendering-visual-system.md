# Rendering & Visual System

## Implement Retro Wireframe Material

- [ ] **Create or update material in component**
  - [ ] In `src/components/cards/CosineTerrainCard.tsx`, import Three.js:
    ```typescript
    import * as THREE from 'three';
    ```
  - [ ] Define wireframe material:
    ```typescript
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
    });
    ```
  - [ ] Integrate theme colors:
    1. Use `useTheme` to detect dark/light mode
    2. In dark mode: background #000000, wireframe #00ff00
    3. In light mode: choose contrasting colors (e.g., background #ffffff, wireframe #000000)
  - [ ] Success: Retro wireframe aesthetic achieved in both themes

## Set Up Infinite Terrain Rendering

- [ ] **Implement frustum culling and segment streaming**
  - [ ] In `useTerrainGenerator` hook, maintain a map of active segment IDs
  - [ ] On camera position update, compute visible segment grid coordinates within radius
  - [ ] For each new coordinate:
    - Acquire geometry (via `generateTerrainSegment` or pool)
    - Add mesh to scene
  - [ ] For coordinates leaving view:
    - Remove mesh from scene
    - Release geometry back to pool
  - [ ] Success: Only visible segments rendered, memory usage remains stable

## Configure Scene Background and Lighting

- [ ] **Set scene background color**
  - [ ] In component useEffect, call:
    ```typescript
    scene.background = new THREE.Color(
      theme === 'dark' ? 0x000000 : 0xffffff
    );
    ```
  - [ ] Success: Background color adapts to theme

- [ ] **Add lighting for visibility**
  - [ ] Add ambient light:
    ```typescript
    const ambient = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambient);
    ```
  - [ ] Add directional light:
    ```typescript
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(1, 1, 1);
    scene.add(dirLight);
    ```
  - [ ] Success: Wireframe terrain is clearly visible under lighting

- [ ] **Verify camera configuration**
  - [ ] Ensure `PerspectiveCamera` uses:
    - `fov = 75`
    - `near = 0.1`, `far = 1000`
    - Aspect ratio updated on resize
  - [ ] Success: Camera provides correct perspective without clipping issues
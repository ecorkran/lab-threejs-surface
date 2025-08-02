# Camera Animation System

## Implement Camera Controller Hook

- [ ] **Create hook file**
  - [ ] Create a new file: `src/hooks/useCameraController.ts`
  - [ ] Import required modules:
    ```typescript
    import { useEffect, useRef } from 'react';
    import * as THREE from 'three';
    import { calculateTerrainHeight } from '@/lib/utils/terrainMath';
    ```
  - [ ] Define the `useCameraController` function:
    ```typescript
    export function useCameraController(
      camera: THREE.PerspectiveCamera,
      speed: number = 1.0,
      heightOffset: number = 30
    ) {
      // TODO: implement animation loop
    }
    ```
  - [ ] Inside the hook, implement:
    1. **Animation Loop**: use `requestAnimationFrame` to update each frame
    2. **Position Update**: advance camera in X/Z based on elapsed time and `speed`
    3. **Height Sampling**: sample terrain height with `calculateTerrainHeight`
    4. **Smooth Y Interpolation**: use `THREE.MathUtils.lerp` to approach target height (`terrainY + heightOffset`)
    5. **Orientation**: call `camera.lookAt(0, 0, 0)` or forward direction
  - [ ] Add cleanup for the animation loop on unmount
  - [ ] Success: Camera moves forward smoothly and maintains height above terrain

## Add Camera Collision Avoidance

- [ ] **Ensure camera stays above terrain surface**
  - [ ] Within the animation loop, sample terrain height:
    ```typescript
    const terrainY = calculateTerrainHeight(
      camera.position.x,
      camera.position.z
    );
    ```
  - [ ] Compute `targetY = terrainY + heightOffset`
  - [ ] Update `camera.position.y` via smoothed interpolation:
    ```typescript
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      targetY,
      0.1
    );
    ```
  - [ ] Success: Camera never dips below the procedural surface, preventing clipping
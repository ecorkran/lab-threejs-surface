# Terrain Generation System

## Create Terrain Math Utilities

- [ ] **Create `terrainMath.ts` file**
  - [ ] Create new file: `src/lib/utils/terrainMath.ts`
  - [ ] Implement cosine height function:
    ```typescript
    export function calculateTerrainHeight(
      x: number,
      z: number,
      frequency: number = 1.0,
      amplitude: number = 5.0
    ): number {
      return Math.cos(x * frequency) * Math.cos(z * frequency) * amplitude;
    }
    ```
  - [ ] Add stub for generating terrain segments:
    ```typescript
    export function generateTerrainSegment(
      size: number,
      segments: number,
      frequency?: number,
      amplitude?: number
    ): THREE.BufferGeometry {
      // TODO: create plane geometry and apply height
    }
    ```
  - [ ] Verify utilities compile without errors
  - [ ] Success: Math utilities ready for terrain generation

## Implement Procedural Mesh Generation

- [ ] **Create terrain generator hook**
  - [ ] Create new file: `src/hooks/useTerrainGenerator.ts`
  - [ ] Import Three.js and math utilities
    ```typescript
    import * as THREE from 'three';
    import { calculateTerrainHeight, generateTerrainSegment } from '@/lib/utils/terrainMath';
    ```
  - [ ] In hook, generate initial geometry using `generateTerrainSegment`
  - [ ] Set up state or ref to store geometry for rendering
  - [ ] Ensure normals are updated after vertex manipulation
  - [ ] Success: Hook provides geometry ready for rendering

## Create Geometry Pooling System

- [ ] **Implement geometry pool**
  - [ ] Create new file: `src/lib/utils/geometryPool.ts`
  - [ ] Define API: `acquireGeometry(key: string): THREE.BufferGeometry`
  - [ ] Define API: `releaseGeometry(geometry: THREE.BufferGeometry): void`
  - [ ] Use pooling in `useTerrainGenerator` to reuse geometries
  - [ ] Test by generating multiple segments and ensuring reuse
  - [ ] Success: Geometry pooling works without memory leaks
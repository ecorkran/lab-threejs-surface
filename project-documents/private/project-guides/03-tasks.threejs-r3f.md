# CosineTerrainCard - Detailed Task Breakdown

## Project Setup & Dependencies

- [x] **Install Three.js dependencies**
  - [ ] Install Three.js library for 3D graphics
    1. Run: `pnpm add three`
    2. Install TypeScript definitions: `pnpm add -D @types/three`
  - [ ] Verify Three.js imports work in TypeScript
    1. Create test import: `import * as THREE from 'three';`
    2. Confirm no TypeScript errors in IDE
  - [ ] Success: Three.js library available and properly typed

- [x] **Add AI support scripts to package.json**
  - [ ] Locate `snippets/npm-scripts.ai-support.json` file
  - [ ] Copy scripts block from snippet file
  - [ ] Add scripts to existing `package.json` scripts section
  - [ ] Success: `pnpm build` and TypeScript check commands available

## Component Structure & Foundation

- [ ] **Create CosineTerrainCard component file**
  - [ ] Create new file: `src/components/cards/CosineTerrainCard.tsx`
  - [ ] Set up basic React functional component structure
    ```typescript
    "use client";
    
    import React from 'react';
    
    export interface CosineTerrainCardProps {
      className?: string;
    }
    
    const CosineTerrainCard: React.FC<CosineTerrainCardProps> = ({ className = '' }) => {
      return <div className={className}>CosineTerrainCard</div>;
    };
    
    export default CosineTerrainCard;
    ```
  - [ ] Success: Component file created with proper TypeScript interface

- [ ] **Copy ThreeJSCard foundation patterns**
  - [ ] Review existing `src/components/cards/ThreeJSCard.tsx` for patterns
  - [ ] Copy canvas setup, theme integration, and cleanup patterns
  - [ ] Adapt useEffect structure for terrain-specific logic
  - [ ] Copy resize handling and WebGL renderer setup
  - [ ] Success: Component has solid Three.js foundation without breaking existing ThreeJSCard

- [ ] **Add component to cards index**
  - [ ] Open `src/components/cards/index.ts`
  - [ ] Add export line: `export { default as CosineTerrainCard } from './CosineTerrainCard';`
  - [ ] Success: Component properly exported and available for import

## Terrain Generation System

- [ ] **Create terrain mathematics utilities**
  - [ ] Create new file: `src/lib/utils/terrainMath.ts`
  - [ ] Implement cosine surface height calculation function
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
  - [ ] Add terrain segment generation function
  - [ ] Add utility functions for coordinate transformations
  - [ ] Success: Mathematical foundation for terrain generation complete

- [ ] **Implement procedural mesh generation**
  - [ ] Create terrain generation hook: `src/hooks/useTerrainGenerator.ts`
  - [ ] Implement mesh creation from cosine function
    1. Create PlaneGeometry with configurable segments
    2. Modify vertices using cosine height calculation
    3. Update geometry attributes and normals
  - [ ] Add segment-based generation for infinite terrain
  - [ ] Add geometry disposal and memory management
  - [ ] Success: Dynamic terrain meshes generated from cosine mathematics

- [ ] **Create geometry pooling system**
  - [ ] Create new file: `src/lib/utils/geometryPool.ts`
  - [ ] Implement mesh instance reuse to minimize garbage collection
  - [ ] Add pool size management and cleanup methods
  - [ ] Integrate with terrain generator for efficient memory usage
  - [ ] Success: Memory-efficient terrain generation without leaks

## Camera Animation System

- [ ] **Implement camera controller hook**
  - [ ] Create new file: `src/hooks/useCameraController.ts`
  - [ ] Set up camera position state and animation loop
  - [ ] Implement smooth forward movement along terrain
    1. Calculate camera position based on time and speed
    2. Update camera height to maintain distance above terrain
    3. Use smooth interpolation for natural movement
  - [ ] Add configurable speed and height parameters
  - [ ] Success: Smooth camera animation traveling above terrain surface

- [ ] **Add camera collision avoidance**
  - [ ] Implement terrain height sampling at camera position
  - [ ] Adjust camera Y position to maintain consistent height above surface
  - [ ] Add smooth interpolation to prevent jarring height changes
  - [ ] Success: Camera maintains proper height above terrain without clipping

## Rendering & Visual System

- [ ] **Implement retro wireframe material**
  - [ ] Create wireframe material with green color (#00ff00)
  - [ ] Set material to wireframe mode with proper line width
  - [ ] Integrate with theme system for dark/light mode adaptation
    1. Green wireframe on black background for dark mode
    2. Adapt colors appropriately for light mode if needed
  - [ ] Success: Classic vector graphics aesthetic achieved

- [ ] **Set up infinite terrain rendering**
  - [ ] Implement frustum culling to only render visible terrain segments
  - [ ] Add terrain segment streaming based on camera position
  - [ ] Remove distant segments to prevent memory growth
  - [ ] Ensure seamless transitions between terrain segments
  - [ ] Success: Infinite terrain appearance without performance degradation

- [ ] **Add proper lighting and scene setup**
  - [ ] Configure scene background color (black for retro aesthetic)
  - [ ] Set up minimal lighting for wireframe visibility
  - [ ] Configure camera field of view and clipping planes
  - [ ] Success: Proper scene rendering with retro visual style

## Performance Optimization

- [ ] **Implement performance monitoring hook**
  - [ ] Create new file: `src/hooks/usePerformanceMonitor.ts`
  - [ ] Add FPS tracking using requestAnimationFrame timestamps
  - [ ] Implement performance metrics collection (frame time, memory usage)
  - [ ] Add performance state management and callbacks
  - [ ] Success: Real-time performance monitoring and metrics

- [ ] **Create adaptive quality system**
  - [ ] Implement quality level adjustment based on FPS
    1. High quality: Dense tessellation, full effects
    2. Medium quality: Reduced tessellation, simplified rendering
    3. Low quality: Minimal tessellation, basic wireframe only
  - [ ] Add automatic quality scaling when FPS drops below thresholds
  - [ ] Implement smooth quality transitions to avoid visual jarring
  - [ ] Success: Automatic performance adaptation across device capabilities

- [ ] **Add Level of Detail (LOD) system**
  - [ ] Implement distance-based mesh detail reduction
  - [ ] Create multiple tessellation levels for near/medium/far terrain
  - [ ] Add smooth LOD transitions to prevent popping artifacts
  - [ ] Integrate LOD with performance monitoring for dynamic adjustment
  - [ ] Success: Efficient rendering with detail appropriate to viewing distance

## Component Configuration & Props

- [ ] **Expand component props interface**
  - [ ] Update `CosineTerrainCardProps` with all configuration options
    ```typescript
    export interface CosineTerrainCardProps {
      className?: string;
      speed?: number;           // Camera travel speed (0.1-2.0)
      surfaceDetail?: number;   // Mesh tessellation (1-5)
      waveFrequency?: number;   // Cosine wave frequency (0.1-2.0)
      height?: number;          // Camera height above surface (20-100)
      autoQuality?: boolean;    // Enable adaptive performance
      showFPS?: boolean;        // Debug FPS counter
    }
    ```
  - [ ] Add prop validation and default values
  - [ ] Success: Comprehensive configuration interface

- [ ] **Implement prop-based customization**
  - [ ] Connect speed prop to camera animation system
  - [ ] Connect surfaceDetail prop to mesh tessellation
  - [ ] Connect waveFrequency prop to terrain mathematics
  - [ ] Connect height prop to camera positioning
  - [ ] Connect autoQuality prop to performance system
  - [ ] Success: All props control their respective systems correctly

- [ ] **Add debug FPS counter**
  - [ ] Create FPS display component for development/debugging
  - [ ] Show/hide based on showFPS prop
  - [ ] Position counter in corner without interfering with terrain
  - [ ] Success: Optional FPS counter for performance monitoring

## Theme Integration & Polish

- [ ] **Integrate with manta-templates theme system**
  - [ ] Import and use `useTheme` hook from `@/context/themecontext`
  - [ ] Adapt colors based on current theme (dark/light)
  - [ ] Ensure proper contrast and visibility in both themes
  - [ ] Success: Seamless integration with existing theme system

- [ ] **Add accessibility features**
  - [ ] Respect `prefers-reduced-motion` media query
  - [ ] Provide fallback content when WebGL is unavailable
  - [ ] Add proper ARIA labels and descriptions
  - [ ] Success: Component accessible to users with motion sensitivity or WebGL limitations

- [ ] **Implement error handling and fallbacks**
  - [ ] Add WebGL context loss detection and recovery
  - [ ] Provide graceful fallback when Three.js fails to initialize
  - [ ] Add error boundaries and user-friendly error messages
  - [ ] Success: Robust error handling prevents application crashes

## Testing & Integration

- [ ] **Create example usage page**
  - [ ] Create new file: `src/app/examples/cosine-terrain/page.tsx`
  - [ ] Import and use CosineTerrainCard with various prop configurations
  - [ ] Test different speeds, details, and quality settings
  - [ ] Success: Working example demonstrating component capabilities

- [ ] **Add component to examples navigation**
  - [ ] Update examples page to include link to cosine terrain demo
  - [ ] Ensure proper routing and navigation
  - [ ] Success: Component accessible through examples interface

- [ ] **Verify manta-templates integration**
  - [ ] Test component within BentoLayout and GridLayout systems
  - [ ] Verify responsive behavior across breakpoints
  - [ ] Test theme switching and visual consistency
  - [ ] Success: Component works seamlessly within manta-templates ecosystem

## Build & Quality Assurance

- [ ] **Run TypeScript checks**
  - [ ] Execute `pnpm type-check` to verify no TypeScript errors
  - [ ] Fix any type issues or missing interfaces
  - [ ] Success: Clean TypeScript compilation

- [ ] **Run build process**
  - [ ] Execute `pnpm build` to test production build
  - [ ] Resolve any build errors or warnings
  - [ ] Success: Clean production build without errors

- [ ] **Test performance across devices**
  - [ ] Test on high-performance desktop (target: 60fps)
  - [ ] Test on mobile device (target: 30fps minimum)
  - [ ] Verify adaptive quality system responds appropriately
  - [ ] Success: Smooth performance across target device range

- [ ] **Final component verification**
  - [ ] Verify all props work as specified
  - [ ] Test theme integration in both light and dark modes
  - [ ] Confirm infinite terrain generation without memory leaks
  - [ ] Verify proper cleanup on component unmount
  - [ ] Success: Component fully functional and production-ready
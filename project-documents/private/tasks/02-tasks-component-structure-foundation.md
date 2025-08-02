# Component Structure & Foundation

## Create CosineTerrainCard Component

### Initialize Component File
- [ ] **Create the main component file**
  - [ ] Create new file: `src/components/cards/CosineTerrainCard.tsx`
  - [ ] Set up basic React functional component with TypeScript
    ```typescript
    "use client";
    
    import React from 'react';
    
    export interface CosineTerrainCardProps {
      className?: string;
    }
    
    const CosineTerrainCard: React.FC<CosineTerrainCardProps> = ({ 
      className = '' 
    }) => {
      return <div className={className}>CosineTerrainCard Placeholder</div>;
    };
    
    export default CosineTerrainCard;
    ```
  - [ ] Success: Component file created with proper TypeScript structure

### Adapt ThreeJSCard Foundation
- [ ] **Copy essential patterns from ThreeJSCard**
  - [ ] Review `src/components/cards/ThreeJSCard.tsx` for reusable patterns
    1. Canvas ref setup and WebGL renderer initialization
    2. Theme integration with `useTheme` hook
    3. Resize handling and cleanup patterns
    4. useEffect structure for Three.js lifecycle
  - [ ] Adapt the core structure for terrain rendering
    1. Replace icosahedron geometry setup with placeholder for terrain
    2. Keep renderer setup, camera setup, and animation loop structure
    3. Maintain cleanup and resize handling exactly as in ThreeJSCard
  - [ ] Test basic Three.js setup renders without errors
    1. Add simple placeholder geometry (box or plane)
    2. Verify canvas renders and responds to theme changes
    3. Confirm no memory leaks on component unmount
  - [ ] Success: Component has working Three.js foundation based on ThreeJSCard

## Component Integration

### Add to Card System
- [ ] **Export component from cards index**
  - [ ] Open `src/components/cards/index.ts`
  - [ ] Add export: `export { default as CosineTerrainCard } from './CosineTerrainCard';`
  - [ ] Verify export works by importing in a test file
  - [ ] Success: Component available through cards module exports

### Create Basic Test Page
- [ ] **Set up development test page**
  - [ ] Create `src/app/examples/cosine-terrain/page.tsx`
  - [ ] Import and render CosineTerrainCard with basic props
    ```typescript
    import { CosineTerrainCard } from '@/components/cards';
    
    export default function CosineTerrainPage() {
      return (
        <div className="p-8">
          <h1>Cosine Terrain Card Test</h1>
          <div className="w-full h-96 border">
            <CosineTerrainCard className="w-full h-full" />
          </div>
        </div>
      );
    }
    ```
  - [ ] Test component renders in development server
  - [ ] Verify Three.js canvas appears and responds to theme changes
  - [ ] Success: Component integrates properly with Next.js app structure

## Foundation Validation

### Verify Core Functionality
- [ ] **Test component lifecycle**
  - [ ] Navigate to test page and confirm component mounts
  - [ ] Switch between light/dark themes to test theme integration
  - [ ] Resize browser window to test resize handling
  - [ ] Navigate away and back to test cleanup/remount
  - [ ] Check browser console for any errors or warnings
  - [ ] Success: Component handles all lifecycle events properly

### Prepare for Terrain Implementation
- [ ] **Set up component structure for terrain features**
  - [ ] Add placeholder props for future terrain configuration
    ```typescript
    export interface CosineTerrainCardProps {
      className?: string;
      speed?: number;
      surfaceDetail?: number;
      waveFrequency?: number;
      height?: number;
    }
    ```
  - [ ] Add basic prop handling (store in state, don't implement yet)
  - [ ] Document TODOs in component for terrain implementation
  - [ ] Success: Component ready for terrain generation implementation
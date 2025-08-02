---
layer: process
phase: 2
phaseName: spec
project: threejs-r3f
framework: nextjs
tools: [manta-templates, shadcn, tailwindcss, threejs, r3f]
created: 2025-01-27
dependsOn: [01-concept.threejs-r3f.md]
---

# Project Specification: CosineTerrainCard - Infinite 3D Surface Experience

## 1. Overview and Purpose

**Project Title**: CosineTerrainCard - Infinite Cosine Surface with Three.js

**Summary**: A specialized React component that renders an infinite, procedurally generated cosine-based terrain surface with smooth camera animation, creating a retro wireframe aesthetic reminiscent of classic CRT displays and vector games like BattleZone.

**Objectives**:
- **Specific**: Create a reusable `CosineTerrainCard` component for manta-templates
- **Measurable**: Achieve 60fps on capable devices, graceful degradation on mobile
- **Achievable**: Build upon existing ThreeJSCard foundation and Three.js knowledge
- **Relevant**: Enhance manta-templates with impressive 3D capabilities for demos and portfolios
- **Time-bound**: Complete Phase 1 (Three.js implementation) within development cycle

**Target Audience**: 
- Primary: Project creator (learning Three.js, 3D web development)
- Secondary: Developers using manta-templates, portfolio visitors, demo audiences

## 2. Functional Requirements

### Core Features

#### **Priority 1 - Essential Features**
- **F1.1 Infinite Terrain Generation**
  - Purpose: Create seamless, non-repeating cosine-based surface
  - Subfunctions: Procedural mesh generation, adaptive tessellation, geometry pooling
  - Acceptance: Surface extends infinitely in all directions without visible seams

- **F1.2 Retro Wireframe Rendering**
  - Purpose: Achieve classic CRT/vector display aesthetic
  - Subfunctions: Green wireframe material, black background, scanline effects (optional)
  - Acceptance: Visual style matches BattleZone/classic vector graphics

- **F1.3 Smooth Camera Animation**
  - Purpose: Create sensation of traveling 30-50 feet above terrain
  - Subfunctions: Configurable speed, smooth interpolation, collision avoidance
  - Acceptance: Fluid movement at target framerate without stuttering

- **F1.4 Performance Adaptation**
  - Purpose: Maintain smooth experience across device capabilities
  - Subfunctions: FPS monitoring, quality scaling, LOD adjustment
  - Acceptance: 60fps on capable devices, 30fps minimum on mobile

#### **Priority 2 - Enhancement Features**
- **F2.1 Configuration Props**
  - Purpose: Allow customization without code changes
  - Subfunctions: Speed, height, surface detail, wave frequency controls
  - Acceptance: Props modify behavior predictably

- **F2.2 Theme Integration**
  - Purpose: Respect manta-templates theme system
  - Subfunctions: Dark/light mode adaptation, color scheme integration
  - Acceptance: Seamless integration with existing theme context

#### **Priority 3 - Future Features**
- **F3.1 User Controls** (Future Phase)
  - Purpose: Interactive navigation (WASD, mouse)
  - Subfunctions: Input handling, camera control, speed adjustment

- **F3.2 R3F Migration** (Future Phase)
  - Purpose: Enhanced React integration and component composition
  - Subfunctions: Component refactoring, JSX scene description

### Use Cases/User Stories

**UC1 - Developer Integration**
```
As a developer using manta-templates,
I want to add impressive 3D content to my portfolio,
So that I can showcase modern web capabilities.
```

**UC2 - Visitor Experience**
```
As a portfolio visitor,
I want to see engaging 3D content that loads quickly,
So that I have a memorable browsing experience.
```

**UC3 - Performance Scaling**
```
As a mobile user with limited device capabilities,
I want the 3D experience to run smoothly without draining battery,
So that I can enjoy the content without performance issues.
```

### Process Flows

1. **Component Initialization**
   - Mount component → Initialize Three.js renderer → Create scene → Start animation loop

2. **Terrain Generation**
   - Calculate visible area → Generate mesh segments → Apply cosine function → Update geometry

3. **Animation Loop**
   - Update camera position → Regenerate terrain if needed → Render frame → Monitor performance

4. **Performance Adaptation**
   - Monitor FPS → Adjust quality settings → Update LOD parameters → Maintain target framerate

## 3. Non-Functional Requirements

### Performance Metrics
- **Target FPS**: 60fps on desktop (M3 Max MBP), 30fps minimum on mobile
- **Load Time**: < 2 seconds initial render
- **Memory Usage**: < 100MB peak memory consumption
- **Battery Impact**: Minimal on mobile devices

### Scalability
- **Terrain Size**: Infinite procedural generation without memory growth
- **Device Support**: Graceful degradation from high-end desktop to mobile
- **Future Extensions**: Architecture supports R3F migration and additional features

### Security Requirements
- **WebGL Context**: Proper context handling and fallbacks
- **Memory Management**: No memory leaks in animation loops
- **Error Handling**: Graceful degradation when WebGL unavailable

### Usability Guidelines
- **Accessibility**: Respects `prefers-reduced-motion` settings
- **Responsive Design**: Adapts to container dimensions
- **Visual Feedback**: Loading states and error messages
- **Performance Indicators**: Optional FPS counter for debugging

## 4. Technical Specifications

### Technology Stack

**Core 3D Engine**:
- ✅ **Three.js**: Primary 3D rendering engine
  - Knowledge available in `tool-guides/threejs/`
  - Provides scene management, geometry, materials, animation

**React Integration**:
- ✅ **React 18+**: Component architecture and hooks
- ✅ **Next.js 15**: Application framework with SSR considerations
- 🔄 **React Three Fiber (R3F)**: Future migration target
  - Knowledge available in `tool-guides/r3f/`
  - Enables declarative 3D scene composition

**UI Framework**:
- ✅ **Manta-Templates**: Component system and card architecture
  - Knowledge available in `tool-guides/manta-templates/`
  - Provides layout systems, theme integration, responsive patterns
- ✅ **ShadCN**: UI component primitives
  - Knowledge available in `tool-guides/shadcn/`
- ✅ **Tailwind CSS v4**: Utility-first styling
  - Knowledge available in `tool-guides/tailwindcss/`

**Development Tools**:
- ✅ **TypeScript**: Type safety and development experience
- ✅ **ESLint/Prettier**: Code quality and formatting

### Integration Requirements

**Manta-Templates Integration**:
- Extend existing card component patterns
- Implement `CardVariantProps` interface
- Support theme context and responsive breakpoints
- Follow established naming conventions

**Three.js WebGL Context**:
- Canvas element management
- Renderer lifecycle handling
- Memory cleanup on unmount
- Resize event handling

### Hosting and Architecture

**Component Architecture**:
```
CosineTerrainCard/
├── CosineTerrainCard.tsx     # Main component
├── hooks/
│   ├── useTerrainGenerator.ts # Terrain generation logic
│   ├── useCameraController.ts # Camera animation
│   └── usePerformanceMonitor.ts # FPS monitoring
├── utils/
│   ├── terrainMath.ts        # Cosine surface calculations
│   └── geometryPool.ts       # Memory management
└── types/
    └── terrain.ts            # TypeScript definitions
```

**Performance Architecture**:
- **Frustum Culling**: Only render visible terrain segments
- **Level of Detail (LOD)**: Adaptive mesh density based on distance
- **Geometry Pooling**: Reuse mesh instances to minimize GC pressure
- **Instanced Rendering**: Efficient rendering of repeated elements

### Compatibility

**Browser Support**:
- Chrome 90+ (primary target)
- Firefox 88+ (secondary)
- Safari 14+ (mobile primary)
- Edge 90+ (secondary)

**Device Support**:
- Desktop: High detail, 60fps target
- Tablet: Medium detail, 45fps target  
- Mobile: Low detail, 30fps minimum

**WebGL Requirements**:
- WebGL 1.0 minimum
- WebGL 2.0 preferred for advanced features
- Graceful fallback when WebGL unavailable

## 5. Deliverables and Milestones

### Wireframes/Mockups

**Visual Design**:
- Green wireframe lines (#00ff00) on black background (#000000)
- Smooth, flowing cosine-based terrain surface
- Camera positioned 30-50 units above surface
- Infinite horizon with proper perspective

**Component Props Interface**:
```typescript
interface CosineTerrainCardProps {
  className?: string;
  speed?: number;           // Camera travel speed (0.1-2.0)
  surfaceDetail?: number;   // Mesh tessellation (1-5)
  waveFrequency?: number;   // Cosine wave frequency (0.1-2.0)
  height?: number;          // Camera height above surface (20-100)
  autoQuality?: boolean;    // Enable adaptive performance
  showFPS?: boolean;        // Debug FPS counter
}
```

### Development Phases

**Phase 1: Core Implementation** (Current)
- [ ] Set up component structure based on ThreeJSCard
- [ ] Implement basic cosine terrain generation
- [ ] Add camera animation system
- [ ] Integrate with manta-templates card system

**Phase 2: Performance Optimization**
- [ ] Implement adaptive LOD system
- [ ] Add performance monitoring
- [ ] Optimize geometry generation
- [ ] Test across device capabilities

**Phase 3: Enhancement & Polish**
- [ ] Add configuration props
- [ ] Implement theme integration
- [ ] Add accessibility features
- [ ] Create documentation and examples

**Phase 4: Future Migration** (Separate project)
- [ ] Migrate to React Three Fiber
- [ ] Add interactive controls
- [ ] Implement advanced visual effects

## 6. Risk Management

### Constraints
- **Performance**: Must maintain smooth framerate across devices
- **Memory**: Limited by browser and device capabilities
- **Compatibility**: WebGL support varies across browsers/devices
- **Learning Curve**: First R3F implementation for project creator

### Risk Log

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|-------------------|
| **Performance on Mobile** | High | High | Implement aggressive LOD, quality scaling, FPS monitoring |
| **WebGL Context Loss** | Medium | High | Add context restoration, graceful fallbacks |
| **Memory Leaks** | Medium | Medium | Proper cleanup in useEffect, geometry disposal |
| **Infinite Terrain Complexity** | Medium | Medium | Start with finite segments, expand gradually |
| **R3F Migration Difficulty** | Low | Medium | Design architecture with migration in mind |

### Mitigation Strategies

**Performance Mitigation**:
- Implement performance profiling from day one
- Use adaptive quality settings based on device capabilities
- Monitor memory usage and implement garbage collection strategies

**Compatibility Mitigation**:
- Test across multiple browsers and devices
- Implement WebGL feature detection
- Provide fallback content for unsupported browsers

## 7. Documentation and Appendices

### Glossary
- **LOD (Level of Detail)**: Technique to reduce rendering complexity based on distance
- **Frustum Culling**: Only rendering objects within camera view
- **Tessellation**: Process of dividing geometry into smaller triangles
- **Geometry Pooling**: Reusing mesh instances to reduce memory allocation

### References
- **Three.js Documentation**: https://threejs.org/docs/
- **React Three Fiber**: https://docs.pmnd.rs/react-three-fiber
- **Manta Templates**: Internal component library and patterns
- **BattleZone Aesthetic**: Classic vector graphics reference

### Supporting Materials

**Mathematical Foundation**:
```javascript
// Cosine surface function
function terrainHeight(x, z, frequency = 1.0) {
  return Math.cos(x * frequency) * Math.cos(z * frequency) * amplitude;
}
```

**Performance Targets**:
- Desktop (M3 Max): 60fps, high detail (tessellation level 4-5)
- Mobile: 30fps minimum, adaptive detail (tessellation level 1-3)

**Architecture Diagram**:
```
Component Mount
    ↓
Initialize Three.js Context
    ↓
Create Scene & Camera
    ↓
Generate Initial Terrain
    ↓
Start Animation Loop
    ↓
[Update Camera] → [Regenerate Terrain] → [Render Frame] → [Monitor Performance]
    ↑                                                              ↓
    ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
```

This specification provides a comprehensive foundation for implementing the CosineTerrainCard component while maintaining flexibility for future enhancements and R3F migration.
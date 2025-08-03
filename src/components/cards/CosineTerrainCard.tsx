"use client";
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface CosineTerrainCardProps {
  className?: string;
  seed?: number;
  speed?: number;
  cameraHeight?: number;
  terrainFrequency?: number;
  terrainAmplitude?: number;
  meshResolution?: number;
  tilesX?: number;
  tilesZ?: number;
  fov?: number;
  terrainScale?: number;
  terrainEquation?: 'multiplicative' | 'additive';
  // Amplitude multipliers for both equations
  // Additive: z = (xMult * cos(x) + zMult * cos(z)) * amplitude * 0.5
  // Multiplicative: z = (xMult * cos(x)) * (zMult * cos(z)) * amplitude
  xAmplitudeMultiplier?: number;
  zAmplitudeMultiplier?: number;
  // Spatial variation parameters
  enableAmplitudeVariation?: boolean;
  amplitudeVariationFrequency?: number; // How often amplitude varies across terrain
  amplitudeVariationIntensity?: number; // How much amplitude can vary (0-1)
  showFPS?: boolean;
  // Enhanced camera system props
  followTerrain?: boolean;
  lookAheadDistance?: number; // Distance ahead to look at (0 = straight down, large = straight ahead)
  lookAtHeight?: number; // Height above terrain to look at (0 = terrain surface, positive = above terrain)
  heightVariation?: number;
  heightVariationFrequency?: number;
  // Terrain quality system
  terrainQuality?: 0 | 1 | 2;
  // Dynamic tile count
  enableDynamicTilesX?: boolean;
  // Camera and rendering
  cameraFarPlane?: number; // Distance for far clipping plane - higher values render terrain farther out
  showTerrainLogs?: boolean; // Show 5-second terrain coverage progress logs
}

const CosineTerrainCard: React.FC<CosineTerrainCardProps> = ({
  className,
  seed = 0,
  speed = 2400,
  cameraHeight = 3600,
  terrainFrequency = 0.000113,
  terrainAmplitude = 2400,
  meshResolution = 8,
  tilesX = 20,
  tilesZ = 65, // Increased to 65 to maintain consistent coverage span
  fov = 60,
  terrainScale = 2048,
  terrainEquation = 'multiplicative',
  // Amplitude multipliers for both terrain equations
  xAmplitudeMultiplier = 1.2,
  zAmplitudeMultiplier = 1.0,
  // Spatial variation settings
  enableAmplitudeVariation = true,
  amplitudeVariationFrequency = 0.000233, // low freq for fairly large-scale features
  amplitudeVariationIntensity = 1.73, // Can vary amplitude by ±173%
  showFPS = true,
  // Enhanced camera system props with appropriate defaults
  followTerrain = true,
  lookAheadDistance = 8100, // Distance ahead to look at (0 = straight down, large = straight ahead)
  lookAtHeight = 1024, // Height above terrain to look at (0 = terrain surface)
  heightVariation = 0,
  heightVariationFrequency = 0.25,
  terrainQuality = 2,
  enableDynamicTilesX = true,
  cameraFarPlane = 28000, // Increased far plane renders terrain farther out but may affect apparent width/frequency
  showTerrainLogs = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Tile management constants (maintainability)
  const TILE_RECYCLING_THRESHOLD = 3.5; // Enable recycling - more conservative to prevent premature recycling
  const TILE_BUFFER_DISTANCE = 1.5; // Extra tiles to keep in front of camera (in tile units)
  const GAP_DETECTION_ENABLED = false; // Disabled - causes issues with emergency tile placement
  const MAX_TILES_PER_FRAME_RECYCLE = 5; // Increased to handle more recycling per frame
  
  /**
   * Calculate optimal horizontal tile count based on viewport and camera settings
   */
  const calculateOptimalTilesX = (viewportWidth: number, viewportHeight: number): number => {
    const viewWidth = 2 * Math.tan((fov * Math.PI / 180) / 2) * cameraFarPlane;
    const baselineTiles = Math.ceil(viewWidth / terrainScale);
    
    // Aspect ratio adjustment: square viewport (1:1) = no adjustment
    const aspectRatio = viewportWidth / viewportHeight;
    const aspectAdjustedTiles = Math.round(baselineTiles * aspectRatio);
    const finalTileCount = aspectAdjustedTiles;
    
    // Debug output for tile calculations
    if (showTerrainLogs) {
      console.log('🔧 Tile Calculation Debug:', {
        viewportSize: `${viewportWidth}×${viewportHeight}px`,
        aspectRatio: aspectRatio.toFixed(2),
        fov: `${fov}°`,
        cameraFarPlane: cameraFarPlane,
        terrainScale: terrainScale,
        viewWidth: `${viewWidth.toFixed(0)} world units`,
        baselineTiles: `${baselineTiles} tiles (geometric baseline)`,
        aspectAdjustedTiles: `${aspectAdjustedTiles} tiles (after aspect)`,
        finalTileCount: `${finalTileCount} tiles`
      });
    }
    
    return finalTileCount;
  };
  
  // Frequency validation for gap prevention
  const validateTerrainFrequency = (frequency: number): void => {
    const wavelength = (2 * Math.PI) / frequency;
    const tileWavelengthRatio = wavelength / terrainScale;
    
    // Warn about potentially problematic frequencies
    const fractionalPart = tileWavelengthRatio % 1;
    if (fractionalPart > 0.2 && fractionalPart < 0.8) {
      console.warn(
        `Terrain frequency ${frequency} may cause tile boundary artifacts. ` +
        `Wavelength/tile ratio: ${tileWavelengthRatio.toFixed(2)}. ` +
        `Consider frequencies that create integer or half-integer ratios.`
      );
    }
  };
  
  // Validate current frequency
  validateTerrainFrequency(terrainFrequency);

  useEffect(() => {
    if (!mountRef.current) return;
    // Clear any existing canvas or children before mounting new renderer
    mountRef.current.innerHTML = '';
    let frameId: number;

    // Calculate actual tilesX to use (Step 3)
    const actualTilesX = enableDynamicTilesX 
      ? calculateOptimalTilesX(mountRef.current.clientWidth, mountRef.current.clientHeight)
      : tilesX;

    const cameraNearPlane = 0.1; // Reduced near plane to prevent premature clipping

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(fov, mountRef.current.clientWidth / mountRef.current.clientHeight, cameraNearPlane, cameraFarPlane);
    camera.position.y = cameraHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    
    // Depth testing is enabled by default in Three.js WebGLRenderer
    mountRef.current.appendChild(renderer.domElement);

    // Create material based on terrain quality
    const material = terrainQuality >= 1
      ? new THREE.MeshBasicMaterial({
          color: 0x00ff00,
          wireframe: true,
          depthTest: true,
          depthWrite: true,
          polygonOffset: true,
          polygonOffsetFactor: 1,
          polygonOffsetUnits: 1
        })
      : new THREE.MeshBasicMaterial({
          color: 0x00ff00,
          wireframe: true,
          depthTest: false,
          depthWrite: false
        });
    
    const terrainTiles: THREE.Mesh[] = [];
    
    // Gap detection and emergency tile creation
    const detectAndFillGaps = () => {
      if (!GAP_DETECTION_ENABLED) return;
      
      const cameraZ = camera.position.z;
      const frontmostZ = cameraZ - (TILE_BUFFER_DISTANCE * terrainScale);
      
      // Check for gaps in front of camera
      const tilesInFront = terrainTiles.filter(tile => 
        tile.position.z <= frontmostZ && 
        tile.position.z >= frontmostZ - (tilesZ * terrainScale)
      );
      
      // If we have fewer tiles than expected in front, we might have gaps
      const expectedTilesInFront = Math.min(tilesZ, Math.ceil(TILE_BUFFER_DISTANCE * 2));
      if (tilesInFront.length < expectedTilesInFront * 0.8) { // 80% threshold
        // Find the frontmost tile position
        const frontmostTile = terrainTiles.reduce((front, tile) => 
          tile.position.z < front.position.z ? tile : front
        );
        
        // Create emergency tile ahead of frontmost
        const emergencyTileZ = frontmostTile.position.z - terrainScale;
        const emergencyTileX = 0; // Center tile for simplicity
        
        console.warn(`Gap detected! Creating emergency tile at Z: ${emergencyTileZ}`);
        terrainTiles.push(generateTerrainTile(emergencyTileX, emergencyTileZ / terrainScale));
      }
    };

      // Terrain height calculation function (shared across quality levels)
      const calculateTerrainHeight = (worldX: number, worldZ: number): number => {
        const cosX = Math.cos(worldX * terrainFrequency + seed);
        const cosZ = Math.cos(worldZ * terrainFrequency + seed);
        
        // Calculate local amplitude variation
        let localAmplitude = terrainAmplitude;
        if (enableAmplitudeVariation) {
          // Use low-frequency noise to vary amplitude across space
          const amplitudeNoise = Math.sin(worldX * amplitudeVariationFrequency + seed * 0.7) * 
                                 Math.cos(worldZ * amplitudeVariationFrequency + seed * 1.3);
          const amplitudeVariationFactor = 1 + (amplitudeNoise * amplitudeVariationIntensity);
          localAmplitude *= amplitudeVariationFactor;
        }
        
        return terrainEquation === 'additive'
          ? (xAmplitudeMultiplier * cosX + zAmplitudeMultiplier * cosZ) * localAmplitude * 0.5
          : (xAmplitudeMultiplier * cosX) * (zAmplitudeMultiplier * cosZ) * localAmplitude;
      };

    const generateTerrainTile = (tileX: number, tileZ: number) => {
      // Quality 1+: Use higher resolution for shared edges
      const resolution = terrainQuality >= 1 ? meshResolution : meshResolution - 1;
      const geometry = new THREE.PlaneGeometry(terrainScale, terrainScale, resolution, resolution);
      geometry.rotateX(-Math.PI / 2);
      
      const positions = geometry.attributes.position as THREE.BufferAttribute;
      const vertex = new THREE.Vector3();

      for (let i = 0; i < positions.count; i++) {
        vertex.fromBufferAttribute(positions, i);

        // Quality 1+: Use precise world coordinates for edge continuity
        const worldX = terrainQuality >= 1 
          ? tileX * terrainScale + vertex.x
          : vertex.x + tileX * terrainScale;
        const worldZ = terrainQuality >= 1 
          ? tileZ * terrainScale + vertex.z
          : vertex.z + tileZ * terrainScale;

        const y = calculateTerrainHeight(worldX, worldZ);
        positions.setY(i, y);
      }
      
      positions.needsUpdate = true;
      geometry.computeVertexNormals();

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(tileX * terrainScale, 0, tileZ * terrainScale);
      scene.add(mesh);
      return mesh;
    };

    // Quality 2: Geometry regeneration function
    const regenerateTileGeometry = (tile: THREE.Mesh, newTileX: number, newTileZ: number) => {
      if (terrainQuality < 2) return;

      const geometry = tile.geometry as THREE.PlaneGeometry;
      const positions = geometry.attributes.position as THREE.BufferAttribute;
      const vertex = new THREE.Vector3();

      for (let i = 0; i < positions.count; i++) {
        vertex.fromBufferAttribute(positions, i);

        const worldX = newTileX * terrainScale + vertex.x;
        const worldZ = newTileZ * terrainScale + vertex.z;

        const y = calculateTerrainHeight(worldX, worldZ);
        positions.setY(i, y);
      }
      
      positions.needsUpdate = true;
      geometry.computeVertexNormals();
      
      // Force complete geometry refresh to fix rendering issues with recycled tiles
      geometry.attributes.position.needsUpdate = true;
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();
    };

    for (let i = 0; i < actualTilesX; i++) {
      for (let j = 0; j < tilesZ; j++) {
        terrainTiles.push(generateTerrainTile(i - Math.floor(actualTilesX / 2), j - tilesZ));
      }
    }

    // Geometry sampling function for terrain-following camera
    const sampleTerrainHeight = (worldX: number, worldZ: number): number => {
      // Quality 2+: Use mathematical calculation for smoother transitions
      if (terrainQuality >= 2) {
        return calculateTerrainHeight(worldX, worldZ);
      }

      // Quality 0-1: Use geometry sampling
      // Find the tile that contains this world position
      let closestTile: THREE.Mesh | null = null;
      let minDistance = Infinity;
      
      for (const tile of terrainTiles) {
        const dx = worldX - tile.position.x;
        const dz = worldZ - tile.position.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        // Check if point is within this tile's bounds
        const halfScale = terrainScale / 2;
        if (Math.abs(dx) <= halfScale && Math.abs(dz) <= halfScale) {
          closestTile = tile;
          break;
        }
        
        // Keep track of closest tile as fallback
        if (distance < minDistance) {
          minDistance = distance;
          closestTile = tile;
        }
      }
      
      // Fallback to mathematical calculation if no tile found
      if (!closestTile) return calculateTerrainHeight(worldX, worldZ);
      
      // Convert world coordinates to local tile coordinates (-terrainScale/2 to +terrainScale/2)
      const localX = worldX - closestTile.position.x;
      const localZ = worldZ - closestTile.position.z;
      
      // Convert local coordinates to geometry UV coordinates (0 to 1)
      const u = (localX + terrainScale / 2) / terrainScale;
      const v = (localZ + terrainScale / 2) / terrainScale;
      
      // Sample the geometry using bilinear interpolation
      const geometry = closestTile.geometry as THREE.PlaneGeometry;
      const positions = geometry.attributes.position as THREE.BufferAttribute;
      // Use correct resolution based on quality level
      const resolution = terrainQuality >= 1 ? meshResolution : meshResolution - 1;
      const segmentsX = resolution;
      const segmentsZ = resolution;
      
      // Convert UV to grid coordinates
      const gridX = u * segmentsX;
      const gridZ = v * segmentsZ;
      
      // Get integer grid positions for interpolation
      const x0 = Math.floor(gridX);
      const z0 = Math.floor(gridZ);
      const x1 = Math.min(x0 + 1, segmentsX);
      const z1 = Math.min(z0 + 1, segmentsZ);
      
      // Get fractional parts for interpolation
      const fx = gridX - x0;
      const fz = gridZ - z0;
      
      // Sample heights at four corners
      const getHeightAt = (x: number, z: number) => {
        const index = z * (segmentsX + 1) + x;
        return index < positions.count ? positions.getY(index) : 0;
      };
      
      const h00 = getHeightAt(x0, z0);
      const h10 = getHeightAt(x1, z0);
      const h01 = getHeightAt(x0, z1);
      const h11 = getHeightAt(x1, z1);
      
      // Bilinear interpolation
      const h0 = h00 * (1 - fx) + h10 * fx;
      const h1 = h01 * (1 - fx) + h11 * fx;
      const height = h0 * (1 - fz) + h1 * fz;
      
      return height;
    };

    const onWindowResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', onWindowResize);

    // FPS tracking
    let frameCount = 0;
    let fpsLastTime = performance.now();
    let currentFPS = 0;
    let fpsElement: HTMLDivElement | null = null;
    
    if (showFPS) {
      fpsElement = document.createElement('div');
      fpsElement.style.position = 'absolute';
      fpsElement.style.top = '10px';
      fpsElement.style.left = '10px';
      fpsElement.style.color = '#00ff00';
      fpsElement.style.fontFamily = 'monospace';
      fpsElement.style.fontSize = '16px';
      fpsElement.style.backgroundColor = 'rgba(0,0,0,0.7)';
      fpsElement.style.padding = '5px';
      fpsElement.style.borderRadius = '3px';
      fpsElement.style.zIndex = '1000';
      fpsElement.textContent = 'FPS: --';
      mountRef.current.style.position = 'relative';
      mountRef.current.appendChild(fpsElement);
    }

    let lastTime = performance.now();
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      
      // FPS calculation
      if (showFPS && fpsElement) {
        frameCount++;
        if (now - fpsLastTime >= 1000) {
          currentFPS = Math.round((frameCount * 1000) / (now - fpsLastTime));
          fpsElement.textContent = `FPS: ${currentFPS}`;
          frameCount = 0;
          fpsLastTime = now;
        }
      }
      
      // Move camera forward
      camera.position.z -= delta * speed; 

      // Enhanced terrain-following camera system
      if (followTerrain) {
        // Sample terrain height at current camera position
        const currentTerrainHeight = sampleTerrainHeight(camera.position.x, camera.position.z);
        
        // Add subtle height variation over time
        const timeVariation = Math.sin(now * 0.001 * heightVariationFrequency) * heightVariation;
        
        // Set camera height above terrain surface
        camera.position.y = currentTerrainHeight + cameraHeight + timeVariation;
        
        // Look at terrain point ahead - distance determines viewing angle naturally
        const lookAheadX = camera.position.x;
        const lookAheadZ = camera.position.z - lookAheadDistance;
        const lookAheadTerrainHeight = sampleTerrainHeight(lookAheadX, lookAheadZ);
        
        // Look at point above terrain surface at the specified distance and height
        // Distance 0 = look straight down, large distance = look nearly straight ahead
        // Height 0 = look at terrain, positive = look above terrain
        const lookAtPoint = new THREE.Vector3(
          lookAheadX,
          lookAheadTerrainHeight + lookAtHeight,
          lookAheadZ
        );
        
        camera.lookAt(lookAtPoint);
      } else {
        // Maintain original fixed-height behavior for backward compatibility
        camera.position.y = cameraHeight;
      }

      // Quality-based tile recycling system with gap prevention
      let recycledThisFrame = 0;
      
      // Optional terrain progress logging every 5 seconds
      if (showTerrainLogs) {
        const shouldLog = Math.floor(now / 5000) !== Math.floor((now - delta * 1000) / 5000);
        if (shouldLog) {
          const timeSeconds = Math.floor(now / 1000);
          const cameraZTile = Math.round(camera.position.z / terrainScale);
          
          // Show terrain coverage
          const allTileZ = terrainTiles.map(t => Math.round(t.position.z / terrainScale));
          const minZ = Math.min(...allTileZ);
          const maxZ = Math.max(...allTileZ);
          
          console.log(`T=${timeSeconds}s: Camera Z=${camera.position.z.toFixed(0)} (tile ${cameraZTile}), Tiles: ${terrainTiles.length}`);
          console.log(`  Terrain coverage: tiles ${minZ} to ${maxZ} (span: ${maxZ - minZ + 1} tiles)`);
        }
      }
      
      terrainTiles.forEach(tile => {
        // Limit recycling operations per frame for performance
        if (recycledThisFrame >= MAX_TILES_PER_FRAME_RECYCLE) return;
        
        // Recycle tiles that are well behind the camera
        const recycleThreshold = terrainScale * TILE_RECYCLING_THRESHOLD;
        const distanceBehindCamera = tile.position.z - camera.position.z; // Tile behind when tile.z > camera.z
        
        if (distanceBehindCamera > recycleThreshold) {
          // Move tile forward by the full terrain depth to maintain grid structure
          const newTileZ = tile.position.z - (terrainScale * tilesZ);
          
          // Recycling and regeneration working correctly
          
          // Update mesh position to match new coordinates
          const tileX = tile.position.x / terrainScale; // Keep existing X coordinate  
          const tileZ = newTileZ / terrainScale; // New Z coordinate
          tile.position.set(tileX * terrainScale, 0, tileZ * terrainScale);
          recycledThisFrame++;
          
          // Quality 2: Regenerate geometry for true continuous terrain
          if (terrainQuality >= 2) {
            regenerateTileGeometry(tile, tileX, tileZ);
          }
        }
      });
      
      // Detect and fill any gaps that might have formed
      detectAndFillGaps();

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      // Stop the animation loop - this prevents the old loop from continuing to render
      // after component unmount, which was causing the "double surface" issue
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onWindowResize);
      // Capture ref value to avoid ESLint warning about ref changing during cleanup
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const currentMountRef = mountRef.current;
      if (currentMountRef) {
        // Remove any existing canvas or FPS overlay
        currentMountRef.innerHTML = '';
      }
      // Dispose renderer and scene resources
      renderer.dispose();
      // Dispose each tile's geometry
      terrainTiles.forEach(tile => {
        tile.geometry.dispose();
      });
      // Dispose the single shared material
      material.dispose();
    };
  // Note: Empty dependency array is intentional - we want this effect to run only on mount/unmount
  // to prevent the "double surface" issue when navigating between pages
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} className={className} />;
};

export default CosineTerrainCard;

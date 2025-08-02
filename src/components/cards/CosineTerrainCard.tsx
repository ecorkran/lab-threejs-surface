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
  showFPS?: boolean;
  // Enhanced camera system props
  followTerrain?: boolean;
  lookAheadDistance?: number; // Distance ahead to look at (0 = straight down, large = straight ahead)
  heightVariation?: number;
  heightVariationFrequency?: number;
  // Terrain quality system
  terrainQuality?: 0 | 1 | 2;
}

const CosineTerrainCard: React.FC<CosineTerrainCardProps> = ({
  className,
  seed = 0,
  speed = 2400,
  cameraHeight = 1600,
  terrainFrequency = 0.000306,
  terrainAmplitude = 2400,
  meshResolution = 12,
  tilesX = 20,
  tilesZ = 32,
  fov = 60,
  terrainScale = 2048,
  terrainEquation = 'additive',
  showFPS = true,
  // Enhanced camera system props with appropriate defaults
  followTerrain = true,
  lookAheadDistance = 8192, // Distance ahead to look at (0 = straight down, large = straight ahead)
  heightVariation = 0,
  heightVariationFrequency = 0.25,
  terrainQuality = 2,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Tile management constants (maintainability)
  const TILE_RECYCLING_THRESHOLD = 0.75; // How far behind camera before recycling (in tile units)
  const TILE_BUFFER_DISTANCE = 1.5; // Extra tiles to keep in front of camera (in tile units)
  const GAP_DETECTION_ENABLED = true; // Enable gap detection and emergency tile creation
  const MAX_TILES_PER_FRAME_RECYCLE = 2; // Limit recycling operations per frame for performance
  
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

    const cameraFarPlane = 20000;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 1, cameraFarPlane);
    camera.position.y = cameraHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    
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
      return terrainEquation === 'additive'
        ? (Math.cos(worldX * terrainFrequency + seed) + Math.cos(worldZ * terrainFrequency + seed)) * terrainAmplitude * 0.5
        : Math.cos(worldX * terrainFrequency + seed) * Math.cos(worldZ * terrainFrequency + seed) * terrainAmplitude;
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
    };

    for (let i = 0; i < tilesX; i++) {
      for (let j = 0; j < tilesZ; j++) {
        terrainTiles.push(generateTerrainTile(i - Math.floor(tilesX / 2), j - Math.floor(tilesZ / 2)));
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
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
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
      requestAnimationFrame(animate);
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
        
        // Simply look at the terrain surface at the specified distance
        // Distance 0 = look straight down, large distance = look nearly straight ahead
        const lookAtPoint = new THREE.Vector3(
          lookAheadX,
          lookAheadTerrainHeight,
          lookAheadZ
        );
        
        camera.lookAt(lookAtPoint);
      } else {
        // Maintain original fixed-height behavior for backward compatibility
        camera.position.y = cameraHeight;
      }

      // Quality-based tile recycling system with gap prevention
      let recycledThisFrame = 0;
      
      terrainTiles.forEach(tile => {
        // Limit recycling operations per frame for performance
        if (recycledThisFrame >= MAX_TILES_PER_FRAME_RECYCLE) return;
        
        // Recycle tiles that are well behind the camera
        const recycleThreshold = terrainScale * TILE_RECYCLING_THRESHOLD;
        if (camera.position.z < tile.position.z - recycleThreshold) {
          const newTileZ = tile.position.z - terrainScale * tilesZ;
          tile.position.z = newTileZ;
          recycledThisFrame++;
          
          // Quality 2: Regenerate geometry for true continuous terrain
          if (terrainQuality >= 2) {
            const tileX = tile.position.x / terrainScale;
            const tileZ = newTileZ / terrainScale;
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
      window.removeEventListener('resize', onWindowResize);
      if (mountRef.current) {
        if (fpsElement) {
          mountRef.current.removeChild(fpsElement);
        }
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [seed, speed, cameraHeight, terrainFrequency, terrainAmplitude, meshResolution, tilesX, tilesZ, fov, terrainScale, terrainEquation, showFPS, followTerrain, lookAheadDistance, heightVariation, heightVariationFrequency, terrainQuality]);

  return <div ref={mountRef} className={className} />;
};

export default CosineTerrainCard;

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
  hiddenLineRemoval?: boolean;
  terrainEquation?: 'multiplicative' | 'additive';
  showFPS?: boolean;
}

const CosineTerrainCard: React.FC<CosineTerrainCardProps> = ({
  className,
  seed = 0,
  speed = 4200,
  cameraHeight = 1800,
  terrainFrequency = 0.0002,
  terrainAmplitude = 3800,
  meshResolution = 12,
  tilesX = 20,
  tilesZ = 32,
  fov = 60,
  terrainScale = 2048,
  hiddenLineRemoval = false,
  terrainEquation = 'additive',
  showFPS = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

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

    // Create material based on hidden line removal setting
    const material = hiddenLineRemoval 
      ? new THREE.MeshBasicMaterial({ 
          color: 0x00ff00, 
          wireframe: true,
          side: THREE.FrontSide,
          transparent: false,
          depthTest: true,
          depthWrite: true
        })
      : new THREE.MeshBasicMaterial({ 
          color: 0x00ff00, 
          wireframe: true,
          depthTest: false,
          depthWrite: false
        });
    
    const terrainTiles: THREE.Mesh[] = [];

    const generateTerrainTile = (tileX: number, tileZ: number) => {
      const geometry = new THREE.PlaneGeometry(terrainScale, terrainScale, meshResolution - 1, meshResolution - 1);
      geometry.rotateX(-Math.PI / 2);
      
      const positions = geometry.attributes.position as THREE.BufferAttribute;
      const vertex = new THREE.Vector3();

      for (let i = 0; i < positions.count; i++) {
        vertex.fromBufferAttribute(positions, i);

        const worldX = vertex.x + tileX * terrainScale;
        const worldZ = vertex.z + tileZ * terrainScale;

        const y = terrainEquation === 'additive'
          ? (Math.cos(worldX * terrainFrequency + seed) + Math.cos(worldZ * terrainFrequency + seed)) * terrainAmplitude * 0.5
          : Math.cos(worldX * terrainFrequency + seed) * Math.cos(worldZ * terrainFrequency + seed) * terrainAmplitude;
        positions.setY(i, y);
      }
      
      positions.needsUpdate = true;
      geometry.computeVertexNormals();

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(tileX * terrainScale, 0, tileZ * terrainScale);
      scene.add(mesh);
      return mesh;
    };

    for (let i = 0; i < tilesX; i++) {
      for (let j = 0; j < tilesZ; j++) {
        terrainTiles.push(generateTerrainTile(i - Math.floor(tilesX / 2), j - Math.floor(tilesZ / 2)));
      }
    }

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
      
      camera.position.z -= delta * speed; 

      terrainTiles.forEach(tile => {
        if (camera.position.z < tile.position.z - terrainScale / 2) {
            tile.position.z -= terrainScale * tilesZ;
            // We would regenerate the tile geometry here for true continuous terrain
        }
      });

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
  }, [seed, speed, cameraHeight, terrainFrequency, terrainAmplitude, meshResolution, tilesX, tilesZ, fov, terrainScale, hiddenLineRemoval, terrainEquation, showFPS]);

  return <div ref={mountRef} className={className} />;
};

export default CosineTerrainCard;

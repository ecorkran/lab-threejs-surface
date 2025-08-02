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
}

const CosineTerrainCard: React.FC<CosineTerrainCardProps> = ({
  className,
  seed = 0,
  speed = 2500,
  cameraHeight = 2800,
  terrainFrequency = 0.04,
  terrainAmplitude = 196,
  meshResolution = 16,
  tilesX = 16,
  tilesZ = 15,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const terrainSize = 2000;
    const worldWidth = meshResolution, worldDepth = meshResolution;
    const cameraFarPlane = 20000;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, cameraFarPlane);
    camera.position.y = cameraHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    const terrainTiles: THREE.Mesh[] = [];

    const generateTerrainTile = (tileX: number, tileZ: number) => {
      const geometry = new THREE.PlaneGeometry(terrainSize, terrainSize, worldWidth - 1, worldDepth - 1);
      geometry.rotateX(-Math.PI / 2);
      const position = geometry.attributes.position as THREE.BufferAttribute;
      position.usage = THREE.DynamicDrawUsage;

      const halfWorldWidth = worldWidth / 2;
      for (let i = 0; i < position.count; i++) {
        const x = (i % worldWidth) + tileX * (worldWidth -1);
        const z = Math.floor(i / worldWidth) + tileZ * (worldDepth - 1);
        const y = (Math.cos(x * terrainFrequency + seed) * Math.cos(z * terrainFrequency + seed) * halfWorldWidth + halfWorldWidth) * terrainAmplitude;
        position.setY(i, y);
      }
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(tileX * terrainSize, 0, tileZ * terrainSize);
      scene.add(mesh);
      return mesh;
    };

    for (let i = 0; i < tilesX; i++) {
      for (let j = 0; j < tilesZ; j++) {
        terrainTiles.push(generateTerrainTile(i - tilesX / 2, j - tilesZ / 2));
      }
    }

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', onWindowResize);

    let lastTime = performance.now();
    const animate = () => {
      requestAnimationFrame(animate);
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      
      camera.position.z -= delta * speed; 

      terrainTiles.forEach(tile => {
        if (camera.position.z < tile.position.z - terrainSize / 2) {
            tile.position.z -= terrainSize * tilesZ;
            // We would regenerate the tile geometry here for true continuous terrain
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', onWindowResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [seed, speed, cameraHeight, terrainFrequency, terrainAmplitude, meshResolution]);

  return <div ref={mountRef} className={className} />;
};

export default CosineTerrainCard;

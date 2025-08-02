"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { calculateTerrainHeight } from '@/lib/utils/terrainMath';
import { useTheme } from '@/context/themecontext';
import { useTerrainGenerator } from '@/hooks/useTerrainGenerator';

export interface CosineTerrainCardProps {
  className?: string;
  speed?: number;
  surfaceDetail?: number;
  waveFrequency?: number;
  height?: number;
}

const CosineTerrainCard: React.FC<CosineTerrainCardProps> = ({
  className = '',
  speed = 1.0,
  surfaceDetail = 1,
  waveFrequency = 1.0,
  height = 30
}) => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const planeSize = 200;
  const planeSegments = 200;
  // Generate smoother terrain: lower frequency and reduced amplitude
  const smoothFreq = waveFrequency * 0.1;
  const smoothAmp = height * 0.1;
  const geometry = useTerrainGenerator(planeSize, planeSegments, smoothFreq, smoothAmp);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!geometry) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    const bgColor = theme === 'dark' ? 0x000000 : 0xffffff;
    renderer.setClearColor(bgColor);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(bgColor);

    const camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    // Start at left edge of terrain
    camera.position.set(-planeSize / 2, height, 0);

    // Terrain geometry
    const material = new THREE.MeshBasicMaterial({
      color: theme === 'dark' ? 0x00ff00 : 0x000000,
      wireframe: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    // Position mesh centered
    mesh.position.set(0, 0, 0);
    mesh.rotation.x = -Math.PI / 2;
    scene.add(mesh);

    const clock = new THREE.Clock();
    let animationId: number;
    const animate = () => {
      const delta = clock.getDelta();
      // Move camera forward along X axis
      camera.position.x += delta * speed;

      // Sample terrain height at camera X,Z position
      const terrainY = calculateTerrainHeight(
        camera.position.x,
        camera.position.z,
        waveFrequency,
        height
      );

      // Smooth camera Y to follow terrain without sharp jumps
      const targetY = terrainY + height;
      
      // Small lerp factor for gentle motion (never drops below surface)
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.02);
      camera.lookAt(camera.position.x + 1, camera.position.y, camera.position.z);
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      cancelAnimationFrame(animationId);
      material.dispose();
      renderer.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [theme, geometry]);

  return <canvas ref={canvasRef} className={`${className} w-full h-full block`} />;
};

export default CosineTerrainCard;
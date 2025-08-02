import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { generateTerrainSegment } from '@/lib/utils/terrainMath';

export function useTerrainGenerator(
  size: number = 100,
  segments: number = 64,
  frequency: number = 1.0,
  amplitude: number = 5.0
): THREE.BufferGeometry | null {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    const geom = generateTerrainSegment(size, segments, frequency, amplitude);
    setGeometry(geom);
    return () => {
      geom.dispose();
    };
  }, [size, segments, frequency, amplitude]);

  return geometry;
}
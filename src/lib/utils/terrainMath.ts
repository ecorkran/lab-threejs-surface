import * as THREE from 'three';

export function calculateTerrainHeight(x: number, z: number, frequency: number = 0.02, amplitude: number = 50): number {
  return Math.cos(x * frequency) * Math.cos(z * frequency) * amplitude;
}

import * as THREE from 'three';

const pool: Record<string, THREE.BufferGeometry[]> = {};

export function acquireGeometry(key: string): THREE.BufferGeometry {
  if (pool[key]?.length) {
    return pool[key].pop()!;
  }
  return new THREE.BufferGeometry();
}

export function releaseGeometry(key: string, geometry: THREE.BufferGeometry): void {
  if (!pool[key]) {
    pool[key] = [];
  }
  pool[key].push(geometry);
}
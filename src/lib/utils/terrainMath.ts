import * as THREE from 'three';

export function calculateTerrainHeight(x: number, z: number, frequency: number = 1.0, amplitude: number = 3): number {
  // Combine cosine waves multiplicatively and apply amplitude
  return Math.cos(x * frequency) * Math.cos(z * frequency) * amplitude;
}

export function generateTerrainSegment(size: number, segments: number, frequency: number = 1.0, amplitude: number = 5.0): THREE.BufferGeometry {
  const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
  const position = geometry.attributes.position as THREE.BufferAttribute;
  const vertex = new THREE.Vector3();

  for (let i = 0; i < position.count; i++) {
    vertex.fromBufferAttribute(position, i);
    const heightY = calculateTerrainHeight(vertex.x, vertex.y, frequency, amplitude);
    position.setZ(i, heightY);
  }

  geometry.computeVertexNormals();
  return geometry;
}
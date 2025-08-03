import * as THREE from 'three';

export interface TileManagerConfig {
  terrainScale: number;
  tilesZ: number;
  recyclingThreshold: number;
  bufferDistance: number;
  maxRecyclePerFrame: number;
  gapDetectionEnabled: boolean;
}

export interface TerrainCalculator {
  (worldX: number, worldZ: number): number;
}

export class TerrainTileManager {
  private config: TileManagerConfig;
  private tiles: THREE.Mesh[] = [];
  private calculateHeight: TerrainCalculator;

  constructor(config: TileManagerConfig, heightCalculator: TerrainCalculator) {
    this.config = config;
    this.calculateHeight = heightCalculator;
  }

  addTile(tile: THREE.Mesh): void {
    this.tiles.push(tile);
  }

  getTiles(): THREE.Mesh[] {
    return this.tiles;
  }

  recycleTiles(camera: THREE.Camera, regenerateGeometry?: (tile: THREE.Mesh, tileX: number, tileZ: number) => void): number {
    let recycledCount = 0;
    const recycleThreshold = this.config.terrainScale * this.config.recyclingThreshold;

    this.tiles.forEach(tile => {
      if (recycledCount >= this.config.maxRecyclePerFrame) return;

      const distanceBehindCamera = tile.position.z - camera.position.z;
      
      if (distanceBehindCamera > recycleThreshold) {
        const newTileZ = tile.position.z - (this.config.terrainScale * this.config.tilesZ);
        tile.position.z = newTileZ;
        recycledCount++;

        if (regenerateGeometry) {
          const tileX = tile.position.x / this.config.terrainScale;
          const tileZ = newTileZ / this.config.terrainScale;
          regenerateGeometry(tile, tileX, tileZ);
        }
      }
    });

    return recycledCount;
  }

  detectAndFillGaps(camera: THREE.Camera, scene: THREE.Scene, material: THREE.Material, generateTileFn: (tileX: number, tileZ: number) => THREE.Mesh): void {
    if (!this.config.gapDetectionEnabled) return;

    const cameraZ = camera.position.z;
    const frontmostZ = cameraZ - (this.config.bufferDistance * this.config.terrainScale);
    
    const tilesInFront = this.tiles.filter(tile => 
      tile.position.z <= frontmostZ && 
      tile.position.z >= frontmostZ - (this.config.tilesZ * this.config.terrainScale)
    );
    
    const expectedTilesInFront = Math.min(this.config.tilesZ, Math.ceil(this.config.bufferDistance * 2));
    if (tilesInFront.length < expectedTilesInFront * 0.8) {
      const frontmostTile = this.tiles.reduce((front, tile) => 
        tile.position.z < front.position.z ? tile : front
      );
      
      const emergencyTileZ = frontmostTile.position.z - this.config.terrainScale;
      const emergencyTileX = 0;
      
      console.warn(`Gap detected! Creating emergency tile at Z: ${emergencyTileZ}`);
      const newTile = generateTileFn(emergencyTileX, emergencyTileZ / this.config.terrainScale);
      this.addTile(newTile);
    }
  }

  logDebugInfo(camera: THREE.Camera, time: number): void {
    const shouldLog = Math.floor(time / 5000) !== Math.floor((time - 16.67) / 5000); // ~60fps assumption
    
    if (shouldLog) {
      const tilePositions = this.tiles.map(t => t.position.z).sort((a, b) => a - b);
      const minZ = Math.min(...tilePositions);
      const maxZ = Math.max(...tilePositions);
      const expectedSpan = this.config.terrainScale * (this.config.tilesZ - 1);
      
      console.log(`T=${Math.floor(time/1000)}s: Camera Z=${camera.position.z.toFixed(0)}, Tiles Z range=[${minZ.toFixed(0)} to ${maxZ.toFixed(0)}], Total span=${(maxZ - minZ).toFixed(0)}, Expected span=${expectedSpan.toFixed(0)}`);
    }
  }
}
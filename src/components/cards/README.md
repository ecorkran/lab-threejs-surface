# CosineTerrainCard Component

## Overview

The `CosineTerrainCard` is a React component that renders a dynamic, fly-over 3D terrain visualization using Three.js. The terrain is generated using a cosine-based algorithm and is designed to give the illusion of an endless landscape by recycling terrain tiles as the camera moves forward.

The component is highly configurable, allowing for control over the terrain's appearance, the camera's behavior, and the performance of the simulation.

## Props

| Prop               | Type     | Default    | Description                                                                                                                              |
| ------------------ | -------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `className`        | `string` | `''`       | Standard CSS class name to apply to the container element.                                                                               |
| `seed`             | `number` | `0`        | A seed value for the terrain generation algorithm. Changing this value will produce a completely different, unique landscape.              |
| `speed`            | `number` | `2500`     | The speed at which the camera flies forward over the terrain.                                                                            |
| `cameraHeight`     | `number` | `1800`     | The height of the camera above the terrain's zero-plane.                                                                                 |
| `fov`              | `number` | `60`       | The vertical Field of View of the camera, in degrees. Affects the perspective and how much of the scene is visible.                      |
| `terrainFrequency` | `number` | `0.0002`   | Controls the frequency of the cosine waves that generate the terrain. Lower values create smoother, wider mountains.                     |
| `terrainAmplitude` | `number` | `3800`     | The amplitude (height) of the mountains. This is the primary control for the vertical scale of the terrain.                              |
| `meshResolution`   | `number` | `8`        | The resolution of each terrain tile's mesh (e.g., a value of 8 creates an 8x8 grid of vertices per tile).                                 |
| `tilesX`           | `number` | `20`       | The number of terrain tiles to render along the X-axis (width).                                                                          |
| `tilesZ`           | `number` | `32`       | The number of terrain tiles to render along the Z-axis (depth).                                                                          |

## Advanced Concepts

### Terrain Density (`meshResolution` vs. `terrainSize`)

The visual density, or "tightness," of the wireframe mesh is determined by the relationship between `meshResolution` and the internal `terrainSize` variable.

-   `meshResolution` defines how many vertices are in each tile's grid.
-   `terrainSize` (currently hard-coded) defines the physical size of that tile in the 3D world.

If you have a high `meshResolution` and a small `terrainSize`, the wireframe will be very dense. Conversely, a low `meshResolution` stretched over a large `terrainSize` will result in a coarse, "low-poly" appearance where individual polygons are large.

### Continuous Generation and Seams

The component creates the illusion of an endless world by arranging tiles in a grid and recycling them. When the camera moves past a tile, that tile is moved from the back of the grid to the front.

A notable limitation of the current implementation is that the tile's geometry is **not** recalculated when it is moved. This means the terrain pattern does not truly continue. As a result, you may see visible seams or discontinuities at the edges where a recycled tile meets an existing one. True seamless generation would require regenerating the geometry for each tile as it is recycled.

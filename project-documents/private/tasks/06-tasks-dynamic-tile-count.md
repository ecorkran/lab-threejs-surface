# Phase 4: Dynamic Tile Count - Task Expansion

## Dynamic Viewport-Based Tile Count

- [ ] **Implement viewport-based tile calculation**
  - [ ] **Add a function to calculate the required horizontal tile count.**
    - This function should take `viewportWidth`, `fov`, and `cameraHeight` as inputs.
    - Use the formula: `viewWidth = 2 * Math.tan((fov * Math.PI / 180) / 2) * cameraHeight`
    - Calculate tiles needed: `Math.ceil(viewWidth / terrainScale)`
    - Return the calculated tiles plus a buffer (e.g., 4 extra tiles, with a minimum of 8).
  - [ ] **Integrate the calculation into the component.**
    - Get the viewport width from the `mountRef.current.clientWidth`.
    - Call the new function to get the optimal `tilesX` count.
    - Use this dynamic value instead of the fixed prop value for `tilesX` when generating the terrain.
  - [ ] **Success**: The number of horizontal terrain tiles (`tilesX`) automatically adjusts to the component's width, ensuring full coverage with a performance-optimized count.

## Distance-Based Line Dimming

- [ ] **Implement distance-based alpha fade for wireframe material**
  - [ ] **This feature requires a custom shader.** For now, we will create a placeholder.
  - [ ] **Create a new `ShaderMaterial`**.
    - Vertex shader should calculate the distance from the camera to the vertex.
    - Pass this distance as a `varying` to the fragment shader.
  - [ ] **In the fragment shader, calculate alpha.**
    - Use `smoothstep` to fade the line's alpha based on the distance.
    - Example: `alpha = 1.0 - smoothstep(fadeStart, fadeEnd, vDistance);`
    - Add configurable props: `fadeStartDistance`, `fadeEndDistance`.
  - [ ] **Note**: As a simpler alternative, we could create multiple materials with different opacities and apply them to tiles based on distance, but a shader is more efficient.
  - [ ] **Success**: Distant terrain wireframes appear dimmer, creating a sense of depth and preventing distant geometry from looking like a solid green block.

## Enhanced Gap Detection and Buffering

- [ ] **Improve the gap detection and tile buffering system**
  - [ ] **Refine the `detectAndFillGaps` function.**
    - Instead of just checking density, create a map or Set of expected tile coordinates in front of the camera.
    - Iterate through existing tiles and remove them from the expected set.
    - Any remaining coordinates in the set are actual gaps.
  - [ ] **Implement predictive tile creation.**
    - Based on the camera's velocity vector, pre-emptively create tiles in the direction of movement before they are strictly needed.
    - This will act as a pre-loading buffer.
  - [ ] **Success**: Visible gaps during flight are completely eliminated, even with aggressive camera movements or problematic terrain frequencies.
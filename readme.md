# Infinite 3D Cosine Terrain Generator

> A realtime 3D visualization that procedurally generates infinite rolling terrain using cosine-based mathematical functions, built with Three.js and Next.js.

---

## 🌊 What is this?
The Cosine Terrain Generator creates an infinite, animated 3D landscape in your browser using mathematical cosine functions. Unlike pre-recorded videos, every frame is calculated and rendered in realtime, creating smooth 120fps animations of rolling hills that extend infinitely in all directions. The terrain adapts dynamically to your device screen size.  Look for controls you can experiment with soon!  

---

## 🛠 How was it made?
This project was built using two powerful development tools:
- **[manta-templates](https://github.com/manta-digital/manta-templates)** - A modern Next.js template with Tailwind CSS, ShadCN UI, and Three.js support
- **[ai-project-guide](https://github.com/ecorkran/ai-project-guide)** - AI-assisted development methodology that guided the project architecture and implementation

The combination enabled rapid prototyping and iterative development of complex 3D mathematics and rendering optimizations.

---

## 🚀 Developer Quick Start
```bash
# Clone the repository
git clone https://github.com/ecorkran/lab-threejs-surface.git
cd lab-threejs-surface

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the terrain generator in action.

---

## ✨ Features
- **Realtime 3D Rendering** - Every frame calculated live using Three.js
- **Infinite Terrain** - Seamless, endless landscape generation
- **Responsive Design** - Adapts to any screen size and orientation
- **120fps Performance** - Smooth animations on modern devices
- **Mathematical Precision** - Cosine-based algorithms for natural terrain shapes
- **Dark/Light Mode** - Full theme support with system preference detection

---

## 🎯 Technical Details

### Terrain Generation Algorithm
The terrain uses a cosine-based mathematical function to generate natural-looking rolling hills. The core algorithm calculates height values using `y = a*cos(ix) + b*cos(jz)` where:

- `i` and `j` control wave frequency (higher values = faster waves)
- `a` and `b` control wave amplitude (height) in each direction
- The combination creates organic, rolling terrain patterns

### Component Configuration
The `CosineTerrainCard` component is highly configurable:

| Parameter | Default | Description |
|-----------|---------|-------------|
| `seed` | `0` | Seed value for terrain generation - different values create unique landscapes |
| `speed` | `2400` | Camera movement speed over the terrain |
| `cameraHeight` | `3600` | Height of camera above terrain zero-plane |
| `terrainFrequency` | `0.000113` | Wave frequency - lower values create smoother, wider hills |
| `terrainAmplitude` | `2400` | Wave height - primary control for vertical terrain scale |
| `meshResolution` | `8` | Vertices per tile (8x8 grid) - affects visual detail |
| `fov` | `60` | Camera field of view in degrees |

### Performance Optimizations
**Infinite Terrain Illusion**: The system creates endless landscapes by arranging tiles in a grid and recycling them. When the camera moves past a tile, that tile is repositioned from the back to the front of the grid.

**Responsive Tile Management**: The number of terrain tiles automatically adjusts based on:
- Screen aspect ratio (wider screens get more tiles horizontally)
- Device capabilities (mobile devices use fewer tiles for optimal performance)
- Viewing distance (far clip plane determines maximum visible terrain)

**Current Limitations**: Tile geometry is not recalculated during recycling, which can occasionally create visible seams where recycled tiles meet existing ones. Future versions will implement true seamless generation.

---

## 📱 FAQ

### How did you make the video for this site?
It's not a video! The terrain is being generated in realtime based on mathematical formulas. Every frame you see is calculated and rendered live in your browser using WebGL and Three.js.

### Does it work on mobile devices?
Yes! The terrain generator automatically adjusts the number of tiles and mesh resolution based on your device capabilities and screen size for optimal performance.

---

## 🚀 Deployment
This project is deployed on Vercel and can be viewed at: [https://terrain.erikcorkran.com](https://terrain.erikcorkran.com)

---

## 🤝 Contributing
Contributions are welcome! This project demonstrates advanced Three.js techniques and mathematical terrain generation - perfect for learning or extending.

---

## 📄 License
MIT License - see the [LICENSE](LICENSE) file for details.
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

*[Placeholder for detailed technical information]*

### Terrain Generation Algorithm
*Coming soon - detailed explanation of the cosine-based terrain mathematics*

### Performance Optimizations  
*Coming soon - tile management, geometry recycling, and rendering techniques*

### Responsive Tile Calculation
*Coming soon - aspect ratio-based tile count optimization*

---

## 📱 FAQ

### How did you make the video for this site?
It's not a video! The terrain is being generated in realtime based on mathematical formulas. Every frame you see is calculated and rendered live in your browser using WebGL and Three.js.

### Does it work on mobile devices?
Yes! The terrain generator automatically adjusts the number of tiles and mesh resolution based on your device capabilities and screen size for optimal performance.

---

## 🚀 Deployment

This project is deployed on Vercel and can be viewed at: [https://terrain.erikcorkran.com](https://terrain.erikcorkran.com)

To deploy your own instance:
```bash
# Build for production
pnpm build

# Deploy to your preferred platform (Vercel, Netlify, etc.)
```

---

## 🤝 Contributing

Contributions are welcome! This project demonstrates advanced Three.js techniques and mathematical terrain generation - perfect for learning or extending.

---

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.
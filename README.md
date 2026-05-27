<div align="center">

```
 ╔══════════════════════════════════════════════════════╗
 ║                                                      ║
 ║        ★  வி க்னேஷ்  ★   VIGNESH'S TEA KADAI        ║
 ║                                                      ║
 ║         An immersive 3D developer portfolio          ║
 ║                                                      ║
 ╚══════════════════════════════════════════════════════╝
```

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Portfolio-e8a020?style=for-the-badge&logo=github)](https://vignesh2027.github.io/portfolio-vignesh/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=three.js)](https://threejs.org)
[![Built with Love](https://img.shields.io/badge/Built%20with-☕%20Tea-8b2500?style=for-the-badge)](https://github.com/vignesh2027)
[![Author](https://img.shields.io/badge/Author-Vignesh%20S-amber?style=for-the-badge&logo=github)](https://github.com/vignesh2027)

</div>

---

## ☕ About

A **Tamil tea stall (கடை)** themed interactive 3D portfolio — built entirely with Three.js procedural geometry (no external 3D models). Step into a cozy night-time tea kadai and explore Vignesh's projects, skills, and contact.

**Inspired by** [Jesse Zhou's Ramen Shop](https://github.com/enderh3art/Ramen-Shop) — same immersive 3D architecture, different flavour.

---

## 🎮 How to Explore

| Interaction | Action |
|---|---|
| **Drag** | Orbit around the kadai |
| **Scroll** | Zoom in / out |
| **Click the Chalkboard** | Browse all 7 projects |
| **Click the Photo Frame** | About me |
| **Click the Contact Sign** | GitHub & email |
| **Nav buttons (bottom)** | Direct access to sections |
| **ESC** | Close any open panel |

---

## 🏗️ Tech Stack

```
Three.js        →  3D scene (100% procedural geometry, no external models)
GSAP            →  Smooth camera transitions & animations
Webpack 5       →  Bundler
Canvas API      →  Dynamic sign & board textures
CSS3            →  Tea-brewing loading animation & UI overlays
GitHub Actions  →  Auto-deploy to GitHub Pages on push to main
```

---

## 🍵 Projects Showcased

| Tea Name | Project | Stack |
|---|---|---|
| ☕ Masala C++ | **Game of DSA** | C++ · Raylib |
| 🌌 Cosmos Chai | **NEXUS Cosmic Intelligence** | Three.js · Firebase · WebGL |
| 💙 Care Tea | **SparshCare** | Flutter · Firebase · Eye Tracking |
| 🤖 AI Blend | **SYNTHRON** | Python · Multi-agent AI |
| 🔍 RAG Brew | **VORTEXRAG** | Python · 7-layer RAG |
| ⚙️ Rust Kadha | **rustkvd** | Rust · Raft · LSM · gRPC |
| ⏱ Flux Decoction | **FluxDB** | Rust · Time-series DB |

---

## 🚀 Run Locally

```bash
git clone https://github.com/vignesh2027/portfolio-vignesh.git
cd portfolio-vignesh
npm install --legacy-peer-deps
npm run dev
# → http://localhost:8080
```

**Production build:**
```bash
npm run build
# Output: ./dist/
```

---

## 📁 Project Structure

```
portfolio-vignesh/
├── src/
│   ├── script.js               # Entry point
│   ├── index.html              # HTML shell + overlay panels
│   ├── style.css               # Warm amber/brown theme
│   └── Experience/
│       ├── Experience.js       # Singleton orchestrator
│       ├── Camera.js           # Perspective cam + GSAP transitions
│       ├── Renderer.js         # WebGL renderer (ACES filmic)
│       ├── PreLoader.js        # Tea-brewing loading screen
│       ├── Controller.js       # UI / overlay logic
│       ├── RayCaster.js        # Click / touch interaction
│       ├── sources.js          # Asset manifest (empty — procedural only)
│       ├── Utils/
│       │   ├── EventEmitter.js
│       │   ├── Sizes.js
│       │   ├── Time.js
│       │   ├── Debug.js        # lil-gui (#debug hash)
│       │   └── Resources.js
│       └── World/
│           ├── World.js
│           ├── TeaKadai.js     # 3D stall — counter, cups, lanterns, signs
│           ├── Environment.js  # Lantern lights + moonlight + fog
│           ├── Materials.js    # PBR materials palette
│           ├── Animations.js   # Lantern flicker + idle sway
│           └── SteamParticles.js  # Particle steam from cups & kettle
├── bundler/
│   ├── webpack.common.js
│   ├── webpack.dev.js
│   └── webpack.prod.js
└── .github/
    └── workflows/
        └── deploy.yml          # Auto-deploy to GitHub Pages
```

---

## 🌐 Deployment

Every push to `main` automatically:
1. Installs dependencies
2. Runs `npm run build`
3. Publishes `./dist` to the `gh-pages` branch via GitHub Actions

**Live at:** `https://vignesh2027.github.io/portfolio-vignesh/`

---

## 🔧 Debug Mode

Append `#debug` to the URL to enable the lil-gui debug panel:
```
http://localhost:8080/#debug
```

---

<div align="center">

**Made with ☕ and Three.js by [Vignesh S](https://github.com/vignesh2027)**

*"Every great project starts with a cup of tea."*

</div>

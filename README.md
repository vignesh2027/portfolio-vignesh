<div align="center">


<br/>

```
 ╔══════════════════════════════════════════════════════════════╗
 ║                                                              ║
 ║     ☕  வி க்னேஷ்வர்  ☕    VIGNESHWAR'S TEA KADAI          ║
 ║                                                              ║
 ║       An immersive 3D developer portfolio — built with       ║
 ║       Three.js, procedural geometry, and a lot of chai       ║
 ║                                                              ║
 ╚══════════════════════════════════════════════════════════════╝
```

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-Visit%20Portfolio-E8A020?style=for-the-badge)](https://vignesh2027.github.io/portfolio-vignesh/)
[![Three.js](https://img.shields.io/badge/Three.js-r175-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org)
[![WebGL](https://img.shields.io/badge/WebGL-Procedural%20Only-990000?style=for-the-badge&logo=webgl)](https://www.khronos.org/webgl/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[![GitHub](https://img.shields.io/badge/GitHub-vignesh2027-181717?style=for-the-badge&logo=github)](https://github.com/vignesh2027)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-vigneshwar--s-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/vigneshwar-s)
[![Dev.to](https://img.shields.io/badge/Dev.to-vignesh2027-0A0A0A?style=for-the-badge&logo=devdotto)](https://dev.to/vignesh2027)

</div>

---

## ☕ What is this?

**A fully interactive 3D tea stall (கடை) that IS my portfolio.**

Step into a cozy night-time Tamil tea kadai — look around 360°, walk up to the counter, click on tea cups to explore projects, read the chalkboard menu, check the TV screen for commit logs, and step outside to see panels on the building wall. No flat PDFs. No boring grids. Just a kadai.

> Built entirely with **Three.js procedural geometry** — zero external 3D model files (no `.glb`, no `.gltf`). Every wall, counter, cup, lantern, rain drop, and sign is drawn in code.

**[→ Enter the Kadai](https://vignesh2027.github.io/portfolio-vignesh/)**

---

## 👨‍💻 About Me — Vigneshwar L

| | |
|---|---|
| 🎓 | B.Tech Computer Science · Takshashila University · 2022–2026 · Chennai |
| 🤖 | ML Researcher — RAG Systems, LLM Orchestration, Vector DBs, NLP Pipelines |
| ⚙ | Systems Builder — Rust (Raft, LSM, gRPC), Distributed KV, Time-Series DBs |
| ☁ | Cloud Engineer — AWS, GCP, Docker, Kubernetes, Firebase, CI/CD |
| 🌐 | Creative Tech — Three.js / WebGL, Flutter, FastAPI, Immersive 3D |
| 📬 | [applemacbook6sep2004@gmail.com](mailto:applemacbook6sep2004@gmail.com) |

---

## 🚀 Live Preview

<div align="center">

| View | Description |
|---|---|
| **Default** | Start inside the kadai, facing the counter and chalkboard |
| **360° Orbit** | Drag to look in any direction — ceiling to floor, inside to outside |
| **Outside** | Zoom out to see the building facade and street |
| **Projects** | Click any tea cup on the counter — each is a project |
| **Info Panels** | Left wall (Skills), Right wall (GitHub), Back wall (About, Research, Contact) |
| **Facade Panels** | About Me and GitHub Stats mounted on the building's outside wall |

</div>

---

## 🏗️ Architecture — 100% Procedural WebGL

Everything you see is built from **primitive geometry + Canvas API textures**. No Blender, no model files.

```
Three.js r175
├── BoxGeometry, CylinderGeometry, PlaneGeometry, SphereGeometry  → all meshes
├── THREE.CanvasTexture + Canvas 2D API                           → all signs/boards/text
├── THREE.Points (BufferGeometry)                                 → rain particles + stars
├── THREE.PointLight × 4 + DirectionalLight × 3                  → night lighting
├── THREE.FogExp2                                                 → rain-haze atmosphere
├── OrbitControls + GSAP                                          → smooth camera transitions
└── Web Audio API (no files)                                      → procedural rain sound
```

### Scene Graph

```
Scene
├── Interior
│   ├── Floor (tile texture), Walls (plaster), Ceiling (wood beams)
│   ├── Counter + Stove (emissive glow)
│   ├── 7× Tea Cups (project cups, info cards on hover/click)
│   ├── Chalkboard (project menu), About Frame, Research Frame, Contact Sign
│   ├── Skills Wall (left), GitHub Wall (right), TV Screen (animated git log)
│   ├── Lanterns (point lights, organic flicker), String lights
│   ├── Window, Plants, Decorations
│   └── Steam Particles (kettle + cups)
├── Exterior
│   ├── Entrance (canopy, columns, building sign, neon OPEN sign)
│   ├── Facade Panels (About Me + GitHub Stats — on the building's front wall)
│   ├── Wet street, Sidewalks, Street lamps
│   ├── Exterior side walls, Opposite building (CYBER MART)
│   └── Star field
└── Atmosphere
    ├── Rain (500 particles, velocity-based)
    ├── Rain sound (Web Audio API — white noise + bandpass filter)
    └── Exponential fog
```

---

## 🍵 Projects in the Kadai

Each tea cup on the counter represents one project. Click to open a deep-dive panel.

| Cup | Project | Stack | Live |
|---|---|---|---|
| ☕ **Masala C++** | [Game of DSA](https://github.com/vignesh2027/Game-of-DSA) | C++ · Raylib · WebAssembly · Emscripten | [▶ Play](https://vignesh2027.github.io/Game-of-DSA) |
| 🌌 **Cosmos Chai** | [NEXUS Cosmic Intelligence](https://github.com/vignesh2027/cosmic-intelligence) | Three.js · Firebase · Newsdata.io · WebGL | — |
| 💙 **Care Tea** | [SparshCare](https://github.com/vignesh2027/sparshcare) | Flutter · Firebase · Riverpod · Eye Tracking | — |
| 🤖 **AI Blend** | [SYNTHRON](https://github.com/vignesh2027/synthron) | Python · Multi-Agent · LLM Orchestration | [▶ Docs](https://vignesh2027.github.io/synthron) |
| 🌀 **RAG Brew** | [VORTEXRAG](https://github.com/vignesh2027/VORTEXRAG) | Python · FAISS · LangChain · 7-layer RAG | — |
| ⚙ **Rust Kadha** | [rustkvd](https://github.com/vignesh2027/rustkvd) | Rust · Raft · LSM Tree · gRPC · Tokio | [▶ Docs](https://vignesh2027.github.io/rustkvd) |
| 📊 **Flux Decoction** | [FluxDB](https://github.com/vignesh2027/fluxdb) | Rust · Time-series · Delta compression · 100+ tests | [▶ Docs](https://vignesh2027.github.io/fluxdb) |

---

## 🧠 Research Highlights

### VORTEXRAG — Novel 7-Layer RAG Framework
A production-grade Retrieval Augmented Generation framework that solves two critical failure modes:
- **Semantic Drift** — queries shift away from the original intent across retrieval hops
- **Context Poisoning** — irrelevant chunks degrade generation quality

Achieves **94% retrieval precision** on standard RAG benchmarks. 7 specialised layers:
`Query Expansion → Dense Retrieval → Sparse Retrieval → Cross-Encoder Re-ranking → Context Compression → Drift Detection → Generation Guard`

### Distributed Systems
- **rustkvd** — Full Raft consensus (leader election, log replication, snapshotting) + LSM tree storage + gRPC client, all in async Rust (Tokio)
- **FluxDB** — Time-series database from scratch: custom binary format, delta + RLE compression, retention policies, 100+ passing tests

### Healthcare AI
- **SparshCare** — ICU patient communication for non-verbal patients. 4-language support, eye-tracking input, admin dashboard, 50-file Flutter codebase, Firebase real-time sync

---

## 🎮 Controls

| Input | Action |
|---|---|
| **Drag / touch-drag** | Orbit 360° (full spherical — ceiling to floor) |
| **Scroll / pinch** | Zoom in (min 1.2m) / out (max 22m — sees full exterior) |
| **Click any object** | Open that section's panel |
| **ESC** | Close panel / return to default view |
| **R** | Reset camera to default position |
| **A** | Jump to About section |
| **C** | Jump to Contact section |
| **P** | Jump to Projects list |
| **T** | Toggle day / night theme |

---

## ⚡ Tech Stack

<div align="center">

![Three.js](https://img.shields.io/badge/Three.js-r175-black?logo=three.js&style=flat-square)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?logo=javascript&logoColor=black&style=flat-square)
![Webpack](https://img.shields.io/badge/Webpack-5-8DD6F9?logo=webpack&logoColor=black&style=flat-square)
![GSAP](https://img.shields.io/badge/GSAP-3.12-88CE02?logo=greensock&logoColor=black&style=flat-square)
![Canvas API](https://img.shields.io/badge/Canvas_API-2D_Textures-E34F26?style=flat-square)
![Web Audio](https://img.shields.io/badge/Web_Audio_API-Rain_Sound-FF6B35?style=flat-square)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-Deployed-222?logo=github&style=flat-square)

</div>

| Layer | Technology | Purpose |
|---|---|---|
| **3D Engine** | Three.js r175 | Scene, geometry, lights, materials, renderer |
| **Camera** | OrbitControls + GSAP | 360° orbit, smooth animated transitions |
| **Rendering** | WebGL (ACESFilmic tone mapping) | HDR-like quality, high-performance mode |
| **Textures** | Canvas 2D API | All signs, boards, panels — generated in JS |
| **Animation** | requestAnimationFrame | Rain, steam, lantern flicker, TV updates |
| **Audio** | Web Audio API | Rain sound — white noise + bandpass filter, no files |
| **Bundler** | Webpack 5 | Code splitting, asset hashing, GitHub Pages config |
| **Interaction** | THREE.Raycaster | Mouse/touch click detection on 3D meshes |
| **UI** | Vanilla CSS3 | Overlays, loading screen, cursor, theme toggle |

---

## 🚀 Run Locally

```bash
# Clone
git clone https://github.com/vignesh2027/portfolio-vignesh.git
cd portfolio-vignesh

# Install
npm install

# Dev server (hot reload)
npm run dev
# → http://localhost:8080

# Production build
npm run build
# → ./dist/
```

**Debug mode** (lil-gui inspector):
```
http://localhost:8080/#debug
```

---

## 📁 Project Structure

```
portfolio-vignesh/
├── src/
│   ├── script.js                  # Entry point
│   ├── index.html                 # HTML shell — overlays, loading screen
│   ├── style.css                  # Warm amber/brown theme + cursor + panels
│   └── Experience/
│       ├── Experience.js          # Singleton orchestrator
│       ├── Camera.js              # PerspectiveCamera + GSAP transitions
│       ├── Renderer.js            # WebGLRenderer — ACES filmic, no shadows
│       ├── PreLoader.js           # Tea-brewing loading animation
│       ├── Controller.js          # Panel/overlay logic, keyboard shortcuts
│       ├── RayCaster.js           # Click + touch interaction on 3D objects
│       ├── sources.js             # Asset manifest (empty — all procedural)
│       ├── Utils/
│       │   ├── EventEmitter.js    # Pub/sub event system
│       │   ├── Sizes.js           # Viewport + pixelRatio (debounced resize)
│       │   ├── Time.js            # rAF clock
│       │   ├── Debug.js           # lil-gui (#debug flag)
│       │   └── Resources.js       # Asset loader
│       └── World/
│           ├── World.js           # World initialisation
│           ├── TeaKadai.js        # 2100+ line main scene file
│           │                      #   Interior: walls, counter, cups, signs, TV
│           │                      #   Exterior: facade, street, lamps, CYBER MART
│           │                      #   Atmosphere: rain, stars, sound
│           ├── Environment.js     # Lights (3 directional + 4 point) + fog
│           ├── Materials.js       # Shared PBR materials palette
│           ├── Animations.js      # Per-frame update dispatcher
│           └── SteamParticles.js  # Particle steam (5 sources)
├── static/
│   └── vignesh.jpg                # Profile photo (loaded async into canvas)
├── bundler/
│   ├── webpack.common.js          # Shared config — loaders, CopyPlugin
│   ├── webpack.dev.js             # Dev server
│   └── webpack.prod.js            # Production — content hash, publicPath './'
└── dist/                          # Built output (served from gh-pages branch)
```

---

## 🌐 Deployment

Manually deployed via git worktree pattern (clean `gh-pages` branch):

```bash
TMPDIR=$(mktemp -d)
git worktree add "$TMPDIR" gh-pages
npm run build
cp -r dist/* "$TMPDIR/"
cd "$TMPDIR" && git add -A && git commit -m "deploy" && git push origin gh-pages
```

**Live at:** [vignesh2027.github.io/portfolio-vignesh](https://vignesh2027.github.io/portfolio-vignesh/)

---

## 🔑 Key Engineering Decisions

| Decision | Why |
|---|---|
| **Zero 3D model files** | No GLTF/GLB loading = instant load, no external dependencies, full creative control |
| **Canvas API for all text** | Dynamic text (git log, live time, project info) without font/geometry overhead |
| **Shadow maps disabled** | 60fps on mid-range devices; emissive materials + careful light placement compensate |
| **autoClearColor via scene.background** | Eliminates "black frame flash" between GL clear and first draw |
| **will-change: transform on canvas** | Forces dedicated GPU compositor layer — no flicker when JS is busy |
| **Resize debounced 150ms** | Prevents mobile address-bar show/hide from triggering rapid setSize() clears |
| **Rain update every 2nd frame** | Halves buffer upload cost; 500 particles is visually indistinguishable from 1200 |
| **TV canvas 256×160, update every 8s** | Eliminates ~640KB GPU texture stall that caused black flash every 2s |
| **PointLights limited to 4** | Each PointLight multiplies fragment shader cost; 4 is the sweet spot for warmth vs perf |

---

<div align="center">

**Made with ☕ and Three.js by [Vigneshwar L](https://github.com/vignesh2027)**

*"Every great project starts with a cup of tea."*

[![GitHub stars](https://img.shields.io/github/stars/vignesh2027/portfolio-vignesh?style=social)](https://github.com/vignesh2027/portfolio-vignesh/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/vignesh2027/portfolio-vignesh?style=social)](https://github.com/vignesh2027/portfolio-vignesh/network/members)

</div>

import Experience from './Experience.js'

// ── Project data ────────────────────────────────────────
const PROJECTS = {
    'project-dsa': {
        name:  'Game of DSA',
        emoji: '🎮',
        color: '#D4A017',
        tech:  ['C++', 'Raylib', 'WebAssembly', 'Emscripten'],
        about: 'An interactive browser-playable game that teaches Data Structures & Algorithms through gameplay — sorting visualisations, pathfinding mazes, graph traversal challenges, all compiled to WebAssembly via Emscripten.',
        links: [
            { label: '▶ Play Live',    href: 'https://vignesh2027.github.io/Game-of-DSA' },
            { label: '⌥ Source Code',  href: 'https://github.com/vignesh2027/Game-of-DSA' },
        ],
        highlights: ['Real-time DSA visualisation', 'Runs in browser via WASM', 'Raylib graphics engine', 'GitHub Pages deployment'],
    },
    'project-nexus': {
        name:  'NEXUS Cosmic Intelligence',
        emoji: '🌌',
        color: '#2E6B9A',
        tech:  ['Three.js', 'WebGL', 'Firebase', 'Newsdata.io', 'Webz.io'],
        about: 'An immersive 3D universe dashboard that maps world events to cosmic bodies. News events become supernovae; trending topics orbit as planets. Built with Three.js WebGL and real-time news APIs.',
        links: [
            { label: '⌥ Source Code', href: 'https://github.com/vignesh2027/cosmic-intelligence' },
        ],
        highlights: ['Real-time news as 3D events', 'Procedural galaxy generation', 'Firebase real-time sync', 'Particle storm animations'],
    },
    'project-sparsh': {
        name:  'SparshCare',
        emoji: '🏥',
        color: '#8B2020',
        tech:  ['Flutter', 'Firebase', 'Riverpod', 'Dart'],
        about: 'A 50-file Flutter ICU patient communication system for patients who cannot speak. Supports 4 languages, 6 communication card categories, an admin dashboard, and eye-tracking input. Designed for real hospital use.',
        links: [
            { label: '⌥ Source Code', href: 'https://github.com/vignesh2027/sparshcare' },
        ],
        highlights: ['ICU patient communication', '4 language support', 'Eye-tracking input', 'Admin panel & analytics'],
    },
    'project-synth': {
        name:  'SYNTHRON Framework',
        emoji: '🤖',
        color: '#2A6B30',
        tech:  ['Python', 'LLM', 'Multi-Agent', 'API orchestration'],
        about: 'A Python multi-agent AI orchestration framework where specialised agents collaborate to decompose complex tasks, route sub-problems, and synthesise responses — with memory persistence and tool-use capabilities.',
        links: [
            { label: '▶ Docs',        href: 'https://vignesh2027.github.io/synthron' },
            { label: '⌥ Source Code', href: 'https://github.com/vignesh2027/synthron' },
        ],
        highlights: ['Multi-agent task decomposition', 'LLM orchestration layer', 'Memory persistence', 'Tool-use framework'],
    },
    'project-vortex': {
        name:  'VORTEXRAG',
        emoji: '🌀',
        color: '#6B2A8B',
        tech:  ['Python', 'FAISS', 'LangChain', 'RAG', 'Semantic Search'],
        about: 'A novel 7-layer RAG framework that solves semantic drift and context poisoning — two critical failure modes in production RAG systems. Achieves 94% retrieval precision on evaluation benchmarks.',
        links: [
            { label: '⌥ Source Code', href: 'https://github.com/vignesh2027/VORTEXRAG' },
        ],
        highlights: ['7-layer retrieval pipeline', 'Semantic drift prevention', 'Context poisoning guard', '94% retrieval precision'],
    },
    'project-rust': {
        name:  'rustkvd',
        emoji: '⚙',
        color: '#B04010',
        tech:  ['Rust', 'Raft', 'LSM Tree', 'gRPC', 'Tokio'],
        about: 'A distributed key-value store built from scratch in Rust, implementing the Raft consensus algorithm for leader election & log replication, LSM tree for storage, and gRPC for client communication.',
        links: [
            { label: '▶ Docs',        href: 'https://vignesh2027.github.io/rustkvd' },
            { label: '⌥ Source Code', href: 'https://github.com/vignesh2027/rustkvd' },
        ],
        highlights: ['Raft consensus algorithm', 'LSM tree storage engine', 'gRPC client interface', 'Async Tokio runtime'],
    },
    'project-flux': {
        name:  'FluxDB',
        emoji: '📊',
        color: '#2B608B',
        tech:  ['Rust', 'Time-series', 'Storage engine', 'Compression'],
        about: 'A complete time-series database engine built from scratch in Rust — custom storage format, delta + run-length encoding, retention policies, aggregation queries, and 100+ passing tests.',
        links: [
            { label: '▶ Docs',        href: 'https://vignesh2027.github.io/-FLUXDB' },
            { label: '⌥ Source Code', href: 'https://github.com/vignesh2027/fluxdb' },
        ],
        highlights: ['Custom time-series format', 'Delta + RLE compression', 'Retention policies', '100+ tests passing'],
    },
}

const ABOUT_HTML = `
<div class="info-panel">
    <div class="ip-hero" style="background:linear-gradient(135deg,#1A0A00,#3D2210)">
        <div class="ip-avatar">V</div>
        <h2>Vignesh S</h2>
        <p class="ip-role">CS Student · Chennai · Builder</p>
    </div>
    <div class="ip-body">
        <p class="ip-bio">I build systems that matter — from distributed databases in Rust to Flutter apps for ICU patients, 7-layer RAG pipelines to immersive 3D worlds. Currently in 3rd year B.Tech Computer Science.</p>

        <h3>⚙ Technical Skills</h3>
        <div class="tag-row">
            <span class="tag">Rust</span><span class="tag">Python</span><span class="tag">C++</span>
            <span class="tag">Dart/Flutter</span><span class="tag">JavaScript</span><span class="tag">Go</span>
        </div>
        <div class="tag-row" style="margin-top:8px">
            <span class="tag">Three.js</span><span class="tag">FastAPI</span><span class="tag">Tokio</span>
            <span class="tag">Firebase</span><span class="tag">Raft</span><span class="tag">FAISS</span>
        </div>

        <h3>🎓 Education</h3>
        <p class="ip-item">B.Tech Computer Science Engineering<br><span class="ip-sub">Takshashila University · 2022 – 2026</span></p>

        <h3>🧠 Interests</h3>
        <div class="tag-row">
            <span class="tag">Systems Programming</span><span class="tag">AI/ML & RAG</span>
            <span class="tag">3D Graphics</span><span class="tag">Distributed Systems</span>
            <span class="tag">Healthcare Tech</span><span class="tag">Competitive Programming</span>
        </div>

        <h3>🎯 Hobbies</h3>
        <p class="ip-item">Reading tech papers · Chess · Building side projects · Open-source contributions · Photography · Gaming</p>
    </div>
    <div class="ip-footer">
        <a class="pd-link" href="https://github.com/vignesh2027" target="_blank">🐙 GitHub</a>
        <a class="pd-link" href="mailto:applemacbook6sep2004@gmail.com" target="_blank">📧 Email</a>
        <a class="pd-link" href="https://linkedin.com/in/vigneshwar-s" target="_blank">💼 LinkedIn</a>
        <a class="pd-link" href="https://vignesh2027.github.io/portfolio-vignesh" target="_blank">🌐 Portfolio</a>
    </div>
</div>`

const RESEARCH_HTML = `
<div class="info-panel">
    <div class="ip-hero" style="background:linear-gradient(135deg,#050D02,#0D2008)">
        <h2 style="color:#FFF5E0">📜 Research & Papers</h2>
        <p class="ip-role">Published & Submitted Works · 2024 – 2025</p>
    </div>
    <div class="ip-body">
        ${[
            { t: 'VORTEXRAG: Towards Drift-Free Retrieval Augmented Generation', sub: 'Proposes a 7-layer retrieval pipeline that prevents semantic drift and context poisoning. Achieves 94% retrieval precision on standard RAG benchmarks.', tag: 'AI/ML · RAG Systems · 2024', href: 'https://github.com/vignesh2027/VORTEXRAG' },
            { t: 'Distributed KV Store with Raft Consensus in Rust', sub: 'Systems paper on implementing a production-grade distributed KV store. Covers Raft leader election, log replication, LSM tree storage, and fault tolerance.', tag: 'Distributed Systems · Rust · 2024', href: 'https://github.com/vignesh2027/rustkvd' },
            { t: 'SparshCare: Multi-Modal ICU Communication System', sub: 'HCI paper on designing a communication aid for non-verbal ICU patients. 4-language support, eye tracking, and caregiver dashboard.', tag: 'HCI · Healthcare · Flutter · 2024', href: 'https://github.com/vignesh2027/sparshcare' },
            { t: 'FluxDB: Time-Series Storage Engine from First Principles', sub: 'Design and implementation of a custom time-series database in Rust, covering delta compression, retention policies, and aggregation queries.', tag: 'Databases · Systems · Rust · 2025', href: 'https://github.com/vignesh2027/fluxdb' },
        ].map(p => `
        <div class="research-card">
            <h3 class="rc-title">${p.t}</h3>
            <p class="rc-body">${p.sub}</p>
            <span class="rc-tag">${p.tag}</span>
            <br><a class="pd-link" href="${p.href}" target="_blank" style="margin-top:10px;display:inline-block">View Project →</a>
        </div>`).join('')}
    </div>
</div>`

const CONTACT_HTML = `
<div class="info-panel">
    <div class="ip-hero" style="background:linear-gradient(135deg,#1A0A00,#2E1A08)">
        <h2 style="color:#FFF5E0">☕  Get In Touch</h2>
        <p class="ip-role">Open to collaborations, internships & cool ideas</p>
    </div>
    <div class="ip-body" style="text-align:center">
        <div class="contact-grid">
            <a class="contact-card" href="https://github.com/vignesh2027" target="_blank">
                <span class="cc-icon">🐙</span>
                <span class="cc-label">GitHub</span>
                <span class="cc-val">vignesh2027</span>
            </a>
            <a class="contact-card" href="mailto:applemacbook6sep2004@gmail.com">
                <span class="cc-icon">📧</span>
                <span class="cc-label">Email</span>
                <span class="cc-val">Gmail</span>
            </a>
            <a class="contact-card" href="https://linkedin.com/in/vigneshwar-s" target="_blank">
                <span class="cc-icon">💼</span>
                <span class="cc-label">LinkedIn</span>
                <span class="cc-val">vigneshwar-s</span>
            </a>
            <a class="contact-card" href="https://vignesh2027.github.io/portfolio-vignesh" target="_blank">
                <span class="cc-icon">🌐</span>
                <span class="cc-label">Portfolio</span>
                <span class="cc-val">vignesh2027.github.io</span>
            </a>
            <a class="contact-card" href="https://dev.to/vignesh2027" target="_blank">
                <span class="cc-icon">✍</span>
                <span class="cc-label">Dev.to</span>
                <span class="cc-val">@vignesh2027</span>
            </a>
        </div>
        <p style="color:rgba(255,245,224,0.5);font-style:italic;margin-top:28px;font-size:14px">
            Based in Chennai, India · Open to remote work globally
        </p>
    </div>
</div>`

const PROJECTS_LIST_HTML = `
<div class="info-panel">
    <div class="ip-hero" style="background:linear-gradient(135deg,#0A1A07,#0D2008)">
        <h2 style="color:#FFF5E0">☕  Projects Menu</h2>
        <p class="ip-role">7 Brews — click any cup in the scene to dive deep</p>
    </div>
    <div class="ip-body">
        <div class="proj-grid">
            ${Object.entries(PROJECTS).map(([key, p]) => `
            <div class="proj-card-mini" style="border-color:${p.color}33">
                <span class="pcm-emoji">${p.emoji}</span>
                <div>
                    <strong style="color:#FFF5E0">${p.name}</strong><br>
                    <span style="color:rgba(255,245,224,0.5);font-size:13px">${p.tech.slice(0, 3).join(' · ')}</span>
                </div>
            </div>`).join('')}
        </div>
        <p style="color:rgba(255,245,224,0.45);font-style:italic;text-align:center;margin-top:20px;font-size:13px">
            Orbit the scene and click the coloured tea cups on the counter to explore each project
        </p>
    </div>
</div>`


export default class Controller {
    constructor() {
        this.experience   = new Experience()
        this.camera       = this.experience.camera
        this.currentPanel = null

        this.initCursor()
        this.initThemeToggle()
        this.bindNav()
        this.bindCloseButtons()
        this.bindKeyboard()
        this.bindBackButton()
    }

    // ── Custom cursor ──────────────────────────────────
    initCursor() {
        this.cursorEl = document.getElementById('cursor')
        this.ringEl   = document.getElementById('cursor-ring')
        if (!this.cursorEl) return

        let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my

        document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY })

        const anim = () => {
            rx += (mx - rx) * 0.13
            ry += (my - ry) * 0.13
            if (this.cursorEl) { this.cursorEl.style.left = mx + 'px'; this.cursorEl.style.top = my + 'px' }
            if (this.ringEl)   { this.ringEl.style.left   = rx + 'px'; this.ringEl.style.top  = ry + 'px' }
            requestAnimationFrame(anim)
        }
        anim()
    }

    setHovering(v, label) {
        document.body.classList.toggle('hovering', v)
        const zl = document.getElementById('zone-label')
        if (zl) {
            if (v && label) {
                zl.textContent = label
                zl.classList.remove('hidden')
            } else {
                zl.classList.add('hidden')
            }
        }
    }

    // ── Theme toggle ───────────────────────────────────
    initThemeToggle() {
        const html  = document.documentElement
        const saved = localStorage.getItem('tk-theme') || 'night'
        html.dataset.theme = saved

        const apply = () => {
            const icon    = document.getElementById('theme-icon')
            const isNight = html.dataset.theme === 'night'
            if (icon) icon.textContent = isNight ? '🌙' : '☀️'
            this.applySceneTheme(html.dataset.theme)
        }
        apply()

        const toggle = () => {
            html.dataset.theme = html.dataset.theme === 'night' ? 'day' : 'night'
            localStorage.setItem('tk-theme', html.dataset.theme)
            apply()
        }

        document.getElementById('theme-toggle')?.addEventListener('click', toggle)
    }

    applySceneTheme(theme) {
        const exp = this.experience
        if (!exp.renderer?.instance) return
        if (theme === 'day') {
            exp.renderer.instance.setClearColor('#2E1608')
            exp.renderer.instance.toneMappingExposure = 1.6
        } else {
            exp.renderer.instance.setClearColor('#050203')
            exp.renderer.instance.toneMappingExposure = 1.1
        }
    }

    // ── Panel management ───────────────────────────────
    openPanel(id, html) {
        if (this.currentPanel && this.currentPanel !== id) this.closePanel(this.currentPanel, false)

        let el = document.getElementById(id)
        if (!el) {
            // Use the generic detail-overlay for dynamic content
            el = document.getElementById('detail-overlay')
            if (!el) return
            const content = document.getElementById('detail-content')
            if (content) content.innerHTML = html || ''
            el.id = id  // rebrand so close knows
        } else if (html) {
            const content = el.querySelector('#detail-content, .detail-content')
            if (content) content.innerHTML = html
        }

        el.classList.remove('hidden')
        this.currentPanel = id

        // Show back button
        document.getElementById('back-btn')?.classList.remove('hidden')
    }

    openDetailOverlay(html) {
        const overlay = document.getElementById('detail-overlay')
        const content = document.getElementById('detail-content')
        if (!overlay || !content) return
        content.innerHTML = html
        overlay.classList.remove('hidden')
        this.currentPanel = 'detail-overlay'
        document.getElementById('back-btn')?.classList.remove('hidden')
    }

    closePanel(id, returnCamera = true) {
        // Always try to close detail-overlay if ids don't match
        const el = document.getElementById(id) || document.getElementById('detail-overlay')
        if (el) el.classList.add('hidden')
        if (this.currentPanel === id || this.currentPanel === 'detail-overlay') this.currentPanel = null
        if (returnCamera) this.camera.transitionTo('default')
        document.getElementById('back-btn')?.classList.add('hidden')
    }

    handleAction(action) {
        // Zoom camera
        this.camera.transitionTo(action)

        // Build content
        if (action === 'projects') {
            this.openDetailOverlay(PROJECTS_LIST_HTML)
        } else if (action === 'about') {
            this.openDetailOverlay(ABOUT_HTML)
        } else if (action === 'research') {
            this.openDetailOverlay(RESEARCH_HTML)
        } else if (action === 'contact') {
            this.openDetailOverlay(CONTACT_HTML)
        } else if (PROJECTS[action]) {
            this.openDetailOverlay(this.buildProjectHTML(action))
        }
    }

    buildProjectHTML(action) {
        const p = PROJECTS[action]
        if (!p) return ''
        return `
<div class="project-detail">
    <div class="pd-hero" style="background:linear-gradient(135deg,${p.color}22,${p.color}44)">
        <div class="pd-icon">${p.emoji}</div>
        <h2>${p.name}</h2>
        <div class="pd-tags">
            ${p.tech.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
    </div>
    <div class="pd-body">
        <p>${p.about}</p>
        <h3>✦ Highlights</h3>
        <ul class="pd-highlights">
            ${p.highlights.map(h => `<li>${h}</li>`).join('')}
        </ul>
    </div>
    <div class="pd-footer">
        ${p.links.map(l => `<a class="pd-link" href="${l.href}" target="_blank">${l.label}</a>`).join('')}
    </div>
</div>`
    }

    // ── Back button ────────────────────────────────────
    bindBackButton() {
        const btn = document.getElementById('back-btn')
        if (!btn) return
        btn.addEventListener('click', () => {
            if (this.currentPanel) {
                this.closePanel(this.currentPanel, true)
            } else {
                this.camera.transitionTo('default')
                btn.classList.add('hidden')
            }
        })
    }

    // ── Top nav (no-op in pure 3D mode) ───────────────
    bindNav() {}

    // ── Close buttons ──────────────────────────────────
    bindCloseButtons() {
        document.getElementById('detail-close')?.addEventListener('click', () => {
            this.closePanel('detail-overlay')
        })
        document.getElementById('detail-overlay')?.addEventListener('click', e => {
            if (e.target === document.getElementById('detail-overlay')) this.closePanel('detail-overlay')
        })
    }

    // ── Keyboard ───────────────────────────────────────
    bindKeyboard() {
        document.addEventListener('keydown', e => {
            if (e.target.tagName === 'INPUT') return
            switch (e.key.toLowerCase()) {
                case 'escape':
                    if (this.currentPanel) {
                        this.closePanel(this.currentPanel)
                    } else {
                        this.camera.transitionTo('default')
                        document.getElementById('back-btn')?.classList.add('hidden')
                    }
                    break
                case 'r':
                    this.camera.transitionTo('default')
                    if (this.currentPanel) this.closePanel(this.currentPanel, false)
                    document.getElementById('back-btn')?.classList.add('hidden')
                    break
                case 'p': this.handleAction('projects'); break
                case 'a': this.handleAction('about');    break
                case 'c': this.handleAction('contact');  break
                case 't': {
                    const html = document.documentElement
                    html.dataset.theme = html.dataset.theme === 'night' ? 'day' : 'night'
                    localStorage.setItem('tk-theme', html.dataset.theme)
                    this.applySceneTheme(html.dataset.theme)
                    const icon = document.getElementById('theme-icon')
                    if (icon) icon.textContent = html.dataset.theme === 'night' ? '🌙' : '☀️'
                    break
                }
            }
        })
    }
}

import Experience from './Experience.js'

export default class Controller {
    constructor() {
        this.experience = new Experience()
        this.camera = this.experience.camera

        this.currentPanel = null

        this.initCursor()
        this.bindNav()
        this.bindCloseButtons()
        this.bindKeyboard()
    }

    // ── Custom cursor ──────────────────────────────────
    initCursor() {
        this.cursor = document.getElementById('cursor')
        this.cursorRing = document.getElementById('cursor-ring')
        if (!this.cursor) return

        let mx = window.innerWidth / 2
        let my = window.innerHeight / 2
        let rx = mx, ry = my

        document.addEventListener('mousemove', e => {
            mx = e.clientX
            my = e.clientY
        })

        const animate = () => {
            // Ring lags behind cursor
            rx += (mx - rx) * 0.14
            ry += (my - ry) * 0.14
            if (this.cursor) {
                this.cursor.style.left = mx + 'px'
                this.cursor.style.top  = my + 'px'
            }
            if (this.cursorRing) {
                this.cursorRing.style.left = rx + 'px'
                this.cursorRing.style.top  = ry + 'px'
            }
            requestAnimationFrame(animate)
        }
        animate()
    }

    setHovering(state) {
        document.body.classList.toggle('hovering', state)
    }

    // ── Open / close panels ────────────────────────────
    openPanel(id) {
        if (this.currentPanel && this.currentPanel !== id) {
            this.closePanel(this.currentPanel, false)
        }
        const el = document.getElementById(id)
        if (!el) return
        el.classList.remove('hidden')
        this.currentPanel = id
        this.updateNavActive(id)
    }

    closePanel(id, returnCamera = true) {
        const el = document.getElementById(id)
        if (el) el.classList.add('hidden')
        if (this.currentPanel === id) this.currentPanel = null
        if (returnCamera) this.camera.transitionTo('default')
        this.updateNavActive(null)
    }

    updateNavActive(panelId) {
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'))
        const map = {
            'overlay-projects': 'nav-projects',
            'overlay-about':    'nav-about',
            'overlay-contact':  'nav-contact'
        }
        if (panelId && map[panelId]) {
            document.getElementById(map[panelId])?.classList.add('active')
        }
    }

    // ── Action dispatcher ──────────────────────────────
    handleAction(action) {
        const actionMap = {
            projects: { cam: 'menuBoard', panel: 'overlay-projects' },
            about:    { cam: 'about',     panel: 'overlay-about'    },
            contact:  { cam: 'contact',   panel: 'overlay-contact'  }
        }
        const entry = actionMap[action]
        if (!entry) return
        this.camera.transitionTo(entry.cam)
        this.openPanel(entry.panel)
    }

    // ── Nav ────────────────────────────────────────────
    bindNav() {
        document.getElementById('nav-projects')?.addEventListener('click', () => this.handleAction('projects'))
        document.getElementById('nav-about')   ?.addEventListener('click', () => this.handleAction('about'))
        document.getElementById('nav-contact') ?.addEventListener('click', () => this.handleAction('contact'))
    }

    // ── Close buttons ──────────────────────────────────
    bindCloseButtons() {
        document.querySelectorAll('.overlay-close').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.dataset.close) this.closePanel(btn.dataset.close)
            })
        })
        // Backdrop click
        document.querySelectorAll('.overlay-panel').forEach(panel => {
            panel.addEventListener('click', e => {
                if (e.target === panel) this.closePanel(panel.id)
            })
        })
    }

    // ── Keyboard ───────────────────────────────────────
    bindKeyboard() {
        document.addEventListener('keydown', e => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
            switch (e.key.toLowerCase()) {
                case 'escape': if (this.currentPanel) this.closePanel(this.currentPanel); break
                case 'p': this.handleAction('projects'); break
                case 'a': this.handleAction('about');    break
                case 'c': this.handleAction('contact');  break
            }
        })
    }
}

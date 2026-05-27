import Experience from './Experience.js'
import gsap from 'gsap'

export default class Controller {
    constructor() {
        this.experience = new Experience()
        this.camera = this.experience.camera

        this.currentPanel = null

        this.bindNav()
        this.bindCloseButtons()
    }

    // ── Open / close panels ────────────────────────────
    openPanel(id) {
        // Close current one first
        if (this.currentPanel && this.currentPanel !== id) {
            this.closePanel(this.currentPanel, false)
        }

        const el = document.getElementById(id)
        if (!el) return
        el.classList.remove('hidden')
        this.currentPanel = id
    }

    closePanel(id, returnCamera = true) {
        const el = document.getElementById(id)
        if (el) el.classList.add('hidden')
        if (this.currentPanel === id) this.currentPanel = null
        if (returnCamera) {
            this.camera.transitionTo('default')
        }
    }

    // ── Action dispatcher (from RayCaster) ────────────
    handleAction(action) {
        switch (action) {
            case 'projects':
                this.camera.transitionTo('menuBoard')
                this.openPanel('overlay-projects')
                break
            case 'about':
                this.camera.transitionTo('about')
                this.openPanel('overlay-about')
                break
            case 'contact':
                this.camera.transitionTo('contact')
                this.openPanel('overlay-contact')
                break
        }
    }

    // ── Nav buttons ────────────────────────────────────
    bindNav() {
        const navProjects = document.getElementById('nav-projects')
        const navAbout    = document.getElementById('nav-about')
        const navContact  = document.getElementById('nav-contact')

        navProjects?.addEventListener('click', () => this.handleAction('projects'))
        navAbout?.addEventListener('click',    () => this.handleAction('about'))
        navContact?.addEventListener('click',  () => this.handleAction('contact'))
    }

    // ── Close buttons on overlays ──────────────────────
    bindCloseButtons() {
        document.querySelectorAll('.overlay-close').forEach(btn => {
            btn.addEventListener('click', () => {
                const panelId = btn.dataset.close
                if (panelId) this.closePanel(panelId)
            })
        })

        // Close on backdrop click (outside the panel content)
        document.querySelectorAll('.overlay-panel').forEach(panel => {
            panel.addEventListener('click', e => {
                if (e.target === panel) this.closePanel(panel.id)
            })
        })

        // Keyboard ESC
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && this.currentPanel) {
                this.closePanel(this.currentPanel)
            }
        })
    }
}

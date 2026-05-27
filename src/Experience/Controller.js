import Experience from './Experience.js'

export default class Controller {
    constructor() {
        this.experience  = new Experience()
        this.camera      = this.experience.camera
        this.currentPanel = null

        this.initCursor()
        this.initThemeToggle()
        this.initScrollAnimations()
        this.initProjectFilter()
        this.bindNav()
        this.bindCloseButtons()
        this.bindKeyboard()
        this.bindFloatNav()
    }

    // ── Custom cursor ──────────────────────────────────
    initCursor() {
        this.cursorEl  = document.getElementById('cursor')
        this.ringEl    = document.getElementById('cursor-ring')
        if (!this.cursorEl) return

        let mx = innerWidth/2, my = innerHeight/2, rx = mx, ry = my

        document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY })

        const anim = () => {
            rx += (mx - rx) * 0.13; ry += (my - ry) * 0.13
            if (this.cursorEl) { this.cursorEl.style.left = mx+'px'; this.cursorEl.style.top = my+'px' }
            if (this.ringEl)   { this.ringEl.style.left   = rx+'px'; this.ringEl.style.top  = ry+'px' }
            requestAnimationFrame(anim)
        }
        anim()
    }

    setHovering(v) { document.body.classList.toggle('hovering', v) }

    // ── Theme toggle ───────────────────────────────────
    initThemeToggle() {
        const html = document.documentElement
        const saved = localStorage.getItem('tk-theme') || 'night'
        html.dataset.theme = saved

        const apply = () => {
            const t2 = document.getElementById('theme-toggle-2')
            const isNight = html.dataset.theme === 'night'
            if (t2) t2.textContent = isNight ? '🌙' : '☀️'
            // 3D scene lighting change
            this.applySceneTheme(html.dataset.theme)
        }
        apply()

        const toggle = () => {
            html.dataset.theme = html.dataset.theme === 'night' ? 'day' : 'night'
            localStorage.setItem('tk-theme', html.dataset.theme)
            apply()
        }

        document.getElementById('theme-toggle')  ?.addEventListener('click', toggle)
        document.getElementById('theme-toggle-2') ?.addEventListener('click', toggle)
    }

    applySceneTheme(theme) {
        const exp = this.experience
        if (!exp.renderer?.instance) return
        if (theme === 'day') {
            exp.renderer.instance.setClearColor('#3A2510')
            exp.renderer.instance.toneMappingExposure = 1.5
        } else {
            exp.renderer.instance.setClearColor('#1A0E05')
            exp.renderer.instance.toneMappingExposure = 1.2
        }
    }

    // ── Scroll-triggered fade-in animations ───────────
    initScrollAnimations() {
        const els = document.querySelectorAll('.fade-in')
        if (!els.length) return

        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible')
                    obs.unobserve(e.target)
                }
            })
        }, { threshold: 0.12 })

        els.forEach(el => obs.observe(el))
    }

    // ── Project filter ─────────────────────────────────
    initProjectFilter() {
        const bar = document.getElementById('filter-bar')
        if (!bar) return
        bar.addEventListener('click', e => {
            const btn = e.target.closest('.filter-btn')
            if (!btn) return
            bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'))
            btn.classList.add('active')
            const f = btn.dataset.filter
            document.querySelectorAll('#featured-grid .proj-card').forEach(card => {
                const show = f === 'all' || card.dataset.cat === f
                card.classList.toggle('hidden-proj', !show)
            })
        })
    }

    // ── Panel open/close ───────────────────────────────
    openPanel(id) {
        if (this.currentPanel && this.currentPanel !== id) this.closePanel(this.currentPanel, false)
        const el = document.getElementById(id)
        if (!el) return
        el.classList.remove('hidden')
        this.currentPanel = id
    }

    closePanel(id, returnCamera = true) {
        document.getElementById(id)?.classList.add('hidden')
        if (this.currentPanel === id) this.currentPanel = null
        if (returnCamera) this.camera.transitionTo('default')
    }

    handleAction(action) {
        const map = {
            projects: { cam: 'menuBoard', panel: 'overlay-projects' },
            about:    { cam: 'about',     panel: 'overlay-about'    },
            contact:  { cam: 'contact',   panel: 'overlay-contact'  }
        }
        const entry = map[action]
        if (!entry) return
        this.camera.transitionTo(entry.cam)
        this.openPanel(entry.panel)
    }

    // ── Float nav (3D mode) ────────────────────────────
    bindFloatNav() {
        document.querySelectorAll('[data-panel]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.panel
                if (id === 'overlay-projects') this.handleAction('projects')
                else if (id === 'overlay-about') this.handleAction('about')
                else if (id === 'overlay-contact') this.handleAction('contact')
            })
        })
    }

    // ── Top nav smooth scroll ──────────────────────────
    bindNav() {
        document.querySelectorAll('.tnav-link').forEach(a => {
            a.addEventListener('click', e => {
                const href = a.getAttribute('href')
                if (!href?.startsWith('#')) return
                const target = document.querySelector(href)
                if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }) }
            })
        })
        // Active nav link on scroll
        const sections = document.querySelectorAll('section[id]')
        const navLinks = document.querySelectorAll('.tnav-link')
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    navLinks.forEach(l => l.classList.remove('active'))
                    document.querySelector(`.tnav-link[href="#${e.target.id}"]`)?.classList.add('active')
                }
            })
        }, { threshold: 0.4 })
        sections.forEach(s => obs.observe(s))
    }

    // ── Close buttons ──────────────────────────────────
    bindCloseButtons() {
        document.querySelectorAll('.overlay-close').forEach(btn => {
            btn.addEventListener('click', () => { if (btn.dataset.close) this.closePanel(btn.dataset.close) })
        })
        document.querySelectorAll('.overlay-panel').forEach(p => {
            p.addEventListener('click', e => { if (e.target === p) this.closePanel(p.id) })
        })
    }

    // ── Keyboard ───────────────────────────────────────
    bindKeyboard() {
        document.addEventListener('keydown', e => {
            if (e.target.tagName === 'INPUT') return
            switch (e.key.toLowerCase()) {
                case 'escape': if (this.currentPanel) this.closePanel(this.currentPanel); break
                case 'p': this.handleAction('projects'); break
                case 'a': this.handleAction('about');    break
                case 'c': this.handleAction('contact');  break
                case 't':
                    const html = document.documentElement
                    html.dataset.theme = html.dataset.theme === 'night' ? 'day' : 'night'
                    localStorage.setItem('tk-theme', html.dataset.theme)
                    this.applySceneTheme(html.dataset.theme)
                    break
            }
        })
    }
}

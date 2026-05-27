import EventEmitter from './Utils/EventEmitter.js'
import Experience from './Experience.js'

export default class PreLoader extends EventEmitter {
    constructor() {
        super()
        this.experience    = new Experience()
        this.brewingEl     = document.getElementById('brewing')
        this.progressEl    = document.getElementById('progressPercentage')
        this.progressFill  = document.getElementById('brew-fill')
        this.startBtn      = document.querySelector('.start-btn')
        this.overlayEl     = document.querySelector('.fade-overlay')
        this.floatNav      = document.getElementById('float-nav')
        this.hint3d        = document.getElementById('hint-3d')
        this.scrollArrow   = document.getElementById('scroll-arrow')
        this.shortcutsEl   = document.getElementById('shortcuts')
        this.topbar        = document.getElementById('topbar')
        this.progress      = 0
        this.started       = false

        this.simulateLoading()
        this.setStartButton()
    }

    simulateLoading() {
        const subtitles = ['Warming the stove', 'Boiling the water', 'Adding tea leaves', 'Brewing the kadai', 'Almost ready…']
        const subEl = document.getElementById('brew-sub')
        let si = 0

        const tick = () => {
            if (this.progress < 90) {
                this.progress += 3 + Math.random() * 11
                this.progress = Math.min(this.progress, 90)
                this.updateProgress(this.progress)
                if (subEl && Math.floor(this.progress / 20) !== si) {
                    si = Math.floor(this.progress / 20)
                    subEl.textContent = subtitles[Math.min(si, subtitles.length - 1)]
                }
                setTimeout(tick, 70 + Math.random() * 110)
            } else {
                setTimeout(() => {
                    this.progress = 100
                    this.updateProgress(100)
                    if (subEl) subEl.textContent = 'Your table is ready ☕'
                    this.showStart()
                }, 500)
            }
        }
        setTimeout(tick, 250)
    }

    updateProgress(pct) {
        const r = Math.floor(pct)
        if (this.progressEl)   this.progressEl.textContent = r
        if (this.progressFill) this.progressFill.style.width = r + '%'
    }

    showStart() {
        if (this.brewingEl) this.brewingEl.classList.add('fade')
        if (this.startBtn) {
            this.startBtn.style.display = 'block'
            requestAnimationFrame(() => this.startBtn.classList.add('fadeIn'))
        }
    }

    setStartButton() {
        if (!this.startBtn) return
        this.startBtn.addEventListener('click', () => {
            if (this.started) return
            this.started = true

            this.startBtn.classList.remove('fadeIn')
            setTimeout(() => {
                this.startBtn.style.display = 'none'
                if (this.brewingEl) this.brewingEl.style.display = 'none'
            }, 600)

            // Fade out dark overlay → reveal 3D scene
            setTimeout(() => this.overlayEl?.classList.add('fade'), 200)

            // Unlock scrolling and show all UI after reveal
            setTimeout(() => {
                document.body.classList.add('entered')  // unlocks overflow

                this.floatNav?.classList.remove('hidden')
                this.scrollArrow?.classList.remove('hidden')
                this.shortcutsEl?.classList.remove('hidden')

                if (this.hint3d) {
                    this.hint3d.classList.remove('hidden')
                    setTimeout(() => this.hint3d.classList.add('hidden'), 6000)
                }
                setTimeout(() => this.shortcutsEl?.classList.add('hidden'), 15000)
            }, 1400)

            this.trigger('start')
        })
    }
}

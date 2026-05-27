import EventEmitter from './Utils/EventEmitter.js'
import Experience from './Experience.js'

export default class PreLoader extends EventEmitter {
    constructor() {
        super()
        this.experience = new Experience()

        this.brewingEl      = document.getElementById('brewing')
        this.progressEl     = document.getElementById('progressPercentage')
        this.progressFill   = document.getElementById('brew-progress-fill')
        this.startBtn       = document.querySelector('.start')
        this.overlayEl      = document.querySelector('.overlay')
        this.navEl          = document.getElementById('nav')
        this.hintEl         = document.getElementById('hint')
        this.shortcutsEl    = document.getElementById('shortcuts')

        this.progress = 0
        this.started  = false

        this.simulateLoading()
        this.setStartButton()
    }

    simulateLoading() {
        const tick = () => {
            if (this.progress < 90) {
                this.progress += 4 + Math.random() * 10
                this.progress = Math.min(this.progress, 90)
                this.updateProgress(this.progress)
                setTimeout(tick, 80 + Math.random() * 100)
            } else {
                // Brief pause then complete
                setTimeout(() => {
                    this.progress = 100
                    this.updateProgress(100)
                    this.showStart()
                }, 500)
            }
        }
        setTimeout(tick, 200)
    }

    updateProgress(pct) {
        const rounded = Math.floor(pct)
        if (this.progressEl)   this.progressEl.textContent = rounded
        if (this.progressFill) this.progressFill.style.width = rounded + '%'
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

            // Fade out dark overlay → reveal scene
            setTimeout(() => this.overlayEl?.classList.add('fade'), 200)

            // Show nav + shortcuts after scene fades in
            setTimeout(() => {
                this.navEl?.classList.remove('hidden')
                this.shortcutsEl?.classList.remove('hidden')

                // Show hint briefly
                if (this.hintEl) {
                    this.hintEl.classList.remove('hidden')
                    setTimeout(() => this.hintEl.classList.add('hidden'), 5000)
                }

                // Hide shortcuts after a while
                setTimeout(() => this.shortcutsEl?.classList.add('hidden'), 12000)
            }, 1400)

            this.trigger('start')
        })
    }
}

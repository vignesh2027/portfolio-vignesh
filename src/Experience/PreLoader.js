import EventEmitter from './Utils/EventEmitter.js'
import Experience from './Experience.js'

export default class PreLoader extends EventEmitter {
    constructor() {
        super()
        this.experience   = new Experience()
        this.brewingEl    = document.getElementById('brewing')
        this.progressEl   = document.getElementById('progressPercentage')
        this.progressFill = document.getElementById('brew-fill')
        this.startBtn     = document.querySelector('.start-btn')
        this.overlayEl    = document.querySelector('.fade-overlay')
        this.progress     = 0
        this.started      = false

        this.simulateLoading()
        this.setStartButton()
    }

    simulateLoading() {
        const subtitles = [
            'Warming the stove…',
            'Boiling the water…',
            'Adding tea leaves…',
            'Brewing the kadai…',
            'Almost ready…',
        ]
        const subEl = document.getElementById('brew-sub')
        let si = 0

        const tick = () => {
            if (this.progress < 90) {
                this.progress += 3 + Math.random() * 11
                this.progress  = Math.min(this.progress, 90)
                this.updateProgress(this.progress)
                const newSi = Math.floor(this.progress / 20)
                if (subEl && newSi !== si) {
                    si = newSi
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
        if (this.progressEl)   this.progressEl.textContent  = r
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

            // Hide start button
            this.startBtn.classList.remove('fadeIn')
            setTimeout(() => {
                this.startBtn.style.display = 'none'
                if (this.brewingEl) this.brewingEl.style.display = 'none'
            }, 600)

            // Fade dark overlay → reveal 3D scene
            setTimeout(() => this.overlayEl?.classList.add('fade'), 200)

            // Show all 3D UI
            setTimeout(() => {
                document.body.classList.add('entered')

                // Theme toggle
                document.getElementById('theme-toggle')?.classList.remove('hidden')

                // Keyboard hints (auto-hide after 14s)
                const kbd = document.getElementById('kbd')
                if (kbd) {
                    kbd.classList.remove('hidden')
                    setTimeout(() => kbd.classList.add('hidden'), 14000)
                }

                // Controls hint (auto-hide after 8s)
                const hint = document.getElementById('controls-hint')
                if (hint) {
                    hint.classList.remove('hidden')
                    setTimeout(() => hint.classList.add('hidden'), 8000)
                }
            }, 1400)

            this.trigger('start')
        })
    }
}

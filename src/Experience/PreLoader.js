import EventEmitter from './Utils/EventEmitter.js'
import Experience from './Experience.js'

export default class PreLoader extends EventEmitter {
    constructor() {
        super()
        this.experience = new Experience()

        this.brewingEl = document.getElementById('brewing')
        this.progressEl = document.getElementById('progressPercentage')
        this.startBtn = document.querySelector('.start')
        this.overlayEl = document.querySelector('.overlay')
        this.navEl = document.getElementById('nav')
        this.hintEl = document.getElementById('hint')

        this.progress = 0
        this.started = false

        this.simulateLoading()
        this.setStartButton()
    }

    simulateLoading() {
        // Simulate brew loading — ramp quickly to 85%, then wait for full scene init
        const interval = setInterval(() => {
            if (this.progress < 85) {
                this.progress += Math.random() * 12
                this.progress = Math.min(this.progress, 85)
                if (this.progressEl) this.progressEl.textContent = Math.floor(this.progress)
            } else {
                clearInterval(interval)
                // Finish loading
                setTimeout(() => {
                    this.progress = 100
                    if (this.progressEl) this.progressEl.textContent = 100
                    this.showStart()
                }, 600)
            }
        }, 120)
    }

    showStart() {
        if (this.brewingEl) this.brewingEl.classList.add('fade')
        if (this.startBtn) {
            this.startBtn.style.display = 'block'
            setTimeout(() => this.startBtn.classList.add('fadeIn'), 100)
        }
    }

    setStartButton() {
        if (!this.startBtn) return
        this.startBtn.addEventListener('click', () => {
            if (this.started) return
            this.started = true

            this.startBtn.classList.remove('fadeIn')
            this.startBtn.classList.add('fadeOut')
            setTimeout(() => {
                this.startBtn.style.display = 'none'
                if (this.brewingEl) this.brewingEl.style.display = 'none'
            }, 600)

            if (this.overlayEl) {
                setTimeout(() => this.overlayEl.classList.add('fade'), 200)
            }

            setTimeout(() => {
                if (this.navEl) this.navEl.classList.remove('hidden')
                if (this.hintEl) {
                    this.hintEl.classList.remove('hidden')
                    setTimeout(() => this.hintEl.classList.add('hidden'), 4000)
                }
            }, 1400)

            this.trigger('start')
        })
    }
}

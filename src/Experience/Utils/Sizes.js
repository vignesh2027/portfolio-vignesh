import EventEmitter from './EventEmitter.js'

export default class Sizes extends EventEmitter {
    constructor() {
        super()
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)

        let resizeTimer = null
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer)
            resizeTimer = setTimeout(() => {
                this.width = window.innerWidth
                this.height = window.innerHeight
                this.pixelRatio = Math.min(window.devicePixelRatio, 2)
                this.trigger('resize')
            }, 150)
        })
    }
}

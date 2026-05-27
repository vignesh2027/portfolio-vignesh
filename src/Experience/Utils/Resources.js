import EventEmitter from './EventEmitter.js'

export default class Resources extends EventEmitter {
    constructor(sources) {
        super()
        this.sources = sources
        this.items = {}
        this.toLoad = sources.length
        this.loaded = 0

        if (this.toLoad === 0) {
            // No assets — fire ready on next tick
            window.setTimeout(() => this.trigger('ready'), 0)
        }
    }
}

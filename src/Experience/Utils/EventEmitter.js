export default class EventEmitter {
    constructor() {
        this.callbacks = { base: {} }
    }

    on(_names, callback) {
        const names = _names.split(' ')
        names.forEach(name => {
            const resolved = this.resolveNames(name)
            resolved.forEach(resolved => {
                if (!this.callbacks[resolved.namespace]) this.callbacks[resolved.namespace] = {}
                if (!this.callbacks[resolved.namespace][resolved.value]) this.callbacks[resolved.namespace][resolved.value] = []
                this.callbacks[resolved.namespace][resolved.value].push(callback)
            })
        })
        return this
    }

    off(_names) {
        const names = _names.split(' ')
        names.forEach(name => {
            const resolved = this.resolveNames(name)
            resolved.forEach(resolved => {
                if (resolved.namespace !== 'base' && resolved.value === '') {
                    delete this.callbacks[resolved.namespace]
                } else {
                    if (this.callbacks[resolved.namespace] && this.callbacks[resolved.namespace][resolved.value]) {
                        delete this.callbacks[resolved.namespace][resolved.value]
                    }
                }
            })
        })
        return this
    }

    trigger(_name, _args) {
        const names = _name.split(' ')
        names.forEach(name => {
            const resolved = this.resolveNames(name)
            resolved.forEach(resolved => {
                const namespaceCallbacks = this.callbacks[resolved.namespace]
                if (namespaceCallbacks) {
                    const callbacks = namespaceCallbacks[resolved.value]
                    if (callbacks) callbacks.forEach(cb => cb.apply(this, _args || []))
                }
            })
        })
        return this
    }

    resolveNames(_names) {
        let names = _names
        names = names.replace(/[^a-zA-Z0-9 ,/.]/g, '')
        names = names.replace(/[,/]+/g, ' ')
        return names.split(' ').map(name => {
            const parts = name.split('.')
            return { original: name, value: parts[0], namespace: parts.length > 1 ? parts[1] : 'base' }
        })
    }
}

import * as THREE from 'three'
import Experience from './Experience.js'

export default class RayCaster {
    constructor() {
        this.experience = new Experience()
        this.scene      = this.experience.scene
        this.camera     = this.experience.camera
        this.canvas     = this.experience.canvas

        this.raycaster = new THREE.Raycaster()
        this.mouse     = new THREE.Vector2()
        this.hovered   = null

        this.canvas.addEventListener('mousemove',  e => this.onMouseMove(e))
        this.canvas.addEventListener('click',      e => this.onClick(e))
        this.canvas.addEventListener('touchend',   e => this.onTouchEnd(e), { passive: false })
    }

    get controller() { return this.experience.controller }

    getTargets() {
        return this.experience.world?.teaKadai?.clickTargets || []
    }

    cast(clientX, clientY) {
        const s = this.experience.sizes
        this.mouse.x =  (clientX / s.width)  * 2 - 1
        this.mouse.y = -(clientY / s.height)  * 2 + 1
        this.raycaster.setFromCamera(this.mouse, this.camera.instance)
        return this.raycaster.intersectObjects(this.getTargets())
    }

    onMouseMove(e) {
        const hits = this.cast(e.clientX, e.clientY)
        const isHit = hits.length > 0
        this.hovered = isHit ? hits[0].object : null
        this.controller?.setHovering(isHit)
        document.body.style.cursor = isHit ? 'none' : 'none'
    }

    onClick(e) {
        const hits = this.cast(e.clientX, e.clientY)
        if (hits.length > 0) {
            const action = hits[0].object.userData.action
            if (action) this.controller?.handleAction(action)
        }
    }

    onTouchEnd(e) {
        e.preventDefault()
        const t = e.changedTouches[0]
        const hits = this.cast(t.clientX, t.clientY)
        if (hits.length > 0) {
            const action = hits[0].object.userData.action
            if (action) this.controller?.handleAction(action)
        }
    }
}

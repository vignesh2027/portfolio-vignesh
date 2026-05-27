import * as THREE from 'three'
import Experience from './Experience.js'

export default class RayCaster {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.canvas = this.experience.canvas
        this.controller = this.experience.controller

        this.raycaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2()
        this.hovered = null

        this.canvas.addEventListener('mousemove', e => this.onMouseMove(e))
        this.canvas.addEventListener('click', e => this.onClick(e))
        this.canvas.addEventListener('touchend', e => this.onTouchEnd(e), { passive: false })
    }

    getTargets() {
        return this.experience.world?.teaKadai?.clickTargets || []
    }

    onMouseMove(e) {
        this.mouse.x = (e.clientX / this.experience.sizes.width) * 2 - 1
        this.mouse.y = -(e.clientY / this.experience.sizes.height) * 2 + 1

        this.raycaster.setFromCamera(this.mouse, this.camera.instance)
        const targets = this.getTargets()
        const intersects = this.raycaster.intersectObjects(targets)

        if (intersects.length > 0) {
            document.body.style.cursor = 'pointer'
            this.hovered = intersects[0].object
        } else {
            document.body.style.cursor = 'default'
            this.hovered = null
        }
    }

    onClick(e) {
        this.mouse.x = (e.clientX / this.experience.sizes.width) * 2 - 1
        this.mouse.y = -(e.clientY / this.experience.sizes.height) * 2 + 1

        this.raycaster.setFromCamera(this.mouse, this.camera.instance)
        const targets = this.getTargets()
        const intersects = this.raycaster.intersectObjects(targets)

        if (intersects.length > 0) {
            const obj = intersects[0].object
            if (obj.userData.action) {
                this.controller.handleAction(obj.userData.action)
            }
        }
    }

    onTouchEnd(e) {
        e.preventDefault()
        const touch = e.changedTouches[0]
        this.mouse.x = (touch.clientX / this.experience.sizes.width) * 2 - 1
        this.mouse.y = -(touch.clientY / this.experience.sizes.height) * 2 + 1

        this.raycaster.setFromCamera(this.mouse, this.camera.instance)
        const targets = this.getTargets()
        const intersects = this.raycaster.intersectObjects(targets)

        if (intersects.length > 0) {
            const obj = intersects[0].object
            if (obj.userData.action) {
                this.controller.handleAction(obj.userData.action)
            }
        }
    }
}

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import Experience from './Experience.js'

export default class Camera {
    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas

        this.setInstance()
        this.setControls()
        this.setPositions()
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            45,
            this.sizes.width / this.sizes.height,
            0.1,
            100
        )
        this.instance.position.set(0, 2.5, 7)
        this.instance.lookAt(0, 0.5, 0)
        this.scene.add(this.instance)
    }

    setControls() {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
        this.controls.dampingFactor = 0.05
        this.controls.target.set(0, 0.5, 0)
        this.controls.enablePan = false
        this.controls.minDistance = 3
        this.controls.maxDistance = 12
        this.controls.maxPolarAngle = Math.PI * 0.55
        this.controls.minPolarAngle = Math.PI * 0.1
    }

    setPositions() {
        this.positions = {
            default: {
                position: new THREE.Vector3(0, 2.5, 7),
                target: new THREE.Vector3(0, 0.5, 0)
            },
            menuBoard: {
                position: new THREE.Vector3(0, 2.2, 2.5),
                target: new THREE.Vector3(0, 1.8, -1.5)
            },
            about: {
                position: new THREE.Vector3(-4.5, 2.5, 2.5),
                target: new THREE.Vector3(-3.5, 1.8, -1.5)
            },
            contact: {
                position: new THREE.Vector3(4, 1.5, 2),
                target: new THREE.Vector3(3.5, 0.9, -1.5)
            }
        }
    }

    transitionTo(name, duration = 1.5) {
        const pos = this.positions[name]
        if (!pos) return

        this.controls.enabled = false

        gsap.to(this.instance.position, {
            x: pos.position.x,
            y: pos.position.y,
            z: pos.position.z,
            duration,
            ease: 'power2.inOut'
        })
        gsap.to(this.controls.target, {
            x: pos.target.x,
            y: pos.target.y,
            z: pos.target.z,
            duration,
            ease: 'power2.inOut',
            onComplete: () => {
                if (name === 'default') this.controls.enabled = true
            }
        })
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update() {
        this.controls.update()
    }
}

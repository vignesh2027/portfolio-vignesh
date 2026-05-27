import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import Experience from './Experience.js'

export default class Camera {
    constructor() {
        this.experience = new Experience()
        this.sizes      = this.experience.sizes
        this.scene      = this.experience.scene
        this.canvas     = this.experience.canvas

        this.setInstance()
        this.setControls()
        this.setPositions()
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            48,
            this.sizes.width / this.sizes.height,
            0.1,
            120
        )
        this.instance.position.set(0, 2.5, 8)
        this.instance.lookAt(0, 0.8, 0)
        this.scene.add(this.instance)
    }

    setControls() {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping  = true
        this.controls.dampingFactor  = 0.05
        this.controls.target.set(0, 0.8, 0)
        this.controls.enablePan      = false
        this.controls.minDistance    = 2.5
        this.controls.maxDistance    = 14
        this.controls.maxPolarAngle  = Math.PI * 0.52
        this.controls.minPolarAngle  = Math.PI * 0.08
    }

    setPositions() {
        this.positions = {
            // ── Overview ──────────────────────────────
            default: {
                position: new THREE.Vector3(0, 2.5, 8),
                target:   new THREE.Vector3(0, 0.8, 0)
            },
            // ── Back wall zones ───────────────────────
            menuBoard: {
                position: new THREE.Vector3(0, 2.4, 2.6),
                target:   new THREE.Vector3(0, 1.9, -1.8)
            },
            about: {
                position: new THREE.Vector3(-5.0, 2.6, 2.2),
                target:   new THREE.Vector3(-5.2, 2.0, -1.6)
            },
            research: {
                position: new THREE.Vector3(5.0, 2.6, 2.2),
                target:   new THREE.Vector3(5.2, 2.0, -1.6)
            },
            contact: {
                position: new THREE.Vector3(5.0, 1.2, 2.0),
                target:   new THREE.Vector3(5.2, 0.4, -1.6)
            },
            // ── Side walls ───────────────────────────
            leftWall: {
                position: new THREE.Vector3(-3.5, 2.4, 0.2),
                target:   new THREE.Vector3(-5.5, 1.8, -1.5)
            },
            rightWall: {
                position: new THREE.Vector3(3.5, 2.4, 0.2),
                target:   new THREE.Vector3(5.5, 1.8, -1.5)
            },
            // ── Projects overview ────────────────────
            projects: {
                position: new THREE.Vector3(0, 2.4, 2.6),
                target:   new THREE.Vector3(0, 1.9, -1.8)
            },
            // ── Individual project cups ───────────────
            'project-dsa': {
                position: new THREE.Vector3(-3.2, 1.6, 3.2),
                target:   new THREE.Vector3(-3.2, 0.8, -0.2)
            },
            'project-nexus': {
                position: new THREE.Vector3(-2.2, 1.6, 3.2),
                target:   new THREE.Vector3(-2.2, 0.8, -0.2)
            },
            'project-sparsh': {
                position: new THREE.Vector3(-1.2, 1.6, 3.2),
                target:   new THREE.Vector3(-1.2, 0.8, -0.2)
            },
            'project-synth': {
                position: new THREE.Vector3(-0.2, 1.6, 3.2),
                target:   new THREE.Vector3(-0.2, 0.8, -0.2)
            },
            'project-vortex': {
                position: new THREE.Vector3(0.8, 1.6, 3.2),
                target:   new THREE.Vector3(0.8, 0.8, -0.2)
            },
            'project-rust': {
                position: new THREE.Vector3(1.8, 1.6, 3.2),
                target:   new THREE.Vector3(1.8, 0.8, -0.2)
            },
            'project-flux': {
                position: new THREE.Vector3(2.8, 1.6, 3.2),
                target:   new THREE.Vector3(2.8, 0.8, -0.2)
            },
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

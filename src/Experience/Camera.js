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
            55,
            this.sizes.width / this.sizes.height,
            0.1,
            120
        )
        // Start INSIDE the kadai looking toward back wall
        this.instance.position.set(0, 2.2, 3.5)
        this.instance.lookAt(0, 1.5, -1.5)
        this.scene.add(this.instance)
    }

    setControls() {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping  = true
        this.controls.dampingFactor  = 0.04
        this.controls.target.set(0, 1.5, -1.5)
        this.controls.enablePan      = false
        this.controls.minDistance    = 1.2
        this.controls.maxDistance    = 22.0
        // Full 360: can look up at ceiling and down at floor
        this.controls.maxPolarAngle  = Math.PI * 0.88
        this.controls.minPolarAngle  = 0.02
    }

    setPositions() {
        this.positions = {
            // ── Default: standing inside, looking in ──────────
            default: {
                position: new THREE.Vector3(0, 2.2, 3.5),
                target:   new THREE.Vector3(0, 1.5, -1.5)
            },
            // ── Back wall — chalkboard / menu ─────────────────
            menuBoard: {
                position: new THREE.Vector3(0, 2.5, -1.0),
                target:   new THREE.Vector3(0, 2.2, -3.0)
            },
            // ── Back wall — about frame ───────────────────────
            about: {
                position: new THREE.Vector3(-3.5, 2.5, -1.0),
                target:   new THREE.Vector3(-5.5, 2.1, -3.0)
            },
            // ── Back wall — research frame ────────────────────
            research: {
                position: new THREE.Vector3(3.5, 2.5, -1.0),
                target:   new THREE.Vector3(5.5, 2.1, -3.0)
            },
            // ── Back wall — contact sign ──────────────────────
            contact: {
                position: new THREE.Vector3(4.0, 1.5, -0.5),
                target:   new THREE.Vector3(5.5, 0.8, -3.0)
            },
            // ── Left wall — skills panel ──────────────────────
            leftWall: {
                position: new THREE.Vector3(-2.5, 2.4, -1.0),
                target:   new THREE.Vector3(-5.7, 2.0, -1.5)
            },
            // ── Right wall — GitHub / TV panel ───────────────
            rightWall: {
                position: new THREE.Vector3(2.5, 2.4, -1.0),
                target:   new THREE.Vector3(5.7, 2.0, -1.5)
            },
            // ── Projects overview ────────────────────────────
            projects: {
                position: new THREE.Vector3(0, 2.5, -1.0),
                target:   new THREE.Vector3(0, 2.2, -3.0)
            },
            // ── Outside — facing the building facade ─────────
            outdoor: {
                position: new THREE.Vector3(0, 3.0, 9.0),
                target:   new THREE.Vector3(0, 2.5, 4.2)
            },
            // ── Outside — git stats facade panel (right) ─────
            gitStats: {
                position: new THREE.Vector3(4.5, 2.8, 7.5),
                target:   new THREE.Vector3(3.9, 2.6, 4.2)
            },
            // ── Outside — about me facade panel (left) ───────
            aboutOutdoor: {
                position: new THREE.Vector3(-4.5, 2.8, 7.5),
                target:   new THREE.Vector3(-3.9, 2.6, 4.2)
            },
            // ── Outside — opposite shop ───────────────────────
            oppositeShop: {
                position: new THREE.Vector3(0, 3.5, 22.0),
                target:   new THREE.Vector3(0, 3.0, 28.0)
            },
            // ── Individual project cups at xs=[-3.2..-0.2..2.8]
            'project-dsa': {
                position: new THREE.Vector3(-3.2, 1.8, 2.2),
                target:   new THREE.Vector3(-3.2, 0.8, -0.5)
            },
            'project-nexus': {
                position: new THREE.Vector3(-2.2, 1.8, 2.2),
                target:   new THREE.Vector3(-2.2, 0.8, -0.5)
            },
            'project-sparsh': {
                position: new THREE.Vector3(-1.2, 1.8, 2.2),
                target:   new THREE.Vector3(-1.2, 0.8, -0.5)
            },
            'project-synth': {
                position: new THREE.Vector3(-0.2, 1.8, 2.2),
                target:   new THREE.Vector3(-0.2, 0.8, -0.5)
            },
            'project-vortex': {
                position: new THREE.Vector3(0.8, 1.8, 2.2),
                target:   new THREE.Vector3(0.8, 0.8, -0.5)
            },
            'project-rust': {
                position: new THREE.Vector3(1.8, 1.8, 2.2),
                target:   new THREE.Vector3(1.8, 0.8, -0.5)
            },
            'project-flux': {
                position: new THREE.Vector3(2.8, 1.8, 2.2),
                target:   new THREE.Vector3(2.8, 0.8, -0.5)
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
                this.controls.enabled = true
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

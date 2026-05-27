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
        this.controls.dampingFactor  = 0.05
        this.controls.target.set(0, 1.5, -1.5)
        this.controls.enablePan      = false
        this.controls.minDistance    = 1.5
        this.controls.maxDistance    = 9.0
        this.controls.maxPolarAngle  = Math.PI * 0.54
        this.controls.minPolarAngle  = Math.PI * 0.06
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
                target:   new THREE.Vector3(0, 2.2, -6.3)
            },
            // ── Back wall — about frame ───────────────────────
            about: {
                position: new THREE.Vector3(-4.5, 2.6, -1.2),
                target:   new THREE.Vector3(-5.8, 2.2, -6.3)
            },
            // ── Back wall — research frame ────────────────────
            research: {
                position: new THREE.Vector3(4.5, 2.6, -1.2),
                target:   new THREE.Vector3(5.8, 2.2, -6.3)
            },
            // ── Back wall — contact sign ──────────────────────
            contact: {
                position: new THREE.Vector3(5.5, 1.4, -1.0),
                target:   new THREE.Vector3(6.0, 0.8, -6.3)
            },
            // ── Left wall — skills panel ──────────────────────
            leftWall: {
                position: new THREE.Vector3(-2.5, 2.4, -1.5),
                target:   new THREE.Vector3(-7.8, 2.0, -2.5)
            },
            // ── Right wall — GitHub panel ─────────────────────
            rightWall: {
                position: new THREE.Vector3(2.5, 2.4, -1.5),
                target:   new THREE.Vector3(7.8, 2.0, -2.5)
            },
            // ── Projects overview ────────────────────────────
            projects: {
                position: new THREE.Vector3(0, 2.5, -1.0),
                target:   new THREE.Vector3(0, 2.2, -6.3)
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

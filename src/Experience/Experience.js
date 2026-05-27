import * as THREE from 'three'
import Debug from './Utils/Debug.js'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './World/World.js'
import Resources from './Utils/Resources.js'
import PreLoader from './PreLoader.js'
import Controller from './Controller.js'
import RayCaster from './RayCaster.js'
import sources from './sources.js'

let instance = null

export default class Experience {
    constructor(_canvas) {
        if (instance) return instance
        instance = this

        window.experience = this
        this.canvas = _canvas

        this.debug = new Debug()
        this.scene = new THREE.Scene()
        this.sizes = new Sizes()
        this.time = new Time()
        this.resources = new Resources(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.preLoader = new PreLoader()
        this.world = new World()
        this.controller = new Controller()
        this.rayCaster = new RayCaster()

        this.sizes.on('resize', () => this.resize())
        this.time.on('tick', () => this.update())
    }

    resize() {
        this.camera.resize()
        this.renderer.resize()
    }

    update() {
        this.camera.update()
        this.world.update()
        this.renderer.update()
    }
}

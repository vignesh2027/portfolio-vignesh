import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Environment {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.debug = this.experience.debug

        this.setAmbientLight()
        this.setLanternLights()
        this.setMoonLight()
        this.setFog()
    }

    setAmbientLight() {
        this.ambientLight = new THREE.AmbientLight(0x1a0e05, 0.4)
        this.scene.add(this.ambientLight)
    }

    setLanternLights() {
        const lanternPositions = [
            { x: -2.2, y: 2.4, z: 0.2 },
            { x: 0,    y: 2.7, z: 0.2 },
            { x: 2.2,  y: 2.4, z: 0.2 }
        ]

        this.lanternLights = []

        lanternPositions.forEach((pos, i) => {
            const light = new THREE.PointLight(0xff8c00, i === 1 ? 3 : 2, 6, 1.5)
            light.position.set(pos.x, pos.y, pos.z)
            light.castShadow = true
            light.shadow.mapSize.set(512, 512)
            light.shadow.camera.near = 0.1
            light.shadow.camera.far = 8
            this.scene.add(light)
            this.lanternLights.push(light)
        })

        // Warm fill from counter (stove glow)
        this.stoveLight = new THREE.PointLight(0xff4500, 1.5, 3, 2)
        this.stoveLight.position.set(0, 0.8, 0.5)
        this.scene.add(this.stoveLight)
    }

    setMoonLight() {
        this.moonLight = new THREE.DirectionalLight(0x304080, 0.3)
        this.moonLight.position.set(-3, 6, 3)
        this.moonLight.castShadow = true
        this.moonLight.shadow.mapSize.set(1024, 1024)
        this.moonLight.shadow.camera.near = 0.1
        this.moonLight.shadow.camera.far = 20
        this.moonLight.shadow.camera.left = -8
        this.moonLight.shadow.camera.right = 8
        this.moonLight.shadow.camera.top = 8
        this.moonLight.shadow.camera.bottom = -8
        this.scene.add(this.moonLight)
    }

    setFog() {
        this.scene.fog = new THREE.FogExp2(0x0d0a06, 0.05)
    }

    update(elapsedTime) {
        // Flicker the lantern lights gently
        if (this.lanternLights) {
            this.lanternLights.forEach((light, i) => {
                const base = i === 1 ? 3 : 2
                light.intensity = base + Math.sin(elapsedTime * 2 + i * 1.3) * 0.15
            })
        }
        if (this.stoveLight) {
            this.stoveLight.intensity = 1.5 + Math.sin(elapsedTime * 4) * 0.2
        }
    }
}

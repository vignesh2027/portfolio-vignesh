import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Environment {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene

        this.setAmbientLight()
        this.setSunLight()
        this.setWindowLight()
        this.setLanternLights()
        this.setFog()
    }

    setAmbientLight() {
        this.ambientLight = new THREE.AmbientLight(0xFFE8C8, 0.9)
        this.scene.add(this.ambientLight)
    }

    setSunLight() {
        // Warm late-afternoon sunlight from upper right
        this.sunLight = new THREE.DirectionalLight(0xFFF0D0, 1.8)
        this.sunLight.position.set(4, 8, 3)
        this.sunLight.castShadow = true
        this.sunLight.shadow.mapSize.set(2048, 2048)
        this.sunLight.shadow.camera.near = 0.5
        this.sunLight.shadow.camera.far = 25
        this.sunLight.shadow.camera.left = -10
        this.sunLight.shadow.camera.right = 10
        this.sunLight.shadow.camera.top = 10
        this.sunLight.shadow.camera.bottom = -10
        this.sunLight.shadow.bias = -0.001
        this.scene.add(this.sunLight)

        // Soft fill from front
        this.fillLight = new THREE.DirectionalLight(0xFFDDB0, 0.5)
        this.fillLight.position.set(-3, 3, 6)
        this.scene.add(this.fillLight)
    }

    setWindowLight() {
        // Warm window glow from left wall
        this.windowLight = new THREE.PointLight(0xFFE0A0, 2.5, 5, 1.8)
        this.windowLight.position.set(-5.2, 1.7, -1.0)
        this.scene.add(this.windowLight)
    }

    setLanternLights() {
        const defs = [
            { x: -2.3, y: 2.4, z: 0.25, i: 2 },
            { x:  0,   y: 2.6, z: 0.25, i: 2.8 },
            { x:  2.3, y: 2.4, z: 0.25, i: 2 }
        ]

        this.lanternLights = defs.map(d => {
            const light = new THREE.PointLight(0xFF9010, d.i, 5.5, 1.6)
            light.position.set(d.x, d.y, d.z)
            light.castShadow = true
            light.shadow.mapSize.set(512, 512)
            light.shadow.camera.near = 0.1
            light.shadow.camera.far = 7
            this.scene.add(light)
            return light
        })

        // Stove glow
        this.stoveLight = new THREE.PointLight(0xFF5500, 1.2, 2.5, 2)
        this.stoveLight.position.set(0, 0.9, 0.3)
        this.scene.add(this.stoveLight)
    }

    setFog() {
        // Very subtle warm haze — not too dark
        this.scene.fog = new THREE.FogExp2(0x1A0E05, 0.028)
    }

    update(elapsedTime) {
        // Lantern flicker
        this.lanternLights.forEach((l, i) => {
            const base = i === 1 ? 2.8 : 2
            l.intensity = base + Math.sin(elapsedTime * 2.3 + i * 1.7) * 0.18
                        + Math.sin(elapsedTime * 5.1 + i) * 0.06
        })
        if (this.stoveLight) {
            this.stoveLight.intensity = 1.2 + Math.sin(elapsedTime * 3.8) * 0.22
        }
    }
}

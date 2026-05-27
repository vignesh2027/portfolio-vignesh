import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Environment {
    constructor() {
        this.experience = new Experience()
        this.scene      = this.experience.scene

        this.setAmbientLight()
        this.setMoonLight()
        this.setLanternLights()
        this.setFog()
    }

    setAmbientLight() {
        // Warmer ambient — supports interior + exterior visibility
        this.ambientLight = new THREE.AmbientLight(0xFFCCA0, 0.45)
        this.scene.add(this.ambientLight)
    }

    setMoonLight() {
        this.moonLight = new THREE.DirectionalLight(0xB0C8FF, 0.28)
        this.moonLight.position.set(-4, 12, 10)
        this.scene.add(this.moonLight)

        // Warm fill
        this.fillLight = new THREE.DirectionalLight(0xFF9040, 0.20)
        this.fillLight.position.set(0, 4, 6)
        this.scene.add(this.fillLight)

        // Street + exterior fill
        this.streetLight = new THREE.DirectionalLight(0x8090AA, 0.15)
        this.streetLight.position.set(0, 14, 18)
        this.scene.add(this.streetLight)
    }

    setLanternLights() {
        // 3 lantern lights (no shadows — visual lanterns still exist, just fewer lights)
        const defs = [
            { x: -3.0, y: 2.7, z:  0.5, i: 2.2, color: 0xFF9010 },
            { x:  0.0, y: 3.0, z: -0.8, i: 2.8, color: 0xFF8800 },
            { x:  3.0, y: 2.7, z:  0.5, i: 2.2, color: 0xFF9010 },
        ]

        this.lanternLights = defs.map(d => {
            const light = new THREE.PointLight(d.color, d.i, 6.0, 1.5)
            light.position.set(d.x, d.y, d.z)
            this.scene.add(light)
            return { light, baseI: d.i }
        })

        // Stove glow
        this.stoveLight = new THREE.PointLight(0xFF4400, 1.4, 2.8, 2)
        this.stoveLight.position.set(4.0, 0.9, 0.0)
        this.scene.add(this.stoveLight)
    }

    setFog() {
        // Very light rain-haze so exterior buildings are visible
        this.scene.fog = new THREE.FogExp2(0x050608, 0.014)
    }

    update(elapsedTime) {
        // Organic lantern flicker
        this.lanternLights?.forEach(({ light, baseI }, i) => {
            light.intensity = baseI
                + Math.sin(elapsedTime * 2.1 + i * 1.8) * (baseI * 0.08)
                + Math.sin(elapsedTime * 5.3 + i * 0.9) * (baseI * 0.03)
        })

        if (this.stoveLight) {
            this.stoveLight.intensity = 1.4 + Math.sin(elapsedTime * 4.2) * 0.28
        }
    }
}

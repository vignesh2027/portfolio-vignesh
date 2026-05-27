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
        // Soft cool moonlight — comes from behind camera (from street)
        this.moonLight = new THREE.DirectionalLight(0xB0C8FF, 0.32)
        this.moonLight.position.set(-4, 12, 15)
        this.moonLight.castShadow = true
        this.scene.add(this.moonLight)

        // Warm fill for interior counter
        this.fillLight = new THREE.DirectionalLight(0xFF9040, 0.22)
        this.fillLight.position.set(0, 4, 6)
        this.scene.add(this.fillLight)

        // Street ambient — cool blue-white from above the street
        this.streetAmbient = new THREE.DirectionalLight(0xA0B8CC, 0.18)
        this.streetAmbient.position.set(0, 15, 16)
        this.scene.add(this.streetAmbient)

        // Opposite building reflected light (blue-purple)
        this.oppLight = new THREE.PointLight(0x4040FF, 0.6, 18, 1.4)
        this.oppLight.position.set(0, 6, 26)
        this.scene.add(this.oppLight)
    }

    setLanternLights() {
        // 5 lanterns matching TeaKadai.js buildLanterns() positions
        const defs = [
            { x: -4.0, y: 2.7, z:  1.5, i: 1.8, color: 0xFF9010 },
            { x: -1.8, y: 2.9, z:  0.0, i: 2.4, color: 0xFFAA20 },
            { x:  0.0, y: 3.1, z: -1.5, i: 3.0, color: 0xFF8000 },
            { x:  1.8, y: 2.9, z:  0.0, i: 2.4, color: 0xFFAA20 },
            { x:  4.0, y: 2.7, z:  1.5, i: 1.8, color: 0xFF9010 },
        ]

        this.lanternLights = defs.map(d => {
            const light = new THREE.PointLight(d.color, d.i, 5.5, 1.6)
            light.position.set(d.x, d.y, d.z)
            light.castShadow = true
            light.shadow.mapSize.set(512, 512)
            light.shadow.camera.near = 0.1
            light.shadow.camera.far  = 7
            this.scene.add(light)
            return { light, baseI: d.i }
        })

        // Stove glow — orange-red (stove at x≈5.5, z≈-1.5 in new room)
        this.stoveLight = new THREE.PointLight(0xFF4400, 1.6, 3.2, 2.2)
        this.stoveLight.position.set(5.5, 0.9, -1.5)
        this.scene.add(this.stoveLight)

        // Window moonlight glow — left wall at x=-8, z=1.5
        this.windowLight = new THREE.PointLight(0x6090FF, 0.65, 5.0, 2)
        this.windowLight.position.set(-6.5, 2.2, 1.5)
        this.scene.add(this.windowLight)
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

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
        // Very dim warm ambient — almost all light from lanterns
        this.ambientLight = new THREE.AmbientLight(0xFFCCA0, 0.35)
        this.scene.add(this.ambientLight)
    }

    setMoonLight() {
        // Soft cool moonlight from upper-left (through window)
        this.moonLight = new THREE.DirectionalLight(0xB0C8FF, 0.28)
        this.moonLight.position.set(-6, 7, 2)
        this.scene.add(this.moonLight)

        // Subtle fill from front so counter is readable
        this.fillLight = new THREE.DirectionalLight(0xFF9040, 0.18)
        this.fillLight.position.set(0, 3, 8)
        this.scene.add(this.fillLight)
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
        // Warm dark haze — not too thick
        this.scene.fog = new THREE.FogExp2(0x050203, 0.022)
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

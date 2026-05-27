import * as THREE from 'three'
import Experience from '../Experience.js'

export default class SteamParticles {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene

        // Steam sources: kettle + 4 cups
        this.sources = [
            { x: 0,    y: 1.3,  z: 0.15 },  // kettle
            { x: -2.8, y: 0.94, z: -0.25 },
            { x: -1.8, y: 0.94, z: -0.25 },
            { x:  2.2, y: 0.94, z: -0.25 },
            { x:  3.2, y: 0.94, z: -0.25 },
        ]

        this.particles = []
        this.sources.forEach((src, i) => {
            this.particles.push(this.createSteam(src, i === 0 ? 18 : 10))
        })
    }

    createSteam(source, count) {
        const geo = new THREE.BufferGeometry()
        const positions = new Float32Array(count * 3)
        const velocities = []
        const ages = []

        for (let i = 0; i < count; i++) {
            positions[i * 3 + 0] = source.x + (Math.random() - 0.5) * 0.05
            positions[i * 3 + 1] = source.y
            positions[i * 3 + 2] = source.z + (Math.random() - 0.5) * 0.05
            velocities.push({
                x: (Math.random() - 0.5) * 0.002,
                y: 0.004 + Math.random() * 0.005,
                z: (Math.random() - 0.5) * 0.002
            })
            ages.push(Math.random())
        }

        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

        const mat = new THREE.PointsMaterial({
            color: 0xd4c0a0,
            size: 0.06,
            transparent: true,
            opacity: 0.28,
            depthWrite: false,
            sizeAttenuation: true
        })

        const points = new THREE.Points(geo, mat)
        this.scene.add(points)

        return { points, positions, velocities, ages, source, count }
    }

    update() {
        this.particles.forEach(p => {
            const pos = p.points.geometry.attributes.position
            for (let i = 0; i < p.count; i++) {
                p.ages[i] += 0.008
                if (p.ages[i] > 1) {
                    // reset particle to source
                    pos.setXYZ(
                        i,
                        p.source.x + (Math.random() - 0.5) * 0.06,
                        p.source.y,
                        p.source.z + (Math.random() - 0.5) * 0.06
                    )
                    p.velocities[i] = {
                        x: (Math.random() - 0.5) * 0.002,
                        y: 0.004 + Math.random() * 0.005,
                        z: (Math.random() - 0.5) * 0.002
                    }
                    p.ages[i] = 0
                } else {
                    pos.setXYZ(
                        i,
                        pos.getX(i) + p.velocities[i].x,
                        pos.getY(i) + p.velocities[i].y,
                        pos.getZ(i) + p.velocities[i].z
                    )
                }
            }
            pos.needsUpdate = true
            // Fade opacity with age average
            p.points.material.opacity = 0.2 + Math.sin(Date.now() * 0.001) * 0.06
        })
    }
}

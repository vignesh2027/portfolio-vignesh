import * as THREE from 'three'

export default class Materials {
    constructor() {
        this.wood = new THREE.MeshStandardMaterial({
            color: 0x5C3317, roughness: 0.82, metalness: 0.0
        })

        this.darkWood = new THREE.MeshStandardMaterial({
            color: 0x2A1A08, roughness: 0.88, metalness: 0.0
        })

        this.lightWood = new THREE.MeshStandardMaterial({
            color: 0x8B5E2E, roughness: 0.72, metalness: 0.05
        })

        this.marble = new THREE.MeshStandardMaterial({
            color: 0xF5EDE0, roughness: 0.25, metalness: 0.08
        })

        this.plaster = new THREE.MeshStandardMaterial({
            color: 0xF0E4D0, roughness: 0.95, metalness: 0.0
        })

        this.ceiling = new THREE.MeshStandardMaterial({
            color: 0xFAF0E0, roughness: 0.9, metalness: 0.0
        })

        this.floor = new THREE.MeshStandardMaterial({
            color: 0xD4B896, roughness: 0.92, metalness: 0.0
        })

        this.pillar = new THREE.MeshStandardMaterial({
            color: 0x4A2E10, roughness: 0.85, metalness: 0.0
        })

        this.lanternGlass = new THREE.MeshStandardMaterial({
            color: 0xFF9A20,
            emissive: 0xFF7000,
            emissiveIntensity: 1.8,
            transparent: true,
            opacity: 0.82,
            roughness: 0.08,
            metalness: 0.0
        })

        this.lanternFrame = new THREE.MeshStandardMaterial({
            color: 0x1A0A00, roughness: 0.6, metalness: 0.5
        })

        this.teaCup = new THREE.MeshStandardMaterial({
            color: 0xE8C898, roughness: 0.28, metalness: 0.06
        })

        this.teaLiquid = new THREE.MeshStandardMaterial({
            color: 0x7A3800, roughness: 0.75, metalness: 0.0,
            emissive: 0x4A2000, emissiveIntensity: 0.2
        })

        this.metal = new THREE.MeshStandardMaterial({
            color: 0x707070, roughness: 0.35, metalness: 0.85
        })

        this.canopy = new THREE.MeshStandardMaterial({
            color: 0xA0200A, roughness: 1.0, metalness: 0.0, side: THREE.DoubleSide
        })
    }
}

import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Materials {
    constructor() {
        this.experience = new Experience()

        this.wood = new THREE.MeshStandardMaterial({
            color: 0x3d1e08,
            roughness: 0.85,
            metalness: 0.0
        })

        this.darkWood = new THREE.MeshStandardMaterial({
            color: 0x1e0e04,
            roughness: 0.9,
            metalness: 0.0
        })

        this.lightWood = new THREE.MeshStandardMaterial({
            color: 0x6b3515,
            roughness: 0.75,
            metalness: 0.05
        })

        this.plaster = new THREE.MeshStandardMaterial({
            color: 0x2a1e14,
            roughness: 0.95,
            metalness: 0.0
        })

        this.lanternGlass = new THREE.MeshStandardMaterial({
            color: 0xff8c00,
            emissive: 0xff6600,
            emissiveIntensity: 2,
            transparent: true,
            opacity: 0.8,
            roughness: 0.1,
            metalness: 0.0
        })

        this.lanternFrame = new THREE.MeshStandardMaterial({
            color: 0x1a0500,
            roughness: 0.6,
            metalness: 0.4
        })

        this.teaCup = new THREE.MeshStandardMaterial({
            color: 0xd4a05a,
            roughness: 0.3,
            metalness: 0.05
        })

        this.teaLiquid = new THREE.MeshStandardMaterial({
            color: 0x5c2a00,
            roughness: 0.8,
            metalness: 0.0,
            emissive: 0x3a1500,
            emissiveIntensity: 0.3
        })

        this.chalkboard = new THREE.MeshStandardMaterial({
            color: 0x0f2208,
            roughness: 1.0,
            metalness: 0.0
        })

        this.floor = new THREE.MeshStandardMaterial({
            color: 0x1a0e05,
            roughness: 0.95,
            metalness: 0.0
        })

        this.metal = new THREE.MeshStandardMaterial({
            color: 0x404040,
            roughness: 0.4,
            metalness: 0.8
        })

        this.canopy = new THREE.MeshStandardMaterial({
            color: 0x8b1a1a,
            roughness: 1.0,
            metalness: 0.0,
            side: THREE.DoubleSide
        })
    }
}

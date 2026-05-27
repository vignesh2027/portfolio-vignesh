import * as THREE from 'three'
import Experience from '../Experience.js'

// ── Exterior world constants ───────────────────────────
const FACADE_Z  = 4.2    // front face of kadai building
const STREET_Z  = 28.0   // where opposite building starts
const STREET_W  = 14     // street half-width  x = ±STREET_W
const OPP_Z     = 28.0   // front of opposite building
const OPP_BACK  = 38.0   // back of opposite building
const OPP_H     = 9.0    // height of opposite building

export default class TeaKadai {
    constructor(materials) {
        this.experience = new Experience()
        this.scene      = this.experience.scene
        this.materials  = materials

        this.clickTargets   = []
        this.lanterns       = []
        this.teaCups        = []
        this.fanBlades      = null
        this.rain           = null
        this.rainVelocities = null
        this.tvCanvas       = null
        this.tvCtx          = null
        this.tvMaterial     = null
        this.lastTVUpdate   = -1

        // ── Interior ──────────────────────────────────
        this.buildFloorAndWalls()
        this.buildCeiling()
        this.buildCounter()
        this.buildStove()
        this.buildProjectCups()
        this.buildSignBoard()
        this.buildChalkboard()
        this.buildAboutFrame()
        this.buildResearchFrame()
        this.buildContactSign()
        this.buildSkillsWall()
        this.buildGitHubWall()
        this.buildTV()
        this.buildLanterns()
        this.buildStringLights()
        this.buildWindow()
        this.buildPlants()
        this.buildDecorations()

        // ── Exterior world ────────────────────────────
        this.buildEntrance()
        this.buildExteriorFacadePanels()
        this.buildExteriorGround()
        this.buildExteriorWalls()
        this.buildStreetLamps()
        this.buildOppositeShop()

        // ── Atmosphere ────────────────────────────────
        this.buildRain()
        this.buildRainSound()
        this.buildStarField()
    }

    // ── Canvas helpers ─────────────────────────────────
    makeCanvasTexture(w, h, drawFn) {
        const canvas = document.createElement('canvas')
        canvas.width  = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        drawFn(ctx, w, h)
        const tex = new THREE.CanvasTexture(canvas)
        tex.colorSpace = THREE.SRGBColorSpace
        return tex
    }

    roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath()
        ctx.moveTo(x + r, y)
        ctx.lineTo(x + w - r, y)
        ctx.arcTo(x + w, y,   x + w, y + r,   r)
        ctx.lineTo(x + w, y + h - r)
        ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
        ctx.lineTo(x + r, y + h)
        ctx.arcTo(x, y + h, x, y + h - r, r)
        ctx.lineTo(x, y + r)
        ctx.arcTo(x, y,   x + r, y,   r)
        ctx.closePath()
    }

    // ── Floor and Walls ────────────────────────────────
    buildFloorAndWalls() {
        const m = this.materials

        // Floor — warm stone tiles pattern
        const floorTex = this.makeCanvasTexture(512, 512, (ctx, w, h) => {
            ctx.fillStyle = '#C4A882'
            ctx.fillRect(0, 0, w, h)
            ctx.strokeStyle = 'rgba(80,50,20,0.25)'
            ctx.lineWidth = 2
            const tileW = 64, tileH = 64
            for (let tx = 0; tx <= w; tx += tileW) {
                ctx.beginPath(); ctx.moveTo(tx, 0); ctx.lineTo(tx, h); ctx.stroke()
            }
            for (let ty = 0; ty <= h; ty += tileH) {
                ctx.beginPath(); ctx.moveTo(0, ty); ctx.lineTo(w, ty); ctx.stroke()
            }
            // Subtle variation
            for (let tx = 0; tx < w / tileW; tx++) {
                for (let ty = 0; ty < h / tileH; ty++) {
                    const noise = (Math.sin(tx * 7.3 + ty * 13.1) * 0.5 + 0.5) * 18
                    ctx.fillStyle = `rgba(${160 + noise},${120 + noise / 2},${70 + noise / 3},0.12)`
                    ctx.fillRect(tx * tileW + 2, ty * tileH + 2, tileW - 4, tileH - 4)
                }
            }
        })
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(22, 22),
            new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.88, metalness: 0.0 })
        )
        floor.rotation.x = -Math.PI / 2
        floor.position.y = -0.82
        floor.receiveShadow = true
        this.scene.add(floor)

        // Back wall — warm plaster with dado rail
        const backWallTex = this.makeCanvasTexture(1024, 512, (ctx, w, h) => {
            const g = ctx.createLinearGradient(0, 0, 0, h)
            g.addColorStop(0, '#F4E8D4')
            g.addColorStop(0.6, '#EDD9BF')
            g.addColorStop(1, '#D4B896')
            ctx.fillStyle = g
            ctx.fillRect(0, 0, w, h)
            // Subtle plaster texture
            for (let i = 0; i < 400; i++) {
                const x = Math.random() * w, y = Math.random() * h
                ctx.fillStyle = `rgba(180,140,80,${Math.random() * 0.06})`
                ctx.fillRect(x, y, 3, 3)
            }
        })
        const backWall = new THREE.Mesh(
            new THREE.PlaneGeometry(18, 5.5),
            new THREE.MeshStandardMaterial({ map: backWallTex, roughness: 0.93 })
        )
        backWall.position.set(0, 1.93, -3.0)
        backWall.receiveShadow = true
        this.scene.add(backWall)

        // Dado rail (decorative band at mid-wall height)
        const dadoRail = new THREE.Mesh(
            new THREE.BoxGeometry(18, 0.08, 0.05),
            new THREE.MeshStandardMaterial({ color: 0xC47D0A, roughness: 0.5, metalness: 0.2 })
        )
        dadoRail.position.set(0, 0.55, -2.97)
        this.scene.add(dadoRail)

        // Gold tile strip at bottom of wall
        const tileStrip = new THREE.Mesh(new THREE.PlaneGeometry(18, 0.65), new THREE.MeshStandardMaterial({
            map: this.makeCanvasTexture(900, 32, (ctx, w, h) => {
                const grad = ctx.createLinearGradient(0, 0, w, 0)
                grad.addColorStop(0,   '#C47D0A')
                grad.addColorStop(0.5, '#E8A020')
                grad.addColorStop(1,   '#C47D0A')
                ctx.fillStyle = grad
                ctx.fillRect(0, 0, w, h)
                for (let i = 0; i <= 30; i++) {
                    ctx.strokeStyle = 'rgba(255,248,240,0.3)'
                    ctx.lineWidth = 1
                    ctx.beginPath(); ctx.moveTo(i * 30, 0); ctx.lineTo(i * 30, h); ctx.stroke()
                }
            }),
            roughness: 0.6
        }))
        tileStrip.position.set(0, -0.55, -2.98)
        this.scene.add(tileStrip)

        // Left wall
        const sideWallMat = new THREE.MeshStandardMaterial({ color: 0xEDD9BF, roughness: 0.93 })
        const wallL = new THREE.Mesh(new THREE.PlaneGeometry(9, 5.5), sideWallMat)
        wallL.rotation.y = Math.PI / 2
        wallL.position.set(-5.78, 1.93, -1.5)
        wallL.receiveShadow = true
        this.scene.add(wallL)

        // Right wall
        const wallR = new THREE.Mesh(new THREE.PlaneGeometry(9, 5.5), sideWallMat.clone())
        wallR.rotation.y = -Math.PI / 2
        wallR.position.set(5.78, 1.93, -1.5)
        wallR.receiveShadow = true
        this.scene.add(wallR)

        // Gold dado strips on side walls
        const dadoL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.08, 9), new THREE.MeshStandardMaterial({ color: 0xC47D0A, roughness: 0.5 }))
        dadoL.position.set(-5.74, 0.55, -1.5)
        this.scene.add(dadoL)
        const dadoR = dadoL.clone()
        dadoR.position.set(5.74, 0.55, -1.5)
        this.scene.add(dadoR)
    }

    buildCeiling() {
        const m = this.materials
        const ceilingTex = this.makeCanvasTexture(512, 256, (ctx, w, h) => {
            ctx.fillStyle = '#F8EEE0'
            ctx.fillRect(0, 0, w, h)
            // Subtle cross-hatch paneling
            ctx.strokeStyle = 'rgba(180,140,80,0.12)'
            ctx.lineWidth = 1
            for (let i = 0; i <= w; i += 64) {
                ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke()
            }
            for (let i = 0; i <= h; i += 64) {
                ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke()
            }
        })
        const ceiling = new THREE.Mesh(
            new THREE.PlaneGeometry(18, 9),
            new THREE.MeshStandardMaterial({ map: ceilingTex, roughness: 0.9 })
        )
        ceiling.rotation.x = Math.PI / 2
        ceiling.position.set(0, 4.68, -1.5)
        this.scene.add(ceiling)

        // Crown molding
        const moldingMat = new THREE.MeshStandardMaterial({ color: 0xC47D0A, roughness: 0.4, metalness: 0.1 })
        const moldingF = new THREE.Mesh(new THREE.BoxGeometry(18, 0.12, 0.1), moldingMat)
        moldingF.position.set(0, 4.56, 3.0)
        this.scene.add(moldingF)
        const moldingB = moldingF.clone()
        moldingB.position.set(0, 4.56, -3.0)
        this.scene.add(moldingB)

        // Ceiling fan
        const fanHub = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.12, 0.22, 16),
            new THREE.MeshStandardMaterial({ color: 0x3D1E08, roughness: 0.6, metalness: 0.4 })
        )
        fanHub.position.set(0, 4.42, -0.5)
        this.scene.add(fanHub)

        const bladeMat = new THREE.MeshStandardMaterial({ color: 0x5C3317, roughness: 0.8 })
        const bladeGroup = new THREE.Group()
        for (let i = 0; i < 4; i++) {
            const blade = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.06, 0.3), bladeMat)
            blade.position.x = 0.7
            const arm = new THREE.Group()
            arm.add(blade)
            arm.rotation.y = (Math.PI / 2) * i
            bladeGroup.add(arm)
        }
        bladeGroup.position.set(0, 4.4, -0.5)
        this.scene.add(bladeGroup)
        this.fanBlades = bladeGroup

        // Wooden ceiling beams
        const beamMat = m.darkWood
        ;[-1.5, 0, 1.5].forEach(z => {
            const beam = new THREE.Mesh(new THREE.BoxGeometry(12, 0.16, 0.22), beamMat)
            beam.position.set(0, 4.36, z)
            beam.castShadow = true
            this.scene.add(beam)
        })

        // Canopy / awning at front
        const canopy = new THREE.Mesh(new THREE.PlaneGeometry(12, 3), m.canopy)
        canopy.rotation.x = -0.22
        canopy.position.set(0, 3.55, 1.8)
        canopy.receiveShadow = true
        this.scene.add(canopy)

        // Canopy fringe
        const fringeMat = new THREE.MeshStandardMaterial({ color: 0xF5DEB3, roughness: 0.9, side: THREE.DoubleSide })
        for (let i = -5.8; i <= 5.8; i += 0.28) {
            const fringe = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.01), fringeMat)
            fringe.rotation.x = -0.22
            fringe.position.set(i, 3.39, 3.1)
            this.scene.add(fringe)
        }

        // Canopy gold stripes
        const stripeMat = new THREE.MeshStandardMaterial({ color: 0xE8A020, emissive: 0xC47D0A, emissiveIntensity: 0.12, roughness: 0.5, side: THREE.DoubleSide })
        for (let i = -5.8; i <= 5.8; i += 0.56) {
            const stripe = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 3), stripeMat)
            stripe.rotation.x = -0.22
            stripe.position.set(i, 3.56, 1.8)
            this.scene.add(stripe)
        }
    }

    // ── Counter ────────────────────────────────────────
    buildCounter() {
        const m = this.materials

        // Main counter body
        const counterBase = new THREE.Mesh(new THREE.BoxGeometry(11.2, 1.5, 1.6), m.wood)
        counterBase.position.set(0, -0.07, 0)
        counterBase.castShadow = true
        counterBase.receiveShadow = true
        this.scene.add(counterBase)

        // Marble top
        const counterTop = new THREE.Mesh(new THREE.BoxGeometry(11.4, 0.09, 1.8), m.marble)
        counterTop.position.set(0, 0.695, 0)
        counterTop.castShadow = true
        this.scene.add(counterTop)

        // Carved wood panels on counter front
        const panelMat = new THREE.MeshStandardMaterial({ color: 0x7A4A22, roughness: 0.72, metalness: 0.05 })
        const archMat  = new THREE.MeshStandardMaterial({ color: 0xC47D0A, roughness: 0.5, metalness: 0.2 })
        const panelGeo = new THREE.BoxGeometry(0.9, 0.68, 0.04)
        for (let i = -5; i <= 5; i++) {
            const panel = new THREE.Mesh(panelGeo, panelMat)
            panel.position.set(i * 1.0, 0.12, 0.82)
            this.scene.add(panel)
            const arch = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.04, 16, 1, false, 0, Math.PI), archMat)
            arch.rotation.z = Math.PI / 2
            arch.rotation.x = Math.PI / 2
            arch.position.set(i * 1.0, 0.48, 0.82)
            this.scene.add(arch)
        }

        // Pillars flanking counter
        const pillarGeo = new THREE.CylinderGeometry(0.14, 0.18, 4.4, 12)
        ;[-5.2, 5.2].forEach(x => {
            const pillar = new THREE.Mesh(pillarGeo, m.pillar)
            pillar.position.set(x, 1.38, 0.9)
            pillar.castShadow = true
            this.scene.add(pillar)
            const capGeo = new THREE.BoxGeometry(0.4, 0.2, 0.4)
            const capT = new THREE.Mesh(capGeo, archMat)
            capT.position.set(x, 3.58, 0.9)
            this.scene.add(capT)
            const capB = new THREE.Mesh(capGeo, archMat)
            capB.position.set(x, -0.78, 0.9)
            this.scene.add(capB)
        })
    }

    // ── Stove + Kettle ─────────────────────────────────
    buildStove() {
        const m = this.materials
        const sx = 4.4

        const stoveBase = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.07, 1.0), m.metal)
        stoveBase.position.set(sx, 0.735, 0.1)
        this.scene.add(stoveBase)

        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.036, 8, 24), m.metal)
        ring.rotation.x = Math.PI / 2
        ring.position.set(sx, 0.775, 0.1)
        this.scene.add(ring)

        // Glow disc inside ring
        const glowMat = new THREE.MeshStandardMaterial({ color: 0xFF4400, emissive: 0xFF2200, emissiveIntensity: 1.4, roughness: 0.8 })
        const glow = new THREE.Mesh(new THREE.CircleGeometry(0.25, 24), glowMat)
        glow.rotation.x = -Math.PI / 2
        glow.position.set(sx, 0.782, 0.1)
        this.scene.add(glow)

        // Kettle
        const kettleBody = new THREE.Mesh(new THREE.SphereGeometry(0.24, 18, 14), m.metal)
        kettleBody.position.set(sx, 1.05, 0.1)
        kettleBody.castShadow = true
        this.scene.add(kettleBody)

        const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.046, 0.33, 8), m.metal)
        spout.rotation.z = -Math.PI / 4.5
        spout.position.set(sx + 0.3, 1.05, 0.1)
        this.scene.add(spout)

        const lid = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 8), m.metal)
        lid.position.set(sx, 1.31, 0.1)
        this.scene.add(lid)

        const handle = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.024, 8, 16, Math.PI), m.darkWood)
        handle.rotation.y = Math.PI / 2
        handle.position.set(sx - 0.25, 1.09, 0.1)
        this.scene.add(handle)

        // Jars near stove
        const jarColors = [0x8B0000, 0x2E6B30, 0xD4A017, 0x5C2A00, 0x8B4513]
        const jarSizes  = [[0.09, 0.26], [0.07, 0.21], [0.08, 0.19], [0.07, 0.31], [0.065, 0.22]]
        jarColors.forEach((c, i) => {
            this.buildJar(sx - 2.2 + i * 0.28, 0.74, -0.26, jarSizes[i][0], jarSizes[i][1], c)
        })
    }

    // ── 7 Project Cups ─────────────────────────────────
    buildProjectCups() {
        const projects = [
            { name: 'Game of DSA',        emoji: '🎮', tech: ['C++', 'Raylib', 'WASM'],         color: 0xD4A017, action: 'project-dsa'    },
            { name: 'NEXUS Intelligence', emoji: '🌌', tech: ['Three.js', 'WebGL', 'Firebase'],  color: 0x2E6B9A, action: 'project-nexus'  },
            { name: 'SparshCare',         emoji: '🏥', tech: ['Flutter', 'Dart', 'Riverpod'],    color: 0x8B2020, action: 'project-sparsh' },
            { name: 'SYNTHRON',           emoji: '🤖', tech: ['Python', 'LLM', 'Agents'],        color: 0x2A6B30, action: 'project-synth'  },
            { name: 'VORTEXRAG',          emoji: '🌀', tech: ['Python', 'FAISS', 'RAG'],         color: 0x6B2A8B, action: 'project-vortex' },
            { name: 'rustkvd',            emoji: '⚙',  tech: ['Rust', 'Raft', 'gRPC'],           color: 0xB04010, action: 'project-rust'   },
            { name: 'FluxDB',             emoji: '📊', tech: ['Rust', 'Time-series', 'LSM'],     color: 0x2B608B, action: 'project-flux'   },
        ]
        const xs = [-3.2, -2.2, -1.2, -0.2, 0.8, 1.8, 2.8]
        projects.forEach((p, i) => {
            const cup = this.buildLabeledCup(xs[i], 0.74, -0.3, p.name, p.emoji, p.tech, p.color, p.action)
            this.teaCups.push(cup)
        })
    }

    buildLabeledCup(x, y, z, name, emoji, tech, color, action) {
        const group  = new THREE.Group()
        const cupMat = new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.1 })

        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.076, 0.185, 20), cupMat)
        body.position.y = 0.092
        body.castShadow = true
        group.add(body)

        const liquid = new THREE.Mesh(new THREE.CylinderGeometry(0.092, 0.092, 0.02, 20), this.materials.teaLiquid)
        liquid.position.y = 0.174
        group.add(liquid)

        const saucer = new THREE.Mesh(new THREE.CylinderGeometry(0.142, 0.138, 0.024, 20), this.materials.teaCup)
        saucer.position.y = 0.012
        group.add(saucer)

        const handle = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.015, 8, 14, Math.PI), cupMat)
        handle.rotation.y = Math.PI / 2
        handle.position.set(0.112, 0.11, 0)
        group.add(handle)

        // Floating info card showing emoji, name, tech stack
        const colorHex = '#' + color.toString(16).padStart(6, '0')
        const cardTex = this.makeCanvasTexture(320, 128, (ctx, w, h) => {
            ctx.fillStyle = 'rgba(12,5,0,0.94)'; ctx.fillRect(0, 0, w, h)
            ctx.fillStyle = colorHex; ctx.fillRect(0, 0, w, 4)
            ctx.strokeStyle = '#E8A020'; ctx.lineWidth = 1.5
            ctx.strokeRect(4, 4, w - 8, h - 8)
            ctx.font = '600 20px serif'; ctx.textAlign = 'left'; ctx.fillStyle = '#FFF5E0'
            ctx.fillText(emoji, 12, 34)
            ctx.font = '700 18px Georgia, serif'
            ctx.fillText(name.length > 15 ? name.substring(0, 14) + '…' : name, 42, 34)
            ctx.font = '400 12px monospace'; ctx.fillStyle = 'rgba(232,160,32,0.85)'
            ctx.fillText(tech.join(' · '), 12, 58)
            ctx.strokeStyle = 'rgba(232,160,32,0.22)'; ctx.lineWidth = 1
            ctx.beginPath(); ctx.moveTo(12, 67); ctx.lineTo(w - 12, 67); ctx.stroke()
            ctx.font = 'italic 11px sans-serif'; ctx.fillStyle = 'rgba(255,245,224,0.45)'
            ctx.fillText('tap to explore project →', 12, 86)
            ctx.font = '700 10px monospace'; ctx.fillStyle = 'rgba(80,220,80,0.8)'
            ctx.fillText('● OPEN SOURCE', 12, 110)
        })
        const card = new THREE.Mesh(
            new THREE.PlaneGeometry(0.68, 0.27),
            new THREE.MeshStandardMaterial({ map: cardTex, roughness: 0.5, transparent: true, alphaTest: 0.01 })
        )
        card.position.set(0, 0.44, 0.09)
        card.rotation.x = -0.1
        group.add(card)

        group.position.set(x, y, z)
        group.userData.action = action
        group.userData.label  = name
        this.scene.add(group)

        const hitMesh = new THREE.Mesh(
            new THREE.CylinderGeometry(0.20, 0.20, 0.52, 12),
            new THREE.MeshStandardMaterial({ transparent: true, opacity: 0, depthWrite: false })
        )
        hitMesh.position.set(x, y + 0.12, z)
        hitMesh.userData.action = action
        hitMesh.userData.label  = name
        this.scene.add(hitMesh)
        this.clickTargets.push(hitMesh)

        return group
    }

    // ── Sign board ─────────────────────────────────────
    buildSignBoard() {
        const backing = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.92, 0.1), this.materials.darkWood)
        backing.position.set(0, 3.82, -0.55)
        this.scene.add(backing)

        const tex = this.makeCanvasTexture(1280, 184, (ctx, w, h) => {
            const grad = ctx.createLinearGradient(0, 0, w, 0)
            grad.addColorStop(0,   '#1E0E02')
            grad.addColorStop(0.3, '#3D2210')
            grad.addColorStop(0.7, '#3D2210')
            grad.addColorStop(1,   '#1E0E02')
            ctx.fillStyle = grad
            ctx.fillRect(0, 0, w, h)

            ctx.strokeStyle = '#E8A020'
            ctx.lineWidth = 5
            ctx.strokeRect(5, 5, w - 10, h - 10)
            ctx.strokeStyle = 'rgba(232,160,32,0.35)'
            ctx.lineWidth = 1.5
            ctx.strokeRect(13, 13, w - 26, h - 26)

            // Corner stars
            ;[[24, 24], [w - 24, 24], [24, h - 24], [w - 24, h - 24]].forEach(([cx, cy]) => {
                ctx.font = '18px serif'
                ctx.fillStyle = '#E8A020'
                ctx.textAlign = 'center'
                ctx.fillText('✦', cx, cy + 6)
            })

            ctx.font = '700 22px serif'
            ctx.fillStyle = '#C47D0A'
            ctx.textAlign = 'center'
            ctx.fillText('★  வி க்னேஷ்வர்  ★', w / 2, 44)

            ctx.font = '700 76px "Georgia", serif'
            ctx.fillStyle = '#FFF5E0'
            ctx.shadowColor = 'rgba(232,160,32,0.6)'
            ctx.shadowBlur = 16
            ctx.fillText("Vignesh's  Tea  Kadai", w / 2, 134)
            ctx.shadowBlur = 0
        })

        const sign = new THREE.Mesh(
            new THREE.PlaneGeometry(6.2, 0.86),
            new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7, metalness: 0.05 })
        )
        sign.position.set(0, 3.82, -0.51)
        this.scene.add(sign)

        // Wire hangers
        const wireMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7, roughness: 0.3 })
        ;[-2.8, 2.8].forEach(x => {
            const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.7, 4), wireMat)
            wire.position.set(x, 4.18, -0.55)
            this.scene.add(wire)
        })
    }

    // ── Chalkboard (projects menu) ─────────────────────
    buildChalkboard() {
        // Ornate frame
        const frame = new THREE.Mesh(new THREE.BoxGeometry(5.4, 3.6, 0.11), this.materials.darkWood)
        frame.position.set(0, 2.05, -2.93)
        this.scene.add(frame)

        const bevel = new THREE.Mesh(
            new THREE.BoxGeometry(5.1, 3.32, 0.05),
            new THREE.MeshStandardMaterial({ color: 0xC47D0A, roughness: 0.5, metalness: 0.2 })
        )
        bevel.position.set(0, 2.05, -2.89)
        this.scene.add(bevel)

        const items = [
            { code: 'Masala C++',     name: 'Game of DSA',       tag: 'C++ · Raylib · WebAssembly'        },
            { code: 'Cosmos Chai',    name: 'NEXUS Intelligence', tag: 'Three.js · Firebase · News API'    },
            { code: 'Care Tea',       name: 'SparshCare',         tag: 'Flutter · Firebase · Riverpod'     },
            { code: 'AI Blend',       name: 'SYNTHRON',           tag: 'Python · Multi-Agent · LLM'        },
            { code: 'RAG Brew',       name: 'VORTEXRAG',          tag: 'RAG · Semantic Search · Python'    },
            { code: 'Rust Kadha',     name: 'rustkvd',            tag: 'Rust · Raft · LSM · gRPC'          },
            { code: 'Flux Decoction', name: 'FluxDB',             tag: 'Rust · Time-series · 100+ tests'   },
        ]

        const tex = this.makeCanvasTexture(1020, 682, (ctx, w, h) => {
            // Chalkboard base
            ctx.fillStyle = '#0A1A07'
            ctx.fillRect(0, 0, w, h)

            // Chalk grain
            for (let i = 0; i < 600; i++) {
                ctx.beginPath()
                ctx.arc(Math.random() * w, Math.random() * h, 1.2, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(160,190,140,${Math.random() * 0.08})`
                ctx.fill()
            }

            // Header
            ctx.font = '700 38px "Georgia", serif'
            ctx.fillStyle = '#FFF5E0'
            ctx.textAlign = 'center'
            ctx.fillText('✦  Today\'s Special Menu  ✦', w / 2, 50)

            ctx.strokeStyle = 'rgba(232,160,32,0.6)'
            ctx.lineWidth = 2
            ctx.beginPath(); ctx.moveTo(30, 66); ctx.lineTo(w - 30, 66); ctx.stroke()
            ctx.lineWidth = 0.6
            ctx.beginPath(); ctx.moveTo(30, 71); ctx.lineTo(w - 30, 71); ctx.stroke()

            items.forEach(({ code, name, tag }, i) => {
                const y = 92 + i * 84
                // Row tint
                if (i % 2 === 0) {
                    ctx.fillStyle = 'rgba(255,245,224,0.035)'
                    ctx.fillRect(16, y - 6, w - 32, 72)
                }
                // Number badge
                ctx.fillStyle = 'rgba(232,160,32,0.9)'
                ctx.font = '700 18px monospace'
                ctx.textAlign = 'left'
                ctx.fillText(`${i + 1}`, 28, y + 18)

                // Code/menu name
                ctx.font = '700 26px "Georgia", serif'
                ctx.fillStyle = '#FFF5E0'
                ctx.fillText(code, 56, y + 18)

                // Real project name
                ctx.font = '600 18px sans-serif'
                ctx.fillStyle = 'rgba(255,245,224,0.7)'
                ctx.fillText(`→  ${name}`, 56, y + 44)

                // Tech tags
                ctx.font = '400 13px monospace'
                ctx.fillStyle = 'rgba(200,200,100,0.55)'
                ctx.fillText(tag, 56, y + 64)

                // Divider
                ctx.setLineDash([3, 5])
                ctx.strokeStyle = 'rgba(255,245,224,0.1)'
                ctx.lineWidth = 0.8
                ctx.beginPath()
                ctx.moveTo(24, y + 76); ctx.lineTo(w - 24, y + 76)
                ctx.stroke()
                ctx.setLineDash([])
            })

            // Footer hint
            ctx.font = 'italic 15px sans-serif'
            ctx.fillStyle = 'rgba(232,160,32,0.5)'
            ctx.textAlign = 'center'
            ctx.fillText('☞  click the tea cups below to explore each project  ☜', w / 2, h - 14)
        })

        const board = new THREE.Mesh(
            new THREE.PlaneGeometry(4.88, 3.24),
            new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95 })
        )
        board.position.set(0, 2.05, -2.86)
        board.name = 'menuBoard'
        board.userData.action = 'projects'
        board.userData.label  = 'Projects Menu'
        this.scene.add(board)
        this.clickTargets.push(board)
    }

    // ── About Me Frame ─────────────────────────────────
    buildAboutFrame() {
        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(2.8, 3.5, 0.1), this.materials.lightWood
        )
        frame.position.set(-5.5, 2.1, -2.93)
        this.scene.add(frame)

        const bevel = new THREE.Mesh(
            new THREE.BoxGeometry(2.56, 3.26, 0.05),
            new THREE.MeshStandardMaterial({ color: 0xC47D0A, roughness: 0.5, metalness: 0.2 })
        )
        bevel.position.set(-5.5, 2.1, -2.89)
        this.scene.add(bevel)

        const tex = this.makeCanvasTexture(512, 598, (ctx, w, h) => {
            ctx.fillStyle = '#FFFAF3'
            ctx.fillRect(0, 0, w, h)

            // Background wash
            const g = ctx.createRadialGradient(w / 2, h * 0.25, 20, w / 2, h * 0.25, 200)
            g.addColorStop(0, 'rgba(232,160,32,0.14)')
            g.addColorStop(1, 'rgba(232,160,32,0)')
            ctx.fillStyle = g
            ctx.fillRect(0, 0, w, h)

            // Avatar
            const av = ctx.createRadialGradient(w / 2, 90, 8, w / 2, 90, 72)
            av.addColorStop(0, '#F5C040')
            av.addColorStop(1, '#8B2500')
            ctx.beginPath()
            ctx.arc(w / 2, 90, 72, 0, Math.PI * 2)
            ctx.fillStyle = av
            ctx.fill()
            ctx.strokeStyle = 'rgba(232,160,32,0.85)'
            ctx.lineWidth = 3.5
            ctx.stroke()

            ctx.font = '700 60px Georgia, serif'
            ctx.fillStyle = '#FFFAF3'
            ctx.textAlign = 'center'
            ctx.fillText('V', w / 2, 114)

            // Name + role
            ctx.font = '700 32px Georgia, serif'
            ctx.fillStyle = '#1A0A00'
            ctx.fillText('Vigneshwar L', w / 2, 200)

            ctx.font = 'italic 15px Georgia, serif'
            ctx.fillStyle = '#C47D0A'
            ctx.fillText('ML Researcher · Systems Builder · Cloud', w / 2, 228)

            ctx.strokeStyle = 'rgba(196,125,10,0.3)'
            ctx.lineWidth = 1
            ctx.beginPath(); ctx.moveTo(40, 246); ctx.lineTo(w - 40, 246); ctx.stroke()

            // Bio text
            const bioLines = [
                'ML Researcher · Systems Builder · Cloud Engineer',
                'RAG Pipelines · Distributed Systems · AWS/GCP',
                'VORTEXRAG · rustkvd · FluxDB · SparshCare',
                '',
                'Takshashila University · B.Tech CS · Chennai',
                '7 open-source projects · 200+ contributions',
            ]
            ctx.font = '400 15px sans-serif'
            ctx.fillStyle = '#3A2010'
            ctx.textAlign = 'center'
            bioLines.forEach((line, i) => {
                ctx.fillText(line, w / 2, 272 + i * 24)
            })

            ctx.strokeStyle = 'rgba(196,125,10,0.2)'
            ctx.beginPath(); ctx.moveTo(40, 460); ctx.lineTo(w - 40, 460); ctx.stroke()

            // Quick info
            const icons = [['🎓', 'Takshashila Univ'], ['🐙', 'vignesh2027'], ['📧', 'gmail.com']]
            icons.forEach(([ic, txt], i) => {
                ctx.font = '400 14px sans-serif'
                ctx.fillStyle = '#2A1A08'
                ctx.textAlign = 'center'
                ctx.fillText(`${ic}  ${txt}`, w / 2, 484 + i * 26)
            })

            ctx.font = 'italic 13px sans-serif'
            ctx.fillStyle = 'rgba(196,125,10,0.5)'
            ctx.fillText('click for full profile', w / 2, h - 14)
        })

        const panel = new THREE.Mesh(
            new THREE.PlaneGeometry(2.46, 3.06),
            new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6 })
        )
        panel.position.set(-5.5, 2.1, -2.86)
        panel.name = 'aboutFrame'
        panel.userData.action = 'about'
        panel.userData.label  = 'About Me'
        this.scene.add(panel)
        this.clickTargets.push(panel)
    }

    // ── Research Frame (back wall right) ───────────────
    buildResearchFrame() {
        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(2.8, 3.5, 0.1), this.materials.darkWood
        )
        frame.position.set(5.5, 2.1, -2.93)
        this.scene.add(frame)

        const bevel = new THREE.Mesh(
            new THREE.BoxGeometry(2.56, 3.26, 0.05),
            new THREE.MeshStandardMaterial({ color: 0xC47D0A, roughness: 0.5, metalness: 0.2 })
        )
        bevel.position.set(5.5, 2.1, -2.89)
        this.scene.add(bevel)

        const tex = this.makeCanvasTexture(512, 598, (ctx, w, h) => {
            ctx.fillStyle = '#0D0805'
            ctx.fillRect(0, 0, w, h)
            // Subtle grain
            for (let i = 0; i < 300; i++) {
                ctx.fillStyle = `rgba(255,245,224,${Math.random() * 0.07})`
                ctx.fillRect(Math.random() * w, Math.random() * h, 3, 3)
            }

            ctx.font = '700 30px Georgia, serif'
            ctx.fillStyle = '#FFF5E0'
            ctx.textAlign = 'center'
            ctx.fillText('📜 Research & Papers', w / 2, 46)

            ctx.strokeStyle = 'rgba(232,160,32,0.5)'
            ctx.lineWidth = 1.5
            ctx.beginPath(); ctx.moveTo(28, 58); ctx.lineTo(w - 28, 58); ctx.stroke()

            const papers = [
                { title: 'VORTEXRAG: Towards Drift-Free', sub: 'Retrieval Augmented Generation', tag: 'AI/ML · RAG Systems · 2024' },
                { title: 'Distributed KV Store with', sub: 'Raft Consensus in Rust', tag: 'Systems · Distributed · 2024' },
                { title: 'SparshCare: Multi-Modal ICU', sub: 'Communication System', tag: 'HCI · Healthcare · Flutter' },
                { title: 'FluxDB: Time-Series Storage', sub: 'Engine from First Principles', tag: 'Databases · Rust · 2025' },
            ]

            papers.forEach((p, i) => {
                const y = 80 + i * 124
                ctx.fillStyle = 'rgba(255,245,224,0.04)'
                ctx.fillRect(18, y, w - 36, 112)

                ctx.font = '600 18px Georgia, serif'
                ctx.fillStyle = '#FFF5E0'
                ctx.textAlign = 'left'
                const x0 = 28
                ctx.fillText(p.title, x0, y + 28)
                ctx.fillText(p.sub, x0, y + 52)

                ctx.font = '400 13px monospace'
                ctx.fillStyle = 'rgba(232,160,32,0.65)'
                ctx.fillText(p.tag, x0, y + 76)

                ctx.strokeStyle = 'rgba(232,160,32,0.15)'
                ctx.lineWidth = 0.8
                ctx.beginPath(); ctx.moveTo(18, y + 104); ctx.lineTo(w - 18, y + 104); ctx.stroke()
            })

            ctx.font = 'italic 13px sans-serif'
            ctx.fillStyle = 'rgba(232,160,32,0.45)'
            ctx.textAlign = 'center'
            ctx.fillText('click to read more', w / 2, h - 14)
        })

        const panel = new THREE.Mesh(
            new THREE.PlaneGeometry(2.46, 3.06),
            new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8 })
        )
        panel.position.set(5.5, 2.1, -2.86)
        panel.name = 'researchFrame'
        panel.userData.action = 'research'
        panel.userData.label  = 'Research Papers'
        this.scene.add(panel)
        this.clickTargets.push(panel)
    }

    // ── Contact sign (bottom right) ────────────────────
    buildContactSign() {
        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(2.6, 1.1, 0.09), this.materials.darkWood
        )
        frame.position.set(5.5, 0.5, -2.93)
        this.scene.add(frame)

        const tex = this.makeCanvasTexture(480, 200, (ctx, w, h) => {
            ctx.fillStyle = '#1A0D02'
            ctx.fillRect(0, 0, w, h)
            ctx.strokeStyle = '#E8A020'
            ctx.lineWidth = 4
            ctx.strokeRect(5, 5, w - 10, h - 10)

            ctx.font = '700 28px Georgia, serif'
            ctx.fillStyle = '#FFF5E0'
            ctx.textAlign = 'center'
            ctx.fillText('☕  Find Me', w / 2, 48)

            ctx.strokeStyle = 'rgba(232,160,32,0.4)'
            ctx.lineWidth = 1
            ctx.beginPath(); ctx.moveTo(28, 62); ctx.lineTo(w - 28, 62); ctx.stroke()

            ctx.font = '500 16px monospace'
            ctx.fillStyle = '#E8A020'
            ctx.fillText('github.com/vignesh2027', w / 2, 94)

            ctx.font = '400 13px sans-serif'
            ctx.fillStyle = 'rgba(255,245,224,0.55)'
            ctx.fillText('applemacbook6sep2004@gmail.com', w / 2, 120)
            ctx.fillText('linkedin.com/in/vigneshwar-s', w / 2, 144)

            ctx.font = 'italic 13px sans-serif'
            ctx.fillStyle = 'rgba(232,160,32,0.45)'
            ctx.fillText('[ click to connect ]', w / 2, 184)
        })

        const sign = new THREE.Mesh(
            new THREE.PlaneGeometry(2.38, 0.9),
            new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7 })
        )
        sign.position.set(5.5, 0.5, -2.86)
        sign.name = 'contactSign'
        sign.userData.action = 'contact'
        sign.userData.label  = 'Contact'
        this.scene.add(sign)
        this.clickTargets.push(sign)
    }

    // ── Skills on Left Wall ────────────────────────────
    buildSkillsWall() {
        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 3.2, 3.6), this.materials.lightWood
        )
        frame.position.set(-5.73, 2.1, -1.5)
        this.scene.add(frame)

        const bevel = new THREE.Mesh(
            new THREE.BoxGeometry(0.05, 2.96, 3.36),
            new THREE.MeshStandardMaterial({ color: 0xC47D0A, roughness: 0.5, metalness: 0.2 })
        )
        bevel.position.set(-5.71, 2.1, -1.5)
        this.scene.add(bevel)

        const tex = this.makeCanvasTexture(672, 592, (ctx, w, h) => {
            ctx.fillStyle = '#FFFAF3'
            ctx.fillRect(0, 0, w, h)

            // Warm gradient
            const g = ctx.createLinearGradient(0, 0, 0, h)
            g.addColorStop(0, 'rgba(232,160,32,0.08)')
            g.addColorStop(1, 'rgba(232,160,32,0)')
            ctx.fillStyle = g
            ctx.fillRect(0, 0, w, h)

            ctx.font = '700 32px Georgia, serif'
            ctx.fillStyle = '#1A0A00'
            ctx.textAlign = 'center'
            ctx.fillText('⚙  Skills & Stack', w / 2, 44)

            ctx.strokeStyle = 'rgba(196,125,10,0.4)'
            ctx.lineWidth = 1.5
            ctx.beginPath(); ctx.moveTo(30, 58); ctx.lineTo(w - 30, 58); ctx.stroke()

            const skills = [
                { cat: '◈ Languages', items: ['Rust', 'Python', 'C++', 'Dart', 'JavaScript', 'Go'] },
                { cat: '◈ Frameworks', items: ['Flutter', 'Three.js', 'FastAPI', 'Tokio', 'Axum'] },
                { cat: '◈ AI / ML', items: ['LLM Fine-tuning', 'RAG Pipelines', 'FAISS', 'LangChain'] },
                { cat: '◈ Systems', items: ['Distributed Systems', 'Consensus (Raft)', 'LSM Trees', 'gRPC'] },
                { cat: '◈ Cloud & DB', items: ['Firebase', 'PostgreSQL', 'Docker', 'GitHub Actions'] },
            ]

            let yy = 76
            skills.forEach(({ cat, items }) => {
                ctx.font = '600 17px monospace'
                ctx.fillStyle = '#C47D0A'
                ctx.textAlign = 'left'
                ctx.fillText(cat, 26, yy)
                yy += 26

                // Badge chips
                let chipX = 26
                items.forEach(item => {
                    const tw = ctx.measureText(item).width + 18
                    if (chipX + tw > w - 20) { chipX = 26; yy += 32 }

                    this.roundRect(ctx, chipX, yy - 16, tw, 24, 6)
                    ctx.fillStyle = 'rgba(196,125,10,0.12)'
                    ctx.fill()
                    ctx.strokeStyle = 'rgba(196,125,10,0.4)'
                    ctx.lineWidth = 1
                    ctx.stroke()

                    ctx.font = '500 14px monospace'
                    ctx.fillStyle = '#2A1A08'
                    ctx.textAlign = 'left'
                    ctx.fillText(item, chipX + 9, yy + 2)

                    chipX += tw + 8
                })
                yy += 36

                ctx.strokeStyle = 'rgba(196,125,10,0.15)'
                ctx.lineWidth = 0.8
                ctx.beginPath(); ctx.moveTo(26, yy - 6); ctx.lineTo(w - 26, yy - 6); ctx.stroke()
                yy += 6
            })

            ctx.font = 'italic 13px sans-serif'
            ctx.fillStyle = 'rgba(196,125,10,0.45)'
            ctx.textAlign = 'center'
            ctx.fillText('click for detailed profile', w / 2, h - 14)
        })

        const panel = new THREE.Mesh(
            new THREE.PlaneGeometry(3.2, 2.76),
            new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6 })
        )
        panel.rotation.y = Math.PI / 2
        panel.position.set(-5.68, 2.1, -1.5)
        panel.userData.action = 'about'
        panel.userData.label  = 'Skills & Stack'
        this.scene.add(panel)
        this.clickTargets.push(panel)
    }

    // ── GitHub / Stats on Right Wall ──────────────────
    buildGitHubWall() {
        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 3.2, 3.6), this.materials.darkWood
        )
        frame.position.set(5.73, 2.1, -1.5)
        this.scene.add(frame)

        const bevel = new THREE.Mesh(
            new THREE.BoxGeometry(0.05, 2.96, 3.36),
            new THREE.MeshStandardMaterial({ color: 0xC47D0A, roughness: 0.5, metalness: 0.2 })
        )
        bevel.position.set(5.71, 2.1, -1.5)
        this.scene.add(bevel)

        const tex = this.makeCanvasTexture(672, 592, (ctx, w, h) => {
            ctx.fillStyle = '#050D02'
            ctx.fillRect(0, 0, w, h)
            // Grid dots
            for (let xi = 0; xi < w; xi += 28) {
                for (let yi = 0; yi < h; yi += 28) {
                    ctx.beginPath()
                    ctx.arc(xi, yi, 0.8, 0, Math.PI * 2)
                    ctx.fillStyle = 'rgba(255,245,224,0.06)'
                    ctx.fill()
                }
            }

            ctx.font = '700 30px Georgia, serif'
            ctx.fillStyle = '#FFF5E0'
            ctx.textAlign = 'center'
            ctx.fillText('🐙  GitHub Stats', w / 2, 44)

            ctx.strokeStyle = 'rgba(232,160,32,0.5)'
            ctx.lineWidth = 1.5
            ctx.beginPath(); ctx.moveTo(30, 58); ctx.lineTo(w - 30, 58); ctx.stroke()

            // Stats cards
            const stats = [
                { label: 'Public Repos',    val: '12+',  icon: '📦' },
                { label: 'Stars Earned',    val: '45+',  icon: '⭐' },
                { label: 'Contributions',   val: '200+', icon: '🟢' },
                { label: 'Languages Used',  val: '7',    icon: '⌨'  },
            ]

            stats.forEach(({ label, val, icon }, i) => {
                const col  = i % 2
                const row  = Math.floor(i / 2)
                const cx   = 60 + col * 290
                const cy   = 88 + row * 130
                const cw   = 250
                const ch   = 100

                this.roundRect(ctx, cx, cy, cw, ch, 10)
                ctx.fillStyle = 'rgba(255,245,224,0.05)'
                ctx.fill()
                ctx.strokeStyle = 'rgba(232,160,32,0.25)'
                ctx.lineWidth = 1
                ctx.stroke()

                ctx.font = '32px sans-serif'
                ctx.textAlign = 'center'
                ctx.fillText(icon, cx + cw / 2, cy + 40)

                ctx.font = '700 28px Georgia, serif'
                ctx.fillStyle = '#E8A020'
                ctx.fillText(val, cx + cw / 2, cy + 70)

                ctx.font = '400 13px sans-serif'
                ctx.fillStyle = 'rgba(255,245,224,0.6)'
                ctx.fillText(label, cx + cw / 2, cy + 90)
            })

            // Contribution graph (decorative)
            ctx.font = '600 16px monospace'
            ctx.fillStyle = 'rgba(255,245,224,0.8)'
            ctx.textAlign = 'left'
            ctx.fillText('Contribution Activity', 30, 376)

            for (let c = 0; c < 48; c++) {
                for (let r = 0; r < 7; r++) {
                    const val = Math.random()
                    const alpha = val * val * 0.9
                    const green = 60 + Math.floor(val * 160)
                    ctx.fillStyle = `rgba(80,${green},40,${alpha})`
                    this.roundRect(ctx, 30 + c * 13, 390 + r * 13, 11, 11, 2)
                    ctx.fill()
                }
            }

            // LinkedIn section
            ctx.strokeStyle = 'rgba(232,160,32,0.3)'
            ctx.lineWidth = 1
            ctx.beginPath(); ctx.moveTo(28, 488); ctx.lineTo(w - 28, 488); ctx.stroke()

            ctx.font = '700 20px Georgia, serif'
            ctx.fillStyle = '#FFF5E0'
            ctx.textAlign = 'center'
            ctx.fillText('💼  Connect on LinkedIn', w / 2, 522)

            ctx.font = '400 14px monospace'
            ctx.fillStyle = 'rgba(232,160,32,0.7)'
            ctx.fillText('linkedin.com/in/vigneshwar-s', w / 2, 550)

            ctx.font = 'italic 13px sans-serif'
            ctx.fillStyle = 'rgba(232,160,32,0.45)'
            ctx.fillText('click to connect', w / 2, h - 14)
        })

        const panel = new THREE.Mesh(
            new THREE.PlaneGeometry(3.2, 2.76),
            new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7 })
        )
        panel.rotation.y = -Math.PI / 2
        panel.position.set(5.68, 2.1, -1.5)
        panel.userData.action = 'contact'
        panel.userData.label  = 'GitHub & LinkedIn'
        this.scene.add(panel)
        this.clickTargets.push(panel)
    }

    // ── Lanterns ───────────────────────────────────────
    buildLanterns() {
        const defs = [
            { x: -3.5, y: 2.55, z: 0.4,  s: 0.26 },
            { x: -1.5, y: 2.75, z: 0.2,  s: 0.32 },
            { x:  0,   y: 2.88, z: -0.4, s: 0.36 },
            { x:  1.5, y: 2.75, z: 0.2,  s: 0.32 },
            { x:  3.5, y: 2.55, z: 0.4,  s: 0.26 },
        ]
        const cordMat = new THREE.MeshStandardMaterial({ color: 0x3D1E08, roughness: 0.9 })

        defs.forEach((d, i) => {
            this.lanterns.push(this.buildLantern(d.x, d.y, d.z, d.s))
            const cordH = 4.45 - d.y - d.s
            const cord  = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, cordH, 4), cordMat)
            cord.position.set(d.x, 4.45 - cordH / 2, d.z)
            this.scene.add(cord)
        })
    }

    buildLantern(x, y, z, size) {
        const group = new THREE.Group()

        const body = new THREE.Mesh(new THREE.SphereGeometry(size, 14, 10), this.materials.lanternGlass)
        group.add(body)

        const capMat = this.materials.lanternFrame
        const capT   = new THREE.Mesh(new THREE.CylinderGeometry(size * 0.28, size * 0.28, size * 0.22, 8), capMat)
        capT.position.y = size * 0.88
        group.add(capT)

        const capB = new THREE.Mesh(new THREE.CylinderGeometry(size * 0.18, size * 0.13, size * 0.32, 8), capMat)
        capB.position.y = -size * 0.96
        group.add(capB)

        for (let i = 0; i < 4; i++) {
            const rib = new THREE.Mesh(new THREE.BoxGeometry(0.013, size * 2, 0.013), capMat)
            rib.rotation.y = (Math.PI / 2) * i
            group.add(rib)
        }

        group.position.set(x, y, z)
        this.scene.add(group)
        return group
    }

    // ── String lights on ceiling ───────────────────────
    buildStringLights() {
        const cordMat   = new THREE.MeshStandardMaterial({ color: 0x2A1A08, roughness: 0.9 })
        const bulbMat   = new THREE.MeshStandardMaterial({ color: 0xFFE090, emissive: 0xFFD040, emissiveIntensity: 1.2, roughness: 0.1 })

        // 3 strings from front to back
        ;[-3, 0, 3].forEach(x => {
            for (let z = -2.8; z <= 2.0; z += 0.6) {
                // Small bulb
                const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6), bulbMat.clone())
                bulb.position.set(x, 4.35 - Math.abs(Math.sin(z)) * 0.15, z)
                this.scene.add(bulb)
            }
            // Catenary cord (simplified as segments)
            for (let seg = 0; seg < 18; seg++) {
                const t0 = seg / 18, t1 = (seg + 1) / 18
                const z0 = -2.8 + t0 * 4.8, z1 = -2.8 + t1 * 4.8
                const y0 = 4.4 - Math.sin(t0 * Math.PI) * 0.12
                const y1 = 4.4 - Math.sin(t1 * Math.PI) * 0.12
                const midZ = (z0 + z1) / 2, midY = (y0 + y1) / 2
                const len = Math.sqrt(Math.pow(z1 - z0, 2) + Math.pow(y1 - y0, 2))
                const angle = Math.atan2(y0 - y1, z1 - z0)
                const seg3d = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, len, 4), cordMat)
                seg3d.rotation.x = angle
                seg3d.position.set(x, midY, midZ)
                this.scene.add(seg3d)
            }
        })
    }

    // ── Window with night sky ──────────────────────────
    buildWindow() {
        // Window glass — night sky visible
        const glassMat = new THREE.MeshStandardMaterial({
            color: 0x0A1530,
            emissive: 0x050A18,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.9,
            roughness: 0.08
        })
        const glass = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 2.4), glassMat)
        glass.rotation.y = Math.PI / 2
        glass.position.set(-5.75, 2.0, -0.8)
        this.scene.add(glass)

        // Stars visible through window
        const starTex = this.makeCanvasTexture(400, 480, (ctx, w, h) => {
            ctx.fillStyle = '#06101E'
            ctx.fillRect(0, 0, w, h)
            // Moon
            ctx.beginPath()
            ctx.arc(w * 0.72, h * 0.22, 36, 0, Math.PI * 2)
            ctx.fillStyle = 'rgba(255,240,180,0.85)'
            ctx.fill()
            ctx.beginPath()
            ctx.arc(w * 0.8, h * 0.18, 30, 0, Math.PI * 2)
            ctx.fillStyle = '#06101E'
            ctx.fill()

            for (let i = 0; i < 200; i++) {
                const sx = Math.random() * w
                const sy = Math.random() * h
                const sr = Math.random() * 1.8 + 0.3
                const alpha = Math.random() * 0.7 + 0.3
                ctx.beginPath()
                ctx.arc(sx, sy, sr, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255,255,255,${alpha})`
                ctx.fill()
            }
        })
        const nightSky = new THREE.Mesh(
            new THREE.PlaneGeometry(1.96, 2.36),
            new THREE.MeshStandardMaterial({ map: starTex, roughness: 0.1 })
        )
        nightSky.rotation.y = Math.PI / 2
        nightSky.position.set(-5.73, 2.0, -0.8)
        this.scene.add(nightSky)

        // Window glow
        const glowMat = new THREE.MeshStandardMaterial({
            color: 0xC8E8FF,
            emissive: 0x3060A0,
            emissiveIntensity: 0.25,
            transparent: true,
            opacity: 0.12
        })
        const glow = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 2.4), glowMat)
        glow.rotation.y = Math.PI / 2
        glow.position.set(-5.72, 2.0, -0.8)
        this.scene.add(glow)

        // Frame
        const fMat = this.materials.darkWood
        const frameH = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.5, 2.1), fMat)
        frameH.rotation.y = Math.PI / 2
        frameH.position.set(-5.74, 2.0, -0.8)
        this.scene.add(frameH)

        const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 1.98), fMat)
        crossH.rotation.y = Math.PI / 2
        crossH.position.set(-5.73, 2.0, -0.8)
        this.scene.add(crossH)

        const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.05, 2.38, 0.05), fMat)
        crossV.rotation.y = Math.PI / 2
        crossV.position.set(-5.73, 2.0, -0.8)
        this.scene.add(crossV)

        // Window sill
        const sill = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 2.2), fMat)
        sill.position.set(-5.72, 0.78, -0.8)
        this.scene.add(sill)
    }

    // ── Plants in corners ──────────────────────────────
    buildPlants() {
        ;[[-4.4, -0.82, 2.0], [4.4, -0.82, 2.0]].forEach(([x, y, z]) => {
            // Pot
            const potMat = new THREE.MeshStandardMaterial({ color: 0xA0522D, roughness: 0.8 })
            const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.28, 12), potMat)
            pot.position.set(x, y + 0.14, z)
            this.scene.add(pot)

            // Dirt
            const dirt = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.04, 12), new THREE.MeshStandardMaterial({ color: 0x3D2010, roughness: 1.0 }))
            dirt.position.set(x, y + 0.28, z)
            this.scene.add(dirt)

            // Stems + leaves
            const leafMat = new THREE.MeshStandardMaterial({ color: 0x2D6A1C, roughness: 0.9, side: THREE.DoubleSide })
            for (let l = 0; l < 5; l++) {
                const angle = (l / 5) * Math.PI * 2
                const lean  = 0.28 + Math.random() * 0.12
                const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.018, 0.55, 6), new THREE.MeshStandardMaterial({ color: 0x1A4A10, roughness: 0.9 }))
                stem.position.set(x + Math.cos(angle) * lean * 0.4, y + 0.56, z + Math.sin(angle) * lean * 0.4)
                stem.rotation.z = Math.cos(angle) * 0.45
                stem.rotation.x = Math.sin(angle) * 0.45
                this.scene.add(stem)

                const leaf = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.38), leafMat)
                leaf.position.set(x + Math.cos(angle) * lean, y + 0.7, z + Math.sin(angle) * lean)
                leaf.rotation.y = -angle
                leaf.rotation.z = 0.3 + Math.random() * 0.3
                this.scene.add(leaf)
            }
        })
    }

    // ── Decorations ────────────────────────────────────
    buildDecorations() {
        // Clock on back wall
        const clockFace = new THREE.Mesh(
            new THREE.CircleGeometry(0.3, 32),
            new THREE.MeshStandardMaterial({
                map: this.makeCanvasTexture(128, 128, (ctx, w, h) => {
                    ctx.fillStyle = '#FFFAF5'
                    ctx.beginPath(); ctx.arc(w / 2, h / 2, w / 2, 0, Math.PI * 2); ctx.fill()
                    ctx.strokeStyle = '#C47D0A'; ctx.lineWidth = 5; ctx.stroke()
                    for (let i = 0; i < 12; i++) {
                        const a = (i / 12) * Math.PI * 2 - Math.PI / 2
                        ctx.beginPath()
                        ctx.arc(w / 2 + 52 * Math.cos(a), h / 2 + 52 * Math.sin(a), i % 3 === 0 ? 4 : 2, 0, Math.PI * 2)
                        ctx.fillStyle = '#2A1A08'; ctx.fill()
                    }
                    ctx.strokeStyle = '#2A1A08'; ctx.lineWidth = 3
                    ctx.beginPath(); ctx.moveTo(w / 2, h / 2); ctx.lineTo(w / 2, h / 2 - 35); ctx.stroke()
                    ctx.lineWidth = 2
                    ctx.beginPath(); ctx.moveTo(w / 2, h / 2); ctx.lineTo(w / 2 + 28, h / 2); ctx.stroke()
                }),
                roughness: 0.5
            })
        )
        clockFace.position.set(-2.6, 3.2, -2.97)
        this.scene.add(clockFace)

        // Shelf on back wall (right side)
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.07, 0.38), this.materials.lightWood)
        shelf.position.set(3.0, 3.5, -2.78)
        shelf.castShadow = true
        this.scene.add(shelf)

        // Jars on shelf
        const jColors = [0x8B0000, 0xD4A017, 0x2E6B30, 0x5C2A00, 0x556B2F, 0x8B4513, 0xC47D0A]
        const jSizes  = [[0.06, 0.22], [0.08, 0.18], [0.07, 0.26], [0.09, 0.20], [0.06, 0.17], [0.08, 0.23], [0.07, 0.19]]
        jColors.forEach((c, i) => {
            this.buildJar(1.6 + i * 0.38, 3.57, -2.6, jSizes[i][0], jSizes[i][1], c)
        })

        // Towel hanging on counter front
        const towelMat = new THREE.MeshStandardMaterial({ color: 0xC43A18, roughness: 0.95, side: THREE.DoubleSide })
        const towel = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.55), towelMat)
        towel.position.set(-1.2, 0.3, 0.84)
        towel.rotation.x = 0.08
        this.scene.add(towel)

        // Stripe on towel
        const stripe = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.06), new THREE.MeshStandardMaterial({ color: 0xFFF5E0, roughness: 0.95, side: THREE.DoubleSide }))
        stripe.position.set(-1.2, 0.38, 0.845)
        this.scene.add(stripe)

        // Menu chalkboard easel near counter
        const easelMat = this.materials.darkWood
        const easel1 = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.5, 0.03), easelMat)
        easel1.rotation.x = 0.25
        easel1.position.set(-4.8, 0.65, 1.25)
        this.scene.add(easel1)

        const smallBoard = new THREE.Mesh(
            new THREE.PlaneGeometry(0.5, 0.38),
            new THREE.MeshStandardMaterial({
                map: this.makeCanvasTexture(200, 152, (ctx, w, h) => {
                    ctx.fillStyle = '#0A1A07'
                    ctx.fillRect(0, 0, w, h)
                    ctx.font = '700 18px Georgia, serif'
                    ctx.fillStyle = '#FFF5E0'
                    ctx.textAlign = 'center'
                    ctx.fillText('Today\'s Brew', w / 2, 36)
                    ctx.font = '400 14px sans-serif'
                    ctx.fillStyle = '#E8A020'
                    ctx.fillText('Masala Chai — ₹15', w / 2, 68)
                    ctx.fillText('Filter Coffee — ₹20', w / 2, 92)
                    ctx.fillText('Ginger Tea — ₹12', w / 2, 116)
                }),
                roughness: 0.9
            })
        )
        smallBoard.rotation.x = 0.25
        smallBoard.position.set(-4.8, 0.88, 1.12)
        this.scene.add(smallBoard)
    }

    buildJar(x, y, z, r, h, color) {
        const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.06 })
        const body = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 0.88, h, 18), mat)
        body.position.set(x, y + h / 2, z)
        body.castShadow = true
        this.scene.add(body)
        const lid = new THREE.Mesh(
            new THREE.CylinderGeometry(r * 1.08, r * 1.08, 0.024, 18),
            new THREE.MeshStandardMaterial({ color: 0x2A1A08, roughness: 0.6, metalness: 0.4 })
        )
        lid.position.set(x, y + h + 0.012, z)
        this.scene.add(lid)
    }

    // ── Star field ─────────────────────────────────────
    buildStarField() {
        const count = 1400
        const pos   = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            pos[i * 3]     = (Math.random() - 0.5) * 70
            pos[i * 3 + 1] = Math.random() * 20 + 5
            pos[i * 3 + 2] = (Math.random() - 0.5) * 70 - 6
        }
        const geo   = new THREE.BufferGeometry()
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
        this.stars = new THREE.Points(
            geo,
            new THREE.PointsMaterial({ color: 0xFFF8E7, size: 0.06, sizeAttenuation: true, transparent: true, opacity: 0.8 })
        )
        this.scene.add(this.stars)
    }

    // ── TV (animated terminal screen) ─────────────────
    buildTV() {
        // TV body — right interior wall
        const tvBody = new THREE.Mesh(
            new THREE.BoxGeometry(0.06, 1.3, 2.1),
            new THREE.MeshStandardMaterial({ color: 0x1A1A1A, roughness: 0.5, metalness: 0.7 })
        )
        tvBody.position.set(5.72, 2.8, 0.8)
        this.scene.add(tvBody)

        // Bezels
        ;[[-0.62, 0], [0.62, 0], [0, -0.62], [0, 0.62]].forEach(([dz, dy]) => {
            const b = new THREE.Mesh(
                new THREE.BoxGeometry(0.07, dy ? 0.06 : 1.3, dz ? 0.12 : 2.1),
                new THREE.MeshStandardMaterial({ color: 0x0A0A0A, roughness: 0.6, metalness: 0.6 })
            )
            b.position.set(5.72, 2.8 + dy, 0.8 + dz)
            this.scene.add(b)
        })

        // Screen canvas — smaller size since TV is small in scene
        const W = 256, H = 160
        this.tvCanvas = document.createElement('canvas')
        this.tvCanvas.width  = W
        this.tvCanvas.height = H
        this.tvCtx = this.tvCanvas.getContext('2d')

        const screenTex = new THREE.CanvasTexture(this.tvCanvas)
        screenTex.colorSpace = THREE.SRGBColorSpace
        this.tvMaterial = new THREE.MeshStandardMaterial({
            map: screenTex, emissive: 0x001408, emissiveIntensity: 0.4, roughness: 0.05
        })
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.96, 1.22), this.tvMaterial)
        screen.rotation.y = -Math.PI / 2
        screen.position.set(5.69, 2.8, 0.8)
        this.scene.add(screen)

        this.tvLight = null

        // Initial frame draw
        this.drawTVFrame(0)
    }

    drawTVFrame(elapsedTime) {
        if (!this.tvCtx) return
        const ctx = this.tvCtx
        const W = 256, H = 160

        ctx.fillStyle = '#050D08'
        ctx.fillRect(0, 0, W, H)

        // Scanlines
        for (let y = 0; y < H; y += 4) {
            ctx.fillStyle = 'rgba(0,0,0,0.15)'
            ctx.fillRect(0, y, W, 2)
        }

        // Header bar
        ctx.fillStyle = '#002208'
        ctx.fillRect(0, 0, W, 34)

        ctx.font = '700 13px monospace'
        ctx.fillStyle = '#00FF88'
        ctx.textAlign = 'left'
        ctx.fillText('vignesh@dev:~$', 12, 22)

        // Live time (top right)
        ctx.font = '600 12px monospace'
        ctx.fillStyle = '#80FFAA'
        ctx.textAlign = 'right'
        const now = new Date()
        ctx.fillText(now.toLocaleTimeString(), W - 10, 22)

        ctx.textAlign = 'left'

        // Git log lines (scroll based on time)
        const logLines = [
            { hash: 'f0fd3e1', msg: 'feat: camera inside kadai', time: '2m ago' },
            { hash: 'fb4eb91', msg: 'fix: ASI trap — startup crash', time: '1d ago' },
            { hash: 'b976581', msg: 'feat: 3D tea kadai portfolio',   time: '2d ago' },
            { hash: '63dea2b', msg: 'feat: cup info cards + uni fix', time: '3d ago' },
            { hash: 'a1b2c3d', msg: 'feat: FluxDB 100+ tests pass',   time: '5d ago' },
            { hash: 'e4f5g6h', msg: 'feat: VORTEXRAG 7-layer RAG',    time: '8d ago' },
            { hash: 'i7j8k9l', msg: 'feat: rustkvd Raft consensus',   time: '12d ago'},
            { hash: 'm1n2o3p', msg: 'fix: SparshCare eye tracking',   time: '18d ago'},
        ]
        const offset = Math.floor(elapsedTime * 0.2) % logLines.length

        ctx.font = '700 11px monospace'
        ctx.fillStyle = 'rgba(0,255,136,0.7)'
        ctx.fillText('$ git log --oneline HEAD~8..HEAD', 12, 54)

        logLines.forEach((l, i) => {
            const li = (i + offset) % logLines.length
            const y = 76 + i * 26
            ctx.fillStyle = 'rgba(255,200,80,0.8)'
            ctx.font = '600 10px monospace'
            ctx.fillText(logLines[li].hash, 12, y)
            ctx.fillStyle = 'rgba(255,255,255,0.75)'
            ctx.font = '400 11px monospace'
            ctx.fillText(logLines[li].msg, 80, y)
            ctx.fillStyle = 'rgba(120,180,120,0.5)'
            ctx.font = '400 9px monospace'
            ctx.fillText(logLines[li].time, W - 60, y)
        })

        // Status bar
        ctx.fillStyle = '#001A08'
        ctx.fillRect(0, H - 30, W, 30)
        ctx.font = '400 10px monospace'
        ctx.fillStyle = 'rgba(0,255,136,0.6)'
        ctx.textAlign = 'left'
        ctx.fillText('● 7 projects  ● 200+ commits  ● Open Source', 12, H - 10)

        if (this.tvMaterial && this.tvMaterial.map) {
            this.tvMaterial.map.needsUpdate = true
        }
    }

    // ── Entrance facade ────────────────────────────────
    buildEntrance() {
        const m = this.materials

        // Overhead canopy frame
        const canopyBeam = new THREE.Mesh(
            new THREE.BoxGeometry(14, 0.18, 3.5),
            new THREE.MeshStandardMaterial({ color: 0x6B1A08, roughness: 0.8 })
        )
        canopyBeam.position.set(0, 4.78, FACADE_Z + 1.4)
        this.scene.add(canopyBeam)

        // Canopy cloth — 3 angled panels
        ;[[-4.0, -0.12], [0, 0], [4.0, -0.12]].forEach(([xoff, yoff]) => {
            const panel = new THREE.Mesh(
                new THREE.BoxGeometry(4.4, 0.06, 3.2),
                new THREE.MeshStandardMaterial({
                    color: 0xA0200A, roughness: 1.0, metalness: 0.0, side: THREE.DoubleSide
                })
            )
            panel.position.set(xoff, 4.5 + yoff, FACADE_Z + 1.4)
            panel.rotation.x = -0.12
            this.scene.add(panel)

            // Stripe on canopy
            const stripe = new THREE.Mesh(
                new THREE.BoxGeometry(4.4, 0.065, 0.25),
                new THREE.MeshStandardMaterial({ color: 0xFFF5E0, roughness: 1.0, side: THREE.DoubleSide })
            )
            stripe.position.set(xoff, 4.5 + yoff - 0.01, FACADE_Z + 0.85)
            stripe.rotation.x = -0.12
            this.scene.add(stripe)
        })

        // Entry columns (left and right of entrance)
        ;[-5.5, 5.5].forEach(x => {
            const col = new THREE.Mesh(new THREE.BoxGeometry(0.38, 5.6, 0.38), m.pillar)
            col.position.set(x, 1.98, FACADE_Z - 0.19)
            col.castShadow = true
            this.scene.add(col)
            // Column cap
            const cap = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.16, 0.58), m.darkWood)
            cap.position.set(x, 4.86, FACADE_Z - 0.19)
            this.scene.add(cap)
        })

        // Building sign board
        const signBacking = new THREE.Mesh(new THREE.BoxGeometry(10.0, 1.2, 0.14), m.darkWood)
        signBacking.position.set(0, 5.5, FACADE_Z - 0.22)
        this.scene.add(signBacking)

        const signTex = this.makeCanvasTexture(1600, 192, (ctx, w, h) => {
            const g = ctx.createLinearGradient(0, 0, w, 0)
            g.addColorStop(0,   '#1E0E02')
            g.addColorStop(0.5, '#3D2210')
            g.addColorStop(1,   '#1E0E02')
            ctx.fillStyle = g
            ctx.fillRect(0, 0, w, h)
            ctx.strokeStyle = '#E8A020'
            ctx.lineWidth = 6
            ctx.strokeRect(6, 6, w - 12, h - 12)
            ctx.lineWidth = 1.5
            ctx.strokeRect(18, 18, w - 36, h - 36)
            ctx.font = '700 72px Georgia, serif'
            ctx.fillStyle = '#FFF5E0'
            ctx.textAlign = 'center'
            ctx.shadowColor = 'rgba(232,160,32,0.8)'
            ctx.shadowBlur = 18
            ctx.fillText('☕  Vignesh\'s Tea Kadai  ☕', w / 2, 122)
            ctx.shadowBlur = 0
            ctx.font = 'italic 28px Georgia, serif'
            ctx.fillStyle = 'rgba(232,160,32,0.75)'
            ctx.fillText('Takshashila University · CS 2022–26 · Chennai', w / 2, 164)
        })
        const sign = new THREE.Mesh(
            new THREE.PlaneGeometry(9.7, 1.1),
            new THREE.MeshStandardMaterial({ map: signTex, emissive: 0x3D1A00, emissiveIntensity: 0.12, roughness: 0.6 })
        )
        sign.position.set(0, 5.5, FACADE_Z - 0.16)
        this.scene.add(sign)

        // Neon "OPEN" sign on right column
        const neonTex = this.makeCanvasTexture(200, 64, (ctx, w, h) => {
            ctx.fillStyle = '#080808'
            ctx.fillRect(0, 0, w, h)
            ctx.font = '700 40px monospace'
            ctx.textAlign = 'center'
            ctx.shadowColor = '#00FF88'
            ctx.shadowBlur = 16
            ctx.fillStyle = '#00FF88'
            ctx.fillText('OPEN', w / 2, 46)
        })
        const neon = new THREE.Mesh(
            new THREE.PlaneGeometry(0.9, 0.29),
            new THREE.MeshStandardMaterial({ map: neonTex, emissive: 0x004420, emissiveIntensity: 1.2, roughness: 0.05 })
        )
        neon.position.set(4.8, 2.8, FACADE_Z - 0.15)
        this.scene.add(neon)

        // (neon light removed for perf — emissive on mesh provides glow)

        // Front step
        const step = new THREE.Mesh(new THREE.BoxGeometry(12, 0.14, 0.6), m.marble)
        step.position.set(0, -0.82, FACADE_Z - 0.3)
        this.scene.add(step)
    }

    // ── Exterior ground — wet street ───────────────────
    buildExteriorGround() {
        // Main street surface (reflective)
        const streetTex = this.makeCanvasTexture(512, 512, (ctx, w, h) => {
            // Dark wet asphalt
            ctx.fillStyle = '#1A1814'
            ctx.fillRect(0, 0, w, h)
            // Grain
            for (let i = 0; i < 800; i++) {
                const x = Math.random() * w, y = Math.random() * h
                ctx.fillStyle = `rgba(${60 + Math.random() * 30},${55 + Math.random() * 25},${45 + Math.random() * 20},0.5)`
                ctx.fillRect(x, y, 2, 2)
            }
            // Lane markings
            ctx.strokeStyle = 'rgba(255,255,160,0.55)'
            ctx.lineWidth = 3
            ctx.setLineDash([28, 18])
            ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h); ctx.stroke()
            ctx.setLineDash([])
            // Puddle reflections
            for (let p = 0; p < 6; p++) {
                const px = Math.random() * w, py = Math.random() * h
                const pr = 20 + Math.random() * 40
                const rg = ctx.createRadialGradient(px, py, 0, px, py, pr)
                rg.addColorStop(0, 'rgba(100,140,200,0.18)')
                rg.addColorStop(1, 'rgba(100,140,200,0)')
                ctx.fillStyle = rg
                ctx.beginPath(); ctx.ellipse(px, py, pr, pr * 0.5, 0, 0, Math.PI * 2); ctx.fill()
            }
        })
        const streetMat = new THREE.MeshStandardMaterial({
            map: streetTex, roughness: 0.35, metalness: 0.1
        })
        const street = new THREE.Mesh(new THREE.PlaneGeometry(STREET_W * 2, STREET_Z - FACADE_Z + 6), streetMat)
        street.rotation.x = -Math.PI / 2
        street.position.set(0, -0.82, (FACADE_Z + STREET_Z) / 2)
        street.receiveShadow = true
        this.scene.add(street)

        // Sidewalks
        const sidewalkMat = new THREE.MeshStandardMaterial({ color: 0x888070, roughness: 0.88 })
        ;[-1, 1].forEach(side => {
            const sw = new THREE.Mesh(new THREE.PlaneGeometry(3.0, STREET_Z - FACADE_Z + 6), sidewalkMat)
            sw.rotation.x = -Math.PI / 2
            sw.position.set(side * (STREET_W - 1.5), -0.80, (FACADE_Z + STREET_Z) / 2)
            this.scene.add(sw)

            // Curb
            const curb = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.14, STREET_Z - FACADE_Z + 6), sidewalkMat)
            curb.position.set(side * (STREET_W - 3.1), -0.76, (FACADE_Z + STREET_Z) / 2)
            this.scene.add(curb)
        })
    }

    // ── Exterior walls of kadai building ──────────────
    buildExteriorWalls() {
        const m = this.materials
        const wallLength = FACADE_Z - (-3.0)  // front to back

        // Left exterior wall panel
        const extWallL = new THREE.Mesh(
            new THREE.BoxGeometry(0.22, 5.6, wallLength + 0.5),
            new THREE.MeshStandardMaterial({ color: 0xD4C4A8, roughness: 0.9 })
        )
        extWallL.position.set(-5.89, 1.98, (FACADE_Z - 3.0) / 2)
        this.scene.add(extWallL)

        // Right exterior wall panel
        const extWallR = extWallL.clone()
        extWallR.position.set(5.89, 1.98, (FACADE_Z - 3.0) / 2)
        this.scene.add(extWallR)

        // Roof parapet
        const parapet = new THREE.Mesh(new THREE.BoxGeometry(12.5, 0.45, 0.28), m.darkWood)
        parapet.position.set(0, 5.15, FACADE_Z - 0.14)
        this.scene.add(parapet)

        // Back wall exterior
        const backExt = new THREE.Mesh(
            new THREE.BoxGeometry(12.5, 5.6, 0.22),
            new THREE.MeshStandardMaterial({ color: 0xC8B898, roughness: 0.92 })
        )
        backExt.position.set(0, 1.98, -3.11)
        this.scene.add(backExt)

        // Ventilation pipe on right wall
        const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.0, 8), m.metal)
        pipe.rotation.z = Math.PI / 2
        pipe.position.set(4.2, 2.8, FACADE_Z - 0.3)
        this.scene.add(pipe)

        // AC unit on right wall exterior
        const ac = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.52, 0.88), m.metal)
        ac.position.set(5.9, 1.9, -0.5)
        this.scene.add(ac)
    }

    // ── Street lamps ───────────────────────────────────
    buildStreetLamps() {
        const lampPositions = [
            { x: -8, z: 8 }, { x:  8, z: 8 },
            { x: -8, z: 18 }, { x: 8, z: 18 },
        ]
        const poleMat  = new THREE.MeshStandardMaterial({ color: 0x303030, roughness: 0.5, metalness: 0.7 })
        const headMat  = new THREE.MeshStandardMaterial({ color: 0x1A1A1A, roughness: 0.4, metalness: 0.8 })
        const bulbMat  = new THREE.MeshStandardMaterial({ color: 0xFFFAE0, emissive: 0xFFEC80, emissiveIntensity: 2.0, roughness: 0.0 })

        lampPositions.forEach(({ x, z }) => {
            // Pole
            const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.075, 5.8, 10), poleMat)
            pole.position.set(x, 2.08, z)
            pole.castShadow = true
            this.scene.add(pole)

            // Arm
            const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.2, 8), poleMat)
            arm.rotation.z = Math.PI / 2
            arm.position.set(x + 0.6, 5.0, z)
            this.scene.add(arm)

            // Head
            const head = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.16, 0.35), headMat)
            head.position.set(x + 1.2, 4.98, z)
            this.scene.add(head)

            // Bulb (emissive only — no PointLight for perf)
            const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), bulbMat)
            bulb.position.set(x + 1.2, 4.87, z)
            this.scene.add(bulb)
        })
    }

    // ── Exterior facade panels (on building front wall) ─
    buildExteriorFacadePanels() {
        const backingMat = new THREE.MeshStandardMaterial({ color: 0x1A0A02, roughness: 0.7 })

        // Helper: draw the about panel canvas (called once with placeholder, again with real photo)
        const drawAbout = (ctx, w, h, photo) => {
            const bg = ctx.createLinearGradient(0, 0, 0, h)
            bg.addColorStop(0, '#1E0B00'); bg.addColorStop(1, '#0C0500')
            ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h)
            ctx.strokeStyle = '#E8A020'; ctx.lineWidth = 3
            ctx.strokeRect(4, 4, w - 8, h - 8)

            // Photo or fallback avatar
            ctx.save()
            ctx.beginPath(); ctx.arc(w / 2, 82, 66, 0, Math.PI * 2); ctx.clip()
            if (photo) {
                ctx.drawImage(photo, w / 2 - 66, 16, 132, 132)
            } else {
                const av = ctx.createRadialGradient(w / 2, 82, 8, w / 2, 82, 66)
                av.addColorStop(0, '#F5C040'); av.addColorStop(1, '#8B2500')
                ctx.fillStyle = av; ctx.fill()
                ctx.font = '700 56px Georgia'; ctx.fillStyle = '#FFFAF3'
                ctx.textAlign = 'center'; ctx.fillText('V', w / 2, 108)
            }
            ctx.restore()
            ctx.strokeStyle = '#E8A020'; ctx.lineWidth = 3
            ctx.beginPath(); ctx.arc(w / 2, 82, 66, 0, Math.PI * 2); ctx.stroke()

            ctx.textAlign = 'center'
            ctx.font = '700 34px Georgia'; ctx.fillStyle = '#FFF5E0'
            ctx.shadowColor = 'rgba(232,160,32,0.7)'; ctx.shadowBlur = 10
            ctx.fillText('Vigneshwar L', w / 2, 182); ctx.shadowBlur = 0
            ctx.font = '500 16px sans-serif'; ctx.fillStyle = '#E8A020'
            ctx.fillText('ML Researcher · Systems Builder · Cloud', w / 2, 208)

            this.roundRect(ctx, 50, 222, w - 100, 38, 19)
            ctx.fillStyle = 'rgba(232,160,32,0.12)'; ctx.fill()
            ctx.strokeStyle = 'rgba(232,160,32,0.4)'; ctx.lineWidth = 1; ctx.stroke()
            ctx.font = '600 14px sans-serif'; ctx.fillStyle = '#FFF5E0'
            ctx.fillText('🎓 Takshashila University · 2022–26 · Chennai', w / 2, 246)

            ctx.strokeStyle = 'rgba(232,160,32,0.3)'; ctx.lineWidth = 1
            ctx.beginPath(); ctx.moveTo(30, 270); ctx.lineTo(w - 30, 270); ctx.stroke()

            const bio = ['Building systems that matter —', 'RAG Pipelines · Rust Systems · Cloud (AWS/GCP)', '7 open-source projects shipped']
            ctx.font = '400 14px sans-serif'; ctx.fillStyle = 'rgba(255,245,224,0.85)'
            bio.forEach((line, i) => ctx.fillText(line, w / 2, 292 + i * 26))

            // Skill rows
            const row1 = ['RAG / LLM', 'AWS / GCP', 'Rust', 'Python']
            const row2 = ['C++', 'Flutter', 'FastAPI', 'Three.js']
            ;[row1, row2].forEach((row, ri) => {
                const rw = (w - 40) / row.length
                row.forEach((t, ci) => {
                    const bx = 20 + ci * rw, by = 374 + ri * 42
                    this.roundRect(ctx, bx + 2, by, rw - 4, 34, 5)
                    ctx.fillStyle = ri === 0 ? 'rgba(0,255,136,0.08)' : 'rgba(232,160,32,0.08)'; ctx.fill()
                    ctx.strokeStyle = ri === 0 ? 'rgba(0,255,136,0.4)' : 'rgba(232,160,32,0.35)'; ctx.lineWidth = 1; ctx.stroke()
                    ctx.font = '600 12px monospace'
                    ctx.fillStyle = ri === 0 ? '#80FFB8' : '#FFF5E0'
                    ctx.fillText(t, bx + rw / 2, by + 22)
                })
            })

            ctx.font = '400 13px monospace'; ctx.fillStyle = 'rgba(232,160,32,0.75)'
            ctx.fillText('🐙 github.com/vignesh2027', w / 2, 480)
            ctx.fillText('🌐 vignesh2027.github.io/portfolio-vignesh', w / 2, 502)
            ctx.font = 'italic 12px sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.35)'
            ctx.fillText('click to open full profile', w / 2, h - 12)
        }

        // Build canvas & mesh
        const aboutCanvas = document.createElement('canvas')
        aboutCanvas.width = 512; aboutCanvas.height = 640
        const aboutCtx = aboutCanvas.getContext('2d')
        drawAbout(aboutCtx, 512, 640, null)   // draw with placeholder first

        const aboutTex = new THREE.CanvasTexture(aboutCanvas)
        aboutTex.colorSpace = THREE.SRGBColorSpace

        // Load real photo and redraw
        const img = new window.Image()
        img.onload = () => {
            drawAbout(aboutCtx, 512, 640, img)
            aboutTex.needsUpdate = true
        }
        img.src = './vignesh.jpg'

        const aboutBacking = new THREE.Mesh(new THREE.BoxGeometry(2.6, 3.4, 0.1), backingMat)
        aboutBacking.position.set(-3.9, 2.6, FACADE_Z + 0.05)
        this.scene.add(aboutBacking)

        const aboutPanel = new THREE.Mesh(
            new THREE.PlaneGeometry(2.5, 3.2),
            new THREE.MeshStandardMaterial({ map: aboutTex, emissive: 0x180800, emissiveIntensity: 0.15, roughness: 0.5 })
        )
        aboutPanel.position.set(-3.9, 2.6, FACADE_Z + 0.11)
        aboutPanel.userData = { action: 'about', label: 'Vigneshwar L' }
        this.scene.add(aboutPanel)
        this.clickTargets.push(aboutPanel)

        // ─ Right panel: GitHub Stats ─────────────────────
        const gitTex = this.makeCanvasTexture(512, 640, (ctx, w, h) => {
            ctx.fillStyle = '#050D08'; ctx.fillRect(0, 0, w, h)
            ctx.strokeStyle = '#00FF88'; ctx.lineWidth = 3
            ctx.strokeRect(4, 4, w - 8, h - 8)

            ctx.font = '700 36px Georgia'; ctx.fillStyle = '#00FF88'
            ctx.textAlign = 'center'
            ctx.shadowColor = 'rgba(0,255,136,0.5)'; ctx.shadowBlur = 10
            ctx.fillText('🐙 GitHub Stats', w / 2, 54); ctx.shadowBlur = 0
            ctx.font = '400 16px monospace'; ctx.fillStyle = 'rgba(255,255,255,0.45)'
            ctx.fillText('github.com/vignesh2027', w / 2, 80)

            ctx.strokeStyle = 'rgba(0,255,136,0.3)'; ctx.lineWidth = 1
            ctx.beginPath(); ctx.moveTo(24, 94); ctx.lineTo(w - 24, 94); ctx.stroke()

            ;[
                { icon: '📦', val: '12+', label: 'Repos',  color: '#FFD080' },
                { icon: '⭐', val: '45+', label: 'Stars',   color: '#FFD080' },
                { icon: '🟢', val: '200+', label: 'Commits', color: '#00FF88' },
                { icon: '⌨',  val: '7',  label: 'Langs',   color: '#80C0FF' },
            ].forEach(({ icon, val, label, color }, i) => {
                const col = i % 2, row = Math.floor(i / 2)
                const cx = 20 + col * 238, cy = 108 + row * 110
                this.roundRect(ctx, cx, cy, 218, 94, 10)
                ctx.fillStyle = 'rgba(0,255,136,0.05)'; ctx.fill()
                ctx.strokeStyle = 'rgba(0,255,136,0.2)'; ctx.lineWidth = 1; ctx.stroke()
                ctx.font = '26px sans-serif'; ctx.fillText(icon, cx + 44, cy + 44)
                ctx.font = '700 28px Georgia'; ctx.fillStyle = color
                ctx.fillText(val, cx + 140, cy + 44)
                ctx.font = '400 12px sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.5)'
                ctx.fillText(label, cx + 130, cy + 66)
            })

            ctx.font = '600 15px monospace'; ctx.fillStyle = 'rgba(255,255,255,0.7)'
            ctx.textAlign = 'left'; ctx.fillText('Language Breakdown', 24, 342)

            const langs = [
                { name: 'Rust', pct: 35, color: '#FF6B35' },
                { name: 'Python', pct: 28, color: '#3776AB' },
                { name: 'Dart', pct: 18, color: '#00B4D8' },
                { name: 'C++', pct: 12, color: '#00599C' },
                { name: 'JavaScript', pct: 7, color: '#F7DF1E' },
            ]
            langs.forEach(({ name, pct, color }, i) => {
                const y = 360 + i * 42
                ctx.fillStyle = 'rgba(255,255,255,0.65)'; ctx.font = '400 13px monospace'
                ctx.textAlign = 'left'; ctx.fillText(name, 24, y + 12)
                ctx.fillStyle = 'rgba(255,255,255,0.1)'
                this.roundRect(ctx, 140, y, 320, 18, 3); ctx.fill()
                ctx.fillStyle = color
                this.roundRect(ctx, 140, y, 320 * pct / 100, 18, 3); ctx.fill()
                ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.font = '400 11px monospace'
                ctx.textAlign = 'right'; ctx.fillText(pct + '%', w - 20, y + 12)
            })

            ctx.font = '600 14px monospace'; ctx.fillStyle = 'rgba(255,255,255,0.6)'
            ctx.textAlign = 'left'; ctx.fillText('Activity Heatmap', 24, 582)
            for (let c = 0; c < 46; c++) {
                for (let r = 0; r < 7; r++) {
                    const v = Math.random()
                    const g = 30 + Math.floor(v * 180)
                    ctx.fillStyle = `rgba(0,${g},${Math.floor(g * 0.4)},${0.2 + v * 0.8})`
                    this.roundRect(ctx, 24 + c * 10, 594 + r * 10, 8, 8, 2)
                    ctx.fill()
                }
            }

            ctx.font = 'italic 13px sans-serif'; ctx.fillStyle = 'rgba(0,255,136,0.4)'
            ctx.textAlign = 'center'; ctx.fillText('click to explore GitHub', w / 2, h - 14)
        })

        const gitBacking = new THREE.Mesh(new THREE.BoxGeometry(2.6, 3.4, 0.1), backingMat)
        gitBacking.position.set(3.9, 2.6, FACADE_Z + 0.05)
        this.scene.add(gitBacking)

        const gitPanel = new THREE.Mesh(
            new THREE.PlaneGeometry(2.5, 3.2),
            new THREE.MeshStandardMaterial({ map: gitTex, emissive: 0x001008, emissiveIntensity: 0.15, roughness: 0.5 })
        )
        gitPanel.position.set(3.9, 2.6, FACADE_Z + 0.11)
        gitPanel.userData = { action: 'gitStats', label: 'GitHub Stats' }
        this.scene.add(gitPanel)
        this.clickTargets.push(gitPanel)
    }



    // ── Opposite shop / mall ───────────────────────────
    buildOppositeShop() {
        const BW = 26
        const BH = OPP_H
        const BD = OPP_BACK - OPP_Z

        // Main box
        const building = new THREE.Mesh(
            new THREE.BoxGeometry(BW * 2, BH, BD),
            new THREE.MeshStandardMaterial({ color: 0x1A1A2E, roughness: 0.7, metalness: 0.1 })
        )
        building.position.set(0, BH / 2 - 0.82, OPP_Z + BD / 2)
        this.scene.add(building)

        // Full facade — one canvas covers ground glass + upper windows + sign
        const facadeTex = this.makeCanvasTexture(1024, 768, (ctx, w, h) => {
            // Background
            ctx.fillStyle = '#0E0E20'; ctx.fillRect(0, 0, w, h)

            // Ground floor glass panels
            const glassH = Math.round(h * 0.46)
            const items = [
                { title: 'NEW ARRIVAL', text: 'M4 MacBook Pro', price: '₹2,49,900', color: '#A0C0FF' },
                { title: 'BEST SELLER', text: 'RTX 5090 GPU',   price: '₹1,80,000', color: '#FFD080' },
                { title: 'TRENDING',    text: 'LLM Dev Kit',     price: '₹49,999',   color: '#80FF88' },
                { title: 'COMING SOON', text: 'Quantum Kit',     price: 'Pre-order',  color: '#FF8080' },
            ]
            const pw = w / items.length
            items.forEach(({ title, text, price, color }, i) => {
                const x = i * pw
                const grd = ctx.createLinearGradient(x, 0, x + pw, glassH)
                grd.addColorStop(0, 'rgba(26,58,92,0.9)')
                grd.addColorStop(1, 'rgba(10,24,48,0.85)')
                ctx.fillStyle = grd; ctx.fillRect(x, 0, pw, glassH)
                ctx.strokeStyle = 'rgba(100,140,200,0.4)'; ctx.lineWidth = 1
                ctx.strokeRect(x + 2, 2, pw - 4, glassH - 4)
                ctx.font = '700 18px monospace'; ctx.textAlign = 'center'; ctx.fillStyle = color
                ctx.fillText(title, x + pw / 2, 36)
                ctx.font = '400 22px sans-serif'; ctx.fillStyle = '#FFF'
                ctx.fillText(text, x + pw / 2, 80)
                ctx.font = '700 20px monospace'; ctx.fillStyle = color
                ctx.fillText(price, x + pw / 2, 116)
            })
            // Horizontal divider
            ctx.fillStyle = 'rgba(60,60,80,0.8)'; ctx.fillRect(0, glassH, w, 8)

            // Upper floors — window grid
            const winRows = 2, winCols = 8
            const upperH = h - glassH - 8 - 60
            const upperY = glassH + 8
            const ww = w / winCols, wh = upperH / winRows
            for (let r = 0; r < winRows; r++) {
                for (let c = 0; c < winCols; c++) {
                    const wx = c * ww, wy = upperY + r * wh
                    const lit = Math.random() > 0.3
                    const g = ctx.createLinearGradient(wx, wy, wx + ww, wy + wh)
                    if (lit) {
                        g.addColorStop(0, 'rgba(40,70,180,0.85)')
                        g.addColorStop(1, 'rgba(20,40,130,0.9)')
                    } else {
                        g.addColorStop(0, 'rgba(8,12,28,0.95)')
                        g.addColorStop(1, 'rgba(5,8,20,0.98)')
                    }
                    ctx.fillStyle = g
                    ctx.fillRect(wx + 6, wy + 6, ww - 12, wh - 12)
                    ctx.strokeStyle = 'rgba(60,60,80,0.6)'; ctx.lineWidth = 1
                    ctx.strokeRect(wx, wy, ww, wh)
                }
            }

            // Sign band at top
            ctx.fillStyle = '#05050E'; ctx.fillRect(0, h - 60, w, 60)
            ctx.font = '700 36px Georgia'; ctx.textAlign = 'center'
            ctx.shadowColor = '#6060FF'; ctx.shadowBlur = 14
            ctx.fillStyle = '#A0A0FF'; ctx.fillText('⚡  CYBER MART  ⚡', w / 2, h - 26)
            ctx.shadowBlur = 0
            ctx.font = '400 14px monospace'; ctx.fillStyle = 'rgba(100,100,255,0.55)'
            ctx.fillText('Tech · Electronics · Innovation · Open 24/7', w / 2, h - 8)
        })

        const facade = new THREE.Mesh(
            new THREE.PlaneGeometry(BW * 2, BH),
            new THREE.MeshStandardMaterial({ map: facadeTex, emissive: 0x050518, emissiveIntensity: 0.15, roughness: 0.3 })
        )
        facade.position.set(0, BH / 2 - 0.82, OPP_Z + 0.06)
        this.scene.add(facade)

        // Entry arch (3 meshes — kept minimal)
        const archMat = new THREE.MeshStandardMaterial({ color: 0x2A2A3A, roughness: 0.5, metalness: 0.5 })
        ;[-1, 1].forEach(side => {
            const col = new THREE.Mesh(new THREE.BoxGeometry(0.5, 4.4, 0.5), archMat)
            col.position.set(side * 2.5, 1.38, OPP_Z + 0.28)
            this.scene.add(col)
        })
        const archTop = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.4, 0.5), archMat)
        archTop.position.set(0, 3.78, OPP_Z + 0.28)
        this.scene.add(archTop)

        // Side buildings (simple boxes only — no individual windows)
        ;[-1, 1].forEach(side => {
            const sideB = new THREE.Mesh(
                new THREE.BoxGeometry(8, 7, 12),
                new THREE.MeshStandardMaterial({ color: 0x141420, roughness: 0.8 })
            )
            sideB.position.set(side * (BW + 8), 2.68, OPP_Z + 6)
            this.scene.add(sideB)
        })
    }

    // ── Rain particle system ───────────────────────────
    buildRain() {
        const COUNT   = 500
        const positions  = new Float32Array(COUNT * 3)
        const velocities = new Float32Array(COUNT)

        for (let i = 0; i < COUNT; i++) {
            positions[i * 3]     = (Math.random() - 0.5) * 44
            positions[i * 3 + 1] = Math.random() * 20 + 3
            positions[i * 3 + 2] = Math.random() * (STREET_Z + 10) - 5
            velocities[i]        = 0.12 + Math.random() * 0.1
        }

        const geo = new THREE.BufferGeometry()
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

        // Elongated raindrop texture
        const dropTex = this.makeCanvasTexture(8, 24, (ctx, w, h) => {
            const g = ctx.createLinearGradient(0, 0, 0, h)
            g.addColorStop(0,   'rgba(160,200,255,0)')
            g.addColorStop(0.2, 'rgba(180,215,255,0.85)')
            g.addColorStop(1,   'rgba(140,185,255,0.05)')
            ctx.fillStyle = g
            ctx.fillRect(0, 0, w, h)
        })

        this.rain = new THREE.Points(geo, new THREE.PointsMaterial({
            map: dropTex,
            color: 0xBBD8FF,
            size: 0.16,
            transparent: true,
            opacity: 0.55,
            sizeAttenuation: true,
            alphaTest: 0.01
        }))
        this.rainVelocities = velocities
        this.rain.position.x = 0
        this.scene.add(this.rain)
    }

    // ── Rain sound (Web Audio API, no external files) ──
    buildRainSound() {
        const start = () => {
            try {
                const AC = window.AudioContext || window.webkitAudioContext
                if (!AC) return
                const actx = new AC()
                // White noise buffer
                const len = actx.sampleRate * 3
                const buf = actx.createBuffer(2, len, actx.sampleRate)
                for (let ch = 0; ch < 2; ch++) {
                    const d = buf.getChannelData(ch)
                    for (let i = 0; i < len; i++) {
                        d[i] = Math.random() * 2 - 1
                    }
                }
                const src = actx.createBufferSource()
                src.buffer = buf; src.loop = true

                // Bandpass to make it sound rain-like
                const bp = actx.createBiquadFilter()
                bp.type = 'bandpass'; bp.frequency.value = 600; bp.Q.value = 0.4

                const hp = actx.createBiquadFilter()
                hp.type = 'highpass'; hp.frequency.value = 200

                const gain = actx.createGain()
                gain.gain.value = 0.12

                src.connect(hp); hp.connect(bp); bp.connect(gain); gain.connect(actx.destination)
                src.start()
                this.rainGain = gain
            } catch (e) { /* audio not available */ }
        }
        document.addEventListener('click', start, { once: true })
    }

    // ── Update ─────────────────────────────────────────
    update(elapsedTime) {
        // Lantern gentle sway
        this.lanterns.forEach((l, i) => {
            l.rotation.z = Math.sin(elapsedTime * 0.45 + i * 1.9) * 0.016
        })

        // Rain animation — skip every other frame to halve GPU upload cost
        if (this.rain && this.rainVelocities) {
            this._rainFrame = (this._rainFrame || 0) + 1
            if (this._rainFrame % 2 === 0) {
                const pos = this.rain.geometry.attributes.position
                const arr = pos.array
                for (let i = 0; i < this.rainVelocities.length; i++) {
                    arr[i * 3 + 1] -= this.rainVelocities[i] * 2  // 2× step compensates skip
                    arr[i * 3]     += 0.01
                    if (arr[i * 3 + 1] < -0.82) {
                        arr[i * 3 + 1] = 18 + Math.random() * 6
                        arr[i * 3]     = (Math.random() - 0.5) * 44
                    }
                }
                pos.needsUpdate = true
            }
        }

        // TV screen — update every 8s (small texture, occasional update is fine)
        const tvTick = Math.floor(elapsedTime * 0.125)
        if (tvTick !== this.lastTVUpdate) {
            this.lastTVUpdate = tvTick
            this.drawTVFrame(elapsedTime)
        }
    }
}

import * as THREE from 'three'
import Experience from '../Experience.js'

export default class TeaKadai {
    constructor(materials) {
        this.experience = new Experience()
        this.scene      = this.experience.scene
        this.materials  = materials

        this.clickTargets = []
        this.lanterns     = []
        this.teaCups      = []
        this.fanBlades    = null

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
        this.buildLanterns()
        this.buildStringLights()
        this.buildWindow()
        this.buildPlants()
        this.buildDecorations()
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
            for (let i = 0; i < 3000; i++) {
                const x = Math.random() * w, y = Math.random() * h
                ctx.fillStyle = `rgba(180,140,80,${Math.random() * 0.04})`
                ctx.fillRect(x, y, 2, 2)
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
            { name: 'Game of DSA',       short: 'DSA',       color: 0xD4A017, action: 'project-dsa'     },
            { name: 'NEXUS Intelligence',short: 'NEXUS',     color: 0x2E6B9A, action: 'project-nexus'   },
            { name: 'SparshCare',        short: 'SPARSH',    color: 0x8B2020, action: 'project-sparsh'  },
            { name: 'SYNTHRON',          short: 'SYNTH',     color: 0x2A6B30, action: 'project-synth'   },
            { name: 'VORTEXRAG',         short: 'VRTX',      color: 0x6B2A8B, action: 'project-vortex'  },
            { name: 'rustkvd',           short: 'RUST',      color: 0xB04010, action: 'project-rust'    },
            { name: 'FluxDB',            short: 'FLUX',      color: 0x2B608B, action: 'project-flux'    },
        ]

        const xs = [-3.2, -2.2, -1.2, -0.2, 0.8, 1.8, 2.8]

        projects.forEach((proj, i) => {
            const cup = this.buildLabeledCup(xs[i], 0.74, -0.3, proj.name, proj.color, proj.action)
            this.teaCups.push(cup)
        })
    }

    buildLabeledCup(x, y, z, name, color, action) {
        const group = new THREE.Group()

        // Cup body with project color
        const cupMat = new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.1 })
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.076, 0.185, 20), cupMat)
        body.position.y = 0.092
        body.castShadow = true
        group.add(body)

        // Tea liquid
        const liquid = new THREE.Mesh(
            new THREE.CylinderGeometry(0.092, 0.092, 0.02, 20),
            this.materials.teaLiquid
        )
        liquid.position.y = 0.174
        group.add(liquid)

        // Saucer
        const saucer = new THREE.Mesh(
            new THREE.CylinderGeometry(0.142, 0.138, 0.024, 20),
            this.materials.teaCup
        )
        saucer.position.y = 0.012
        group.add(saucer)

        // Handle
        const handle = new THREE.Mesh(
            new THREE.TorusGeometry(0.065, 0.015, 8, 14, Math.PI),
            cupMat
        )
        handle.rotation.y = Math.PI / 2
        handle.position.set(0.112, 0.11, 0)
        group.add(handle)

        // Label plate in front of cup (small nameplate)
        const labelTex = this.makeCanvasTexture(240, 72, (ctx, w, h) => {
            ctx.fillStyle = '#1A0A00'
            ctx.fillRect(0, 0, w, h)
            ctx.strokeStyle = '#E8A020'
            ctx.lineWidth = 2.5
            ctx.strokeRect(3, 3, w - 6, h - 6)

            const shortName = name.length > 11 ? name.substring(0, 10) + '…' : name
            ctx.font = '700 22px Georgia, serif'
            ctx.fillStyle = '#FFF5E0'
            ctx.textAlign = 'center'
            ctx.fillText(shortName, w / 2, 30)

            ctx.font = '400 13px monospace'
            ctx.fillStyle = 'rgba(232,160,32,0.65)'
            ctx.fillText('[ click to view ]', w / 2, 56)
        })
        const label = new THREE.Mesh(
            new THREE.PlaneGeometry(0.52, 0.16),
            new THREE.MeshStandardMaterial({ map: labelTex, roughness: 0.8 })
        )
        label.position.set(0, 0.1, 0.22)
        group.add(label)

        group.position.set(x, y, z)
        group.userData.action = action
        group.userData.label  = name
        this.scene.add(group)

        // Make the cup body the click target (raycaster needs Mesh, not Group)
        const hitMesh = new THREE.Mesh(
            new THREE.CylinderGeometry(0.16, 0.16, 0.38, 16),
            new THREE.MeshStandardMaterial({ transparent: true, opacity: 0, depthWrite: false })
        )
        hitMesh.position.set(x, y + 0.1, z)
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
            for (let i = 0; i < 6000; i++) {
                ctx.beginPath()
                ctx.arc(Math.random() * w, Math.random() * h, 0.6, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(160,190,140,${Math.random() * 0.03})`
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
            ctx.fillText('Vignesh S', w / 2, 200)

            ctx.font = 'italic 15px Georgia, serif'
            ctx.fillStyle = '#C47D0A'
            ctx.fillText('CS Student · Chennai', w / 2, 228)

            ctx.strokeStyle = 'rgba(196,125,10,0.3)'
            ctx.lineWidth = 1
            ctx.beginPath(); ctx.moveTo(40, 246); ctx.lineTo(w - 40, 246); ctx.stroke()

            // Bio text
            const bioLines = [
                'Building systems that matter —',
                'from Rust KV stores to Flutter apps,',
                'ML pipelines to 3D immersive worlds.',
                '',
                '3rd year B.Tech · CS · Chennai',
                'Passionate about low-level systems,',
                'AI/ML, and creative technology.',
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
            const icons = [['🎓', 'VIT Chennai'], ['🐙', 'vignesh2027'], ['📧', 'gmail.com']]
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
            for (let i = 0; i < 2000; i++) {
                ctx.fillStyle = `rgba(255,245,224,${Math.random() * 0.025})`
                ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2)
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

    // ── Update ─────────────────────────────────────────
    update(elapsedTime) {
        // Lantern gentle sway
        this.lanterns.forEach((l, i) => {
            l.rotation.z = Math.sin(elapsedTime * 0.45 + i * 1.9) * 0.016
        })
        // Fan rotation
        if (this.fanBlades) {
            this.fanBlades.rotation.y += 0.008
        }
        // Star twinkle
        if (this.stars) {
            this.stars.material.opacity = 0.7 + Math.sin(elapsedTime * 0.35) * 0.1
        }
    }
}

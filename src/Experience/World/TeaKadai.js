import * as THREE from 'three'
import Experience from '../Experience.js'

export default class TeaKadai {
    constructor(materials) {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.materials = materials  // passed from World to avoid circular reference

        this.clickTargets = []
        this.lanterns = []
        this.teaCups = []

        this.buildScene()
        this.buildSignBoard()
        this.buildMenuBoard()
        this.buildAboutFrame()
        this.buildContactSign()
        this.buildStarField()
    }

    // ── Canvas texture helper ──────────────────────────
    makeCanvasTexture(w, h, drawFn) {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        drawFn(ctx, w, h)
        const tex = new THREE.CanvasTexture(canvas)
        tex.colorSpace = THREE.SRGBColorSpace
        return tex
    }

    // ── Rounded rect helper for canvas ────────────────
    roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath()
        ctx.moveTo(x + r, y)
        ctx.lineTo(x + w - r, y)
        ctx.arcTo(x + w, y, x + w, y + r, r)
        ctx.lineTo(x + w, y + h - r)
        ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
        ctx.lineTo(x + r, y + h)
        ctx.arcTo(x, y + h, x, y + h - r, r)
        ctx.lineTo(x, y + r)
        ctx.arcTo(x, y, x + r, y, r)
        ctx.closePath()
    }

    // ── Main scene geometry ────────────────────────────
    buildScene() {
        const m = this.materials

        // Floor — warm stone tiles
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(22, 22), m.floor)
        floor.rotation.x = -Math.PI / 2
        floor.position.y = -0.82
        floor.receiveShadow = true
        this.scene.add(floor)

        // Back wall
        const wall = new THREE.Mesh(new THREE.PlaneGeometry(18, 9), m.plaster)
        wall.position.set(0, 1.5, -3.0)
        wall.receiveShadow = true
        this.scene.add(wall)

        // Side walls
        const wallL = new THREE.Mesh(new THREE.PlaneGeometry(7, 9), m.plaster)
        wallL.rotation.y = Math.PI / 2
        wallL.position.set(-5.8, 1.5, -0.5)
        wallL.receiveShadow = true
        this.scene.add(wallL)
        const wallR = wallL.clone()
        wallR.rotation.y = -Math.PI / 2
        wallR.position.set(5.8, 1.5, -0.5)
        this.scene.add(wallR)

        // Ceiling
        const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(18, 9), m.ceiling)
        ceiling.rotation.x = Math.PI / 2
        ceiling.position.set(0, 4.3, -0.5)
        this.scene.add(ceiling)

        // Wall tile border strip at bottom
        const tileStrip = new THREE.Mesh(
            new THREE.PlaneGeometry(18, 0.6),
            new THREE.MeshStandardMaterial({
                map: this.makeCanvasTexture(900, 30, (ctx, w, h) => {
                    const grad = ctx.createLinearGradient(0, 0, w, 0)
                    grad.addColorStop(0, '#C47D0A')
                    grad.addColorStop(0.5, '#E8A020')
                    grad.addColorStop(1, '#C47D0A')
                    ctx.fillStyle = grad
                    ctx.fillRect(0, 0, w, h)
                    for (let i = 0; i <= 30; i++) {
                        ctx.strokeStyle = 'rgba(255,248,240,0.3)'
                        ctx.lineWidth = 1
                        ctx.beginPath()
                        ctx.moveTo(i * 30, 0)
                        ctx.lineTo(i * 30, h)
                        ctx.stroke()
                    }
                }),
                roughness: 0.6
            })
        )
        tileStrip.position.set(0, -0.52, -2.98)
        this.scene.add(tileStrip)

        // Counter base
        const counterBase = new THREE.Mesh(new THREE.BoxGeometry(9.2, 1.5, 1.5), m.wood)
        counterBase.position.set(0, -0.07, 0)
        counterBase.castShadow = true
        counterBase.receiveShadow = true
        this.scene.add(counterBase)

        // Counter top slab
        const counterTop = new THREE.Mesh(new THREE.BoxGeometry(9.4, 0.09, 1.7), m.marble)
        counterTop.position.set(0, 0.695, 0)
        counterTop.castShadow = true
        counterTop.receiveShadow = true
        this.scene.add(counterTop)

        // Counter front carved panel
        const panelMat = new THREE.MeshStandardMaterial({
            color: 0x8B5E2E,
            roughness: 0.7,
            metalness: 0.05
        })
        const panelGeo = new THREE.BoxGeometry(0.9, 0.7, 0.04)
        for (let i = -4; i <= 4; i++) {
            if (i === 0) continue
            const panel = new THREE.Mesh(panelGeo, panelMat)
            panel.position.set(i * 1.0, 0.12, 0.77)
            this.scene.add(panel)
        }

        // Arched top on counter panels
        const archMat = new THREE.MeshStandardMaterial({ color: 0xC47D0A, roughness: 0.5, metalness: 0.2 })
        for (let i = -4; i <= 4; i++) {
            if (i === 0) continue
            const arch = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.04, 16, 1, false, 0, Math.PI), archMat)
            arch.rotation.z = Math.PI / 2
            arch.rotation.x = Math.PI / 2
            arch.position.set(i * 1.0, 0.48, 0.77)
            this.scene.add(arch)
        }

        // Roof / canopy
        const canopy = new THREE.Mesh(new THREE.PlaneGeometry(11, 3), m.canopy)
        canopy.rotation.x = -0.22
        canopy.position.set(0, 3.5, 1.4)
        canopy.receiveShadow = true
        this.scene.add(canopy)

        // Canopy gold stripe trim
        const trimMat = new THREE.MeshStandardMaterial({
            color: 0xE8A020, emissive: 0xC47D0A, emissiveIntensity: 0.15,
            roughness: 0.5, metalness: 0.3, side: THREE.DoubleSide
        })
        for (let i = -5.2; i <= 5.2; i += 0.55) {
            const stripe = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 3), trimMat)
            stripe.rotation.x = -0.22
            stripe.position.set(i, 3.51, 1.4)
            this.scene.add(stripe)
        }

        // Canopy fringe
        const fringeMat = new THREE.MeshStandardMaterial({ color: 0xF5DEB3, roughness: 0.9, side: THREE.DoubleSide })
        for (let i = -5.1; i <= 5.1; i += 0.28) {
            const fringe = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.2, 0.01), fringeMat)
            fringe.rotation.x = -0.22
            fringe.position.set(i, 3.36, 2.6)
            this.scene.add(fringe)
        }

        // Left & right pillars
        const pillarGeo = new THREE.CylinderGeometry(0.13, 0.17, 4.3, 10)
        const pillarL = new THREE.Mesh(pillarGeo, m.pillar)
        pillarL.position.set(-4.6, 1.3, 0.85)
        pillarL.castShadow = true
        this.scene.add(pillarL)
        const pillarR = pillarL.clone()
        pillarR.position.set(4.6, 1.3, 0.85)
        this.scene.add(pillarR)

        // Pillar caps
        const capGeo = new THREE.BoxGeometry(0.38, 0.18, 0.38)
        ;[-4.6, 4.6].forEach(x => {
            const cap = new THREE.Mesh(capGeo, archMat)
            cap.position.set(x, 3.47, 0.85)
            this.scene.add(cap)
            const capBot = new THREE.Mesh(capGeo, archMat)
            capBot.position.set(x, -0.78, 0.85)
            this.scene.add(capBot)
        })

        // Wooden beams
        const beamMat = m.darkWood
        const beam1 = new THREE.Mesh(new THREE.BoxGeometry(10.2, 0.18, 0.22), beamMat)
        beam1.position.set(0, 3.35, -0.55)
        beam1.castShadow = true
        this.scene.add(beam1)
        const beam2 = beam1.clone()
        beam2.position.set(0, 3.35, 0.8)
        this.scene.add(beam2)

        // Stove area
        const stoveBase = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.07, 1.0), m.metal)
        stoveBase.position.set(0, 0.735, 0.2)
        this.scene.add(stoveBase)
        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(0.32, 0.035, 8, 24), m.metal
        )
        ring.rotation.x = Math.PI / 2
        ring.position.set(0, 0.775, 0.2)
        this.scene.add(ring)

        // Kettle
        const kettleBody = new THREE.Mesh(new THREE.SphereGeometry(0.23, 18, 14), m.metal)
        kettleBody.position.set(0, 1.02, 0.2)
        kettleBody.castShadow = true
        this.scene.add(kettleBody)
        const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.045, 0.32, 8), m.metal)
        spout.rotation.z = -Math.PI / 4.5
        spout.position.set(0.3, 1.02, 0.2)
        this.scene.add(spout)
        const lid = new THREE.Mesh(new THREE.SphereGeometry(0.085, 12, 8), m.metal)
        lid.position.set(0, 1.28, 0.2)
        this.scene.add(lid)
        const handle = new THREE.Mesh(
            new THREE.TorusGeometry(0.13, 0.024, 8, 16, Math.PI), m.darkWood
        )
        handle.rotation.y = Math.PI / 2
        handle.position.set(-0.24, 1.06, 0.2)
        this.scene.add(handle)

        // Tea cups on counter
        const cupXs = [-2.9, -1.9, 2.1, 3.1]
        cupXs.forEach(x => {
            this.teaCups.push(this.buildTeaCup(x, 0.74, -0.28))
        })

        // Jars left of stove
        this.buildJar(-3.7, 0.74, -0.22, 0.09, 0.26, 0x8B0000)
        this.buildJar(-3.3, 0.74, -0.22, 0.07, 0.21, 0x2E6B30)
        this.buildJar(-2.9, 0.74, -0.22, 0.08, 0.19, 0xD4A017)
        this.buildJar( 3.7, 0.74, -0.24, 0.07, 0.31, 0x5C2A00)
        this.buildJar( 4.1, 0.74, -0.24, 0.065, 0.22, 0x8B4513)

        // Shelf on right wall
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.07, 0.38), m.lightWood)
        shelf.position.set(2.6, 2.5, -2.75)
        shelf.castShadow = true
        this.scene.add(shelf)
        this.buildJar(1.8, 2.57, -2.6, 0.07, 0.22, 0x8B0000)
        this.buildJar(2.1, 2.57, -2.6, 0.09, 0.18, 0xD4A017)
        this.buildJar(2.4, 2.57, -2.6, 0.06, 0.26, 0x2E6B30)
        this.buildJar(2.7, 2.57, -2.6, 0.08, 0.21, 0x5C2A00)
        this.buildJar(3.0, 2.57, -2.6, 0.07, 0.18, 0x556B2F)
        this.buildJar(3.3, 2.57, -2.6, 0.09, 0.23, 0x8B4513)
        this.buildJar(3.6, 2.57, -2.6, 0.07, 0.2,  0xC47D0A)
        this.buildJar(4.1, 2.57, -2.6, 0.08, 0.17, 0x7B3F00)

        // Small calendar/clock on wall (decorative)
        const clockFace = new THREE.Mesh(
            new THREE.CircleGeometry(0.28, 32),
            new THREE.MeshStandardMaterial({
                map: this.makeCanvasTexture(128, 128, (ctx, w, h) => {
                    ctx.fillStyle = '#FFFAF5'
                    ctx.arc(w/2, h/2, w/2, 0, Math.PI*2)
                    ctx.fill()
                    ctx.strokeStyle = '#C47D0A'
                    ctx.lineWidth = 5
                    ctx.stroke()
                    // Hour markers
                    for (let i = 0; i < 12; i++) {
                        const a = (i / 12) * Math.PI * 2 - Math.PI / 2
                        const r = 52
                        ctx.beginPath()
                        ctx.arc(w/2 + r * Math.cos(a), h/2 + r * Math.sin(a), i % 3 === 0 ? 4 : 2, 0, Math.PI*2)
                        ctx.fillStyle = '#2A1A08'
                        ctx.fill()
                    }
                    // Hands
                    ctx.strokeStyle = '#2A1A08'
                    ctx.lineWidth = 3
                    ctx.beginPath()
                    ctx.moveTo(w/2, h/2)
                    ctx.lineTo(w/2, h/2 - 35)
                    ctx.stroke()
                    ctx.lineWidth = 2
                    ctx.beginPath()
                    ctx.moveTo(w/2, h/2)
                    ctx.lineTo(w/2 + 28, h/2)
                    ctx.stroke()
                }),
                roughness: 0.5
            })
        )
        clockFace.position.set(-2.0, 2.8, -2.97)
        this.scene.add(clockFace)

        // Hanging lanterns
        const lanternDefs = [
            { x: -2.3, y: 2.45, z: 0.25, size: 0.28 },
            { x: 0,    y: 2.7,  z: 0.25, size: 0.34 },
            { x: 2.3,  y: 2.45, z: 0.25, size: 0.28 }
        ]
        lanternDefs.forEach((def, i) => {
            this.lanterns.push(this.buildLantern(def.x, def.y, def.z, def.size))
        })

        // Hanging cords
        const cordMat = new THREE.MeshStandardMaterial({ color: 0x3D1E08, roughness: 0.9 })
        lanternDefs.forEach(def => {
            const cordH = 3.35 - def.y - def.size
            const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, cordH, 4), cordMat)
            cord.position.set(def.x, 3.35 - cordH / 2, def.z)
            this.scene.add(cord)
        })

        // Window on left wall — warm light glow rect
        const windowFrame = new THREE.Mesh(
            new THREE.PlaneGeometry(1.6, 2.0),
            new THREE.MeshStandardMaterial({
                color: 0xFFF8E0,
                emissive: 0xFFE090,
                emissiveIntensity: 0.6,
                transparent: true,
                opacity: 0.85,
                roughness: 0.1
            })
        )
        windowFrame.rotation.y = Math.PI / 2
        windowFrame.position.set(-5.78, 1.6, -1.0)
        this.scene.add(windowFrame)

        const windowBorder = new THREE.Mesh(
            new THREE.BoxGeometry(0.05, 2.1, 1.7), m.darkWood
        )
        windowBorder.rotation.y = Math.PI / 2
        windowBorder.position.set(-5.76, 1.6, -1.0)
        this.scene.add(windowBorder)

        // Cross bars on window
        const hBar = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, 1.6), m.darkWood)
        hBar.rotation.y = Math.PI / 2
        hBar.position.set(-5.75, 1.6, -1.0)
        this.scene.add(hBar)
        const vBar = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.0, 0.05), m.darkWood)
        vBar.rotation.y = Math.PI / 2
        vBar.position.set(-5.75, 1.6, -1.0)
        this.scene.add(vBar)
    }

    buildTeaCup(x, y, z) {
        const group = new THREE.Group()

        const body = new THREE.Mesh(
            new THREE.CylinderGeometry(0.105, 0.08, 0.19, 22),
            this.materials.teaCup
        )
        body.position.y = 0.095
        body.castShadow = true
        group.add(body)

        const liquid = new THREE.Mesh(
            new THREE.CylinderGeometry(0.097, 0.097, 0.022, 22),
            this.materials.teaLiquid
        )
        liquid.position.y = 0.178
        group.add(liquid)

        const saucer = new THREE.Mesh(
            new THREE.CylinderGeometry(0.15, 0.145, 0.026, 22),
            this.materials.teaCup
        )
        saucer.position.y = 0.013
        saucer.castShadow = true
        group.add(saucer)

        const handle = new THREE.Mesh(
            new THREE.TorusGeometry(0.068, 0.016, 8, 14, Math.PI),
            this.materials.teaCup
        )
        handle.rotation.y = Math.PI / 2
        handle.position.set(0.118, 0.115, 0)
        group.add(handle)

        group.position.set(x, y, z)
        this.scene.add(group)
        return group
    }

    buildJar(x, y, z, r, h, color) {
        const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.06 })
        const body = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 0.88, h, 18), mat)
        body.position.set(x, y + h / 2, z)
        body.castShadow = true
        this.scene.add(body)
        const lid = new THREE.Mesh(
            new THREE.CylinderGeometry(r * 1.08, r * 1.08, 0.025, 18),
            new THREE.MeshStandardMaterial({ color: 0x2A1A08, roughness: 0.6, metalness: 0.4 })
        )
        lid.position.set(x, y + h + 0.012, z)
        this.scene.add(lid)
    }

    buildLantern(x, y, z, size) {
        const group = new THREE.Group()
        const body = new THREE.Mesh(
            new THREE.SphereGeometry(size, 14, 10),
            this.materials.lanternGlass
        )
        group.add(body)
        const capMat = this.materials.lanternFrame
        const capT = new THREE.Mesh(new THREE.CylinderGeometry(size * 0.28, size * 0.28, size * 0.22, 8), capMat)
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

    // ── Sign board ─────────────────────────────────────
    buildSignBoard() {
        // Wood backing panel
        const backing = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.82, 0.09), this.materials.darkWood)
        backing.position.set(0, 3.72, -0.55)
        this.scene.add(backing)

        const tex = this.makeCanvasTexture(1200, 164, (ctx, w, h) => {
            // Rich wood gradient background
            const grad = ctx.createLinearGradient(0, 0, w, 0)
            grad.addColorStop(0,   '#2A1A08')
            grad.addColorStop(0.3, '#3D2210')
            grad.addColorStop(0.7, '#3D2210')
            grad.addColorStop(1,   '#2A1A08')
            ctx.fillStyle = grad
            ctx.fillRect(0, 0, w, h)

            // Gold border outer
            ctx.strokeStyle = '#E8A020'
            ctx.lineWidth = 5
            ctx.strokeRect(6, 6, w - 12, h - 12)
            // Gold border inner
            ctx.strokeStyle = 'rgba(232,160,32,0.4)'
            ctx.lineWidth = 1.5
            ctx.strokeRect(14, 14, w - 28, h - 28)

            // Corner ornaments
            const corners = [[22, 22], [w-22, 22], [22, h-22], [w-22, h-22]]
            corners.forEach(([cx, cy]) => {
                ctx.beginPath()
                ctx.arc(cx, cy, 6, 0, Math.PI * 2)
                ctx.fillStyle = '#E8A020'
                ctx.fill()
            })

            // Tamil subtitle
            ctx.font = '700 24px serif'
            ctx.fillStyle = '#C47D0A'
            ctx.textAlign = 'center'
            ctx.fillText('★  வி க்னேஷ்  ★', w / 2, 46)

            // English title
            ctx.font = '700 68px "Georgia", serif'
            ctx.fillStyle = '#FFF5E0'
            ctx.shadowColor = 'rgba(232,160,32,0.5)'
            ctx.shadowBlur = 14
            ctx.fillText("Vignesh's  Tea  Kadai", w / 2, 122)
            ctx.shadowBlur = 0
        })

        const sign = new THREE.Mesh(
            new THREE.PlaneGeometry(5.8, 0.76),
            new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7, metalness: 0.05 })
        )
        sign.position.set(0, 3.72, -0.51)
        this.scene.add(sign)

        // Wire hangers
        const wireMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7, roughness: 0.3 })
        ;[-2.6, 2.6].forEach(x => {
            const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.65, 4), wireMat)
            wire.position.set(x, 4.0, -0.55)
            this.scene.add(wire)
        })
    }

    // ── Menu / Chalkboard ──────────────────────────────
    buildMenuBoard() {
        // Ornate wooden frame
        const frame = new THREE.Mesh(new THREE.BoxGeometry(4.0, 3.1, 0.1), this.materials.darkWood)
        frame.position.set(0, 1.75, -2.91)
        this.scene.add(frame)

        // Inner bevel
        const bevel = new THREE.Mesh(
            new THREE.BoxGeometry(3.75, 2.85, 0.04),
            new THREE.MeshStandardMaterial({ color: 0xC47D0A, roughness: 0.5, metalness: 0.2 })
        )
        bevel.position.set(0, 1.75, -2.87)
        this.scene.add(bevel)

        const items = [
            ['Masala C++',      'Game of DSA'],
            ['Cosmos Chai',     'NEXUS Intelligence'],
            ['Care Tea',        'SparshCare'],
            ['AI Blend',        'SYNTHRON'],
            ['RAG Brew',        'VORTEXRAG'],
            ['Rust Kadha',      'rustkvd'],
            ['Flux Decoction',  'FluxDB'],
        ]

        const tex = this.makeCanvasTexture(750, 570, (ctx, w, h) => {
            // Deep teal-green chalkboard
            ctx.fillStyle = '#0D1F0A'
            ctx.fillRect(0, 0, w, h)

            // Chalk grain texture
            for (let i = 0; i < 4000; i++) {
                ctx.beginPath()
                ctx.arc(Math.random() * w, Math.random() * h, 0.5, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(180,200,160,${Math.random() * 0.035})`
                ctx.fill()
            }

            // Header — ornate
            ctx.font = '700 34px "Georgia", serif'
            ctx.fillStyle = '#FFF5E0'
            ctx.textAlign = 'center'
            ctx.fillText('✦  Today\'s Special  ✦', w / 2, 46)

            ctx.strokeStyle = 'rgba(232,160,32,0.55)'
            ctx.lineWidth = 1.5
            ctx.beginPath(); ctx.moveTo(30, 60); ctx.lineTo(w - 30, 60); ctx.stroke()
            ctx.lineWidth = 0.5
            ctx.beginPath(); ctx.moveTo(30, 64); ctx.lineTo(w - 30, 64); ctx.stroke()

            // Menu items
            items.forEach(([code, name], i) => {
                const y = 96 + i * 68
                // Row bg on hover (decorative alternating tint)
                if (i % 2 === 0) {
                    ctx.fillStyle = 'rgba(255,245,224,0.04)'
                    ctx.fillRect(20, y - 22, w - 40, 56)
                }
                // Tamil number / bullet
                ctx.font = '600 16px monospace'
                ctx.fillStyle = 'rgba(232,160,32,0.8)'
                ctx.textAlign = 'left'
                ctx.fillText(`${i + 1}.`, 28, y + 2)

                // Code name (menu-style)
                ctx.font = '600 22px "Georgia", serif'
                ctx.fillStyle = '#FFF5E0'
                ctx.fillText(code, 55, y + 2)

                // Project name
                ctx.font = '400 16px sans-serif'
                ctx.fillStyle = 'rgba(255,245,224,0.6)'
                ctx.fillText(`→  ${name}`, 55, y + 26)

                // Price dots / divider
                ctx.setLineDash([2, 4])
                ctx.strokeStyle = 'rgba(255,245,224,0.12)'
                ctx.lineWidth = 0.8
                ctx.beginPath()
                ctx.moveTo(28, y + 42)
                ctx.lineTo(w - 28, y + 42)
                ctx.stroke()
                ctx.setLineDash([])
            })

            // Footer hint
            ctx.font = 'italic 14px sans-serif'
            ctx.fillStyle = 'rgba(232,160,32,0.5)'
            ctx.textAlign = 'center'
            ctx.fillText('☞  click to browse projects  ☜', w / 2, h - 14)
        })

        const board = new THREE.Mesh(
            new THREE.PlaneGeometry(3.6, 2.75),
            new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95 })
        )
        board.position.set(0, 1.75, -2.84)
        board.name = 'menuBoard'
        board.userData.action = 'projects'
        this.scene.add(board)
        this.clickTargets.push(board)
    }

    // ── About Me Frame ─────────────────────────────────
    buildAboutFrame() {
        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(2.15, 2.75, 0.09), this.materials.lightWood
        )
        frame.position.set(-4.1, 1.75, -2.91)
        this.scene.add(frame)

        const bevel = new THREE.Mesh(
            new THREE.BoxGeometry(1.95, 2.55, 0.04),
            new THREE.MeshStandardMaterial({ color: 0xC47D0A, roughness: 0.5, metalness: 0.2 })
        )
        bevel.position.set(-4.1, 1.75, -2.87)
        this.scene.add(bevel)

        const tex = this.makeCanvasTexture(390, 510, (ctx, w, h) => {
            // Warm cream background
            ctx.fillStyle = '#FFFAF3'
            ctx.fillRect(0, 0, w, h)

            // Warm gradient wash
            const grad = ctx.createRadialGradient(w / 2, h * 0.3, 30, w / 2, h * 0.3, 180)
            grad.addColorStop(0, 'rgba(232,160,32,0.12)')
            grad.addColorStop(1, 'rgba(232,160,32,0)')
            ctx.fillStyle = grad
            ctx.fillRect(0, 0, w, h)

            // Avatar circle with gradient
            const avGrad = ctx.createRadialGradient(w / 2, 96, 8, w / 2, 96, 68)
            avGrad.addColorStop(0, '#F0B030')
            avGrad.addColorStop(1, '#8B2500')
            ctx.beginPath()
            ctx.arc(w / 2, 96, 68, 0, Math.PI * 2)
            ctx.fillStyle = avGrad
            ctx.fill()
            ctx.strokeStyle = 'rgba(232,160,32,0.8)'
            ctx.lineWidth = 3
            ctx.stroke()

            // "V" initial
            ctx.font = '700 58px Georgia, serif'
            ctx.fillStyle = '#FFFAF3'
            ctx.textAlign = 'center'
            ctx.fillText('V', w / 2, 118)

            // Name
            ctx.font = '700 30px Georgia, serif'
            ctx.fillStyle = '#2A1A08'
            ctx.fillText('Vignesh S', w / 2, 198)

            // Tagline
            ctx.font = 'italic 15px Georgia, serif'
            ctx.fillStyle = '#C47D0A'
            ctx.fillText('Builder · Systems Thinker · Coder', w / 2, 224)

            // Divider
            ctx.strokeStyle = 'rgba(196,125,10,0.3)'
            ctx.lineWidth = 1
            ctx.beginPath(); ctx.moveTo(40, 242); ctx.lineTo(w - 40, 242); ctx.stroke()

            // Skills
            ctx.font = '600 14px monospace'
            ctx.fillStyle = '#2A1A08'
            const skills = ['⚙  Rust', '🐍 Python', '⌨  C++', '📱 Flutter', '🌐 Three.js', '🤖 AI / RAG']
            skills.forEach((s, i) => {
                const col = i % 2
                const row = Math.floor(i / 2)
                ctx.fillStyle = i % 2 === 0 ? '#2A1A08' : '#5C3317'
                ctx.textAlign = 'left'
                ctx.fillText(s, 32 + col * 190, 270 + row * 30)
            })

            // Click hint
            ctx.font = 'italic 13px sans-serif'
            ctx.fillStyle = 'rgba(196,125,10,0.55)'
            ctx.textAlign = 'center'
            ctx.fillText('click for full profile', w / 2, h - 14)
        })

        const panel = new THREE.Mesh(
            new THREE.PlaneGeometry(1.92, 2.48),
            new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6 })
        )
        panel.position.set(-4.1, 1.75, -2.84)
        panel.name = 'aboutFrame'
        panel.userData.action = 'about'
        this.scene.add(panel)
        this.clickTargets.push(panel)
    }

    // ── Contact Sign ───────────────────────────────────
    buildContactSign() {
        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(2.0, 1.15, 0.08), this.materials.darkWood
        )
        frame.position.set(4.1, 1.2, -2.91)
        this.scene.add(frame)

        const tex = this.makeCanvasTexture(400, 230, (ctx, w, h) => {
            ctx.fillStyle = '#2A1A08'
            ctx.fillRect(0, 0, w, h)

            // Gold border
            ctx.strokeStyle = '#E8A020'
            ctx.lineWidth = 4
            ctx.strokeRect(6, 6, w - 12, h - 12)

            // Title
            ctx.font = '700 26px Georgia, serif'
            ctx.fillStyle = '#FFF5E0'
            ctx.textAlign = 'center'
            ctx.fillText('☕ Find Me', w / 2, 52)

            ctx.strokeStyle = 'rgba(232,160,32,0.4)'
            ctx.lineWidth = 1
            ctx.beginPath(); ctx.moveTo(30, 65); ctx.lineTo(w - 30, 65); ctx.stroke()

            ctx.font = '500 17px monospace'
            ctx.fillStyle = '#E8A020'
            ctx.fillText('github.com/vignesh2027', w / 2, 102)

            ctx.font = '400 14px sans-serif'
            ctx.fillStyle = 'rgba(255,245,224,0.55)'
            ctx.fillText('applemacbook6sep2004@gmail.com', w / 2, 132)

            ctx.font = 'italic 13px sans-serif'
            ctx.fillStyle = 'rgba(232,160,32,0.5)'
            ctx.fillText('[ click to connect ]', w / 2, 210)
        })

        const sign = new THREE.Mesh(
            new THREE.PlaneGeometry(1.82, 1.0),
            new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7 })
        )
        sign.position.set(4.1, 1.2, -2.84)
        sign.name = 'contactSign'
        sign.userData.action = 'contact'
        this.scene.add(sign)
        this.clickTargets.push(sign)
    }

    // ── Star / Night sky ───────────────────────────────
    buildStarField() {
        const count = 1000
        const pos = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            pos[i * 3]     = (Math.random() - 0.5) * 60
            pos[i * 3 + 1] = Math.random() * 18 + 5
            pos[i * 3 + 2] = (Math.random() - 0.5) * 60 - 6
        }
        const geo = new THREE.BufferGeometry()
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
        const stars = new THREE.Points(
            geo,
            new THREE.PointsMaterial({ color: 0xFFF8E7, size: 0.055, sizeAttenuation: true, transparent: true, opacity: 0.8 })
        )
        this.scene.add(stars)
        this.stars = stars
    }

    update(elapsedTime) {
        // Gentle lantern sway
        this.lanterns.forEach((l, i) => {
            l.rotation.z = Math.sin(elapsedTime * 0.5 + i * 1.8) * 0.018
        })
        // Subtle star twinkle
        if (this.stars) {
            this.stars.material.opacity = 0.7 + Math.sin(elapsedTime * 0.4) * 0.1
        }
    }
}

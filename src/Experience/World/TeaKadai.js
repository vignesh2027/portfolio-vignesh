import * as THREE from 'three'
import Experience from '../Experience.js'

export default class TeaKadai {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.materials = this.experience.world.materials

        this.clickTargets = []

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

    // ── Main scene geometry ────────────────────────────
    buildScene() {
        const m = this.materials

        // Floor
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), m.floor)
        floor.rotation.x = -Math.PI / 2
        floor.position.y = -0.82
        floor.receiveShadow = true
        this.scene.add(floor)

        // Back wall
        const wall = new THREE.Mesh(new THREE.PlaneGeometry(16, 8), m.plaster)
        wall.position.set(0, 1.2, -2.8)
        wall.receiveShadow = true
        this.scene.add(wall)

        // Side walls (partial)
        const wallL = new THREE.Mesh(new THREE.PlaneGeometry(6, 8), m.plaster)
        wallL.rotation.y = Math.PI / 2
        wallL.position.set(-5.5, 1.2, -0.3)
        wallL.receiveShadow = true
        this.scene.add(wallL)

        const wallR = wallL.clone()
        wallR.rotation.y = -Math.PI / 2
        wallR.position.set(5.5, 1.2, -0.3)
        this.scene.add(wallR)

        // Counter base
        const counterBase = new THREE.Mesh(new THREE.BoxGeometry(9, 1.5, 1.4), m.wood)
        counterBase.position.set(0, -0.07, 0)
        counterBase.castShadow = true
        counterBase.receiveShadow = true
        this.scene.add(counterBase)

        // Counter top
        const counterTop = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.08, 1.6), m.lightWood)
        counterTop.position.set(0, 0.69, 0)
        counterTop.castShadow = true
        counterTop.receiveShadow = true
        this.scene.add(counterTop)

        // Counter front trim
        const trim = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.12, 0.06), m.darkWood)
        trim.position.set(0, 0.65, 0.83)
        this.scene.add(trim)

        // Roof beam
        const beam = new THREE.Mesh(new THREE.BoxGeometry(10, 0.2, 0.2), m.darkWood)
        beam.position.set(0, 3.1, -0.6)
        beam.castShadow = true
        this.scene.add(beam)

        const beam2 = beam.clone()
        beam2.position.set(0, 3.1, 0.8)
        this.scene.add(beam2)

        // Left pillar
        const pillarGeo = new THREE.CylinderGeometry(0.14, 0.16, 4, 8)
        const pillarL = new THREE.Mesh(pillarGeo, m.darkWood)
        pillarL.position.set(-4.5, 1.2, 0.8)
        pillarL.castShadow = true
        this.scene.add(pillarL)

        const pillarR = pillarL.clone()
        pillarR.position.set(4.5, 1.2, 0.8)
        this.scene.add(pillarR)

        // Canopy
        const canopy = new THREE.Mesh(new THREE.PlaneGeometry(10.5, 2.5), this.materials.canopy)
        canopy.rotation.x = -0.25
        canopy.position.set(0, 3.3, 1.2)
        canopy.receiveShadow = true
        this.scene.add(canopy)

        // Canopy stripe pattern
        const stripeGeo = new THREE.PlaneGeometry(0.15, 2.5)
        const stripeMat = new THREE.MeshStandardMaterial({ color: 0xffe0a0, roughness: 1, side: THREE.DoubleSide })
        for (let i = -5; i <= 5; i += 0.6) {
            const stripe = new THREE.Mesh(stripeGeo, stripeMat)
            stripe.rotation.x = -0.25
            stripe.position.set(i, 3.31, 1.2)
            this.scene.add(stripe)
        }

        // Stove / grill on counter
        const stoveBase = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.06, 0.9), this.materials.metal)
        stoveBase.position.set(0, 0.73, 0.15)
        this.scene.add(stoveBase)

        const stoveRing = new THREE.Mesh(
            new THREE.TorusGeometry(0.3, 0.03, 8, 24),
            this.materials.metal
        )
        stoveRing.rotation.x = Math.PI / 2
        stoveRing.position.set(0, 0.77, 0.15)
        this.scene.add(stoveRing)

        // Kettle on stove
        const kettleBody = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 12), m.metal)
        kettleBody.position.set(0, 1.0, 0.15)
        kettleBody.castShadow = true
        this.scene.add(kettleBody)

        const kettleSpout = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.3, 8), m.metal)
        kettleSpout.rotation.z = -Math.PI / 4
        kettleSpout.position.set(0.28, 1.0, 0.15)
        this.scene.add(kettleSpout)

        const kettleLid = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 8), m.metal)
        kettleLid.position.set(0, 1.25, 0.15)
        this.scene.add(kettleLid)

        const kettleHandle = new THREE.Mesh(
            new THREE.TorusGeometry(0.14, 0.025, 8, 16, Math.PI),
            m.darkWood
        )
        kettleHandle.rotation.y = Math.PI / 2
        kettleHandle.position.set(-0.24, 1.05, 0.15)
        this.scene.add(kettleHandle)

        // Tea cups on counter (4 cups, right side)
        this.teaCups = []
        const cupPositions = [-2.8, -1.8, 2.2, 3.2]
        cupPositions.forEach(x => {
            const group = this.buildTeaCup(x, 0.73, -0.25)
            this.teaCups.push(group)
        })

        // Small jars/containers on counter left
        this.buildJar(-3.6, 0.73, -0.2, 0.09, 0.25, 0x8b0000)
        this.buildJar(-3.2, 0.73, -0.2, 0.07, 0.2, 0x2e8b57)
        this.buildJar(-2.8, 0.73, -0.2, 0.08, 0.18, 0xd4a017)
        this.buildJar(3.6, 0.73, -0.22, 0.07, 0.3, 0x654321)
        this.buildJar(4.0, 0.73, -0.22, 0.065, 0.22, 0x8b4513)

        // Shelf on back wall
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(4, 0.07, 0.35), m.lightWood)
        shelf.position.set(2.5, 2.4, -2.6)
        shelf.castShadow = true
        this.scene.add(shelf)

        // Items on shelf
        this.buildJar(1.8, 2.5, -2.5, 0.07, 0.22, 0x8b0000)
        this.buildJar(2.1, 2.5, -2.5, 0.09, 0.18, 0xd4a017)
        this.buildJar(2.4, 2.5, -2.5, 0.06, 0.25, 0x2e8b57)
        this.buildJar(2.7, 2.5, -2.5, 0.08, 0.2, 0x654321)
        this.buildJar(3.0, 2.5, -2.5, 0.07, 0.17, 0x556b2f)
        this.buildJar(3.3, 2.5, -2.5, 0.09, 0.21, 0x8b4513)

        // Hanging lanterns
        this.lanterns = []
        const lanternPositions = [
            { x: -2.2, y: 2.4, z: 0.2 },
            { x: 0,    y: 2.65, z: 0.2 },
            { x: 2.2,  y: 2.4, z: 0.2 }
        ]
        lanternPositions.forEach((pos, i) => {
            const lantern = this.buildLantern(pos.x, pos.y, pos.z, i === 1 ? 0.32 : 0.26)
            this.lanterns.push(lantern)
        })

        // Hanging cord from beam to lantern
        const cordMat = new THREE.MeshStandardMaterial({ color: 0x1a0e05 })
        lanternPositions.forEach(pos => {
            const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 3.1 - pos.y, 4), cordMat)
            cord.position.set(pos.x, (3.1 + pos.y) / 2 + 0.05, pos.z)
            this.scene.add(cord)
        })

        // Tamil-style tile border on counter front
        const tileMat = new THREE.MeshStandardMaterial({ color: 0x7a3010, roughness: 0.8 })
        for (let i = -4.3; i < 4.5; i += 0.4) {
            const tile = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.36, 0.05), tileMat)
            tile.position.set(i, 0.12, 0.84)
            this.scene.add(tile)
        }

        // Chalk menu writing (decorative text on back wall)
        const chalkDecor = new THREE.Mesh(
            new THREE.PlaneGeometry(2.2, 0.5),
            new THREE.MeshStandardMaterial({
                map: this.makeCanvasTexture(440, 100, (ctx, w, h) => {
                    ctx.fillStyle = 'transparent'
                    ctx.clearRect(0, 0, w, h)
                    ctx.font = 'bold 28px serif'
                    ctx.fillStyle = 'rgba(245,222,179,0.45)'
                    ctx.textAlign = 'center'
                    ctx.fillText('★  கடை  ★', w / 2, 60)
                }),
                transparent: true,
                roughness: 1,
                side: THREE.FrontSide
            })
        )
        chalkDecor.position.set(0, 0.5, -2.75)
        this.scene.add(chalkDecor)
    }

    buildTeaCup(x, y, z) {
        const group = new THREE.Group()

        const body = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.075, 0.18, 20),
            this.materials.teaCup
        )
        body.position.y = 0.09
        body.castShadow = true
        group.add(body)

        const liquid = new THREE.Mesh(
            new THREE.CylinderGeometry(0.092, 0.092, 0.02, 20),
            this.materials.teaLiquid
        )
        liquid.position.y = 0.17
        group.add(liquid)

        const saucer = new THREE.Mesh(
            new THREE.CylinderGeometry(0.145, 0.14, 0.025, 20),
            this.materials.teaCup
        )
        saucer.position.y = 0.012
        saucer.castShadow = true
        group.add(saucer)

        // Handle (torus arc)
        const handle = new THREE.Mesh(
            new THREE.TorusGeometry(0.065, 0.015, 8, 12, Math.PI),
            this.materials.teaCup
        )
        handle.rotation.y = Math.PI / 2
        handle.position.set(0.115, 0.11, 0)
        group.add(handle)

        group.position.set(x, y, z)
        this.scene.add(group)
        return group
    }

    buildJar(x, y, z, r, h, color) {
        const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.05 })
        const body = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 0.9, h, 16), mat)
        body.position.set(x, y + h / 2, z)
        body.castShadow = true
        this.scene.add(body)

        const lid = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.05, r * 1.05, 0.025, 16),
            new THREE.MeshStandardMaterial({ color: 0x1a0e05, roughness: 0.7, metalness: 0.3 }))
        lid.position.set(x, y + h + 0.012, z)
        this.scene.add(lid)
    }

    buildLantern(x, y, z, size) {
        const group = new THREE.Group()

        // Lantern body
        const body = new THREE.Mesh(
            new THREE.SphereGeometry(size, 12, 10),
            this.materials.lanternGlass
        )
        group.add(body)

        // Lantern cap top & bottom
        const capMat = this.materials.lanternFrame
        const capTop = new THREE.Mesh(new THREE.CylinderGeometry(size * 0.3, size * 0.3, size * 0.2, 8), capMat)
        capTop.position.y = size * 0.85
        group.add(capTop)
        const capBot = new THREE.Mesh(new THREE.CylinderGeometry(size * 0.2, size * 0.15, size * 0.3, 8), capMat)
        capBot.position.y = -size * 0.95
        group.add(capBot)

        // 4 vertical ribs
        for (let i = 0; i < 4; i++) {
            const rib = new THREE.Mesh(
                new THREE.BoxGeometry(0.015, size * 2, 0.015),
                capMat
            )
            rib.rotation.y = (Math.PI / 2) * i
            group.add(rib)
        }

        group.position.set(x, y, z)
        this.scene.add(group)
        return group
    }

    // ── Sign Board ─────────────────────────────────────
    buildSignBoard() {
        const tex = this.makeCanvasTexture(1024, 160, (ctx, w, h) => {
            // Wood background
            ctx.fillStyle = '#3d1e08'
            ctx.fillRect(0, 0, w, h)
            // Border
            ctx.strokeStyle = '#e8a020'
            ctx.lineWidth = 6
            ctx.strokeRect(8, 8, w - 16, h - 16)
            ctx.strokeStyle = '#c47d0a'
            ctx.lineWidth = 2
            ctx.strokeRect(14, 14, w - 28, h - 28)
            // Tamil text small
            ctx.font = 'bold 22px serif'
            ctx.fillStyle = '#c47d0a'
            ctx.textAlign = 'center'
            ctx.fillText('வி க்னேஷ்', w / 2, 46)
            // Main English title
            ctx.font = 'bold 62px "Georgia", serif'
            ctx.fillStyle = '#f5deb3'
            ctx.fillText("Vignesh's Tea Kadai", w / 2, 118)
            // Decorative dots
            for (let i = 0; i < 7; i++) {
                ctx.beginPath()
                ctx.arc(80 + i * 130, 140, 3, 0, Math.PI * 2)
                ctx.fillStyle = '#e8a020'
                ctx.fill()
            }
        })

        const sign = new THREE.Mesh(
            new THREE.BoxGeometry(5.5, 0.72, 0.06),
            new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8, metalness: 0.0 })
        )
        sign.position.set(0, 3.65, -0.5)
        sign.castShadow = true
        this.scene.add(sign)

        // Hanging wire
        const wireMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7, roughness: 0.4 })
        const wire1 = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.55, 4), wireMat)
        wire1.position.set(-2.4, 3.9, -0.5)
        this.scene.add(wire1)
        const wire2 = wire1.clone()
        wire2.position.set(2.4, 3.9, -0.5)
        this.scene.add(wire2)
    }

    // ── Menu / Chalkboard ──────────────────────────────
    buildMenuBoard() {
        // Board frame
        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(3.8, 2.9, 0.08),
            this.materials.darkWood
        )
        frame.position.set(0, 1.7, -2.72)
        this.scene.add(frame)

        // Chalkboard surface
        const tex = this.makeCanvasTexture(760, 580, (ctx, w, h) => {
            // Chalkboard green
            ctx.fillStyle = '#0f2208'
            ctx.fillRect(0, 0, w, h)
            // Chalk texture noise
            for (let i = 0; i < 3000; i++) {
                ctx.beginPath()
                ctx.arc(Math.random() * w, Math.random() * h, 0.5, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(200,220,180,${Math.random() * 0.04})`
                ctx.fill()
            }
            // Title
            ctx.font = 'bold 38px "Georgia", serif'
            ctx.fillStyle = 'rgba(245,222,179,0.95)'
            ctx.textAlign = 'center'
            ctx.fillText("Today's Special", w / 2, 54)
            // Divider
            ctx.strokeStyle = 'rgba(232,160,32,0.6)'
            ctx.lineWidth = 1.5
            ctx.beginPath()
            ctx.moveTo(40, 70)
            ctx.lineTo(w - 40, 70)
            ctx.stroke()
            // Menu items (projects as tea menu items)
            const items = [
                ['Masala C++',   'Game of DSA'],
                ['Cosmos Chai',  'NEXUS Intelligence'],
                ['Care Tea',     'SparshCare'],
                ['AI Blend',     'SYNTHRON'],
                ['RAG Brew',     'VORTEXRAG'],
                ['Rust Kadha',   'rustkvd'],
                ['Flux Decoction','FluxDB'],
            ]
            ctx.font = '20px "Courier New", monospace'
            items.forEach(([code, name], i) => {
                const yy = 108 + i * 65
                ctx.fillStyle = 'rgba(232,160,32,0.9)'
                ctx.textAlign = 'left'
                ctx.fillText(`  ${code}`, 50, yy)
                ctx.fillStyle = 'rgba(245,222,179,0.7)'
                ctx.font = '16px sans-serif'
                ctx.fillText(`  → ${name}`, 50, yy + 22)
                ctx.font = '20px "Courier New", monospace'
                // dotted line
                ctx.setLineDash([3, 5])
                ctx.strokeStyle = 'rgba(245,222,179,0.2)'
                ctx.lineWidth = 1
                ctx.beginPath()
                ctx.moveTo(50, yy + 36)
                ctx.lineTo(w - 50, yy + 36)
                ctx.stroke()
                ctx.setLineDash([])
            })
            // Click hint
            ctx.font = 'italic 15px sans-serif'
            ctx.fillStyle = 'rgba(245,222,179,0.45)'
            ctx.textAlign = 'center'
            ctx.fillText('[ click to see projects ]', w / 2, h - 18)
        })

        const board = new THREE.Mesh(
            new THREE.PlaneGeometry(3.6, 2.7),
            new THREE.MeshStandardMaterial({
                map: tex,
                roughness: 1.0,
                metalness: 0.0
            })
        )
        board.position.set(0, 1.7, -2.68)
        board.name = 'menuBoard'
        board.userData.action = 'projects'
        this.scene.add(board)
        this.clickTargets.push(board)
    }

    // ── About Me Frame ─────────────────────────────────
    buildAboutFrame() {
        // Frame
        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(2.0, 2.6, 0.07),
            this.materials.lightWood
        )
        frame.position.set(-4.0, 1.7, -2.72)
        this.scene.add(frame)

        // About photo/info texture
        const tex = this.makeCanvasTexture(400, 520, (ctx, w, h) => {
            ctx.fillStyle = '#1a0e05'
            ctx.fillRect(0, 0, w, h)
            // Avatar circle
            ctx.beginPath()
            ctx.arc(w / 2, 110, 70, 0, Math.PI * 2)
            const grad = ctx.createRadialGradient(w / 2, 110, 10, w / 2, 110, 70)
            grad.addColorStop(0, '#e8a020')
            grad.addColorStop(1, '#8b2500')
            ctx.fillStyle = grad
            ctx.fill()
            // Initials
            ctx.font = 'bold 56px Georgia, serif'
            ctx.fillStyle = '#1a0e05'
            ctx.textAlign = 'center'
            ctx.fillText('V', w / 2, 130)
            // Name
            ctx.font = 'bold 32px Georgia, serif'
            ctx.fillStyle = '#f5deb3'
            ctx.fillText('Vignesh S', w / 2, 218)
            // Tagline
            ctx.font = 'italic 16px Georgia, serif'
            ctx.fillStyle = '#c47d0a'
            ctx.fillText('Builder. Systems thinker.', w / 2, 248)
            ctx.fillText('Tea-fuelled coder.', w / 2, 270)
            // Divider
            ctx.strokeStyle = 'rgba(232,160,32,0.4)'
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(40, 290)
            ctx.lineTo(w - 40, 290)
            ctx.stroke()
            // Skills
            ctx.font = '14px monospace'
            ctx.fillStyle = 'rgba(245,222,179,0.8)'
            const skills = ['Rust', 'Python', 'C++', 'Flutter', 'Three.js', 'AI / RAG']
            skills.forEach((s, i) => {
                const col = i % 2
                const row = Math.floor(i / 2)
                ctx.fillText(`● ${s}`, 50 + col * 180, 318 + row * 28)
            })
            // Click hint
            ctx.font = 'italic 13px sans-serif'
            ctx.fillStyle = 'rgba(245,222,179,0.4)'
            ctx.textAlign = 'center'
            ctx.fillText('[ click for more ]', w / 2, h - 16)
        })

        const panel = new THREE.Mesh(
            new THREE.PlaneGeometry(1.84, 2.44),
            new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9 })
        )
        panel.position.set(-4.0, 1.7, -2.69)
        panel.name = 'aboutFrame'
        panel.userData.action = 'about'
        this.scene.add(panel)
        this.clickTargets.push(panel)
    }

    // ── Contact Sign ───────────────────────────────────
    buildContactSign() {
        const tex = this.makeCanvasTexture(320, 180, (ctx, w, h) => {
            ctx.fillStyle = '#1e0e04'
            ctx.fillRect(0, 0, w, h)
            ctx.strokeStyle = '#e8a020'
            ctx.lineWidth = 3
            ctx.strokeRect(5, 5, w - 10, h - 10)
            ctx.font = 'bold 22px Georgia, serif'
            ctx.fillStyle = '#f5deb3'
            ctx.textAlign = 'center'
            ctx.fillText('Find Me Online', w / 2, 50)
            ctx.font = '16px monospace'
            ctx.fillStyle = '#e8a020'
            ctx.fillText('github.com/vignesh2027', w / 2, 90)
            ctx.font = '13px sans-serif'
            ctx.fillStyle = 'rgba(245,222,179,0.5)'
            ctx.fillText('[ click ]', w / 2, 160)
        })

        const sign = new THREE.Mesh(
            new THREE.PlaneGeometry(1.7, 0.95),
            new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9 })
        )
        sign.position.set(4.0, 1.2, -2.7)
        sign.name = 'contactSign'
        sign.userData.action = 'contact'
        this.scene.add(sign)
        this.clickTargets.push(sign)

        // Frame
        const contactFrame = new THREE.Mesh(
            new THREE.BoxGeometry(1.85, 1.1, 0.05),
            this.materials.darkWood
        )
        contactFrame.position.set(4.0, 1.2, -2.73)
        this.scene.add(contactFrame)
    }

    // ── Star field background ──────────────────────────
    buildStarField() {
        const count = 800
        const positions = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            positions[i * 3 + 0] = (Math.random() - 0.5) * 50
            positions[i * 3 + 1] = Math.random() * 15 + 4
            positions[i * 3 + 2] = (Math.random() - 0.5) * 50 - 5
        }
        const geo = new THREE.BufferGeometry()
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        const stars = new THREE.Points(
            geo,
            new THREE.PointsMaterial({ color: 0xfff8e7, size: 0.06, sizeAttenuation: true })
        )
        this.scene.add(stars)
    }

    update(elapsedTime) {
        // Gentle bobbing on lanterns
        if (this.lanterns) {
            this.lanterns.forEach((l, i) => {
                l.position.y += Math.sin(elapsedTime * 0.8 + i * 1.5) * 0.0003
            })
        }
    }
}

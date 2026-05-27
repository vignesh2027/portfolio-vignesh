import Experience from '../Experience.js'

export default class Animations {
    constructor() {
        this.experience = new Experience()
    }

    update() {
        const elapsed = this.experience.time.elapsed * 0.001
        const world = this.experience.world

        if (world.teaKadai) world.teaKadai.update(elapsed)
        if (world.environment) world.environment.update(elapsed)
        if (world.steamParticles) world.steamParticles.update()
    }
}

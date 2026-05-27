import Experience from '../Experience.js'
import TeaKadai from './TeaKadai.js'
import Environment from './Environment.js'
import Materials from './Materials.js'
import Animations from './Animations.js'
import SteamParticles from './SteamParticles.js'

export default class World {
    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources

        this.materials = new Materials()
        this.environment = new Environment()
        this.teaKadai = new TeaKadai()
        this.steamParticles = new SteamParticles()
        this.animations = new Animations()
    }

    update() {
        this.animations.update()
    }
}

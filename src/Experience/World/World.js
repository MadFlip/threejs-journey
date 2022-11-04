import Experience from "../Experience"
import Environment from "./Environment"
import Ground from "./Ground"
import Fox from "./Fox"

export default class World {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    
    // Wait for resources to load
    this.resources.on('ready', () => {
      // Setup environment !important to put ground before environment to apply environment map to ground
      this.ground = new Ground()
      this.fox = new Fox()
      this.environment = new Environment()
    })
  }

  update() {
    if (this.fox) {
      this.fox.update()
    }
  }
}

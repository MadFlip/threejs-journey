import * as THREE from "three"
import Experience from "../Experience"

export default class Environment {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.debug = this.experience.debug

    if (this.debug) {
      this.debugFolder = this.debug.gui.addFolder('Environment')
    }
    
    this.setAmbientLight()
    this.setSunLight()
    this.setEnvironmentMap()
  }

  setAmbientLight() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    this.scene.add(this.ambientLight)
  }

  setSunLight() {
    this.directionalLight = new THREE.DirectionalLight('#ffffff', 4)
    this.directionalLight.castShadow = true
    this.directionalLight.shadow.camera.far = 15
    this.directionalLight.shadow.mapSize.set(1024, 1024)
    this.directionalLight.shadow.normalBias = 0.05
    this.directionalLight.position.set(3.5, 2, - 1.25)
    this.scene.add(this.directionalLight)

    // Debug
    if (this.debug) {
      this.debugFolder.add(this.directionalLight, 'intensity').min(0).max(10).step(0.001).name('Light Intensity')
      this.debugFolder.add(this.directionalLight.position, 'x').min(- 5).max(5).step(0.001).name('Light X')
      this.debugFolder.add(this.directionalLight.position, 'y').min(- 5).max(5).step(0.001).name('Light Y')
      this.debugFolder.add(this.directionalLight.position, 'z').min(- 5).max(5).step(0.001).name('Light Z')
    }
  }

  setEnvironmentMap() {
    this.environmentMap = {}
    this.environmentMap.intensity = 0.5
    this.environmentMap.texture = this.resources.items.environmentMapTexture
    this.environmentMap.texture.encoding = THREE.sRGBEncoding

    this.scene.environment = this.environmentMap.texture

    this.environmentMap.updateMaterials = () => {
      this.scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.envMap = this.environmentMap.texture
          child.material.envMapIntensity = this.environmentMap.intensity
          child.material.needsUpdate = true
        }
      })
    }

    this.environmentMap.updateMaterials()

    // Debug
    if (this.debug) {
      this.debugFolder.add(this.environmentMap, 'intensity').min(0).max(4).step(0.001).name('Env Map Intensity').onChange(this.environmentMap.updateMaterials)
    }
  }
}

import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

const parameters = {}

// Textures
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const doorColorTexture = textureLoader.load('textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('textures/door/roughness.jpg')

const concreteBlocksColorTexture = textureLoader.load('textures/concrete_blocks/color.jpg')
const concreteBlocksAmbientOcclusionTexture = textureLoader.load('textures/concrete_blocks/ambientOcclusion.jpg')
const concreteBlocksHeightTexture = textureLoader.load('textures/concrete_blocks/height.png')
const concreteBlocksNormalTexture = textureLoader.load('textures/concrete_blocks/normal.jpg')
const concreteBlocksRoughnessTexture = textureLoader.load('textures/concrete_blocks/roughness.jpg')

const sandColorTexture = textureLoader.load('textures/sand/color.jpg')
const sandAmbientOcclusionTexture = textureLoader.load('textures/sand/ambientOcclusion.jpg')
const sandHeightTexture = textureLoader.load('textures/sand/height.png')
const sandNormalTexture = textureLoader.load('textures/sand/normal.jpg')
const sandRoughnessTexture = textureLoader.load('textures/sand/roughness.jpg')

doorColorTexture.generateMipmaps = false
doorColorTexture.minFilter = THREE.NearestFilter
doorColorTexture.magFilter = THREE.NearestFilter
// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter
// gradientTexture.generateMipmaps = false

// const environmentMapTexture = cubeTextureLoader.load([
//     'textures/environmentMaps/3/px.jpg',
//     'textures/environmentMaps/3/nx.jpg',
//     'textures/environmentMaps/3/py.jpg',
//     'textures/environmentMaps/3/ny.jpg',
//     'textures/environmentMaps/3/pz.jpg',
//     'textures/environmentMaps/3/nz.jpg',
// ])


// Scene
const canvas = document.querySelector('.webgl')
const scene = new THREE.Scene()

// Objects
// const material = new THREE.MeshBasicMaterial()
// material.map = doorColorTexture
// material.transparent = true
// material.alphaMap = doorAlphaTexture

// const material = new THREE.MeshNormalMaterial()

// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture
// material.flatShading = true

// const material = new THREE.MeshDepthMaterial()

// const material = new THREE.MeshLambertMaterial()

// const material = new THREE.MeshPhongMaterial()
// material.shininess = 100
// material.specular = new THREE.Color(0x1188ff)

// const material = new THREE.MeshToonMaterial()
// material.gradientMap = gradientTexture

const material = new THREE.MeshStandardMaterial()
material.side = THREE.DoubleSide
material.metalness = 0
material.roughness = 1
material.map = doorColorTexture
material.aoMap = doorAmbientOcclusionTexture
material.aoMapIntensity = 1
material.displacementMap = doorHeightTexture
material.displacementScale = 0.025
material.metalnessMap = doorMetalnessTexture
material.roughnessMap = doorRoughnessTexture
material.normalMap = doorNormalTexture
material.transparent = true
material.alphaMap = doorAlphaTexture

const materialConcrete = new THREE.MeshStandardMaterial()
materialConcrete.map = concreteBlocksColorTexture
materialConcrete.aoMap = concreteBlocksAmbientOcclusionTexture
material.aoMapIntensity = 0.96
materialConcrete.displacementMap = concreteBlocksHeightTexture
materialConcrete.displacementScale = 0.035
materialConcrete.roughnessMap = concreteBlocksRoughnessTexture
materialConcrete.normalMap = concreteBlocksNormalTexture
materialConcrete.metalness = 0
materialConcrete.roughness = 0.7

const materialSand = new THREE.MeshStandardMaterial()
materialSand.map = sandColorTexture
materialSand.aoMap = sandAmbientOcclusionTexture
materialSand.aoMapIntensity = 1
materialSand.displacementMap = sandHeightTexture
materialSand.displacementScale = 0.035
materialSand.roughnessMap = sandRoughnessTexture
materialSand.normalMap = sandNormalTexture
materialSand.metalness = 0
materialSand.roughness = 1
materialSand.side = THREE.DoubleSide

// const material = new THREE.MeshStandardMaterial()
// material.side = THREE.DoubleSide
// material.metalness = 0.7
// material.roughness = .2
// material.envMap = environmentMapTexture

// Debug
const gui = new dat.GUI({ width: 400 })
gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)
gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.0001)
gui.add(material, 'displacementScale').min(0).max(1).step(0.0001)

gui.add(materialConcrete, 'roughness').min(0).max(1).step(0.0001)
gui.add(materialConcrete, 'aoMapIntensity').min(0).max(10).step(0.0001)
gui.add(materialConcrete, 'displacementScale').min(0).max(1).step(0.0001)

gui.add(materialSand, 'roughness').min(0).max(1).step(0.0001)
gui.add(materialSand, 'aoMapIntensity').min(0).max(10).step(0.0001)
gui.add(materialSand, 'displacementScale').min(0).max(1).step(0.0001)

// Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64),
    materialConcrete
)
sphere.position.x = -1.2
sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2))

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 100, 100),
    materialSand
)
plane.rotateX(- Math.PI * 0.5)
plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 64, 128),
    materialSand
)
torus.position.x = 1.2
torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2))

scene.add(sphere, plane, torus)

// Camera
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(0, 0, 5)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.minDistance = 1 // max zoom in
controls.maxDistance = 10 // max zoom out

// limit rotation vertical
// controls.maxPolarAngle = Math.PI / 2 // max angle up
// controls.minPolarAngle = 30 / 180 * Math.PI

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas // canvas: canvas
})

renderer.setSize(window.innerWidth, window.innerHeight)

const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    sphere.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime
    plane.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime
    plane.rotation.x = 0.15 * elapsedTime

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick()

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    // set pixel ratio to improve quality and performance
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
})

window.addEventListener('dblclick', () => {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
    if (!fullscreenElement) {
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen()
        } else if (canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen()
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen()
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen()
        }
    }
})

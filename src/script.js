import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

const parameters = {}

// Textures
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('textures/matcaps/4.png')
const gradientTexture = textureLoader.load('textures/gradients/5.jpg')

doorColorTexture.generateMipmaps = false
doorColorTexture.minFilter = THREE.NearestFilter
doorColorTexture.magFilter = THREE.NearestFilter
gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.magFilter = THREE.NearestFilter
gradientTexture.generateMipmaps = false

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

// Debug
const gui = new dat.GUI({ width: 400 })
gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)
gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.0001)
gui.add(material, 'displacementScale').min(0).max(1).step(0.0001)

// Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64,),
    material
)
sphere.position.x = -1.5
sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2))

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 100, 100),
    material
)
plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 64, 128),
    material
)
torus.position.x = 1.5
torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2))

scene.add(sphere, plane, torus)

// Camera
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(0, 0, 5)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.minDistance = 2 // max zoom in
controls.maxDistance = 8 // max zoom out

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
    // sphere.rotation.y = 0.1 * elapsedTime
    // torus.rotation.y = 0.1 * elapsedTime
    // plane.rotation.y = 0.1 * elapsedTime

    // sphere.rotation.x = 0.15 * elapsedTime
    // torus.rotation.x = 0.15 * elapsedTime
    // plane.rotation.x = 0.15 * elapsedTime

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

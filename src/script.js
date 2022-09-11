import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Textures
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('textures/matcaps/1.png')
const gradientTexture = textureLoader.load('textures/gradients/3.jpg')

doorColorTexture.generateMipmaps = false
doorColorTexture.minFilter = THREE.NearestFilter
doorColorTexture.magFilter = THREE.NearestFilter

// Scene
const canvas = document.querySelector('.webgl')
const scene = new THREE.Scene()

// Objects
const material = new THREE.MeshBasicMaterial()
material.map = doorColorTexture
material.transparent = true
// material.alphaMap = doorAlphaTexture
// material.wireframe = true
material.opacity = 0.5
material.side = THREE.DoubleSide

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    material
)
sphere.position.x = -1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 100, 100),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 16, 32),
    material
)
torus.position.x = 1.5

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
controls.maxPolarAngle = Math.PI / 2 // max angle up
controls.minPolarAngle = 30 / 180 * Math.PI

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

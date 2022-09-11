import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Cursor
// const cursor = {
//     x: 0,
//     y: 0
// }

// window.addEventListener('mousemove', (event) => {
//     cursor.x = event.clientX / window.innerWidth - 0.5
//     cursor.y = -(event.clientY / window.innerHeight - 0.5)
// })

// Scene
const canvas = document.querySelector('.webgl')
const scene = new THREE.Scene()

const positionsArray = new Float32Array([
    0, 0, 0, // vertex 1
    0, 1, 0, // vertex 2
    1, 0, 0, // vertex 3
])

const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)

const geometry = new THREE.BufferGeometry()
geometry.setAttribute('position', positionsAttribute)

const material = new THREE.MeshBasicMaterial({ color: 'cyan', wireframe: true })
const mesh = new THREE.Mesh(geometry, material)
mesh.position.y = 0.5
scene.add(mesh)

// Group
const group = new THREE.Group()
scene.add(group)

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(.5, 1, .5, 3, 3, 3),
    new THREE.MeshBasicMaterial({ 
        color: 'tomato', 
        wireframe: true
    })
)
cube1.position.x = -.6

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(.5, .8, .5),
    new THREE.MeshBasicMaterial({ 
        color: 'DeepSkyBlue',
        wireframe: true 
    })
)
cube2.position.y = -0.1

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(.5, .6, .5),
    new THREE.MeshBasicMaterial({ 
        color: 'NavajoWhite',
        wireframe: true 
    })
)
cube3.position.x = .6
cube3.position.y = -.2

group.add(cube1, cube2, cube3)

// Camera
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(0, 0, 4)
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

const tick = () => {
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

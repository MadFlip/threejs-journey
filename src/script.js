import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// Textures
const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)
const colorTexture = textureLoader.load('/door.jpg')

colorTexture.repeat.x = 2
colorTexture.repeat.y = 3
colorTexture.wrapS = THREE.MirroredRepeatWrapping
colorTexture.wrapT = THREE.RepeatWrapping

colorTexture.offset.x = 0.5
colorTexture.offset.y = 0.5

colorTexture.rotation = Math.PI * 0.25
colorTexture.center.x = 0.5
colorTexture.center.y = 0.5


// Debug
const gui = new dat.GUI({ closed: true, width: 400 })

// Scene
const canvas = document.querySelector('.webgl')
const scene = new THREE.Scene()

// Group
const group = new THREE.Group()
scene.add(group)

const parameters = { 
    color1: '#ffffff', // #ff6347
    color2: '#00bfff',
    color3: '#ffdead',
    spin: () => {
        gsap.to(group.rotation, { duration: 1, y: group.rotation.y + 10 })
    }
}

// Geometry & Material
const geometryCube1 = new THREE.BoxBufferGeometry(.5, 1, .5)
const materialCube1 =  new THREE.MeshBasicMaterial({ 
    color: parameters.color1,
    map: colorTexture
})

const geometryCube2 = new THREE.BoxBufferGeometry(.5, .8, .5)
const materialCube2 =  new THREE.MeshBasicMaterial({ 
    color: parameters.color2
})

const geometryCube3 = new THREE.BoxBufferGeometry(.5, .6, .5)
const materialCube3 =  new THREE.MeshBasicMaterial({ 
    color: parameters.color3
})

// Mesh
const cube1 = new THREE.Mesh(geometryCube1, materialCube1)
cube1.position.x = -.6

const cube2 = new THREE.Mesh(geometryCube2, materialCube2)
cube2.position.y = -0.1

const cube3 = new THREE.Mesh(geometryCube3, materialCube3)
cube3.position.x = .6
cube3.position.y = -.2

group.add(cube1, cube2, cube3)

// GUI Debug
gui.add(group.position, 'x').min(-3).max(3).step(.01).name('positionX')
gui.add(group.position, 'y').min(-3).max(3).step(.01).name('positionY')
gui.add(cube1.material, 'wireframe').name('wireframe 1')
gui.add(cube2.material, 'wireframe').name('wireframe 2')
gui.add(cube3.material, 'wireframe').name('wireframe 3')

gui.addColor(parameters, 'color1').onChange(() => {
    cube1.material.color.set(parameters.color1)
})

gui.addColor(parameters, 'color2').onChange(() => {
    cube2.material.color.set(parameters.color2)
})

gui.addColor(parameters, 'color3').onChange(() => {
    cube3.material.color.set(parameters.color3)
})
gui.add(parameters, 'spin')

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

// window.addEventListener('dblclick', () => {
//     const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
//     if (!fullscreenElement) {
//         if (canvas.requestFullscreen) {
//             canvas.requestFullscreen()
//         } else if (canvas.webkitRequestFullscreen) {
//             canvas.webkitRequestFullscreen()
//         }
//     } else {
//         if (document.exitFullscreen) {
//             document.exitFullscreen()
//         } else if (document.webkitExitFullscreen) {
//             document.webkitExitFullscreen()
//         }
//     }
// })

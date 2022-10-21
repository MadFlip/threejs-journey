import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
gui.hide()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000000)
// add a fog so the text behind is not visible
scene.fog = new THREE.Fog(0x000000, 0.0001, 6)


// Text geometry
const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
const fontLoader = new FontLoader()
const textOptions = (font) => {
    return {
        font: font,
        size: .45,
        height: 0.02,
        curveSegments: 16,
        bevelEnabled: false,
    }
}
const textMeshesGroup =  new THREE.Group()

fontLoader.load(
    '/fonts/titillium_web_semi_bold.json',
    (font) => {
        const textGeometry = new TextGeometry('BLACK FRIDAY', textOptions(font))
        textGeometry.center()

        // generate 8 text meshes and position them making a cylinder shape
        const textMeshCount = 8
        const textCircleRadius = 0.7
        for (let i = 0; i < textMeshCount; i++) {
            const textMesh = new THREE.Mesh(textGeometry, textMaterial)
            textMesh.position.y = Math.sin((i / textMeshCount) * Math.PI * 2) * textCircleRadius
            textMesh.position.x = 0
            textMesh.position.z = Math.cos((i / textMeshCount) * Math.PI * 2) * textCircleRadius
            textMesh.rotation.x = (i / textMeshCount) * Math.PI * -2
            textMeshesGroup.add(textMesh)
        }

        textMeshesGroup.position.y = 0.75
        scene.add(textMeshesGroup)
    })
/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
// scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 5)
directionalLight.position.set(0, 0, .5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// rotate textMeshesGroup up on mouse move up 
const onMouseMove = (event) => {
    const mousePosition = {
        // x: event.clientX / sizes.width - 0.5,
        y: event.clientY / sizes.height - 0.5
    }
    textMeshesGroup.rotation.x = mousePosition.y * 2
    // textMeshesGroup.rotation.y = mousePosition.x * 0.5
}
window.addEventListener('mousemove', onMouseMove)

/**
 * Camera
 */
// Base camera
// const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 2.15)
// camera.position.set(0, 1, 2.4)
// scene.add(camera)

// set ortographic camera in front of the text
const camera = new THREE.OrthographicCamera(- 2.2, 2.2, 2.2, - 2.2, 0, 6) 
camera.position.set(0, 1, 5)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true
controls.enabled = false

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    // alpha: true,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update controls
    controls.update()

    // Rotate textMeshesGroup
    textMeshesGroup.rotation.x = elapsedTime * -0.3

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

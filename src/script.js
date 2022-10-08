import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x265714)
scene.fog = new THREE.Fog(0x265714, 0.5, 10)

/** 
 * Models
 */
let mixer = null
let actions = []
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

gltfLoader.load(
    '/models/Fox/glTF/Fox.gltf',
    (gltf) =>
    {
        mixer = new THREE.AnimationMixer(gltf.scene)
        let idleAction = mixer.clipAction(gltf.animations[0])
        let walkAction = mixer.clipAction(gltf.animations[1])
        let runAction = mixer.clipAction(gltf.animations[2])
        actions = [idleAction, walkAction, runAction]

        // play or crossFade idleAction on "w" keypress
        document.addEventListener('keydown', (e) => {
            console.log(mixer.stats.actions)
            switch (e.key) {
                case 'w' :
                    idleAction.fadeOut(.5)
                    runAction.fadeOut(.5)
                    setTimeout(() => {
                        idleAction.stop()
                        runAction.stop()
                        walkAction.fadeIn(.5)
                        walkAction.play()
                    }, 500)
                    break
                case 's' :
                    walkAction.fadeOut(.5)
                    runAction.fadeOut(.5)
                    setTimeout(() => {
                        walkAction.stop()
                        runAction.stop()
                        idleAction.fadeIn(.5)
                        idleAction.play()
                    }, 500)
                    break
                case 'e' :
                    walkAction.crossFadeTo(runAction, .5)
                    idleAction.fadeOut(.5)
                    setTimeout(() => {
                        walkAction.stop()
                        idleAction.stop()
                    }, 500)
                    runAction.play()
            }
        })

        gltf.scene.scale.set(0.025, 0.025, 0.025)
        gltf.scene.castShadow = true
        scene.add(gltf.scene)
    }
)


/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 30),
    new THREE.MeshStandardMaterial({
        color: '#265714',
        metalness: .2,
        roughness: .6
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    // alpha: true,
    antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
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

    // Update mixer
    if (mixer) mixer.update(deltaTime)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

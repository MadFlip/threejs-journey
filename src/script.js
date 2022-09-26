import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()


// Canvas
const canvas = document.querySelector('.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x082caf)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg')
const simpleShadowSq = textureLoader.load('/textures/simpleShadowSq.jpg')

/**
 * Fonts
 */
 const material = new THREE.MeshStandardMaterial({
    color: 0x1954ed,
    roughness: 0.4,
 })

 const material2 = new THREE.MeshStandardMaterial({
    color: 0x28d1b4,
    roughness: 0.4,
 })

const material3 = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.4,
})

const sphereGeometry = new THREE.SphereGeometry(0.25, 32, 32)
const pyramidGeometry = new THREE.ConeGeometry(0.5, 0.5, 3, 1, false, 0, Math.PI * 2)
const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
const planeGeometry = new THREE.PlaneGeometry(6, 6, 1, 1)

const sphere = new THREE.Mesh(sphereGeometry, material)
sphere.position.x = .5
sphere.position.y = 0
sphere.position.z = .1
sphere.rotation.x = Math.random() * Math.PI
sphere.rotation.y = Math.random() * Math.PI
sphere.castShadow = false

const pyramid = new THREE.Mesh(pyramidGeometry, material2)
pyramid.position.x = 0
pyramid.position.y = 1.55
pyramid.position.z = 0
pyramid.castShadow = true  

const cube = new THREE.Mesh(cubeGeometry, material3)
cube.position.x = -.75
cube.position.y = .75
cube.position.z = -.75
cube.rotation.x = Math.random() * Math.PI
cube.rotation.y = Math.random() * Math.PI
cube.castShadow = false

const plane = new THREE.Mesh(planeGeometry, material3)
plane.position.x = 0
plane.position.y = -.25
plane.position.z = 0
plane.rotation.x = Math.PI * -.5
plane.receiveShadow = true
 
scene.add(cube, pyramid, sphere, plane)

const sphereShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(.25, .25),
    new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        alphaMap: simpleShadow
    })
)
sphereShadow.rotation.x = - Math.PI * 0.5
sphereShadow.position.y = plane.position.y + 0.01
scene.add(sphereShadow)

const cubeShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(.35, .35),
    new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        alphaMap: simpleShadowSq
    })
)
cubeShadow.rotation.x = - Math.PI * 0.5
cubeShadow.position.y = plane.position.y + 0.02
scene.add(cubeShadow)

const fontLoader = new FontLoader()
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry = new TextGeometry(
            'Bleech',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 6,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5,
            }
        )
        textGeometry.center()     
        
        const text = new THREE.Mesh(textGeometry, material)
        text.castShadow = true
        text.position.y = 1
        scene.add(text)
    }
)

/**
 * Lights
 */

// Minimal cost of using the GPU - Ambient light and Hemisphere light
const ambientLight = new THREE.AmbientLight(0xffffff, .15)
scene.add(ambientLight)

const hemisphereLight = new THREE.HemisphereLight(0x082caf, 0x082caf, .75)
scene.add(hemisphereLight)

// Moderate cost of using the GPU - Directional light and Point light
const directionalLight = new THREE.DirectionalLight(0xffffff, .3)
directionalLight.position.set(1, 2, 1)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.radius = 5
directionalLight.shadow.camera.far = 6
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.top = 4
directionalLight.shadow.camera.right = 3
directionalLight.shadow.camera.bottom = -1
directionalLight.shadow.camera.left = -3
scene.add(directionalLight)

const pointLight = new THREE.PointLight(0xff9000, .35, 10, 2)
pointLight.position.set(-.1, 0.5, -.5)
pointLight.castShadow = false
pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024
pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 3

scene.add(pointLight)

// High cost of using the GPU - Spot light and RectArea light !!
const rectAreaLight = new THREE.RectAreaLight(0x00acff, 2, 1, 1)
rectAreaLight.position.set(0, 1.75, 1)
rectAreaLight.lookAt(new THREE.Vector3())
scene.add(rectAreaLight)

const spotLight = new THREE.SpotLight(0xff9000, .5, 10, Math.PI * .1, .05, 1)
spotLight.position.set(0, 3, 3)
spotLight.castShadow = true
spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
spotLight.shadow.fov = 30
spotLight.shadow.camera.far = 6
spotLight.shadow.camera.near = 1
spotLight.target.position.x = -0.5
scene.add(spotLight.target)
scene.add(spotLight)

/**
 * Light Helpers
 */

// const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, .2)
// scene.add(hemisphereLightHelper)

// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, .2)
// scene.add(directionalLightHelper)

// const pointLightHelper = new THREE.PointLightHelper(pointLight, .2)
// scene.add(pointLightHelper)

// const spotLightHelper = new THREE.SpotLightHelper(spotLight)
// scene.add(spotLightHelper)

// const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
// scene.add(rectAreaLightHelper)

// window.requestAnimationFrame(() => {
//     spotLightHelper.update()
// })

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
directionalLightCameraHelper.visible = false
scene.add(directionalLightCameraHelper)

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
spotLightCameraHelper.visible = false
scene.add(spotLightCameraHelper)

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
pointLightCameraHelper.visible = false
scene.add(pointLightCameraHelper)
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
const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true

gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001).name('Ambient Light')
gui.add(hemisphereLight, 'intensity').min(0).max(1).step(0.001).name('Heimisphere Light')

const directionalFolder = gui.addFolder('Directional Light')
directionalFolder.add(directionalLight, 'intensity').min(0).max(1).step(0.001).name('Intensity')
directionalFolder.add(directionalLight.position, 'x').min(-5).max(5).step(0.001).name('X')
directionalFolder.add(directionalLight.position, 'y').min(-5).max(5).step(0.001).name('Y')
directionalFolder.add(directionalLight.position, 'z').min(-5).max(5).step(0.001).name('Z')

const pointFolder = gui.addFolder('Point Light')
pointFolder.add(pointLight, 'intensity').min(0).max(1).step(0.001).name('Intensity')
pointFolder.add(pointLight.position, 'x').min(-5).max(5).step(0.001).name('X')
pointFolder.add(pointLight.position, 'y').min(-5).max(5).step(0.001).name('Y')
pointFolder.add(pointLight.position, 'z').min(-5).max(5).step(0.001).name('Z')
pointFolder.add(pointLight, 'distance').min(0).max(10).step(0.001).name('Distance')
pointFolder.add(pointLight, 'decay').min(0).max(10).step(0.001).name('Decay')

const rectAreaFolder = gui.addFolder('Rect Area Light')
rectAreaFolder.add(rectAreaLight, 'intensity').min(0).max(10).step(0.001).name('Intensity')
rectAreaFolder.add(rectAreaLight.position, 'x').min(-5).max(5).step(0.001).name('X')
rectAreaFolder.add(rectAreaLight.position, 'y').min(-5).max(5).step(0.001).name('Y')
rectAreaFolder.add(rectAreaLight.position, 'z').min(-5).max(5).step(0.001).name('Z')
rectAreaFolder.add(rectAreaLight, 'width').min(0).max(10).step(0.001).name('Width')
rectAreaFolder.add(rectAreaLight, 'height').min(0).max(10).step(0.001).name('Height')

const spotFolder = gui.addFolder('Spot Light')
spotFolder.add(spotLight, 'intensity').min(0).max(1).step(0.001).name('Intensity')
spotFolder.add(spotLight.position, 'x').min(-5).max(5).step(0.001).name('X')
spotFolder.add(spotLight.position, 'y').min(-5).max(5).step(0.001).name('Y')
spotFolder.add(spotLight.position, 'z').min(-5).max(5).step(0.001).name('Z')
spotFolder.add(spotLight, 'distance').min(0).max(20).step(0.001).name('Distance')
spotFolder.add(spotLight, 'angle').min(0).max(Math.PI * 2).step(0.001).name('Angle')
spotFolder.add(spotLight, 'penumbra').min(0).max(1).step(0.001).name('Penumbra')
spotFolder.add(spotLight, 'decay').min(0).max(10).step(0.001).name('Decay')

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    // Update sphere
    sphere.position.x = Math.cos(elapsedTime) * 1.25
    sphere.position.z = Math.sin(elapsedTime) * 1.25
    // Force value to be positive Math.abs() 
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 3))

    // Update shadow
    sphereShadow.position.x = sphere.position.x
    sphereShadow.position.z = sphere.position.z
    sphereShadow.material.opacity = (1 - sphere.position.y) * 0.4 + 0.1
    sphereShadow.scale.x = 2 + sphere.position.y * 2
    sphereShadow.scale.y = 2 + sphere.position.y * 2

    cube.position.x = Math.cos(elapsedTime) * 2.5
    cube.position.z = Math.sin(elapsedTime) * 2.5
    // Force value to be positive Math.abs() 
    cube.position.y = Math.abs(Math.sin(elapsedTime * 3))

    cubeShadow.position.x = cube.position.x
    cubeShadow.position.z = cube.position.z
    cubeShadow.material.opacity = (1 - cube.position.y) * 0.4 + 0.1
    cubeShadow.scale.x = 2 + cube.position.y * 2
    cubeShadow.scale.y = 2 + cube.position.y * 2
    pyramid.rotation.y = elapsedTime

    // Update controls
    controls.update()
    // camera.position.x = Math.sin(cursor.x * Math.PI) * 3
    // camera.position.z = Math.cos(cursor.x * Math.PI) * 3
    // camera.position.y = cursor.y * 5
    // camera.lookAt(new THREE.Vector3())
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

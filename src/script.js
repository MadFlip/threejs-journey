import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import firefliesVertexShader from './shaders/fireflies/vertex.glsl'
import firefliesFragmentShader from './shaders/fireflies/fragment.glsl'
import portalVertexShader from './shaders/portal/vertex.glsl'
import portalFragmentShader from './shaders/portal/fragment.glsl'

/**
 * Base
 */
// Debug
const debugObject = {}
const gui = new dat.GUI({
    width: 400
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Textures
 *
 **/
const encoding = THREE.sRGBEncoding

// Baked texture
const bakedTexture = textureLoader.load('my-baked-portal.jpg')
bakedTexture.flipY = false
bakedTexture.encoding = encoding

// Baked material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })

// Pole light material
const poleLightMaterial = new THREE.MeshBasicMaterial({ color: '#ffffe5' })

debugObject.colorStart = '#6b70ff'
debugObject.colorEnd = '#ffffff'
// Portal light material
const portalLightMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uColorStart: { value: new THREE.Color(debugObject.colorStart) },
        uColorEnd: { value: new THREE.Color(debugObject.colorEnd) }
    },
    vertexShader: portalVertexShader,
    fragmentShader: portalFragmentShader,
    // transparent: true
})

gui.addColor(debugObject, 'colorStart').onChange(() =>
{
    portalLightMaterial.uniforms.uColorStart.value.set(debugObject.colorStart)
})

gui.addColor(debugObject, 'colorEnd').onChange(() =>
{
    portalLightMaterial.uniforms.uColorEnd.value.set(debugObject.colorEnd)
})


/**
 * Model
 */

gltfLoader.load(
    'my-portal-merged.glb',
    (gltf) =>
    {
        const bakedMesh = gltf.scene.children.find(child => child.name === 'merged')
        const portalLightMesh = gltf.scene.children.find(child => child.name === 'portalLight')
        const poleLightAMesh = gltf.scene.children.find(child => child.name === 'poleLightA')
        const poleLightBMesh = gltf.scene.children.find(child => child.name === 'poleLightB')
        bakedMesh.material = bakedMaterial
        poleLightAMesh.material = poleLightMaterial
        poleLightBMesh.material = poleLightMaterial
        portalLightMesh.material = portalLightMaterial
        // rotate scene
        gltf.scene.rotation.y = Math.PI
        scene.add(gltf.scene)
    }
)

/**
 * Fireflies
 **/

// Geometry
const fireflyGeometry = new THREE.BufferGeometry()
const fireflyCount = 30
const positionArray = new Float32Array(fireflyCount * 3)
const scaleArray = new Float32Array(fireflyCount)

for (let i = 0; i < fireflyCount * 3; i++)
{
    positionArray[i * 3 + 0] = (Math.random() - 0.5) * 4,
    positionArray[i * 3 + 1] = Math.random() * 1.5,
    positionArray[i * 3 + 2] = (Math.random() - 0.5) * 4

    scaleArray[i] = Math.random()
}

fireflyGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
fireflyGeometry.setAttribute('aScale', new THREE.BufferAttribute(positionArray, 1))

// Material
const fireflyMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 100 }
    },
    vertexShader: firefliesVertexShader,
    fragmentShader: firefliesFragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
})

gui.add(fireflyMaterial.uniforms.uSize, 'value').min(0).max(200).step(1).name('fireflySize')

// Points
const fireflies = new THREE.Points(fireflyGeometry, fireflyMaterial)
scene.add(fireflies)

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

    // Update firefly material
    fireflyMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
// limit max zoom
controls.maxDistance = 10
// limit min zoom
controls.minDistance = 4
// limit rotation above horizon
controls.maxPolarAngle = Math.PI / 2.1
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.outputEncoding = encoding
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

debugObject.clearColor = '#331e0a'
renderer.setClearColor(debugObject.clearColor)
gui.addColor  (debugObject, 'clearColor').onChange(() =>
{
    renderer.setClearColor(debugObject.clearColor)
})

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update fireflies uTime
    fireflyMaterial.uniforms.uTime.value = elapsedTime
    portalLightMaterial.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

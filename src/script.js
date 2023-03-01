import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import waterVertexShader from './shaders/water/vertex.glsl'
import waterFragmentShader from './shaders/water/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 })
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(8, 8, 512, 512)

// Color
debugObject.backgroundColor = '#10437a'
debugObject.depthColor = '#00438a'
debugObject.surfaceColor = '#00b4cc'

scene.background = new THREE.Color(debugObject.backgroundColor)

// Material
const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    uniforms:
    {
        uTime: { value: 0 },

        uBigWavesElevation: { value: 0.05 },
        uBigWavesFrequency: { value: new THREE.Vector2(6.7, 5.4) },
        uBigWavesSpeed: { value: 1.1 },

        uSmallWavesElevation: { value: 0.028 },
        uSmallWavesFrequency: { value: 8.7 },
        uSmallWavesSpeed: { value: 0.2 },
        uSmallWavesIterations: { value: 4.0 },

        uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
        uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
        uColorOffset: { value: 0.12 },
        uColorMultiplier: { value: 3.83 },

        uFogColor: { value: new THREE.Color(debugObject.backgroundColor) },
        uFogNear: { value: 0.5 },
        uFogFar: { value: 2.85 },
    }
})

// Debug
gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).name('bigWavesElevation').listen()
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('bigWavesFrequencyX').listen()
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('bigWavesFrequencyY').listen()
gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value').min(0).max(10).step(0.001).name('bigWavesSpeed').listen()
gui.add(waterMaterial.uniforms.uSmallWavesElevation, 'value').min(0).max(1).step(0.001).name('smallWavesElevation').listen()
gui.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value').min(0).max(10).step(0.001).name('smallWavesFrequency').listen()
gui.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value').min(0).max(10).step(0.001).name('smallWavesSpeed').listen()
gui.add(waterMaterial.uniforms.uSmallWavesIterations, 'value').min(0).max(10).step(0.001).name('smallWavesIterations').listen()
gui.addColor(debugObject, 'depthColor').onChange(() =>{
    waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor)
}).name('depthColor').listen()
gui.addColor(debugObject, 'surfaceColor').onChange(() =>{
    waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)
}).name('surfaceColor').listen()
gui.add(waterMaterial.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('colorOffset').listen()
gui.add(waterMaterial.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.001).name('colorMultiplier').listen()
// gui add background color
gui.addColor(debugObject, 'backgroundColor').onChange(() =>{
    scene.background.set(debugObject.backgroundColor)
    waterMaterial.uniforms.uFogColor.value.set(debugObject.backgroundColor)
}).name('backgroundColor').listen()

// gui add button with predefined settings
gui.add({
    preset1: () => {
        debugObject.depthColor = '#00438a'
        debugObject.surfaceColor = '#00b4cc'
        debugObject.backgroundColor = '#10437a'
        scene.background.set(debugObject.backgroundColor)
        waterMaterial.uniforms.uBigWavesElevation.value = 0.05
        waterMaterial.uniforms.uBigWavesFrequency.value.x = 6.7
        waterMaterial.uniforms.uBigWavesFrequency.value.y = 5.4
        waterMaterial.uniforms.uBigWavesSpeed.value = 1.1
        waterMaterial.uniforms.uSmallWavesElevation.value = 0.028
        waterMaterial.uniforms.uSmallWavesFrequency.value = 8.7
        waterMaterial.uniforms.uSmallWavesSpeed.value = 0.2
        waterMaterial.uniforms.uSmallWavesIterations.value = 4.0
        waterMaterial.uniforms.uColorOffset.value = 0.12
        waterMaterial.uniforms.uColorMultiplier.value = 3.83
        waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor)
        waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)
        waterMaterial.uniforms.uFogColor.value.set(debugObject.backgroundColor)
    }
}, 'preset1').name('Preset: Blue Ocean')

gui.add({
    preset2: () => {
        waterMaterial.uniforms.uBigWavesElevation.value = 0.05
        waterMaterial.uniforms.uBigWavesFrequency.value.x = 5.0
        waterMaterial.uniforms.uBigWavesFrequency.value.y = 7.0
        waterMaterial.uniforms.uBigWavesSpeed.value = 1.2
        waterMaterial.uniforms.uSmallWavesElevation.value = 0.02
        waterMaterial.uniforms.uSmallWavesFrequency.value = 4.1
        waterMaterial.uniforms.uSmallWavesSpeed.value = 2.0
        waterMaterial.uniforms.uSmallWavesIterations.value = 6.0
        waterMaterial.uniforms.uColorOffset.value = 0.15
        waterMaterial.uniforms.uColorMultiplier.value = 3.0
        waterMaterial.uniforms.uDepthColor.value.set('#7991a9')
        waterMaterial.uniforms.uSurfaceColor.value.set('#3a455a')
        debugObject.depthColor = '#7991a9'
        debugObject.surfaceColor = '#3a455a'
        scene.background.set('#253446')
        waterMaterial.uniforms.uFogColor.value.set('#253446')
        debugObject.backgroundColor = '#253446'
    }
}, 'preset2').name('Preset: Smoky Clouds')

gui.add({
    preset3: () => {
        debugObject.depthColor = '#fb041d'
        debugObject.surfaceColor = '#ffd500'
        debugObject.backgroundColor = '#831111'
        scene.background.set(debugObject.backgroundColor)
        waterMaterial.uniforms.uBigWavesElevation.value = 0.02
        waterMaterial.uniforms.uBigWavesFrequency.value.x = 4.9
        waterMaterial.uniforms.uBigWavesFrequency.value.y = 3.5
        waterMaterial.uniforms.uBigWavesSpeed.value = 1.3
        waterMaterial.uniforms.uSmallWavesElevation.value = 0.043
        waterMaterial.uniforms.uSmallWavesFrequency.value = 4.7
        waterMaterial.uniforms.uSmallWavesSpeed.value = 0.2
        waterMaterial.uniforms.uSmallWavesIterations.value = 2.2
        waterMaterial.uniforms.uColorOffset.value = 0.13
        waterMaterial.uniforms.uColorMultiplier.value = 4.7
        waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor)
        waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)
        waterMaterial.uniforms.uFogColor.value.set(debugObject.backgroundColor)
    }
}, 'preset3').name('Preset: Hot Lava')

gui.add({
    preset4: () => {
        debugObject.depthColor = '#c16c0b'
        debugObject.surfaceColor = '#fdcf6d'
        debugObject.backgroundColor = '#ffcd61'
        scene.background.set(debugObject.backgroundColor)
        waterMaterial.uniforms.uBigWavesElevation.value = 0.16
        waterMaterial.uniforms.uBigWavesFrequency.value.x = 3.6
        waterMaterial.uniforms.uBigWavesFrequency.value.y = 3.9
        waterMaterial.uniforms.uBigWavesSpeed.value = 0.13
        waterMaterial.uniforms.uSmallWavesElevation.value = 0.0
        waterMaterial.uniforms.uSmallWavesFrequency.value = 0.0
        waterMaterial.uniforms.uSmallWavesSpeed.value = 0.0
        waterMaterial.uniforms.uSmallWavesIterations.value = 0.0
        waterMaterial.uniforms.uColorOffset.value = 0.28
        waterMaterial.uniforms.uColorMultiplier.value = 3.0
        waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor)
        waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)
        waterMaterial.uniforms.uFogColor.value.set(debugObject.backgroundColor)
    }
}, 'preset4').name('Preset: Sandy Desert')

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)

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
camera.position.set(-1.5, 0.25, 0.5)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.maxPolarAngle = Math.PI * 0.45
controls.minDistance = 1
controls.maxDistance = 2
// disable drag
controls.enablePan = false
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update water
    waterMaterial.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

// Cursor
const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / window.innerWidth - 0.5
    cursor.y = -(event.clientY / window.innerHeight - 0.5)
})

/**
 * Base
 */
// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x082caf)

// get random number, but exclude values from -.5 to .5
const getRandomNumber = (min, max) => {
    const randomNumber = Math.random() * (max - min + 1) + min
    if (randomNumber > -.5 && randomNumber < .5) {
        return getRandomNumber(min, max)
    } else {
        return randomNumber
    }
}

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/flynt-1.png')
const matcapTexture2 = textureLoader.load('/textures/matcaps/flynt-2.png')
const matcapTexture3 = textureLoader.load('/textures/matcaps/flynt-3.png')


/**
 * Fonts
 */

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
        const material = new THREE.MeshMatcapMaterial({
            matcap: matcapTexture
         })
        
        
        const text = new THREE.Mesh(textGeometry, material)
        scene.add(text)
        

        const material2 = new THREE.MeshMatcapMaterial({
            matcap: matcapTexture2
        })
        
        const material3 = new THREE.MeshMatcapMaterial({
            matcap: matcapTexture3
        })
        // const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
        const spehereGeometry = new THREE.SphereGeometry(0.5, 32, 32)
        const pyramidGeometry = new THREE.ConeGeometry(0.5, 0.5, 3, 1, false, 0, Math.PI * 2)
        const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
        
        for (let i = 0; i < 100; i++) {
            const donut = new THREE.Mesh(spehereGeometry, material)
            donut.position.x = getRandomNumber(-5,5)
            donut.position.y = getRandomNumber(-5,5)
            donut.position.z = getRandomNumber(-5,5)

            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI
            
            const scale = Math.random() * 0.35 + 0.35
            // limit random scale to 0.5 - 1
            
            donut.scale.set(scale, scale, scale)
            
            scene.add(donut)
        }

        for (let i = 0; i < 100; i++) {
            const donut = new THREE.Mesh(pyramidGeometry, material2)
           
      
            donut.position.x = getRandomNumber(-5,5)
            donut.position.y = getRandomNumber(-5,5)
            donut.position.z = getRandomNumber(-5,5)

            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI
            
            const scale = Math.random() * 0.5 + 0.55
            // limit random scale to 0.5 - 1
            
            donut.scale.set(scale, scale, scale)
            
            scene.add(donut)
        }

        for (let i = 0; i < 100; i++) {
            const donut = new THREE.Mesh(cubeGeometry, material3)
            donut.position.x = getRandomNumber(-5,5)
            donut.position.y = getRandomNumber(-5,5)
            donut.position.z = getRandomNumber(-5,5)

            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI
            
            const scale = Math.random() * 0.5 + 0.55
            // limit random scale to 0.5 - 1
            
            donut.scale.set(scale, scale, scale)
            
            scene.add(donut)
        }
    }
)


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
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true
// controls.autoRotate = true
// controls.enabled = false

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

    // Update controls
    // controls.update()
    camera.position.x = Math.sin(cursor.x * Math.PI) * 3
    camera.position.z = Math.cos(cursor.x * Math.PI) * 3
    camera.position.y = cursor.y * 5
    camera.lookAt(new THREE.Vector3())
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

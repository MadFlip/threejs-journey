import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'

// Scene
const scene = new THREE.Scene()

// Group
const group = new THREE.Group()
group.position.y = -1
group.scale.set(.5, 1, .5)
group.rotation.y = 1
scene.add(group)

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 'tomato' })
)

cube1.position.x = -1.2

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.8, 1),
    new THREE.MeshBasicMaterial({ color: 'DeepSkyBlue' })
)

cube2.position.y = -.1

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.6, 1),
    new THREE.MeshBasicMaterial({ color: 'NavajoWhite' })
)
cube3.position.x = 1.2
cube3.position.y = -.2

group.add(cube1, cube2, cube3)

// Axes helper
// const axesHelper = new THREE.AxesHelper(1)
// scene.add(axesHelper)

// Camera
// const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100)
const aspectRatio = window.innerWidth / window.innerHeight
const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1, 100)
camera.position.set(4, 4, 4)
camera.lookAt(group.position)
scene.add(camera)


// Renderer
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({
    canvas // canvas: canvas
})

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.render(scene, camera)

// gsap.to(cube1.position, { duration: 1, delay: .1, z: 1 })
// gsap.to(cube2.position, { duration: 1, delay: .2, z: 1 })
// gsap.to(cube3.position, { duration: 1, delay: .3, z: 1 })

// gsap.to(cube1.position, { duration: 1, delay: .6, z: 0 })
// gsap.to(cube2.position, { duration: 1, delay: .7, z: 0 })
// gsap.to(cube3.position, { duration: 1, delay: .8, z: 0 })

const clock = new THREE.Clock()

const tick = () => {
    // Make objects rotate at the same speed regardless of the frame rate
    const elapsedTime = clock.getElapsedTime()

    // Update objects

    group.rotation.y = elapsedTime
    
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
})

import './style.css'
import * as THREE from 'three'

// Scene
const scene = new THREE.Scene()

// Group
const group = new THREE.Group()
group.position.y = 1.2
group.scale.y = 2
group.rotation.y = 1
scene.add(group)

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 'tomato' })
)
const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 'DeepSkyBlue' })
)
cube2.position.x = -1.2

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 'NavajoWhite' })
)
cube3.position.x = 1.2

group.add(cube1, cube2, cube3)

// Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 'MediumAquamarine' })
const cube = new THREE.Mesh(geometry, material)

// Position and scale
cube.position.set(.7, -0.3, 1)
cube.scale.set(.5, .5, .5)

// Rotation
cube.rotation.reorder('YXZ')
cube.rotation.x = Math.PI * 0.25
cube.rotation.y = Math.PI * 0.25
scene.add(cube)

// Axes helper
const axesHelper = new THREE.AxesHelper(1)
scene.add(axesHelper)

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight)
camera.position.set(0, 0, 4)
scene.add(camera)
camera.lookAt(group.position)

// Renderer
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({
    canvas // canvas: canvas
})

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.render(scene, camera)

const clock = new THREE.Clock()

const tick = () => {
    // Make objects rotate at the same speed regardless of the frame rate
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    group.rotation.y = elapsedTime
    cube.rotation.y = elapsedTime
    cube.rotation.x = elapsedTime

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

import './style.css'
import * as THREE from 'three'

// Cursor
const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / window.innerWidth - 0.5
    cursor.y = -(event.clientY / window.innerHeight - 0.5)

    console.log(cursor.x, cursor.y)
})

// Scene
const scene = new THREE.Scene()

// Group
const group = new THREE.Group()
group.scale.set(.5, 1, .5)
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

// Camera
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(0, 0, 4)
scene.add(camera)

// Renderer
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({
    canvas // canvas: canvas
})

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.render(scene, camera)

// const clock = new THREE.Clock()

const tick = () => {
    // const elapsedTime = clock.getElapsedTime()

    camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
    camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
    camera.position.y = cursor.y * 5

    camera.lookAt(group.position)
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
})

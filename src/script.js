import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import * as CANNON from 'cannon-es'
/**
 * Debug
 */

const gui = new dat.GUI()
const debugObject = {}
debugObject.createSphere = () => {
    createSphere(Math.random() * 0.5, {
        x: (Math.random() - 0.5) * 3,
        y: 3,
        z: (Math.random() - 0.5) * 3
    })
}
gui.add(debugObject, 'createSphere')

debugObject.createBox = () => {
    const randomSize = Math.random()
    createBox(
       randomSize,
       randomSize,
       randomSize,
        {
            x: (Math.random() - 0.5) * 3,
            y: 3,
            z: (Math.random() - 0.5) * 3
        }
    )
}
gui.add(debugObject, 'createBox')

debugObject.createPyramid = () => {
    const randomSize = Math.random()
    createPyramid(
        randomSize * 0.5,
        {
            x: (Math.random() - 0.5) * 3,
            y: 3,
            z: (Math.random() - 0.5) * 3
        }
    )
}
gui.add(debugObject, 'createPyramid')

debugObject.reset = () => {
    for(const object of objectsToUpdate) {
        // Remove body
        object.body.removeEventListener('collide', playHitSound)
        world.removeBody(object.body)

        // Remove mesh
        scene.remove(object.mesh)
    }

    objectsToUpdate.splice(0, objectsToUpdate.length)
}
gui.add(debugObject, 'reset')

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// enable fog
scene.fog = new THREE.Fog('#e8f2ff', 0.5, 12)


/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

// Sounds
const hitSound = new Audio('/sounds/hit.mp3')

const playHitSound = (collision) => {
    const impactStrength = collision.contact.getImpactVelocityAlongNormal()

    if(impactStrength > 1.5)
    {
        hitSound.volume = impactStrength / 10 * Math.random()
        hitSound.currentTime = 0
        hitSound.play()
    }
}



// Physics
const world = new CANNON.World()
// -9,82 m/s² - Earth gravity
// -1,62 m/s² - Moon gravity
world.gravity.set(0, -9.82, 0)

/**
 * Performance
 */

// Broadphase SAP (Sweep and Prune) is a good default choice for most cases and is fast.
// Improves performance by not checking every object against every other object.
world.broadphase = new CANNON.SAPBroadphase(world)

// When the Body speed gets incredibly slow (at a point where you can't see it moving), 
// the Body can fall asleep and won't be tested unless a sufficient force is applied to it by code or if another Body hits it.
world.allowSleep = true

// Physics material
const defaultMaterial = new CANNON.Material('default')
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.1,
        restitution: 0.7
    }
)
world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial


// Floor
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.mass = 0
floorBody.addShape(floorShape)
// Rotate plane in cannon.js uses quaternion
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)
world.addBody(floorBody)

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const sphereMaterial = new THREE.MeshLambertMaterial({
    color: new THREE.Color("silver"),
    emissive: new THREE.Color('#2C374E')
})

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshLambertMaterial({
    color: new THREE.Color("silver"),
    emissive: new THREE.Color('#2C374E')
})

const pyramidSegments = 4
// don't put top radius to 0, it will break collision detection
const pyramidGeometry = new THREE.CylinderGeometry(0.01, 1, 1, pyramidSegments)
const pyramidMaterial = new THREE.MeshLambertMaterial({
    color: new THREE.Color("silver"),
    emissive: new THREE.Color('#2C374E')
})

// Utils
const objectsToUpdate = []

const createSphere = (radius, position) => {
    const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
    mesh.castShadow = true
    mesh.scale.set(radius, radius, radius)
    mesh.position.copy(position)
    scene.add(mesh)
    
    // Physics
    const shape = new CANNON.Sphere(radius)
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: shape,
        material: defaultMaterial
    })
    body.position.copy(position)
    world.addBody(body)

    // objectsToUpdate.push({
    //     mesh: mesh,
    //     body: body
    // })
    // |
    // |
    // V
    objectsToUpdate.push({mesh, body})
    body.addEventListener('collide', playHitSound)
}

const createBox = (width, height, depth, position) => {
    const mesh = new THREE.Mesh(boxGeometry, boxMaterial)
    mesh.scale.set(width, height, depth)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    // Cannon.js body
    const shape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2))
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: shape,
        material: defaultMaterial
    })
    body.position.copy(position)
    world.addBody(body)

    // Save in object
    objectsToUpdate.push({mesh, body})
    body.addEventListener('collide', playHitSound)
}

const createPyramid = (radius, position) => {
    const mesh = new THREE.Mesh(pyramidGeometry, pyramidMaterial)
    // mesh.rotateX(Math.PI / 2)
    mesh.castShadow = true
    mesh.scale.set(radius, radius, radius)
    mesh.position.copy(position)
    scene.add(mesh)

    // Cannon.js body
    const shape = new CANNON.Cylinder(0.01, radius, radius, pyramidSegments)
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: shape,
        material: defaultMaterial
    })
    body.position.copy(position)
    world.addBody(body)

    // Save in object
    objectsToUpdate.push({mesh, body})
    body.addEventListener('collide', playHitSound)
}
    
    /**
     * Floor
     */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshLambertMaterial({
        color: new THREE.Color("silver"),
        emissive: new THREE.Color('#4B5568')
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

// createSphere(0.5, { x: 0, y: 3, z: 0 })
// createBox(1, 1, 1, {x: 0, y: 3, z: 0})
createPyramid(1, {x: 2, y: 3, z: 0})
/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
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
    width: window.innerWidth - 40,
    height: window.innerHeight - 40
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth - 40    
    sizes.height = window.innerHeight - 40

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
const camera = new THREE.PerspectiveCamera(55, sizes.width / sizes.height, 0.1, 100)
camera.position.set(- 3, 3, 3)
camera.lookAt(new THREE.Vector3(0, 0, 0))
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
//disable zoom
controls.enableZoom = false
//disable pan
controls.enablePan = false
// limits the camera to not go below the floor
// controls.minPolarAngle = Math.PI / 2
controls.maxPolarAngle = Math.PI / 2 - 0.2

controls.autoRotate = true
controls.autoRotateSpeed = 5

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
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
let oldElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    // Update physics world
    world.step(1 / 60, deltaTime, 3)

    for(const object of objectsToUpdate) {
        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

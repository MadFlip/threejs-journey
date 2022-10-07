import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import * as CANNON from 'cannon-es'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import CannonDebugger from 'cannon-es-debugger'

/**
 * Debug
 */

const gui = new dat.GUI()
gui.hide()

const debugObject = {}
debugObject.createSphere = () => {
    createSphere(
        Math.random() / 2 + 0.2, 
        {
        x: (Math.random() - 0.5) * 3,
        y: 3,
        z: (Math.random() - 0.5) * 3
    })
}

debugObject.createBox = () => {
    const randomSize = Math.random() + 0.1
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

debugObject.createPyramid = () => {
    const randomSize = Math.random() + 0.5
    createPyramid(
        randomSize * 0.5,
        {
            x: (Math.random() - 0.5) * 3,
            y: 3,
            z: (Math.random() - 0.5) * 3
        }
    )
}

debugObject.reset = () => {
    for(const object of objectsToUpdate) {
        if (object.mesh.geometry.type !== 'TextGeometry') {
            // Remove body
            object.body.removeEventListener('collide', playHitSound)
            world.removeBody(object.body)

            // Remove mesh
            scene.remove(object.mesh)
        }
    }

    // empty array
    // objectsToUpdate.splice(0, objectsToUpdate.length)

    // remove from objectsToUpdate only not textGeometry
    objectsToUpdate.filter(object => object.mesh.geometry.type === 'TextGeometry')
}

const buttonAddSphere = document.querySelector('[data-add-spere]')
const buttonAddBox = document.querySelector('[data-add-box]')
const buttonAddPyramid = document.querySelector('[data-add-pyramid]')
const buttinReset = document.querySelector('[data-clear-scene]')

buttonAddSphere.addEventListener('click', () => {
    debugObject.createSphere()
})

buttonAddBox.addEventListener('click', () => {
    debugObject.createBox()
})

buttonAddPyramid.addEventListener('click', () => {
    debugObject.createPyramid()
})

buttinReset.addEventListener('click', () => {
    debugObject.reset()
})

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// enable fog
scene.fog = new THREE.Fog('#4792ff', 0.5, 14)

// Sounds
const hitSound = new Audio('/sounds/hit.mp3')

const playHitSound = (collision) => {
    const impactStrength = collision.contact.getImpactVelocityAlongNormal()
    if (impactStrength > 1.5) {
        hitSound.volume = Math.random()
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
    color: new THREE.Color('#2effdc'),
    emissive: new THREE.Color('#04342c')
})
gui.addColor(sphereMaterial, 'color').name('Sphere Color')
gui.addColor(sphereMaterial, 'emissive').name('Sphere Emissive')

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshLambertMaterial({
    color: new THREE.Color("#ffffff"),
    emissive: new THREE.Color('#353a4b')
})
gui.addColor(boxMaterial, 'color').name('Box Color')
gui.addColor(boxMaterial, 'emissive').name('Box Emissive')

const pyramidSegments = 3
// don't put top radius to 0, it will break collision detection
const pyramidGeometry = new THREE.CylinderGeometry(0.005, 1, 1, pyramidSegments)
const pyramidMaterial = new THREE.MeshLambertMaterial({
    color: new THREE.Color('#0856af'),
    emissive: new THREE.Color('#07144b'),
    side: THREE.DoubleSide
})
gui.addColor(pyramidMaterial, 'color').name('Pyramid Color')
gui.addColor(pyramidMaterial, 'emissive').name('Pyramid Emissive')

const textMaterial = new THREE.MeshLambertMaterial({
    color: new THREE.Color('#0856af'),
    emissive: new THREE.Color('#12205e'),
    side: THREE.DoubleSide
})
gui.addColor(textMaterial, 'color').name('Text Color')
gui.addColor(textMaterial, 'emissive').name('Text Emissive')

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
    const shape = new CANNON.Cylinder(0.005, radius, radius, pyramidSegments)
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

const fontLoader = new FontLoader()
const textOptions = (font) => {
    return {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 16,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 8,
    }
}

const yh = 0.5

fontLoader.load(
    '/fonts/titillium_web_semi_bold.json',
    (font) => {
        const textGroup = new THREE.Group()
        const geometryB = new TextGeometry('B', textOptions(font))
        geometryB.center()
        const textB = new THREE.Mesh(geometryB, textMaterial)
        textB.position.y = yh
        textB.position.x = -1.5
        textB.castShadow = true

        const geometryL = new TextGeometry('l', textOptions(font))
        geometryL.center()
        const textL = new THREE.Mesh(geometryL, textMaterial)
        textL.position.y = yh
        textL.position.x = -1.24
        textL.castShadow = true
        
        const geometryE = new TextGeometry('e', textOptions(font))
        geometryE.center()
        const textE = new THREE.Mesh(geometryE, textMaterial)
        const textE2 = new THREE.Mesh(geometryE, textMaterial)
        textE.position.y = yh - 0.06
        textE.position.x = -0.9
        textE2.position.y = yh - 0.06
        textE2.position.x = -0.5
        textE.castShadow = true
        textE2.castShadow = true
        
        const geometryC = new TextGeometry('c', textOptions(font))
        geometryC.center()
        const textC = new THREE.Mesh(geometryC, textMaterial)
        textC.position.y = yh - 0.06
        textC.position.x = -0.12
        textC.castShadow = true

        const geometryH = new TextGeometry('h', textOptions(font))
        geometryH.center()
        const textH = new THREE.Mesh(geometryH, textMaterial)
        textH.position.y = yh
        textH.position.x = 0.25
        textH.castShadow = true

        textGroup.add(textB, textL, textE, textE2, textC, textH)

        // show text bounding box
        const boxB = new THREE.Box3().setFromObject(textB)
        const boxL = new THREE.Box3().setFromObject(textL)
        const boxE = new THREE.Box3().setFromObject(textE)
        const boxE2 = new THREE.Box3().setFromObject(textE2)
        const boxC = new THREE.Box3().setFromObject(textC)
        const boxH = new THREE.Box3().setFromObject(textH)
        
        // get box width, height and depth
        const {x: widthB, y: heightB, z: depthB} = boxB.getSize(new THREE.Vector3())
        const {x: widthL, y: heightL, z: depthL} = boxL.getSize(new THREE.Vector3())
        const {x: widthE, y: heightE, z: depthE} = boxE.getSize(new THREE.Vector3())
        const {x: widthE2, y: heightE2, z: depthE2} = boxE2.getSize(new THREE.Vector3())
        const {x: widthC, y: heightC, z: depthC} = boxC.getSize(new THREE.Vector3())
        const {x: widthH, y: heightH, z: depthH} = boxH.getSize(new THREE.Vector3())

        // get box coordinates
        const {x: xB, y: yB, z: zB} = boxB.getCenter(new THREE.Vector3())
        const {x: xL, y: yL, z: zL} = boxL.getCenter(new THREE.Vector3())
        const {x: xE, y: yE, z: zE} = boxE.getCenter(new THREE.Vector3())
        const {x: xE2, y: yE2, z: zE2} = boxE2.getCenter(new THREE.Vector3())
        const {x: xC, y: yC, z: zC} = boxC.getCenter(new THREE.Vector3())
        const {x: xH, y: yH, z: zH} = boxH.getCenter(new THREE.Vector3())

        scene.add(textGroup)

        // Cannon.js body
        const shapeB = new CANNON.Box(new CANNON.Vec3(widthB / 2, heightB / 2, depthB / 2))
        const bodyB = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(xB, yB, zB),
            shape: shapeB,
            material: defaultMaterial
        })
        bodyB.position.copy(textB.position)
        bodyB.addEventListener('collide', playHitSound)

        const shapeL = new CANNON.Box(new CANNON.Vec3(widthL / 2, heightL / 2, depthL / 2))
        const bodyL = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(xL, yL, zL),
            shape: shapeL,
            material: defaultMaterial
        })
        bodyL.position.copy(textL.position)
        bodyL.addEventListener('collide', playHitSound)

        const shapeE = new CANNON.Box(new CANNON.Vec3(widthE / 2, heightE / 2, depthE / 2))
        const bodyE = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(xE, yE, zE),
            shape: shapeE,
            material: defaultMaterial
        })
        bodyE.position.copy(textE.position)
        bodyE.addEventListener('collide', playHitSound)

        const shapeE2 = new CANNON.Box(new CANNON.Vec3(widthE2 / 2, heightE2 / 2, depthE2 / 2))
        const bodyE2 = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(xE2, yE2, zE2),
            shape: shapeE2,
            material: defaultMaterial
        })
        bodyE2.position.copy(textE2.position)
        bodyE2.addEventListener('collide', playHitSound)

        const shapeC = new CANNON.Box(new CANNON.Vec3(widthC / 2, heightC / 2, depthC / 2))
        const bodyC = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(xC, yC, zC),
            shape: shapeC,
            material: defaultMaterial
        })
        bodyC.position.copy(textC.position)
        bodyC.addEventListener('collide', playHitSound)

        const shapeH = new CANNON.Box(new CANNON.Vec3(widthH / 2, heightH / 2, depthH / 2))
        const bodyH = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(xH, yH, zH),
            shape: shapeH,
            material: defaultMaterial
        })
        bodyH.position.copy(textH.position)
        bodyH.addEventListener('collide', playHitSound)

        world.addBody(bodyB)
        world.addBody(bodyL)
        world.addBody(bodyE)
        world.addBody(bodyE2)
        world.addBody(bodyC)
        world.addBody(bodyH)

        objectsToUpdate.push({
            mesh: textB,
            body: bodyB
        })

        objectsToUpdate.push({
            mesh: textL,
            body: bodyL
        })

        objectsToUpdate.push({
            mesh: textE,
            body: bodyE
        })

        objectsToUpdate.push({
            mesh: textE2,
            body: bodyE2
        })

        objectsToUpdate.push({
            mesh: textC,
            body: bodyC
        })

        objectsToUpdate.push({
            mesh: textH,
            body: bodyH
        })
    }
)

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(15, 15),
    new THREE.MeshLambertMaterial({
        color: new THREE.Color('#3c6ff2'),
        emissive: new THREE.Color('#15378e')
    })
)
gui.addColor(floor.material, 'color').name('Floor Color')
gui.addColor(floor.material, 'emissive').name('Floor Emissive')

floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

// createSphere(0.5, { x: 0, y: 3, z: 0 })
// createBox(1, 1, 1, {x: 0, y: 3, z: 0})
// createPyramid(1, {x: 2, y: 3, z: 0})
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
camera.position.set(2, 1, 4)
camera.lookAt(new THREE.Vector3(0, 0, 0))
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
//disable zoom
// controls.enableZoom = false
//disable pan
controls.enablePan = false
// limits the camera to not go below the floor
controls.maxPolarAngle = Math.PI / 2 - 0.2
// limit zoom
controls.minDistance = 3
controls.maxDistance = 8 

controls.autoRotate = true
controls.autoRotateSpeed = 2

// make auto rotate half circle forward and backward
controls.minAzimuthAngle = -Math.PI / 2 + 0.2
controls.maxAzimuthAngle = Math.PI / 2 - 0.2

// check if the camera reached the limits change the direction



// change auto rotate direction


// controls.autoRotate = true
// controls.autoRotateSpeed = 5

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


const cannonDebugger = new CannonDebugger(scene, world)
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

    for (const object of objectsToUpdate) {
        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion)
    }
    // cannonDebugger.update()
    // Update controls
    controls.update()
    if (controls.getAzimuthalAngle() === -Math.PI / 2 + 0.2) {
        controls.autoRotateSpeed *= -1
    } else if (controls.getAzimuthalAngle() === Math.PI / 2 - 0.2) {
        controls.autoRotateSpeed = 2
    }
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

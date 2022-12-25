const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)

// INIT CAMERA
cam.position.z = 50;
cam.position.x = 0;
cam.position.y = 0;

//INIT HEMISPHERE LIGHT
scene.add(new THREE.AmbientLight(0xffffff, 0.5))

//Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// RESIZING HANDLER

function onWindowResize() {
    cam.aspect = window.innerWidth / window.innerHeight;
    cam.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);

//Orbit Controller
const controls = new THREE.OrbitControls(cam, renderer.domElement);
controls.update();

//POINT LIGHT
const light1 = new THREE.PointLight(0xff6666, 1, 100)
light1.castShadow = true;
light1.shadow.mapSize.width = 4096;
light1.shadow.mapSize.height = 4096;
scene.add(light1)

//BACKGROUND COLOR
scene.background = new THREE.Color("rgb(254, 0, 254)")

//PARTICLES
const particlesGeometry = new THREE.BufferGeometry;
const particlesCount = 5000

const positionArr = new Float32Array(particlesCount * 3)

// Add some random particle positions
for (let i = 0; i < particlesCount * 3; i++) {
    positionArr[i] = (Math.random() - 0.5) * 50 //centerilization
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArr, 3))
    // Set up the particle material
const particlesMaterial = new THREE.PointsMaterial({
    color: 0xffe1fa,
    size: 0.1,
});

// Create the particle system
const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);


//adding the particles to the scene
scene.add(particleSystem)


//TEXT LOADING
const l = new THREE.FontLoader()
l.load("../fonts/Dark Magic_Regular.json", function(font) {
    const color = new THREE.Color(0x006699);

    const matDark = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide
    });

    const matLite = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide
    });

    readJson("./assets/quotes.json", data => {
        var jsonObject = JSON.parse(data);
        var randomizer = Math.ceil(Math.random() * jsonObject.quotes.length)
        for (var i = 0; i < jsonObject.quotes.length; i++) {
            console.log(randomizer)
            var q = jsonObject.quotes[i];
            var r = jsonObject.quotes[randomizer]
            if (q === r) {
                const message = r.quote + "\n" + r.author;
                const shapes = font.generateShapes(message, 2);

                const geometry = new THREE.ShapeGeometry(shapes);

                geometry.computeBoundingBox();

                const xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);

                geometry.translate(xMid, 0, xMid);
                console.log(xMid)
                cam.lookAt(xMid, 0, -70)
                cam.fov = 5
                    // make shape ( N.B. edge view not visible )

                const text = new THREE.Mesh(geometry, matDark);
                const text1 = new THREE.Mesh(geometry, matLite)
                text1.position.z = text.position.z - 0.1;
                text1.position.y = text.position.y + 0.1;
                text1.position.x = text.position.x - 0.1;
                cam.position.x = text.position.x
                cam.position.y = text.position.y
                cam.position.z = text.position.z + 30
                scene.add(text, text1)
            }
        }
    })

})



//ANIMATE
function draw() {
    renderer.render(scene, cam)
    particleSystem.rotation.y += .0005
    particleSystem.rotation.x += .0005
    particleSystem.rotation.z += .0005

    controls.update()
    requestAnimationFrame(draw)
}
draw()
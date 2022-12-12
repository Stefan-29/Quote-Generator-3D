const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)

// INIT CAMERA
cam.position.z = 20;
cam.position.x = 0;
cam.position.y = 10;
//cam.lookAt(-10, -20, -50)

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
scene.background = new THREE.Color("rgb(0, 205, 254)")

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
                const shapes = font.generateShapes(message, 5);

                const geometry = new THREE.ShapeGeometry(shapes);

                geometry.computeBoundingBox();

                const xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);

                geometry.translate(xMid, 0, 0);

                // make shape ( N.B. edge view not visible )

                const text = new THREE.Mesh(geometry, matDark);
                const text1 = new THREE.Mesh(geometry, matLite)
                text.position.z = -100;
                scene.add(text);
                scene.add(text1)


            }
        }
    })

})

//ANIMATE
function draw() {
    renderer.render(scene, cam)
    controls.update()
    requestAnimationFrame(draw)
}
draw();
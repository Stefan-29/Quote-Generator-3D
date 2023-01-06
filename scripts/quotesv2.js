const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)

// INIT CAMERA
cam.position.z = 70;
cam.position.x = 0;
cam.position.y = 0;
cam.rotation.y = Math.PI * 0.1;


//INIT AMBIENT LIGHT
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

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
// Add point lights to the scene
const light1 = new THREE.PointLight(0xff6666, 1, 100);
light1.castShadow = true;
light1.shadow.mapSize.width = 4096;
light1.shadow.mapSize.height = 4096;
scene.add(light1);

const light2 = new THREE.PointLight(0x66ff66, 1, 100);
light2.castShadow = true;
light2.shadow.mapSize.width = 4096;
light2.shadow.mapSize.height = 4096;
scene.add(light2);
//BACKGROUND COLOR
scene.background = new THREE.Color("rgb(165, 42, 42)")

//PARTICLES
const particlesGeometry = new THREE.BufferGeometry;
const particlesCount = 5000

const positionArr = new Float32Array(particlesCount * 3)

// Add some random particle positions
for (let i = 0; i < particlesCount * 3; i++) {
    positionArr[i] = (Math.random() - 0.5) * 75 //centerilization
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArr, 3))
    // Set up the particle material
const particlesMaterial = new THREE.PointsMaterial({
    color: 0xffe1fa,
    size: 0.15,
});

// Create the particle system
const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);


//adding the particles to the scene
scene.add(particleSystem)

//GROUP 
// Define group
const group = new THREE.Group();

//LOADING BOOK MODEL
let book;
const loader = new THREE.GLTFLoader();

loader.load('./assets/book/scene.gltf', (gltf) => {
    book = gltf.scene;

    // Add textures to the book
    const bookDiaryMaterial = new THREE.MeshStandardMaterial({
        map: new THREE.TextureLoader().load('./assets/book/textures/Book_Diary_baseColor.png'),
        roughnessMap: new THREE.TextureLoader().load('./assets/book/textures/Book_Diary_metallicRoughness.png'),
        normalMap: new THREE.TextureLoader().load('./assets/book/textures/Book_Diary_normal.png'),
    });
    const bookPagesMaterial = new THREE.MeshStandardMaterial({
        map: new THREE.TextureLoader().load('./assets/book/textures/Book_Pages_baseColor.png'),
        roughnessMap: new THREE.TextureLoader().load('./assets/book/textures/Book_Pages_metallicRoughness.png'),
        normalMap: new THREE.TextureLoader().load('./assets/book/textures/Book_Pages_normal.png'),
    });
    const bookTapaMaterial = new THREE.MeshStandardMaterial({
        map: new THREE.TextureLoader().load('./assets/book/textures/Book_Tapa_baseColor.png'),
        roughnessMap: new THREE.TextureLoader().load('./assets/book/textures/Book_Tapa_metallicRoughness.png'),
        normalMap: new THREE.TextureLoader().load('./assets/book/textures/Book_Tapa_normal.png'),
    });
    const starsMaterial = new THREE.MeshStandardMaterial({
        map: new THREE.TextureLoader().load('./assets/book/textures/Stars_baseColor.png'),
        emissiveMap: new THREE.TextureLoader().load('./assets/book/textures/Stars_emissive.png'),
    });

    // Set materials for each object in the book model
    const bookDiary = book.getObjectByName('Book_Diary');
    if (bookDiary) {
        bookDiary.material = bookDiaryMaterial;
    }

    const bookPages = book.getObjectByName('Book_Pages');
    if (bookPages) {
        bookPages.material = bookPagesMaterial;
    }

    const bookTapa = book.getObjectByName('Book_Tapa');
    if (bookTapa) {
        bookTapa.material = bookTapaMaterial;
    }

    const stars = book.getObjectByName('Stars');
    if (stars) {
        stars.material = starsMaterial;
    }

    book.position.z = 0; // position the book 10 units behind the text
    book.position.y = -8;
    book.position.x = -5;
    book.receiveShadow = true;
    // Add book to the scene
    scene.add(book);
}, function(xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
}, function(error) {
    console.error(error);
});



//TEXT LOADING
const l = new THREE.FontLoader()
l.load("./fonts/Dark Magic_Regular.json", function(font) {
    const color = new THREE.Color(0x3c2a21);

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
                const geometry = new THREE.ShapeBufferGeometry(shapes);
                geometry.computeBoundingBox();
                const xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
                geometry.translate(xMid, 0, 0);

                // make shape ( N.B. edge view not visible )
                const text = new THREE.Mesh(geometry, matLite);
                text.position.z = 7.9; // position the text 10 units in front of the book
                text.position.x = 0; // move the text 5 units to the left
                text.position.y = 2; // move the text 5 units up
                text.rotation.x = Math.PI * -0.1;
                text.rotation.y = Math.PI * 0.1;
                // Add text mesh to group
                group.add(text);

                // make line shape ( N.B. dark material )
                const holeShapes = [];
                for (let j = 0; j < shapes.length; j++) {
                    const shape = shapes[j];
                    if (shape.holes && shape.holes.length > 0) {
                        for (let k = 0; k < shape.holes.length; k++) {
                            holeShapes.push(shape.holes[k]);
                        }
                    }
                }
                shapes.push.apply(shapes, holeShapes);
                const lineText = new THREE.Object3D();
                for (let j = 0; j < shapes.length; j++) {
                    const shape = shapes[j];
                    const points = shape.getPoints();
                    const geometry = new THREE.BufferGeometry().setFromPoints(points);
                    geometry.translate(xMid, 0, 0);
                    const lineMesh = new THREE.Line(geometry, matDark);
                    lineText.add(lineMesh);
                }
                lineText.position.z = 8;
                lineText.position.y = 2;
                lineText.position.x = 0;
                lineText.rotation.x = Math.PI * -0.1;
                lineText.rotation.y = Math.PI * 0.1;

                // Add line text mesh to group
                group.add(lineText);
            }
        }

    });
    //Add the group to the scene
    scene.add(group);
    renderer.render(scene, cam);
});

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, cam);
    controls.update();
    particleSystem.rotation.x += 0.001;
    particleSystem.rotation.y += 0.001;
    light1.position.x = cam.position.x;
    light1.position.y = cam.position.y;
    light1.position.z = cam.position.z;
}

animate();
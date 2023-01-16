const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 1, 100);

camera.position.z = -5
camera.position.y = 2
camera.position.x = 3

const renderer = new THREE.WebGLRenderer({alpha:true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', (evt)=>{
    cam.aspect = window.innerWidth / window.innerHeight;
    cam.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const controls = new THREE.OrbitControls(camera,renderer.domElement);
controls.update();


const map = new THREE.GLTFLoader();
map.load('assets/library/scene.gltf', function (gltf) {
    gltf.scene.scale.set(1,1,1);
    gltf.scene.position.y = 0;
    gltf.scene.position.z = 0;

    scene.add(gltf.scene);
},function (xhr) {
    console.log((xhr.loaded/xhr.total*100)+'% loaded');
}, function (error) {
    console.error(error);
});


function draw() {
    requestAnimationFrame(draw);
    renderer.render(scene, camera);
    controls.update();
}
draw();
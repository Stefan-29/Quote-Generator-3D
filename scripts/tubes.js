const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 100);

camera.position.z = -5
camera.position.y = 2
camera.position.x = -5

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
document.body.appendChild(renderer.domElement);

document.getElementById('myAudio').play();

window.addEventListener('resize', (e) => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

let controls = new THREE.PointerLockControls(camera, renderer.domElement);
let clock = new THREE.Clock();

const direction = new THREE.Vector3();

let animation;
let mixer;
let action;

const map = new THREE.GLTFLoader();
map.load('assets/library/scene.gltf', function (gltf) {
    animation = gltf.animations;
    mixer = new THREE.AnimationMixer(gltf.scene);
    
    console.log(mixer);
    let action = mixer.clipAction(animation[0]);
    action.play();

    gltf.scene.scale.set(1, 1, 1);
    gltf.scene.position.y = 0;
    gltf.scene.position.z = 0;

    scene.add(gltf.scene);
}, function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
}, function (error) {
    console.error(error);
});
const light = new THREE.SpotLight( 0xffffff, 100, 100000 );
const helper = new THREE.PointLightHelper(light);
light.intensity = 100000;
light.position.set( 0, 10, 4 );
// light.castShadow = true; // default false
scene.add(light);
// scene.add(helper);




var keyboard = [];
    addEventListener('keydown', (e) => {
        if (e.key=='q') {
            document.location = 'Quote_Generator.html'
        }
        keyboard[e.key] = true;
    });
    addEventListener('keyup', (e) => {
        keyboard[e.key] = false;
    });
    addEventListener( 'click', function () {

        controls.lock();

    } );

    function process_keyboard(delta) {
        let speed = 5;
        let actualSpeed = speed * delta;
        if (keyboard['a']) {
            controls.moveRight(-actualSpeed);
        }
        if (keyboard['d']) {
            controls.moveRight(actualSpeed);

        }
        if (keyboard['w']) {
            controls.moveForward(actualSpeed);
        }
        if (keyboard['s']) {
            controls.moveForward(-actualSpeed);
        }
        if (keyboard[' ']) {
            controls.getObject().position.y += actualSpeed;
        }
        if (keyboard['c']) {
            controls.getObject().position.y -= actualSpeed;
        }
    }
    



function draw() {
    let delta = clock.getDelta();
    
    process_keyboard(delta);
    if(mixer) {
        mixer.update(delta);
    }
    requestAnimationFrame(draw);
    renderer.render(scene, camera);
}
draw();
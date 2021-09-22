import './style.css'

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// scene
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, .01, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
})

renderer.setPixelRatio( window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render( scene, camera );

// doughnut
const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
const material = new THREE.MeshStandardMaterial( { color: 0xff6347 } );
const torus = new THREE.Mesh( geometry, material );

scene.add(torus);

// lighting
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(5,0,0)

const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(pointLight, ambientLight)

// helpers & OrbitControls
const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 50);

const controls = new OrbitControls(camera, renderer.domElement);

// stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial( { color: 0xffffff })
  const star = new THREE.Mesh( geometry, material );

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread ( 100 ) );

  star.position.set(x,y,z);
  scene.add(star)
}

Array(200).fill().forEach(addStar)

// background
const spaceTexture = new THREE.TextureLoader().load('space.jpg')
scene.background = spaceTexture;

// bev on a wheel on a box
const pictureBox = new THREE.TextureLoader().load('bevonwheel.jpg')

const bev = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial( { map: pictureBox })
);
scene.add(bev)

// mars
const marsTexture = new THREE.TextureLoader().load('marsmap4k.jpg');
const normalTexture = new THREE.TextureLoader().load('marsnormal2k.jpg');

const mars = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial( {
    map: marsTexture,
    normalMap: normalTexture
  } )
);
scene.add(mars)

mars.position.z = 12;
mars.position.setX(-10);

// scrolling camera
function moveCamera() {

  const t = document.body.getBoundingClientRect().top;
  mars.rotation.x += 0.05;
  mars.rotation.y += 0.075;
  mars.rotation.z += 0.05;

  bev.rotation.y = t * -0.01;
  bev.rotation.z = t * -0.0002;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}

document.body.onscroll = moveCamera

// animation loop
function animate() {
  requestAnimationFrame( animate );

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.y += 0.01;


  renderer.render( scene, camera );
}

animate()

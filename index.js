import './style.css';

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, .01, 1000 );

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
})

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.setY(2);
camera.position.setZ(20);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5,5,5);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add( pointLight, ambientLight );

const geometry = new THREE.TorusGeometry( 10, 0.25, 20, 100 );
const material = new THREE.MeshStandardMaterial( { color: 0xFFD700 } );
const torus = new THREE.Mesh( geometry, material );
torus.position.setX(13);
scene.add( torus );

const AVATAR_Rotate = new THREE.Object3D();
const loader = new GLTFLoader();
loader.load( '/avatar.glb', function ( gltf ) {
  const avatar = gltf.scene;
  const box = new THREE.Box3( ).setFromObject( avatar );
  const c = box.getCenter( new THREE.Vector3( ) );
  const size = box.getSize( new THREE.Vector3( ) ); 
  avatar.position.set( -c.x, size.y / 2 - c.y, -c.z );
  AVATAR_Rotate.add( avatar );
  
  scene.add( AVATAR_Rotate );

  AVATAR_Rotate.position.setX(13);
  AVATAR_Rotate.position.setY(-9);
  AVATAR_Rotate.scale.multiplyScalar(10);
}, undefined, function ( error ) {
	console.error( error );
} );

function addStar() {
  const geometry = new THREE.SphereGeometry(0.2, 20, 20);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 500 ));
  star.position.set(x, y, z);
  scene.add(star);
}

Array(2000).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load( '/space.jpeg' );
scene.background = spaceTexture;

const moonTextureLoader = new THREE.TextureLoader();
const moonGeometry = new THREE.SphereGeometry(8, 30, 30);
const moonMaterial = new THREE.MeshBasicMaterial({ 
  color: 0xffffff,
  map: moonTextureLoader.load( '/moon.jpeg' ),
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);

scene.add(moon);

moon.position.x = -20;
moon.position.y = -10;
moon.position.z = 30;

const torusKnotGeometry = new THREE.TorusKnotGeometry(8, 3, 500, 20, 3, 2);
const torusKnotMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true })
const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial);
torusKnot.position.x = -60;
torusKnot.position.y = 3;
torusKnot.position.z = 75;
torusKnot.rotation.y = 1.5;
scene.add(torusKnot);

const smileyTextureLoader = new THREE.TextureLoader();
const smileyGeometry = new THREE.CircleGeometry(5, 40);
const smileyMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  map: smileyTextureLoader.load( './circle.png' )
});
const smiley = new THREE.Mesh(smileyGeometry, smileyMaterial);
smiley.position.x = -40;
smiley.position.z = 210;
smiley.rotation.y = 2.5;
scene.add(smiley)


function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  moon.rotation.y = t * 0.025;

  camera.position.z = t * -0.025 + 20;
  camera.rotation.y = t * -0.0005;
}

document.body.onscroll = moveCamera;

let time = 1;
function animate() {
  requestAnimationFrame( animate )

  torus.rotation.x += 0.05;
  torus.rotation.y += 0.05;

  AVATAR_Rotate.rotation.y -= 0.005;

  time += 0.1;
  const scalar = Math.sin(time) / 8 + 1.5;
  torusKnot.scale.set(scalar, scalar, scalar);
  torusKnot.rotation.y = scalar;

  smiley.rotation.x = Math.cos(time) / 4 ;

  renderer.render( scene, camera );
}

animate();
import "../subpage.css";
import "../style.scss";
import * as THREE from "three";
import * as dat from "lil-gui";
import gsap from "gsap";
import { GLTFLoader } from "./GLTFLoader.js";
import { FontLoader } from "./FontLoader.js";
//import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "./OrbitControls.js";
//import { TextGeometry } from "TextGeometry.js";

/**
 * Debug
 */
const gui = new dat.GUI();

const parameters = {
  materialColor: "#ffeded",
};


/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
// Texture
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("../static/textures/matcaps/8.png");
const gradientTexture = textureLoader.load("../static/textures/particles/1.png");
gradientTexture.magFilter = THREE.NearestFilter;
const particleTexture = textureLoader.load("../static/textures/particles/1.png");
//particlesMaterial.map = particleTexture;

// Material
const material = new THREE.MeshBasicMaterial({
  color: parameters.materialColor,
  gradientMap: particleTexture,
});
const material2 = new THREE.MeshNormalMaterial({
  color: parameters.materialColor,
  gradientMap: particleTexture,
});
const material3 = new THREE.MeshStandardMaterial({
  color: parameters.materialColor,
  gradientMap: particleTexture,
});

// Objects
const objectsDistance = 4;
const mesh1 = new THREE.Mesh(
  new THREE.TorusGeometry(8, 0.01, 30, 100),
  material
);
const mesh2 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 30, 32), material2);
const mesh3 = new THREE.Mesh(
  new THREE.TorusGeometry(2, 0.01, 30, 100),
  material
);
const mesh4 = new THREE.Mesh(
  new THREE.TorusGeometry(4, 0.01, 30, 100),
  material
);

mesh1.position.x = 0;
mesh2.position.x = 0;
mesh3.position.x = 0;
mesh4.position.x = 0;

mesh1.position.y = -objectsDistance * 0.1;
mesh2.position.y = -objectsDistance * 0.2;
mesh3.position.y = -objectsDistance * 0.2;
mesh4.position.y = -objectsDistance * 0.1;

//mesh1.position.z = -0.5;
//mesh3.position.z = 0.5;

/**
 * Models
 */

const sectionMeshes = [mesh1, mesh2, mesh3];

 

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight("#ffffff", 100);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

/**
 * Particles
 */
// Geometry
const particlesCount = 2000;
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
  positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
  positions[i * 3 + 1] =
    objectsDistance * 0.5 -
    Math.random() * objectsDistance * sectionMeshes.length;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

// Material
const particlesMaterial = new THREE.PointsMaterial({
  color: parameters.materialColor,
  sizeAttenuation: textureLoader,
  size: 0.03,
});

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
//scene.add(particles);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Group
const cameraGroup = new THREE.Group();
//scene.add(cameraGroup);

// Base camera
const camera = new THREE.PerspectiveCamera(
  50,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.y = -0.4;
camera.position.z = 7;
camera.rotation.x = Math.PI / 2;
//cameraGroup.add(camera);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;


  // Animate particle

  //particles.rotation.x += deltaTime * 0.5;
  particles.rotation.y += deltaTime * 0.07;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};


tick();

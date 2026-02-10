import * as THREE from 'three';

export const setupScene = () => {
  const canvas = document.querySelector('#webgl');

  // Scene
  const scene = new THREE.Scene();
  // FORCE a solid background color (Fixes the glitching/smearing)
  scene.background = new THREE.Color('#050505'); 
  scene.fog = new THREE.FogExp2('#050505', 0.05);

  // Camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 6;

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true, // Smoothes jagged edges
    alpha: false,     // DISABLE transparency (Crucial fix)
    powerPreference: "high-performance",
    stencil: false,
    depth: true
  });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 

  // Handle Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  return { scene, camera, renderer };
};
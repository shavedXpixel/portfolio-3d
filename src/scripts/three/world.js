import * as THREE from 'three';

export const createWorld = (scene) => {
  // 1. Hero Object: Abstract Wireframe Shape
  const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
  // MeshPhysicalMaterial reacts to light realistically
  const material = new THREE.MeshPhysicalMaterial({
    color: '#00f3ff', // Cyan
    roughness: 0,
    metalness: 0.5,
    wireframe: true, // Cyberpunk aesthetic
    emissive: '#000000'
  });
  
  const heroMesh = new THREE.Mesh(geometry, material);
  scene.add(heroMesh);

  // 2. Particle Field (Stars)
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 2000;
  const posArray = new Float32Array(particlesCount * 3);

  for(let i = 0; i < particlesCount * 3; i++) {
    // Spread particles randomly in 3D space
    posArray[i] = (Math.random() - 0.5) * 25; 
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: '#ffffff',
    transparent: true,
    opacity: 0.8
  });

  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  return { heroMesh, particlesMesh };
};
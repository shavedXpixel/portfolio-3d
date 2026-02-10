import * as THREE from 'three';

export const setupLights = (scene) => {
  // Ambient Light (Base fill)
  const ambientLight = new THREE.AmbientLight('#ffffff', 0.5);
  scene.add(ambientLight);

  // Directional Light (Key light - Cyan)
  const directionalLight = new THREE.DirectionalLight('#00f3ff', 2);
  directionalLight.position.set(1, 2, 3);
  scene.add(directionalLight);
  
  // Point Light (Accent color - Purple)
  const pointLight = new THREE.PointLight('#bd00ff', 5);
  pointLight.position.set(-3, -1, 2);
  scene.add(pointLight);
};
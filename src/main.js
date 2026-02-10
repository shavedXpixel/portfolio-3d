import './styles/main.css';
import * as THREE from 'three';
import { setupScene } from './scripts/three/scene.js';
import { createWorld } from './scripts/three/world.js';
import { setupLights } from './scripts/three/lights.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// --- 1. SETUP ---
// Only run 3D background if we are on the homepage (checking for canvas)
const canvas = document.getElementById('webgl');
if (canvas) {
  const { scene, camera, renderer } = setupScene();
  setupLights(scene);
  const { heroMesh, particlesMesh } = createWorld(scene);

  if (heroMesh) {
    heroMesh.scale.set(0.5, 0.5, 0.5); 
    heroMesh.position.y = 0;           
  }

  // --- 2. SMOOTH SCROLL ---
  const lenis = new Lenis({ autoRaf: true, lerp: 0.08, wheelMultiplier: 1 });

  // --- 3. ANIMATION LOOP ---
  const clock = new THREE.Clock();
  const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    if (heroMesh) {
      heroMesh.rotation.x = Math.sin(elapsedTime * 0.2) * 0.1;
      heroMesh.rotation.y += 0.002;
    }
    if (particlesMesh) {
      particlesMesh.rotation.y = elapsedTime * 0.05; 
      particlesMesh.rotation.x = -elapsedTime * 0.02;
    }
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  };
  tick();

  // --- 4. SCROLL BLOOM EFFECT ---
  gsap.registerPlugin(ScrollTrigger);
  if (heroMesh) {
    gsap.from(heroMesh.scale, { duration: 2, x: 0, y: 0, z: 0, ease: "elastic.out(1, 0.5)" });
    gsap.to(heroMesh.scale, {
      scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 1 },
      x: 4.5, y: 4.5, z: 4.5, ease: "power1.inOut"
    });
    gsap.to(heroMesh.rotation, {
      scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 1.5 },
      x: Math.PI * 2, y: Math.PI * 4, ease: "none"
    });
  }

  // Text Reveal
  gsap.utils.toArray('.card').forEach(card => {
    gsap.to(card, {
      scrollTrigger: { trigger: card, start: "top 80%", toggleActions: "play none none reverse" },
      y: 0, opacity: 1, duration: 0.8, ease: "power2.out"
    });
  });

  // Skill Bar Animation
  gsap.utils.toArray('.skill-per').forEach(bar => {
    gsap.from(bar, {
      scrollTrigger: { trigger: bar, start: "top 90%" },
      width: "0%", duration: 1.5, ease: "power2.out"
    });
  });
}

// --- 5. TYPEWRITER EFFECT (Runs on homepage only) ---
const typeWriterElement = document.getElementById('typewriter');
if (typeWriterElement) {
  const phrases = ["Full Stack Web Developer", "AI Engineer", "Python Designer", "UI/UX Designer"];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    if (isDeleting) {
      typeWriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 50; 
    } else {
      typeWriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 100; 
    }
    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typeSpeed = 2000; 
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length; 
      typeSpeed = 500; 
    }
    setTimeout(typeEffect, typeSpeed);
  }
  document.addEventListener('DOMContentLoaded', typeEffect);
}
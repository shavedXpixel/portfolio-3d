import './styles/main.css';
import * as THREE from 'three';
import { setupScene } from './scripts/three/scene.js';
import { createWorld } from './scripts/three/world.js';
import { setupLights } from './scripts/three/lights.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// --- 1. SETUP ---
const { scene, camera, renderer } = setupScene();
setupLights(scene);
const { heroMesh, particlesMesh } = createWorld(scene);

// INITIAL STATE: Start Small
if (heroMesh) {
  heroMesh.scale.set(0.5, 0.5, 0.5); 
  heroMesh.position.y = 0;           
}

// --- 2. SMOOTH SCROLL ---
const lenis = new Lenis({
  autoRaf: true,
  lerp: 0.08,
  wheelMultiplier: 1,
});

// --- 3. ANIMATION LOOP ---
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // A. IDLE ANIMATION
  if (heroMesh) {
    heroMesh.rotation.x = Math.sin(elapsedTime * 0.2) * 0.1;
    heroMesh.rotation.y += 0.002;
  }
  
  // B. BACKGROUND FLOW
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
  // 1. Intro Pop
  gsap.from(heroMesh.scale, { duration: 2, x: 0, y: 0, z: 0, ease: "elastic.out(1, 0.5)" });

  // 2. Scroll "Bloom"
  gsap.to(heroMesh.scale, {
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
    },
    x: 4.5, y: 4.5, z: 4.5,
    ease: "power1.inOut"
  });

  // 3. Scroll Rotation
  gsap.to(heroMesh.rotation, {
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 1.5,
    },
    x: Math.PI * 2,
    y: Math.PI * 4,
    ease: "none"
  });
}

// Text Reveal
gsap.utils.toArray('.card').forEach(card => {
  gsap.to(card, {
    scrollTrigger: {
      trigger: card,
      start: "top 80%",
      toggleActions: "play none none reverse"
    },
    y: 0, opacity: 1, duration: 0.8, ease: "power2.out"
  });
});
// Skill Bar Animation
gsap.utils.toArray('.skill-per').forEach(bar => {
  gsap.from(bar, {
    scrollTrigger: {
      trigger: bar,
      start: "top 90%", // Start expanding when near bottom of screen
    },
    width: "0%",
    duration: 1.5,
    ease: "power2.out"
  });
});

// --- 5. BUTTON EFFECTS ---
const contactBtn = document.querySelector('.contact-btn');
if (contactBtn) {
  contactBtn.addEventListener('mouseenter', () => gsap.to(contactBtn, { scale: 1.1, boxShadow: '0 0 25px #00f3ff', duration: 0.3 }));
  contactBtn.addEventListener('mouseleave', () => gsap.to(contactBtn, { scale: 1, boxShadow: '0 0 0px #00f3ff', duration: 0.3 }));
}

// --- 6. DEVELOPER DOSSIER LOGIC ---
const dossierOverlay = document.getElementById('dev-dossier');
const triggerBtn = document.getElementById('dev-trigger');
const closeBtn = document.getElementById('close-dossier');

// GSAP Sequence
const dossierTl = gsap.timeline({ paused: true });
dossierTl
  .to(dossierOverlay, { duration: 0.1, autoAlpha: 1 })
  .from(".dossier-bg", { duration: 0.5, scale: 1.1, opacity: 0, ease: "power2.out" })
  .from(".dossier-header", { duration: 0.4, y: -20, opacity: 0, ease: "power2.out" })
  .from(".left-col .stat-box", { duration: 0.4, x: -20, opacity: 0, stagger: 0.1 })
  .from(".right-col .dd-item", { duration: 0.4, x: 20, opacity: 0, stagger: 0.1 }, "-=0.3");

// OPEN
triggerBtn.addEventListener('click', () => {
  document.body.classList.add('no-scroll'); // Lock Scroll
  lenis.stop(); // Stop Smooth Scroll
  
  dossierOverlay.classList.add('active'); // Add class for pointer events
  dossierTl.restart(); // Play GSAP Animation
  
  if(particlesMesh) particlesMesh.material.color.set('#bd00ff');
});

// CLOSE
closeBtn.addEventListener('click', () => {
  gsap.to(dossierOverlay, { 
    duration: 0.3, 
    autoAlpha: 0,
    onComplete: () => {
      dossierOverlay.classList.remove('active'); 
    }
  });

  document.body.classList.remove('no-scroll');
  lenis.start();
  
  if(particlesMesh) particlesMesh.material.color.set('#ffffff');
});


// --- 7. TYPEWRITER EFFECT ---
const typeWriterElement = document.getElementById('typewriter');
const phrases = ["Full Stack Web Developer", "AI Engineer", "Python Designer", "UI/UX Designer"];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function typeEffect() {
  const currentPhrase = phrases[phraseIndex];
  
  if (isDeleting) {
    // Delete chars
    typeWriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
    typeSpeed = 50; // Deleting is faster
  } else {
    // Add chars
    typeWriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
    typeSpeed = 100; // Typing speed
  }

  // Logic to switch between typing and deleting
  if (!isDeleting && charIndex === currentPhrase.length) {
    // Finished typing the word
    isDeleting = true;
    typeSpeed = 2000; // Wait 2 seconds before deleting
  } else if (isDeleting && charIndex === 0) {
    // Finished deleting the word
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length; // Move to next word
    typeSpeed = 500; // Wait 0.5s before typing next word
  }

  setTimeout(typeEffect, typeSpeed);
}

// Start the typing loop
document.addEventListener('DOMContentLoaded', () => {
  if (typeWriterElement) {
    typeEffect();
  }
});
import { defineConfig } from 'vite';

export default defineConfig({
  // 👇 IMPORTANT: Replace 'portfolio-3d' with your EXACT GitHub repository name
  // If your repo is named something else, change this line!
  base: '/portfolio-3d/', 
  
  build: {
    outDir: 'docs',
  }
});
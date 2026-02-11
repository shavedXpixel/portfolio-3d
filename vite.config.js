import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // 👇 Keep this matching your GitHub repo name!
  base: '/', 
  
  build: {
    outDir: 'docs', // Output folder for GitHub Pages
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),    // Page 1: Home
        dossier: resolve(__dirname, 'dossier.html'), // Page 2: System Info
      },
    },
  },
});
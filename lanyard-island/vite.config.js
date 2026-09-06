import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  assetsInclude: ['**/*.glb'],
  build: {
    outDir: '../assets/portfolio/lanyard-island',
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: './src/main.jsx',
      output: {
        entryFileNames: 'lanyard.js',
        assetFileNames: 'lanyard.[ext]'
      }
    }
  }
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',  // Changed from '/' to './'
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: true,
  },
});

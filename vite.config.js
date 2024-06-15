import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Opcionalmente puedes usar '/dist/' dependiendo de cómo sirves tu aplicación
  build: {
    outDir: 'dist'
  }
});

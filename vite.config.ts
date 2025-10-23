import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
      include: ['**/*.js', '**/*.jsx'], // Inclure les fichiers .js pour le JSX
    })],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});

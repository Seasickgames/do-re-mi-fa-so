import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/do-re-mi-fa-so/', // Set base path for GitHub Pages
  server: {
    host: '0.0.0.0',
  },
});

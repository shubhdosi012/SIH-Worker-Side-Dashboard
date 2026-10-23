import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves this project from a repository subpath.
// Vercel and local preview use the root path.
const base = process.env.GITHUB_ACTIONS
  ? '/SIH-Worker-Side-Dashboard/'
  : '/';

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});

import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Public path served by GitHub Pages: "/" for the custom domain, "/Innovathon-Mollendo/" for the project site.
const base = process.env.VITE_BASE_PATH ?? '/';

// GitHub Pages has no SPA rewrite, so 404.html is served for unknown paths like /registro.
function githubPagesFallback() {
  return {
    name: 'github-pages-fallback',
    closeBundle() {
      copyFileSync(resolve('dist/index.html'), resolve('dist/404.html'));
    },
  };
}

// Vite config: React + Tailwind v4 with a static-hosting friendly output.
export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), githubPagesFallback()],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});

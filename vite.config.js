import { copyFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Public path served by GitHub Pages: "/" for the custom domain, "/Innovathon-Mollendo/" for the project site.
const base = process.env.VITE_BASE_PATH ?? '/';

// GitHub Pages has no SPA rewrite rules, so 404.html handles client routes,
// and we also generate /registro/index.html directly so it returns clean 200 OK.
function githubPagesFallback() {
  return {
    name: 'github-pages-fallback',
    closeBundle() {
      copyFileSync(resolve('dist/index.html'), resolve('dist/404.html'));
      mkdirSync(resolve('dist/registro'), { recursive: true });
      copyFileSync(resolve('dist/index.html'), resolve('dist/registro/index.html'));
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

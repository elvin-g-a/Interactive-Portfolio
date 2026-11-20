import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, type Plugin } from 'vite';

/**
 * Copies static local folders (assets/, fonts/) into dist/ during production builds
 * so runtime string paths work identically in AI Studio builds and GitHub Pages.
 */
function copyStaticFolders(): Plugin {
  return {
    name: 'copy-static-folders',
    closeBundle() {
      const rootDir = process.cwd();
      const distDir = path.resolve(rootDir, 'dist');
      for (const folder of ['assets', 'fonts']) {
        const src = path.resolve(rootDir, folder);
        const dest = path.resolve(distDir, folder);
        if (fs.existsSync(src)) {
          fs.cpSync(src, dest, { recursive: true });
        }
      }
    },
  };
}

export default defineConfig({
  base: './',
  publicDir: false,
  plugins: [copyStaticFolders()],
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});

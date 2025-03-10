import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  outDir: 'dist',
  clean: true,
  // Copy the api directory to the dist folder
  onSuccess: 'cp -r src/server/api dist/api'
});

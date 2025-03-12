import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/shard.ts'],
  format: ['cjs', 'esm'],
  outDir: 'dist',
  clean: true,
  // Copy the api directory to the dist folder
  onSuccess: 'cp -r public/ dist/'
  // onSuccess: 'cp -r src/server/api/REST dist/api && cp -r src/commands dist/commands'
});

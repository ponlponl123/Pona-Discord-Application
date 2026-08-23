import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/shard.ts'],
  format: ['esm'],
  outDir: 'dist',
  clean: true,
  external: ['bun'],
});

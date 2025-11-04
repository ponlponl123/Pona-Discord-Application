import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/shard.ts'],
  format: ['cjs', 'esm'],
  outDir: 'dist',
  clean: true,
});

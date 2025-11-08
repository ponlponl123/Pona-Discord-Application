# Docker Image Size Optimization Results

## Summary

Successfully reduced the Docker image size from **1.96GB to 1.05GB** - a **46% reduction** (saving 910MB)!

## Image Size Comparison

| Version                                                   | Size   | Reduction    | Notes                                 |
| --------------------------------------------------------- | ------ | ------------ | ------------------------------------- |
| **Original** (`Dockerfile-Bun-Sharded-NecessaryLibBuild`) | 1.96GB | Baseline     | Original build with full node_modules |
| **Optimized** (`Dockerfile-Bun-Sharded-Optimized`)        | 1.11GB | -43% (850MB) | Production deps only + basic cleanup  |
| **Ultra** (`Dockerfile-Bun-Ultra-Optimized`)              | 1.05GB | -46% (910MB) | Production deps + aggressive cleanup  |

## Key Optimizations Applied

### 1. **Separate Production Dependencies Stage**

- Created a dedicated `deps` stage that installs only production dependencies
- Removed all devDependencies from the final image
- Reduced node_modules from 1.11GB to ~700MB

### 2. **Removed Build Tools from Final Image**

- Original image included: `python3`, `g++`, `make`, `git` (~268MB)
- Final image only includes: `libstdc++`, `ca-certificates` (~1.5MB)
- **Saved: ~266MB**

### 3. **Aggressive File Cleanup**

The ultra-optimized version removes unnecessary files while preserving critical runtime packages:

- Documentation files: `*.md`, `*.txt`, `README*`, `CHANGELOG*`, `LICENSE*`
- Source maps: `*.map`, `*.js.map`, `*.mjs.map`
- Test files: `*.test.js`, test directories
- Unnecessary directories: `docs/`, `examples/`, `tests/`, `.github/`, `coverage/`
- Config files: `.eslintrc*`, `.prettierrc*`, `.editorconfig`

**Important:** The cleanup excludes critical runtime packages:

- `tsconfig-paths` (required for module path resolution)
- `discord.js` and `@discordjs/*` (core Discord functionality)
- `discord-hybrid-sharding` (sharding support)

### 4. **Optimized ytmusic-api Build**

- Added `npm prune --production` after building
- Removed `.git` directory from cloned repo
- Only copy production-ready build artifacts

## Recommended Dockerfile

Use **`Dockerfile-Bun-Ultra-Optimized`** for production deployments.

### Build Command:

```bash
docker build -f .\Dockerfile-Bun-Ultra-Optimized -t pona-app:0.2.2 .
```

## Layer Size Breakdown (Ultra-Optimized)

```
- Bun runtime: ~97MB
- Alpine base: ~8.5MB
- Runtime libs: ~1.5MB
- node_modules (prod): ~650-700MB
- Built application: ~2MB
- Public files: ~100KB
- Config files: ~16KB
```

## Additional Optimization Opportunities

If you need to go smaller:

1. **Use .dockerignore more aggressively**

   - Ensure no unnecessary files are copied during build

2. **Consider multi-binary modules**

   - Some native modules include binaries for multiple platforms
   - Use tools like `modclean` or `node-prune` for deeper cleanup

3. **Bundle the application**

   - Use webpack/esbuild to create a single bundle
   - Eliminates need for most dependencies at runtime

4. **Consider distroless or scratch base images**
   - For maximum size reduction (but requires static binary compilation)

## Testing the Optimized Image

Before deploying, test the optimized image to ensure all functionality works:

```bash
# Run the container
docker run -d --name pona-test -p 3000:3000 pona-app:0.2.2-ultra

# Check logs
docker logs -f pona-test

# Test the application
# (Run your test suite here)

# Clean up
docker stop pona-test
docker rm pona-test
```

## Build Time Comparison

- **Original**: ~97s
- **Optimized**: ~65s
- **Ultra**: ~82s (longer due to cleanup operations, but only runs once)

The ultra-optimized version has a slightly longer build time due to the aggressive cleanup operations, but this is a one-time cost for a significantly smaller image.

## Troubleshooting

### Error: `tsconfig-paths.register is not a function`

**Root Cause:** The ClusterManager in `src/shard.ts` was configured to require `tsconfig-paths.js` for all spawned processes, including production. Since `tsup` bundles and resolves all TypeScript paths at build time, this is unnecessary in production and causes errors.

**Solution:** Updated `src/shard.ts` to conditionally use `tsconfig-paths` only in development:

```typescript
execArgv: process.env.NODE_ENV === 'production' ? [] : ['-r', './tsconfig-paths.js'],
```

**Why this works:**

- In **development**: TypeScript paths need runtime resolution via `tsconfig-paths`
- In **production**: Paths are already resolved in the bundled output by `tsup`

**Alternative solutions if needed:**

1. Remove `execArgv` entirely if all code is bundled
2. Use environment variables to control the path resolution method
3. Ensure `tsconfig-paths` module is properly installed and not corrupted during cleanup

### Error: Missing Discord.js modules

If you see errors related to missing Discord modules, ensure the cleanup exclusions in the Dockerfile include all necessary packages.

### Verifying the Build

To verify all required packages are present:

```bash
# Start a shell in the container
docker run -it --rm pona-app:0.2.2-ultra sh

# Check if critical packages exist
ls -la /pona/node_modules/discord.js
ls -la /pona/node_modules/discord-hybrid-sharding

# Check the built application
ls -la /pona/dist/

# Test startup (without full bot token)
cd /pona && NODE_ENV=production bun dist/shard.js
```

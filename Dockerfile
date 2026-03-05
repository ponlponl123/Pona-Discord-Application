# ========================
# Build the App with Bun
# ========================
FROM oven/bun:1.3.1-alpine AS bun-builder
WORKDIR /pona-builder

# Install build dependencies and copy package files
RUN apk add --no-cache python3 make g++
COPY package.json package-lock.json* bun.lockb* ./

# Install all dependencies (cached layer - only invalidated on package changes)
RUN bun install

# Copy source code and config files
COPY tsup.config.ts tsconfig.json ./
COPY src ./src
COPY public ./public

# Build the application
RUN bun run bun:build

# ========================
# Production Dependencies Only
# ========================
FROM oven/bun:1.3.1-alpine AS deps
WORKDIR /deps

# Install only runtime build tools and install production deps in single stage
RUN apk add --no-cache python3 make g++
COPY package.json ./
RUN bun install --production

# Aggressive cleanup - remove unnecessary files and directories
RUN find ./node_modules -type f \
    ! -path "*/tsconfig-paths/*" \
    ! -path "*/discord.js/*" \
    ! -path "*/discord-hybrid-sharding/*" \
    ! -path "*/@discordjs/*" \
    \( \
    -name "*.md" -o \
    -name "*.markdown" -o \
    -name "*.txt" -o \
    -name "*.map" -o \
    -name "LICENSE*" -o \
    -name "LICENCE*" -o \
    -name "CHANGELOG*" -o \
    -name "README*" -o \
    -name "HISTORY*" -o \
    -name "AUTHORS*" -o \
    -name "CONTRIBUTORS*" -o \
    -name ".npmignore" -o \
    -name ".gitignore" -o \
    -name ".editorconfig" -o \
    -name ".eslintrc*" -o \
    -name ".prettierrc*" -o \
    -name "*.spec.js" -o \
    -name "*.test.js" \
    \) -delete 2>/dev/null || true && \
    find ./node_modules -type d \
    ! -path "*/tsconfig-paths/*" \
    ! -path "*/discord.js/*" \
    ! -path "*/discord-hybrid-sharding/*" \
    ! -path "*/@discordjs/*" \
    \( \
    -name "test" -o \
    -name "tests" -o \
    -name "__tests__" -o \
    -name "spec" -o \
    -name "docs" -o \
    -name "examples" -o \
    -name "example" -o \
    -name ".github" -o \
    -name "coverage" -o \
    -name ".nyc_output" -o \
    -name "benchmark" -o \
    -name "benchmarks" \
    \) -exec rm -rf {} + 2>/dev/null || true

# ========================
# Final Image (Minimal)
# ========================
FROM oven/bun:1.3.1-alpine AS runner
WORKDIR /pona

# Install only runtime libraries and setup environment
RUN apk add --no-cache libstdc++ ca-certificates && \
    addgroup -g 9999 appuser && \
    adduser -u 9999 -G appuser -s /sbin/nologin -D appuser

ENV NODE_ENV=production PORT=3000

# Copy only necessary files from build stages
COPY --from=deps --chown=appuser:appuser /deps/node_modules ./node_modules
COPY --from=bun-builder --chown=appuser:appuser /pona-builder/dist ./dist
COPY --from=bun-builder --chown=appuser:appuser /pona-builder/public ./dist/public
COPY --chown=appuser:appuser package.json tsconfig-paths.js tsconfig.json ./

USER appuser

EXPOSE 3000

CMD ["bun", "bun:start-reg-shard"]

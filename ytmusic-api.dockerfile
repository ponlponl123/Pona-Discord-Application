FROM node:22.4.1-alpine AS base
RUN apk add python3 g++ make git

FROM base AS ytmusic-api-builder
WORKDIR /builder

# Clone the GitHub repository and build the library
RUN git clone https://github.com/ponlponl123/ts-npm-ytmusic-api
WORKDIR /builder/ts-npm-ytmusic-api

# Install dependencies and build the library
RUN npm install
RUN npm run build

# Set up the app and build the project
FROM base AS builder
WORKDIR /pona-builder
COPY package.json package-lock.json ./
RUN npm install
COPY . .
COPY --from=ytmusic-api-builder /builder/ts-npm-ytmusic-api ./node_modules/ytmusic-api
RUN npm run build

FROM base AS runner
WORKDIR /pona
ENV NODE_ENV=production

# Copy the build artifacts into the final image
COPY --from=builder /pona-builder/dist ./dist
COPY --from=builder /pona-builder/eslint.config.mjs ./eslint.config.mjs
COPY --from=builder /pona-builder/tsconfig-paths.js ./tsconfig-paths.js
COPY --from=builder /pona-builder/tsconfig.json ./tsconfig.json
COPY --from=builder /pona-builder/package.json ./package.json
COPY --from=builder /pona-builder/node_modules ./node_modules
COPY --from=builder /pona-builder/locates ./locates
COPY --from=builder /pona-builder/public ./public
COPY --from=builder /pona-builder/.env.production ./.env.production

EXPOSE 3000

ENV PORT=3000

CMD ["npm", "run", "start-shard"]
FROM node:22.4.1-alpine AS base
RUN apk add python3 g++ make

FROM base AS builder
WORKDIR /pona-builder
COPY package.json package-lock.json ./
RUN npm i
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /pona
ENV NODE_ENV=production

COPY --from=builder /pona-builder/dist ./dist
COPY --from=builder /pona-builder/eslint.config.mjs ./eslint.config.mjs
COPY --from=builder /pona-builder/tsconfig-paths.js ./tsconfig-paths.js
COPY --from=builder /pona-builder/tsconfig.json ./tsconfig.json
COPY --from=builder /pona-builder/package.json ./package.json
COPY --from=builder /pona-builder/node_modules ./node_modules
COPY --from=builder /pona-builder/locates ./locates
COPY --from=builder /pona-builder/public ./public

EXPOSE 3000

ENV PORT=3000

CMD ["node", "-r", "./tsconfig-paths.js", "dist/index.js", "--production"]
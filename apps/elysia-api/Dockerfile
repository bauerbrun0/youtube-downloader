FROM node:lts-slim AS base
RUN npm i -g pnpm bun

FROM base AS monorepo-base
WORKDIR /repo
COPY . .

# Build solid app -------------------------------------------------------------
FROM monorepo-base AS solid-build
# Installing solid-app dependencies
# 	--config.dedupe-peer-dependents=false
# 	https://github.com/pnpm/pnpm/issues/6300
RUN pnpm install --filter solid-app --config.dedupe-peer-dependents=false
# Running solid-app build
# 	output in /repo/apps/solid-app/dist/
RUN pnpm run --filter solid-app build

# Elysia API dependencies and solid build -------------------------------------
FROM monorepo-base AS elysia-api-build
# Copying solid build from solid-build stage
COPY --from=solid-build /repo/apps/solid-app/dist/ ./apps/elysia-api/solid-build
# Installing elysia-api dependencies
RUN pnpm deploy --filter elysia-api --prod /prod/elysia-api

# Elysia API runner -----------------------------------------------------------
FROM base AS elysia-api-run
WORKDIR /app
# Copying elysia-api from elysia-api-build stage
COPY --from=elysia-api-build /prod/elysia-api/ .
CMD ["pnpm", "start"]

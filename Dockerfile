FROM node:lts-slim AS base
RUN npm i -g pnpm
WORKDIR /repo
COPY . .

# Solid app builder -----------------------------------------------------------
FROM base AS solid-build
# Installing solid-app dependencies, building and removing node_modules
# 	--config.dedupe-peer-dependents=false
# 	https://github.com/pnpm/pnpm/issues/6300
RUN pnpm install --filter solid-app --config.dedupe-peer-dependents=false &&\
	pnpm run --filter solid-app build &&\
	rm -rf ./node_modules ./apps/solid-app/node_modules

# Elysia API installer -------------------------------------
FROM base AS elysia-api-install
# Copying solid build from solid-build stage and installing elysia-api dependencies
COPY --from=solid-build /repo/apps/solid-app/dist/ ./apps/elysia-api/solid-build
RUN pnpm deploy --filter elysia-api --prod /prod/elysia-api

# Runner -----------------------------------------------------------
FROM oven/bun:slim AS runner
WORKDIR /app
# Installing curl, python, gettext-base (needed for envsubst), removing apt cache, installing yt-dlp
RUN apt-get update && apt-get install -y curl python3 gettext-base &&\
	apt-get clean && rm -rf /var/lib/apt/lists/* &&\
	curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/bin/yt-dlp &&\
	chmod a+rx /usr/bin/yt-dlp

COPY --from=elysia-api-install /prod/elysia-api/ .

ENV MODE=production
ENV YT_DLP_BIN_PATH=/usr/bin/yt-dlp
# Running app with envsubst: substitutes environment variables in index.html
# This allows us to set the VITE_API_URL and other variables at runtime for the frontend
CMD ["/bin/bash", "-c", "\
    cp ./solid-build/index.html ./solid-build/index.html.template && \
    envsubst < ./solid-build/index.html.template > ./solid-build/index.html && \
    rm ./solid-build/index.html.template && \
    bun start \
"]

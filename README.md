# YouTube Downloader Monorepo 🎬🎶

This monorepo houses the components of a YouTube Downloader application, including the API, frontend, and database.

## Development 🚀

### Prerequisites
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Bun](https://bun.sh/)
- [pnpm](https://pnpm.io/)
- [Node.js](https://nodejs.org/en/)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp/wiki/Installation)
- [python](https://www.python.org/downloads/)

### Getting Started
1. Clone the repository
2. Run `cp .env.example .env.development` and fill in the environment variables
2. Run `pnpm i` to install dependencies
3. Run `docker compose -f docker-compose.development.yaml --env-file .env.development up -d` to start the development environment
4. Run `pnpm run dev` to start the API and frontend development servers

## Production 🚀

### Prerequisites
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Deployment steps
1. Clone the repository
2. Run `cp .env.example .env.production` and fill in the environment variables
3. Run `docker compose -f docker-compose.production.yaml --env-file .env.production up -d` to build (see `/apps/elysia-api/Dockerfile`) and start the production environment
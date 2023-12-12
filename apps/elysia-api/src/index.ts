import { Elysia } from 'elysia';
import { staticPlugin } from '@elysiajs/static';
import swagger from '@elysiajs/swagger';
import appConfig from './configs/app.config';
import app from './app';
import { cors } from '@elysiajs/cors';

if (appConfig.mode === "production") {
	new Elysia()
		.use(staticPlugin({
			assets: "./solid-build",
			prefix: "",
		}))
		.get("/", async () => Bun.file("./solid-build/index.html"))
		.use(app)
		.listen(appConfig.port);
} else {
	new Elysia()
		.use(cors())
		.use(swagger({
			documentation: {
				info: {
					title: "YouTube Downloader API",
					description: "API documentation for development",
					version: "0.0.1"
				},
				tags: [
					{ name: "/", description: "General enpoints" },
					{ name: "/info", description: "Information about videos and playlists" }
				]
			}
		}))
		.use(app)
		.listen(appConfig.port);
}

console.log(
	`Server listening on port ${appConfig.port} in ${appConfig.mode} mode`,
);
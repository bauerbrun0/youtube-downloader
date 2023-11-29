import { Elysia } from 'elysia';
import { staticPlugin } from '@elysiajs/static';
import swagger from '@elysiajs/swagger';
import appConfig from './configs/app.config';
import info from './routes/info';
import { CustomError } from './utils/errors';

const app = new Elysia({ prefix: "/api" })
	.onError(({ code, error, set }) => {
		if (error instanceof CustomError) {
			set.status = error.status;
			return { error: error.message };
		}

		if (code === "NOT_FOUND") {
			set.status = 404;
			return { error: "Not Found" };
		}

		set.status = 500;
		return { error: "Internal server error" };
	})
	.get("/health", async () => "ok", { detail: { tags: ["/"] } })
	.use(info);

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
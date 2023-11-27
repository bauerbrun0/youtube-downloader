import { Elysia } from 'elysia';
import { staticPlugin } from '@elysiajs/static';
import swagger from '@elysiajs/swagger';
import appConfig from './configs/app.config';
import info from './routes/info';

const app = new Elysia({ prefix: "/api" })
	.get("/health", async () => "ok")
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
		.use(swagger())
		.use(app)
		.listen(appConfig.port);
}

console.log(
	`Server listening on port ${appConfig.port} in ${appConfig.mode} mode`,
);
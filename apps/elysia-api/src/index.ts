import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";

const MODE = Bun.env.MODE ?? "development";
const PORT = Bun.env.ELYSIA_PORT ?? 8080;

const app = new Elysia()
	.get("/health", async () => "ok")
	.get("/ping", async () => "pong");

if (MODE === "production") {
	new Elysia()
		.use(staticPlugin({
			assets: "./solid-build",
			prefix: "",
		}))
		.get("/", async () => Bun.file("./solid-build/index.html"))
		.use(app)
		.listen(PORT);
} else {
	new Elysia()
		.use(app)
		.listen(PORT);
}

console.log(
	`Server listening on port ${PORT} in ${MODE} mode`,
);

console.log(Bun.env.ELYSIA_PORT);
console.log(Bun.env.MODE);
console.log(Bun.env.POSTGRES_PORT);

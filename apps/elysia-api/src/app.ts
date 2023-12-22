import { Elysia } from "elysia";
import setup from "./utils/setup";
import info from "./routes/info";

export default new Elysia({ prefix: "/api" })
	.use(setup)
	.get("/health", async () => "ok", { detail: { tags: ["/"] } })
	.use(info);
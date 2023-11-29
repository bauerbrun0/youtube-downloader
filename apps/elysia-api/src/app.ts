import { Elysia } from "elysia";
import { CustomError } from "./utils/errors";
import info from "./routes/info";

export default new Elysia({ prefix: "/api" })
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
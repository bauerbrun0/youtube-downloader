import { describe, test, expect } from "bun:test";
import app from "./app";

describe("/api", () => {
	test("/api/health should response with 'ok'", async () => {
		const resp = await app.handle(
			new Request("http://localhost/api/health")
		).then((resp) => resp.text());

		expect(resp).toBe("ok");
	});

	test("Non-existent route should response with 404 error", async () => {
		const resp = await app.handle(
			new Request("http://localhost/api/non-existent")
		).then((resp) => resp.json());

		expect(resp).toEqual({ error: "Not Found" });
	});
});
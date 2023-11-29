import { describe, test, expect } from "bun:test";
import app from "../app";

describe("/api/info", () => {
	describe("/:encodedYouTubePath", () => {
		test("Should respond with video info when given a valid video path to an existing video", async () => {
			const res = await app.handle(
				new Request("http://localhost/api/info/watch%3Fv%3DjNQXAC9IVRw")
			);
			
			expect(res.status).toBe(200);
			const data = await res.json();
			expect(data).toHaveProperty("result");

			expect(data.result).toHaveProperty("type");
			expect(data.result.type).toBe("video");
		});

		test("Should respond with playlist info when given a valid playlist path to an existing playlist", async () => {
			const res = await app.handle(
				new Request("http://localhost/api/info/playlist%3Flist%3DPLNx-QyJioaYapG09GQ7594AEuKfvV4L-R%0A")
			);
			
			expect(res.status).toBe(200);
			const data = await res.json();
			expect(data).toHaveProperty("result");
			
			expect(data.result).toHaveProperty("type");
			expect(data.result.type).toBe("playlist");
		});

		test("Should respond with 404 when given a valid video path to a non-existent video", async () => {
			const res = await app.handle(
				new Request("http://localhost/api/info/watch%3Fv%3Dnon-existent")
			);

			expect(res.status).toBe(404);
			const data = await res.json();
			expect(data).toEqual({ error: "The requested video or playlist was not found" });

			const res2 = await app.handle(
				new Request("http://localhost/api/info/playlist%3Flist%3Dnon-existent")
			);

			expect(res2.status).toBe(404);
			const data2 = await res2.json();
			expect(data2).toEqual({ error: "The requested video or playlist was not found" });
		});
	});

	describe("/video/:encodedYouTubePath", () => {
		test("Should respond with video info when given a valid video path to an existing video", async () => {
			const res = await app.handle(
				new Request("http://localhost/api/info/video/watch%3Fv%3DjNQXAC9IVRw")
			);

			expect(res.status).toBe(200);
			const data = await res.json();
			expect(data).toHaveProperty("type");
			expect(data.type).toBe("video");
		});

		test("Should respond with 404 when given a valid video path to a non-existent video", async () => {
			const res = await app.handle(
				new Request("http://localhost/api/info/video/watch%3Fv%3Dnon-existent")
			);

			expect(res.status).toBe(404);
			const data = await res.json();
			expect(data).toEqual({ error: "The requested video or playlist was not found" });
		});

		test("Should respond with 400 when given a valid playlist path to an existing playlist", async () => {
			const res = await app.handle(
				new Request("http://localhost/api/info/video/playlist%3Flist%3DPLNx-QyJioaYapG09GQ7594AEuKfvV4L-R%0A")
			);

			expect(res.status).toBe(400);
			const data = await res.json();
			expect(data).toEqual({ error: "Requested URL does not point to a video" });
		});
	});

	describe("/playlist/:encodedYouTubePath", () => {
		test("Should respond with playlist info when given a valid playlist path to an existing playlist", async () => {
			const res = await app.handle(
				new Request("http://localhost/api/info/playlist/playlist%3Flist%3DPLNx-QyJioaYapG09GQ7594AEuKfvV4L-R%0A")
			);

			expect(res.status).toBe(200);
			const data = await res.json();
			expect(data).toHaveProperty("type");
			expect(data.type).toBe("playlist");
		});

		test("Should respond with 404 when given a valid playlist path to a non-existent playlist", async () => {
			const res = await app.handle(
				new Request("http://localhost/api/info/playlist/playlist%3Flist%3Dnon-existent")
			);

			expect(res.status).toBe(404);
			const data = await res.json();
			expect(data).toEqual({ error: "The requested video or playlist was not found" });
		});

		test("Should respond with 400 when given a valid video path to an existing video", async () => {
			const res = await app.handle(
				new Request("http://localhost/api/info/playlist/watch%3Fv%3DjNQXAC9IVRw")
			);

			expect(res.status).toBe(400);
			const data = await res.json();
			expect(data).toEqual({ error: "Requested URL does not point to a playlist" });
		});
	});
});
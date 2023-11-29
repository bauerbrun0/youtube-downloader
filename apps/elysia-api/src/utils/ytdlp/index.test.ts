import { describe, test, expect } from "bun:test";
import { dontThrow } from "../test";
import { BadRequestError, NotFoundError } from "../errors";
import YTDLP from ".";

const ytdlp = new YTDLP();

describe("ytdlp", () => {
	describe("._getInfo()", () => {
		test("should return proper info about a video", async () => {
			const { stdout } = await ytdlp._getInfo("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
			expect(stdout).toBeDefined();

			expect(stdout).toHaveProperty("id");
			expect(stdout.id).toBeString();
			expect(stdout.id.length).toBeGreaterThan(0);

			expect(stdout).toHaveProperty("webpage_url");
			expect(stdout.webpage_url).toBeString();
			expect(stdout.webpage_url.length).toBeGreaterThan(0);

			expect(stdout).toHaveProperty("title");
			expect(stdout.title).toBeString();
			expect(stdout.title.length).toBeGreaterThan(0);
	
			expect(stdout).toHaveProperty("_type");
			expect(stdout._type).toBeString();
			expect(["video", "playlist"]).toContain(stdout._type);

			expect(stdout).toHaveProperty("formats");
			expect(stdout.formats).toBeArray();

			stdout.formats.forEach((format: any) => {
				expect(format).toHaveProperty("format_id");
				expect(format.format_id).toBeString();

				expect(format).toHaveProperty("format");
				expect(format.format).toBeString();

				if (format.format_note !== undefined) {
					expect(format.format_note).toBeString();
				}

				if (format.filesize !== undefined) {
					const isNumber = dontThrow(() => expect(format.filesize).toBeNumber());
					const isNull = dontThrow(() => expect(format.filesize).toBeNull());
					expect(isNumber || isNull).toBeTrue();
				}

				if (format.fps !== undefined) {
					const isNumber = dontThrow(() => expect(format.fps).toBeNumber());
					const isNull = dontThrow(() => expect(format.fps).toBeNull());
					expect(isNumber || isNull).toBeTrue();
				}

				expect(format).toHaveProperty("resolution");
				expect(format.resolution).toBeString();

				if (format.tbr !== undefined) {
					const isNumber = dontThrow(() => expect(format.tbr).toBeNumber());
					const isNull = dontThrow(() => expect(format.tbr).toBeNull());
					expect(isNumber || isNull).toBeTrue();
				}

				if (format.vbr !== undefined) {
					const isNumber = dontThrow(() => expect(format.vbr).toBeNumber());
					const isNull = dontThrow(() => expect(format.vbr).toBeNull());
					expect(isNumber || isNull).toBeTrue();
				}

				expect(format).toHaveProperty("ext");
				expect(format.ext).toBeString();

				expect(format).toHaveProperty("vcodec");
				expect(format.vcodec).toBeString();

				if (format.acodec !== undefined) {
					expect(format.acodec).toBeString();
				}

				if (format.abr !== undefined) {
					const isNumber = dontThrow(() => expect(format.abr).toBeNumber());
					const isNull = dontThrow(() => expect(format.abr).toBeNull());
					expect(isNumber || isNull).toBeTrue();
				}

				if (format.container !== undefined) {
					expect(format.container).toBeString();
				}

				if (format.width !== undefined) {
					const isNumber = dontThrow(() => expect(format.width).toBeNumber());
					const isNull = dontThrow(() => expect(format.width).toBeNull());
					expect(isNumber || isNull).toBeTrue();
				}

				if (format.height !== undefined) {
					const isNumber = dontThrow(() => expect(format.height).toBeNumber());
					const isNull = dontThrow(() => expect(format.height).toBeNull());
					expect(isNumber || isNull).toBeTrue();
				}
			});

		});

		test("should return proper info about a playlist", async () => {
			const { stdout } = await ytdlp._getInfo("https://www.youtube.com/playlist?list=PLNx-QyJioaYapG09GQ7594AEuKfvV4L-R");
			expect(stdout).toBeDefined();

			expect(stdout).toHaveProperty("id");
			expect(stdout.id).toBeString();
			expect(stdout.id.length).toBeGreaterThan(0);

			expect(stdout).toHaveProperty("webpage_url");
			expect(stdout.webpage_url).toBeString();
			expect(stdout.webpage_url.length).toBeGreaterThan(0);

			expect(stdout).toHaveProperty("title");
			expect(stdout.title).toBeString();
			expect(stdout.title.length).toBeGreaterThan(0);
	
			expect(stdout).toHaveProperty("_type");
			expect(stdout._type).toBeString();
			expect(["video", "playlist"]).toContain(stdout._type);

			expect(stdout).toHaveProperty("entries");
			expect(stdout.entries).toBeArray();

			if (stdout.entries.length === 0) {
				return;
			}

			stdout.entries.forEach((entry: any) => {
				expect(entry).toHaveProperty("id");
				expect(entry.id).toBeString();

				expect(entry).toHaveProperty("url");
				expect(entry.url).toBeString();

				expect(entry).toHaveProperty("title");
				expect(entry.title).toBeString();

				expect(entry).toHaveProperty("duration");
				expect(entry.duration).toBeNumber();
			});
		});

		test("should get proper error when specifying a non-existent video", async () => {
			const { stderr } = await ytdlp._getInfo("https://www.youtube.com/watch?v=non-existent");
			expect(stderr).toBeDefined();
			expect(stderr).toContain("Video unavailable");
		});

		test("should get proper error when specifying a non-existent playlist", async () => {
			const { stderr } = await ytdlp._getInfo("https://www.youtube.com/playlist?list=non-existent");
			expect(stderr).toBeDefined();
			expect(stderr).toContain("playlist does not exist");
		});

		test("should get proper error when specifying a non-existent YouTube path", async () => {
			const { stderr } = await ytdlp._getInfo("https://www.youtube.com/not-a-path");
			expect(stderr).toBeDefined();
			expect(stderr).toContain("HTTP Error 404: Not Found");
		});
	});

	describe(".getInfo()", () => {
		test("should not throw when getting info from existing video", async () => {
			const info = await ytdlp.getInfo("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
			expect(info).toBeDefined();
		});

		test("should not throw when getting info from existing playlist", async () => {
			const info = await ytdlp.getInfo("https://www.youtube.com/playlist?list=PLNx-QyJioaYapG09GQ7594AEuKfvV4L-R");
			expect(info).toBeDefined();
		});

		test("should throw custom NotFoundError when getting info from non-existent video", async () => {
			let error;

			try {
				await ytdlp.getInfo("https://www.youtube.com/watch?v=non-existent");
			} catch (e) {
				error = e;
			}

			expect(error).toBeDefined();
			expect(error).toBeInstanceOf(NotFoundError);
		});

		test("should throw custom NotFoundError when getting info from non-existent playlist", async () => {
			let error;

			try {
				await ytdlp.getInfo("https://www.youtube.com/playlist?list=non-existent");
			} catch (e) {
				error = e;
			}

			expect(error).toBeDefined();
			expect(error).toBeInstanceOf(NotFoundError);
		});

		test("should throw custom BadRequestError when getting info from non-existent YouTube path", async () => {
			let error;

			try {
				await ytdlp.getInfo("https://www.youtube.com/not-a-path");
			} catch (e) {
				error = e;
			}

			expect(error).toBeDefined();
			expect(error).toBeInstanceOf(BadRequestError);
		});
	});
});

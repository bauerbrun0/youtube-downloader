import { Elysia } from "elysia";
import ytdlpService from "../services/ytdlpService";
import { fullyDecodeURIComponent } from "../utils";

export default new Elysia({prefix: "/info"})
	.get("/:encodedYouTubePath", async ({ params: {encodedYouTubePath}, set}) => {
		try {
			const url = `https://www.youtube.com/${fullyDecodeURIComponent(encodedYouTubePath)}`;
			const info = await ytdlpService.getInfo(url);
			return info;
		} catch (e: unknown) {
			if ((e as Error).message.includes("not found")) {
				set.status = 404;
				return { error: (e as Error).message };
			}
			set.status = 500;
			return { error: (e as Error).message };
		}
	});
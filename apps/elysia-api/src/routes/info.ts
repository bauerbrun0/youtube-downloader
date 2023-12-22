import { Elysia } from "elysia";
import ytdlpService from "../services/ytdlpService";
import { fullyDecodeURIComponent } from "../utils/helpers";
import { videoInfo, playlistInfo } from "types";
import { Type } from "@sinclair/typebox";
import setup from "../utils/setup";

export default new Elysia({ prefix: "/info" })
	.use(setup)
	.get("/:encodedYouTubePath", async ({ params: { encodedYouTubePath }, dict }) => {
		const url = `https://www.youtube.com/${fullyDecodeURIComponent(encodedYouTubePath)}`;
		const info = await ytdlpService.getInfo(url, dict);
		return { result: info };
	}, {
		response: Type.Object({ result: Type.Union([videoInfo, playlistInfo]) }),
		detail: { tags: ["/info"] }
	})
	.get("/video/:encodedYouTubePath", async ({ params: { encodedYouTubePath }, dict }) => {
		const url = `https://www.youtube.com/${fullyDecodeURIComponent(encodedYouTubePath)}`;
		const videoInfo = await ytdlpService.getVideoInfo(url, dict);
		return videoInfo;
	}, {
		response: videoInfo,
		detail: { tags: ["/info"] }
	})
	.get("/playlist/:encodedYouTubePath", async ({ params: { encodedYouTubePath }, dict }) => {
		const url = `https://www.youtube.com/${fullyDecodeURIComponent(encodedYouTubePath)}`;
		const playlistInfo = await ytdlpService.getPlaylistInfo(url, dict);
		return playlistInfo;
	}, {
		response: playlistInfo,
		detail: { tags: ["/info"] }
	});
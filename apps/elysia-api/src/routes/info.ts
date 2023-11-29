import { Elysia } from "elysia";
import ytdlpService from "../services/ytdlpService";
import { fullyDecodeURIComponent } from "../utils/helpers";
import { videoInfo, playlistInfo } from "types";
import { Type } from "@sinclair/typebox";

export default new Elysia({ prefix: "/info" })
	.get("/:encodedYouTubePath", async ({ params: { encodedYouTubePath } }) => {
		const url = `https://www.youtube.com/${fullyDecodeURIComponent(encodedYouTubePath)}`;
		const info = await ytdlpService.getInfo(url);
		return { result: info };
	}, {
		response: Type.Object({ result: Type.Union([videoInfo, playlistInfo]) }),
		detail: { tags: ["/info"] }
	})
	.get("/video/:encodedYouTubePath", async ({ params: { encodedYouTubePath } }) => {
		const url = `https://www.youtube.com/${fullyDecodeURIComponent(encodedYouTubePath)}`;
		const videoInfo = await ytdlpService.getVideoInfo(url);
		return videoInfo;
	}, {
		response: videoInfo,
		detail: { tags: ["/info"] }
	})
	.get("/playlist/:encodedYouTubePath", async ({ params: { encodedYouTubePath } }) => {
		const url = `https://www.youtube.com/${fullyDecodeURIComponent(encodedYouTubePath)}`;
		const playlistInfo = await ytdlpService.getPlaylistInfo(url);
		return playlistInfo;
	}, {
		response: playlistInfo,
		detail: { tags: ["/info"] }
	});
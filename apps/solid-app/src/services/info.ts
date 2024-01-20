import { VideoInfo, videoInfo, PlaylistInfo, playlistInfo, Value } from "types";
import { store } from "../store";

const API_URL = import.meta.env.VITE_API_URL;

async function fetchInfo(encodedYouTubePath: string): Promise<VideoInfo | PlaylistInfo> {
	const res = await fetch(`${API_URL}/api/info/${encodedYouTubePath}?lang=${store.locale}`);
	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.error);
	}

	if (Value.Check(videoInfo, data.result)) {
		return data.result as VideoInfo;
	} else if (Value.Check(playlistInfo, data.result)) {
		return data.result as PlaylistInfo;
	}

	throw new Error("Invalid response");
}

export default {
	fetchInfo
};
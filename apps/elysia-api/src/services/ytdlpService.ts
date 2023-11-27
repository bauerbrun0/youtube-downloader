import { create } from 'youtube-dl-exec';
import { baseYouTubeRespone, playlistInfo, PlaylistInfo, videoInfo, VideoInfo } from 'types';
import ytdlpConfig from '../configs/ytdlp.config';

const ytdl = create(ytdlpConfig.binaryPath);

async function getInfo (url: string): Promise<VideoInfo | PlaylistInfo> {
	try {
		const json: unknown = await ytdl(url, {
			dumpSingleJson: true,
			flatPlaylist: true,
		});

		const { _type } = baseYouTubeRespone.parse(json);

		return _type === "video" ? videoInfo.parse(json) : playlistInfo.parse(json);
	} catch (e) {
		if (e instanceof Error) {
			if (e.message.includes("Video unavailable")) {
				throw new Error("Video not found");
			}

			if (e.message.includes("playlist does not exist")) {
				throw new Error("Playlist not found");
			}
		}
		throw new Error("Could not get info from YouTube");
	}
}

const ytdlpService = {
	getInfo,
};

export default ytdlpService;
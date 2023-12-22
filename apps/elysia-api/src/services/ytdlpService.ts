import { PlaylistInfo, VideoInfo } from 'types';
import YTDLP from '../utils/ytdlp';
import { BadRequestError } from '../utils/errors';
import { Dict } from "../utils/i18n/types";

const ytdlp = new YTDLP();

async function getVideoInfo (url: string, dict: Dict): Promise<VideoInfo> {
	const ytdlpResult = await ytdlp.getInfo(url, dict);

	if (ytdlpResult._type !== "video") {
		throw new BadRequestError(dict("errors.urlDoesNotPointToAVideo"));
	}

	const formats = ytdlpResult.formats?.map((format) => ({
		formatId: format.format_id,
		format: format.format,
		fileSize: format.filesize,
		formatNote: format.format_note,
		fps: format.fps,
		resolution: format.resolution,
		tbr: format.tbr,
		vbr: format.vbr,
		extension: format.ext,
		videoCodec: format.vcodec,
		audioCodec: format.acodec,
		abr: format.abr,
		container: format.container,
		width: format.width,
		height: format.height
	}));

	return {
		id: ytdlpResult.id,
		url: ytdlpResult.webpage_url,
		title: ytdlpResult.title,
		type: ytdlpResult._type,
		formats: formats || []
	};
}

async function getPlaylistInfo (url: string, dict: Dict): Promise<PlaylistInfo> {
	const ytdlpResult = await ytdlp.getInfo(url, dict);

	if (ytdlpResult._type !== "playlist") {
		throw new BadRequestError(dict("errors.urlDoesNotPointToAPlaylist"));
	}

	const entries = ytdlpResult.entries?.map((entry) => ({
		id: entry.id,
		url: entry.url,
		title: entry.title
	}));

	return {
		id: ytdlpResult.id,
		url: ytdlpResult.webpage_url,
		title: ytdlpResult.title,
		type: ytdlpResult._type,
		entries: entries || []
	};
}

async function getInfo (url: string, dict: Dict): Promise<VideoInfo | PlaylistInfo> {
	const json = await ytdlp.getInfo(url, dict);

	const entries = json.entries?.map((entry) => ({
		id: entry.id,
		url: entry.url,
		title: entry.title
	}));

	const formats = json.formats?.map((format) => ({
		formatId: format.format_id,
		format: format.format,
		fileSize: format.filesize,
		formatNote: format.format_note,
		fps: format.fps,
		resolution: format.resolution,
		tbr: format.tbr,
		vbr: format.vbr,
		extension: format.ext,
		videoCodec: format.vcodec,
		audioCodec: format.acodec,
		abr: format.abr,
		container: format.container,
		width: format.width,
		height: format.height
	}));

	const baseResult = {
		id: json.id,
		url: json.webpage_url,
		title: json.title,
	};

	if (json._type === "video") {
		return {
			...baseResult,
			type: json._type,
			formats: formats || []
		};
	}

	return {
		...baseResult,
		type: json._type,
		entries: entries || []
	};
}

export default {
	getInfo,
	getVideoInfo,
	getPlaylistInfo
};
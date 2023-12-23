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
		channel: ytdlpResult.channel,
		formats: formats || [],
		duration: ytdlpResult.duration!,
		viewCount: ytdlpResult.view_count!,
		thumbnail: ytdlpResult.thumbnail!
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
		title: entry.title,
		channel: entry.channel,
		thumbnail: entry.thumbnails!.find(
			thumbnail => thumbnail.width === Math.max(...entry.thumbnails.map(t => t.width))
		)!.url
	}));

	return {
		id: ytdlpResult.id,
		url: ytdlpResult.webpage_url,
		title: ytdlpResult.title,
		type: ytdlpResult._type,
		channel: ytdlpResult.channel,
		entries: entries || [],
		thumbnail: ytdlpResult.thumbnails!.find(
			thumbnail => thumbnail.width === Math.max(...ytdlpResult.thumbnails!.map(t => t.width!))
		)!.url
	};
}

async function getInfo (url: string, dict: Dict): Promise<VideoInfo | PlaylistInfo> {
	const json = await ytdlp.getInfo(url, dict);

	const entries = json.entries?.map((entry) => ({
		id: entry.id,
		url: entry.url,
		title: entry.title,
		channel: entry.channel,
		thumbnail: entry.thumbnails!.find(
			thumbnail => thumbnail.width === Math.max(...entry.thumbnails.map(t => t.width))
		)!.url
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
		channel: json.channel
	};

	if (json._type === "video") {
		return {
			...baseResult,
			type: json._type,
			formats: formats || [],
			duration: json.duration!,
			viewCount: json.view_count!,
			thumbnail: json.thumbnail!
		};
	}

	return {
		...baseResult,
		type: json._type,
		entries: entries || [],
		thumbnail: json.thumbnails!.find(
			thumbnail => thumbnail.width === Math.max(...json.thumbnails!.map(t => t.width!))
		)!.url
	};
}

export default {
	getInfo,
	getVideoInfo,
	getPlaylistInfo
};
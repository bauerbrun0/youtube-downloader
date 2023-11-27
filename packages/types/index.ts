import { z } from "zod";

export const baseYouTubeRespone = z.object({
	id: z.string(),
	webpage_url: z.string(),
	title: z.string(),
	_type: z.union([
		z.literal("video"),
		z.literal("playlist")
	])
});

export type BaseYouTubeResponse = z.infer<typeof baseYouTubeRespone>;

export const videoFormat = z.object({
	asr: z.number().nullish(),
	filesize: z.number(),
	format_id: z.string().nullish(),
	format_note: z.string().nullish(),
	fps: z.number().nullish(),
	resolution: z.string(),
	tbr: z.number(),
	vbr: z.number().nullish(),
	ext: z.string(),
	vcodec: z.string(),
	acodec: z.string(),
	abr: z.number().nullish(),
	container: z.string().nullish(),
	format: z.string().nullish()
});

export type VideoFormat = z.infer<typeof videoFormat>;

export const videoInfo = baseYouTubeRespone.extend({
	_type: z.literal("video"),
	formats: z.any().array().transform((formats: any[]) => {
		const arr: VideoFormat[] = [];
		formats.forEach((format) => {
			const res = videoFormat.safeParse(format);
			if (res.success) {
				arr.push(res.data);
			}
		});
		return arr;
	})
});

export type VideoInfo = z.infer<typeof videoInfo>;

export const playlistEntry = z.object({
	id: z.string(),
	url: z.string(),
	title: z.string()
});

export type PlaylistEntry = z.infer<typeof playlistEntry>;

export const playlistInfo = baseYouTubeRespone.extend({
	_type: z.literal("playlist"),
	entries: z.any().array().transform((entries: any[]) => {
		const arr: PlaylistEntry[] = [];
		entries.forEach((entry) => {
			const res = playlistEntry.safeParse(entry);
			if (res.success) {
				arr.push(res.data);
			}
		});
		return arr;
	})
});

export type PlaylistInfo = z.infer<typeof playlistInfo>;
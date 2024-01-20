import { Format } from "types";

export function getVideoAndAudioFormats(formats:  Format[]): Format[] {
	const filtered = formats.filter(format => (
		format.resolution !== "audio only" &&
		format.audioCodec && format.audioCodec !== "none"
	));

	return filtered.sort((a, b) => b.width! - a.width!);
}

export function getVideOnlyFormats(formats: Format[]): Format[] {
	const filtered = formats.filter(format => (
		format.resolution !== "audio only" &&
		!format.audioCodec || format.audioCodec === "none" &&
		format.formatNote !== "storyboard"
	));

	return filtered.sort((a, b) => b.width! - a.width!);
}

export function getAudioOnlyFormats(formats: Format[]): Format[] {
	const filtered = formats.filter(format => format.resolution === "audio only");

	const audioQualityMap = new Map([
		["high", 5],
		["Default", 4],
		["medium", 3],
		["low", 2],
		["ultralow", 1]
	]);

	return filtered.sort((a, b) => (
		audioQualityMap.get(b.formatNote || "") || 0) - (audioQualityMap.get(a.formatNote || "") || 0
	));
}

export function getStoryboardFormats(formats: Format[]): Format[] {
	const filtered = formats.filter(format => format.formatNote === "storyboard");

	return filtered.sort((a, b) => b.width! - a.width!);
}
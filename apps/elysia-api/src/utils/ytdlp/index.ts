import ytdlpConfig from "../../configs/ytdlp.config";
import { Value } from "@sinclair/typebox/value";
import { ytdlpResult, YTDLPResult } from "./types";
import { BadRequestError, InternalError, NotFoundError } from "../errors";
import { fallbackDict } from "../i18n";
import { Dict } from "../i18n/types";

export default class YTDLP {
	binaryPath: string;

	constructor() {
		this.binaryPath = ytdlpConfig.binaryPath;
	}

	public async _getInfo(url: string): Promise<{ stdout: any, stderr: string }> {
		const proc = Bun.spawn([ this.binaryPath, url,
			"--dump-single-json",
			"--flat-playlist",
			"--no-warnings",
		], {
			stdout: "pipe",
			stderr: "pipe"
		});

		const stdout = await Bun.readableStreamToJSON(proc.stdout);
		const stderr = await Bun.readableStreamToText(proc.stderr);

		return { stdout, stderr };
	}

	public async getInfo(url: string, dict: Dict = fallbackDict): Promise<YTDLPResult> {
		const { stdout, stderr } = await this._getInfo(url);
		if (stderr && (
			stderr.includes("Video unavailable") ||
			stderr.includes("playlist does not exist") || 
			stderr.includes("non-existent")
		)) {
			throw new NotFoundError(dict("errors.videoOrPlaylistWasNotFound"));
		}

		if (stderr && stderr.includes("HTTP Error 404: Not Found")) {
			throw new BadRequestError(dict("errors.invalidRequestURL"));
		}

		if (stderr) {
			throw new InternalError(dict("errors.errorOccurredWhileGettingInfoFromYouTube"));
		}

		if (!Value.Check(ytdlpResult, stdout)) {
			throw new InternalError(dict("errors.errorOccurredWhileParsingTheResponseFromYouTube"));
		}

		return Value.Decode(ytdlpResult, stdout);
	}
}
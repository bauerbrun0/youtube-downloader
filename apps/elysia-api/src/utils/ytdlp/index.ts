import ytdlpConfig from "../../configs/ytdlp.config";
import { Value } from "@sinclair/typebox/value";
import { ytdlpResult, YTDLPResult } from "./types";
import { InternalError, NotFoundError } from "../errors";

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

	public async getInfo(url: string): Promise<YTDLPResult> {
		const { stdout, stderr } = await this._getInfo(url);
		
		if (stderr && (
			stderr.includes("Video unavailable") ||
			stderr.includes("playlist does not exist") ||
			stderr.includes("not-a-path")
		)) {
			throw new NotFoundError("The requested video or playlist was not found");
		}

		if (stderr) {
			throw new InternalError("An error occurred while getting info from YouTube");
		}

		if (!Value.Check(ytdlpResult, stdout)) {
			throw new InternalError("An error occurred while parsing the response from YouTube");
		}

		return Value.Decode(ytdlpResult, stdout);
	}
}
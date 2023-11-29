import ytdlpConfig from "../../configs/ytdlp.config";
import { Value } from "@sinclair/typebox/value";
import { ytdlpResult, YTDLPResult } from "./types";
import { InternalError, NotFoundError } from "../errors";

export default class YTDLP {
	binaryPath: string;

	constructor() {
		this.binaryPath = ytdlpConfig.binaryPath;
	}

	public async getInfo(url: string): Promise<YTDLPResult> {
		const proc = Bun.spawn([
			this.binaryPath, url, "--dump-single-json", "--flat-playlist"
		], {
			stdout: "pipe",
			stderr: "pipe"
		});
		
		const stdout: unknown = await Bun.readableStreamToJSON(proc.stdout);
		const stderr = await Bun.readableStreamToText(proc.stderr);
		
		if (stderr && (stderr.includes("Video unavailable") || stderr.includes("playlist does not exist"))) {
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
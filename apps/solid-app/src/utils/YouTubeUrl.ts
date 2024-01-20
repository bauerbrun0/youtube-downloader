import { store } from "../store";

export default class YouTubeUrl {
	private _url: URL;

	constructor(youTubeUrl: string) {
		this._url = this._checkYouTubeUrl(youTubeUrl);
	}

	get url(): URL {
		return this._url;
	}

	get encodedPath(): string {
		const { hostname, pathname, search } = this._url;
		// remove the leading slash, otherwise encodeURIComponent() will encode it
		const path = pathname.slice(1);

		let fullPath = path + search;
		// if hostname is youtu.be, then watch?v= is missing from the path
		// (eg. https://youtu.be/dQw4w9WgXcQ)
		if (hostname === "youtu.be") {
			fullPath = "watch?v=" + fullPath;
		}

		return encodeURIComponent(fullPath);
	}

	private _checkYouTubeUrl(youTubeUrl: string): URL {
		if (youTubeUrl === "") {
			throw new Error(store.dict("errors.emptyUrl"));
		}

		let url: URL;
		try {
			url = new URL(youTubeUrl);
		} catch (error) {
			throw new Error(store.dict("errors.invalidUrl"));
		}

		// check protocol
		const validProtocols = ["http:", "https:"];
		if (!validProtocols.includes(url.protocol)) {
			throw new Error(store.dict("errors.invalidProtocol"));
		}

		// check hostname
		const validHostnames = ["www.youtube.com", "youtube.com", "m.youtube.com", "youtu.be"];
		if (!validHostnames.includes(url.hostname)) {
			throw new Error(store.dict("errors.invalidHostname"));
		}

		return url;
	}
}
import { store } from "../store";

export function formatSeconds(seconds: number): string {
	const h = Math.floor(seconds / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	const s = Math.floor(seconds % 60);

	return `${
		h > 0 ? `${h}${store.dict("hourShorthand")} ` : ""
	}${
		m > 0 ? `${m}${store.dict("minuteShorthand")} ` : ""
	}${
		`${s}${store.dict("secondShorthand")}`
	}`;
}

export function formatViewCount(viewCount: number): string {
	if (viewCount / 1_000_000 >= 1) {
		return `${+(viewCount / 1_000_000).toFixed(2)} ${store.dict("millionShorthand")}`;
	}
	if (viewCount / 1_000 >= 1) {
		return `${+(viewCount / 1_000).toFixed(2)} ${store.dict("thousandShorthand")}`;
	}

	return viewCount.toLocaleString();
}
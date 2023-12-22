import Elysia from "elysia";
import i18n from "i18next";
import { dictionary as en_dict } from "./locales/en";
import { dictionary as hu_dict } from "./locales/hu";
import { Dict } from "./types";

const i18nOptions = {
	fallbackLng: "en",
	resources: {
		en: { translation: en_dict },
		hu: { translation: hu_dict }
	}
};
const locales = Object.keys(i18nOptions.resources);

await i18n.init(i18nOptions);

const dicts = new Map<string, Dict>(locales.map(locale => [locale, i18n.getFixedT(locale)]));
const fallbackDict: Dict = i18n.getFixedT(i18nOptions.fallbackLng);

function getDict(requestUrl: string): Dict {
	const url = new URL(requestUrl);
	const detectedLocale = url.searchParams.get("lang");

	if (!detectedLocale || !locales.includes(detectedLocale)) {
		return fallbackDict;
	}

	return dicts.get(detectedLocale)!;
} 

export default new Elysia()
	.derive(({ request }) => ({ dict: getDict(request.url) }));

export { fallbackDict, getDict };
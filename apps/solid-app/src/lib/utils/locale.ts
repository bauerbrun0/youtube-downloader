import { Dict, Locale, RawDict } from "../types";
import { flatten, translator } from "@solid-primitives/i18n";

export function getBrowserLocale(): Locale {
	const locale = navigator.language;
	if (locale.includes("hu")) return "hu";
	return "en";
}

export function getStoredLocale(): Locale | null {
	const locale = localStorage.getItem("locale");
	if (!locale) return null;
	if (locale !== "hu" && locale !== "en") return null;
	return locale;
}

export function getInitialLocale(): Locale {
	const locale = getStoredLocale();
	return locale === null ? getBrowserLocale() : locale;
}

export async function fetchDictionary(locale: Locale): Promise<Dict> {
	const rawDict: RawDict = (await import(`../i18n/${locale}.ts`)).dict;
	const dict: Dict = translator(() => flatten(rawDict));
	return dict;
}

export async function getInitialDict(): Promise<Dict> {
	const locale = getInitialLocale();
	const dict = await fetchDictionary(locale);
	return dict;
}


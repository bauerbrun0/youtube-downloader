import { flatten, translator } from "@solid-primitives/i18n";
import { Flatten, Translator } from "@solid-primitives/i18n";
import { dict } from "./dictionaries/en";

export type Locale = "en" | "hu";

export type RawDict = typeof dict;
export type FlatDict = Flatten<RawDict>;
export type Dict = Translator<FlatDict>;

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
	const rawDict: RawDict = (await import(`./dictionaries/${locale}.ts`)).dict;
	const dict: Dict = translator(() => flatten(rawDict));
	return dict;
}

export async function getInitialDict(): Promise<Dict> {
	const locale = getInitialLocale();
	const dict = await fetchDictionary(locale);
	return dict;
}


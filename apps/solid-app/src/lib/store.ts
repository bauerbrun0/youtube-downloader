import { createStore } from "solid-js/store";
import { fetchDictionary, getBrowserLocale, getInitialLocale, getInitialDict } from "./utils/locale";
import { isThemeStored, getSystemTheme, getInitialTheme } from "./utils/theme";
import { Dict, Locale, Theme } from "./types";

type Store = {
	theme: Theme;
	usingSystemTheme: boolean;
	locale: Locale;
	browserLocale: Locale;
	dict: Dict;
};

const [store, setStore] = createStore<Store>({
	theme: getInitialTheme(),
	usingSystemTheme: !isThemeStored(),
	locale: getInitialLocale(),
	browserLocale: getBrowserLocale(),
	dict: await getInitialDict(),
});

export { store };

export function changeTheme(theme: Theme) {
	setStore("theme", theme);
	setStore("usingSystemTheme", false);
	localStorage.setItem("theme", theme);
}

export function useSystemTheme() {
	setStore("theme", getSystemTheme());
	setStore("usingSystemTheme", true);
	localStorage.removeItem("theme");
}

export async function changeLanguage(locale: Locale) {
	const dict = await fetchDictionary(locale);
	setStore("dict", () => dict);

	setStore("locale", locale);

	if (locale !== store.browserLocale) localStorage.setItem("locale", locale);
	else localStorage.removeItem("locale");
}

export type Theme = "light" | "dark";

export function getSystemTheme(): Theme {
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getStoredTheme(): Theme | null {
	const theme = localStorage.getItem("theme");
	if (!theme) return null;
	if (theme !== "dark" && theme !== "light") return null;
	return theme;
}

export function isThemeStored(): boolean {
	const theme = localStorage.getItem("theme");
	return theme !== null && (theme === "dark" || theme === "light");
}

export function getInitialTheme(): Theme {
	const theme = getStoredTheme();
	return theme === null ? getSystemTheme() : theme;
}
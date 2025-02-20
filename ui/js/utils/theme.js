import Cookies from "js-cookie";

export function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getStoredTheme() {
    const theme = Cookies.get("theme");
    if (!theme) {
        return "system";
    }
    if (theme !== "system" && theme !== "dark" && theme !== "light") {
        return "system";
    }

    return theme;
}

export function setStoredTheme(theme) {
    Cookies.set("theme", theme)
}

export function toggleHtmlDarkClass(theme) {
    document.getElementsByTagName("html")[0].classList.toggle("dark", theme === "dark");
}
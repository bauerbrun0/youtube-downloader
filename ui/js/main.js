import Alpine from "alpinejs"
import htmx from "htmx.org";
import { getStoredTheme, getSystemTheme, setStoredTheme } from "./utils/theme.js";

window.Alpine = Alpine;
window.htmx = htmx;

Alpine.store("languageDropdown", false);
Alpine.store("themeDropdown", false);
Alpine.store('theme', {
    current: "system",
    actual: "dark",

    switchTheme(theme) {
        this.current = theme;
        this.actual = this.getActualTheme();
        setStoredTheme(theme);
    },

    init() {
        this.current = getStoredTheme();
        this.actual = this.getActualTheme();
    },

    getActualTheme() {
        if (this.current === "system") {
            return getSystemTheme();
        } else {
            return this.current;
        }
    }
});

Alpine.effect(() => {
    const theme = JSON.parse(JSON.stringify(Alpine.store("theme")));
    document.getElementsByTagName("html")[0].classList.toggle("dark", theme.actual === "dark");
});

Alpine.start();

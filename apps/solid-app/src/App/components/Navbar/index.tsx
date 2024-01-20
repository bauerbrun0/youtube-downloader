import logo from "../../../assets/logo.svg";
import US from "../../../components/icons/flags/UnitedStates";
import HU from "../../../components/icons/flags/Hungarian";
import SunIcon from "../../../components/icons/Sun";
import MoonIcon from "../../../components/icons/Moon";
import ChevronIcon from "../../../components/icons/Chevron";

import { store } from "../../../store";
import { Match, Show, Switch, createSignal } from "solid-js";
import ThemeDropdown from "./ThemeDropdown";
import LocaleDropdown from "./LocaleDropdown";

export default function Navbar() {
	const [themeDropdownOpen, setThemeDropdownOpen] = createSignal(false);
	const [localeDropdownOpen, setLocaleDropdownOpen] = createSignal(false);
	const toggleThemeDropdown = () => setThemeDropdownOpen(!themeDropdownOpen());
	const toggleLocaleDropdown = () => setLocaleDropdownOpen(!localeDropdownOpen());

	return (
		<div class="sticky top-0 z-50 h-[55px] sm:h-[65px] xl:h-[70px] bg-background dark:bg-background-dark">
			<div class="mx-auto h-full 2xl:max-w-screen-2xl 2xl:min-w-screen-2xl flex items-center py-2 px-2 xl:py-3">
				<a href="/"	class="mr-2 sm:mr-4" >
					<img src={logo} class="h-10 sm:h-12"/>
				</a>
				<a href="/">
					<h1 class="text-xl font-bold">YouTube Downloader</h1>
				</a>
				<div class="relative ml-auto flex items-center space-x-4 md:space-x-8">
					<button onClick={toggleThemeDropdown}>
						<Switch>
							<Match when={store.theme === "dark"}>
								<MoonIcon class="h-6 w-6 text-text dark:text-text-dark stroke-[1.5px]" />
							</Match>
							<Match when={store.theme === "light"}>
								<SunIcon class="h-6 w-6 text-text dark:text-text-dark stroke-[1.5px]" />
							</Match>
						</Switch>
					</button>
					<button
						class="flex items-center space-x-1"
						onClick={toggleLocaleDropdown}
					>
						<Switch>
							<Match when={store.locale === "en"}>
								<US class="h-6 w-6" />
							</Match>
							<Match when={store.locale === "hu"}>
								<HU class="h-6 w-6" />
							</Match>
						</Switch>
						<ChevronIcon class={`
							h-6 text-text dark:text-text-dark stroke-[1.5px]
							${localeDropdownOpen() ? "rotate-180" : ""}
							hidden sm:block
						`} />
					</button>
					<Show when={themeDropdownOpen()}>
						<ThemeDropdown closeDropDown={toggleThemeDropdown} />
					</Show>
					<Show when={localeDropdownOpen()}>
						<LocaleDropdown closeDropDown={toggleLocaleDropdown} />
					</Show>
				</div>
				
			</div>
			<hr class="border-secondary dark:border-secondary-dark" />
		</div>
	);
}
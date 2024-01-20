import SunIcon from "../../../components/icons/Sun";
import MoonIcon from "../../../components/icons/Moon";
import MonitorIcon from "../../../components/icons/Monitor";

import { store, changeTheme, useSystemTheme } from "../../../store";
import { createMemo, onMount } from "solid-js";
import { registerOnClickOutside } from "../../../utils/dom";

export default function ThemeDropdown(props: { closeDropDown: () => void  }) {

	let ref: HTMLDivElement;

	onMount(() => registerOnClickOutside(ref, props.closeDropDown));

	const selectedTheme = createMemo(() => store.usingSystemTheme ? "system" : store.theme);

	const onLightClick = () => {
		changeTheme("light");
		props.closeDropDown();
	};

	const onDarkClick = () => {
		changeTheme("dark");
		props.closeDropDown();
	};

	const onSystemClick = () => {
		useSystemTheme();
		props.closeDropDown();
	};

	return (
		<div
			ref={ref!}
			class="
				absolute top-full right-0 2xl:right-1/2 2xl:translate-x-1/2
				flex flex-col space-y-1
				border rounded-md mt-6 md:mt-8 py-2 border-secondary bg-background
				dark:border-secondary-dark dark:bg-background-dark
			"
		>
			<button
				onClick={onLightClick}
				class="flex items-center space-x-2 p-1 pr-8 hover:bg-neutral-200 dark:hover:bg-neutral-800"
			>
				<SunIcon class={`
					h-6 w-6 mx-1 text-text dark:text-text-dark
					${selectedTheme() === "light" ? "stroke-2" : "stroke-[1.5px]"}
				`} />
				<span class={selectedTheme() === "light" ? "font-bold" : ""}>{store.dict("light")}</span>
			</button>
			<button
				onClick={onDarkClick}
				class="flex items-center space-x-2 p-1 pr-8 hover:bg-neutral-200 dark:hover:bg-neutral-800"
			>
				<MoonIcon class={`
					h-6 w-6 mx-1 text-text dark:text-text-dark
					${selectedTheme() === "dark" ? "stroke-2" : "stroke-[1.5px]"}
				`} />
				<span class={selectedTheme() === "dark" ? "font-bold" : ""}>{store.dict("dark")}</span>
			</button>
			<button
				onClick={onSystemClick}
				class="flex items-center space-x-2 p-1 pr-8 hover:bg-neutral-200 dark:hover:bg-neutral-800"
			>
				<MonitorIcon class={`
					h-6 w-6 mx-1 text-text dark:text-text-dark
					${selectedTheme() === "system" ? "stroke-2" : "stroke-[1.5px]"}
				`} />
				<span class={selectedTheme() === "system" ? "font-bold" : ""}>{store.dict("system")}</span>
			</button>
		</div>
	);
}
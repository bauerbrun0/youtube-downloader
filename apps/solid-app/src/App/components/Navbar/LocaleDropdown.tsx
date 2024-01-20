import US from "../../../components/icons/flags/UnitedStates";
import HU from "../../../components/icons/flags/Hungarian";

import { onMount } from "solid-js";
import { registerOnClickOutside } from "../../../utils/dom";
import { store, changeLanguage } from "../../../store";


export default function LocaleDropdown(props: { closeDropDown: () => void }) {
	let ref: HTMLDivElement;

	onMount(() => registerOnClickOutside(ref, props.closeDropDown));

	const onEnglishClick = () => {
		changeLanguage("en");
		props.closeDropDown();
	};

	const onHungarianClick = () => {
		changeLanguage("hu");
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
				onClick={onEnglishClick}
				class="flex items-center space-x-2 p-1 pr-16 hover:bg-neutral-200 dark:hover:bg-neutral-800"
			>
				<US class="h-6 w-6 mx-1" />
				<span class={store.locale === "en" ? "font-bold" : ""}>English</span>
			</button>
			<button
				onClick={onHungarianClick}
				class="flex items-center space-x-2 p-1 pr-16 hover:bg-neutral-200 dark:hover:bg-neutral-800"
			>
				<HU class="h-6 w-6 mx-1" />
				<span class={store.locale === "hu" ? "font-bold" : ""}>Magyar</span>
			</button>
		</div>
	);
}
import { Quality } from 'types';
import CheckIcon from '../../../components/icons/Check';
import { store } from '../../../store';

function Option(props: {
	value: string,
	isSelected: boolean,
	onClick: () => void,
	disabled?: boolean
}) {
	return (
		<button
			class={`
				border border-secondary dark:border-secondary-dark
				${props.isSelected && " bg-red-200 dark:bg-red-950 dark:border-primary-dark "}
				first:rounded-l-lg last:rounded-r-lg
				first:border-r-0
				py-1 pr-3
				flex flex-row items-center
			`}
			onClick={() => props.onClick()}
			disabled={props.disabled}
		>
			<CheckIcon class={`h-4 w-4 mx-1 stroke-2 ${!props.isSelected && "invisible"}`}/>
			{props.value}
		</button>
	);
}

export default function QualityToggle(props: {
	selected: Quality,
	setSelected: (quality: Quality) => void,
	kind: "video" | "audio",
	disabled?: boolean
}) {
	return (
		<div class="flex flex-row my-2 text-sm">
			<Option
				value={`${store.dict("best")} ${props.kind === "video" ? store.dict("video") : store.dict("audio")}`}
				isSelected={props.selected === "best"}
				onClick={() => props.setSelected("best")}
				disabled={props.disabled}
			/>
			<Option
				value={`${store.dict("worst")} ${props.kind === "video" ? store.dict("video") : store.dict("audio")}`}
				isSelected={props.selected === "worst"}
				onClick={() => props.setSelected("worst")}
				disabled={props.disabled}
			/>
		</div>
	);
}
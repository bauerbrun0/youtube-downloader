import { Accessor, JSX, JSXElement, Setter, Show, createSignal, onMount } from "solid-js";
import { store } from "../../../store";
import Spinner from "../../../components/Spinner";

function TableHeader(props: {
	setRef: Setter<HTMLDivElement | undefined>,
	bodyRef: Accessor<HTMLDivElement | undefined>,
	isSyncingBodyScroll: Accessor<boolean>,
	setIsSyncingScroll: Setter<boolean>,
	children: JSX.Element
}) {
	let ref: HTMLDivElement | undefined = undefined;
	
	onMount(() => {
		props.setRef(ref);
		ref!.onscroll = () => {
			if (props.bodyRef() && !props.isSyncingBodyScroll()) {
				props.setIsSyncingScroll(true);
				props.bodyRef()!.scrollLeft = ref!.scrollLeft;
			}
			props.setIsSyncingScroll(false);
		};
	});

	return (
		<div ref={ref} class="overflow-x-auto overscroll-x-none sticky top-[54px] sm:top-[64px] xl:top-[69px] z-20">
			<div class="w-[1520px]">
				<div class="
						bg-white dark:bg-background-dark 
						border-t border-secondary dark:border-secondary-dark
						w-full
				">
					{props.children}
				</div>
			</div>
		</div>
	);
}

function TableBody(props : {
	setRef: Setter<HTMLDivElement | undefined>,
	headerRef: Accessor<HTMLDivElement | undefined>,
	isSyncingHeaderScroll: Accessor<boolean>,
	setIsSyncingScroll: Setter<boolean>,
	children: JSXElement
}) {
	let ref: HTMLDivElement | undefined = undefined;

	onMount(() => {
		props.setRef(ref);
		ref!.onscroll = () => {
			if (props.headerRef() && !props.isSyncingHeaderScroll()) {
				props.setIsSyncingScroll(true);
				props.headerRef()!.scrollLeft = ref!.scrollLeft;
			}
			props.setIsSyncingScroll(false);
		};
	});

	return (
		<div ref={ref} class="overflow-x-auto overscroll-x-none">
			<div class="w-[1520px]">
				{props.children}
			</div>
		</div>
	);
}

export function FormatRow(props: { children: JSX.Element }) {
	return (
		<div class="
			grid grid-flow-col grid-cols-[repeat(13,_minmax(0,_1fr))] p-3 md:p-4 gap-1
			border-b border-secondary dark:border-secondary-dark
		">
			{props.children}
		</div>
	);
}

export function EntryRow(props: { children: JSX.Element }) {
	return (
		<div class="
			grid grid-flow-col grid-cols-[25px_2fr_3fr_2fr_2fr_2fr_200px] p-3 md:p-4 gap-5
			border-b border-secondary dark:border-secondary-dark
		">
			{props.children}
		</div>
	);
}

function HeaderColumn(props: { children: JSX.Element }) {
	return (
		<div class="font-bold flex items-center">
			{props.children}
		</div>
	);
}

export function Button(props: { onClick?: () => void, loading?: boolean, disabled?: boolean, children: JSX.Element }) {
	return (
		<button
			class="
				w-fit max-w-full px-3 py-2 font-bold border rounded-xl
				bg-white dark:bg-secondary-dark 
				text-text dark:text-text-dark
				border-secondary dark:border-none
				md:hover:bg-primary md:dark:hover:bg-primary-dark
				active:hover:bg-primary active:dark:hover:bg-primary-dark
				md:hover:text-white active:hover:text-white
				disabled:cursor-wait
				disabled:hover:bg-white dark:disabled:hover:bg-secondary-dark
				disabled:hover:text-text dark:disabled:hover:text-text-dark
			"
			// eslint-disable-next-line solid/reactivity
			onClick={props.onClick}
			disabled={props.disabled}
		>
			<div class="flex items-center space-x-2 w-fit mx-auto">
				<span>{props.children}</span>
				<Show when={props.loading}>
					<Spinner class="h-4 w-4 fill-white text-neutral-600"/>
				</Show>
			</div>
		</button>
	);
}

export function ExtensionBadge(props: { children: JSX.Element }) {
	return (
		<div
			class="bg-primary text-white w-fit px-1 py-0.5 font-bold rounded-md text-sm h-fit"
		>
			{props.children}
		</div>
	);
}

export function FileSizeBadge(props: { children: JSX.Element }) {
	return (
		<div
			class="font-mono bg-secondary dark:bg-secondary-dark px-2 py-1 rounded-md w-fit"
		>
			{props.children}
		</div>
	);
}

export function ThumbnailImage(props: { src: string }) {
	return (
		<img class="aspect-video rounded-xl w-full object-cover" src={props.src}/>
	);
}

export function CheckBox(props: { onChange?: () => void, checked: Accessor<boolean>, header?: boolean, }) {
	return (
		<div class={`flex items-center relative h-fit ${props.header ? "z-30" : "z-10"}`}>
			<input
				type="checkbox"
				class="
					appearance-none w-4 h-4 bg-background dark:bg-background-dark border-2 border-text dark:border-text-dark rounded-sm
					checked:bg-primary dark:checked:bg-primary-dark checked:border-none
					hover:cursor-pointer disabled:cursor-wait
					peer
				"
				checked={props.checked()}
				// eslint-disable-next-line solid/reactivity
				onChange={props.onChange}
			/>
			<svg
				class="
					absolute 
					w-4 h-4 top-0
					hidden peer-checked:block
					pointer-events-none m-0
					stroke-white
				"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="4"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<polyline points="20 6 9 17 4 12"/>
			</svg>
		</div>
	);
}

export function VideoFormatsTable(props: { children: JSX.Element }) {
	const [headerRef, setHeaderRef] = createSignal<HTMLDivElement>();
	const [bodyRef, setBodyRef] = createSignal<HTMLDivElement>();
	const [isSyncingHeaderScroll, setIsSyncingHeaderScroll] = createSignal<boolean>(false);
	const [isSyncingBodyScroll, setIsSyncingBodyScroll] = createSignal<boolean>(false);
	
	return (
		<div>
			<TableHeader
				setRef={setHeaderRef}
				bodyRef={bodyRef}
				isSyncingBodyScroll={isSyncingBodyScroll}
				setIsSyncingScroll={setIsSyncingHeaderScroll}
			>
				<FormatRow>
					<HeaderColumn>{store.dict("id")}</HeaderColumn>
					<HeaderColumn>{store.dict("resolution")}</HeaderColumn>
					<HeaderColumn>{store.dict("note")}</HeaderColumn>
					<HeaderColumn>{store.dict("extension")}</HeaderColumn>
					<HeaderColumn>{store.dict("container")}</HeaderColumn>
					<HeaderColumn>{store.dict("videoCodec")}</HeaderColumn>
					<HeaderColumn>{store.dict("audioCodec")}</HeaderColumn>
					<HeaderColumn>{store.dict("fileSize")}</HeaderColumn>
					<HeaderColumn>{store.dict("fps")}</HeaderColumn>
					<HeaderColumn>{store.dict("tbr")}</HeaderColumn>
					<HeaderColumn>{store.dict("vbr")}</HeaderColumn>
					<HeaderColumn>{store.dict("abr")}</HeaderColumn>
					<HeaderColumn> </HeaderColumn>
				</FormatRow>
			</TableHeader>
			<TableBody
				setRef={setBodyRef}
				headerRef={headerRef}
				isSyncingHeaderScroll={isSyncingHeaderScroll}
				setIsSyncingScroll={setIsSyncingBodyScroll}
			>
				{props.children}
			</TableBody>
		</div>
	);
}

export function PlaylistEntriesTable(props: {
	children: JSX.Element,
	onChangeSelectAll: () => void,
	selectAllChecked: Accessor<boolean> 
}) {
	const [headerRef, setHeaderRef] = createSignal<HTMLDivElement>();
	const [bodyRef, setBodyRef] = createSignal<HTMLDivElement>();
	const [isSyncingHeaderScroll, setIsSyncingHeaderScroll] = createSignal<boolean>(false);
	const [isSyncingBodyScroll, setIsSyncingBodyScroll] = createSignal<boolean>(false);
	
	return (
		<div>
			<TableHeader
				setRef={setHeaderRef}
				bodyRef={bodyRef}
				isSyncingBodyScroll={isSyncingBodyScroll}
				setIsSyncingScroll={setIsSyncingHeaderScroll}
			>
				<EntryRow>
					<HeaderColumn>
						<CheckBox checked={props.selectAllChecked} onChange={props.onChangeSelectAll} header={true}/>
					</HeaderColumn>
					<HeaderColumn>{store.dict("thumbnail")}</HeaderColumn>
					<HeaderColumn>{store.dict("title")}</HeaderColumn>
					<HeaderColumn>{store.dict("duration")}</HeaderColumn>
					<HeaderColumn>{store.dict("views")}</HeaderColumn>
					<HeaderColumn>{store.dict("channel")}</HeaderColumn>
					<HeaderColumn> </HeaderColumn>
				</EntryRow>
			</TableHeader>
			<TableBody
				setRef={setBodyRef}
				headerRef={headerRef}
				isSyncingHeaderScroll={isSyncingHeaderScroll}
				setIsSyncingScroll={setIsSyncingBodyScroll}
			>
				{props.children}
			</TableBody>
		</div>
	);
}
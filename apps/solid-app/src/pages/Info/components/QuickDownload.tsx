import { createSignal, Match, Show, Switch } from 'solid-js';
import { Quality } from 'types';
import FilmIcon from '../../../components/icons/Film';
import HeadphoneIcon from '../../../components/icons/Headphone';
import VideoIcon from '../../../components/icons/Video';
import Spinner from '../../../components/Spinner';
import { store } from '../../../store';
import QualityToggle from './QualityToggle';

function DownloadButton(props: { onClick: () => void, loading?: boolean, disabled?: boolean  }) {
	return (
		<button
			class="
				w-full mt-auto px-3 py-2 font-bold border rounded-xl
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
			onClick={() => props.onClick()}
			disabled={props.disabled}
		>
			<div class="flex items-center space-x-2 w-fit mx-auto">
				<span>{store.dict("download")}</span>
				<Show when={props.loading}>
					<Spinner class="h-4 w-4 fill-white text-neutral-600"/>
				</Show>
			</div>
		</button>
	);
}

function QuickDownload(props: {
	stream: "video" | "audio" | "both",
	badge?: string
	onClickDownload: (qualities: {videoQuality: Quality, audioQuality: Quality}, setLoading: (loading: boolean) => void) => void,
	disabled?: boolean
}) {
	const [videoQuality, setVideoQuality] = createSignal<Quality>("best");
	const [audioQuality, setAudioQuality] = createSignal<Quality>("best");

	const [loading, setLoading] = createSignal(false);

	return (
		<div class="border border-secondary dark:border-secondary-dark rounded-lg p-3 flex flex-col">
			<div class="flex items-center place-content-between">
				<div class="flex flex-row items-center space-x-2">
					<h3 class="text-xl font-semibold">
						<Switch>
							<Match when={props.stream === "both"}>{store.dict("videoAndAudio")}</Match>
							<Match when={props.stream === "video"}>{store.dict("video")}</Match>
							<Match when={props.stream === "audio"}>{store.dict("audio")}</Match>
						</Switch>
					</h3>
					<Show when={props.badge}>
						<div class="bg-primary text-white text-xs rounded-md py-0.5 px-1 font-bold">{props.badge}</div>
					</Show>
				</div>
				<Switch>
					<Match when={props.stream === "both"}>
						<FilmIcon class="stroke-text stroke-[1.5px] w-7 h-7 dark:stroke-text-dark"/>
					</Match>
					<Match when={props.stream === "video"}>
						<VideoIcon class="stroke-text stroke-[1.5px] w-7 h-7 dark:stroke-text-dark"/>
					</Match>
					<Match when={props.stream === "audio"}>
						<HeadphoneIcon class="stroke-text stroke-[1.5px] w-7 h-7 dark:stroke-text-dark"/>
					</Match>
				</Switch>
			</div>
			<div class="flex flex-col md:flex-row md:space-x-3 my-3">
				<Show when={props.stream === "video" || props.stream === "both"}>
					<QualityToggle selected={videoQuality()} setSelected={setVideoQuality} kind="video" disabled={props.disabled}/>
				</Show>
				<Show when={props.stream === "audio" || props.stream === "both"}>
					<QualityToggle selected={audioQuality()} setSelected={setAudioQuality} kind="audio" disabled={props.disabled}/>
				</Show>
			</div>
			<DownloadButton
				onClick={() => props.onClickDownload({videoQuality: videoQuality(), audioQuality: audioQuality()}, setLoading)}
				loading={loading()}
				disabled={props.disabled}
			/>
		</div>
	);
}

export function QuickDownloadAudio(props: {
	badge?: string,
	onClickDownload: (audioQuality: Quality, setLoading: (loading: boolean) => void) => void,
	disabled?: boolean
}) {
	return <QuickDownload
		stream="audio"
		badge={props.badge}
		onClickDownload={({ audioQuality }, setLoading) => props.onClickDownload(audioQuality, setLoading)}
		disabled={props.disabled}
	/>;
}

export function QuickDownloadVideoAndAudio(props: {
	badge?: string,
	onClickDownload: (videoQuality: Quality, audioQuality: Quality, setLoading: (loading: boolean) => void) => void,
	disabled?: boolean
}) {
	return <QuickDownload
		stream="both"
		badge={props.badge}
		onClickDownload={({ videoQuality, audioQuality }, setLoading) => props.onClickDownload(videoQuality, audioQuality, setLoading)}
		disabled={props.disabled}
	/>;
}
import { PlaylistEntry, PlaylistInfo, Quality } from "types";
import { store } from "../../store";
import Header from "./components/Header";
import { QuickDownloadAudio, QuickDownloadVideoAndAudio } from "./components/QuickDownload";
import { Button, CheckBox, EntryRow, PlaylistEntriesTable, ThumbnailImage } from "./components/Table";
import { For, createEffect, createMemo, createSignal } from "solid-js";
import { A } from "@solidjs/router";
import { formatSeconds, formatViewCount } from "../../utils/string";

export default function Playlist(props: { playlist: PlaylistInfo, animate: boolean }) {
	const [downloadDisabled, setDownloadDisabled] = createSignal(false);
	const [selectAllChecked, setSelectAllChecked] = createSignal(true);
	// eslint-disable-next-line solid/reactivity
	const [checkedStates, setCheckedStates] = createSignal<boolean[]>(new Array(props.playlist.entries.length).fill(true));

	const selectedEntries = createMemo<{ entry: PlaylistEntry, entryIndex: number }[]>(() => {
		let result: { entry: PlaylistEntry, entryIndex: number }[] = [];

		props.playlist.entries.forEach((entry, index) => {
			if (checkedStates()[index]) {
				result.push({ entry, entryIndex: index });
			}
		});

		return result;
	});

	// syncing select all checkbox
	createEffect(() => {
		if (checkedStates().includes(false)) {
			setSelectAllChecked(false);
		} else {
			setSelectAllChecked(true);
		}
	});

	function onClickDownloadVideoAndAudio (videoQuality: Quality, audioQuality: Quality, setLoading: (loading: boolean) => void) {
		console.log(`Downloading video: ${videoQuality} and audio: ${audioQuality}`);
		console.log(`Entries: ${JSON.stringify(selectedEntries().map((v) => ({ index: v.entryIndex, title: v.entry.title })))}`);
		setLoading(true);
		setDownloadDisabled(true);
		setTimeout(() => {
			setLoading(false);
			setDownloadDisabled(false);
		}, 2000);
	}

	function onClickDownloadVideoAndAudioMp4(videoQuality: Quality, audioQuality: Quality, setLoading: (loading: boolean) => void) {
		console.log(`Downloading video: ${videoQuality} and audio: ${audioQuality}; mp4`);
		console.log(`Entries: ${JSON.stringify(selectedEntries().map((v) => ({ index: v.entryIndex, title: v.entry.title })))}`);
		setLoading(true);
		setDownloadDisabled(true);
		setTimeout(() => {
			setLoading(false);
			setDownloadDisabled(false);
		}, 2000);
	}

	function onClickDownloadAudio(audioQuality: Quality, setLoading: (loading: boolean) => void) {
		console.log(`Downloading audio: ${audioQuality}`);
		console.log(`Entries: ${JSON.stringify(selectedEntries().map((v) => ({ index: v.entryIndex, title: v.entry.title })))}`);
		setLoading(true);
		setDownloadDisabled(true);
		setTimeout(() => {
			setLoading(false);
			setDownloadDisabled(false);
		}, 2000);
	}

	function onClickDownloadAudioMp3(audioQuality: Quality, setLoading: (loading: boolean) => void) {
		console.log(`Downloading audio: ${audioQuality}; mp3`);
		console.log(`Entries: ${JSON.stringify(selectedEntries().map((v) => ({ index: v.entryIndex, title: v.entry.title })))}`);
		setLoading(true);
		setDownloadDisabled(true);
		setTimeout(() => {
			setLoading(false);
			setDownloadDisabled(false);
		}, 2000);
	}

	return (
		<div class={`w-full ${props.animate ? "animate-fade" : ""}`}>
			<Header
				title={props.playlist.title}
				details={`${props.playlist.channel} • ${props.playlist.entries.length} ${store.dict("playlistEntryCount")}`}
				thumbnailSrc={props.playlist.thumbnail}
			/>
			<div class="mx-auto 2xl:max-w-screen-2xl px-2 mb-6">
				<hr class="border-accent dark:border-accent-dark md:hidden mt-3 mb-6"/>
				<h2 class="text-3xl md:text-2xl font-bold my-4">
					{store.dict("quickDownloadPlaylist")}
				</h2>
				<div class="grid grid-flow-row grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-3">
					<QuickDownloadVideoAndAudio onClickDownload={onClickDownloadVideoAndAudio} disabled={downloadDisabled()}/>
					<QuickDownloadVideoAndAudio onClickDownload={onClickDownloadVideoAndAudioMp4} badge="mp4" disabled={downloadDisabled()}/>
					<QuickDownloadAudio onClickDownload={onClickDownloadAudio} disabled={downloadDisabled()}/>
					<QuickDownloadAudio onClickDownload={onClickDownloadAudioMp3} badge="mp3" disabled={downloadDisabled()}/>
				</div>
				<h2 class="text-3xl md:text-2xl font-bold my-4">
					{store.dict("playlistEntries")}
				</h2>
				<PlaylistEntriesTable
					selectAllChecked={selectAllChecked}
					onChangeSelectAll={() => {
						setSelectAllChecked(!selectAllChecked());
						setCheckedStates(new Array(props.playlist.entries.length).fill(selectAllChecked()));
					}}
				>
					<For each={props.playlist.entries}>{(entry, index) =>
						<EntryRow>
							<div class="flex items-center">
								<CheckBox
									checked={() => checkedStates()[index()]}
									onChange={
										() => setCheckedStates([...checkedStates().map(
											(checked, i) => i === index() ? !checked : checked)
										])
									}
								/>
							</div>
							<div><ThumbnailImage src={entry.thumbnail}/></div>
							<div class="flex items-center">
								<a
									href={entry.url}
									target="_blank"
									class="hover:underline hover:text-primary dark:hover:text-primary-dark"
								>
									{entry.title}
								</a>
							</div>
							<div class="flex items-center">{formatSeconds(entry.duration)}</div>
							<div class="flex items-center">{formatViewCount(entry.viewCount)}</div>
							<div class="flex items-center">
								<a
									href={entry.channelUrl}
									target="_blank"
									class="hover:underline hover:text-primary dark:hover:text-primary-dark"
								>
									{entry.channel}
								</a>
							</div>
							<div class="flex items-center">
								<A
									href={`/${encodeURIComponent(`watch?v=${entry.id}`)}`}
									target="_blank"
								>
									<Button>{store.dict("openInNewTab")}</Button>
								</A>
							</div>
						</EntryRow>
					}</For>
				</PlaylistEntriesTable>
			</div>
		</div>
	);
}
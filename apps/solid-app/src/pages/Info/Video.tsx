import { For, createMemo, Show, createSignal } from 'solid-js';
import { Format, Quality, VideoInfo } from 'types';
import { store } from '../../store';
import Header from './components/Header';
import { QuickDownloadAudio, QuickDownloadVideoAndAudio } from './components/QuickDownload';
import prettyBytes from 'pretty-bytes';
import { FormatRow, ExtensionBadge, FileSizeBadge, Button, VideoFormatsTable } from './components/Table';
import { formatSeconds } from '../../utils/string';
import {
	getVideoAndAudioFormats, getVideOnlyFormats, getAudioOnlyFormats, getStoryboardFormats
} from '../../utils/videoInfo';

export default function Video(props: { video: VideoInfo, animate: boolean }) {
	const formats = createMemo(() => [
		...getVideoAndAudioFormats(props.video.formats),
		...getVideOnlyFormats(props.video.formats),
		...getAudioOnlyFormats(props.video.formats),
		...getStoryboardFormats(props.video.formats)
	]);

	const [downloadDisabled, setDownloadDisabled] = createSignal(false);
	const [loadingFormatId, setLoadingFormatId] = createSignal<string | null>(null);

	function onClickDownloadVideoAndAudio (videoQuality: Quality, audioQuality: Quality, setLoading: (loading: boolean) => void) {
		console.log(`Downloading video: ${videoQuality} and audio: ${audioQuality}`);
		setLoading(true);
		setDownloadDisabled(true);
		setTimeout(() => {
			setLoading(false);
			setDownloadDisabled(false);
		}, 2000);
	}

	function onClickDownloadVideoAndAudioMp4(videoQuality: Quality, audioQuality: Quality, setLoading: (loading: boolean) => void) {
		console.log(`Downloading video: ${videoQuality} and audio: ${audioQuality}; mp4`);
		setLoading(true);
		setDownloadDisabled(true);
		setTimeout(() => {
			setLoading(false);
			setDownloadDisabled(false);
		}, 2000);
	}

	function onClickDownloadAudio(audioQuality: Quality, setLoading: (loading: boolean) => void) {
		console.log(`Downloading audio: ${audioQuality}`);
		setLoading(true);
		setDownloadDisabled(true);
		setTimeout(() => {
			setLoading(false);
			setDownloadDisabled(false);
		}, 2000);
	}

	function onClickDownloadAudioMp3(audioQuality: Quality, setLoading: (loading: boolean) => void) {
		console.log(`Downloading audio: ${audioQuality}; mp3`);
		setLoading(true);
		setDownloadDisabled(true);
		setTimeout(() => {
			setLoading(false);
			setDownloadDisabled(false);
		}, 2000);
	}

	function onClickDownloadFormat(format: Format) {
		console.log(`Downloading format: ${JSON.stringify(format)}`);
		setDownloadDisabled(true);
		setLoadingFormatId(format.formatId);
		setTimeout(() => {
			setDownloadDisabled(false);
			setLoadingFormatId(null);
		}, 2000);
	}

	return (
		<div class={`w-full ${props.animate ? "animate-fade" : ""}`}>
			<Header
				title={props.video.title}
				details={`${props.video.channel} • ${props.video.viewCount.toLocaleString()} ${store.dict("views")} • ${formatSeconds(props.video.duration)}`}
				thumbnailSrc={props.video.thumbnail}
			/>
			<div class="mx-auto 2xl:max-w-screen-2xl px-2 mb-6">
				<hr class="border-accent dark:border-accent-dark md:hidden mt-3 mb-6"/>
				<h2 class="text-3xl md:text-2xl font-bold my-4">
					{store.dict("quickDownload")}
				</h2>
				<div class="grid grid-flow-row grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-3">
					<QuickDownloadVideoAndAudio onClickDownload={onClickDownloadVideoAndAudio} disabled={downloadDisabled()}/>
					<QuickDownloadVideoAndAudio onClickDownload={onClickDownloadVideoAndAudioMp4} badge="mp4" disabled={downloadDisabled()}/>
					<QuickDownloadAudio onClickDownload={onClickDownloadAudio} disabled={downloadDisabled()}/>
					<QuickDownloadAudio onClickDownload={onClickDownloadAudioMp3} badge="mp3" disabled={downloadDisabled()}/>
				</div>
				<h2 class="text-3xl md:text-2xl font-bold my-4">
					{store.dict("allFormats")}
				</h2>
				<VideoFormatsTable>
					<For each={formats()}>{(format) => 
						<FormatRow>
							<div class="font-bold">{format.formatId}</div>
							<div>{format.resolution}</div>
							<div>{format.formatNote}</div>
							<div><ExtensionBadge>{format.extension}</ExtensionBadge></div>
							<div>{format.container}</div>
							<div>
								<Show when={format.videoCodec !== "none"}>{format.videoCodec}</Show>
							</div>
							<div>
								<Show when={format.audioCodec !== "none"}>{format.audioCodec}</Show>
							</div>
							<div>
								<Show when={format.fileSize}>
									<FileSizeBadge>
										{prettyBytes(format.fileSize!)}
									</FileSizeBadge>
								</Show>
							</div>
							<div>
								<Show when={format.fps && Math.floor(format.fps) !== 0}>{format.fps}</Show>
							</div>
							<div>
								<Show when={format.tbr !== 0}>{format.tbr}</Show>
							</div>
							<div>
								<Show when={format.vbr !== 0}>{format.vbr}</Show>
							</div>
							<div>
								<Show when={format.abr !== 0}>{format.abr}</Show>
							</div>
							<div>
								<Button
									onClick={() => onClickDownloadFormat(format)}
									loading={loadingFormatId() === format.formatId}
									disabled={downloadDisabled()}
								>
									{store.dict("download")}
								</Button>
							</div>
						</FormatRow>
					}</For>
				</VideoFormatsTable>
			</div>
		</div>
	);
}
import { store, setInfo, clearInfo } from "../../store";
import { Switch, Match, createEffect, createResource, Show, createMemo } from "solid-js";
import { useLocation } from "@solidjs/router";
import infoService from "../../services/info";
import Loading from "./components/Loading";
import Error from "../../components/ErrorPage";
import Video from "./Video";
import Playlist from "./Playlist";
import { PlaylistInfo, VideoInfo } from "types";

export default function Info() {
	// Should fetch info only if store.info is undefined
	// if source signal is undefined, createResource won't be triggered
	const encodedYouTubePath = createMemo(() => store.info === undefined ?
		useLocation().pathname.slice(1) :
		undefined
	);
	const [fetchedInfo, { refetch }] = createResource(encodedYouTubePath, infoService.fetchInfo);
	
	// Fade in animation if store.info is undefined. If home page has set store.info before,
	// animation is not required.
	const shouldAnimate = createMemo(() => fetchedInfo.state === "ready" && fetchedInfo() !== undefined);

	const storedInfoRequestedPath = createMemo(() => {
		if (!store.info) return "";
		
		const url = new URL(store.info.requestedUrl);
		return url.pathname + url.search;
	});
	const decodedPath = createMemo(() => decodeURIComponent(useLocation().pathname));
	
	// Clearing store.info if its requestedUrl is not in sync with the current location
	createEffect(() => {
		if (store.info !== undefined && storedInfoRequestedPath() !== decodedPath()) {
			clearInfo();
		}
	});

	createEffect(() => {
		if (!fetchedInfo.error && fetchedInfo.state === "ready" && fetchedInfo()) {
			setInfo(fetchedInfo()!);
		}
	});

	return (
		<Show
			when={store.info}
			fallback={
				<Switch>
					<Match when={fetchedInfo.loading} >
						<Loading />
					</Match>
					<Match when={fetchedInfo.error} >
						<Error error={fetchedInfo.error.message} retry={refetch} />
					</Match>
				</Switch>
			}
		>
			<Switch>
				<Match when={store.info!.type === "video"} >
					<Video video={store.info! as VideoInfo} animate={shouldAnimate()} />
				</Match>
				<Match when={store.info!.type === "playlist"} >
					<Playlist playlist={store.info! as PlaylistInfo} animate={shouldAnimate()} />
				</Match>
			</Switch>
		</Show>
	);
}
import { Show, createEffect, createResource, createSignal } from "solid-js";
import { store, setInfo } from "../../store";
import { useNavigate } from "@solidjs/router";
import infoService from "../../services/info";
import Spinner from "../../components/Spinner";
import YouTubeUrl from "../../utils/YouTubeUrl";

export default function Home() {
	const [error, setError] = createSignal("");
	const [youTubeURL, setYouTubeURL] = createSignal("");
	const [encodedYouTubePath, setEncodedYouTubePath] = createSignal<string>();
	const [info] = createResource(encodedYouTubePath, infoService.fetchInfo);

	const navigate = useNavigate();

	createEffect(() => {
		if (info.error) {
			showError(info.error.message);
		}
		else if (info()) {
			setInfo(info()!);
			navigate(`/${encodedYouTubePath()}`);
		}
	});

	const showError = (message: string, delayMs: number = 2000) => {
		setError(message);
		setTimeout(() => {
			setError("");
		}, delayMs);
	};

	const onSubmit = (event: Event) => {
		event.preventDefault();
		try {
			const ytURL = new YouTubeUrl(youTubeURL());
			setEncodedYouTubePath(ytURL.encodedPath);
		} catch (error: any) {
			showError(error.message);
		}
	};

	return (
		<div class="flex flex-col items-center justify-center h-full mx-auto 2xl:max-w-screen-2xl 2xl:min-w-screen-2xl py-10 px-2">
			<h1 class="text-3xl sm:text-4xl font-bold text-center">{store.dict("homePageTitle")}</h1>
			<p class={`
				w-full sm:w-4/5 md:w-1/2 2xl:w-1/3 text-center text-accent
				${error() === "" ? "my-6" : "mt-6"}
			`} >
				{store.dict("homePageDescription")}
			</p>
			<Show when={error() !== ""}>
				<div class="text-red-400 font-bold text-sm w-full sm:w-4/5 md:w-3/5 xl:w-2/5 px-1 h-6 flex items-end">
					<p>{error()}</p>
				</div>
			</Show>
			<form
				class="flex flex-col md:flex-row items-center w-full sm:w-4/5 md:w-3/5 xl:w-2/5"
				onSubmit={onSubmit}
			>
				<input
					type="text"
					class={`
						w-full mb-4 md:mb-0 md:mr-4 p-3
						bg-background dark:bg-background-dark
						border-[1.5px] rounded-lg border-accent dark:border-accent-dark
						placeholder-accent dark:placeholder-accent-dark
						focus:ring-1 focus:ring-text dark:focus:ring-text-dark
						${error() !== "" ? "ring-1 ring-red-400 dark:ring-1 dark:ring-red-400 border-red-400 dark:border-red-400" : ""}
					`}
					placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
					spellcheck={false}
					autocapitalize="none"
					autocorrect="off"
					value={youTubeURL()}
					onChange={(e) => setYouTubeURL(e.currentTarget.value)}
				/>
				<button
					class="
						text-white bg-primary dark:bg-primary-dark
						border-[1.5px] rounded-lg border-primary dark:border-primary-dark
						active:bg-red-600 active:border-red-600 dark:active:bg-red-600 dark:active:border-red-600
						md:hover:bg-red-600 md:hover:border-red-600 dark:md:hover:bg-red-600 dark:md:hover:border-red-600
						disabled:bg-red-600 disabled:border-red-600 dark:disabled:bg-red-600 dark:disabled:border-red-600
						disabled:cursor-not-allowed
						focus-visible:ring-1 focus-visible:ring-text dark:focus-visible:ring-text-dark
						w-full md:w-40 md:min-w-fit p-3 font-bold
					"
					disabled={info.loading}
					type="submit"
				>
					<div class="flex items-center space-x-2 mx-auto w-fit" >
						<span>{store.dict("download")}</span>
						<Show when={info.loading}>
							<Spinner class="h-4 w-4 fill-white text-accent-dark" />
						</Show>
					</div>
				</button>
			</form>
			
		</div>
	);
}
import { A } from "@solidjs/router";
import { Show } from "solid-js";
import { store } from "../store";

export default function Error(props: { error: string, retry?: () => void }) {
	return (
		<div class="flex flex-col items-center justify-center h-full py-10 mx-auto 2xl:max-w-screen-2xl 2xl:min-w-screen-2xl px-2">
			<h1 class="text-8xl font-black text-secondary dark:text-secondary-dark">Oops!</h1>
			<p class="mt-6 text-text dark:text-text-dark text-center text-lg font-bold">{props.error}</p>
			<A href="/" class="w-2/3 md:w-fit mx-auto my-6" >
				<button
					class="
						text-white bg-primary dark:bg-primary-dark
						border-[1.5px] rounded-lg border-primary dark:border-primary-dark
						active:bg-red-600 active:border-red-600 dark:active:bg-red-600 dark:active:border-red-600
						md:hover:bg-red-600 md:hover:border-red-600 dark:md:hover:bg-red-600 dark:md:hover:border-red-600
						focus-visible:ring-1 focus-visible:ring-text dark:focus-visible:ring-text-dark
						w-full md:w-40 md:min-w-fit mx-auto p-3 font-semibold
					"
				>
					{store.dict("goBackHome")}
				</button>
			</A>
			<Show when={props.retry !== undefined}>
				<button
					class="
						text-text bg-secondary dark:text-text-dark dark:bg-secondary-dark  
						rounded-lg
						active:bg-accent dark:active:bg-red-accent-dark
						md:hover:bg-neutral-300 dark:md:hover:bg-neutral-800
						focus-visible:ring-1 focus-visible:ring-text dark:focus-visible:ring-text-dark
						w-2/3 md:w-40 md:min-w-fit p-3 font-semibold
					"
					// eslint-disable-next-line solid/reactivity
					onClick={props.retry!}
				>
					{store.dict("retry")}
				</button>
			</Show>
		</div>
	);
}
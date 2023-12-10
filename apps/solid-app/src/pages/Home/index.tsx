import { Show, createSignal } from "solid-js";
import { store } from "../../lib/store";

export default function Home() {
	// eslint-disable-next-line no-unused-vars
	const [error, _setError] = createSignal("");

	// const showError = (message: string) => {
	// 	setError(message);
	// 	setTimeout(() => {
	// 		setError("");
	// 	}, 2000);
	// };

	return (
		<div class="flex flex-col items-center justify-center h-full py-10">
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
			<div class="flex flex-col md:flex-row items-center w-full sm:w-4/5 md:w-3/5 xl:w-2/5">
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
				/>
				<button
					class="
						text-white bg-primary dark:bg-primary-dark
						border-[1.5px] rounded-lg border-primary dark:border-primary-dark
						active:bg-red-600 active:border-red-600 dark:active:bg-red-600 dark:active:border-red-600
						md:hover:bg-red-600 md:hover:border-red-600 dark:md:hover:bg-red-600 dark:md:hover:border-red-600
						focus-visible:ring-1 focus-visible:ring-text dark:focus-visible:ring-text-dark
						w-full md:w-auto p-3 font-bold
					"
				>
					{store.dict("download")}
				</button>
			</div>
			
		</div>
	);
}
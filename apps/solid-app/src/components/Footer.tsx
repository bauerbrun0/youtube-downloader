import GitHubIcon from "./icons/GitHub";
import { store } from "../lib/store";

export default function Footer() {
	return (
		<div class="bg-background dark:bg-background-dark">
			<hr class="border-secondary dark:border-secondary-dark" />
			<div class="mx-auto 2xl:max-w-screen-2xl 2xl:min-w-screen-2xl flex items-center justify-center md:justify-normal py-2 px-2">
				<p class="flex items-center text-xs/relaxed">
					{store.dict("madeBy")} 
					<a href="https://github.com/bauerbrun0" target="_blank" class="flex items-center" >
						<GitHubIcon class="h-4 mx-1 fill-text dark:fill-text-dark" />
						bauerbrun0
					</a>
				</p>
			</div>
		</div>
	);
}
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Home from "../pages/Home";
import { createEffect, onMount } from "solid-js";
import { Router, Route, Navigate, useLocation } from "@solidjs/router";

import { store } from "../store";
import Info from "../pages/Info";

function App() {
	// Enable :active pseudo-class on mobile
	onMount(() => document.getElementsByTagName("html")[0].ontouchstart = () => {});
	// Toggle dark mode every time the theme changes
	createEffect(() => document.getElementsByTagName("html")[0].classList.toggle("dark", store.theme === "dark"));
	// Set html.lang on locale change
	createEffect(() => document.getElementsByTagName("html")[0].lang = store.locale);

	return (
		<div class="min-h-[calc(100dvh)] grid grid-flow-row grid-rows-layout grid-cols-1">
			<Navbar />
			<div>
				<div class="min-h-full h-full">
					<Router>
						<Route path="/" component={Home} />
						<Route path={["watch", "playlist"]} component={
							() => <Navigate href={`/${encodeURIComponent((useLocation().pathname).slice(1) + useLocation().search)}`}/>
						} />
						<Route path="/:encodedYouTubePath" component={Info} />
					</Router>
				</div>
			</div>
			<Footer />
		</div>
	);
}

export default App;

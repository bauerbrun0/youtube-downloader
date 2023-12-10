import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { createEffect, onMount } from "solid-js";
import { Router, Route } from "@solidjs/router";

import { store } from "./lib/store";

function App() {
	// Enable :active pseudo-class on mobile
	onMount(() => document.getElementsByTagName("html")[0].ontouchstart = () => {});
	// Toggle dark mode every time the theme changes
	createEffect(() => document.getElementsByTagName("html")[0].classList.toggle("dark", store.theme === "dark"));
	// Set html.lang on locale change
	createEffect(() => document.getElementsByTagName("html")[0].lang = store.locale);

	return (
		<div class="min-h-screen grid grid-flow-row grid-rows-layout">
			<Navbar />
			<div>
				<div class="mx-auto 2xl:max-w-screen-2xl 2xl:min-w-screen-2xl min-h-full h-full px-2">
					<Router>
						<Route path="/" component={Home} />
					</Router>
				</div>
			</div>
			<Footer />
		</div>
	);
}

export default App;

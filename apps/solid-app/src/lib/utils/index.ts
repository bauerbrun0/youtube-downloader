import { onCleanup } from "solid-js";

export function registerOnClickOutside(ref: HTMLElement, handler: () => void) {
	const onClick = (event: MouseEvent) => {
		if (!ref.contains(event.target as Node)) {
			handler();
		}
	};
  
	document.addEventListener("click", onClick);
  
	onCleanup(() => document.removeEventListener("click", onClick));
}
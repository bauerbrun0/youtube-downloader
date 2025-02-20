/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./ui/**/*.{html,templ}"],
	theme: {
		extend: {
			colors: {
				text: "#060404",
				background: "#ffffff",
				primary: "#ff0000",
				secondary: "#dcdada",
				accent: "#7a7a7f",
				"text-dark": "#ffffff",
				"background-dark": "#121212",
				"primary-dark": "#ff0000",
				"secondary-dark": "#242222",
				"accent-dark": "#808085",
			},
			gridTemplateRows: {
				layout: "max-content auto max-content",
			},
			keyframes: {
				fadeIn: {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
			},
			animation: {
				fade: "fadeIn 1s cubic-bezier(0, 0, 0.2, 1)",
			},
		},
	},
	plugins: [],
	darkMode: "class",
};

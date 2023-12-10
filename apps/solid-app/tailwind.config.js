/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
	content: [
		"./src/**/*.{js,jsx,ts,tsx}",
	],
	theme: {
		extend: {
			colors: {
				'text': '#060404',
				'background': '#ffffff',
				'primary': '#ff0000',
				'secondary': '#dcdada',
				'accent': '#7a7a7f',
				'text-dark': "#ffffff",
				'background-dark': "#121212",
				'primary-dark': "#ff0000",
				'secondary-dark': "#242222",
				'accent-dark': "#808085",
			},
			gridTemplateRows: {
				layout: "max-content auto max-content",
			}
		},
		
	},
	plugins: [],
	darkMode: 'class',
};

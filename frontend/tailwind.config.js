const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
	content: [
		"./components/**/*.{js,jsx}",
		"./configs/*.{js,jsx}",
		"./helpers/**/*.{js,jsx}",
		"./hooks/**/*.{js,jsx}",
		"./pages/**/*.{js,jsx}",
		"./styles/**/*.{js,jsx}",
		"./utils/**/*.{js,jsx}"
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Inter var", ...defaultTheme.fontFamily.sans]
			}
		}
	},
	plugins: [
		require("@tailwindcss/typography"),
		require("@tailwindcss/forms"),
		require("@tailwindcss/line-clamp"),
		require("@tailwindcss/aspect-ratio")
	]
};

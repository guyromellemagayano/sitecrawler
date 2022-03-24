const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

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
			},
			accessibility: ["hover", "active"],
			colors: {
				gray: {
					1000: "#2a324b",
					1100: "#434c69",
					1200: "#fbfbfb",
					1300: "#1d2626",
					1400: "#e7efef",
					1500: "#d9d9d9",
					1600: "#666666",
					1700: "#404040",
					1800: "#f5f5f5"
				},
				green: {
					1000: "#19b080"
				},
				red: {
					1000: "#ef2917",
					1100: "#ed5244",
					1200: "#bb4338"
				},
				blue: {
					1000: "#2d99ff",
					1100: "#1890ff",
					1200: "#40a9ff"
				}
			},
			minHeight: {
				page: "calc(100vh - 70px)"
			},
			spacing: {
				16: "16rem"
			}
		},
		colors: {
			transparent: "transparent",
			current: "currentColor",
			amber: colors.amber,
			black: colors.black,
			blue: colors.blue,
			cyan: colors.cyan,
			emeral: colors.emerald,
			fuchsia: colors.fuchsia,
			gray: colors.gray,
			green: colors.green,
			indigo: colors.indigo,
			lime: colors.lime,
			neutral: colors.neutral,
			orange: colors.orange,
			pink: colors.pink,
			purple: colors.purple,
			red: colors.red,
			rose: colors.rose,
			sky: colors.sky,
			slate: colors.slate,
			stone: colors.stone,
			teal: colors.teal,
			violet: colors.violet,
			white: colors.white,
			yellow: colors.yellow,
			zinc: colors.zinc
		}
	},
	plugins: [
		require("@tailwindcss/typography"),
		require("@tailwindcss/forms"),
		require("@tailwindcss/line-clamp"),
		require("@tailwindcss/aspect-ratio")
	]
};

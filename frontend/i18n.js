module.exports = {
	locales: ["en", "fr", "nl"],
	defaultLocale: "en",
	pages: {
		"*": ["common"],
		"/": ["home"],
		"/404": ["404"],
		"/login": ["login"],
		"/dashboard/sites": ["sites"]
	},
	interpolation: {
		prefix: "${",
		suffix: "}"
	},
	loadLocaleFrom: (locale, namespace) => import(`./src/locales/${locale}/${namespace}`).then((m) => m.default)
};

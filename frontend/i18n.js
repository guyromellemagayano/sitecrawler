module.exports = {
	locales: ["en", "fr", "nl"],
	defaultLocale: "en",
	pages: {
		"*": ["common"],
		"/404": ["error"],
		"/login": ["login"],
		"/sites": ["sites"]
	},
	interpolation: {
		prefix: "${",
		suffix: "}"
	},
	loadLocaleFrom: (locale, namespace) => import(`./src/locales/${locale}/${namespace}`).then((m) => m.default)
};

module.exports = {
	locales: ["en", "fr", "nl"],
	defaultLocale: "en",
	pages: {
		"*": ["common", "alerts"],
		"/": ["home"],
		"/login": ["login"],
		"/registration": ["registration"],
		"/dashboard/sites": ["sites"]
	},
	interpolation: {
		prefix: "${",
		suffix: "}"
	},
	loadLocaleFrom: (locale, namespace) => import(`./src/locales/${locale}/${namespace}`).then((m) => m.default)
};

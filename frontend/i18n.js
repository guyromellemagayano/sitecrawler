module.exports = {
	locales: ["en", "fr", "nl"],
	defaultLocale: "en",
	pages: {
		"*": ["common"],
		"/404": ["page404"],
		"/login": ["pageLogin"],
		"/dashboard/sites": ["pageSites"]
	},
	interpolation: {
		prefix: "${",
		suffix: "}"
	},
	loadLocaleFrom: (locale, namespace) => import(`./src/locales/${locale}/${namespace}`).then((m) => m.default)
};

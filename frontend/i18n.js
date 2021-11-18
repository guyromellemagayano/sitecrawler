module.exports = {
	locales: ["en", "fr", "nl"],
	defaultLocale: "en",
	pages: {
		"*": ["common", "alerts"],
		"/": ["home"],
		"/account-exist": ["accountExist"],
		"/dashboard/*": ["sites"],
		"/login": ["login"],
		"/registration": ["registration"]
	},
	interpolation: {
		prefix: "${",
		suffix: "}"
	},
	loadLocaleFrom: (locale, namespace) => import(`./src/locales/${locale}/${namespace}`).then((m) => m.default)
};

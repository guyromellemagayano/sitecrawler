module.exports = {
	locales: ["en", "fr", "nl"],
	defaultLocale: "en",
	pages: {
		"*": [
			"accountExist",
			"addSite",
			"alerts",
			"common",
			"confirmEmail",
			"home",
			"login",
			"registration",
			"sidebar",
			"signup",
			"sites"
		]
	},
	interpolation: {
		prefix: "${",
		suffix: "}"
	},
	loadLocaleFrom: (locale, namespace) => import(`./src/locales/${locale}/${namespace}`).then((m) => m.default)
};

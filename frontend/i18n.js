module.exports = {
	locales: ["en", "fr", "nl"],
	defaultLocale: "en",
	pages: {
		"*": [
			"accountExist",
			"addSite",
			"alerts",
			"auditLogs",
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
	loadLocaleFrom: (locale, namespace) => import(`./locales/${locale}/${namespace}`).then((m) => m.default)
};

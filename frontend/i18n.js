module.exports = {
	locales: ["en"],
	defaultLocale: "en",
	pages: {
		"*": ["alerts", "common"],
		"/": ["login"],
		"/account-exist": ["accountExist"],
		"/registration": ["registration"],
		"/logout": ["logout"],
		"rgx:^/confirm-email": ["confirmEmail"],
		"rgx:^/signup/": ["signup"],
		"rgx:^/reset-password/": ["resetPassword"],
		"rgx:^/dashboard": ["sidebar", "sites", "filters", "settings", "auditLogs"]
	},
	interpolation: {
		prefix: "${",
		suffix: "}"
	},
	loadLocaleFrom: (locale, namespace) => import(`./locales/${locale}/${namespace}`).then((m) => m.default)
};

module.exports = {
	locales: ["en"],
	defaultLocale: "en",
	pages: {
		"*": ["alerts", "common"],
		"/": ["home"],
		"/account-exist": ["accountExist"],
		"/confirm-email/[...id]": ["confirmEmail"],
		"/login": ["login"],
		"/logout": ["logout"],
		"/registration": ["registration"],
		"/reset-password/*": ["resetPassword"],
		"/signup/[...id]": ["signup"],
		"rgx:^/dashboard": ["sidebar", "sites"],
		"rgx:^/dashboard/settings": ["settings"],
		"/dashboard/audit-logs": ["auditLogs"]
	},
	interpolation: {
		prefix: "${",
		suffix: "}"
	},
	loadLocaleFrom: (locale, namespace) => import(`./locales/${locale}/${namespace}`).then((m) => m.default)
};

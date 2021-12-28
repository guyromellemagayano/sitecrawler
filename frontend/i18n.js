module.exports = {
	locales: ["en"],
	defaultLocale: "en",
	pages: {
		"*": ["alerts", "common"],
		"/": ["home"],
		"/account-exist": ["accountExist"],
		"/confirm-email/[...id]": ["confirmEmail"],
		"/dashboard/*": ["sidebar"],
		"/dashboard/audit-logs": ["auditLogs"],
		"/dashboard/settings/*": ["settings"],
		"/dashboard/sites/*": ["sites"],
		"/login": ["login"],
		"/logout": ["logout"],
		"/registration": ["registration"],
		"/reset-password/*": ["resetPassword"],
		"/signup/[...id]": ["signup"]
	},
	interpolation: {
		prefix: "${",
		suffix: "}"
	},
	loadLocaleFrom: (locale, namespace) => import(`./locales/${locale}/${namespace}`).then((m) => m.default)
};

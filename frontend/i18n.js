module.exports = {
	locales: ["en", "fr", "nl"],
	defaultLocale: "en",
	pages: {
		"*": ["alerts", "common"],
		"/": ["home"],
		"/account-exist": ["accountExist"],
		"/confirm-email/[...id]": ["confirmEmail"],
		"/dashboard/*": ["sidebar"],
		"/dashboard/add-new-site": ["addSite"],
		"/dashboard/audit-logs": ["auditLogs"],
		"/dashboard/sites": ["sites"],
		"/login": ["login"],
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

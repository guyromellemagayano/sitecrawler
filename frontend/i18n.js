module.exports = {
	locales: ["en", "fr", "nl"],
	defaultLocale: "en",
	pages: {
		"*": ["alerts", "common"],
		"/": ["home"],
		"/account-exist": ["accountExist"],
		"/confirm-email/[...id]": ["confirmEmail"],
		"/dashboard/sites": ["sites", "sidebar"],
		"/dashboard/sites/add-new-site": ["addSite", "sidebar"],
		"/dashboard/audit-logs": ["auditLogs", "sidebar"],
		"/dashboard/settings/profile": ["sidebar"],
		"/dashboard/settings/subscription-plans": ["sidebar"],
		"/dashboard/settings/billing": ["sidebar"],
		"/dashboard/settings/global": ["sidebar"],
		"/dashboard/settings/support": ["sidebar"],
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

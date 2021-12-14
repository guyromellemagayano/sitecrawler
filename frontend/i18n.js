module.exports = {
	locales: ["en"],
	defaultLocale: "en",
	pages: {
		"*": ["alerts", "common"],
		"/": ["home"],
		"/account-exist": ["accountExist"],
		"/confirm-email/[...id]": ["confirmEmail"],
		"/dashboard/sites": ["sites", "sidebar", "addSite"],
		"/dashboard/sites/add-new-site": ["addSite", "sidebar", "addSite"],
		"/dashboard/audit-logs": ["auditLogs", "sidebar", "addSite"],
		"/dashboard/settings/profile": ["settings", "sidebar", "addSite"],
		"/dashboard/settings/subscription-plans": ["settings", "sidebar", "addSite"],
		"/dashboard/settings/billing": ["settings", "sidebar", "addSite"],
		"/dashboard/settings/global": ["settings", "sidebar", "addSite"],
		"/dashboard/settings/support": ["settings", "sidebar", "addSite"],
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

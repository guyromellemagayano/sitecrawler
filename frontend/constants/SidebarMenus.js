import {
	AuditLogsLink,
	BillingSettingsLink,
	DashboardSitesLink,
	GlobalSettingsLink,
	HelpAndSupportLink,
	LogoutLink,
	ProfileSettingsLink,
	SettingsSlug,
	SiteImagesSlug,
	SiteLinksSlug,
	SitePagesSlug,
	SubscriptionPlansSettingsLink
} from "@constants/PageLinks";
import useTranslation from "next-translate/useTranslation";

export const SidebarMenus = () => {
	const { t } = useTranslation("sidebar");
	const account = t("account");
	const auditLogs = t("auditLogs");
	const billingSettings = t("billingSettings");
	const dashboard = t("dashboard");
	const details = t("details");
	const general = t("general");
	const global = t("global");
	const globalSettings = t("globalSettings");
	const goBackToSites = t("goBackToSites");
	const helpAndSupport = t("helpAndSupport");
	const images = t("images");
	const links = t("links");
	const logout = t("logout");
	const navigation = t("navigation");
	const overview = t("overview");
	const pages = t("pages");
	const profileSettings = t("profileSettings");
	const reports = t("reports");
	const settings = t("settings");
	const sites = t("sites");
	const siteSelection = t("siteSelection");
	const siteSettings = t("siteSettings");
	const subscriptionPlans = t("subscriptionPlans");

	const PrimarySidebarMenus = [];
	const SiteSidebarMenus = [];
	const SettingsSidebarMenus = [];
	const ProfileSidebarMenus = [];

	const NavigationMenu = {
		category: navigation,
		slug: "navigation",
		links: [{ title: goBackToSites, slug: "go-back-to-sites", url: DashboardSitesLink }]
	};

	const SiteSelectionMenu = { category: siteSelection, slug: "site-selection" };

	const DashboardMenu = {
		category: dashboard,
		slug: "dashboard",
		links: [{ title: sites, slug: "sites", url: DashboardSitesLink }]
	};

	const ReportsMenu = {
		category: reports,
		slug: "reports",
		links: [{ title: auditLogs, slug: "audit-logs", url: AuditLogsLink }]
	};

	const AccountMenu = {
		category: account,
		slug: "account",
		links: [
			{ title: profileSettings, slug: "profile-settings", url: ProfileSettingsLink },
			{ title: subscriptionPlans, slug: "subscription-plans", url: SubscriptionPlansSettingsLink },
			{ title: billingSettings, slug: "billing-settings", url: BillingSettingsLink }
		]
	};

	const GlobalMenu = {
		category: global,
		slug: "global",
		links: [
			{ title: globalSettings, slug: "global-settings", url: GlobalSettingsLink },
			{ title: helpAndSupport, slug: "help-support", url: HelpAndSupportLink },
			{ title: logout, slug: "logout", url: LogoutLink }
		]
	};

	const GeneralMenu = {
		category: general,
		slug: "general",
		links: [{ title: overview, slug: "overview", url: "/" }]
	};

	const DetailsMenu = {
		category: details,
		slug: "details",
		links: [
			{ title: links, slug: "links", url: SiteLinksSlug },
			{ title: pages, slug: "pages", url: SitePagesSlug },
			{ title: images, slug: "images", url: SiteImagesSlug }
		]
	};

	const SiteSettingsSidebarMenus = {
		category: settings,
		slug: "settings",
		links: [{ title: siteSettings, slug: "site-settings", url: "/" + SettingsSlug }]
	};

	// Primary menu items
	PrimarySidebarMenus.push(NavigationMenu);
	PrimarySidebarMenus.push(SiteSelectionMenu);
	PrimarySidebarMenus.push(DashboardMenu);
	PrimarySidebarMenus.push(ReportsMenu);

	// Site menu items
	SiteSidebarMenus.push(NavigationMenu);
	SiteSidebarMenus.push(SiteSelectionMenu);
	SiteSidebarMenus.push(GeneralMenu);
	SiteSidebarMenus.push(DetailsMenu);
	SiteSidebarMenus.push(SiteSettingsSidebarMenus);

	// Settings menu items
	SettingsSidebarMenus.push(NavigationMenu);
	SettingsSidebarMenus.push(SiteSelectionMenu);
	SettingsSidebarMenus.push(AccountMenu);
	SettingsSidebarMenus.push(GlobalMenu);

	// Profile menu items
	ProfileSidebarMenus.push(AccountMenu);
	ProfileSidebarMenus.push(GlobalMenu);

	return { PrimarySidebarMenus, SiteSidebarMenus, SettingsSidebarMenus, ProfileSidebarMenus };
};

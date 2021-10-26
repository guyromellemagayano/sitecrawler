import useTranslation from "next-translate/useTranslation";

const { t } = useTranslation("sites");

export const SitesTableLabels = [
	{
		label: t("siteName"),
		slug: "site-name",
		key: "name"
	},
	{
		label: t("lastCrawled")
	},
	{
		label: t("totalIssues")
	},
	{
		label: t("totalLinks")
	},
	{
		label: t("totalPages")
	},
	{
		label: t("totalImages")
	}
];

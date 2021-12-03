import useTranslation from "next-translate/useTranslation";

export const SitesTableLabels = () => {
	const { t } = useTranslation("sites");
	const siteName = t("siteName");
	const lastCrawled = t("lastCrawled");
	const totalIssues = t("totalIssues");
	const totalLinks = t("totalLinks");
	const totalPages = t("totalPages");
	const totalImages = t("totalImages");

	const labelsArray = new Array();

	const siteNameTableLabel = { label: siteName, slug: "site-name", key: "name" };
	const lastCrawledTableLabel = { label: lastCrawled };
	const totalIssuesTableLabel = { label: totalIssues };
	const totalLinksTableLabel = { label: totalLinks };
	const totalPagesTableLabel = { label: totalPages };
	const totalImagesTableLabel = { label: totalImages };

	labelsArray.push(siteNameTableLabel);
	labelsArray.push(lastCrawledTableLabel);
	labelsArray.push(totalIssuesTableLabel);
	labelsArray.push(totalLinksTableLabel);
	labelsArray.push(totalPagesTableLabel);
	labelsArray.push(totalImagesTableLabel);

	return labelsArray;
};

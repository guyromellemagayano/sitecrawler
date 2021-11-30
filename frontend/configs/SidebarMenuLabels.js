import useTranslation from "next-translate/useTranslation";

export const SidebarMenuLabels = () => {
	const { t } = useTranslation("sidebar");
	const selectSite = t("selectSite");
	const noSitesFound = t("noSitesFound");
	const addNewSite = t("addNewSite");

	const labelsArray = new Array();

	const selectSiteLabel = { label: selectSite, slug: "select-site" };
	const noSitesFoundLabel = { label: noSitesFound, slug: "no-sites-found" };
	const addNewSiteLabel = { label: addNewSite, slug: "add-new-site" };

	labelsArray.push(selectSiteLabel);
	labelsArray.push(noSitesFoundLabel);
	labelsArray.push(addNewSiteLabel);

	return labelsArray;
};

import useTranslation from "next-translate/useTranslation";

export const PagesTableLabels = () => {
	const { t } = useTranslation("sites");
	const pageUrl = t("pageUrl");
	const pageSize = t("pageSize");
	const totalLinks = t("totalLinks");
	const totalImages = t("totalImages");
	const totalScripts = t("totalScripts");
	const totalStylesheets = t("totalStylesheets");
	const tlsStatus = t("tlsStatus");
	const imagesTlsStatus = t("imagesTlsStatus");
	const scriptsTlsStatus = t("scriptsTlsStatus");
	const stylesheetsTlsStatus = t("stylesheetsTlsStatus");
	const totalOkLinks = t("totalOkLinks");
	const totalNonOkLinks = t("totalNonOkLinks");
	const totalOkImages = t("totalOkImages");
	const totalNonOkImages = t("totalNonOkImages");
	const totalOkScripts = t("totalOkScripts");
	const totalNonOkScripts = t("totalNonOkScripts");
	const totalOkStylesheets = t("totalOkStylesheets");
	const totalNonOkStylesheets = t("totalNonOkStylesheets");
	const totalSecuredImages = t("totalSecuredImages");
	const totalUnsecuredImages = t("totalUnsecuredImages");
	const totalSecuredScripts = t("totalSecuredScripts");
	const totalUnsecuredScripts = t("totalUnsecuredScripts");
	const totalSecuredStylesheets = t("totalSecuredStylesheets");
	const totalUnsecuredStylesheets = t("totalUnsecuredStylesheets");
	const tlsResolved = t("tlsResolved");
	const sizeResolved = t("sizeResolved");
	const missingTitleResolved = t("missingTitleResolved");
	const missingDescriptionResolved = t("missingDescriptionResolved");
	const missingH1FirstResolved = t("missingH1FirstResolved");
	const missingH1SecondResolved = t("missingH1SecondResolved");
	const missingH2FirstResolved = t("missingH2FirstResolved");
	const missingH2SecondResolved = t("missingH2SecondResolved");
	const duplicateTitleResolved = t("duplicateTitleResolved");
	const duplicateDescriptionResolved = t("duplicateDescriptionResolved");

	const labelsArray = [];

	const pageUrlTableLabel = { label: pageUrl, slug: "page-url", key: "url" };
	const pageTotalSizeTableLabel = { label: pageSize, slug: "page-size", key: "size_total" };
	const totalLinksTableLabel = { label: totalLinks, slug: "page-total-links", key: "num_links" };
	const totalImagesTableLabel = { label: totalImages, slug: "page-total-images", key: "num_images" };
	const totalScriptsTableLabel = { label: totalScripts, slug: "page-total-scripts", key: "num_scripts" };
	const totalStylesheetsTableLabel = {
		label: totalStylesheets,
		slug: "page-total-stylesheets",
		key: "num_stylesheets"
	};
	const tlsStatusTableLabel = { label: tlsStatus, slug: "page-tls-status", key: "tls_status" };
	const imagesTlsStatusTableLabel = {
		label: imagesTlsStatus,
		slug: "page-images-tls-status",
		key: "images_tls_status"
	};
	const scriptsTlsStatusTableLabel = {
		label: scriptsTlsStatus,
		slug: "page-scripts-tls-status",
		key: "scripts_tls_status"
	};
	const stylesheetsTlsStatusTableLabel = {
		label: stylesheetsTlsStatus,
		slug: "page-stylesheets-tls-status",
		key: "stylesheets_tls_status"
	};
	const totalOkLinksTableLabel = { label: totalOkLinks, slug: "page-total-ok-links", key: "num_ok_links" };
	const totalNonOkLinksTableLabel = {
		label: totalNonOkLinks,
		slug: "page-total-non-ok-links",
		key: "num_non_ok_links"
	};
	const totalOkImagesTableLabel = { label: totalOkImages, slug: "page-total-ok-images", key: "num_ok_images" };
	const totalNonOkImagesTableLabel = {
		label: totalNonOkImages,
		slug: "page-total-non-ok-images",
		key: "num_non_ok_images"
	};
	const totalOkScriptsTableLabel = { label: totalOkScripts, slug: "page-total-ok-scripts", key: "num_ok_scripts" };
	const totalNonOkScriptsTableLabel = {
		label: totalNonOkScripts,
		slug: "page-total-non-ok-scripts",
		key: "num_non_ok_scripts"
	};
	const totalOkStylesheetsTableLabel = {
		label: totalOkStylesheets,
		slug: "page-total-ok-stylesheets",
		key: "num_ok_stylesheets"
	};
	const totalNonOkStylesheetsTableLabel = {
		label: totalNonOkStylesheets,
		slug: "page-total-non-ok-stylesheets",
		key: "num_non_ok_stylesheets"
	};
	const totalSecuredImagesTableLabel = {
		label: totalSecuredImages,
		slug: "page-total-secured-images",
		key: "num_secured_images"
	};
	const totalUnsecuredImagesTableLabel = {
		label: totalUnsecuredImages,
		slug: "page-total-unsecured-images",
		key: "num_unsecured_images"
	};
	const totalSecuredScriptsTableLabel = {
		label: totalSecuredScripts,
		slug: "page-total-secured-scripts",
		key: "num_secured_scripts"
	};
	const totalUnsecuredScriptsTableLabel = {
		label: totalUnsecuredScripts,
		slug: "page-total-unsecured-scripts",
		key: "num_unsecured_scripts"
	};
	const totalSecuredStylesheetsTableLabel = {
		label: totalSecuredStylesheets,
		slug: "page-total-secured-stylesheets",
		key: "num_secured_stylesheets"
	};
	const totalUnsecuredStylesheetsTableLabel = {
		label: totalUnsecuredStylesheets,
		slug: "page-total-unsecured-stylesheets",
		key: "num_unsecured_stylesheets"
	};
	const tlsResolvedTableLabel = { label: tlsResolved, slug: "page-tls-resolved", key: "resolved_tls" };
	const sizeResolvedTableLabel = { label: sizeResolved, slug: "page-size-resolved", key: "resolved_size" };
	const missingTitleResolvedTableLabel = {
		label: missingTitleResolved,
		slug: "page-missing-title-resolved",
		key: "resolved_missing_title"
	};
	const missingDescriptionResolvedTableLabel = {
		label: missingDescriptionResolved,
		slug: "page-missing-description-resolved",
		key: "resolved_missing_description"
	};
	const missingH1FirstResolvedTableLabel = {
		label: missingH1FirstResolved,
		slug: "page-missing-h1-first-resolved",
		key: "resolved_missing_h1_first"
	};
	const missingH1SecondResolvedTableLabel = {
		label: missingH1SecondResolved,
		slug: "page-missing-h1-second-resolved",
		key: "resolved_missing_h1_second"
	};
	const missingH2FirstResolvedTableLabel = {
		label: missingH2FirstResolved,
		slug: "page-missing-h2-first-resolved",
		key: "resolved_missing_h2_first"
	};
	const missingH2SecondResolvedTableLabel = {
		label: missingH2SecondResolved,
		slug: "page-missing-h2-second-resolved",
		key: "resolved_missing_h2_second"
	};
	const duplicateTitleResolvedTableLabel = {
		label: duplicateTitleResolved,
		slug: "page-duplicate-title-resolved",
		key: "resolved_duplicate_title"
	};
	const duplicateDescriptionResolvedTableLabel = {
		label: duplicateDescriptionResolved,
		slug: "page-duplicate-description-resolved",
		key: "resolved_duplicate_description"
	};

	labelsArray.push(pageUrlTableLabel);
	labelsArray.push(pageTotalSizeTableLabel);
	labelsArray.push(tlsStatusTableLabel);
	labelsArray.push(imagesTlsStatusTableLabel);
	labelsArray.push(scriptsTlsStatusTableLabel);
	labelsArray.push(stylesheetsTlsStatusTableLabel);
	labelsArray.push(totalLinksTableLabel);
	labelsArray.push(totalImagesTableLabel);
	labelsArray.push(totalScriptsTableLabel);
	labelsArray.push(totalStylesheetsTableLabel);
	labelsArray.push(totalOkLinksTableLabel);
	labelsArray.push(totalNonOkLinksTableLabel);
	labelsArray.push(totalOkImagesTableLabel);
	labelsArray.push(totalNonOkImagesTableLabel);
	labelsArray.push(totalOkScriptsTableLabel);
	labelsArray.push(totalNonOkScriptsTableLabel);
	labelsArray.push(totalOkStylesheetsTableLabel);
	labelsArray.push(totalNonOkStylesheetsTableLabel);
	labelsArray.push(totalSecuredImagesTableLabel);
	labelsArray.push(totalUnsecuredImagesTableLabel);
	labelsArray.push(totalSecuredScriptsTableLabel);
	labelsArray.push(totalUnsecuredScriptsTableLabel);
	labelsArray.push(totalSecuredStylesheetsTableLabel);
	labelsArray.push(totalUnsecuredStylesheetsTableLabel);
	labelsArray.push(tlsResolvedTableLabel);
	labelsArray.push(sizeResolvedTableLabel);
	labelsArray.push(missingTitleResolvedTableLabel);
	labelsArray.push(missingDescriptionResolvedTableLabel);
	labelsArray.push(missingH1FirstResolvedTableLabel);
	labelsArray.push(missingH1SecondResolvedTableLabel);
	labelsArray.push(missingH2FirstResolvedTableLabel);
	labelsArray.push(missingH2SecondResolvedTableLabel);
	labelsArray.push(duplicateTitleResolvedTableLabel);
	labelsArray.push(duplicateDescriptionResolvedTableLabel);

	return labelsArray;
};

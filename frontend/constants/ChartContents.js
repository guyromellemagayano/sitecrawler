import { SiteCrawlerAppContext } from "@pages/_app";
import useTranslation from "next-translate/useTranslation";
import { useContext } from "react";

export const LinksChartContents = () => {
	const { t } = useTranslation("sites");
	const linksWithIssuesText = t("linksWithIssues");
	const noLinkIssuesText = t("noLinkIssues");

	const labelsArray = [];

	const pagesWithoutTitleLink = { label: linksWithIssuesText, filter: "status__neq=OK", color: "#ef4444" };
	const noLinkIssuesLink = { label: noLinkIssuesText, filter: "status=OK", color: "#22c55e" };

	labelsArray.push(pagesWithoutTitleLink);
	labelsArray.push(noLinkIssuesLink);

	return labelsArray;
};

export const SeoChartContents = () => {
	const { t } = useTranslation("sites");
	const pagesWithoutTitleText = t("pagesWithoutTitle");
	const pagesWithoutDescriptionText = t("pagesWithoutDescription");
	const pagesWithoutH1FirstText = t("pagesWithoutH1First");
	const pagesWithoutH1SecondText = t("pagesWithoutH1Second");
	const pagesWithoutH2FirstText = t("pagesWithoutH2First");
	const pagesWithoutH2SecondText = t("pagesWithoutH2Second");
	const pagesWithDuplicateTitleText = t("pagesWithDuplicateTitle");
	const pagesWithDuplicateDescriptionText = t("pagesWithDuplicateDescription");
	const pagesSeoOkText = t("pagesSeoOk");

	const labelsArray = [];

	const pagesWithoutTitleLink = { label: pagesWithoutTitleText, filter: "has_title=false", color: "#ef4444" };
	const pagesWithoutDescriptionLink = {
		label: pagesWithoutDescriptionText,
		filter: "has_description=false",
		color: "#f43f5e"
	};
	const pagesWithoutH1FirstLink = { label: pagesWithoutH1FirstText, filter: "has_h1_first=false", color: "#dc2626" };
	const pagesWithoutH1SecondLink = {
		label: pagesWithoutH1SecondText,
		filter: "has_h1_second=false",
		color: "#e11d48"
	};
	const pagesWithoutH2FirstLink = { label: pagesWithoutH2FirstText, filter: "has_h2_first=false", color: "#b91c1c" };
	const pagesWithoutH2SecondLink = {
		label: pagesWithoutH2SecondText,
		filter: "has_h2_second=false",
		color: "#be123c"
	};
	const pagesWithDuplicateTitleLink = {
		label: pagesWithDuplicateTitleText,
		filter: "has_duplicate_title=true",
		color: "#991b1b"
	};
	const pagesWithDuplicateDescriptionLink = {
		label: pagesWithDuplicateDescriptionText,
		filter: "has_duplicate_description=true",
		color: "#9f1239"
	};
	const pagesSeoOkLink = { label: pagesSeoOkText, filter: "tls_total=true", color: "#48bb78" };

	labelsArray.push(pagesWithoutTitleLink);
	labelsArray.push(pagesWithoutDescriptionLink);
	labelsArray.push(pagesWithoutH1FirstLink);
	labelsArray.push(pagesWithoutH1SecondLink);
	labelsArray.push(pagesWithoutH2FirstLink);
	labelsArray.push(pagesWithoutH2SecondLink);
	labelsArray.push(pagesWithDuplicateTitleLink);
	labelsArray.push(pagesWithDuplicateDescriptionLink);
	labelsArray.push(pagesSeoOkLink);

	return labelsArray;
};

export const PagesChartContents = () => {
	const { t } = useTranslation("sites");
	const pagesBigText = t("pagesBig");
	const pagesTlsNonOkText = t("pagesTlsNonOk");
	const pagesSmallTlsOkText = t("pagesSmallTlsOk");

	const { user } = useContext(SiteCrawlerAppContext);

	// Custom variables
	const largePageSizeThreshold = user?.data?.large_page_size_threshold ?? null;

	const labelsArray = [];

	const pagesBigLink = {
		label: pagesBigText,
		filter: `size_total_min=${largePageSizeThreshold}`,
		color: "#ef4444"
	};
	const pagesTlsNonOkLink = { label: pagesTlsNonOkText, filter: "tls_total=false", color: "#f43f5e" };
	const pagesSmallTlsOkLink = {
		label: pagesSmallTlsOkText,
		filter: `size_total_max=${largePageSizeThreshold}&tls_total=true`,
		color: "#22c55e"
	};

	labelsArray.push(pagesBigLink);
	labelsArray.push(pagesTlsNonOkLink);
	labelsArray.push(pagesSmallTlsOkLink);

	return labelsArray;
};

export const ImagesChartContents = () => {
	const { t } = useTranslation("sites");
	const imagesWithIssuesText = t("imagesWithIssues");
	const missingAltsText = t("missingAlts");
	const imagesTlsNonOkText = t("imagesTlsNonOk");
	const noImageIssuesText = t("noImageIssues");

	const labelsArray = [];

	const imagesWithIssuesLink = { label: imagesWithIssuesText, filter: "status__neq=OK", color: "#ef4444" };
	const imagesTlsNonOkLink = { label: imagesTlsNonOkText, filter: "tls_total=false", color: "#dc2626" };
	const missingAltsLink = { label: missingAltsText, filter: "missing_alts__iszero=true", color: "#eab308" };
	const noImageIssuesLink = { label: noImageIssuesText, filter: "status=OK", color: "#22c55e" };

	labelsArray.push(imagesWithIssuesLink);
	labelsArray.push(imagesTlsNonOkLink);
	labelsArray.push(missingAltsLink);
	labelsArray.push(noImageIssuesLink);

	return labelsArray;
};

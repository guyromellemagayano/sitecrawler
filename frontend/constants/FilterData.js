import useTranslation from "next-translate/useTranslation";
import { useState } from "react";

export const FilterData = () => {
	const [allSitesFilter, setAllSitesFilter] = useState(false);
	const [unverifiedFilter, setUnverifiedFilter] = useState(false);
	const [verifiedFilter, setVerifiedFilter] = useState(false);
	const [allLinksFilter, setAllLinksFilter] = useState(false);
	const [externalLinksFilter, setExternalLinksFilter] = useState(false);
	const [internalLinksFilter, setInternalLinksFilter] = useState(false);
	const [nonWebLinksFilter, setNonWebLinksFilter] = useState(false);
	const [linksWithIssuesFilter, setLinksWithIssuesFilter] = useState(false);
	const [noLinkIssuesFilter, setNoLinkIssuesFilter] = useState(false);
	const [allPagesFilter, setAllPagesFilter] = useState(false);
	const [tlsStatusFilter, setTlsStatusFilter] = useState(false);
	const [imagesTlsStatusFilter, setImagesTlsStatusFilter] = useState(false);
	const [scriptsTlsStatusFilter, setScriptsTlsStatusFilter] = useState(false);
	const [stylesheetsTlsStatusFilter, setStylesheetsTlsStatusFilter] = useState(false);
	const [okLinksFilter, setOkLinksFilter] = useState(false);
	const [nonOkLinksFilter, setNonOkLinksFilter] = useState(false);
	const [okImagesFilter, setOkImagesFilter] = useState(false);
	const [nonOkImagesFilter, setNonOkImagesFilter] = useState(false);
	const [okScriptsFilter, setOkScriptsFilter] = useState(false);
	const [nonOkScriptsFilter, setNonOkScriptsFilter] = useState(false);
	const [okStylesheetsFilter, setOkStylesheetsFilter] = useState(false);
	const [nonOkStylesheetsFilter, setNonOkStylesheetsFilter] = useState(false);
	const [securedImagesFilter, setSecuredImagesFilter] = useState(false);
	const [unsecuredImagesFilter, setUnsecuredImagesFilter] = useState(false);
	const [securedScriptsFilter, setSecuredScriptsFilter] = useState(false);
	const [unsecuredScriptsFilter, setUnsecuredScriptsFilter] = useState(false);
	const [securedStylesheetsFilter, setSecuredStylesheetsFilter] = useState(false);
	const [unsecuredStylesheetsFilter, setUnsecuredStylesheetsFilter] = useState(false);
	const [allImagesFilter, setAllImagesFilter] = useState(false);
	const [urlTypeFilter, setUrlTypeFilter] = useState(false);
	const [httpStatusFilter, setHttpStatusFilter] = useState(false);

	// Translations
	const { t } = useTranslation("filters");
	const allSitesText = t("allSites");
	const unverifiedText = t("unverified");
	const verifiedText = t("verified");
	const allLinksText = t("allLinks");
	const linksWithIssuesText = t("linksWithIssues");
	const internalLinksText = t("internalLinks");
	const externalLinksText = t("externalLinks");
	const nonWebLinksText = t("nonWebLinks");
	const noLinkIssuesText = t("noLinkIssues");
	const allPagesText = t("allPages");
	const tlsStatusText = t("tlsStatus");
	const imagesTlsStatusText = t("imagesTlsStatus");
	const scriptsTlsStatusText = t("scriptsTlsStatus");
	const stylesheetsTlsStatusText = t("stylesheetsTlsStatus");
	const okLinksText = t("okLinks");
	const nonOkLinksText = t("nonOkLinks");
	const okImagesText = t("okImages");
	const nonOkImagesText = t("nonOkImages");
	const okScriptsText = t("okScripts");
	const nonOkScriptsText = t("nonOkScripts");
	const okStylesheetsText = t("okStylesheets");
	const nonOkStylesheetsText = t("nonOkStylesheets");
	const securedImagesText = t("securedImages");
	const unsecuredImagesText = t("unsecuredImages");
	const securedScriptsText = t("securedScripts");
	const unsecuredScriptsText = t("unsecuredScripts");
	const securedStylesheetsText = t("securedStylesheets");
	const unsecuredStylesheetsText = t("unsecuredStylesheets");
	const urlTypeText = t("urlType");

	const filtersArray = [];

	// Sites filters
	const allSitesData = {
		label: allSitesText,
		checked: allSitesFilter,
		value: "allSites",
		type: "sites"
	};
	const unverifiedSitesData = {
		label: unverifiedText,
		checked: unverifiedFilter,
		value: "unverified",
		type: "sites"
	};
	const verifiedSitesData = {
		label: verifiedText,
		checked: verifiedFilter,
		value: "verified",
		type: "sites"
	};

	// Links filters
	const allSiteLinksData = {
		label: allLinksText,
		checked: allLinksFilter,
		value: "allLinks",
		type: "links"
	};
	const internalLinksData = {
		label: internalLinksText,
		checked: internalLinksFilter,
		value: "internalLinks",
		type: "links"
	};
	const externalLinksData = {
		label: externalLinksText,
		checked: externalLinksFilter,
		value: "externalLinks",
		type: "links"
	};
	const nonWebLinksData = {
		label: nonWebLinksText,
		checked: nonWebLinksFilter,
		value: "nonWebLinks",
		type: "links"
	};
	const linksWithIssuesData = {
		label: linksWithIssuesText,
		checked: linksWithIssuesFilter,
		value: "linksWithIssues",
		type: "links"
	};
	const noLinkIssuesData = {
		label: noLinkIssuesText,
		checked: noLinkIssuesFilter,
		value: "noLinkIssues",
		type: "links"
	};

	// Pages filters
	const allSitePagesData = {
		label: allPagesText,
		checked: allPagesFilter,
		value: "allPages",
		type: "pages"
	};
	const tlsStatusData = {
		label: tlsStatusText,
		checked: tlsStatusFilter,
		value: "tlsStatus",
		type: "pages"
	};
	const imagesTlsStatusData = {
		label: imagesTlsStatusText,
		checked: imagesTlsStatusFilter,
		value: "imagesTlsStatus",
		type: "pages"
	};
	const scriptsTlsStatusData = {
		label: scriptsTlsStatusText,
		checked: scriptsTlsStatusFilter,
		value: "scriptsTlsStatus",
		type: "pages"
	};
	const stylesheetsTlsStatusData = {
		label: stylesheetsTlsStatusText,
		checked: stylesheetsTlsStatusFilter,
		value: "stylesheetsTlsStatus",
		type: "pages"
	};
	const totalOkLinksData = {
		label: okLinksText,
		checked: okLinksFilter,
		value: "okLinks",
		type: "pages"
	};
	const totalNonOkLinksData = {
		label: nonOkLinksText,
		checked: nonOkLinksFilter,
		value: "nonOkLinks",
		type: "pages"
	};
	const totalOkImagesData = {
		label: okImagesText,
		checked: okImagesFilter,
		value: "okImages",
		type: "pages"
	};
	const totalNonOkImagesData = {
		label: nonOkImagesText,
		checked: nonOkImagesFilter,
		value: "nonOkImages",
		type: "pages"
	};
	const totalOkScriptsData = {
		label: okScriptsText,
		checked: okScriptsFilter,
		value: "okScripts",
		type: "pages"
	};
	const totalNonOkScriptsData = {
		label: nonOkScriptsText,
		checked: nonOkScriptsFilter,
		value: "nonOkScripts",
		type: "pages"
	};
	const totalOkStylesheetsData = {
		label: okStylesheetsText,
		checked: okStylesheetsFilter,
		value: "okStylesheets",
		type: "pages"
	};
	const totalNonOkStylesheetsData = {
		label: nonOkStylesheetsText,
		checked: nonOkStylesheetsFilter,
		value: "nonOkStylesheets",
		type: "pages"
	};
	const securedImagesData = {
		label: securedImagesText,
		checked: securedImagesFilter,
		value: "securedImages",
		type: "pages"
	};
	const unsecuredImagesData = {
		label: unsecuredImagesText,
		checked: unsecuredImagesFilter,
		value: "unsecuredImages",
		type: "pages"
	};
	const securedScriptsData = {
		label: securedScriptsText,
		checked: securedScriptsFilter,
		value: "securedScripts",
		type: "pages"
	};
	const unsecuredScriptsData = {
		label: unsecuredScriptsText,
		checked: unsecuredScriptsFilter,
		value: "unsecuredScripts",
		type: "pages"
	};
	const securedStylesheetsData = {
		label: securedStylesheetsText,
		checked: securedStylesheetsFilter,
		value: "securedStylesheets",
		type: "pages"
	};
	const unsecuredStylesheetsData = {
		label: unsecuredStylesheetsText,
		checked: unsecuredStylesheetsFilter,
		value: "unsecuredStylesheets",
		type: "pages"
	};

	filtersArray.push(allSitesData);
	filtersArray.push(unverifiedSitesData);
	filtersArray.push(verifiedSitesData);
	filtersArray.push(allSiteLinksData);
	filtersArray.push(internalLinksData);
	filtersArray.push(externalLinksData);
	filtersArray.push(nonWebLinksData);
	filtersArray.push(linksWithIssuesData);
	filtersArray.push(noLinkIssuesData);
	filtersArray.push(allSitePagesData);
	filtersArray.push(tlsStatusData);
	filtersArray.push(imagesTlsStatusData);
	filtersArray.push(scriptsTlsStatusData);
	filtersArray.push(stylesheetsTlsStatusData);
	filtersArray.push(totalOkLinksData);
	filtersArray.push(totalNonOkLinksData);
	filtersArray.push(totalOkImagesData);
	filtersArray.push(totalNonOkImagesData);
	filtersArray.push(totalOkScriptsData);
	filtersArray.push(totalNonOkScriptsData);
	filtersArray.push(totalOkStylesheetsData);
	filtersArray.push(totalNonOkStylesheetsData);
	filtersArray.push(securedImagesData);
	filtersArray.push(unsecuredImagesData);
	filtersArray.push(securedScriptsData);
	filtersArray.push(unsecuredScriptsData);
	filtersArray.push(securedStylesheetsData);
	filtersArray.push(unsecuredStylesheetsData);

	return {
		filtersArray,
		allSitesFilter,
		setAllSitesFilter,
		unverifiedFilter,
		setUnverifiedFilter,
		verifiedFilter,
		setVerifiedFilter,
		allLinksFilter,
		setAllLinksFilter,
		externalLinksFilter,
		setExternalLinksFilter,
		internalLinksFilter,
		setInternalLinksFilter,
		nonWebLinksFilter,
		setNonWebLinksFilter,
		linksWithIssuesFilter,
		setLinksWithIssuesFilter,
		noLinkIssuesFilter,
		setNoLinkIssuesFilter,
		allPagesFilter,
		setAllPagesFilter,
		okLinksFilter,
		setOkLinksFilter,
		nonOkLinksFilter,
		setNonOkLinksFilter,
		okImagesFilter,
		setOkImagesFilter,
		nonOkImagesFilter,
		setNonOkImagesFilter,
		okScriptsFilter,
		setOkScriptsFilter,
		nonOkScriptsFilter,
		setNonOkScriptsFilter,
		okStylesheetsFilter,
		setOkStylesheetsFilter,
		nonOkStylesheetsFilter,
		setNonOkStylesheetsFilter,
		securedImagesFilter,
		setSecuredImagesFilter,
		unsecuredImagesFilter,
		setUnsecuredImagesFilter,
		securedScriptsFilter,
		setSecuredScriptsFilter,
		unsecuredScriptsFilter,
		setUnsecuredScriptsFilter,
		securedStylesheetsFilter,
		setSecuredStylesheetsFilter,
		unsecuredStylesheetsFilter,
		setUnsecuredStylesheetsFilter,
		tlsStatusFilter,
		setTlsStatusFilter,
		imagesTlsStatusFilter,
		setImagesTlsStatusFilter,
		scriptsTlsStatusFilter,
		setScriptsTlsStatusFilter,
		stylesheetsTlsStatusFilter,
		setStylesheetsTlsStatusFilter
	};
};

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
	const [hasTitleFilter, setHasTitleFilter] = useState(false);
	const [hasDescriptionFilter, setHasDescriptionFilter] = useState(false);
	const [hasH1FirstFilter, setHasH1FirstFilter] = useState(false);
	const [hasH1SecondFilter, setHasH1SecondFilter] = useState(false);
	const [hasH2FirstFilter, setHasH2FirstFilter] = useState(false);
	const [hasH2SecondFilter, setHasH2SecondFilter] = useState(false);
	const [hasNoH1FirstFilter, setHasNoH1FirstFilter] = useState(false);
	const [hasNoH1SecondFilter, setHasNoH1SecondFilter] = useState(false);
	const [hasNoH2FirstFilter, setHasNoH2FirstFilter] = useState(false);
	const [hasNoH2SecondFilter, setHasNoH2SecondFilter] = useState(false);
	const [hasDuplicatedTitleFilter, setHasDuplicatedTitleFilter] = useState(false);
	const [hasDuplicatedDescriptionFilter, setHasDuplicatedDescriptionFilter] = useState(false);
	const [tlsImagesFilter, setTlsImagesFilter] = useState(false);
	const [tlsScriptsFilter, setTlsScriptsFilter] = useState(false);
	const [tlsStylesheetsFilter, setTlsStylesheetsFilter] = useState(false);
	const [tlsTotalFilter, setTlsTotalFilter] = useState(false);

	// Translations
	const { t } = useTranslation("filters");

	// Sites
	const allSitesText = t("allSites");
	const unverifiedText = t("unverified");
	const verifiedText = t("verified");

	// Links
	const allLinksText = t("allLinks");
	const linksWithIssuesText = t("linksWithIssues");
	const internalLinksText = t("internalLinks");
	const externalLinksText = t("externalLinks");
	const nonWebLinksText = t("nonWebLinks");
	const noLinkIssuesText = t("noLinkIssues");

	// Pages
	const allPagesText = t("allPages");
	const hasTitleText = t("hasTitle");
	const hasDescriptionText = t("hasDescription");
	const hasH1FirstText = t("hasH1First");
	const hasH1SecondText = t("hasH1Second");
	const hasH2FirstText = t("hasH2First");
	const hasH2SecondText = t("hasH2Second");
	const hasNoH1FirstText = t("hasNoH1First");
	const hasNoH1SecondText = t("hasNoH1Second");
	const hasNoH2FirstText = t("hasNoH2First");
	const hasNoH2SecondText = t("hasNoH2Second");
	const hasDuplicatedTitleText = t("hasDuplicatedTitle");
	const hasDuplicatedDescriptionText = t("hasDuplicatedDescription");
	const tlsImagesText = t("tlsImages");
	const tlsScriptsText = t("tlsScripts");
	const tlsStylesheetsText = t("tlsStylesheets");
	const tlsTotalText = t("tlsTotal");

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
	const hasTitleData = {
		label: hasTitleText,
		checked: hasTitleFilter,
		value: "hasTitle",
		type: "pages"
	};
	const hasDescriptionData = {
		label: hasDescriptionText,
		checked: hasDescriptionFilter,
		value: "hasDescription",
		type: "pages"
	};
	const hasH1FirstData = {
		label: hasH1FirstText,
		checked: hasH1FirstFilter,
		value: "hasH1First",
		type: "pages"
	};
	const hasH1SecondData = {
		label: hasH1SecondText,
		checked: hasH1SecondFilter,
		value: "hasH1Second",
		type: "pages"
	};
	const hasH2FirstData = {
		label: hasH2FirstText,
		checked: hasH2FirstFilter,
		value: "hasH2First",
		type: "pages"
	};
	const hasH2SecondData = {
		label: hasH2SecondText,
		checked: hasH2SecondFilter,
		value: "hasH2Second",
		type: "pages"
	};

	const hasNoH1FirstData = {
		label: hasNoH1FirstText,
		checked: hasNoH1FirstFilter,
		value: "hasNoH1First",
		type: "pages"
	};
	const hasNoH1SecondData = {
		label: hasNoH1SecondText,
		checked: hasNoH1SecondFilter,
		value: "hasNoH1Second",
		type: "pages"
	};
	const hasNoH2FirstData = {
		label: hasNoH2FirstText,
		checked: hasNoH2FirstFilter,
		value: "hasNoH2First",
		type: "pages"
	};
	const hasNoH2SecondData = {
		label: hasNoH2SecondText,
		checked: hasNoH2SecondFilter,
		value: "hasNoH2Second",
		type: "pages"
	};

	const hasDuplicatedTitleData = {
		label: hasDuplicatedTitleText,
		checked: hasDuplicatedTitleFilter,
		value: "hasDuplicatedTitle",
		type: "pages"
	};
	const hasDuplicatedDescriptionData = {
		label: hasDuplicatedDescriptionText,
		checked: hasDuplicatedDescriptionFilter,
		value: "hasDuplicatedDescription",
		type: "pages"
	};
	const tlsImagesData = {
		label: tlsImagesText,
		checked: tlsImagesFilter,
		value: "tlsImages",
		type: "pages"
	};
	const tlsScriptsData = {
		label: tlsScriptsText,
		checked: tlsScriptsFilter,
		value: "tlsScripts",
		type: "pages"
	};
	const tlsStylesheetsData = {
		label: tlsStylesheetsText,
		checked: tlsStylesheetsFilter,
		value: "tlsStylesheets",
		type: "pages"
	};
	const tlsTotalData = {
		label: tlsTotalText,
		checked: tlsTotalFilter,
		value: "tlsTotal",
		type: "pages"
	};

	filtersArray.push(allSitesData);
	filtersArray.push(linksWithIssuesData);
	filtersArray.push(noLinkIssuesData);
	filtersArray.push(unverifiedSitesData);
	filtersArray.push(verifiedSitesData);
	filtersArray.push(allSiteLinksData);
	filtersArray.push(internalLinksData);
	filtersArray.push(externalLinksData);
	filtersArray.push(nonWebLinksData);
	filtersArray.push(allSitePagesData);
	filtersArray.push(hasTitleData);
	filtersArray.push(hasDescriptionData);
	filtersArray.push(hasH1FirstData);
	filtersArray.push(hasNoH1FirstData);
	filtersArray.push(hasH1SecondData);
	filtersArray.push(hasNoH1SecondData);
	filtersArray.push(hasH2FirstData);
	filtersArray.push(hasNoH2FirstData);
	filtersArray.push(hasH2SecondData);
	filtersArray.push(hasNoH2SecondData);
	filtersArray.push(hasDuplicatedTitleData);
	filtersArray.push(hasDuplicatedDescriptionData);
	filtersArray.push(tlsImagesData);
	filtersArray.push(tlsScriptsData);
	filtersArray.push(tlsStylesheetsData);
	filtersArray.push(tlsTotalData);

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
		hasTitleFilter,
		setHasTitleFilter,
		hasDescriptionFilter,
		setHasDescriptionFilter,
		hasH1FirstFilter,
		setHasH1FirstFilter,
		hasH1SecondFilter,
		setHasH1SecondFilter,
		hasH2FirstFilter,
		setHasH2FirstFilter,
		hasH2SecondFilter,
		setHasH2SecondFilter,
		hasNoH1FirstFilter,
		setHasNoH1FirstFilter,
		hasNoH1SecondFilter,
		setHasNoH1SecondFilter,
		hasNoH2FirstFilter,
		setHasNoH2FirstFilter,
		hasNoH2SecondFilter,
		setHasNoH2SecondFilter,
		hasDuplicatedTitleFilter,
		setHasDuplicatedTitleFilter,
		hasDuplicatedDescriptionFilter,
		setHasDuplicatedDescriptionFilter,
		tlsImagesFilter,
		setTlsImagesFilter,
		tlsScriptsFilter,
		setTlsScriptsFilter,
		tlsStylesheetsFilter,
		setTlsStylesheetsFilter,
		tlsTotalFilter,
		setTlsTotalFilter
	};
};

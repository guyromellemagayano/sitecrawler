import useTranslation from "next-translate/useTranslation";
import { useState } from "react";

export const FilterData = () => {
	const [allSitesFilter, setAllSitesFilter] = useState(false);
	const [unverifiedFilter, setUnverifiedFilter] = useState(false);
	const [verifiedFilter, setVerifiedFilter] = useState(false);
	const [allLinksFilter, setAllLinksFilter] = useState(false);
	const [externalLinksFilter, setExternalLinksFilter] = useState(false);
	const [internalLinksFilter, setInternalLinksFilter] = useState(false);
	const [linksWithIssuesFilter, setLinksWithIssuesFilter] = useState(false);
	const [noLinkIssuesFilter, setNoLinkIssuesFilter] = useState(false);
	const [allPagesFilter, setAllPagesFilter] = useState(false);
	const [brokenSecurityFilter, setBrokenSecurityFilter] = useState(false);
	const [duplicateDescriptionsFilter, setDuplicateDescriptionsFilter] = useState(false);
	const [duplicateTitlesFilter, setDuplicateTitlesFilter] = useState(false);
	const [largePageSizesFilter, setLargePageSizesFilter] = useState(false);
	const [noPageIssuesFilter, setNoPageIssuesFilter] = useState(false);

	// Translations
	const { t } = useTranslation("filters");
	const allSitesText = t("allSites");
	const unverifiedText = t("unverified");
	const verifiedText = t("verified");
	const allLinksText = t("allLinks");
	const linksWithIssuesText = t("linksWithIssues");
	const internalLinksText = t("internalLinks");
	const externalLinksText = t("externalLinks");
	const noLinkIssuesText = t("noLinkIssues");
	const allPagesText = t("allPages");
	const brokenSecurityText = t("brokenSecurity");
	const duplicateDescriptionsText = t("duplicateDescriptions");
	const duplicateTitlesText = t("duplicateTitles");
	const largePageSizesText = t("largePageSizes");
	const noPageIssuesText = t("noPageIssues");

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
	const linksWithIssuesData = {
		label: linksWithIssuesText,
		checked: linksWithIssuesFilter,
		value: "linksWithIssues",
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
	const noLinkIssuesData = {
		label: noLinkIssuesText,
		checked: noLinkIssuesFilter,
		value: "noIssues",
		type: "links"
	};

	// Pages filters
	const allSitePagesData = {
		label: allPagesText,
		checked: allPagesFilter,
		value: "allPages",
		type: "pages"
	};
	const brokenSecurityData = {
		label: brokenSecurityText,
		checked: brokenSecurityFilter,
		value: "brokenSecurity",
		type: "pages"
	};
	const duplicateTitlesData = {
		label: duplicateTitlesText,
		checked: duplicateTitlesFilter,
		value: "duplicateTitles",
		type: "pages"
	};
	const duplicateDescriptionsData = {
		label: duplicateDescriptionsText,
		checked: duplicateDescriptionsFilter,
		value: "duplicateDescriptions",
		type: "pages"
	};
	const largePageSizesData = {
		label: largePageSizesText,
		checked: largePageSizesFilter,
		value: "largePageSizes",
		type: "pages"
	};

	filtersArray.push(allSitesData);
	filtersArray.push(unverifiedSitesData);
	filtersArray.push(verifiedSitesData);
	filtersArray.push(allSiteLinksData);
	filtersArray.push(linksWithIssuesData);
	filtersArray.push(internalLinksData);
	filtersArray.push(externalLinksData);
	filtersArray.push(noLinkIssuesData);
	filtersArray.push(allSitePagesData);
	filtersArray.push(brokenSecurityData);
	filtersArray.push(duplicateTitlesData);
	filtersArray.push(duplicateDescriptionsData);
	filtersArray.push(largePageSizesData);

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
		linksWithIssuesFilter,
		setLinksWithIssuesFilter,
		noLinkIssuesFilter,
		setNoLinkIssuesFilter,
		allPagesFilter,
		setAllPagesFilter,
		brokenSecurityFilter,
		setBrokenSecurityFilter,
		duplicateDescriptionsFilter,
		setDuplicateDescriptionsFilter,
		duplicateTitlesFilter,
		setDuplicateTitlesFilter,
		largePageSizesFilter,
		setLargePageSizesFilter,
		noPageIssuesFilter,
		setNoPageIssuesFilter
	};
};

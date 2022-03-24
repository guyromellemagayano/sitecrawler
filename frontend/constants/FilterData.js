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
	const [otherLinksFilter, setOtherLinksFilter] = useState(false);
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
	const [allImagesFilter, setAllImagesFilter] = useState(false);
	const [externalImagesFilter, setExternalImagesFilter] = useState(false);
	const [internalImagesFilter, setInternalImagesFilter] = useState(false);
	const [nonWebImagesFilter, setNonWebImagesFilter] = useState(false);
	const [otherImagesFilter, setOtherImagesFilter] = useState(false);
	const [allExceptExternalImagesFilter, setAllExceptExternalImagesFilter] = useState(false);
	const [allExceptInternalImagesFilter, setAllExceptInternalImagesFilter] = useState(false);
	const [allExceptNonWebImagesFilter, setAllExceptNonWebImagesFilter] = useState(false);
	const [allExceptOtherImagesFilter, setAllExceptOtherImagesFilter] = useState(false);
	const [okHttpStatusImagesFilter, setOkHttpStatusImagesFilter] = useState(false);
	const [timeoutHttpStatusImagesFilter, setTimeoutHttpStatusImagesFilter] = useState(false);
	const [errorHttpStatusImagesFilter, setErrorHttpStatusImagesFilter] = useState(false);
	const [otherErrorHttpStatusImagesFilter, setOtherErrorHttpStatusImagesFilter] = useState(false);
	const [tooManyRedirectsHttpStatusImagesFilter, setTooManyRedirectsHttpStatusImagesFilter] = useState(false);
	const [allExceptOkHttpStatusImagesFilter, setAllExceptOkHttpStatusImagesFilter] = useState(false);
	const [allExceptTimeoutHttpStatusImagesFilter, setAllExceptTimeoutHttpStatusImagesFilter] = useState(false);
	const [allExceptErrorHttpStatusImagesFilter, setAllExceptErrorHttpStatusImagesFilter] = useState(false);
	const [allExceptOtherErrorHttpStatusImagesFilter, setAllExceptOtherErrorHttpStatusImagesFilter] = useState(false);
	const [allExceptTooManyRedirectsHttpStatusImagesFilter, setAllExceptTooManyRedirectsHttpStatusImagesFilter] =
		useState(false);
	const [tlsStatusNoneImagesFilter, setTlsStatusNoneImagesFilter] = useState(false);
	const [tlsStatusOkImagesFilter, setTlsStatusOkImagesFilter] = useState(false);
	const [tlsStatusErrorImagesFilter, setTlsStatusErrorImagesFilter] = useState(false);
	const [allExceptTlsStatusNoneImagesFilter, setAllExceptTlsStatusNoneImagesFilter] = useState(false);
	const [allExceptTlsStatusOkImagesFilter, setAllExceptTlsStatusOkImagesFilter] = useState(false);
	const [allExceptTlsStatusErrorImagesFilter, setAllExceptTlsStatusErrorImagesFilter] = useState(false);
	const [noMissingAltsImagesFilter, setNoMissingAltsImagesFilter] = useState(false);
	const [missingAltsImagesFilter, setMissingAltsImagesFilter] = useState(false);

	// Translations
	const { t } = useTranslation("filters");

	// Sites
	const allSitesText = t("allSites");
	const unverifiedText = t("unverified");
	const verifiedText = t("verified");

	// Links
	const allLinksText = t("allLinks");
	const linksWithIssuesText = t("linksWithIssues");
	const noLinkIssuesText = t("noLinkIssues");
	const internalLinksText = t("internalLinks");
	const externalLinksText = t("externalLinks");
	const nonWebLinksText = t("nonWebLinks");
	const otherLinksText = t("otherLinks");

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

	// Images
	const allImagesText = t("allImages");
	const internalImagesText = t("internalImages");
	const externalImagesText = t("externalImages");
	const nonWebImagesText = t("nonWebImages");
	const otherImagesText = t("otherImages");
	const allExceptInternalImagesText = t("allExceptInternalImages");
	const allExceptExternalImagesText = t("allExceptExternalImages");
	const allExceptNonWebImagesText = t("allExceptNonWebImages");
	const allExceptOtherImagesText = t("allExceptOtherImages");
	const okHttpStatusText = t("okHttpStatus");
	const timeoutHttpStatusText = t("timeoutHttpStatus");
	const errorHttpStatusText = t("errorHttpStatus");
	const otherErrorHttpStatusText = t("otherErrorHttpStatus");
	const tooManyRedirectsHttpStatusText = t("tooManyRedirectsHttpStatus");
	const allExceptOkHttpStatusText = t("allExceptOkHttpStatus");
	const allExceptTimeoutHttpStatusText = t("allExceptTimeoutHttpStatus");
	const allExceptErrorHttpStatusText = t("allExceptErrorHttpStatus");
	const allExceptOtherErrorHttpStatusText = t("allExceptOtherErrorHttpStatus");
	const allExceptTooManyRedirectsHttpStatusText = t("allExceptTooManyRedirectsHttpStatus");
	const tlsStatusNoneText = t("tlsStatusNone");
	const tlsStatusOkText = t("tlsStatusOk");
	const tlsStatusErrorText = t("tlsStatusError");
	const allExceptTlsStatusNoneText = t("allExceptTlsStatusNone");
	const allExceptTlsStatusOkText = t("allExceptTlsStatusOk");
	const allExceptTlsStatusErrorText = t("allExceptTlsStatusError");
	const noMissingAltsText = t("noMissingAlts");
	const missingAltsText = t("missingAlts");

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

	filtersArray.push(allSitesData);
	filtersArray.push(unverifiedSitesData);
	filtersArray.push(verifiedSitesData);

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
	const otherLinksData = {
		label: otherLinksText,
		checked: otherLinksFilter,
		value: "otherLinks",
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

	filtersArray.push(allSiteLinksData);
	filtersArray.push(linksWithIssuesData);
	filtersArray.push(noLinkIssuesData);
	filtersArray.push(internalLinksData);
	filtersArray.push(externalLinksData);
	filtersArray.push(nonWebLinksData);
	filtersArray.push(otherLinksData);

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

	// Images filters
	const allSiteImagesData = {
		label: allImagesText,
		checked: allImagesFilter,
		value: "allImages",
		type: "images"
	};
	const internalImagesData = {
		label: internalImagesText,
		checked: internalImagesFilter,
		value: "internalImages",
		type: "images"
	};
	const externalImagesData = {
		label: externalImagesText,
		checked: externalImagesFilter,
		value: "externalImages",
		type: "images"
	};
	const nonWebImagesData = {
		label: nonWebImagesText,
		checked: nonWebImagesFilter,
		value: "nonWebImages",
		type: "images"
	};
	const otherImagesData = {
		label: otherImagesText,
		checked: otherImagesFilter,
		value: "otherImages",
		type: "images"
	};
	const allExceptInternalImagesData = {
		label: allExceptInternalImagesText,
		checked: allExceptInternalImagesFilter,
		value: "allExceptInternalImages",
		type: "images"
	};
	const allExceptExternalImagesData = {
		label: allExceptExternalImagesText,
		checked: allExceptExternalImagesFilter,
		value: "allExceptExternalImages",
		type: "images"
	};
	const allExceptNonWebImagesData = {
		label: allExceptNonWebImagesText,
		checked: allExceptNonWebImagesFilter,
		value: "allExceptNonWebImages",
		type: "images"
	};
	const allExceptOtherImagesData = {
		label: allExceptOtherImagesText,
		checked: allExceptOtherImagesFilter,
		value: "allExceptOtherImages",
		type: "images"
	};
	const okHttpStatusImagesData = {
		label: okHttpStatusText,
		checked: okHttpStatusImagesFilter,
		value: "okHttpStatusImages",
		type: "images"
	};
	const timeoutHttpStatusImagesData = {
		label: timeoutHttpStatusText,
		checked: timeoutHttpStatusImagesFilter,
		value: "timeoutHttpStatusImages",
		type: "images"
	};
	const errorHttpStatusImagesData = {
		label: errorHttpStatusText,
		checked: errorHttpStatusImagesFilter,
		value: "errorHttpStatusImages",
		type: "images"
	};
	const otherErrorHttpStatusImagesData = {
		label: otherErrorHttpStatusText,
		checked: otherErrorHttpStatusImagesFilter,
		value: "otherErrorHttpStatusImages",
		type: "images"
	};
	const tooManyRedirectsHttpStatusImagesData = {
		label: tooManyRedirectsHttpStatusText,
		checked: tooManyRedirectsHttpStatusImagesFilter,
		value: "tooManyRedirectsHttpStatusImages",
		type: "images"
	};
	const allExceptOkHttpStatusImagesData = {
		label: allExceptOkHttpStatusText,
		checked: allExceptOkHttpStatusImagesFilter,
		value: "allExceptOkHttpStatusImages",
		type: "images"
	};
	const allExceptTimeoutHttpStatusImagesData = {
		label: allExceptTimeoutHttpStatusText,
		checked: allExceptTimeoutHttpStatusImagesFilter,
		value: "allExceptTimeoutHttpStatusImages",
		type: "images"
	};
	const allExceptErrorHttpStatusImagesData = {
		label: allExceptErrorHttpStatusText,
		checked: allExceptErrorHttpStatusImagesFilter,
		value: "allExceptErrorHttpStatusImages",
		type: "images"
	};
	const allExceptOtherErrorHttpStatusImagesData = {
		label: allExceptOtherErrorHttpStatusText,
		checked: allExceptOtherErrorHttpStatusImagesFilter,
		value: "allExceptOtherErrorHttpStatusImages",
		type: "images"
	};
	const allExceptTooManyRedirectsHttpStatusImagesData = {
		label: allExceptTooManyRedirectsHttpStatusText,
		checked: allExceptTooManyRedirectsHttpStatusImagesFilter,
		value: "allExceptTooManyRedirectsHttpStatusImages",
		type: "images"
	};
	const tlsStatusNoneImagesData = {
		label: tlsStatusNoneText,
		checked: tlsStatusNoneImagesFilter,
		value: "tlsStatusNoneImages",
		type: "images"
	};
	const tlsStatusOkImagesData = {
		label: tlsStatusOkText,
		checked: tlsStatusOkImagesFilter,
		value: "tlsStatusOkImages",
		type: "images"
	};
	const tlsStatusErrorImagesData = {
		label: tlsStatusErrorText,
		checked: tlsStatusErrorImagesFilter,
		value: "tlsStatusErrorImages",
		type: "images"
	};
	const allExceptTlsStatusNoneImagesData = {
		label: allExceptTlsStatusNoneText,
		checked: allExceptTlsStatusNoneImagesFilter,
		value: "allExceptTlsStatusNoneImages",
		type: "images"
	};
	const allExceptTlsStatusOkImagesData = {
		label: allExceptTlsStatusOkText,
		checked: allExceptTlsStatusOkImagesFilter,
		value: "allExceptTlsStatusOkImages",
		type: "images"
	};
	const allExceptTlsStatusErrorImagesData = {
		label: allExceptTlsStatusErrorText,
		checked: allExceptTlsStatusErrorImagesFilter,
		value: "allExceptTlsStatusErrorImages",
		type: "images"
	};
	const noMissingAltsImagesData = {
		label: noMissingAltsText,
		checked: noMissingAltsImagesFilter,
		value: "noMissingAltsImages",
		type: "images"
	};
	const missingAltsImagesData = {
		label: missingAltsText,
		checked: missingAltsImagesFilter,
		value: "missingAltsImages",
		type: "images"
	};

	filtersArray.push(allSiteImagesData);
	filtersArray.push(internalImagesData);
	filtersArray.push(externalImagesData);
	filtersArray.push(nonWebImagesData);
	filtersArray.push(otherImagesData);
	filtersArray.push(allExceptInternalImagesData);
	filtersArray.push(allExceptExternalImagesData);
	filtersArray.push(allExceptNonWebImagesData);
	filtersArray.push(allExceptOtherImagesData);
	filtersArray.push(okHttpStatusImagesData);
	filtersArray.push(timeoutHttpStatusImagesData);
	filtersArray.push(errorHttpStatusImagesData);
	filtersArray.push(otherErrorHttpStatusImagesData);
	filtersArray.push(tooManyRedirectsHttpStatusImagesData);
	filtersArray.push(allExceptOkHttpStatusImagesData);
	filtersArray.push(allExceptTimeoutHttpStatusImagesData);
	filtersArray.push(allExceptErrorHttpStatusImagesData);
	filtersArray.push(allExceptOtherErrorHttpStatusImagesData);
	filtersArray.push(allExceptTooManyRedirectsHttpStatusImagesData);
	filtersArray.push(tlsStatusNoneImagesData);
	filtersArray.push(tlsStatusOkImagesData);
	filtersArray.push(tlsStatusErrorImagesData);
	filtersArray.push(allExceptTlsStatusNoneImagesData);
	filtersArray.push(allExceptTlsStatusOkImagesData);
	filtersArray.push(allExceptTlsStatusErrorImagesData);
	filtersArray.push(noMissingAltsImagesData);
	filtersArray.push(missingAltsImagesData);

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
		otherLinksFilter,
		setOtherLinksFilter,
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
		setTlsTotalFilter,
		allImagesFilter,
		setAllImagesFilter,
		internalImagesFilter,
		setInternalImagesFilter,
		externalImagesFilter,
		setExternalImagesFilter,
		nonWebImagesFilter,
		setNonWebImagesFilter,
		otherImagesFilter,
		setOtherImagesFilter,
		allExceptExternalImagesFilter,
		setAllExceptExternalImagesFilter,
		allExceptInternalImagesFilter,
		setAllExceptInternalImagesFilter,
		allExceptNonWebImagesFilter,
		setAllExceptNonWebImagesFilter,
		allExceptOtherImagesFilter,
		setAllExceptOtherImagesFilter,
		okHttpStatusImagesFilter,
		setOkHttpStatusImagesFilter,
		timeoutHttpStatusImagesFilter,
		setTimeoutHttpStatusImagesFilter,
		errorHttpStatusImagesFilter,
		setErrorHttpStatusImagesFilter,
		otherErrorHttpStatusImagesFilter,
		setOtherErrorHttpStatusImagesFilter,
		tooManyRedirectsHttpStatusImagesFilter,
		setTooManyRedirectsHttpStatusImagesFilter,
		allExceptOkHttpStatusImagesFilter,
		setAllExceptOkHttpStatusImagesFilter,
		allExceptTimeoutHttpStatusImagesFilter,
		setAllExceptTimeoutHttpStatusImagesFilter,
		allExceptErrorHttpStatusImagesFilter,
		setAllExceptErrorHttpStatusImagesFilter,
		allExceptOtherErrorHttpStatusImagesFilter,
		setAllExceptOtherErrorHttpStatusImagesFilter,
		allExceptTooManyRedirectsHttpStatusImagesFilter,
		setAllExceptTooManyRedirectsHttpStatusImagesFilter,
		tlsStatusNoneImagesFilter,
		setTlsStatusNoneImagesFilter,
		tlsStatusOkImagesFilter,
		setTlsStatusOkImagesFilter,
		tlsStatusErrorImagesFilter,
		setTlsStatusErrorImagesFilter,
		allExceptTlsStatusNoneImagesFilter,
		setAllExceptTlsStatusNoneImagesFilter,
		allExceptTlsStatusOkImagesFilter,
		setAllExceptTlsStatusOkImagesFilter,
		allExceptTlsStatusErrorImagesFilter,
		setAllExceptTlsStatusErrorImagesFilter,
		noMissingAltsImagesFilter,
		setNoMissingAltsImagesFilter,
		missingAltsImagesFilter,
		setMissingAltsImagesFilter
	};
};

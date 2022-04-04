/* eslint-disable react-hooks/exhaustive-deps */
import { FilterData } from "@constants/FilterData";
import { handleRemoveUrlParameter } from "@helpers/handleRemoveUrlParameter";
import { useScanApiEndpoint } from "@hooks/useScanApiEndpoint";
import { useSiteQueries } from "@hooks/useSiteQueries";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { memo, useContext, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the `Filter` component
 *
 * @param {boolean} isSitesFilter
 * @param {boolean} isSitesLinksFilter
 * @param {boolean} isSitesPagesFilter
 * @param {boolean} isSitesImagesFilter
 * @param {boolean} isValidating
 */
const Filter = ({
	isSitesFilter = false,
	isSitesLinksFilter = false,
	isSitesPagesFilter = false,
	isSitesImagesFilter = false
}) => {
	// Translations
	const { t } = useTranslation("filters");
	const filterText = t("filters");

	// Custom constants
	const {
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
	} = FilterData();

	// Custom context
	const { isComponentReady, scan } = useContext(SiteCrawlerAppContext);

	// Router
	const { query, asPath, push } = useRouter();

	// Custom variables
	let filterType = isSitesFilter
		? "sites"
		: isSitesLinksFilter
		? "links"
		: isSitesPagesFilter
		? "pages"
		: isSitesImagesFilter
		? "images"
		: null;

	// Custom hooks
	const { linksPerPage, setPagePath } = useSiteQueries();
	const { scanApiEndpoint, filterQueryString } = useScanApiEndpoint(linksPerPage);

	// Handle filter URLs
	const handleFilterUrl = (e) => {
		const filterValue = e.target.value;
		const filterChecked = e.target.checked;

		let newPath = asPath;
		newPath = handleRemoveUrlParameter(newPath, "page");

		if (filterType === "links") {
			if (filterValue === "linksWithIssues" && filterChecked) {
				setLinksWithIssuesFilter(true);
				setNoLinkIssuesFilter(false);
				setAllLinksFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "status");
				newPath = handleRemoveUrlParameter(newPath, "status__neq");

				if (newPath.includes("?")) newPath += `&status__neq=OK`;
				else newPath += `?status__neq=OK`;
			} else if (filterValue === "linksWithIssues" && !filterChecked) {
				filterQueryString?.delete("status__neq") ?? null;

				if (newPath.includes("status__neq")) newPath = handleRemoveUrlParameter(newPath, "status__neq");

				setLinksWithIssuesFilter(false);
			}

			if (filterValue === "noLinkIssues" && filterChecked) {
				setLinksWithIssuesFilter(false);
				setNoLinkIssuesFilter(true);
				setAllLinksFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "status");
				newPath = handleRemoveUrlParameter(newPath, "status__neq");

				if (newPath.includes("?")) newPath += `&status=OK`;
				else newPath += `?status=OK`;
			} else if (filterValue === "noLinkIssues" && !filterChecked) {
				filterQueryString?.delete("status") ?? null;

				if (newPath.includes("status")) newPath = handleRemoveUrlParameter(newPath, "status");

				setNoLinkIssuesFilter(false);
			}

			if (filterValue === "internalLinks" && filterChecked) {
				setNonWebLinksFilter(false);
				setInternalLinksFilter(true);
				setExternalLinksFilter(false);
				setOtherLinksFilter(false);
				setAllLinksFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "type");

				if (newPath.includes("?")) newPath += `&type=PAGE`;
				else newPath += `?type=PAGE`;
			} else if (filterValue === "internalLinks" && !filterChecked) {
				filterQueryString?.delete("type") ?? null;

				if (newPath.includes("type")) newPath = handleRemoveUrlParameter(newPath, "type");

				setInternalLinksFilter(false);
			}

			if (filterValue === "externalLinks" && filterChecked) {
				setNonWebLinksFilter(false);
				setInternalLinksFilter(false);
				setExternalLinksFilter(true);
				setOtherLinksFilter(false);
				setAllLinksFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "type");

				if (newPath.includes("?")) newPath += `&type=EXTERNAL`;
				else newPath += `?type=EXTERNAL`;
			} else if (filterValue === "externalLinks" && !filterChecked) {
				filterQueryString?.delete("type") ?? null;

				if (newPath.includes("type")) newPath = handleRemoveUrlParameter(newPath, "type");

				setExternalLinksFilter(false);
			}

			if (filterValue === "nonWebLinks" && filterChecked) {
				setNonWebLinksFilter(true);
				setInternalLinksFilter(false);
				setExternalLinksFilter(false);
				setOtherLinksFilter(false);
				setAllLinksFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "type");

				if (newPath.includes("?")) newPath += `&type=NON_WEB`;
				else newPath += `?type=NON_WEB`;
			} else if (filterValue === "nonWebLinks" && !filterChecked) {
				filterQueryString?.delete("type") ?? null;

				if (newPath.includes("type")) newPath = handleRemoveUrlParameter(newPath, "type");

				setNonWebLinksFilter(false);
			}

			if (filterValue === "otherLinks" && filterChecked) {
				setNonWebLinksFilter(false);
				setInternalLinksFilter(false);
				setExternalLinksFilter(false);
				setOtherLinksFilter(true);
				setAllLinksFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "type");

				if (newPath.includes("?")) newPath += `&type=OTHER`;
				else newPath += `?type=OTHER`;
			} else if (filterValue === "otherLinks" && !filterChecked) {
				filterQueryString?.delete("type") ?? null;

				if (newPath.includes("type")) newPath = handleRemoveUrlParameter(newPath, "type");

				setOtherLinksFilter(false);
			}

			if (
				(filterValue === "allSites" && filterChecked) ||
				(filterValue !== "linksWithIssues" &&
					filterValue !== "noLinkIssues" &&
					filterValue !== "internalLinks" &&
					filterValue !== "externalLinks" &&
					filterValue !== "nonWebLinks" &&
					filterValue !== "otherLinks")
			) {
				setAllLinksFilter(true);
				setLinksWithIssuesFilter(false);
				setNoLinkIssuesFilter(false);
				setExternalLinksFilter(false);
				setInternalLinksFilter(false);
				setNonWebLinksFilter(false);
				setOtherLinksFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "status");
				newPath = handleRemoveUrlParameter(newPath, "status__neq");
				newPath = handleRemoveUrlParameter(newPath, "type");
			}
		} else if (filterType === "pages") {
			if (filterValue === "hasTitle" && filterChecked) {
				setAllPagesFilter(false);
				setHasTitleFilter(true);

				newPath = handleRemoveUrlParameter(newPath, "has_title");

				if (newPath.includes("?")) newPath += `&has_title=true`;
				else newPath += `?has_title=true`;
			} else if (filterValue === "hasTitle" && !filterChecked) {
				filterQueryString?.delete("has_title") ?? null;

				if (newPath.includes("has_title")) newPath = handleRemoveUrlParameter(newPath, "has_title");

				setHasTitleFilter(false);
			}

			if (filterValue === "hasDescription" && filterChecked) {
				setAllPagesFilter(false);
				setHasDescriptionFilter(true);

				newPath = handleRemoveUrlParameter(newPath, "has_description");

				if (newPath.includes("?")) newPath += `&has_description=true`;
				else newPath += `?has_description=true`;
			} else if (filterValue === "hasDescription" && !filterChecked) {
				filterQueryString?.delete("has_description") ?? null;

				if (newPath.includes("has_description")) newPath = handleRemoveUrlParameter(newPath, "has_description");

				setHasDescriptionFilter(false);
			}

			if (filterValue === "hasH1First" && filterChecked) {
				setAllPagesFilter(false);
				setHasH1FirstFilter(true);

				newPath = handleRemoveUrlParameter(newPath, "has_h1_first");

				if (newPath.includes("?")) newPath += `&has_h1_first=true`;
				else newPath += `?has_h1_first=true`;
			} else if (filterValue === "hasH1First" && !filterChecked) {
				filterQueryString?.delete("has_h1_first") ?? null;

				if (newPath.includes("has_h1_first")) newPath = handleRemoveUrlParameter(newPath, "has_h1_first");

				setHasH1FirstFilter(false);
			}

			if (filterValue === "hasH1Second" && filterChecked) {
				setAllPagesFilter(false);
				setHasH1SecondFilter(true);

				newPath = handleRemoveUrlParameter(newPath, "has_h1_second");

				if (newPath.includes("?")) newPath += `&has_h1_second=true`;
				else newPath += `?has_h1_second=true`;
			} else if (filterValue === "hasH1Second" && !filterChecked) {
				filterQueryString?.delete("has_h1_second") ?? null;

				if (newPath.includes("has_h1_second")) newPath = handleRemoveUrlParameter(newPath, "has_h1_second");

				setHasH1SecondFilter(false);
			}

			if (filterValue === "hasH2First" && filterChecked) {
				setAllPagesFilter(false);
				setHasH2FirstFilter(true);

				newPath = handleRemoveUrlParameter(newPath, "has_h2_first");

				if (newPath.includes("?")) newPath += `&has_h2_first=true`;
				else newPath += `?has_h2_first=true`;
			} else if (filterValue === "hasH2First" && !filterChecked) {
				filterQueryString?.delete("has_h2_first") ?? null;

				if (newPath.includes("has_h2_first")) newPath = handleRemoveUrlParameter(newPath, "has_h2_first");

				setHasH2FirstFilter(false);
			}

			if (filterValue === "hasH2Second" && filterChecked) {
				setAllPagesFilter(false);
				setHasH2SecondFilter(true);

				newPath = handleRemoveUrlParameter(newPath, "has_h2_second");

				if (newPath.includes("?")) newPath += `&has_h2_second=true`;
				else newPath += `?has_h2_second=true`;
			} else if (filterValue === "hasH2Second" && !filterChecked) {
				filterQueryString?.delete("has_h2_second") ?? null;

				if (newPath.includes("has_h2_second")) newPath = handleRemoveUrlParameter(newPath, "has_h2_second");

				setHasH2SecondFilter(false);
			}

			if (filterValue === "hasNoH1First" && filterChecked) {
				setAllPagesFilter(false);
				setHasH1FirstFilter(false);
				setHasNoH1FirstFilter(true);

				newPath = handleRemoveUrlParameter(newPath, "has_h1_first");

				if (newPath.includes("?")) newPath += `&has_h1_first=false`;
				else newPath += `?has_h1_first=false`;
			} else if (filterValue === "hasNoH1First" && !filterChecked) {
				filterQueryString?.delete("has_h1_first") ?? null;

				if (newPath.includes("has_h1_first")) newPath = handleRemoveUrlParameter(newPath, "has_h1_first");

				setHasNoH1FirstFilter(false);
			}

			if (filterValue === "hasNoH1Second" && filterChecked) {
				setAllPagesFilter(false);
				setHasH1SecondFilter(false);
				setHasNoH1SecondFilter(true);

				newPath = handleRemoveUrlParameter(newPath, "has_h1_second");

				if (newPath.includes("?")) newPath += `&has_h1_second=false`;
				else newPath += `?has_h1_second=false`;
			} else if (filterValue === "hasNoH1Second" && !filterChecked) {
				filterQueryString?.delete("has_h1_second") ?? null;

				if (newPath.includes("has_h1_second")) newPath = handleRemoveUrlParameter(newPath, "has_h1_second");

				setHasNoH1SecondFilter(false);
			}

			if (filterValue === "hasNoH2First" && filterChecked) {
				setAllPagesFilter(false);
				setHasH2FirstFilter(false);
				setHasNoH2FirstFilter(true);

				newPath = handleRemoveUrlParameter(newPath, "has_h2_first");

				if (newPath.includes("?")) newPath += `&has_h2_first=false`;
				else newPath += `?has_h2_first=false`;
			} else if (filterValue === "hasNoH2First" && !filterChecked) {
				filterQueryString?.delete("has_h2_first") ?? null;

				if (newPath.includes("has_h2_first")) newPath = handleRemoveUrlParameter(newPath, "has_h2_first");

				setHasNoH2FirstFilter(false);
			}

			if (filterValue === "hasNoH2Second" && filterChecked) {
				setAllPagesFilter(false);
				setHasH2SecondFilter(true);
				setHasNoH2SecondFilter(true);

				newPath = handleRemoveUrlParameter(newPath, "has_h2_second");

				if (newPath.includes("?")) newPath += `&has_h2_second=false`;
				else newPath += `?has_h2_second=false`;
			} else if (filterValue === "hasNoH2Second" && !filterChecked) {
				filterQueryString?.delete("has_h2_second") ?? null;

				if (newPath.includes("has_h2_second")) newPath = handleRemoveUrlParameter(newPath, "has_h2_second");

				setHasNoH2SecondFilter(false);
			}

			if (filterValue === "hasDuplicatedTitle" && filterChecked) {
				setAllPagesFilter(false);
				setHasDuplicatedTitleFilter(true);

				newPath = handleRemoveUrlParameter(newPath, "has_duplicated_title");

				if (newPath.includes("?")) newPath += `&has_duplicated_title=true`;
				else newPath += `?has_duplicated_title=true`;
			} else if (filterValue === "hasDuplicatedTitle" && !filterChecked) {
				filterQueryString?.delete("has_duplicated_title") ?? null;

				if (newPath.includes("has_duplicated_title"))
					newPath = handleRemoveUrlParameter(newPath, "has_duplicated_title");

				setHasDuplicatedTitleFilter(false);
			}

			if (filterValue === "hasDuplicatedDescription" && filterChecked) {
				setAllPagesFilter(false);
				setHasDuplicatedDescriptionFilter(true);

				newPath = handleRemoveUrlParameter(newPath, "has_duplicated_description");

				if (newPath.includes("?")) newPath += `&has_duplicated_description=true`;
				else newPath += `?has_duplicated_description=true`;
			} else if (filterValue === "hasDuplicatedDescription" && !filterChecked) {
				filterQueryString?.delete("has_duplicated_description") ?? null;

				if (newPath.includes("has_duplicated_description"))
					newPath = handleRemoveUrlParameter(newPath, "has_duplicated_description");

				setHasDuplicatedTitleFilter(false);
			}

			if (filterValue === "tlsImages" && filterChecked) {
				setAllPagesFilter(false);
				setTlsImagesFilter(true);

				newPath = handleRemoveUrlParameter(newPath, "tls_images");

				if (newPath.includes("?")) newPath += `&tls_images=true`;
				else newPath += `?tls_images=true`;
			} else if (filterValue === "tlsImages" && !filterChecked) {
				filterQueryString?.delete("tls_images") ?? null;

				if (newPath.includes("tls_images")) newPath = handleRemoveUrlParameter(newPath, "tls_images");

				setTlsImagesFilter(false);
			}

			if (filterValue === "tlsScripts" && filterChecked) {
				setAllPagesFilter(false);
				setTlsScriptsFilter(true);

				newPath = handleRemoveUrlParameter(newPath, "tls_scripts");

				if (newPath.includes("?")) newPath += `&tls_scripts=true`;
				else newPath += `?tls_scripts=true`;
			} else if (filterValue === "tlsScripts" && !filterChecked) {
				filterQueryString?.delete("tls_scripts") ?? null;

				if (newPath.includes("tls_scripts")) newPath = handleRemoveUrlParameter(newPath, "tls_scripts");

				setTlsScriptsFilter(false);
			}

			if (filterValue === "tlsStylesheets" && filterChecked) {
				setAllPagesFilter(false);
				setTlsStylesheetsFilter(true);

				newPath = handleRemoveUrlParameter(newPath, "tls_stylesheets");

				if (newPath.includes("?")) newPath += `&tls_stylesheets=true`;
				else newPath += `?tls_stylesheets=true`;
			} else if (filterValue === "tlsStylesheets" && !filterChecked) {
				filterQueryString?.delete("tls_stylesheets") ?? null;

				if (newPath.includes("tls_stylesheets")) newPath = handleRemoveUrlParameter(newPath, "tls_stylesheets");

				setTlsStylesheetsFilter(false);
			}

			if (filterValue === "tlsTotal" && filterChecked) {
				setAllPagesFilter(false);
				setTlsTotalFilter(true);

				newPath = handleRemoveUrlParameter(newPath, "tls_total");

				if (newPath.includes("?")) newPath += `&tls_total=true`;
				else newPath += `?tls_total=true`;
			} else if (filterValue === "tlsTotal" && !filterChecked) {
				filterQueryString?.delete("tls_total") ?? null;

				if (newPath.includes("tls_total")) newPath = handleRemoveUrlParameter(newPath, "tls_total");

				setTlsTotalFilter(false);
			}

			if (filterValue === "allPages" && filterChecked) {
				setAllPagesFilter(true);
				setHasTitleFilter(false);
				setHasDescriptionFilter(false);
				setHasH1FirstFilter(false);
				setHasH1SecondFilter(false);
				setHasH2FirstFilter(false);
				setHasH2SecondFilter(false);
				setHasNoH1FirstFilter(false);
				setHasNoH1SecondFilter(false);
				setHasNoH2FirstFilter(false);
				setHasNoH2SecondFilter(false);
				setHasDuplicatedTitleFilter(false);
				setHasDuplicatedDescriptionFilter(false);
				setTlsImagesFilter(false);
				setTlsScriptsFilter(false);
				setTlsStylesheetsFilter(false);
				setTlsTotalFilter(true);

				newPath = handleRemoveUrlParameter(newPath, "has_title");
				newPath = handleRemoveUrlParameter(newPath, "has_description");
				newPath = handleRemoveUrlParameter(newPath, "has_h1_first");
				newPath = handleRemoveUrlParameter(newPath, "has_h1_second");
				newPath = handleRemoveUrlParameter(newPath, "has_h2_first");
				newPath = handleRemoveUrlParameter(newPath, "has_h2_second");
				newPath = handleRemoveUrlParameter(newPath, "has_duplicated_title");
				newPath = handleRemoveUrlParameter(newPath, "has_duplicated_description");
				newPath = handleRemoveUrlParameter(newPath, "tls_images");
				newPath = handleRemoveUrlParameter(newPath, "tls_scripts");
				newPath = handleRemoveUrlParameter(newPath, "tls_stylesheets");
				newPath = handleRemoveUrlParameter(newPath, "tls_total");
			}
		} else if (filterType === "images") {
			if (filterValue === "internalImages" && filterChecked) {
				setExternalImagesFilter(false);
				setInternalImagesFilter(true);
				setNonWebImagesFilter(false);
				setOtherImagesFilter(false);
				setAllExceptExternalImagesFilter(false);
				setAllExceptInternalImagesFilter(false);
				setAllExceptNonWebImagesFilter(false);
				setAllExceptOtherImagesFilter(false);
				setOkHttpStatusImagesFilter(false);
				setTimeoutHttpStatusImagesFilter(false);
				setErrorHttpStatusImagesFilter(false);
				setOtherErrorHttpStatusImagesFilter(false);
				setTooManyRedirectsHttpStatusImagesFilter(false);
				setAllExceptOkHttpStatusImagesFilter(false);
				setAllExceptTimeoutHttpStatusImagesFilter(false);
				setAllExceptErrorHttpStatusImagesFilter(false);
				setAllExceptOtherErrorHttpStatusImagesFilter(false);
				setAllExceptTooManyRedirectsHttpStatusImagesFilter(false);
				setTlsStatusNoneImagesFilter(false);
				setTlsStatusOkImagesFilter(false);
				setTlsStatusErrorImagesFilter(false);
				setAllExceptTlsStatusNoneImagesFilter(false);
				setAllExceptTlsStatusOkImagesFilter(false);
				setAllExceptTlsStatusErrorImagesFilter(false);
				setNoMissingAltsImagesFilter(false);
				setMissingAltsImagesFilter(false);
				setAllImagesFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "type");
				newPath = handleRemoveUrlParameter(newPath, "type__neq");

				if (newPath.includes("?")) newPath += `&type=PAGE`;
				else newPath += `?type=PAGE`;
			} else if (filterValue === "internalImages" && !filterChecked) {
				filterQueryString?.delete("type") ?? null;

				if (newPath.includes("type")) newPath = handleRemoveUrlParameter(newPath, "type");

				setInternalImagesFilter(false);
			}

			if (filterValue === "allExceptInternalImages" && filterChecked) {
				setExternalImagesFilter(false);
				setInternalImagesFilter(false);
				setNonWebImagesFilter(false);
				setOtherImagesFilter(false);
				setAllExceptExternalImagesFilter(false);
				setAllExceptInternalImagesFilter(true);
				setAllExceptNonWebImagesFilter(false);
				setAllExceptOtherImagesFilter(false);
				setOkHttpStatusImagesFilter(false);
				setTimeoutHttpStatusImagesFilter(false);
				setErrorHttpStatusImagesFilter(false);
				setOtherErrorHttpStatusImagesFilter(false);
				setTooManyRedirectsHttpStatusImagesFilter(false);
				setAllExceptOkHttpStatusImagesFilter(false);
				setAllExceptTimeoutHttpStatusImagesFilter(false);
				setAllExceptErrorHttpStatusImagesFilter(false);
				setAllExceptOtherErrorHttpStatusImagesFilter(false);
				setAllExceptTooManyRedirectsHttpStatusImagesFilter(false);
				setTlsStatusNoneImagesFilter(false);
				setTlsStatusOkImagesFilter(false);
				setTlsStatusErrorImagesFilter(false);
				setAllExceptTlsStatusNoneImagesFilter(false);
				setAllExceptTlsStatusOkImagesFilter(false);
				setAllExceptTlsStatusErrorImagesFilter(false);
				setNoMissingAltsImagesFilter(false);
				setMissingAltsImagesFilter(false);
				setAllImagesFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "type");
				newPath = handleRemoveUrlParameter(newPath, "type__neq");

				if (newPath.includes("?")) newPath += `&type__neq=PAGE`;
				else newPath += `?type__neq=PAGE`;
			} else if (filterValue === "allExceptInternalImages" && !filterChecked) {
				filterQueryString?.delete("type") ?? null;

				if (newPath.includes("type__neq")) newPath = handleRemoveUrlParameter(newPath, "type__neq");

				setAllExceptInternalImagesFilter(false);
			}

			if (filterValue === "externalImages" && filterChecked) {
				setExternalImagesFilter(true);
				setInternalImagesFilter(false);
				setNonWebImagesFilter(false);
				setOtherImagesFilter(false);
				setAllExceptExternalImagesFilter(false);
				setAllExceptInternalImagesFilter(false);
				setAllExceptNonWebImagesFilter(false);
				setAllExceptOtherImagesFilter(false);
				setOkHttpStatusImagesFilter(false);
				setTimeoutHttpStatusImagesFilter(false);
				setErrorHttpStatusImagesFilter(false);
				setOtherErrorHttpStatusImagesFilter(false);
				setTooManyRedirectsHttpStatusImagesFilter(false);
				setAllExceptOkHttpStatusImagesFilter(false);
				setAllExceptTimeoutHttpStatusImagesFilter(false);
				setAllExceptErrorHttpStatusImagesFilter(false);
				setAllExceptOtherErrorHttpStatusImagesFilter(false);
				setAllExceptTooManyRedirectsHttpStatusImagesFilter(false);
				setTlsStatusNoneImagesFilter(false);
				setTlsStatusOkImagesFilter(false);
				setTlsStatusErrorImagesFilter(false);
				setAllExceptTlsStatusNoneImagesFilter(false);
				setAllExceptTlsStatusOkImagesFilter(false);
				setAllExceptTlsStatusErrorImagesFilter(false);
				setNoMissingAltsImagesFilter(false);
				setMissingAltsImagesFilter(false);
				setAllImagesFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "type");
				newPath = handleRemoveUrlParameter(newPath, "type__neq");

				if (newPath.includes("?")) newPath += `&type=EXTERNAL`;
				else newPath += `?type=EXTERNAL`;
			} else if (filterValue === "externalImages" && !filterChecked) {
				filterQueryString?.delete("type") ?? null;

				if (newPath.includes("type")) newPath = handleRemoveUrlParameter(newPath, "type");

				setExternalImagesFilter(false);
			}

			if (filterValue === "allExceptExternalImages" && filterChecked) {
				setExternalImagesFilter(false);
				setInternalImagesFilter(false);
				setNonWebImagesFilter(false);
				setOtherImagesFilter(false);
				setAllExceptExternalImagesFilter(true);
				setAllExceptInternalImagesFilter(false);
				setAllExceptNonWebImagesFilter(false);
				setAllExceptOtherImagesFilter(false);
				setOkHttpStatusImagesFilter(false);
				setTimeoutHttpStatusImagesFilter(false);
				setErrorHttpStatusImagesFilter(false);
				setOtherErrorHttpStatusImagesFilter(false);
				setTooManyRedirectsHttpStatusImagesFilter(false);
				setAllExceptOkHttpStatusImagesFilter(false);
				setAllExceptTimeoutHttpStatusImagesFilter(false);
				setAllExceptErrorHttpStatusImagesFilter(false);
				setAllExceptOtherErrorHttpStatusImagesFilter(false);
				setAllExceptTooManyRedirectsHttpStatusImagesFilter(false);
				setTlsStatusNoneImagesFilter(false);
				setTlsStatusOkImagesFilter(false);
				setTlsStatusErrorImagesFilter(false);
				setAllExceptTlsStatusNoneImagesFilter(false);
				setAllExceptTlsStatusOkImagesFilter(false);
				setAllExceptTlsStatusErrorImagesFilter(false);
				setNoMissingAltsImagesFilter(false);
				setMissingAltsImagesFilter(false);
				setAllImagesFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "type");
				newPath = handleRemoveUrlParameter(newPath, "type__neq");

				if (newPath.includes("?")) newPath += `&type__neq=EXTERNAL`;
				else newPath += `?type__neq=EXTERNAL`;
			} else if (filterValue === "allExceptExternalImages" && !filterChecked) {
				filterQueryString?.delete("type__neq") ?? null;

				if (newPath.includes("type__neq")) newPath = handleRemoveUrlParameter(newPath, "type__neq");

				setAllExceptExternalImagesFilter(false);
			}

			if (filterValue === "nonWebImages" && filterChecked) {
				setExternalImagesFilter(false);
				setInternalImagesFilter(false);
				setNonWebImagesFilter(true);
				setOtherImagesFilter(false);
				setAllExceptExternalImagesFilter(false);
				setAllExceptInternalImagesFilter(false);
				setAllExceptNonWebImagesFilter(false);
				setAllExceptOtherImagesFilter(false);
				setOkHttpStatusImagesFilter(false);
				setTimeoutHttpStatusImagesFilter(false);
				setErrorHttpStatusImagesFilter(false);
				setOtherErrorHttpStatusImagesFilter(false);
				setTooManyRedirectsHttpStatusImagesFilter(false);
				setAllExceptOkHttpStatusImagesFilter(false);
				setAllExceptTimeoutHttpStatusImagesFilter(false);
				setAllExceptErrorHttpStatusImagesFilter(false);
				setAllExceptOtherErrorHttpStatusImagesFilter(false);
				setAllExceptTooManyRedirectsHttpStatusImagesFilter(false);
				setTlsStatusNoneImagesFilter(false);
				setTlsStatusOkImagesFilter(false);
				setTlsStatusErrorImagesFilter(false);
				setAllExceptTlsStatusNoneImagesFilter(false);
				setAllExceptTlsStatusOkImagesFilter(false);
				setAllExceptTlsStatusErrorImagesFilter(false);
				setNoMissingAltsImagesFilter(false);
				setMissingAltsImagesFilter(false);
				setAllImagesFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "type");
				newPath = handleRemoveUrlParameter(newPath, "type__neq");

				if (newPath.includes("?")) newPath += `&type=NON_WEB`;
				else newPath += `?type=NON_WEB`;
			} else if (filterValue === "nonWebImages" && !filterChecked) {
				filterQueryString?.delete("type") ?? null;

				if (newPath.includes("type")) newPath = handleRemoveUrlParameter(newPath, "type");

				setNonWebImagesFilter(false);
			}

			if (filterValue === "allExceptNonWebImages" && filterChecked) {
				setExternalImagesFilter(false);
				setInternalImagesFilter(false);
				setNonWebImagesFilter(false);
				setOtherImagesFilter(false);
				setAllExceptExternalImagesFilter(false);
				setAllExceptInternalImagesFilter(false);
				setAllExceptNonWebImagesFilter(true);
				setAllExceptOtherImagesFilter(false);
				setOkHttpStatusImagesFilter(false);
				setTimeoutHttpStatusImagesFilter(false);
				setErrorHttpStatusImagesFilter(false);
				setOtherErrorHttpStatusImagesFilter(false);
				setTooManyRedirectsHttpStatusImagesFilter(false);
				setAllExceptOkHttpStatusImagesFilter(false);
				setAllExceptTimeoutHttpStatusImagesFilter(false);
				setAllExceptErrorHttpStatusImagesFilter(false);
				setAllExceptOtherErrorHttpStatusImagesFilter(false);
				setAllExceptTooManyRedirectsHttpStatusImagesFilter(false);
				setTlsStatusNoneImagesFilter(false);
				setTlsStatusOkImagesFilter(false);
				setTlsStatusErrorImagesFilter(false);
				setAllExceptTlsStatusNoneImagesFilter(false);
				setAllExceptTlsStatusOkImagesFilter(false);
				setAllExceptTlsStatusErrorImagesFilter(false);
				setNoMissingAltsImagesFilter(false);
				setMissingAltsImagesFilter(false);
				setAllImagesFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "type");
				newPath = handleRemoveUrlParameter(newPath, "type__neq");

				if (newPath.includes("?")) newPath += `&type__neq=NON_WEB`;
				else newPath += `?type__neq=NON_WEB`;
			} else if (filterValue === "allExceptNonWebImages" && !filterChecked) {
				filterQueryString?.delete("type__neq") ?? null;

				if (newPath.includes("type__neq")) newPath = handleRemoveUrlParameter(newPath, "type__neq");

				setAllExceptNonWebImagesFilter(false);
			}

			if (filterValue === "otherImages" && filterChecked) {
				setExternalImagesFilter(false);
				setInternalImagesFilter(false);
				setNonWebImagesFilter(false);
				setOtherImagesFilter(true);
				setAllExceptExternalImagesFilter(false);
				setAllExceptInternalImagesFilter(false);
				setAllExceptNonWebImagesFilter(false);
				setAllExceptOtherImagesFilter(false);
				setOkHttpStatusImagesFilter(false);
				setTimeoutHttpStatusImagesFilter(false);
				setErrorHttpStatusImagesFilter(false);
				setOtherErrorHttpStatusImagesFilter(false);
				setTooManyRedirectsHttpStatusImagesFilter(false);
				setAllExceptOkHttpStatusImagesFilter(false);
				setAllExceptTimeoutHttpStatusImagesFilter(false);
				setAllExceptErrorHttpStatusImagesFilter(false);
				setAllExceptOtherErrorHttpStatusImagesFilter(false);
				setAllExceptTooManyRedirectsHttpStatusImagesFilter(false);
				setTlsStatusNoneImagesFilter(false);
				setTlsStatusOkImagesFilter(false);
				setTlsStatusErrorImagesFilter(false);
				setAllExceptTlsStatusNoneImagesFilter(false);
				setAllExceptTlsStatusOkImagesFilter(false);
				setAllExceptTlsStatusErrorImagesFilter(false);
				setNoMissingAltsImagesFilter(false);
				setMissingAltsImagesFilter(false);
				setAllImagesFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "type");
				newPath = handleRemoveUrlParameter(newPath, "type__neq");

				if (newPath.includes("?")) newPath += `&type=OTHER`;
				else newPath += `?type=OTHER`;
			} else if (filterValue === "otherImages" && !filterChecked) {
				filterQueryString?.delete("type") ?? null;

				if (newPath.includes("type")) newPath = handleRemoveUrlParameter(newPath, "type");

				setOtherImagesFilter(false);
			}

			if (filterValue === "allExceptOtherImages" && filterChecked) {
				setExternalImagesFilter(false);
				setInternalImagesFilter(false);
				setNonWebImagesFilter(false);
				setOtherImagesFilter(false);
				setAllExceptExternalImagesFilter(false);
				setAllExceptInternalImagesFilter(false);
				setAllExceptNonWebImagesFilter(false);
				setAllExceptOtherImagesFilter(true);
				setOkHttpStatusImagesFilter(false);
				setTimeoutHttpStatusImagesFilter(false);
				setErrorHttpStatusImagesFilter(false);
				setOtherErrorHttpStatusImagesFilter(false);
				setTooManyRedirectsHttpStatusImagesFilter(false);
				setAllExceptOkHttpStatusImagesFilter(false);
				setAllExceptTimeoutHttpStatusImagesFilter(false);
				setAllExceptErrorHttpStatusImagesFilter(false);
				setAllExceptOtherErrorHttpStatusImagesFilter(false);
				setAllExceptTooManyRedirectsHttpStatusImagesFilter(false);
				setTlsStatusNoneImagesFilter(false);
				setTlsStatusOkImagesFilter(false);
				setTlsStatusErrorImagesFilter(false);
				setAllExceptTlsStatusNoneImagesFilter(false);
				setAllExceptTlsStatusOkImagesFilter(false);
				setAllExceptTlsStatusErrorImagesFilter(false);
				setNoMissingAltsImagesFilter(false);
				setMissingAltsImagesFilter(false);
				setAllImagesFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "type");
				newPath = handleRemoveUrlParameter(newPath, "type__neq");

				if (newPath.includes("?")) newPath += `&type__neq=OTHER`;
				else newPath += `?type__neq=OTHER`;
			} else if (filterValue === "allExceptOtherImages" && !filterChecked) {
				filterQueryString?.delete("type__neq") ?? null;

				if (newPath.includes("type__neq")) newPath = handleRemoveUrlParameter(newPath, "type__neq");

				setAllExceptOtherImagesFilter(false);
			}

			if (filterValue === "okHttpStatusImages" && filterChecked) {
				setExternalImagesFilter(false);
				setInternalImagesFilter(false);
				setNonWebImagesFilter(false);
				setOtherImagesFilter(false);
				setAllExceptExternalImagesFilter(false);
				setAllExceptInternalImagesFilter(false);
				setAllExceptNonWebImagesFilter(false);
				setAllExceptOtherImagesFilter(false);
				setOkHttpStatusImagesFilter(true);
				setTimeoutHttpStatusImagesFilter(false);
				setErrorHttpStatusImagesFilter(false);
				setOtherErrorHttpStatusImagesFilter(false);
				setTooManyRedirectsHttpStatusImagesFilter(false);
				setAllExceptOkHttpStatusImagesFilter(false);
				setAllExceptTimeoutHttpStatusImagesFilter(false);
				setAllExceptErrorHttpStatusImagesFilter(false);
				setAllExceptOtherErrorHttpStatusImagesFilter(false);
				setAllExceptTooManyRedirectsHttpStatusImagesFilter(false);
				setTlsStatusNoneImagesFilter(false);
				setTlsStatusOkImagesFilter(false);
				setTlsStatusErrorImagesFilter(false);
				setAllExceptTlsStatusNoneImagesFilter(false);
				setAllExceptTlsStatusOkImagesFilter(false);
				setAllExceptTlsStatusErrorImagesFilter(false);
				setNoMissingAltsImagesFilter(false);
				setMissingAltsImagesFilter(false);
				setAllImagesFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "status");
				newPath = handleRemoveUrlParameter(newPath, "status__neq");

				if (newPath.includes("?")) newPath += `&status=OK`;
				else newPath += `?status=OK`;
			} else if (filterValue === "okHttpStatusImages" && !filterChecked) {
				filterQueryString?.delete("status") ?? null;

				if (newPath.includes("status")) newPath = handleRemoveUrlParameter(newPath, "status");

				setOkHttpStatusImagesFilter(false);
			}

			if (filterValue === "allExceptOkHttpStatusImages" && filterChecked) {
				setExternalImagesFilter(false);
				setInternalImagesFilter(false);
				setNonWebImagesFilter(false);
				setOtherImagesFilter(false);
				setAllExceptExternalImagesFilter(false);
				setAllExceptInternalImagesFilter(false);
				setAllExceptNonWebImagesFilter(false);
				setAllExceptOtherImagesFilter(false);
				setOkHttpStatusImagesFilter(false);
				setTimeoutHttpStatusImagesFilter(false);
				setErrorHttpStatusImagesFilter(false);
				setOtherErrorHttpStatusImagesFilter(false);
				setTooManyRedirectsHttpStatusImagesFilter(false);
				setAllExceptOkHttpStatusImagesFilter(true);
				setAllExceptTimeoutHttpStatusImagesFilter(false);
				setAllExceptErrorHttpStatusImagesFilter(false);
				setAllExceptOtherErrorHttpStatusImagesFilter(false);
				setAllExceptTooManyRedirectsHttpStatusImagesFilter(false);
				setTlsStatusNoneImagesFilter(false);
				setTlsStatusOkImagesFilter(false);
				setTlsStatusErrorImagesFilter(false);
				setAllExceptTlsStatusNoneImagesFilter(false);
				setAllExceptTlsStatusOkImagesFilter(false);
				setAllExceptTlsStatusErrorImagesFilter(false);
				setNoMissingAltsImagesFilter(false);
				setMissingAltsImagesFilter(false);
				setAllImagesFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "status");
				newPath = handleRemoveUrlParameter(newPath, "status__neq");

				if (newPath.includes("?")) newPath += `&status__neq=OK`;
				else newPath += `?status__neq=OK`;
			} else if (filterValue === "allExceptOkHttpStatusImages" && !filterChecked) {
				filterQueryString?.delete("status__neq") ?? null;

				if (newPath.includes("status__neq")) newPath = handleRemoveUrlParameter(newPath, "status__neq");

				setAllExceptOkHttpStatusImagesFilter(false);
			}

			if (filterValue === "timeoutHttpStatusImages" && filterChecked) {
				setExternalImagesFilter(false);
				setInternalImagesFilter(false);
				setNonWebImagesFilter(false);
				setOtherImagesFilter(false);
				setAllExceptExternalImagesFilter(false);
				setAllExceptInternalImagesFilter(false);
				setAllExceptNonWebImagesFilter(false);
				setAllExceptOtherImagesFilter(false);
				setOkHttpStatusImagesFilter(false);
				setTimeoutHttpStatusImagesFilter(true);
				setErrorHttpStatusImagesFilter(false);
				setOtherErrorHttpStatusImagesFilter(false);
				setTooManyRedirectsHttpStatusImagesFilter(false);
				setAllExceptOkHttpStatusImagesFilter(false);
				setAllExceptTimeoutHttpStatusImagesFilter(false);
				setAllExceptErrorHttpStatusImagesFilter(false);
				setAllExceptOtherErrorHttpStatusImagesFilter(false);
				setAllExceptTooManyRedirectsHttpStatusImagesFilter(false);
				setTlsStatusNoneImagesFilter(false);
				setTlsStatusOkImagesFilter(false);
				setTlsStatusErrorImagesFilter(false);
				setAllExceptTlsStatusNoneImagesFilter(false);
				setAllExceptTlsStatusOkImagesFilter(false);
				setAllExceptTlsStatusErrorImagesFilter(false);
				setNoMissingAltsImagesFilter(false);
				setMissingAltsImagesFilter(false);
				setAllImagesFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "status");
				newPath = handleRemoveUrlParameter(newPath, "status__neq");

				if (newPath.includes("?")) newPath += `&status=TIMEOUT`;
				else newPath += `?status=TIMEOUT`;
			} else if (filterValue === "timeoutHttpStatusImages" && !filterChecked) {
				filterQueryString?.delete("status") ?? null;

				if (newPath.includes("status")) newPath = handleRemoveUrlParameter(newPath, "status");

				setTimeoutHttpStatusImagesFilter(false);
			}

			if (filterValue === "allExceptTimeoutHttpStatusImages" && filterChecked) {
				setExternalImagesFilter(false);
				setInternalImagesFilter(false);
				setNonWebImagesFilter(false);
				setOtherImagesFilter(false);
				setAllExceptExternalImagesFilter(false);
				setAllExceptInternalImagesFilter(false);
				setAllExceptNonWebImagesFilter(false);
				setAllExceptOtherImagesFilter(false);
				setOkHttpStatusImagesFilter(false);
				setTimeoutHttpStatusImagesFilter(false);
				setErrorHttpStatusImagesFilter(false);
				setOtherErrorHttpStatusImagesFilter(false);
				setTooManyRedirectsHttpStatusImagesFilter(false);
				setAllExceptOkHttpStatusImagesFilter(false);
				setAllExceptTimeoutHttpStatusImagesFilter(true);
				setAllExceptErrorHttpStatusImagesFilter(false);
				setAllExceptOtherErrorHttpStatusImagesFilter(false);
				setAllExceptTooManyRedirectsHttpStatusImagesFilter(false);
				setTlsStatusNoneImagesFilter(false);
				setTlsStatusOkImagesFilter(false);
				setTlsStatusErrorImagesFilter(false);
				setAllExceptTlsStatusNoneImagesFilter(false);
				setAllExceptTlsStatusOkImagesFilter(false);
				setAllExceptTlsStatusErrorImagesFilter(false);
				setNoMissingAltsImagesFilter(false);
				setMissingAltsImagesFilter(false);
				setAllImagesFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "status");
				newPath = handleRemoveUrlParameter(newPath, "status__neq");

				if (newPath.includes("?")) newPath += `&status__neq=TIMEOUT`;
				else newPath += `?status__neq=TIMEOUT`;
			} else if (filterValue === "allExceptTimeoutHttpStatusImages" && !filterChecked) {
				filterQueryString?.delete("status__neq") ?? null;

				if (newPath.includes("status__neq")) newPath = handleRemoveUrlParameter(newPath, "status__neq");

				setAllExceptTimeoutHttpStatusImagesFilter(false);
			}

			if (filterValue === "errorHttpStatusImages" && filterChecked) {
				setExternalImagesFilter(false);
				setInternalImagesFilter(false);
				setNonWebImagesFilter(false);
				setOtherImagesFilter(false);
				setAllExceptExternalImagesFilter(false);
				setAllExceptInternalImagesFilter(false);
				setAllExceptNonWebImagesFilter(false);
				setAllExceptOtherImagesFilter(false);
				setOkHttpStatusImagesFilter(false);
				setTimeoutHttpStatusImagesFilter(false);
				setErrorHttpStatusImagesFilter(true);
				setOtherErrorHttpStatusImagesFilter(false);
				setTooManyRedirectsHttpStatusImagesFilter(false);
				setAllExceptOkHttpStatusImagesFilter(false);
				setAllExceptTimeoutHttpStatusImagesFilter(false);
				setAllExceptErrorHttpStatusImagesFilter(false);
				setAllExceptOtherErrorHttpStatusImagesFilter(false);
				setAllExceptTooManyRedirectsHttpStatusImagesFilter(false);
				setTlsStatusNoneImagesFilter(false);
				setTlsStatusOkImagesFilter(false);
				setTlsStatusErrorImagesFilter(false);
				setAllExceptTlsStatusNoneImagesFilter(false);
				setAllExceptTlsStatusOkImagesFilter(false);
				setAllExceptTlsStatusErrorImagesFilter(false);
				setNoMissingAltsImagesFilter(false);
				setMissingAltsImagesFilter(false);
				setAllImagesFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "status");
				newPath = handleRemoveUrlParameter(newPath, "status__neq");

				if (newPath.includes("?")) newPath += `&status=HTTP_ERROR`;
				else newPath += `?status=HTTP_ERROR`;
			} else if (filterValue === "errorHttpStatusImages" && !filterChecked) {
				filterQueryString?.delete("status") ?? null;

				if (newPath.includes("status")) newPath = handleRemoveUrlParameter(newPath, "status");

				setErrorHttpStatusImagesFilter(false);
			}

			if (filterValue === "allExceptErrorHttpStatusImages" && filterChecked) {
				setExternalImagesFilter(false);
				setInternalImagesFilter(false);
				setNonWebImagesFilter(false);
				setOtherImagesFilter(false);
				setAllExceptExternalImagesFilter(false);
				setAllExceptInternalImagesFilter(false);
				setAllExceptNonWebImagesFilter(false);
				setAllExceptOtherImagesFilter(false);
				setOkHttpStatusImagesFilter(false);
				setTimeoutHttpStatusImagesFilter(false);
				setErrorHttpStatusImagesFilter(false);
				setOtherErrorHttpStatusImagesFilter(false);
				setTooManyRedirectsHttpStatusImagesFilter(false);
				setAllExceptOkHttpStatusImagesFilter(false);
				setAllExceptTimeoutHttpStatusImagesFilter(false);
				setAllExceptErrorHttpStatusImagesFilter(true);
				setAllExceptOtherErrorHttpStatusImagesFilter(false);
				setAllExceptTooManyRedirectsHttpStatusImagesFilter(false);
				setTlsStatusNoneImagesFilter(false);
				setTlsStatusOkImagesFilter(false);
				setTlsStatusErrorImagesFilter(false);
				setAllExceptTlsStatusNoneImagesFilter(false);
				setAllExceptTlsStatusOkImagesFilter(false);
				setAllExceptTlsStatusErrorImagesFilter(false);
				setNoMissingAltsImagesFilter(false);
				setMissingAltsImagesFilter(false);
				setAllImagesFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "status");
				newPath = handleRemoveUrlParameter(newPath, "status__neq");

				if (newPath.includes("?")) newPath += `&status__neq=HTTP_ERROR`;
				else newPath += `?status__neq=HTTP_ERROR`;
			} else if (filterValue === "allExceptErrorHttpStatusImages" && !filterChecked) {
				filterQueryString?.delete("status__neq") ?? null;

				if (newPath.includes("status__neq")) newPath = handleRemoveUrlParameter(newPath, "status__neq");

				setAllExceptErrorHttpStatusImagesFilter(false);
			}

			if (filterValue === "otherErrorHttpStatusImages" && filterChecked) {
				setExternalImagesFilter(false);
				setInternalImagesFilter(false);
				setNonWebImagesFilter(false);
				setOtherImagesFilter(false);
				setAllExceptExternalImagesFilter(false);
				setAllExceptInternalImagesFilter(false);
				setAllExceptNonWebImagesFilter(false);
				setAllExceptOtherImagesFilter(false);
				setOkHttpStatusImagesFilter(false);
				setTimeoutHttpStatusImagesFilter(false);
				setErrorHttpStatusImagesFilter(false);
				setOtherErrorHttpStatusImagesFilter(true);
				setTooManyRedirectsHttpStatusImagesFilter(false);
				setAllExceptOkHttpStatusImagesFilter(false);
				setAllExceptTimeoutHttpStatusImagesFilter(false);
				setAllExceptErrorHttpStatusImagesFilter(false);
				setAllExceptOtherErrorHttpStatusImagesFilter(false);
				setAllExceptTooManyRedirectsHttpStatusImagesFilter(false);
				setTlsStatusNoneImagesFilter(false);
				setTlsStatusOkImagesFilter(false);
				setTlsStatusErrorImagesFilter(false);
				setAllExceptTlsStatusNoneImagesFilter(false);
				setAllExceptTlsStatusOkImagesFilter(false);
				setAllExceptTlsStatusErrorImagesFilter(false);
				setNoMissingAltsImagesFilter(false);
				setMissingAltsImagesFilter(false);
				setAllImagesFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "status");
				newPath = handleRemoveUrlParameter(newPath, "status__neq");

				if (newPath.includes("?")) newPath += `&status=OTHER_ERROR`;
				else newPath += `?status=OTHER_ERROR`;
			} else if (filterValue === "otherErrorHttpStatusImages" && !filterChecked) {
				filterQueryString?.delete("status") ?? null;

				if (newPath.includes("status")) newPath = handleRemoveUrlParameter(newPath, "status");

				setOtherErrorHttpStatusImagesFilter(false);
			}

			if (filterValue === "allExceptOtherErrorHttpStatusImages" && filterChecked) {
				setExternalImagesFilter(false);
				setInternalImagesFilter(false);
				setNonWebImagesFilter(false);
				setOtherImagesFilter(false);
				setAllExceptExternalImagesFilter(false);
				setAllExceptInternalImagesFilter(false);
				setAllExceptNonWebImagesFilter(false);
				setAllExceptOtherImagesFilter(false);
				setOkHttpStatusImagesFilter(false);
				setTimeoutHttpStatusImagesFilter(false);
				setErrorHttpStatusImagesFilter(false);
				setOtherErrorHttpStatusImagesFilter(false);
				setTooManyRedirectsHttpStatusImagesFilter(false);
				setAllExceptOkHttpStatusImagesFilter(false);
				setAllExceptTimeoutHttpStatusImagesFilter(false);
				setAllExceptErrorHttpStatusImagesFilter(false);
				setAllExceptOtherErrorHttpStatusImagesFilter(true);
				setAllExceptTooManyRedirectsHttpStatusImagesFilter(false);
				setTlsStatusNoneImagesFilter(false);
				setTlsStatusOkImagesFilter(false);
				setTlsStatusErrorImagesFilter(false);
				setAllExceptTlsStatusNoneImagesFilter(false);
				setAllExceptTlsStatusOkImagesFilter(false);
				setAllExceptTlsStatusErrorImagesFilter(false);
				setNoMissingAltsImagesFilter(false);
				setMissingAltsImagesFilter(false);
				setAllImagesFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "status");
				newPath = handleRemoveUrlParameter(newPath, "status__neq");

				if (newPath.includes("?")) newPath += `&status__neq=OTHER_ERROR`;
				else newPath += `?status__neq=OTHER_ERROR`;
			} else if (filterValue === "allExceptOtherErrorHttpStatusImages" && !filterChecked) {
				filterQueryString?.delete("status__neq") ?? null;

				if (newPath.includes("status__neq")) newPath = handleRemoveUrlParameter(newPath, "status__neq");

				setAllExceptOtherErrorHttpStatusImagesFilter(false);
			}

			if (filterValue === "tooManyRedirectsHttpStatusImages" && filterChecked) {
				setExternalImagesFilter(false);
				setInternalImagesFilter(false);
				setNonWebImagesFilter(false);
				setOtherImagesFilter(false);
				setAllExceptExternalImagesFilter(false);
				setAllExceptInternalImagesFilter(false);
				setAllExceptNonWebImagesFilter(false);
				setAllExceptOtherImagesFilter(false);
				setOkHttpStatusImagesFilter(false);
				setTimeoutHttpStatusImagesFilter(false);
				setErrorHttpStatusImagesFilter(false);
				setOtherErrorHttpStatusImagesFilter(false);
				setTooManyRedirectsHttpStatusImagesFilter(true);
				setAllExceptOkHttpStatusImagesFilter(false);
				setAllExceptTimeoutHttpStatusImagesFilter(false);
				setAllExceptErrorHttpStatusImagesFilter(false);
				setAllExceptOtherErrorHttpStatusImagesFilter(false);
				setAllExceptTooManyRedirectsHttpStatusImagesFilter(false);
				setTlsStatusNoneImagesFilter(false);
				setTlsStatusOkImagesFilter(false);
				setTlsStatusErrorImagesFilter(false);
				setAllExceptTlsStatusNoneImagesFilter(false);
				setAllExceptTlsStatusOkImagesFilter(false);
				setAllExceptTlsStatusErrorImagesFilter(false);
				setNoMissingAltsImagesFilter(false);
				setMissingAltsImagesFilter(false);
				setAllImagesFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "status");
				newPath = handleRemoveUrlParameter(newPath, "status__neq");

				if (newPath.includes("?")) newPath += `&status=TOO_MANY_REDIRECTS`;
				else newPath += `?status=TOO_MANY_REDIRECTS`;
			} else if (filterValue === "tooManyRedirectsHttpStatusImages" && !filterChecked) {
				filterQueryString?.delete("status") ?? null;

				if (newPath.includes("status")) newPath = handleRemoveUrlParameter(newPath, "status");

				setTooManyRedirectsHttpStatusImagesFilter(false);
			}

			if (filterValue === "allExceptTooManyRedirectsHttpStatusImages" && filterChecked) {
				setExternalImagesFilter(false);
				setInternalImagesFilter(false);
				setNonWebImagesFilter(false);
				setOtherImagesFilter(false);
				setAllExceptExternalImagesFilter(false);
				setAllExceptInternalImagesFilter(false);
				setAllExceptNonWebImagesFilter(false);
				setAllExceptOtherImagesFilter(false);
				setOkHttpStatusImagesFilter(false);
				setTimeoutHttpStatusImagesFilter(false);
				setErrorHttpStatusImagesFilter(false);
				setOtherErrorHttpStatusImagesFilter(false);
				setTooManyRedirectsHttpStatusImagesFilter(false);
				setAllExceptOkHttpStatusImagesFilter(false);
				setAllExceptTimeoutHttpStatusImagesFilter(false);
				setAllExceptErrorHttpStatusImagesFilter(false);
				setAllExceptOtherErrorHttpStatusImagesFilter(false);
				setAllExceptTooManyRedirectsHttpStatusImagesFilter(true);
				setTlsStatusNoneImagesFilter(false);
				setTlsStatusOkImagesFilter(false);
				setTlsStatusErrorImagesFilter(false);
				setAllExceptTlsStatusNoneImagesFilter(false);
				setAllExceptTlsStatusOkImagesFilter(false);
				setAllExceptTlsStatusErrorImagesFilter(false);
				setNoMissingAltsImagesFilter(false);
				setMissingAltsImagesFilter(false);
				setAllImagesFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "status");
				newPath = handleRemoveUrlParameter(newPath, "status__neq");

				if (newPath.includes("?")) newPath += `&status__neq=TOO_MANY_REDIRECTS`;
				else newPath += `?status__neq=TOO_MANY_REDIRECTS`;
			} else if (filterValue === "allExceptTooManyRedirectsHttpStatusImages" && !filterChecked) {
				filterQueryString?.delete("status__neq") ?? null;

				if (newPath.includes("status__neq")) newPath = handleRemoveUrlParameter(newPath, "status__neq");

				setAllExceptTooManyRedirectsHttpStatusImagesFilter(false);
			}

			if (filterValue === "tlsStatusNoneImages" && filterChecked) {
				setExternalImagesFilter(false);
				setInternalImagesFilter(false);
				setNonWebImagesFilter(false);
				setOtherImagesFilter(false);
				setAllExceptExternalImagesFilter(false);
				setAllExceptInternalImagesFilter(false);
				setAllExceptNonWebImagesFilter(false);
				setAllExceptOtherImagesFilter(false);
				setOkHttpStatusImagesFilter(false);
				setTimeoutHttpStatusImagesFilter(false);
				setErrorHttpStatusImagesFilter(false);
				setOtherErrorHttpStatusImagesFilter(false);
				setTooManyRedirectsHttpStatusImagesFilter(false);
				setAllExceptOkHttpStatusImagesFilter(false);
				setAllExceptTimeoutHttpStatusImagesFilter(false);
				setAllExceptErrorHttpStatusImagesFilter(false);
				setAllExceptOtherErrorHttpStatusImagesFilter(false);
				setAllExceptTooManyRedirectsHttpStatusImagesFilter(false);
				setTlsStatusNoneImagesFilter(true);
				setTlsStatusOkImagesFilter(false);
				setTlsStatusErrorImagesFilter(false);
				setAllExceptTlsStatusNoneImagesFilter(false);
				setAllExceptTlsStatusOkImagesFilter(false);
				setAllExceptTlsStatusErrorImagesFilter(false);
				setNoMissingAltsImagesFilter(false);
				setMissingAltsImagesFilter(false);
				setAllImagesFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "tls_status");
				newPath = handleRemoveUrlParameter(newPath, "tls_status__neq");

				if (newPath.includes("?")) newPath += `&tls_status=NONE`;
				else newPath += `?tls_status=NONE`;
			} else if (filterValue === "tlsStatusNoneImages" && !filterChecked) {
				filterQueryString?.delete("tls_status") ?? null;

				if (newPath.includes("tls_status")) newPath = handleRemoveUrlParameter(newPath, "tls_status");

				setTlsStatusNoneImagesFilter(false);
			}

			if (filterValue === "allExceptTlsStatusNoneImages" && filterChecked) {
				setExternalImagesFilter(false);
				setInternalImagesFilter(false);
				setNonWebImagesFilter(false);
				setOtherImagesFilter(false);
				setAllExceptExternalImagesFilter(false);
				setAllExceptInternalImagesFilter(false);
				setAllExceptNonWebImagesFilter(false);
				setAllExceptOtherImagesFilter(false);
				setOkHttpStatusImagesFilter(false);
				setTimeoutHttpStatusImagesFilter(false);
				setErrorHttpStatusImagesFilter(false);
				setOtherErrorHttpStatusImagesFilter(false);
				setTooManyRedirectsHttpStatusImagesFilter(false);
				setAllExceptOkHttpStatusImagesFilter(false);
				setAllExceptTimeoutHttpStatusImagesFilter(false);
				setAllExceptErrorHttpStatusImagesFilter(false);
				setAllExceptOtherErrorHttpStatusImagesFilter(false);
				setAllExceptTooManyRedirectsHttpStatusImagesFilter(false);
				setTlsStatusNoneImagesFilter(false);
				setTlsStatusOkImagesFilter(false);
				setTlsStatusErrorImagesFilter(false);
				setAllExceptTlsStatusNoneImagesFilter(true);
				setAllExceptTlsStatusOkImagesFilter(false);
				setAllExceptTlsStatusErrorImagesFilter(false);
				setNoMissingAltsImagesFilter(false);
				setMissingAltsImagesFilter(false);
				setAllImagesFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "tls_status");
				newPath = handleRemoveUrlParameter(newPath, "tls_status__neq");

				if (newPath.includes("?")) newPath += `&tls_status__neq=NONE`;
				else newPath += `?tls_status__neq=NONE`;
			} else if (filterValue === "allExceptTlsStatusNoneImages" && !filterChecked) {
				filterQueryString?.delete("tls_status__neq") ?? null;

				if (newPath.includes("tls_status__neq")) newPath = handleRemoveUrlParameter(newPath, "tls_status__neq");

				setAllExceptTlsStatusNoneImagesFilter(false);
			}

			if (filterValue === "tlsStatusOkImages" && filterChecked) {
				setExternalImagesFilter(false);
				setInternalImagesFilter(false);
				setNonWebImagesFilter(false);
				setOtherImagesFilter(false);
				setAllExceptExternalImagesFilter(false);
				setAllExceptInternalImagesFilter(false);
				setAllExceptNonWebImagesFilter(false);
				setAllExceptOtherImagesFilter(false);
				setOkHttpStatusImagesFilter(false);
				setTimeoutHttpStatusImagesFilter(false);
				setErrorHttpStatusImagesFilter(false);
				setOtherErrorHttpStatusImagesFilter(false);
				setTooManyRedirectsHttpStatusImagesFilter(false);
				setAllExceptOkHttpStatusImagesFilter(false);
				setAllExceptTimeoutHttpStatusImagesFilter(false);
				setAllExceptErrorHttpStatusImagesFilter(false);
				setAllExceptOtherErrorHttpStatusImagesFilter(false);
				setAllExceptTooManyRedirectsHttpStatusImagesFilter(false);
				setTlsStatusNoneImagesFilter(false);
				setTlsStatusOkImagesFilter(true);
				setTlsStatusErrorImagesFilter(false);
				setAllExceptTlsStatusNoneImagesFilter(false);
				setAllExceptTlsStatusOkImagesFilter(false);
				setAllExceptTlsStatusErrorImagesFilter(false);
				setNoMissingAltsImagesFilter(false);
				setMissingAltsImagesFilter(false);
				setAllImagesFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "tls_status");
				newPath = handleRemoveUrlParameter(newPath, "tls_status__neq");

				if (newPath.includes("?")) newPath += `&tls_status=OK`;
				else newPath += `?tls_status=OK`;
			} else if (filterValue === "tlsStatusOkImages" && !filterChecked) {
				filterQueryString?.delete("tls_status") ?? null;

				if (newPath.includes("tls_status")) newPath = handleRemoveUrlParameter(newPath, "tls_status");

				setTlsStatusOkImagesFilter(false);
			}

			if (filterValue === "allExceptTlsStatusOkImages" && filterChecked) {
				setExternalImagesFilter(false);
				setInternalImagesFilter(false);
				setNonWebImagesFilter(false);
				setOtherImagesFilter(false);
				setAllExceptExternalImagesFilter(false);
				setAllExceptInternalImagesFilter(false);
				setAllExceptNonWebImagesFilter(false);
				setAllExceptOtherImagesFilter(false);
				setOkHttpStatusImagesFilter(false);
				setTimeoutHttpStatusImagesFilter(false);
				setErrorHttpStatusImagesFilter(false);
				setOtherErrorHttpStatusImagesFilter(false);
				setTooManyRedirectsHttpStatusImagesFilter(false);
				setAllExceptOkHttpStatusImagesFilter(false);
				setAllExceptTimeoutHttpStatusImagesFilter(false);
				setAllExceptErrorHttpStatusImagesFilter(false);
				setAllExceptOtherErrorHttpStatusImagesFilter(false);
				setAllExceptTooManyRedirectsHttpStatusImagesFilter(false);
				setTlsStatusNoneImagesFilter(false);
				setTlsStatusOkImagesFilter(false);
				setTlsStatusErrorImagesFilter(false);
				setAllExceptTlsStatusNoneImagesFilter(false);
				setAllExceptTlsStatusOkImagesFilter(true);
				setAllExceptTlsStatusErrorImagesFilter(false);
				setNoMissingAltsImagesFilter(false);
				setMissingAltsImagesFilter(false);
				setAllImagesFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "tls_status");
				newPath = handleRemoveUrlParameter(newPath, "tls_status__neq");

				if (newPath.includes("?")) newPath += `&tls_status__neq=OK`;
				else newPath += `?tls_status__neq=OK`;
			} else if (filterValue === "allExceptTlsStatusOkImages" && !filterChecked) {
				filterQueryString?.delete("tls_status__neq") ?? null;

				if (newPath.includes("tls_status__neq")) newPath = handleRemoveUrlParameter(newPath, "tls_status__neq");

				setAllExceptTlsStatusOkImagesFilter(false);
			}

			if (filterValue === "tlsStatusErrorImages" && filterChecked) {
				setExternalImagesFilter(false);
				setInternalImagesFilter(false);
				setNonWebImagesFilter(false);
				setOtherImagesFilter(false);
				setAllExceptExternalImagesFilter(false);
				setAllExceptInternalImagesFilter(false);
				setAllExceptNonWebImagesFilter(false);
				setAllExceptOtherImagesFilter(false);
				setOkHttpStatusImagesFilter(false);
				setTimeoutHttpStatusImagesFilter(false);
				setErrorHttpStatusImagesFilter(false);
				setOtherErrorHttpStatusImagesFilter(false);
				setTooManyRedirectsHttpStatusImagesFilter(false);
				setAllExceptOkHttpStatusImagesFilter(false);
				setAllExceptTimeoutHttpStatusImagesFilter(false);
				setAllExceptErrorHttpStatusImagesFilter(false);
				setAllExceptOtherErrorHttpStatusImagesFilter(false);
				setAllExceptTooManyRedirectsHttpStatusImagesFilter(false);
				setTlsStatusNoneImagesFilter(false);
				setTlsStatusOkImagesFilter(false);
				setTlsStatusErrorImagesFilter(true);
				setAllExceptTlsStatusNoneImagesFilter(false);
				setAllExceptTlsStatusOkImagesFilter(false);
				setAllExceptTlsStatusErrorImagesFilter(false);
				setNoMissingAltsImagesFilter(false);
				setMissingAltsImagesFilter(false);
				setAllImagesFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "tls_status");
				newPath = handleRemoveUrlParameter(newPath, "tls_status__neq");

				if (newPath.includes("?")) newPath += `&tls_status=ERROR`;
				else newPath += `?tls_status=ERROR`;
			} else if (filterValue === "tlsStatusErrorImages" && !filterChecked) {
				filterQueryString?.delete("tls_status") ?? null;

				if (newPath.includes("tls_status")) newPath = handleRemoveUrlParameter(newPath, "tls_status");

				setTlsStatusErrorImagesFilter(false);
			}

			if (filterValue === "allExceptTlsStatusErrorImages" && filterChecked) {
				setExternalImagesFilter(false);
				setInternalImagesFilter(false);
				setNonWebImagesFilter(false);
				setOtherImagesFilter(false);
				setAllExceptExternalImagesFilter(false);
				setAllExceptInternalImagesFilter(false);
				setAllExceptNonWebImagesFilter(false);
				setAllExceptOtherImagesFilter(false);
				setOkHttpStatusImagesFilter(false);
				setTimeoutHttpStatusImagesFilter(false);
				setErrorHttpStatusImagesFilter(false);
				setOtherErrorHttpStatusImagesFilter(false);
				setTooManyRedirectsHttpStatusImagesFilter(false);
				setAllExceptOkHttpStatusImagesFilter(false);
				setAllExceptTimeoutHttpStatusImagesFilter(false);
				setAllExceptErrorHttpStatusImagesFilter(false);
				setAllExceptOtherErrorHttpStatusImagesFilter(false);
				setAllExceptTooManyRedirectsHttpStatusImagesFilter(false);
				setTlsStatusNoneImagesFilter(false);
				setTlsStatusOkImagesFilter(false);
				setTlsStatusErrorImagesFilter(false);
				setAllExceptTlsStatusNoneImagesFilter(false);
				setAllExceptTlsStatusOkImagesFilter(false);
				setAllExceptTlsStatusErrorImagesFilter(true);
				setNoMissingAltsImagesFilter(false);
				setMissingAltsImagesFilter(false);
				setAllImagesFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "tls_status");
				newPath = handleRemoveUrlParameter(newPath, "tls_status__neq");

				if (newPath.includes("?")) newPath += `&tls_status__neq=ERROR`;
				else newPath += `?tls_status__neq=ERROR`;
			} else if (filterValue === "allExceptTlsStatusErrorImages" && !filterChecked) {
				filterQueryString?.delete("tls_status__neq") ?? null;

				if (newPath.includes("tls_status__neq")) newPath = handleRemoveUrlParameter(newPath, "tls_status__neq");

				setAllExceptTlsStatusErrorImagesFilter(false);
			}

			if (filterValue === "noMissingAltsImages" && filterChecked) {
				setExternalImagesFilter(false);
				setInternalImagesFilter(false);
				setNonWebImagesFilter(false);
				setOtherImagesFilter(false);
				setAllExceptExternalImagesFilter(false);
				setAllExceptInternalImagesFilter(false);
				setAllExceptNonWebImagesFilter(false);
				setAllExceptOtherImagesFilter(false);
				setOkHttpStatusImagesFilter(false);
				setTimeoutHttpStatusImagesFilter(false);
				setErrorHttpStatusImagesFilter(false);
				setOtherErrorHttpStatusImagesFilter(false);
				setTooManyRedirectsHttpStatusImagesFilter(false);
				setAllExceptOkHttpStatusImagesFilter(false);
				setAllExceptTimeoutHttpStatusImagesFilter(false);
				setAllExceptErrorHttpStatusImagesFilter(false);
				setAllExceptOtherErrorHttpStatusImagesFilter(false);
				setAllExceptTooManyRedirectsHttpStatusImagesFilter(false);
				setTlsStatusNoneImagesFilter(false);
				setTlsStatusOkImagesFilter(false);
				setTlsStatusErrorImagesFilter(false);
				setAllExceptTlsStatusNoneImagesFilter(false);
				setAllExceptTlsStatusOkImagesFilter(false);
				setAllExceptTlsStatusErrorImagesFilter(false);
				setNoMissingAltsImagesFilter(true);
				setMissingAltsImagesFilter(false);
				setAllImagesFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "missing_alts__gt");
				newPath = handleRemoveUrlParameter(newPath, "missing_alts__lte");

				if (newPath.includes("?")) newPath += `&missing_alts__lte=0`;
				else newPath += `?missing_alts__lte=0`;
			} else if (filterValue === "noMissingAltsImages" && !filterChecked) {
				filterQueryString?.delete("missing_alts__lte") ?? null;

				if (newPath.includes("missing_alts__lte")) newPath = handleRemoveUrlParameter(newPath, "missing_alts__lte");

				setNoMissingAltsImagesFilter(false);
			}

			if (filterValue === "missingAltsImages" && filterChecked) {
				setExternalImagesFilter(false);
				setInternalImagesFilter(false);
				setNonWebImagesFilter(false);
				setOtherImagesFilter(false);
				setAllExceptExternalImagesFilter(false);
				setAllExceptInternalImagesFilter(false);
				setAllExceptNonWebImagesFilter(false);
				setAllExceptOtherImagesFilter(false);
				setOkHttpStatusImagesFilter(false);
				setTimeoutHttpStatusImagesFilter(false);
				setErrorHttpStatusImagesFilter(false);
				setOtherErrorHttpStatusImagesFilter(false);
				setTooManyRedirectsHttpStatusImagesFilter(false);
				setAllExceptOkHttpStatusImagesFilter(false);
				setAllExceptTimeoutHttpStatusImagesFilter(false);
				setAllExceptErrorHttpStatusImagesFilter(false);
				setAllExceptOtherErrorHttpStatusImagesFilter(false);
				setAllExceptTooManyRedirectsHttpStatusImagesFilter(false);
				setTlsStatusNoneImagesFilter(false);
				setTlsStatusOkImagesFilter(false);
				setTlsStatusErrorImagesFilter(false);
				setAllExceptTlsStatusNoneImagesFilter(false);
				setAllExceptTlsStatusOkImagesFilter(false);
				setAllExceptTlsStatusErrorImagesFilter(false);
				setNoMissingAltsImagesFilter(false);
				setMissingAltsImagesFilter(true);
				setAllImagesFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "missing_alts__gt");
				newPath = handleRemoveUrlParameter(newPath, "missing_alts__lte");

				if (newPath.includes("?")) newPath += `&missing_alts__gt=0`;
				else newPath += `?missing_alts__gt=0`;
			} else if (filterValue === "missingAltsImages" && !filterChecked) {
				filterQueryString?.delete("missing_alts__gt") ?? null;

				if (newPath.includes("missing_alts__gt")) newPath = handleRemoveUrlParameter(newPath, "missing_alts__gt");

				setMissingAltsImagesFilter(false);
			}

			if (
				(filterValue === "allImages" && filterChecked) ||
				(filterValue !== "internalImages" &&
					filterValue !== "externalImages" &&
					filterValue !== "nonWebImages" &&
					filterValue !== "otherImages" &&
					filterValue !== "allExceptExternalImages" &&
					filterValue !== "allExceptInternalImages" &&
					filterValue !== "allExceptNonWebImages" &&
					filterValue !== "allExceptOtherImages" &&
					filterValue !== "okHttpStatusImages" &&
					filterValue !== "timeoutHttpStatusImages" &&
					filterValue !== "errorHttpStatusImages" &&
					filterValue !== "otherErrorHttpStatusImages" &&
					filterValue !== "tooManyRedirectsHttpStatusImages" &&
					filterValue !== "allExceptOkHttpStatusImages" &&
					filterValue !== "allExceptTimeoutHttpStatusImages" &&
					filterValue !== "allExceptErrorHttpStatusImages" &&
					filterValue !== "allExceptOtherErrorHttpStatusImages" &&
					filterValue !== "allExceptTooManyRedirectsHttpStatusImages" &&
					filterValue !== "tlsStatusNoneImages" &&
					filterValue !== "tlsStatusOkImages" &&
					filterValue !== "tlsStatusErrorImages" &&
					filterValue !== "allExceptTlsStatusNoneImages" &&
					filterValue !== "allExceptTlsStatusOkImages" &&
					filterValue !== "allExceptTlsStatusErrorImages" &&
					filterValue !== "noMissingAltsImages" &&
					filterValue !== "missingAltsImages")
			) {
				setAllImagesFilter(true);
				setExternalImagesFilter(false);
				setInternalImagesFilter(false);
				setNonWebImagesFilter(false);
				setOtherImagesFilter(false);
				setAllExceptExternalImagesFilter(false);
				setAllExceptInternalImagesFilter(false);
				setAllExceptNonWebImagesFilter(false);
				setAllExceptOtherImagesFilter(false);
				setOkHttpStatusImagesFilter(false);
				setTimeoutHttpStatusImagesFilter(false);
				setErrorHttpStatusImagesFilter(false);
				setOtherErrorHttpStatusImagesFilter(false);
				setTooManyRedirectsHttpStatusImagesFilter(false);
				setAllExceptOkHttpStatusImagesFilter(false);
				setAllExceptTimeoutHttpStatusImagesFilter(false);
				setAllExceptErrorHttpStatusImagesFilter(false);
				setAllExceptOtherErrorHttpStatusImagesFilter(false);
				setAllExceptTooManyRedirectsHttpStatusImagesFilter(false);
				setTlsStatusNoneImagesFilter(false);
				setTlsStatusOkImagesFilter(false);
				setTlsStatusErrorImagesFilter(false);
				setAllExceptTlsStatusNoneImagesFilter(false);
				setAllExceptTlsStatusOkImagesFilter(false);
				setAllExceptTlsStatusErrorImagesFilter(false);
				setNoMissingAltsImagesFilter(false);
				setMissingAltsImagesFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "status");
				newPath = handleRemoveUrlParameter(newPath, "status__neq");
				newPath = handleRemoveUrlParameter(newPath, "type");
				newPath = handleRemoveUrlParameter(newPath, "type__neq");
				newPath = handleRemoveUrlParameter(newPath, "tls_status");
				newPath = handleRemoveUrlParameter(newPath, "tls_status__neq");
				newPath = handleRemoveUrlParameter(newPath, "missing_alts__gt");
				newPath = handleRemoveUrlParameter(newPath, "missing_alts__lte");
			}
		} else {
			// Sites filter
			if (filterValue === "verified" && filterChecked) {
				setVerifiedFilter(true);
				setUnverifiedFilter(false);
				setAllSitesFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "verified");

				if (newPath.includes("?")) newPath += `&verified=true`;
				else newPath += `?verified=true`;
			} else if (filterValue === "verified" && !filterChecked) {
				filterQueryString?.delete("verified") ?? null;

				if (newPath.includes("verified")) newPath = handleRemoveUrlParameter(newPath, "verified");

				setVerifiedFilter(false);
			}

			if (filterValue === "unverified" && filterChecked) {
				setVerifiedFilter(false);
				setUnverifiedFilter(true);
				setAllSitesFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "verified");

				if (newPath.includes("?")) newPath += `&verified=false`;
				else newPath += `?verified=false`;
			} else if (filterValue === "unverified" && !filterChecked) {
				filterQueryString?.delete("verified") ?? null;

				if (newPath.includes("verified")) newPath = handleRemoveUrlParameter(newPath, "verified");

				setUnverifiedFilter(false);
			}

			if (
				(filterValue === "allSites" && filterChecked) ||
				(filterValue !== "unverified" && filterValue !== "verified")
			) {
				setVerifiedFilter(false);
				setUnverifiedFilter(false);
				setAllSitesFilter(true);

				newPath = handleRemoveUrlParameter(newPath, "verified");
			}
		}

		if (newPath.includes("?")) setPagePath(`${newPath}&`);
		else setPagePath(`${newPath}?`);

		// Push new path
		push(newPath);
	};

	// Handle filters on load
	useEffect(() => {
		if (filterQueryString) {
			if (filterType === "links") {
				if (filterQueryString.get("status__neq") === "OK") {
					setLinksWithIssuesFilter(true);
				} else {
					setLinksWithIssuesFilter(false);
				}

				if (filterQueryString.get("status") === "OK") {
					setNoLinkIssuesFilter(true);
				} else {
					setNoLinkIssuesFilter(false);
				}

				if (filterQueryString.get("type") === "PAGE") {
					setInternalLinksFilter(true);
				} else {
					setInternalLinksFilter(false);
				}

				if (filterQueryString.get("type") === "EXTERNAL" || filterQueryString.get("type") === "EXTERNALOTHER") {
					setExternalLinksFilter(true);
				} else {
					setExternalLinksFilter(false);
				}

				if (filterQueryString.get("type") === "NON_WEB") {
					setNonWebLinksFilter(true);
				} else {
					setNonWebLinksFilter(false);
				}

				if (filterQueryString.get("type") === "OTHER") {
					setOtherLinksFilter(true);
				} else {
					setOtherLinksFilter(false);
				}

				if (
					!filterQueryString.has("type") &&
					!filterQueryString.has("status") &&
					!filterQueryString.has("status__neq")
				) {
					setAllLinksFilter(true);
				} else {
					setAllLinksFilter(false);
				}

				return {
					noLinkIssuesFilter,
					linksWithIssuesFilter,
					internalLinksFilter,
					externalLinksFilter,
					nonWebLinksFilter,
					allLinksFilter
				};
			} else if (filterType === "pages") {
				if (filterQueryString.has("has_title")) {
					setHasTitleFilter(true);
				} else {
					setHasTitleFilter(false);
				}

				if (filterQueryString.has("has_description")) {
					setHasDescriptionFilter(true);
				} else {
					setHasDescriptionFilter(false);
				}

				if (filterQueryString.get("has_h1_first") === "true") {
					setHasH1FirstFilter(true);
				} else {
					setHasH1FirstFilter(false);
				}

				if (filterQueryString.get("has_h1_first") === "false") {
					setHasNoH1FirstFilter(true);
				} else {
					setHasNoH1FirstFilter(false);
				}

				if (filterQueryString.get("has_h1_second") === "true") {
					setHasH1SecondFilter(true);
				} else {
					setHasH1SecondFilter(false);
				}

				if (filterQueryString.get("has_h1_second") === "false") {
					setHasNoH1SecondFilter(true);
				} else {
					setHasNoH1SecondFilter(false);
				}

				if (filterQueryString.get("has_h2_first") === "true") {
					setHasH2FirstFilter(true);
				} else {
					setHasH2FirstFilter(false);
				}

				if (filterQueryString.get("has_h2_first") === "false") {
					setHasNoH2FirstFilter(true);
				} else {
					setHasNoH2FirstFilter(false);
				}

				if (filterQueryString.get("has_h2_second") === "true") {
					setHasH2SecondFilter(true);
				} else {
					setHasH2SecondFilter(false);
				}

				if (filterQueryString.get("has_h2_second") === "false") {
					setHasNoH2SecondFilter(true);
				} else {
					setHasNoH2SecondFilter(false);
				}

				if (filterQueryString.has("has_duplicated_title")) {
					setHasDuplicatedTitleFilter(true);
				} else {
					setHasDuplicatedTitleFilter(false);
				}

				if (filterQueryString.has("has_duplicated_description")) {
					setHasDuplicatedDescriptionFilter(true);
				} else {
					setHasDuplicatedDescriptionFilter(false);
				}

				if (filterQueryString.has("tls_images")) {
					setTlsImagesFilter(true);
				} else {
					setTlsImagesFilter(false);
				}

				if (filterQueryString.has("tls_scripts")) {
					setTlsScriptsFilter(true);
				} else {
					setTlsScriptsFilter(false);
				}

				if (filterQueryString.has("tls_stylesheets")) {
					setTlsStylesheetsFilter(true);
				} else {
					setTlsStylesheetsFilter(false);
				}

				if (filterQueryString.has("tls_total")) {
					setTlsTotalFilter(true);
				} else {
					setTlsTotalFilter(false);
				}

				if (
					!filterQueryString.has("has_title") &&
					!filterQueryString.has("has_description") &&
					!filterQueryString.has("has_h1_first") &&
					!filterQueryString.has("has_h1_second") &&
					!filterQueryString.has("has_h2_first") &&
					!filterQueryString.has("has_h2_second") &&
					!filterQueryString.has("has_duplicated_title") &&
					!filterQueryString.has("has_duplicated_description") &&
					!filterQueryString.has("tls_images") &&
					!filterQueryString.has("tls_scripts") &&
					!filterQueryString.has("tls_stylesheets") &&
					!filterQueryString.has("tls_total")
				) {
					setAllPagesFilter(true);
				} else {
					setAllPagesFilter(false);
				}

				return {
					hasTitleFilter,
					hasDescriptionFilter,
					hasH1FirstFilter,
					hasH1SecondFilter,
					hasH2FirstFilter,
					hasH2SecondFilter,
					hasDuplicatedTitleFilter,
					hasDuplicatedDescriptionFilter,
					tlsImagesFilter,
					tlsScriptsFilter,
					tlsStylesheetsFilter,
					tlsTotalFilter,
					allPagesFilter
				};
			} else if (filterType === "images") {
				if (filterQueryString.get("type") === "PAGE") {
					setInternalImagesFilter(true);
				} else {
					setInternalImagesFilter(false);
				}

				if (filterQueryString.get("type") === "EXTERNAL" || filterQueryString.get("type") === "EXTERNALOTHER") {
					setExternalImagesFilter(true);
				} else {
					setExternalImagesFilter(false);
				}

				if (filterQueryString.get("type") === "NON_WEB") {
					setNonWebImagesFilter(true);
				} else {
					setNonWebImagesFilter(false);
				}

				if (filterQueryString.get("type") === "OTHER") {
					setOtherImagesFilter(true);
				} else {
					setOtherImagesFilter(false);
				}

				if (filterQueryString.get("type__neq") === "PAGE") {
					setAllExceptInternalImagesFilter(true);
				} else {
					setAllExceptInternalImagesFilter(false);
				}

				if (
					filterQueryString.get("type__neq") === "EXTERNAL" ||
					filterQueryString.get("type__neq") === "EXTERNALOTHER"
				) {
					setAllExceptExternalImagesFilter(true);
				} else {
					setAllExceptExternalImagesFilter(false);
				}

				if (filterQueryString.get("type__neq") === "OTHER") {
					setAllExceptOtherImagesFilter(true);
				} else {
					setAllExceptOtherImagesFilter(false);
				}

				if (filterQueryString.get("type__neq") === "NON_WEB") {
					setAllExceptNonWebImagesFilter(true);
				} else {
					setAllExceptNonWebImagesFilter(false);
				}

				if (filterQueryString.get("status") === "OK") {
					setOkHttpStatusImagesFilter(true);
				} else {
					setOkHttpStatusImagesFilter(false);
				}

				if (filterQueryString.get("status") === "TIMEOUT") {
					setTimeoutHttpStatusImagesFilter(true);
				} else {
					setTimeoutHttpStatusImagesFilter(false);
				}

				if (filterQueryString.get("status") === "HTTP_ERROR") {
					setErrorHttpStatusImagesFilter(true);
				} else {
					setErrorHttpStatusImagesFilter(false);
				}

				if (filterQueryString.get("status") === "OTHER_ERROR") {
					setOtherErrorHttpStatusImagesFilter(true);
				} else {
					setOtherErrorHttpStatusImagesFilter(false);
				}

				if (filterQueryString.get("status") === "TOO_MANY_REDIRECTS") {
					setTooManyRedirectsHttpStatusImagesFilter(true);
				} else {
					setTooManyRedirectsHttpStatusImagesFilter(false);
				}

				if (filterQueryString.get("status__neq") === "OK") {
					setAllExceptOkHttpStatusImagesFilter(true);
				} else {
					setAllExceptOkHttpStatusImagesFilter(false);
				}

				if (filterQueryString.get("status__neq") === "TIMEOUT") {
					setAllExceptTimeoutHttpStatusImagesFilter(true);
				} else {
					setAllExceptTimeoutHttpStatusImagesFilter(false);
				}

				if (filterQueryString.get("status__neq") === "HTTP_ERROR") {
					setAllExceptErrorHttpStatusImagesFilter(true);
				} else {
					setAllExceptErrorHttpStatusImagesFilter(false);
				}

				if (filterQueryString.get("status__neq") === "OTHER_ERROR") {
					setAllExceptOtherErrorHttpStatusImagesFilter(true);
				} else {
					setAllExceptOtherErrorHttpStatusImagesFilter(false);
				}

				if (filterQueryString.get("status__neq") === "TOO_MANY_REDIRECTS") {
					setAllExceptTooManyRedirectsHttpStatusImagesFilter(true);
				} else {
					setAllExceptTooManyRedirectsHttpStatusImagesFilter(false);
				}

				if (filterQueryString.get("tls_status") === "NONE") {
					setTlsStatusNoneImagesFilter(true);
				} else {
					setTlsStatusNoneImagesFilter(false);
				}

				if (filterQueryString.get("tls_status") === "OK") {
					setTlsStatusOkImagesFilter(true);
				} else {
					setTlsStatusOkImagesFilter(false);
				}

				if (filterQueryString.get("tls_status") === "ERROR") {
					setTlsStatusErrorImagesFilter(true);
				} else {
					setTlsStatusErrorImagesFilter(false);
				}

				if (filterQueryString.get("tls_status__neq") === "NONE") {
					setAllExceptTlsStatusNoneImagesFilter(true);
				} else {
					setAllExceptTlsStatusNoneImagesFilter(false);
				}

				if (filterQueryString.get("tls_status__neq") === "OK") {
					setAllExceptTlsStatusOkImagesFilter(true);
				} else {
					setAllExceptTlsStatusOkImagesFilter(false);
				}

				if (filterQueryString.get("tls_status__neq") === "ERROR") {
					setAllExceptTlsStatusErrorImagesFilter(true);
				} else {
					setAllExceptTlsStatusErrorImagesFilter(false);
				}

				if (filterQueryString.get("missing_alts__lte")) {
					setNoMissingAltsImagesFilter(true);
				} else {
					setNoMissingAltsImagesFilter(false);
				}

				if (filterQueryString.get("missing_alts__gt")) {
					setMissingAltsImagesFilter(true);
				} else {
					setMissingAltsImagesFilter(false);
				}

				if (
					!filterQueryString.has("type") &&
					!filterQueryString.has("type__neq") &&
					!filterQueryString.has("status") &&
					!filterQueryString.has("status__neq") &&
					!filterQueryString.has("tls_status") &&
					!filterQueryString.has("tls_status__neq") &&
					!filterQueryString.has("missing_alts__gt") &&
					!filterQueryString.has("missing_alts__lte")
				) {
					setAllImagesFilter(true);
				} else {
					setAllImagesFilter(false);
				}

				return {
					internalImagesFilter,
					externalImagesFilter,
					nonWebImagesFilter,
					otherImagesFilter,
					allExceptExternalImagesFilter,
					allExceptInternalImagesFilter,
					allExceptNonWebImagesFilter,
					allExceptOtherImagesFilter,
					okHttpStatusImagesFilter,
					timeoutHttpStatusImagesFilter,
					errorHttpStatusImagesFilter,
					otherErrorHttpStatusImagesFilter,
					tooManyRedirectsHttpStatusImagesFilter,
					allExceptOkHttpStatusImagesFilter,
					allExceptTimeoutHttpStatusImagesFilter,
					allExceptErrorHttpStatusImagesFilter,
					allExceptOtherErrorHttpStatusImagesFilter,
					allExceptTooManyRedirectsHttpStatusImagesFilter,
					tlsStatusNoneImagesFilter,
					tlsStatusOkImagesFilter,
					tlsStatusErrorImagesFilter,
					allExceptTlsStatusNoneImagesFilter,
					allExceptTlsStatusOkImagesFilter,
					allExceptTlsStatusErrorImagesFilter,
					noMissingAltsImagesFilter,
					missingAltsImagesFilter,
					allImagesFilter
				};
			} else {
				if (filterQueryString.get("verified") === "true") {
					setVerifiedFilter(true);
				} else {
					setVerifiedFilter(false);
				}

				if (filterQueryString.get("verified") === "false") {
					setUnverifiedFilter(true);
				} else {
					setUnverifiedFilter(false);
				}

				if (!filterQueryString.has("verified")) {
					setAllSitesFilter(true);
				} else {
					setAllSitesFilter(false);
				}

				return {
					verifiedFilter,
					unverifiedFilter,
					allSitesFilter
				};
			}
		}
	}, [filterQueryString]);

	return isComponentReady ? (
		<form className="rounded-lg border border-gray-300 bg-white px-4 py-5 sm:px-6 lg:flex lg:justify-between">
			<div className="-ml-4 flex-wrap items-start sm:flex-nowrap lg:-mt-2 lg:flex">
				<h4 className="ml-4 mb-4 mt-2 mr-1 font-semibold leading-4 text-gray-600 lg:mb-0">{filterText}</h4>

				<div
					className={classnames(
						"ml-4 mt-2 grid grid-flow-col grid-cols-1",
						isSitesFilter
							? "gap-3 sm:grid-rows-1"
							: isSitesLinksFilter
							? "gap-3 sm:grid-rows-2"
							: isSitesPagesFilter
							? "gap-3 sm:grid-rows-4"
							: "gap-3 sm:grid-rows-6"
					)}
				>
					{filtersArray
						.filter(
							(e) =>
								e.type === filterType &&
								e.value !== "allSites" &&
								e.value !== "allLinks" &&
								e.value !== "allPages" &&
								e.value !== "allImages"
						)
						.map((value, key) => (
							<div key={key}>
								<label className="flex items-center space-x-2">
									<input
										type="checkbox"
										className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
										checked={value.checked}
										onChange={handleFilterUrl}
										value={value.value}
									/>
									<span className="ml-2 text-left text-xs font-normal leading-4 text-gray-500">{value.label}</span>
								</label>
							</div>
						))}
				</div>
			</div>

			<div className="flex-wrap items-start justify-end space-x-4 sm:flex-nowrap lg:-mt-2 lg:flex">
				{filtersArray
					.filter(
						(e) =>
							e.type === filterType &&
							(e.value === "allSites" || e.value === "allLinks" || e.value === "allPages" || e.value === "allImages")
					)
					.map((value, key) => (
						<div key={key} className="ml-4 mt-2">
							<label className="flex items-center space-x-2">
								<input
									type="checkbox"
									className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
									checked={value.checked}
									onChange={handleFilterUrl}
									value={value.value}
								/>
								<span className="text-left text-xs font-normal leading-4 text-gray-500">{value.label}</span>
							</label>
						</div>
					))}
			</div>
		</form>
	) : (
		<div className="rounded-lg border border-gray-300 bg-white px-4 py-5 sm:px-6 lg:flex lg:justify-between">
			<div className="-ml-4 flex-wrap items-start sm:flex-nowrap lg:-mt-2 lg:flex">
				<Skeleton duration={2} width={50} height={16} className="my-4 ml-4 mr-1 lg:mb-0" />

				{filtersArray
					.filter(
						(e) =>
							e.type === filterType &&
							e.value !== "allSites" &&
							e.value !== "allLinks" &&
							e.value !== "allPages" &&
							e.value !== "allImages"
					)
					.map((value, key) => (
						<div key={key} className="ml-4 mt-2">
							<div className="flex items-center space-x-2">
								<Skeleton duration={2} width={16} height={16} className="h-4 w-4 rounded" />
								<Skeleton duration={2} width={100} height={16} className="ml-2" />
							</div>
						</div>
					))}
			</div>

			<div className="flex-wrap items-start justify-end space-x-4 sm:flex-nowrap lg:-mt-2 lg:flex">
				{filtersArray
					.filter(
						(e) =>
							e.type === filterType &&
							(e.value === "allSites" || e.value === "allLinks" || e.value === "allPages" || e.value === "allImages")
					)
					.map((value, key) => (
						<div key={key} className="ml-4 mt-2">
							<div className="flex items-center space-x-2">
								<Skeleton duration={2} width={16} height={16} className="h-4 w-4 rounded" />
								<Skeleton duration={2} width={100} height={16} className="ml-2" />
							</div>
						</div>
					))}
			</div>
		</div>
	);
};

/**
 * Memoized custom `Filter` component
 */
export const MemoizedFilter = memo(Filter);

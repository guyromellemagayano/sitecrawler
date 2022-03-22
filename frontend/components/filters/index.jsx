import { FilterData } from "@constants/FilterData";
import { handleRemoveUrlParameter } from "@helpers/handleRemoveUrlParameter";
import { useScanApiEndpoint } from "@hooks/useScanApiEndpoint";
import { useSiteQueries } from "@hooks/useSiteQueries";
import { SiteCrawlerAppContext } from "@pages/_app";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { memo, useContext, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSWRConfig } from "swr";

/**
 * Custom function to render the `Filter` component
 *
 * @param {boolean} isSitesFilter
 * @param {boolean} isSitesLinksFilter
 * @param {boolean} isSitesPagesFilter
 * @param {boolean} isSitesImagesFilter
 * @param {boolean} isSitesSeoFilter
 * @param {boolean} isValidating
 */
const Filter = ({
	isSitesFilter = false,
	isSitesLinksFilter = false,
	isSitesPagesFilter = false,
	isSitesImagesFilter = false,
	isSitesSeoFilter = false
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
	} = FilterData();

	// Custom context
	const { isComponentReady } = useContext(SiteCrawlerAppContext);

	// Router
	const { query, asPath, push } = useRouter();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// Custom variables
	let filterType = isSitesFilter
		? "sites"
		: isSitesLinksFilter
		? "links"
		: isSitesPagesFilter
		? "pages"
		: isSitesImagesFilter
		? "images"
		: isSitesSeoFilter
		? "seo"
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
				setInternalLinksFilter(false);
				setExternalLinksFilter(false);
				setNonWebLinksFilter(false);
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
				setInternalLinksFilter(false);
				setExternalLinksFilter(false);
				setNonWebLinksFilter(false);
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
				setInternalLinksFilter(true);
				setExternalLinksFilter(false);
				setNonWebLinksFilter(false);
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
				setInternalLinksFilter(false);
				setExternalLinksFilter(true);
				setNonWebLinksFilter(false);
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
				setAllLinksFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "type");

				if (newPath.includes("?")) newPath += `&type=NON_WEB`;
				else newPath += `?type=NON_WEB`;
			} else if (filterValue === "nonWebLinks" && !filterChecked) {
				filterQueryString?.delete("type") ?? null;

				if (newPath.includes("type")) newPath = handleRemoveUrlParameter(newPath, "type");

				setNonWebLinksFilter(false);
			}

			if (
				(filterValue === "allSites" && filterChecked) ||
				(filterValue !== "linksWithIssues" &&
					filterValue !== "noLinkIssues" &&
					filterValue !== "internalLinks" &&
					filterValue !== "externalLinks" &&
					filterValue !== "nonWebLinks")
			) {
				setAllLinksFilter(true);
				setLinksWithIssuesFilter(false);
				setNoLinkIssuesFilter(false);
				setExternalLinksFilter(false);
				setInternalLinksFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "status");
				newPath = handleRemoveUrlParameter(newPath, "status__neq");
				newPath = handleRemoveUrlParameter(newPath, "type");
			}
		} else if (filterType === "pages") {
			if (filterValue === "hasTitle" && filterChecked) {
				setAllPagesFilter(false);
				setHasTitleFilter(true);
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
				setTlsTotalFilter(false);

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

				if (newPath.includes("?")) newPath += `&has_title=true`;
				else newPath += `?has_title=true`;
			} else if (filterValue === "hasTitle" && !filterChecked) {
				filterQueryString?.delete("has_title") ?? null;

				if (newPath.includes("has_title")) newPath = handleRemoveUrlParameter(newPath, "has_title");

				setHasTitleFilter(false);
			}

			if (filterValue === "hasDescription" && filterChecked) {
				setAllPagesFilter(false);
				setHasTitleFilter(false);
				setHasDescriptionFilter(true);
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
				setTlsTotalFilter(false);

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

				if (newPath.includes("?")) newPath += `&has_description=true`;
				else newPath += `?has_description=true`;
			} else if (filterValue === "hasDescription" && !filterChecked) {
				filterQueryString?.delete("has_description") ?? null;

				if (newPath.includes("has_description")) newPath = handleRemoveUrlParameter(newPath, "has_description");

				setHasDescriptionFilter(false);
			}

			if (filterValue === "hasH1First" && filterChecked) {
				setAllPagesFilter(false);
				setHasTitleFilter(false);
				setHasDescriptionFilter(false);
				setHasH1FirstFilter(true);
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
				setTlsTotalFilter(false);

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

				if (newPath.includes("?")) newPath += `&has_h1_first=true`;
				else newPath += `?has_h1_first=true`;
			} else if (filterValue === "hasH1First" && !filterChecked) {
				filterQueryString?.delete("has_h1_first") ?? null;

				if (newPath.includes("has_h1_first")) newPath = handleRemoveUrlParameter(newPath, "has_h1_first");

				setHasH1FirstFilter(false);
			}

			if (filterValue === "hasH1Second" && filterChecked) {
				setAllPagesFilter(false);
				setHasTitleFilter(false);
				setHasDescriptionFilter(false);
				setHasH1FirstFilter(false);
				setHasH1SecondFilter(true);
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
				setTlsTotalFilter(false);

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

				if (newPath.includes("?")) newPath += `&has_h1_second=true`;
				else newPath += `?has_h1_second=true`;
			} else if (filterValue === "hasH1Second" && !filterChecked) {
				filterQueryString?.delete("has_h1_second") ?? null;

				if (newPath.includes("has_h1_second")) newPath = handleRemoveUrlParameter(newPath, "has_h1_second");

				setHasH1SecondFilter(false);
			}

			if (filterValue === "hasH2First" && filterChecked) {
				setAllPagesFilter(false);
				setHasTitleFilter(false);
				setHasDescriptionFilter(false);
				setHasH1FirstFilter(false);
				setHasH1SecondFilter(false);
				setHasH2FirstFilter(true);
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
				setTlsTotalFilter(false);

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

				if (newPath.includes("?")) newPath += `&has_h2_first=true`;
				else newPath += `?has_h2_first=true`;
			} else if (filterValue === "hasH2First" && !filterChecked) {
				filterQueryString?.delete("has_h2_first") ?? null;

				if (newPath.includes("has_h2_first")) newPath = handleRemoveUrlParameter(newPath, "has_h2_first");

				setHasH2FirstFilter(false);
			}

			if (filterValue === "hasH2Second" && filterChecked) {
				setAllPagesFilter(false);
				setHasTitleFilter(false);
				setHasDescriptionFilter(false);
				setHasH1FirstFilter(false);
				setHasH1SecondFilter(false);
				setHasH2FirstFilter(false);
				setHasH2SecondFilter(true);
				setHasNoH1FirstFilter(false);
				setHasNoH1SecondFilter(false);
				setHasNoH2FirstFilter(false);
				setHasNoH2SecondFilter(false);
				setHasDuplicatedTitleFilter(false);
				setHasDuplicatedDescriptionFilter(false);
				setTlsImagesFilter(false);
				setTlsScriptsFilter(false);
				setTlsStylesheetsFilter(false);
				setTlsTotalFilter(false);

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

				if (newPath.includes("?")) newPath += `&has_h2_second=true`;
				else newPath += `?has_h2_second=true`;
			} else if (filterValue === "hasH2Second" && !filterChecked) {
				filterQueryString?.delete("has_h2_second") ?? null;

				if (newPath.includes("has_h2_second")) newPath = handleRemoveUrlParameter(newPath, "has_h2_second");

				setHasH2SecondFilter(false);
			}

			if (filterValue === "hasNoH1First" && filterChecked) {
				setAllPagesFilter(false);
				setHasTitleFilter(false);
				setHasDescriptionFilter(false);
				setHasH1FirstFilter(false);
				setHasH1SecondFilter(false);
				setHasH2FirstFilter(false);
				setHasH2SecondFilter(false);
				setHasNoH1FirstFilter(true);
				setHasNoH1SecondFilter(false);
				setHasNoH2FirstFilter(false);
				setHasNoH2SecondFilter(false);
				setHasDuplicatedTitleFilter(false);
				setHasDuplicatedDescriptionFilter(false);
				setTlsImagesFilter(false);
				setTlsScriptsFilter(false);
				setTlsStylesheetsFilter(false);
				setTlsTotalFilter(false);

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

				if (newPath.includes("?")) newPath += `&has_h1_first=false`;
				else newPath += `?has_h1_first=false`;
			} else if (filterValue === "hasNoH1First" && !filterChecked) {
				filterQueryString?.delete("has_h1_first") ?? null;

				if (newPath.includes("has_h1_first")) newPath = handleRemoveUrlParameter(newPath, "has_h1_first");

				setHasNoH1FirstFilter(false);
			}

			if (filterValue === "hasNoH1Second" && filterChecked) {
				setAllPagesFilter(false);
				setHasTitleFilter(false);
				setHasDescriptionFilter(false);
				setHasH1FirstFilter(false);
				setHasH1SecondFilter(false);
				setHasH2FirstFilter(false);
				setHasH2SecondFilter(false);
				setHasNoH1FirstFilter(false);
				setHasNoH1SecondFilter(true);
				setHasNoH2FirstFilter(false);
				setHasNoH2SecondFilter(false);
				setHasDuplicatedTitleFilter(false);
				setHasDuplicatedDescriptionFilter(false);
				setTlsImagesFilter(false);
				setTlsScriptsFilter(false);
				setTlsStylesheetsFilter(false);
				setTlsTotalFilter(false);

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

				if (newPath.includes("?")) newPath += `&has_h1_second=false`;
				else newPath += `?has_h1_second=false`;
			} else if (filterValue === "hasNoH1Second" && !filterChecked) {
				filterQueryString?.delete("has_h1_second") ?? null;

				if (newPath.includes("has_h1_second")) newPath = handleRemoveUrlParameter(newPath, "has_h1_second");

				setHasNoH1SecondFilter(false);
			}

			if (filterValue === "hasNoH2First" && filterChecked) {
				setAllPagesFilter(false);
				setHasTitleFilter(false);
				setHasDescriptionFilter(false);
				setHasH1FirstFilter(false);
				setHasH1SecondFilter(false);
				setHasH2FirstFilter(false);
				setHasH2SecondFilter(false);
				setHasNoH1FirstFilter(false);
				setHasNoH1SecondFilter(false);
				setHasNoH2FirstFilter(true);
				setHasNoH2SecondFilter(false);
				setHasDuplicatedTitleFilter(false);
				setHasDuplicatedDescriptionFilter(false);
				setTlsImagesFilter(false);
				setTlsScriptsFilter(false);
				setTlsStylesheetsFilter(false);
				setTlsTotalFilter(false);

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

				if (newPath.includes("?")) newPath += `&has_h2_first=false`;
				else newPath += `?has_h2_first=false`;
			} else if (filterValue === "hasNoH2First" && !filterChecked) {
				filterQueryString?.delete("has_h2_first") ?? null;

				if (newPath.includes("has_h2_first")) newPath = handleRemoveUrlParameter(newPath, "has_h2_first");

				setHasNoH2FirstFilter(false);
			}

			if (filterValue === "hasNoH2Second" && filterChecked) {
				setAllPagesFilter(false);
				setHasTitleFilter(false);
				setHasDescriptionFilter(false);
				setHasH1FirstFilter(false);
				setHasH1SecondFilter(false);
				setHasH2FirstFilter(false);
				setHasH2SecondFilter(true);
				setHasNoH1FirstFilter(false);
				setHasNoH1SecondFilter(false);
				setHasNoH2FirstFilter(false);
				setHasNoH2SecondFilter(true);
				setHasDuplicatedTitleFilter(false);
				setHasDuplicatedDescriptionFilter(false);
				setTlsImagesFilter(false);
				setTlsScriptsFilter(false);
				setTlsStylesheetsFilter(false);
				setTlsTotalFilter(false);

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

				if (newPath.includes("?")) newPath += `&has_h2_second=false`;
				else newPath += `?has_h2_second=false`;
			} else if (filterValue === "hasNoH2Second" && !filterChecked) {
				filterQueryString?.delete("has_h2_second") ?? null;

				if (newPath.includes("has_h2_second")) newPath = handleRemoveUrlParameter(newPath, "has_h2_second");

				setHasNoH2SecondFilter(false);
			}

			if (filterValue === "hasDuplicatedTitle" && filterChecked) {
				setAllPagesFilter(false);
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
				setHasDuplicatedTitleFilter(true);
				setHasDuplicatedDescriptionFilter(false);
				setTlsImagesFilter(false);
				setTlsScriptsFilter(false);
				setTlsStylesheetsFilter(false);
				setTlsTotalFilter(false);

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
				setHasDuplicatedDescriptionFilter(true);
				setTlsImagesFilter(false);
				setTlsScriptsFilter(false);
				setTlsStylesheetsFilter(false);
				setTlsTotalFilter(false);

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
				setTlsImagesFilter(true);
				setTlsScriptsFilter(false);
				setTlsStylesheetsFilter(false);
				setTlsTotalFilter(false);

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

				if (newPath.includes("?")) newPath += `&tls_images=true`;
				else newPath += `?tls_images=true`;
			} else if (filterValue === "tlsImages" && !filterChecked) {
				filterQueryString?.delete("tls_images") ?? null;

				if (newPath.includes("tls_images")) newPath = handleRemoveUrlParameter(newPath, "tls_images");

				setTlsImagesFilter(false);
			}

			if (filterValue === "tlsScripts" && filterChecked) {
				setAllPagesFilter(false);
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
				setTlsScriptsFilter(true);
				setTlsStylesheetsFilter(false);
				setTlsTotalFilter(false);

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

				if (newPath.includes("?")) newPath += `&tls_scripts=true`;
				else newPath += `?tls_scripts=true`;
			} else if (filterValue === "tlsScripts" && !filterChecked) {
				filterQueryString?.delete("tls_scripts") ?? null;

				if (newPath.includes("tls_scripts")) newPath = handleRemoveUrlParameter(newPath, "tls_scripts");

				setTlsScriptsFilter(false);
			}

			if (filterValue === "tlsStylesheets" && filterChecked) {
				setAllPagesFilter(false);
				setHasTitleFilter(false);
				setHasDescriptionFilter(false);
				setHasH1FirstFilter(false);
				setHasH1SecondFilter(false);
				setHasH2FirstFilter(false);
				setHasH2SecondFilter(false);
				setHasDuplicatedTitleFilter(false);
				setHasDuplicatedDescriptionFilter(false);
				setTlsImagesFilter(false);
				setTlsScriptsFilter(false);
				setTlsStylesheetsFilter(true);
				setTlsTotalFilter(false);

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

				if (newPath.includes("?")) newPath += `&tls_stylesheets=true`;
				else newPath += `?tls_stylesheets=true`;
			} else if (filterValue === "tlsStylesheets" && !filterChecked) {
				filterQueryString?.delete("tls_stylesheets") ?? null;

				if (newPath.includes("tls_stylesheets")) newPath = handleRemoveUrlParameter(newPath, "tls_stylesheets");

				setTlsStylesheetsFilter(false);
			}

			if (filterValue === "tlsTotal" && filterChecked) {
				setAllPagesFilter(false);
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
				setTlsTotalFilter(false);

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

		// Mutate function here
		mutate(scanApiEndpoint);
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

				<div className="ml-4 mt-2 grid grid-cols-1 gap-3 sm:grid-cols-6">
					{filtersArray
						.filter(
							(e) =>
								e.type === filterType &&
								e.value !== "allSites" &&
								e.value !== "allLinks" &&
								e.value !== "allPages" &&
								e.value !== "allImages" &&
								e.value !== "allSeo"
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
							(e.value === "allSites" ||
								e.value === "allLinks" ||
								e.value === "allPages" ||
								e.value === "allImages" ||
								e.value === "allSeo")
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
							e.value !== "allImages" &&
							e.value !== "allSeo"
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
							(e.value === "allSites" ||
								e.value === "allLinks" ||
								e.value === "allPages" ||
								e.value === "allImages" ||
								e.value === "allSeo")
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

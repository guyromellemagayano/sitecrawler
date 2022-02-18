import { FilterData } from "@constants/FilterData";
import { handleRemoveUrlParameter } from "@helpers/handleRemoveUrlParameter";
import { useScanApiEndpoint } from "@hooks/useScanApiEndpoint";
import { useSiteQueries } from "@hooks/useSiteQueries";
import { handleConversionStringToBoolean } from "@utils/convertCase";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { memo, useEffect } from "react";
import { useSWRConfig } from "swr";
import "twin.macro";

/**
 * Custom function to render the `Filter` component
 */
const Filter = ({
	isSitesFilter = false,
	isSitesLinksFilter = false,
	isSitesPagesFilter = false,
	isSitesImagesFilter = false,
	isSitesSeoFilter = false
}) => {
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
	} = FilterData();

	// Translations
	const { t } = useTranslation("filters");
	const filterText = t("filters");

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
	let filterQueryString = "";

	// Custom hooks
	const { linksPerPage, setPagePath } = useSiteQueries();
	const { scanApiEndpoint } = useScanApiEndpoint(linksPerPage);

	// Instantiate the query string
	useEffect(() => {
		filterQueryString = new URLSearchParams(location.search);
	});

	// Handle filter URLs
	const handleFilterUrl = async (e) => {
		const filterValue = e?.target?.value;
		const filterChecked = e?.target?.checked;

		let newPath = asPath;
		newPath = handleRemoveUrlParameter(newPath, "page");

		if (filterType === "sites") {
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

			if (filterValue === "allSites" && filterChecked) {
				setVerifiedFilter(false);
				setUnverifiedFilter(false);
				setAllSitesFilter(true);

				newPath = handleRemoveUrlParameter(newPath, "verified");
			}
		}

		if (newPath.includes("?")) setPagePath(`${newPath}&`);
		else setPagePath(`${newPath}?`);

		await mutate(scanApiEndpoint);
		push(newPath);
	};

	// Handle filters on load
	useEffect(() => {
		if (query) {
			if (filterType === "sites") {
				const verified = handleConversionStringToBoolean(query.verified);

				if (verified === true) {
					setVerifiedFilter(true);
				} else {
					setVerifiedFilter(false);
				}

				if (verified === false) {
					setUnverifiedFilter(true);
				} else {
					setUnverifiedFilter(false);
				}

				if (!query.verified && !query.unverified) {
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
	}, [query]);

	return (
		<form tw="px-4 py-5 border border-gray-300 sm:px-6 bg-white rounded-lg lg:flex lg:justify-between">
			<div tw="-ml-4 lg:-mt-2 lg:flex items-center flex-wrap sm:flex-nowrap">
				<h4 tw="ml-4 mb-4 lg:mb-0 mt-2 mr-1 leading-4 font-semibold text-gray-600">{filterText}</h4>

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
						<div key={key} tw="ml-4 mt-2">
							<label tw="flex items-center space-x-2">
								<input
									type="checkbox"
									tw="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
									checked={value.checked}
									onChange={handleFilterUrl}
									value={value.value}
								/>
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">{value.label}</span>
							</label>
						</div>
					))}
			</div>

			<div tw="lg:-mt-2 lg:flex items-center justify-end flex-wrap sm:flex-nowrap space-x-4">
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
						<div key={key} tw="ml-4 mt-2">
							<label tw="flex items-center space-x-2">
								<input
									type="checkbox"
									tw="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
									checked={value.checked}
									onChange={handleFilterUrl}
									value={value.value}
								/>
								<span tw="text-left text-xs leading-4 font-normal text-gray-500">{value.label}</span>
							</label>
						</div>
					))}
			</div>
		</form>
	);
};

/**
 * Memoized custom `Filter` component
 */
export const MemoizedFilter = memo(Filter);

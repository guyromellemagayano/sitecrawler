import { FilterData } from "@constants/FilterData";
import { handleRemoveUrlParameter } from "@helpers/handleRemoveUrlParameter";
import { useScanApiEndpoint } from "@hooks/useScanApiEndpoint";
import { useSiteQueries } from "@hooks/useSiteQueries";
import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import { handleConversionStringToBoolean } from "@utils/convertCase";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { memo, useContext, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
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

	// Custom context
	const { isComponentReady } = useContext(SiteCrawlerAppContext);

	// SWR hooks
	const { user } = useUser();

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

		if (filterType === "links") {
			if (filterValue === "linksWithIssues" && filterChecked) {
				setLinksWithIssuesFilter(true);
				setNoLinkIssuesFilter(false);
				setAllLinksFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "status");

				if (newPath.includes("?")) newPath += `&status__neq=OK`;
				else newPath += `?status__neq=OK`;
			} else if (filterValue === "linksWithIssues" && !filterChecked) {
				filterQueryString?.delete("status__neq") ?? null;

				if (newPath.includes("status__neq")) newPath = handleRemoveUrlParameter(newPath, "status__neq");

				setLinksWithIssuesFilter(false);
			}

			if (filterValue === "noIssues" && filterChecked) {
				setLinksWithIssuesFilter(false);
				setNoLinkIssuesFilter(true);
				setAllLinksFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "status__neq");

				if (newPath.includes("?")) newPath += `&status=OK`;
				else newPath += `?status=OK`;
			} else if (filterValue === "noIssues" && !filterChecked) {
				filterQueryString?.delete("status") ?? null;

				if (newPath.includes("status")) newPath = handleRemoveUrlParameter(newPath, "status");

				setNoLinkIssuesFilter(false);
			}

			if (filterValue === "internalLinks" && filterChecked) {
				setInternalLinksFilter(true);
				setExternalLinksFilter(false);
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
				setExternalLinksFilter(true);
				setInternalLinksFilter(false);
				setAllLinksFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "type");

				if (newPath.includes("?")) newPath += `&type=EXTERNAL`;
				else newPath += `?type=EXTERNAL`;
			} else if (filterValue === "externalLinks" && !filterChecked) {
				filterQueryString?.delete("type") ?? null;

				if (newPath.includes("type")) newPath = handleRemoveUrlParameter(newPath, "type");

				setExternalLinksFilter(false);
			}

			if (filterValue === "allLinks" && filterChecked) {
				setAllLinksFilter(true);
				setLinksWithIssuesFilter(false);
				setNoLinkIssuesFilter(false);
				setExternalLinksFilter(false);
				setInternalLinksFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "status");
				newPath = handleRemoveUrlParameter(newPath, "status__neq");
				newPath = handleRemoveUrlParameter(newPath, "type");
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

			if (filterValue === "allSites" && filterChecked) {
				setVerifiedFilter(false);
				setUnverifiedFilter(false);
				setAllSitesFilter(true);

				newPath = handleRemoveUrlParameter(newPath, "verified");
			}
		}

		if (newPath.includes("?")) setPagePath(`${newPath}&`);
		else setPagePath(`${newPath}?`);

		// Mutate function here
		await mutate(scanApiEndpoint);

		// Push new path
		push(newPath);
	};

	// Handle filters on load
	useEffect(() => {
		if (query) {
			if (filterType === "links") {
				const statusNeq = handleConversionStringToBoolean(query.status__neq);
				const status = handleConversionStringToBoolean(query.status);
				const type = handleConversionStringToBoolean(query.type);

				if (statusNeq !== null) {
					setLinksWithIssuesFilter(true);
				} else {
					setLinksWithIssuesFilter(false);
				}

				if (status !== null) {
					setNoLinkIssuesFilter(true);
				} else {
					setNoLinkIssuesFilter(false);
				}

				if (type !== null) {
					if (type === "PAGE") {
						setInternalLinksFilter(true);
						setExternalLinksFilter(false);
					} else {
						setInternalLinksFilter(false);
						setExternalLinksFilter(true);
					}
				} else {
					setInternalLinksFilter(false);
					setExternalLinksFilter(false);
				}

				if (statusNeq == null && type == null && status == null) {
					setAllLinksFilter(true);
				} else {
					setAllLinksFilter(false);
				}

				return {
					noLinkIssuesFilter,
					linksWithIssuesFilter,
					internalLinksFilter,
					externalLinksFilter,
					allLinksFilter
				};
			} else {
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

				if (typeof verified !== "undefined") {
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

	return isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
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
	) : (
		<div tw="px-4 py-5 border border-gray-300 sm:px-6 bg-white rounded-lg lg:flex lg:justify-between">
			<div tw="-ml-4 lg:-mt-2 lg:flex items-center flex-wrap sm:flex-nowrap">
				<Skeleton duration={2} width={50} height={16} tw="my-4 ml-4 mr-1 lg:mb-0" />

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
							<div tw="flex items-center space-x-2">
								<Skeleton duration={2} width={16} height={16} tw="h-4 w-4 rounded" />
								<Skeleton duration={2} width={100} height={16} tw="ml-2" />
							</div>
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
							<div tw="flex items-center space-x-2">
								<Skeleton duration={2} width={16} height={16} tw="h-4 w-4 rounded" />
								<Skeleton duration={2} width={100} height={16} tw="ml-2" />
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

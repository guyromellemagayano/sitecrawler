import { MemoizedAlert } from "@components/alerts";
import { MemoizedSiteSelectDropdown } from "@components/dropdowns/SiteSelectDropdown";
import { MemoizedSiteSelectMenu } from "@components/menus/SiteSelectMenu";
import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { useAlertMessage } from "@hooks/useAlertMessage";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useLoading } from "@hooks/useLoading";
import { useSites } from "@hooks/useSites";
import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "twin.macro";

/**
 * Custom function to render the `SiteSelect` component
 */
const SiteSelect = () => {
	const [selectedSite, setSelectedSite] = useState(null);
	const [selectedSiteDetails, setSelectedSiteDetails] = useState([]);
	const [selectedSiteId, setSelectedSiteId] = useState(null);

	// Custom hooks
	const { isComponentReady } = useLoading();
	const { state, setConfig } = useAlertMessage();

	// Router
	const { query } = useRouter();

	// SWR hooks
	const { sites, errorSites, validatingSites } = useSites(SitesApiEndpoint);

	// Custom hooks
	const {
		ref: siteSelectRef,
		isComponentVisible: isSiteSelectComponentVisible,
		setIsComponentVisible: setIsSiteSelectComponentVisible
	} = useComponentVisible(false);

	// Handle site selection on load
	const handleSiteSelectOnLoad = useCallback(async (siteId) => {
		if (!validatingSites) {
			if (!errorSites && typeof sites !== "undefined" && sites !== null) {
				if (sites?.results && sites?.results?.length > 0) {
					for (let i = 0; i < sites?.results?.length; i++) {
						if (sites?.results?.[i]?.id === siteId) {
							setSelectedSite(sites?.results?.[i]?.name);
							setIsSiteSelectComponentVisible(!isSiteSelectComponentVisible);
							setSelectedSiteId(siteId);
						}
					}
				}
			}
		}

		return () => {
			setSelectedSite(null);
			setIsSiteSelectComponentVisible(!isSiteSelectComponentVisible);
			setSelectedSiteId(null);
		};
	}, []);

	useEffect(() => {
		let isMounted = true;

		if (isMounted) {
			handleSiteSelectOnLoad();
		}

		return () => {
			isMounted = false;
		};
	}, [handleSiteSelectOnLoad]);

	// Handle site selection on click
	const handleSiteSelectOnClick = useCallback(async () => {
		if (!validatingSites) {
			if (!errorSites) {
				const sitesSelectResponse = await sites;
				const sitesSelectResponseData = sitesSelectResponse?.data ?? null;
				const sitesSelectResponseStatus = sitesSelectResponse?.status ?? null;
				const sitesSelectResponseMethod = sitesSelectResponse?.config?.method ?? null;

				if (sitesSelectResponseData !== null && Math.round(sitesSelectResponseStatus / 200) === 1) {
					for (let i = 0; i < sites?.results?.length; i++) {
						if (sites?.results?.[i]?.id === query?.siteId) {
							setSelectedSite(sites?.results?.[i]?.name ?? null);
						} else {
							setSelectedSite(null);
						}
					}
				} else {
					// Show alert message after failed response is issued
					setConfig({
						isSites: true,
						method: sitesSelectResponseMethod,
						status: sitesSelectResponseStatus
					});
				}
			}
		}
	}, [query, sites, errorSites, validatingSites]);

	useEffect(() => {
		let isMounted = true;

		if (isMounted) {
			handleSiteSelectOnClick();
		}

		return () => {
			isMounted = false;
		};
	}, [handleSiteSelectOnClick]);

	// Handle site selection on change
	const handleSiteSelectOnChange = useCallback(async () => {
		if (!validatingSites) {
			if (!errorSites) {
				const sitesSelectResponse = await sites;
				const sitesSelectResponseData = sitesSelectResponse?.data ?? null;
				const sitesSelectResponseStatus = sitesSelectResponse?.status ?? null;
				const sitesSelectResponseMethod = sitesSelectResponse?.config?.method ?? null;

				if (sitesSelectResponseData !== null && Math.round(sitesSelectResponseStatus / 200) === 1) {
					if (typeof selectedSite !== "undefined" && selectedSite !== null) {
						sites?.results
							.filter((result) => result.name === selectedSite)
							.map((val) => {
								setSelectedSiteDetails(val);
							}) ?? null;

						let currentSite = sites?.results?.find((result) => result.id === parseInt(query?.siteId)) ?? null;

						if (typeof currentSite !== undefined && currentSite !== null) {
							setSelectedSite(currentSite?.name ?? null);
						} else {
							setSelectedSite(null);
						}
					}
				} else {
					// Show alert message after failed response is issued
					setConfig({
						isSites: true,
						method: sitesSelectResponseMethod,
						status: sitesSelectResponseStatus
					});
				}
			}
		}
	}, [query, selectedSite, selectedSiteDetails, sites, errorSites, validatingSites]);

	useEffect(() => {
		let isMounted = true;

		if (isMounted) {
			handleSiteSelectOnChange();
		}

		return () => {
			isMounted = false;
		};
	}, [handleSiteSelectOnChange]);

	return (
		<>
			{state?.responses !== [] && state?.responses?.length > 0 ? (
				<div tw="fixed right-6 bottom-6 grid grid-flow-row gap-4">
					{state?.responses?.map((value, key) => {
						// Alert Messsages
						const responseText = value?.responseText ?? null;
						const isSuccess = value?.isSuccess ?? null;

						return <MemoizedAlert key={key} responseText={responseText} isSuccess={isSuccess} />;
					}) ?? null}
				</div>
			) : null}

			<div tw="relative space-y-1">
				<span tw="inline-block w-full rounded-md shadow-sm">
					{isComponentReady ? (
						<MemoizedSiteSelectMenu
							selectedSite={selectedSite}
							selectedSiteDetails={selectedSiteDetails}
							handleOpenDropdown={() => setIsSiteSelectComponentVisible(!isSiteSelectComponentVisible)}
						/>
					) : (
						<Skeleton width={224} height={38} tw="cursor-default relative w-full pl-3 pr-10 py-2" />
					)}
				</span>

				<MemoizedSiteSelectDropdown
					ref={siteSelectRef}
					selectedSiteId={selectedSiteId}
					handleSiteSelectOnLoad={handleSiteSelectOnLoad}
					openDropdown={isSiteSelectComponentVisible}
				/>
			</div>
		</>
	);
};

/**
 * Memoized custom `SiteSelect` component
 */
export const MemoizedSiteSelect = memo(SiteSelect);

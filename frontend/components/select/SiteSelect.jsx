/* eslint-disable react-hooks/exhaustive-deps */
import { MemoizedSiteSelectDropdown } from "@components/dropdowns/SiteSelectDropdown";
import { MemoizedSiteSelectMenu } from "@components/menus/SiteSelectMenu";
import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useLoading } from "@hooks/useLoading";
import { useSites } from "@hooks/useSites";
import { useUser } from "@hooks/useUser";
import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "twin.macro";

/**
 * Custom function to render the `SiteSelect` component
 */
export function SiteSelect() {
	const [messageConfig, setMessageConfig] = useState(null);
	const [selectedSite, setSelectedSite] = useState(null);
	const [selectedSiteDetails, setSelectedSiteDetails] = useState([]);
	const [selectedSiteId, setSelectedSiteId] = useState(null);

	// Custom hooks
	const { isComponentReady } = useLoading();

	// Router
	const { query } = useRouter();

	// SWR hooks
	const { user, errorUser, validatingUser } = useUser();
	const { sites, errorSites, validatingSites } = useSites(SitesApiEndpoint);

	// Custom hooks
	const {
		ref: siteSelectRef,
		isComponentVisible: isSiteSelectComponentVisible,
		setIsComponentVisible: setIsSiteSelectComponentVisible
	} = useComponentVisible(false);

	// Handle site selection on load
	const handleSiteSelectOnLoad = async (siteId) => {
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
	};

	// Handle site selection on click
	const handleSiteSelectOnClick = useCallback(async () => {
		if (!validatingSites) {
			if (typeof sites !== "undefined" && sites !== null && Object.keys(sites).length > 0) {
				for (let i = 0; i < sites?.results?.length; i++) {
					if (sites?.results?.[i]?.id === query?.siteId) {
						setSelectedSite(sites?.results?.[i]?.name);
					} else {
						setSelectedSite(null);
					}
				}
			} else {
				const errorSitesStatus = errorSites?.response?.status ?? null;

				if (errorSitesStatus !== null) {
					setMessageConfig({
						type: "sites",
						method: "get",
						status: errorSitesStatus
					});
				} else {
					setMessageConfig({
						type: null,
						method: null,
						status: null
					});
				}
			}
		}
	}, [sites, query, validatingSites]);

	useEffect(() => {
		handleSiteSelectOnClick();
	}, [handleSiteSelectOnClick]);

	// Handle site selection on change
	const handleSiteSelectOnChange = useCallback(async () => {
		if (!validatingSites) {
			if (typeof sites !== "undefined" && sites !== null && Object.keys(sites).length > 0) {
				if (typeof selectedSite !== "undefined" && selectedSite !== null) {
					sites?.results
						.filter((result) => result.name === selectedSite)
						.map((val) => {
							setSelectedSiteDetails(val);
						});

					let currentSite = sites?.results?.find((result) => result.id === parseInt(query?.siteId)) ?? null;

					if (typeof currentSite !== undefined && currentSite !== null) {
						setSelectedSite(currentSite?.name);
					} else {
						setSelectedSite(null);
					}
				}
			}
		}
	}, [selectedSite, sites, query, selectedSiteDetails, validatingSites]);

	useEffect(() => {
		handleSiteSelectOnChange();
	}, [handleSiteSelectOnChange]);

	return (
		<div tw="relative space-y-1">
			<span ref={siteSelectRef} tw="inline-block w-full rounded-md shadow-sm">
				{isComponentReady && !validatingUser && !errorUser && typeof user !== "undefined" && user !== null ? (
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
				selectedSiteId={selectedSiteId}
				handleSiteSelectOnLoad={handleSiteSelectOnLoad}
				openDropdown={isSiteSelectComponentVisible}
			/>
		</div>
	);
}

/**
 * Memoized custom `SiteSelect` component
 */
export const MemoizedSiteSelect = memo(SiteSelect);

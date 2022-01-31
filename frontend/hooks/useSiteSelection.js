import { handleConversionStringToBoolean, handleConversionStringToNumber } from "@utils/convertCase";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAlertMessage } from "./useAlertMessage";
import { useComponentVisible } from "./useComponentVisible";

/**
 * Custom React hook that handles the selected site
 *
 * @returns {object} selectedSiteId, setSelectedSiteId
 */
export const useSiteSelection = () => {
	const [selectedSite, setSelectedSite] = useState(null);
	const [selectedSiteDetails, setSelectedSiteDetails] = useState(null);
	const [selectedSiteId, setSelectedSiteId] = useState(null);

	// Router
	const { query } = useRouter();

	// Custom hooks
	const { state, setConfig } = useAlertMessage();
	const {
		ref: siteSelectRef,
		isComponentVisible: isSiteSelectComponentVisible,
		setIsComponentVisible: setIsSiteSelectComponentVisible
	} = useComponentVisible(false);

	// Handle site selection on click
	const handleSiteSelectOnClick = async (siteId, isSiteVerified, scanCount) => {
		console.log(await siteId, await isSiteVerified, await scanCount);
	};

	// Handle site selection on load
	useEffect(() => {
		let isMounted = true;

		(async () => {
			if (!isMounted) return;

			const sanitizedSiteId = query?.siteId?.length ? handleConversionStringToNumber(query.siteId) : null;

			if (sanitizedSiteId !== null) {
				const handleSiteSelectOnLoad = (siteId) => {
					const { sites, errorSites, validatingSites } = dynamic(() => import("@hooks/useSites"));

					if (validatingSites) return;
					else {
						if (!errorSites && sites?.data?.results?.length > 0 && !sites?.data?.detail) {
							if (query?.siteId?.length > 0) {
								for (let i = 0; i < sites.data.results.length; i++) {
									if (sites.data.results[i]?.id === handleConversionStringToBoolean(query.siteId)) {
										setSelectedSite(sites.data.results[i].name);
									}
								}

								if (selectedSite?.length > 0) {
									let currentSite =
										sites.data.results.find((result) => result.id === handleConversionStringToNumber(query.siteId)) ||
										null;

									if (currentSite !== null) {
										setSelectedSite(currentSite.name);
									}
								}
							}

							if (selectedSite?.length > 0) {
								sites.data.results
									.filter((result) => result.name === selectedSite)
									.map((val) => {
										setSelectedSiteDetails(val);
									});
							}
						}

						return;
					}
				};

				handleSiteSelectOnLoad(sanitizedSiteId);
			}
		})();

		return () => {
			isMounted = false;
		};
	}, [query]);

	return {
		siteSelectRef,
		isSiteSelectComponentVisible,
		setIsSiteSelectComponentVisible,
		state,
		setConfig,
		selectedSiteId,
		setSelectedSiteId,
		selectedSite,
		setSelectedSite,
		selectedSiteDetails,
		setSelectedSiteDetails,
		handleSiteSelectOnClick
	};
};

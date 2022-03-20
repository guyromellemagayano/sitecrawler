import { SiteCrawlerAppContext } from "@pages/_app";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
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

	// Translations
	const { t } = useTranslation();
	const loaderMessage = t("common:loaderMessage");

	// Custom contexts
	const { sites, validatingSites, querySiteId } = useContext(SiteCrawlerAppContext);

	// Custom variables
	const sitesResults = sites?.data?.results ?? null;

	// Router
	const { query } = useRouter();

	// Custom hooks
	const {
		ref: siteSelectRef,
		isComponentVisible: isSiteSelectComponentVisible,
		setIsComponentVisible: setIsSiteSelectComponentVisible
	} = useComponentVisible(false);

	// Handle site selection on click
	const handleSiteSelectOnClick = async (siteId, isSiteVerified, scanCount) => {
		console.log(siteId, isSiteVerified, scanCount);
	};

	useEffect(() => {
		!validatingSites
			? () => (
					<span className="flex h-48 w-full items-center justify-center">
						<p className="pt-6 pb-2 text-sm font-medium leading-6 text-gray-500">{loaderMessage}</p>
					</span>
			  )
			: querySiteId
			? sitesResults
					?.filter((site) => site.id === querySiteId)
					?.map((site) => {
						setSelectedSite(site.name);
						setSelectedSiteDetails(site);
					})
			: null;
	}, [querySiteId]);

	return {
		siteSelectRef,
		isSiteSelectComponentVisible,
		setIsSiteSelectComponentVisible,
		selectedSiteId,
		setSelectedSiteId,
		selectedSite,
		setSelectedSite,
		selectedSiteDetails,
		setSelectedSiteDetails,
		handleSiteSelectOnClick
	};
};

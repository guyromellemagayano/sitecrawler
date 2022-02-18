import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { ScanSlug } from "@constants/PageLinks";
import { SiteCrawlerAppContext } from "@pages/_app";
import { useContext, useMemo, useState } from "react";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a site's crawl `stats` information
 *
 * @param {number} querySid
 * @param {number} scanObjId
 * @param {object} options
 * @returns {object} stats, errorStats, validatingStats, setStatsConfig, totalImages, totalLinks, totalPages, linkErrors, pageErrors, imageErrors, seoErrors, totalErrors
 */
export const useStats = (querySid = null, scanObjId = null, options = null) => {
	const [linkErrors, setLinkErrors] = useState(0);
	const [pageErrors, setPageErrors] = useState(0);
	const [imageErrors, setImageErrors] = useState(0);
	const [seoErrors, setSeoErrors] = useState(0);
	const [totalErrors, setTotalErrors] = useState(0);
	const [totalImages, setTotalImages] = useState(0);
	const [totalLinks, setTotalLinks] = useState(0);
	const [totalPages, setTotalPages] = useState(0);

	// Custom context
	const { setConfig: setStatsConfig } = useContext(SiteCrawlerAppContext);

	// Custom variables
	const currentEndpoint =
		querySid !== null &&
		typeof querySid === "number" &&
		querySid > 0 &&
		scanObjId !== null &&
		typeof scanObjId === "number" &&
		scanObjId > 0
			? SitesApiEndpoint + querySid + ScanSlug + scanObjId + "/"
			: null;

	// SWR hook
	const { data: stats, error: errorStats, isValidating: validatingStats } = useMainSWRConfig(currentEndpoint, options);

	useMemo(() => {
		let isMounted = true;

		(async () => {
			if (!isMounted) return;

			if (errorStats) {
				// Show alert message after failed `user` SWR hook fetch
				errorStats
					? setStatsConfig({
							isUser: true,
							method: errorStats?.config?.method ?? null,
							status: errorStats?.status ?? null
					  })
					: null;
			}
		})();

		return () => {
			isMounted = false;
		};
	}, [errorStats]);

	useMemo(() => {
		let isMounted = true;

		(async () => {
			if (!isMounted) return;

			if (stats?.data) {
				const currentTotalImages = stats.data?.num_images ?? 0;
				const currentTotalLinks = stats.data?.num_links ?? 0;
				const currentTotalPages = stats.data?.num_pages ?? 0;
				const currentLinkErrors = stats.data?.num_non_ok_links ?? 0;
				const currentPageErrors = stats.data?.num_pages_tls_non_ok ?? 0;
				const currentImageErrors =
					stats.data?.num_non_ok_images ??
					0 + stats.data?.num_images_with_missing_alts ??
					0 + stats.data?.num_images_tls_non_ok ??
					0;
				const currentSeoErrors =
					stats.data?.num_pages_without_title ??
					0 + stats.data?.num_pages_without_description ??
					0 + stats.data?.num_pages_without_h1_first ??
					0 + stats.data?.num_pages_without_h2_first ??
					0;
				const currentTotalErrors = await (currentLinkErrors +
					currentPageErrors +
					currentImageErrors +
					currentSeoErrors);

				setTotalImages(currentTotalImages);
				setTotalLinks(currentTotalLinks);
				setTotalPages(currentTotalPages);
				setLinkErrors(currentLinkErrors);
				setPageErrors(currentPageErrors);
				setImageErrors(currentImageErrors);
				setSeoErrors(currentSeoErrors);
				setTotalErrors(currentTotalErrors);
			}

			return { totalImages, totalLinks, totalPages, linkErrors, pageErrors, imageErrors, seoErrors, totalErrors };
		})();

		return () => {
			isMounted = false;
		};
	}, [stats]);

	return {
		stats,
		errorStats,
		validatingStats,
		setStatsConfig,
		totalImages,
		totalLinks,
		totalPages,
		linkErrors,
		pageErrors,
		imageErrors,
		seoErrors,
		totalErrors
	};
};

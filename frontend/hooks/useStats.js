import { useMemo, useState } from "react";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a site's crawl `stats` information
 *
 * @param {string} endpoint
 * @param {object} options
 * @returns {object} stats, errorStats, validatingStats, totalImages, totalLinks, totalPages, linkErrors, pageErrors, imageErrors, seoErrors, totalErrors
 */
export const useStats = (endpoint = null, setConfig, options = null) => {
	const [linkErrors, setLinkErrors] = useState(0);
	const [pageErrors, setPageErrors] = useState(0);
	const [imageErrors, setImageErrors] = useState(0);
	const [totalErrors, setTotalErrors] = useState(0);
	const [totalImages, setTotalImages] = useState(0);
	const [totalLinks, setTotalLinks] = useState(0);
	const [totalPages, setTotalPages] = useState(0);

	// SWR hook
	const {
		data: stats,
		error: errorStats,
		isValidating: validatingStats
	} = useMainSWRConfig(endpoint, setConfig, options);

	useMemo(() => {
		const currentTotalImages = stats?.data?.num_images ?? 0;
		const currentTotalLinks = stats?.data?.num_links ?? 0;
		const currentTotalPages = stats?.data?.num_pages ?? 0;
		const currentLinkErrors = stats?.data?.num_non_ok_links ?? 0;
		const currentPageErrors =
			stats?.data?.num_non_ok_scripts ??
			0 + stats?.data?.num_non_ok_stylesheets ??
			0 + stats?.data?.num_pages_without_title ??
			0 + stats?.data?.num_pages_without_description ??
			0 + stats?.data?.num_pages_without_h1_first ??
			0 + stats?.data?.num_pages_without_h1_second ??
			0 + stats?.data?.num_pages_without_h2_first ??
			0 + stats?.data?.num_pages_without_h2_second ??
			0 + stats?.data?.num_pages_tls_non_ok ??
			0 + stats?.data?.num_pages_duplicated_title ??
			0 + stats?.data?.num_pages_duplicated_description ??
			0;
		const currentImageErrors =
			stats?.data?.num_non_ok_images ??
			0 + stats?.data?.num_images_with_missing_alts ??
			0 + stats?.data?.num_images_tls_non_ok ??
			0;
		const currentTotalErrors = currentLinkErrors + currentPageErrors + currentImageErrors;

		setTotalImages(currentTotalImages);
		setTotalLinks(currentTotalLinks);
		setTotalPages(currentTotalPages);
		setLinkErrors(currentLinkErrors);
		setPageErrors(currentPageErrors);
		setImageErrors(currentImageErrors);
		setTotalErrors(currentTotalErrors);

		return { totalImages, totalLinks, totalPages, linkErrors, pageErrors, imageErrors, totalErrors };
	}, [stats]);

	return {
		stats,
		errorStats,
		validatingStats,
		totalImages,
		totalLinks,
		totalPages,
		linkErrors,
		pageErrors,
		imageErrors,
		totalErrors
	};
};

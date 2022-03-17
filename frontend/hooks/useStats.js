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
		let isMounted = true;

		(async () => {
			if (!isMounted) return;

			if (stats) {
				if (Math.round(stats.status / 100) === 2 && stats.data && !stats.data?.detail) {
					const currentTotalImages = stats.data.num_images;
					const currentTotalLinks = stats.data.num_links;
					const currentTotalPages = stats.data.num_pages;
					const currentLinkErrors = stats.data.num_non_ok_links;
					const currentPageErrors =
						stats.data.num_non_ok_scripts +
						stats.data.num_non_ok_stylesheets +
						stats.data.num_pages_without_title +
						stats.data.num_pages_without_description +
						stats.data.num_pages_without_h1_first +
						stats.data.num_pages_without_h1_second +
						stats.data.num_pages_without_h2_first +
						stats.data.num_pages_without_h2_second +
						stats.data.num_pages_tls_non_ok +
						stats.data.num_pages_duplicated_title +
						stats.data.num_pages_duplicated_description;
					const currentImageErrors =
						stats.data.num_non_ok_images + stats.data.num_images_with_missing_alts + stats.data.num_images_tls_non_ok;
					const currentTotalErrors = currentLinkErrors + currentPageErrors + currentImageErrors;

					setTotalImages(currentTotalImages);
					setTotalLinks(currentTotalLinks);
					setTotalPages(currentTotalPages);
					setLinkErrors(currentLinkErrors);
					setPageErrors(currentPageErrors);
					setImageErrors(currentImageErrors);
					setTotalErrors(currentTotalErrors);
				}
			}

			return { totalImages, totalLinks, totalPages, linkErrors, pageErrors, imageErrors, totalErrors };
		})();

		return () => {
			isMounted = false;
		};
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

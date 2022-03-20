import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a site's `images` information
 *
 * @param {string} endpoint
 * @param {object} options
 * @returns {object} images, errorImages, validatingImages
 */
export const useImages = (endpoint = null, options = null) => {
	// SWR hook
	const { data: images, error: errorImages, isValidating: validatingImages } = useMainSWRConfig(endpoint, options);

	return { images, errorImages, validatingImages };
};

import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a site's `images` information
 *
 * @param {string} endpoint
 * @param {function} setConfig
 * @param {object} options
 * @returns {object} images, errorImages, validatingImages
 */
export const useImages = (endpoint = null, setConfig, options = null) => {
	// SWR hook
	const {
		data: images,
		error: errorImages,
		isValidating: validatingImages
	} = useMainSWRConfig(endpoint, setConfig, options);

	return { images, errorImages, validatingImages };
};

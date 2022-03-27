import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a site's `imageId` information
 *
 * @param {string} endpoint
 * @param {object} options
 * @returns {object} imageId, errorImageId, validatingImageId
 */
export const useImageId = (endpoint = null, options = null) => {
	// SWR hook
	const { data: imageId, error: errorImageId, isValidating: validatingImageId } = useMainSWRConfig(endpoint, options);

	return { imageId, errorImageId, validatingImageId };
};

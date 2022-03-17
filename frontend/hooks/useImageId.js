import { useSWRConfig } from "swr";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a site's `imageId` information
 *
 * @param {string} endpoint
 * @param {function} setConfig
 * @param {object} options
 * @returns {object} imageId, errorImageId, validatingImageId
 */
export const useImageId = (endpoint = null, setConfig, options = null) => {
	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// SWR hook
	const {
		data: imageId,
		error: errorImageId,
		isValidating: validatingImageId
	} = useMainSWRConfig(endpoint, setConfig, options);

	return { imageId, errorImageId, validatingImageId };
};

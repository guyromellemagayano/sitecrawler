import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a site's `images` information
 *
 * @param {string} endpoint
 * @param {number} querySid
 * @param {number} scanObjId
 * @param {object} options
 * @returns {object} images, errorImages, validatingImages
 */
export const useImages = (endpoint = null, querySid = null, scanObjId = null, options = null) => {
	const currentEndpoint =
		querySid !== null &&
		typeof querySid === "number" &&
		querySid > 0 &&
		scanObjId !== null &&
		typeof scanObjId === "number" &&
		scanObjId > 0 &&
		endpoint !== null &&
		typeof endpoint === "string" &&
		endpoint !== ""
			? endpoint
			: null;

	const {
		data: images,
		error: errorImages,
		isValidating: validatingImages
	} = useMainSWRConfig(currentEndpoint, options);

	return { images, errorImages, validatingImages };
};

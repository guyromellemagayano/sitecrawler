import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a site's `images` information
 *
 * @param {string} endpoint
 * @param {number} querySid
 * @param {number} scanObjId
 * @returns {object} images, errorImages, validatingImages
 */
export const useImages = (endpoint = null, querySid = null, scanObjId = null) => {
	const currentEndpoint =
		typeof querySid !== "undefined" &&
		querySid !== null &&
		typeof querySid === "number" &&
		querySid > 0 &&
		typeof scanObjId !== "undefined" &&
		scanObjId !== null &&
		typeof scanObjId === "number" &&
		scanObjId > 0 &&
		typeof endpoint !== "undefined" &&
		endpoint !== null &&
		typeof endpoint === "string" &&
		endpoint !== ""
			? endpoint
			: null;

	const { data: images, error: errorImages, isValidating: validatingImages } = useMainSWRConfig(currentEndpoint);

	return { images, errorImages, validatingImages };
};

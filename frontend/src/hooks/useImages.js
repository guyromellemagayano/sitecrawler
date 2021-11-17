import useSWR from "swr";

/**
 * SWR React hook that will handle a site's `images` information
 *
 * @param {string} endpoint
 * @param {number} querySid
 * @param {number} scanObjId
 * @returns {object} data, error, isValidating
 */
export const useImages = (endpoint = null, querySid = 0, scanObjId = 0) => {
	const {
		data: images,
		error: errorImages,
		isValidating: validatingImages
	} = useSWR(
		typeof querySid !== "undefined" &&
			querySid !== null &&
			querySid !== 0 &&
			typeof scanObjId !== "undefined" &&
			scanObjId !== null &&
			scanObjId !== 0 &&
			typeof endpoint !== "undefined" &&
			endpoint !== null &&
			endpoint !== ""
			? endpoint
			: null
	);

	return { images, errorImages, validatingImages };
};

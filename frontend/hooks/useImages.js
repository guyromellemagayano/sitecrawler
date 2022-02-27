import { SiteCrawlerAppContext } from "@pages/_app";
import { useContext, useMemo, useState } from "react";
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
	const [imagesCount, setImagesCount] = useState(0);
	const [imagesResults, setImagesResults] = useState([]);

	// Custom context
	const { setConfig: setPagesConfig } = useContext(SiteCrawlerAppContext);

	// Custom variables
	const currentEndpoint =
		endpoint !== null &&
		typeof endpoint === "string" &&
		endpoint !== "" &&
		querySid !== null &&
		typeof querySid === "number" &&
		querySid > 0 &&
		scanObjId !== null &&
		typeof scanObjId === "number" &&
		scanObjId > 0
			? endpoint
			: null;

	// SWR hook
	const {
		data: images,
		error: errorImages,
		isValidating: validatingImages
	} = useMainSWRConfig(currentEndpoint, options);

	useMemo(async () => {
		if (errorImages) {
			// Show alert message after failed `user` SWR hook fetch
			errorImages
				? setPagesConfig({
						isPages: true,
						method: errorImages?.config?.method ?? null,
						status: errorImages?.status ?? null
				  })
				: null;
		}
	}, [errorImages]);

	useMemo(async () => {
		if (images?.data) {
			if (images.data?.count) {
				setImagesCount(images.data.count);
			}

			if (images.data?.results) {
				setImagesResults(images.data.results);
			}
		}

		return { imagesResults, imagesCount };
	}, [images, imagesResults, imagesCount]);

	return { images, errorImages, validatingImages, imagesResults, imagesCount };
};

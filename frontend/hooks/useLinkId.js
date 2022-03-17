import { useSWRConfig } from "swr";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a site's `linkId` information
 *
 * @param {string} endpoint
 * @param {function} setConfig
 * @param {object} options
 * @returns {object} linkId, errorLinkId, validatingLinkId
 */
export const useLinkId = (endpoint = null, setConfig, options = null) => {
	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// SWR hook
	const {
		data: linkId,
		error: errorLinkId,
		isValidating: validatingLinkId
	} = useMainSWRConfig(endpoint, setConfig, options);

	return { linkId, errorLinkId, validatingLinkId };
};

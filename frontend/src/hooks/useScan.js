import { SiteApiEndpoint } from "@configs/ApiEndpoints";
import useSWR from "swr";

/**
 * SWR React hook that will handle a site's `scan` information
 *
 * @param {number} querySid
 * @returns {object} data, error, isValidating
 */
export const useScan = (querySid = 0) => {
	const scanOrdering = "/scan/?ordering=-finished_at";

	const {
		data: scan,
		error: errorScan,
		isValidating: validatingScan
	} = useSWR(
		typeof querySid !== "undefined" && querySid !== null && querySid !== 0
			? SiteApiEndpoint + querySid + scanOrdering
			: null
	);

	return { scan, errorScan, validatingScan };
};

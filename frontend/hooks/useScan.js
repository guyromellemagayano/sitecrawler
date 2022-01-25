import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { orderingByNameQuery, sortByFinishedAtDescending } from "@constants/GlobalValues";
import { ScanSlug } from "@constants/PageLinks";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a site's `scan` information
 *
 * @param {number} querySid
 * @returns {object} scan, errorScan, validatingScan
 */
export const useScan = (querySid = null) => {
	const currentEndpoint =
		querySid !== null && typeof querySid === "number" && querySid > 0
			? SitesApiEndpoint + querySid + ScanSlug + "?" + orderingByNameQuery + sortByFinishedAtDescending
			: null;

	const { data: scan, error: errorScan, isValidating: validatingScan } = useMainSWRConfig(currentEndpoint);

	return { scan, errorScan, validatingScan };
};

import { SitesApiEndpoint } from "@configs/ApiEndpoints";
import { orderingByNameQuery, sortByFinishedAtDescending } from "@configs/GlobalValues";
import { ScanSlug } from "@configs/PageLinks";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a site's `scan` information
 *
 * @param {number} querySid
 * @returns {object} scan, errorScan, validatingScan
 */
export const useScan = (querySid = null) => {
	const currentEndpoint =
		typeof querySid !== "undefined" && querySid !== null && typeof querySid === "number" && querySid > 0
			? SitesApiEndpoint + querySid + ScanSlug + "?" + orderingByNameQuery + sortByFinishedAtDescending
			: null;

	const { data: scan, error: errorScan, isValidating: validatingScan } = useMainSWRConfig(currentEndpoint);

	return { scan, errorScan, validatingScan };
};

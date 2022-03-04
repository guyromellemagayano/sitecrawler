import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { SiteCrawlerAppContext } from "@pages/_app";
import { useContext, useMemo, useState } from "react";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a individual `site` information
 *
 * @param {number} querySid
 * @param {object} options
 * @returns {object} siteId, errorSiteId, validatingSiteId
 */
export const useSiteId = (querySid = null, options = null) => {
	const [siteIdVerified, setSiteIdVerified] = useState(false);
	const [siteName, setSiteName] = useState(null);
	const [siteUrl, setSiteUrl] = useState(null);

	// Custom context
	const { setConfig: setSiteIdConfig } = useContext(SiteCrawlerAppContext);

	// Custom variables
	const currentEndpoint =
		querySid !== null && typeof querySid === "number" && querySid > 0 ? SitesApiEndpoint + querySid + "/" : null;

	// SWR hook
	const {
		data: siteId,
		error: errorSiteId,
		isValidating: validatingSiteId
	} = useMainSWRConfig(currentEndpoint, options);

	useMemo(async () => {
		if (errorSiteId) {
			// Show alert message after failed `user` SWR hook fetch
			errorSiteId
				? setSiteIdConfig({
						isSiteId: true,
						method: errorSiteId?.config?.method ?? null,
						status: errorSiteId?.status ?? null
				  })
				: null;
		}
	}, [errorSiteId]);

	useMemo(async () => {
		if (siteId?.data) {
			if (siteId.data?.verified) {
				setSiteIdVerified(siteId.data.verified);
			}

			if (siteId.data?.url) {
				setSiteUrl(siteId.data.url);
			}

			if (siteId.data?.name) {
				setSiteName(siteId.data.name);
			}
		}

		return { siteIdVerified, siteName, siteUrl };
	}, [siteId, siteIdVerified, siteName, siteUrl]);

	return { siteId, errorSiteId, validatingSiteId, siteIdVerified, siteName, siteUrl };
};

import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { ScanSlug, SiteImageSlug } from "@constants/PageLinks";
import { SiteCrawlerAppContext } from "@pages/_app";
import { useContext, useMemo } from "react";
import { useMainSWRConfig } from "./useMainSWRConfig";

export const usePageId = (querySid = null, queryPageId = null, scanObjId = null, options = null) => {
	// Custom context
	const { setConfig: setPageIdConfig } = useContext(SiteCrawlerAppContext);

	// Custom variables
	const currentEndpoint =
		querySid !== null &&
		typeof querySid === "number" &&
		querySid > 0 &&
		queryPageId !== null &&
		typeof queryPageId === "number" &&
		queryPageId > 0 &&
		scanObjId !== null &&
		typeof scanObjId === "number" &&
		scanObjId > 0
			? SitesApiEndpoint + querySid + ScanSlug + scanObjId + SiteImageSlug + queryPageId + "/"
			: null;

	// SWR hook
	const {
		data: pageId,
		error: errorPageId,
		isValidating: validatingPageId
	} = useMainSWRConfig(currentEndpoint, options);

	useMemo(async () => {
		if (errorPageId) {
			// Show alert message after failed `imageId` SWR hook fetch
			errorPageId
				? setPageIdConfig({
						isPageId: true,
						method: errorPageId?.config?.method ?? null,
						status: errorPageId?.status ?? null
				  })
				: null;
		}
	}, [errorPageId]);

	return {
		pageId,
		errorPageId,
		validatingPageId
	};
};

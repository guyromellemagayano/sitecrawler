import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { ScanSlug, SitePageSlug } from "@constants/PageLinks";
import { SiteCrawlerAppContext } from "@pages/_app";
import { useContext, useMemo, useState } from "react";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a site's `page detail` information
 *
 * @param {number} querySid
 * @param {number} scanObjId
 * @param {number} linkId
 * @param {object} options
 * @returns {object} pageDetail, errorPageDetail, validatingPageDetail
 */
export const usePageDetail = (querySid = null, scanObjId = null, linkId = null, options = null) => {
	const [pageDetailId, setPageDetailId] = useState(0);
	const [pageDetailPages, setPageDetailPages] = useState([]);

	// Custom context
	const { setConfig: setLinkDetailConfig } = useContext(SiteCrawlerAppContext);

	const currentEndpoint =
		querySid !== null &&
		typeof querySid === "number" &&
		querySid > 0 &&
		scanObjId !== null &&
		typeof scanObjId === "number" &&
		scanObjId > 0 &&
		linkId !== null &&
		linkId > 0
			? SitesApiEndpoint + querySid + ScanSlug + scanObjId + SitePageSlug + linkId + "/"
			: null;

	// SWR hook
	const {
		data: pageDetail,
		error: errorPageDetail,
		isValidating: validatingPageDetail
	} = useMainSWRConfig(currentEndpoint, options);

	useMemo(async () => {
		if (errorPageDetail) {
			// Show alert message after failed `pageDetail` SWR hook fetch
			errorPageDetail
				? setLinkDetailConfig({
						isStats: true,
						method: errorPageDetail?.config?.method ?? null,
						status: errorPageDetail?.status ?? null
				  })
				: null;
		}
	}, [errorPageDetail]);

	useMemo(async () => {
		if (pageDetail?.data) {
			if (pageDetail.data?.id) {
				setPageDetailId(pageDetail.data.id);
			} else {
				setPageDetailId(0);
			}

			if (pageDetail.data?.pages) {
				setPageDetailPages(pageDetail.data.pages);
			} else {
				setPageDetailPages([]);
			}
		}

		return { pageDetailId, pageDetailPages };
	}, [pageDetail, pageDetailId, pageDetailPages]);

	return { pageDetail, errorPageDetail, validatingPageDetail };
};

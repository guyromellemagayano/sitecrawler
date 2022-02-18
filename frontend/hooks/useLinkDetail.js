import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { ScanSlug, SiteLinkSlug } from "@constants/PageLinks";
import { SiteCrawlerAppContext } from "@pages/_app";
import { useContext, useMemo, useState } from "react";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a site's `link` detail information
 *
 * @param {number} querySid
 * @param {number} scanObjId
 * @param {number} linkId
 * @returns {object} linkDetail, errorLinkDetail, validatingLinkDetail
 */
export const useLinkDetail = (querySid = null, scanObjId = null, linkId = null, options = null) => {
	const [linkDetailId, setLinkDetailId] = useState(0);
	const [linkDetailPages, setLinkDetailPages] = useState([]);

	// Custom context
	const { setConfig: setLinkDetailConfig } = useContext(SiteCrawlerAppContext);

	// Custom variables
	const currentEndpoint =
		querySid !== null &&
		typeof querySid === "number" &&
		querySid > 0 &&
		scanObjId !== null &&
		typeof scanObjId === "number" &&
		scanObjId > 0 &&
		linkId !== null &&
		typeof linkId === "number" &&
		linkId > 0
			? SitesApiEndpoint + querySid + ScanSlug + scanObjId + SiteLinkSlug + linkId
			: null;

	const {
		data: linkDetail,
		error: errorLinkDetail,
		isValidating: validatingLinkDetail
	} = useMainSWRConfig(currentEndpoint, options);

	useMemo(async () => {
		if (errorLinkDetail) {
			// Show alert message after failed `user` SWR hook fetch
			errorLinkDetail
				? setLinkDetailConfig({
						isStats: true,
						method: errorLinkDetail?.config?.method ?? null,
						status: errorLinkDetail?.status ?? null
				  })
				: null;
		}
	}, [errorLinkDetail]);

	useMemo(async () => {
		if (linkDetail?.data) {
			if (linkDetail.data?.id) {
				setLinkDetailId(linkDetail.data.id);
			}

			if (linkDetail.data?.pages) {
				setLinkDetailPages(linkDetail.data.pages);
			}
		}

		return { linkDetailId, linkDetailPages };
	}, [linkDetail, linkDetailId, linkDetailPages]);

	return { linkDetail, errorLinkDetail, validatingLinkDetail, linkDetailId, linkDetailPages };
};

import { SiteApiEndpoint } from "@configs/ApiEndpoints";
import useSWR from "swr";

export const usePageDetailLink = (addQuery = "", querySid = 0, scanObjId = 0, pageId = 0) => {
	const scanEndpoint = "/scan/";
	const pageEndpoint = "/page/";
	const linkEndpoint = "/link/";

	const {
		data: pageDetailLink,
		error: errorPageDetailLink,
		isValidating: validatingPageDetailLink
	} = useSWR(
		typeof querySid !== "undefined" &&
			querySid !== null &&
			querySid !== 0 &&
			typeof scanObjId !== "undefined" &&
			scanObjId !== null &&
			scanObjId !== 0 &&
			typeof pageId !== "undefined" &&
			pageId !== null &&
			pageId !== 0
			? SiteApiEndpoint +
					querySid +
					scanEndpoint +
					scanObjId +
					pageEndpoint +
					pageId +
					linkEndpoint +
					typeof addQuery !==
					"undefined" &&
			  addQuery !== null &&
			  addQuery !== ""
				? "?" + addQuery
				: ""
			: null
	);

	return { pageDetailLink, errorPageDetailLink, validatingPageDetailLink };
};

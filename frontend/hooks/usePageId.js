import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { ScanSlug, SiteImageSlug } from "@constants/PageLinks";
import { SiteCrawlerAppContext } from "@pages/_app";
import { useContext, useMemo, useState } from "react";
import { useSWRConfig } from "swr";
import { useMainSWRConfig } from "./useMainSWRConfig";

export const usePageId = (querySid = null, queryPageId = null, scanObjId = null, options = null) => {
	const [id, setId] = useState(null);
	const [url, setUrl] = useState(null);
	const [totalLinks, setTotalLinks] = useState(null);
	const [totalImages, setTotalImages] = useState(null);
	const [totalScripts, setTotalScripts] = useState(null);
	const [totalStylesheets, setTotalStylesheets] = useState(null);
	const [totalSize, setTotalSize] = useState(null);
	const [tlsStatus, setTlsStatus] = useState(null);
	const [imagesTlsStatus, setImagesTlsStatus] = useState(null);
	const [scriptsTlsStatus, setScriptsTlsStatus] = useState(null);
	const [stylesheetsTlsStatus, setStylesheetsTlsStatus] = useState(null);
	const [totalOkLinks, setTotalOkLinks] = useState(null);
	const [totalNonOkLinks, setTotalNonOkLinks] = useState(null);
	const [totalOkImages, setTotalOkImages] = useState(null);
	const [totalNonOkImages, setTotalNonOkImages] = useState(null);
	const [totalOkScripts, setTotalOkScripts] = useState(null);
	const [totalNonOkScripts, setTotalNonOkScripts] = useState(null);
	const [totalOkStylesheets, setTotalOkStylesheets] = useState(null);
	const [totalNonOkStylesheets, setTotalNonOkStylesheets] = useState(null);
	const [totalTlsImages, setTotalTlsImages] = useState(null);
	const [totalNonTlsImages, setTotalNonTlsImages] = useState(null);
	const [totalTlsScripts, setTotalTlsScripts] = useState(null);
	const [totalNonTlsScripts, setTotalNonTlsScripts] = useState(null);
	const [totalTlsStylesheets, setTotalTlsStylesheets] = useState(null);
	const [totalNonTlsStylesheets, setTotalNonTlsStylesheets] = useState(null);
	const [pageResolvedTls, setPageResolvedTls] = useState(null);
	const [pageResolvedSize, setPageResolvedSize] = useState(null);
	const [pageResolvedMissingTitle, setPageResolvedMissingTitle] = useState(null);
	const [pageResolvedMissingDescription, setPageResolvedMissingDescription] = useState(null);
	const [pageResolvedMissingH1First, setPageResolvedMissingH1First] = useState(null);
	const [pageResolvedMissingH1Second, setPageResolvedMissingH1Second] = useState(null);
	const [pageResolvedMissingH2First, setPageResolvedMissingH2First] = useState(null);
	const [pageResolvedMissingH2Second, setPageResolvedMissingH2Second] = useState(null);
	const [pageResolvedDuplicateTitle, setPageResolvedDuplicateTitle] = useState(null);
	const [pageResolvedDuplicateDescription, setPageResolvedDuplicateDescription] = useState(null);

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

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// SWR hook
	const {
		data: pageId,
		error: errorPageId,
		isValidating: validatingPageId
	} = useMainSWRConfig(currentEndpoint, options);

	useMemo(async () => {
		if (errorPageId) {
			// Show alert message after failed `pageId` SWR hook fetch
			errorPageId
				? setPageIdConfig({
						isPageId: true,
						method: errorPageId?.config?.method ?? null,
						status: errorPageId?.status ?? null
				  })
				: null;
		}
	}, [errorPageId]);

	useMemo(async () => {
		if (Math.round(pageId?.status / 100) === 2 && pageId?.data && !pageId?.data?.detail) {
			if (pageId.data?.id) {
				setId(pageId.data.id);
			}

			if (pageId.data?.url) {
				setUrl(pageId.data.url);
			}

			if (pageId.data?.num_links) {
				setTotalLinks(pageId.data.num_links);
			}

			if (pageId.data?.num_images) {
				setTotalImages(pageId.data.num_images);
			}

			if (pageId.data?.num_scripts) {
				setTotalScripts(pageId.data.num_scripts);
			}

			if (pageId.data?.num_stylesheets) {
				setTotalStylesheets(pageId.data.num_stylesheets);
			}

			if (pageId.data?.size_total) {
				setTotalSize(pageId.data.size_total);
			}

			if (pageId.data?.tls_status) {
				setTlsStatus(pageId.data.tls_status);
			}

			if (pageId.data?.tls_images) {
				setImagesTlsStatus(pageId.data.tls_images);
			}

			if (pageId.data?.tls_scripts) {
				setScriptsTlsStatus(pageId.data.tls_scripts);
			}

			if (pageId.data?.tls_stylesheets) {
				setStylesheetsTlsStatus(pageId.data.tls_stylesheets);
			}

			if (pageId.data?.num_ok_links) {
				setTotalOkLinks(pageId.data.num_ok_links);
			}

			if (pageId.data?.num_non_ok_links) {
				setTotalNonOkLinks(pageId.data.num_non_ok_links);
			}

			if (pageId.data?.num_ok_images) {
				setTotalOkImages(pageId.data.num_ok_images);
			}

			if (pageId.data?.num_non_ok_images) {
				setTotalNonOkImages(pageId.data.num_non_ok_images);
			}

			if (pageId.data?.num_ok_scripts) {
				setTotalOkScripts(pageId.data.num_ok_scripts);
			}

			if (pageId.data?.num_non_ok_scripts) {
				setTotalNonOkScripts(pageId.data.num_non_ok_scripts);
			}

			if (pageId.data?.num_ok_stylesheets) {
				setTotalOkStylesheets(pageId.data.num_ok_stylesheets);
			}

			if (pageId.data?.num_non_ok_stylesheets) {
				setTotalNonOkStylesheets(pageId.data.num_non_ok_stylesheets);
			}

			if (pageId.data?.num_tls_images) {
				setTotalTlsImages(pageId.data.num_tls_images);
			}

			if (pageId.data?.num_non_tls_images) {
				setTotalNonTlsImages(pageId.data.num_non_tls_images);
			}

			if (pageId.data?.num_tls_scripts) {
				setTotalTlsScripts(pageId.data.num_tls_scripts);
			}

			if (pageId.data?.num_non_tls_scripts) {
				setTotalNonTlsScripts(pageId.data.num_non_tls_scripts);
			}

			if (pageId.data?.num_tls_stylesheets) {
				setTotalTlsStylesheets(pageId.data.num_tls_stylesheets);
			}

			if (pageId.data?.num_non_tls_stylesheets) {
				setTotalNonTlsStylesheets(pageId.data.num_non_tls_stylesheets);
			}

			if (pageId.data?.resolved_tls) {
				setPageResolvedTls(pageId.data.resolved_tls);
			}

			if (pageId.data?.resolved_size) {
				setPageResolvedSize(pageId.data.resolved_size);
			}

			if (pageId.data?.resolved_missing_title) {
				setPageResolvedMissingTitle(pageId.data.resolved_missing_title);
			}

			if (pageId.data?.resolved_missing_description) {
				setPageResolvedMissingDescription(pageId.data.resolved_missing_description);
			}

			if (pageId.data?.resolved_missing_h1_first) {
				setPageResolvedMissingH1First(pageId.data.resolved_missing_h1_first);
			}

			if (pageId.data?.resolved_missing_h1_second) {
				setPageResolvedMissingH1Second(pageId.data.resolved_missing_h1_second);
			}

			if (pageId.data?.resolved_missing_h2_first) {
				setPageResolvedMissingH2First(pageId.data.resolved_missing_h2_first);
			}

			if (pageId.data?.resolved_missing_h2_second) {
				setPageResolvedMissingH2Second(pageId.data.resolved_missing_h2_second);
			}

			if (pageId.data?.resolved_duplicate_title) {
				setPageResolvedDuplicateTitle(pageId.data.resolved_duplicate_title);
			}

			if (pageId.data?.resolved_duplicate_description) {
				setPageResolvedDuplicateDescription(pageId.data.resolved_duplicate_description);
			}
		}
	}, [
		pageId,
		id,
		totalLinks,
		totalImages,
		totalScripts,
		totalStylesheets,
		totalSize,
		tlsStatus,
		imagesTlsStatus,
		scriptsTlsStatus,
		stylesheetsTlsStatus,
		totalOkLinks,
		totalNonOkLinks,
		totalOkImages,
		totalNonOkImages,
		totalOkScripts,
		totalNonOkScripts,
		totalOkStylesheets,
		totalNonOkStylesheets,
		totalTlsImages,
		totalNonTlsImages,
		totalTlsScripts,
		totalNonTlsScripts,
		totalTlsStylesheets,
		totalNonTlsStylesheets,
		pageResolvedTls,
		pageResolvedSize,
		pageResolvedMissingTitle,
		pageResolvedMissingDescription,
		pageResolvedMissingH1First,
		pageResolvedMissingH1Second,
		pageResolvedMissingH2First,
		pageResolvedMissingH2Second,
		pageResolvedDuplicateTitle,
		pageResolvedDuplicateDescription
	]);

	return {
		pageId,
		id,
		errorPageId,
		validatingPageId,
		totalLinks,
		totalImages,
		totalScripts,
		totalStylesheets,
		totalSize,
		tlsStatus,
		imagesTlsStatus,
		scriptsTlsStatus,
		stylesheetsTlsStatus,
		totalOkLinks,
		totalNonOkLinks,
		totalOkImages,
		totalNonOkImages,
		totalOkScripts,
		totalNonOkScripts,
		totalOkStylesheets,
		totalNonOkStylesheets,
		totalTlsImages,
		totalNonTlsImages,
		totalTlsScripts,
		totalNonTlsScripts,
		totalTlsStylesheets,
		totalNonTlsStylesheets,
		pageResolvedTls,
		pageResolvedSize,
		pageResolvedMissingTitle,
		pageResolvedMissingDescription,
		pageResolvedMissingH1First,
		pageResolvedMissingH1Second,
		pageResolvedMissingH2First,
		pageResolvedMissingH2Second,
		pageResolvedDuplicateTitle,
		pageResolvedDuplicateDescription
	};
};

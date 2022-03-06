import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { ScanSlug, SiteLinkSlug } from "@constants/PageLinks";
import { handlePutMethod } from "@helpers/handleHttpMethods";
import { SiteCrawlerAppContext } from "@pages/_app";
import { useContext, useMemo, useState } from "react";
import { useSWRConfig } from "swr";
import { useMainSWRConfig } from "./useMainSWRConfig";

export const useLinkId = (querySid = null, queryLinkId = null, scanObjId = null, options = null) => {
	const [id, setId] = useState(null);
	const [createdAt, setCreatedAt] = useState(null);
	const [scanId, setScanId] = useState(null);
	const [type, setType] = useState(null);
	const [url, setUrl] = useState(null);
	const [status, setStatus] = useState(null);
	const [statusAdjusted, setStatusAdjusted] = useState(null);
	const [httpStatus, setHttpStatus] = useState(null);
	const [responseTime, setResponseTime] = useState(null);
	const [error, setError] = useState(null);
	const [size, setSize] = useState(null);
	const [tlsStatus, setTlsStatus] = useState(null);
	const [tlsStatusAdjusted, setTlsStatusAdjusted] = useState(null);
	const [resolvedStatus, setResolvedStatus] = useState(false);
	const [resolvedTls, setResolvedTls] = useState(false);
	const [tls, setTls] = useState(null);
	const [pages, setPages] = useState(null);

	// Custom context
	const { setConfig: setLinkIdConfig } = useContext(SiteCrawlerAppContext);

	// Custom variables
	const currentEndpoint =
		querySid !== null &&
		typeof querySid === "number" &&
		querySid > 0 &&
		queryLinkId !== null &&
		typeof queryLinkId === "number" &&
		queryLinkId > 0 &&
		scanObjId !== null &&
		typeof scanObjId === "number" &&
		scanObjId > 0
			? SitesApiEndpoint + querySid + ScanSlug + scanObjId + SiteLinkSlug + queryLinkId + "/"
			: null;

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// SWR hook
	const {
		data: linkId,
		error: errorLinkId,
		isValidating: validatingLinkId
	} = useMainSWRConfig(currentEndpoint, options);

	useMemo(async () => {
		if (errorLinkId) {
			// Show alert message after failed `linkId` SWR hook fetch
			errorLinkId
				? setLinkIdConfig({
						isLinkId: true,
						method: errorLinkId?.config?.method ?? null,
						status: errorLinkId?.status ?? null
				  })
				: null;
		}
	}, [errorLinkId]);

	useMemo(async () => {
		if (Math.round(linkId?.status / 100) === 2 && linkId?.data && !linkId?.data?.detail) {
			if (linkId.data?.id) {
				setId(linkId.data.id);
			}

			if (linkId.data?.created_at) {
				setCreatedAt(linkId.data.created_at);
			}

			if (linkId.data?.scan_id) {
				setScanId(linkId.data.scan_id);
			}

			if (linkId.data?.type) {
				setType(linkId.data.type);
			}

			if (linkId.data?.url) {
				setUrl(linkId.data.url);
			}

			if (linkId.data?.status) {
				setStatus(linkId.data.status);
			}

			if (linkId.data?.status_adjusted) {
				setStatusAdjusted(linkId.data.status_adjusted);
			}

			if (linkId.data?.http_status) {
				setHttpStatus(linkId.data.http_status);
			}

			if (linkId.data?.response_time) {
				setResponseTime(linkId.data.response_time);
			}

			if (linkId.data?.error) {
				setError(linkId.data.error);
			}

			if (linkId.data?.size) {
				setSize(linkId.data.size);
			}

			if (linkId.data?.tls_status) {
				setTlsStatus(linkId.data.tls_status);
			}

			if (linkId.data?.tls_status_adjusted) {
				setTlsStatusAdjusted(linkId.data.tls_status_adjusted);
			}

			if (linkId.data?.resolved_status) {
				setResolvedStatus(linkId.data.resolved_status);
			}

			if (linkId.data?.resolved_tls) {
				setResolvedTls(linkId.data.resolved_tls);
			}

			if (linkId.data?.pages) {
				setPages(linkId.data.pages);
			}
		}

		return {
			id,
			createdAt,
			scanId,
			type,
			url,
			status,
			statusAdjusted,
			httpStatus,
			responseTime,
			error,
			size,
			tlsStatus,
			tlsStatusAdjusted,
			resolvedStatus,
			resolvedTls,
			pages
		};
	}, [
		linkId,
		id,
		createdAt,
		scanId,
		type,
		url,
		status,
		statusAdjusted,
		httpStatus,
		responseTime,
		error,
		size,
		tlsStatus,
		tlsStatusAdjusted,
		resolvedStatus,
		resolvedTls,
		pages
	]);

	// Handle resolved status
	const handleResolveData = (e) => {
		e.preventDefault();

		let isMounted = true;

		const resolveValue = e.target.value;
		const resolveChecked = e.target.checked;

		if (resolveValue === "resolvedStatus" && resolveChecked) {
			setResolvedStatus(true);
		} else {
			setResolvedStatus(false);
		}

		if (resolveValue === "resolvedTls" && resolveChecked) {
			setResolvedTls(true);
		} else {
			setResolvedTls(false);
		}

		(async () => {
			if (!isMounted) return;

			const body = {
				id: id,
				createdAt: createdAt,
				scanId: scanId,
				type: type,
				url: url,
				status: status,
				statusAdjusted: statusAdjusted,
				httpStatus: httpStatus,
				responseTime: responseTime,
				error: error,
				size: size,
				tlsStatus: tlsStatus,
				tlsStatusAdjusted: tlsStatusAdjusted,
				resolvedStatus: resolvedStatus,
				resolvedTls: resolvedTls,
				tls: tls,
				pages: pages
			};

			const resolveResponse = await handlePutMethod(currentEndpoint, body);
			const resolveResponseData = resolveResponse?.data ?? null;
			const resolveResponseStatus = resolveResponse?.status ?? null;
			const resolveResponseMethod = resolveResponse?.config?.method ?? null;

			if (resolveResponseData !== null && Math.round(resolveResponseStatus / 200) === 1) {
				mutate(currentEndpoint, {
					...linkId,
					data: resolveResponseData
				});
			}
		})();

		return () => {
			isMounted = false;
		};
	};

	return {
		linkId,
		id,
		errorLinkId,
		validatingLinkId,
		createdAt,
		scanId,
		type,
		url,
		status,
		statusAdjusted,
		httpStatus,
		responseTime,
		error,
		size,
		tlsStatus,
		tlsStatusAdjusted,
		resolvedStatus,
		resolvedTls,
		pages
	};
};

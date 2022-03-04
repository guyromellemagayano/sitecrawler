import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { ScanSlug, SiteImageSlug } from "@constants/PageLinks";
import { handlePutMethod } from "@helpers/handleHttpMethods";
import { SiteCrawlerAppContext } from "@pages/_app";
import { useContext, useMemo, useState } from "react";
import { mutate } from "swr";
import { useMainSWRConfig } from "./useMainSWRConfig";

export const useImageId = (querySid = null, queryImageId = null, scanObjId = null, options = null) => {
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
	const [missingAlts, setMissingAlts] = useState(null);
	const [missingAltsAdjusted, setMissingAltsAdjusted] = useState(null);
	const [resolvedMissingAlts, setResolvedMissingAlts] = useState(false);
	const [tls, setTls] = useState(null);
	const [pages, setPages] = useState(null);

	// Custom context
	const { setConfig: setImageIdConfig } = useContext(SiteCrawlerAppContext);

	// Custom variables
	const currentEndpoint =
		querySid !== null &&
		typeof querySid === "number" &&
		querySid > 0 &&
		queryImageId !== null &&
		typeof queryImageId === "number" &&
		queryImageId > 0 &&
		scanObjId !== null &&
		typeof scanObjId === "number" &&
		scanObjId > 0
			? SitesApiEndpoint + querySid + ScanSlug + scanObjId + SiteImageSlug + queryImageId + "/"
			: null;

	// SWR hook
	const {
		data: imageId,
		error: errorImageId,
		isValidating: validatingImageId
	} = useMainSWRConfig(currentEndpoint, options);

	// Handle resolved status
	const handleResolveData = (e) => {
		e.preventDefault();

		let isMounted = true;

		const resolveValue = e.target.value;
		const resolveChecked = e.target.checked;

		if (resolveValue === "resolvedStatus" && resolveChecked) {
			setResolvedStatus(true);
		} else if (resolveValue === "resolvedStatus" && !resolveChecked) {
			setResolvedStatus(false);
		}

		if (resolveValue === "resolvedTls") {
			setResolvedTls(true);
		} else {
			setResolvedTls(false);
		}

		if (resolveValue === "resolvedMissingAlts") {
			setResolvedMissingAlts(true);
		} else {
			setResolvedMissingAlts(false);
		}

		(async () => {
			const body = {
				id: id,
				created_at: createdAt,
				scan_id: scanId,
				type: type,
				url: url,
				status: status,
				status_adjusted: statusAdjusted,
				http_status: httpStatus,
				response_time: responseTime,
				error: error,
				size: size,
				tls_status: tlsStatus,
				tls_status_adjusted: tlsStatusAdjusted,
				resolved_status: resolvedStatus,
				resolved_tls: resolvedTls,
				missing_alts: missingAlts,
				missing_alts_adjusted: missingAltsAdjusted,
				resolved_missing_alts: resolvedMissingAlts,
				tls: tls,
				pages: pages
			};

			const resolveResponse = await handlePutMethod(currentEndpoint, body);
			const resolveResponseData = resolveResponse?.data ?? null;
			const resolveResponseStatus = resolveResponse?.status ?? null;
			const resolveResponseMethod = resolveResponse?.config?.method ?? null;

			if (resolveResponseData !== null && Math.round(resolveResponseStatus / 200) === 1) {
				// Show alert message after successful 200 OK or 201 Created response is issued
				setImageIdConfig({
					isImageId: true,
					method: resolveResponseMethod,
					status: resolveResponseStatus
				});

				mutate(
					currentEndpoint,
					{
						...imageId,
						data: resolveResponseData
					},
					false
				);
			} else {
				// Show alert message after successful 200 OK or 201 Created response is issued
				setImageIdConfig({
					isImageId: true,
					method: resolveResponseMethod,
					status: resolveResponseStatus
				});

				mutate(currentEndpoint);
			}
		})();

		return () => {
			isMounted = false;
		};
	};

	useMemo(async () => {
		if (errorImageId) {
			// Show alert message after failed `imageId` SWR hook fetch
			errorImageId
				? setImageIdConfig({
						isImageId: true,
						method: errorImageId?.config?.method ?? null,
						status: errorImageId?.status ?? null
				  })
				: null;
		}
	}, [errorImageId]);

	useMemo(async () => {
		if (imageId?.data) {
			if (imageId.data?.id) {
				setId(imageId.data.id);
			}

			if (imageId.data?.created_at) {
				setCreatedAt(imageId.data.created_at);
			}

			if (imageId.data?.scan_id) {
				setScanId(imageId.data.scan_id);
			}

			if (imageId.data?.type) {
				setType(imageId.data.type);
			}

			if (imageId.data?.url) {
				setUrl(imageId.data.url);
			}

			if (imageId.data?.status) {
				setStatus(imageId.data.status);
			}

			if (imageId.data?.status_adjusted) {
				setStatusAdjusted(imageId.data.status_adjusted);
			}

			if (imageId.data?.http_status) {
				setHttpStatus(imageId.data.http_status);
			}

			if (imageId.data?.response_time) {
				setResponseTime(imageId.data.response_time);
			}

			if (imageId.data?.error) {
				setError(imageId.data.error);
			}

			if (imageId.data?.size) {
				setSize(imageId.data.size);
			}

			if (imageId.data?.tls_status) {
				setTlsStatus(imageId.data.tls_status);
			}

			if (imageId.data?.tls_status_adjusted) {
				setTlsStatusAdjusted(imageId.data.tls_status_adjusted);
			}

			if (imageId.data?.resolved_status) {
				setResolvedStatus(imageId.data.resolved_status);
			}

			if (imageId.data?.resolved_tls) {
				setResolvedTls(imageId.data.resolved_tls);
			}

			if (imageId.data?.missing_alts) {
				setMissingAlts(imageId.data.missing_alts);
			}

			if (imageId.data?.missing_alts_adjusted) {
				setMissingAltsAdjusted(imageId.data.missing_alts_adjusted);
			}

			if (imageId.data?.resolved_missing_alts) {
				setResolvedMissingAlts(imageId.data.resolved_missing_alts);
			}

			if (imageId.data?.pages) {
				setPages(imageId.data.pages);
			}
		}

		return {
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
			missingAlts,
			missingAltsAdjusted,
			resolvedMissingAlts,
			pages
		};
	}, [
		imageId,
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
		missingAlts,
		missingAltsAdjusted,
		resolvedMissingAlts,
		pages
	]);

	return {
		imageId,
		errorImageId,
		validatingImageId,
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
		missingAlts,
		missingAltsAdjusted,
		resolvedMissingAlts,
		pages
	};
};

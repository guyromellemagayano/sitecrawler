import { handlePostMethod } from "@helpers/handleHttpMethods";
import dayjs from "dayjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSWRConfig } from "swr";
import { useMainSWRConfig } from "./useMainSWRConfig";
import { useNotificationMessage } from "./useNotificationMessage";

/**
 * SWR React hook that will handle a site's `scan` information
 *
 * @param {string} endpoint
 * @param {object} options
 * @returns {object} currentScan, errorScan, handleCrawl, isCrawlFinished, isCrawlStarted, isProcessing, previousScan, scan, scanObjId, selectedSiteRef, validatingScan
 */
export const useScan = (endpoint = null, options = null) => {
	const [currentScan, setCurrentScan] = useState(null);
	const [previousScan, setPreviousScan] = useState(null);
	const [isCrawlFinished, setIsCrawlFinished] = useState(true);
	const [isCrawlStarted, setIsCrawlStarted] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [scanObjId, setScanObjId] = useState(0);

	// DayJS options
	const calendar = require("dayjs/plugin/calendar");
	const timezone = require("dayjs/plugin/timezone");
	const utc = require("dayjs/plugin/utc");

	dayjs.extend(calendar);
	dayjs.extend(utc);
	dayjs.extend(timezone);

	const calendarStrings = {
		lastDay: "[Yesterday], dddd [at] hh:mm:ss A",
		lastWeek: "MMMM DD, YYYY [at] hh:mm:ss A",
		sameDay: "[Today], dddd [at] hh:mm:ss A",
		sameElse: "MMMM DD, YYYY [at] hh:mm:ss A"
	};

	// Custom hooks
	const selectedSiteRef = useRef(null);

	// Custom context
	const { setConfig } = useNotificationMessage();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// SWR hook
	const { data: scan, error: errorScan, isValidating: validatingScan } = useMainSWRConfig(endpoint, options);

	// Handle crawl process
	const handleCrawl = async (e, site) => {
		if (selectedSiteRef?.current && selectedSiteRef?.current?.contains(e.target)) {
			// Set `isProcessing` state
			setIsProcessing(true);

			const startScanSlug = "/start_scan/";
			site += startScanSlug;

			const currentScanResponse = await handlePostMethod(site);
			const currentScanResponseData = currentScanResponse?.data ?? null;
			const currentScanResponseStatus = currentScanResponse?.status ?? null;
			const currentScanResponseMethod = currentScanResponse?.config?.method ?? null;

			if (currentScanResponseData && Math.round(currentScanResponseStatus / 200) === 1) {
				// Set `isCrawlStarted` state
				setIsCrawlStarted(true);

				// Unset `isCrawledFinished` state
				setIsCrawlFinished(false);
			} else {
				// Unset `isCrawlStarted` state
				setIsCrawlStarted(false);

				// Set `isCrawledFinished` state
				setIsCrawlFinished(true);
			}

			// Mutate `scan` state
			mutate(site, { ...scan, data: currentScanResponseData });

			// Set `isProcessing` state
			setIsProcessing(false);

			// Show alert message after successful `user` SWR hook fetch
			setConfig({
				isScan: true,
				method: currentScanResponseData?.config?.method ?? null,
				status: currentScanResponseData?.status ?? null,
				isAlert: false,
				isNotification: true
			});
		}

		return { isCrawlStarted, isCrawlFinished, isProcessing };
	};

	// Handle scan process
	const handleScanWatching = useCallback(() => {
		const previousScanResult =
			scan && Object.keys(scan)?.length > 0
				? scan?.data?.results?.find((result) => result.finished_at !== null && result.force_https !== null)
				: null;
		const currentScanResult =
			scan && Object.keys(scan)?.length > 0
				? scan?.data?.results?.find((result) => result.finished_at == null && result.force_https == null)
				: null;

		currentScanResult && Object.keys(currentScanResult)?.length > 0
			? setCurrentScan(currentScanResult)
			: setCurrentScan(null);

		previousScanResult && Object.keys(previousScanResult)?.length > 0
			? setPreviousScan(previousScanResult)
			: setPreviousScan(null);

		const currentScanObjId =
			(currentScanResult &&
				Object.keys(currentScanResult)?.length > 0 &&
				previousScanResult &&
				Object.keys(previousScanResult)?.length > 0) ||
			(!currentScanResult && previousScanResult && Object.keys(previousScanResult)?.length > 0)
				? previousScanResult?.id
				: currentScanResult?.id;

		// Set `scanObjId` state
		setScanObjId(currentScanObjId);

		return { isCrawlStarted, isCrawlFinished, scanObjId };
	});

	useEffect(() => {
		handleScanWatching();
	}, [handleScanWatching]);

	useEffect(() => {
		currentScan && Object.keys(currentScan)?.length > 0
			? (() => {
					setIsCrawlStarted(true);
					setIsCrawlFinished(false);
			  })()
			: (() => {
					setIsCrawlStarted(false);
					setIsCrawlFinished(true);
			  })();

		return { isCrawlStarted, isCrawlFinished };
	}, [currentScan, previousScan]);

	return {
		errorScan,
		handleCrawl,
		isCrawlFinished,
		isCrawlStarted,
		isProcessing,
		previousScan,
		currentScan,
		scan,
		scanObjId,
		selectedSiteRef,
		validatingScan
	};
};

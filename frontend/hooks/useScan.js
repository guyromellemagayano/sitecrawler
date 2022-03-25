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
	const [isCrawlFinished, setIsCrawlFinished] = useState(true);
	const [isCrawlStarted, setIsCrawlStarted] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [previousScan, setPreviousScan] = useState(null);
	const [scanObjId, setScanObjId] = useState(null);

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
	const handleScan = useCallback(() => {
		if (scan) {
			const previousScanResult =
				scan?.data?.results?.find((result) => result.finished_at && result.force_https) ?? null;
			const currentScanResult =
				scan?.data?.results?.find((result) => result.finished_at == null && result.force_https == null) ?? null;

			setCurrentScan(currentScanResult);
			setPreviousScan(previousScanResult);

			// Set `scanObjId` state
			(currentScan && previousScan) || (!currentScan && previousScan)
				? setScanObjId(previousScan?.id)
				: setScanObjId(currentScan?.id);

			return { currentScan, previousScan, scanObjId };
		}
	}, [scan]);

	useEffect(() => {
		handleScan();
	}, [handleScan]);

	// Check currentScan
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
	}, [currentScan]);

	return {
		currentScan,
		errorScan,
		handleCrawl,
		isCrawlFinished,
		isCrawlStarted,
		isProcessing,
		previousScan,
		scan,
		scanObjId,
		selectedSiteRef,
		validatingScan
	};
};

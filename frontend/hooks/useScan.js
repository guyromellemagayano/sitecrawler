import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { handlePostMethod } from "@helpers/handleHttpMethods";
import dayjs from "dayjs";
import { useMemo, useRef, useState } from "react";
import { useSWRConfig } from "swr";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a site's `scan` information
 *
 * @param {string} endpoint
 * @param {number} querySid
 * @param {function} setConfig
 * @param {object} options
 * @returns {object} currentScan, errorScan, handleCrawl, isCrawlFinished, isCrawlStarted, isProcessing, previousScan, scan, scanObjId, selectedSiteRef, validatingScan
 */
export const useScan = (endpoint = null, querySid = null, setConfig, options = null) => {
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

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// Custom hooks
	const selectedSiteRef = useRef(null);

	// SWR hook
	const { data: scan, error: errorScan, isValidating: validatingScan } = useMainSWRConfig(endpoint, options);

	// Handle crawl process
	const handleCrawl = () => {
		// Set `isProcessing` state
		setIsProcessing(true);

		(async () => {
			if (selectedSiteRef?.current && selectedSiteRef?.current?.contains(e.target)) {
				const startScanSlug = "/start_scan/";
				let endpoint = `${SitesApiEndpoint + querySid + startScanSlug}`;

				const currentScanResponse = await handlePostMethod(endpoint);
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
				mutate(endpoint, { ...scan, data: currentScanResponseData });

				// Set `isProcessing` state
				setIsProcessing(false);

				// Show alert message after successful `user` SWR hook fetch
				setConfig({
					isScan: true,
					method: currentScanResponseData?.config?.method ?? null,
					status: currentScanResponseData?.status ?? null
				});
			}

			return { isCrawlStarted, isCrawlFinished, isProcessing };
		})();
	};

	useMemo(() => {
		let previousScanResult = scan?.data?.results?.find((result) => result.finished_at && result.force_https) ?? null;
		let currentScanResult = scan?.data?.results?.find((result) => !result.finished_at && !result.force_https) ?? null;

		setCurrentScan(currentScanResult);
		setPreviousScan(previousScanResult);

		if (currentScan) {
			setIsCrawlStarted(true);
			setIsCrawlFinished(false);
		} else {
			setIsCrawlStarted(false);
			setIsCrawlFinished(true);
		}

		if ((currentScan && previousScan) || (!currentScan && previousScan)) {
			setScanObjId(previousScan?.id ?? null);
		} else {
			setScanObjId(currentScan?.id ?? null);
		}

		return { currentScan, previousScan, scanObjId, isCrawlStarted, isCrawlFinished };
	}, [scan]);

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

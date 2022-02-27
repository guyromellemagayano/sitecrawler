import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { orderingByNameQuery, sortByFinishedAtDescending } from "@constants/GlobalValues";
import { ScanSlug } from "@constants/PageLinks";
import { handlePostMethod } from "@helpers/handleHttpMethods";
import { SiteCrawlerAppContext } from "@pages/_app";
import dayjs from "dayjs";
import { useContext, useMemo, useRef, useState } from "react";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a site's `scan` information
 *
 * @param {number} querySid
 * @param {object} options
 * @returns {object} currentScan, errorScan, handleCrawl, isCrawlFinished, isCrawlStarted, isProcessing, previousScan, scan, scanCount, scanObjId, scanResults, setCurrentScan, setIsCrawlFinished, setIsCrawlStarted, setIsProcessing, setPreviousScan, setScanConfig, setScanCount, setScanObjId, setScanResults, validatingScan
 */
export const useScan = (querySid = null, options = null) => {
	const [currentScan, setCurrentScan] = useState(null);
	const [isCrawlFinished, setIsCrawlFinished] = useState(true);
	const [isCrawlStarted, setIsCrawlStarted] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [previousScan, setPreviousScan] = useState(null);
	const [scanCount, setScanCount] = useState(0);
	const [scanResults, setScanResults] = useState([]);
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

	// Custom context
	const { setConfig: setScanConfig } = useContext(SiteCrawlerAppContext);

	// Custom hooks
	const selectedSiteRef = useRef(null);

	// Custom variables
	const currentEndpoint =
		querySid !== null && typeof querySid === "number" && querySid > 0
			? SitesApiEndpoint + querySid + ScanSlug + "?" + orderingByNameQuery + sortByFinishedAtDescending
			: null;

	// SWR hook
	const { data: scan, error: errorScan, isValidating: validatingScan } = useMainSWRConfig(currentEndpoint, options);

	// Handle crawl process
	const handleCrawl = async (e) => {
		e.preventDefault();

		// Set `isProcessing` state
		setIsProcessing(true);

		if (selectedSiteRef?.current && selectedSiteRef?.current?.contains(e.target)) {
			const startScanSlug = "/start_scan/";
			let endpoint = `${SitesApiEndpoint + querySid + startScanSlug}`;

			const currentScanResponse = await handlePostMethod(endpoint);
			const currentScanResponseData = currentScanResponse?.data ?? null;
			const currentScanResponseStatus = currentScanResponse?.status ?? null;
			const currentScanResponseMethod = currentScanResponse?.config?.method ?? null;

			if (currentScanResponseData !== null && Math.round(currentScanResponseStatus / 200) === 1) {
				// Set `isCrawlStarted` state
				setIsCrawlStarted(true);

				// Unset `isCrawledFinished` state
				setIsCrawlFinished(false);

				// Show alert message after successful `user` SWR hook fetch
				setScanConfig({
					isScan: true,
					method: currentScanResponseData?.config?.method ?? null,
					status: currentScanResponseData?.status ?? null
				});
			} else {
				// Set `isProcessing` state
				setIsProcessing(false);

				// Unset `isCrawlStarted` state
				setIsCrawlStarted(false);

				// Set `isCrawledFinished` state
				setIsCrawlFinished(true);

				// Show alert message after failed `user` SWR hook fetch
				setScanConfig({
					isScan: true,
					method: currentScanResponseData?.config?.method ?? null,
					status: currentScanResponseData?.status ?? null
				});
			}
		}

		return { isCrawlStarted, isCrawlFinished, isProcessing };
	};

	useMemo(async () => {
		if (errorScan) {
			// Show alert message after failed `user` SWR hook fetch
			errorScan
				? setScanConfig({
						isScan: true,
						method: errorScan?.config?.method ?? null,
						status: errorScan?.status ?? null
				  })
				: null;
		}
	}, [errorScan]);

	useMemo(async () => {
		if (scan?.data) {
			if (scan.data?.count) {
				setScanCount(scan.data.count);
			} else {
				setScanCount(0);
			}

			if (scan.data?.results) {
				setScanResults(scan.data.results);
			} else {
				setScanResults([]);
			}

			let previousScanResult =
				scanResults?.find((result) => result.finished_at !== null && result.force_https !== null) ?? null;
			let currentScanResult =
				scanResults?.find((result) => result.finished_at == null && result.force_https == null) ?? null;

			setCurrentScan(currentScanResult);
			setPreviousScan(previousScanResult);

			if (currentScan !== null) {
				setIsCrawlStarted(true);
				setIsCrawlFinished(false);
			} else {
				setIsCrawlStarted(false);
				setIsCrawlFinished(true);
			}

			if ((currentScan !== null && previousScan !== null) || (currentScan == null && previousScan !== null)) {
				setScanObjId(previousScan?.id);
			} else {
				setScanObjId(currentScan?.id);
			}
		}

		return { scanResults, scanCount, currentScan, previousScan, scanObjId, isCrawlStarted, isCrawlFinished };
	}, [scan, scanResults, scanCount, currentScan, previousScan, scanObjId, isCrawlStarted, isCrawlFinished]);

	return {
		currentScan,
		errorScan,
		handleCrawl,
		isCrawlFinished,
		isCrawlStarted,
		isProcessing,
		previousScan,
		scan,
		scanCount,
		scanObjId,
		scanResults,
		selectedSiteRef,
		setCurrentScan,
		setIsCrawlFinished,
		setIsCrawlStarted,
		setIsProcessing,
		setPreviousScan,
		setScanConfig,
		setScanCount,
		setScanObjId,
		setScanResults,
		validatingScan
	};
};

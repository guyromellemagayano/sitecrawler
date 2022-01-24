import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { handlePostMethod } from "@helpers/handleHttpMethods";
import { useEffect, useRef, useState } from "react";
import { useScan } from "./useScan";

/**
 * Custom React hook for handling realtime crawling processes
 *
 * @param {number} siteId
 * @returns {object} selectedSiteRef, handleCrawl, currentScan, previousScan, scanCount, isCrawlStarted, isCrawlFinished
 */
export const useCrawl = (siteId = null) => {
	const [isCrawlFinished, setIsCrawlFinished] = useState(true);
	const [isCrawlStarted, setIsCrawlStarted] = useState(false);
	const [currentScan, setCurrentScan] = useState(null);
	const [previousScan, setPreviousScan] = useState(null);
	const [scanCount, setScanCount] = useState(null);

	const selectedSiteRef = useRef(null);

	const { scan } = useScan(siteId ?? null);

	const handleMutateCurrentSite = async (endpoint) => {
		const mutateCurrentSiteResponse = await handlePostMethod(endpoint);
		const mutateCurrentSiteResponseStatus = mutateCurrentSiteResponse.status ?? null;

		return mutateCurrentSiteResponseStatus !== null && Math.floor(mutateCurrentSiteResponseStatus / 200) === 1
			? true
			: false;
	};

	const handleCrawl = (e) => {
		const startScanSlug = "/start_scan/";
		let endpoint = `${SitesApiEndpoint + siteId + startScanSlug}`;

		e.preventDefault();

		setIsCrawlStarted(true);
		setIsCrawlFinished(false);

		selectedSiteRef.current && selectedSiteRef.current.contains(e.target) ? handleMutateCurrentSite(endpoint) : null;
	};

	useEffect(() => {
		const handleScan = (scan) => {
			let previousScanResult = scan.results.find((e) => e.finished_at !== null);
			let currentScanResult = scan.results.find((e) => e.finished_at == null);

			setCurrentScan(currentScanResult);
			setPreviousScan(previousScanResult);
			setScanCount(scan.count);
		};

		scan && scan.results ? handleScan(scan) : null;
	}, [scan]);

	useEffect(() => {
		typeof currentScan !== "undefined" && currentScan !== null
			? (() => {
					setIsCrawlStarted(true);
					setIsCrawlFinished(false);
			  })()
			: (() => {
					setIsCrawlStarted(false);
					setIsCrawlFinished(true);
			  })();
	}, [currentScan]);

	return {
		selectedSiteRef,
		handleCrawl,
		currentScan,
		previousScan,
		scanCount,
		isCrawlStarted,
		isCrawlFinished
	};
};

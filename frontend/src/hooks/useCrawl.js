import { SiteApiEndpoint } from "@configs/ApiEndpoints";
import { RevalidationInterval } from "@configs/GlobalValues";
import * as React from "react";
import { usePostMethod } from "./useHttpMethod";
import { useScan } from "./useScan";

/**
 * Custom React hook for handling realtime crawling processes
 *
 * @param {number} siteId
 * @returns {object} selectedSiteRef, handleCrawl, currentScan, previousScan, scanCount, isCrawlStarted, isCrawlFinished
 */
export const useCrawl = (siteId = 0) => {
	const [isCrawlFinished, setIsCrawlFinished] = React.useState(true);
	const [isCrawlStarted, setIsCrawlStarted] = React.useState(false);
	const [currentScan, setCurrentScan] = React.useState(null);
	const [previousScan, setPreviousScan] = React.useState(null);
	const [scanCount, setScanCount] = React.useState(null);

	const selectedSiteRef = React.useRef(null);

	const { scan } = useScan({
		querySid: siteId,
		refreshInterval: RevalidationInterval
	});

	const handleMutateCurrentSite = async (endpoint) => {
		const response = await usePostMethod(endpoint);

		return Math.floor(response.status / 200) === 1 ? true : false;
	};

	const handleCrawl = (e) => {
		let endpoint = `${SiteApiEndpoint + siteId}/start_scan/`;

		e.preventDefault();

		setIsCrawlStarted(true);
		setIsCrawlFinished(false);

		selectedSiteRef.current && selectedSiteRef.current.contains(e.target) ? handleMutateCurrentSite(endpoint) : null;
	};

	React.useEffect(() => {
		const handleScan = (scan) => {
			let previousScanResult = scan.results.find((e) => e.finished_at !== null);
			let currentScanResult = scan.results.find((e) => e.finished_at == null);

			setCurrentScan(currentScanResult);
			setPreviousScan(previousScanResult);
			setScanCount(scan.count);
		};

		scan && scan.results ? handleScan(scan) : null;

		return { currentScan, previousScan, scanCount };
	}, [scan]);

	React.useEffect(() => {
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

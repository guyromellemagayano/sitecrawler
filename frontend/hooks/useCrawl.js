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

	const { scan } = useScan(siteId);

	const handleMutateCurrentSite = async (endpoint) => {};

	const handleCrawl = async (e) => {
		e.preventDefault();

		const startScanSlug = "/start_scan/";
		let endpoint = await `${SitesApiEndpoint + siteId + startScanSlug}`;

		setIsCrawlStarted(true);
		setIsCrawlFinished(false);

		if (selectedSiteRef?.current && selectedSiteRef?.current?.contains(e.target)) {
			const mutateCurrentSiteResponse = await handlePostMethod(endpoint);
			const mutateCurrentSiteResponseStatus = mutateCurrentSiteResponse?.status ?? null;

			return mutateCurrentSiteResponseStatus !== null && Math.floor(mutateCurrentSiteResponseStatus / 100) === 2
				? true
				: false;
		}
	};

	useEffect(() => {
		let isMounted = true;

		(async () => {
			if (!isMounted) return;

			scan?.results
				? (async () => {
						let previousScanResult = scan?.results?.find((e) => e.finished_at !== null) ?? null;
						let currentScanResult = scan?.results?.find((e) => e.finished_at == null) ?? null;

						setCurrentScan(currentScanResult);
						setPreviousScan(previousScanResult);
						setScanCount(scan?.count ?? null);
				  })()
				: null;
		})();

		return () => {
			isMounted = false;
		};
	}, [scan]);

	useEffect(() => {
		let isMounted = true;

		(async () => {
			if (!isMounted) return;

			if (currentScan !== null) {
				setIsCrawlStarted(true);
				setIsCrawlFinished(false);

				return;
			}

			setIsCrawlStarted(false);
			setIsCrawlFinished(true);
		})();

		return () => {
			isMounted = false;
		};
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

// React
import * as React from "react";

// External
import axios from "axios";
import Cookies from "js-cookie";

// Hooks
import { useScan } from "src/hooks/useSite";

// Global axios defaults
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["X-CSRFToken"] = Cookies.get("csrftoken");

const useCrawl = ({ siteId }) => {
	const [isCrawlFinished, setIsCrawlFinished] = React.useState(true);
	const [isCrawlStarted, setIsCrawlStarted] = React.useState(false);
	const [currentScan, setCurrentScan] = React.useState(null);
	const [previousScan, setPreviousScan] = React.useState(null);
	const [scanCount, setScanCount] = React.useState(null);

	const selectedSiteRef = React.useRef(null);

	const scanRefreshInterval = 3000;

	const { scan } = useScan({
		querySid: siteId,
		refreshInterval: scanRefreshInterval
	});

	const handleMutateCurrentSite = async (endpoint) => {
		const response = await axios
			.post(endpoint)
			.then((response) => {
				return response;
			})
			.catch((error) => {
				return error.response;
			});
		const data = await response?.data;

		Math.floor(response?.status / 200) === 1
			? () => {
					data
						? () => {
								return true;
						  }
						: null;
			  }
			: null;
	};

	const handleCrawl = (e) => {
		let endpoint = `/api/site/${siteId}/start_scan/`;

		e?.preventDefault();

		setIsCrawlStarted(true);
		setIsCrawlFinished(false);

		selectedSiteRef.current && selectedSiteRef.current.contains(e?.target)
			? handleMutateCurrentSite(endpoint)
			: null;
	};

	React.useEffect(() => {
		const handleScan = (scan) => {
			let previousScanResult = scan?.results.find(
				(e) => e.finished_at !== null && e.force_https !== null
			);
			let currentScanResult = scan?.results.find(
				(e) => e.finished_at == null && e.force_https == null
			);

			setCurrentScan(currentScanResult);
			setPreviousScan(previousScanResult);
			setScanCount(scan?.count);

			return { currentScan, previousScan, scanCount };
		};

		return scan ? handleScan(scan) : null;
	}, [scan]);

	React.useEffect(() => {
		currentScan !== undefined
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

export default useCrawl;

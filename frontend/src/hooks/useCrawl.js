// React
import * as React from "react";

// External
import PropTypes from "prop-types";

// Hooks
import { useScan, useStats } from "src/hooks/useSite";
import usePostMethod from "src/hooks/usePostMethod";

const useCrawl = ({ siteId }) => {
	const [currentScanObjId, setCurrentScanObjId] = React.useState(0);
	const [isCrawlFinished, setIsCrawlFinished] = React.useState(true);
	const [isCrawlStarted, setIsCrawlStarted] = React.useState(false);
	const [previousScanObjId, setPreviousScanObjId] = React.useState(0);
	const [currentScanResults, setCurrentScanResults] = React.useState([]);

	const selectedSiteRef = React.useRef(null);

	const handleCrawl = async (e) => {
		let endpoint = `/api/site/${siteId}/start_scan/`;

		e.preventDefault();

		if (selectedSiteRef.current && selectedSiteRef.current.contains(e.target)) {
			try {
				const response = await usePostMethod(endpoint);
				const data = await response.data;

				if (Math.floor(response.status / 200) === 1) {
					if (data) {
						setIsCrawlStarted(true);
						setIsCrawlFinished(false);

						return true;
					}
				} else {
					setIsCrawlStarted(false);
					setIsCrawlFinished(true);

					return null;
				}
			} catch (error) {
				setIsCrawlStarted(false);
				setIsCrawlFinished(true);

				return null;
			}
		}
	};

	const { scan: currentScan } = useScan({
		querySid: siteId
	});

	React.useEffect(() => {
		if (currentScan && currentScan !== undefined && Object.keys(currentScan).length > 0) {
			if (currentScan.results && currentScan.results !== undefined && Object.keys(currentScan.results).length > 0) {
				if (currentScan.results.find((e) => e.finished_at == null && e.force_https == null) !== undefined) {
					setCurrentScanResults(currentScan.results.find((e) => e.finished_at == null && e.force_https == null));
				} else {
					setCurrentScanResults(currentScan.results.find((e) => e.finished_at !== null && e.force_https !== null));
				}

				if (currentScan.count && currentScan.count > 1) {
					if (currentScanResults && currentScanResults !== undefined && Object.keys(currentScanResults).length > 0) {
						let previousScan = currentScan.results.find((e) => e.finished_at !== null && e.force_https !== null);

						setPreviousScanObjId(previousScan.id);
					}
				} else {
					if (currentScanResults && currentScanResults !== undefined && Object.keys(currentScanResults).length > 0) {
						setCurrentScanObjId(currentScanResults.id);
					}
				}
			}
		}
	}, [currentScan, currentScanObjId, previousScanObjId, currentScanResults]);

	const { stats: previousStats } = useStats({
		querySid: siteId,
		scanObjId:
			previousScanObjId && previousScanObjId !== undefined && previousScanObjId !== 0 ? previousScanObjId : null
	});

	const { stats: currentStats } = useStats({
		querySid: siteId,
		scanObjId: currentScanObjId && currentScanObjId !== undefined && currentScanObjId !== 0 ? currentScanObjId : null,
		refreshInterval:
			currentScanResults &&
			currentScanResults !== undefined &&
			Object.keys(currentScanResults).length > 0 &&
			currentScanResults.finished_at == null &&
			currentScanResults.force_https == null
				? 1000
				: 0
	});

	React.useEffect(() => {
		console.log(currentStats);
	}, [currentStats]);

	return {
		selectedSiteRef,
		handleCrawl,
		currentScan,
		currentStats,
		previousStats,
		isCrawlStarted,
		isCrawlFinished
	};
};

useCrawl.propTypes = {
	siteId: PropTypes.number
};

export default useCrawl;

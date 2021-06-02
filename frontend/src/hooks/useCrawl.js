// React
import * as React from "react";

// External
import PropTypes from "prop-types";

// Hooks
import { useScan, useStats } from "src/hooks/useSite";
import usePostMethod from "src/hooks/usePostMethod";

const useCrawl = ({ siteId }) => {
	const [currentScanObjId, setCurrentScanObjId] = React.useState(0);
	const [finishedAt, setFinishedAt] = React.useState("");
	const [forceHttps, setForceHttps] = React.useState(false);
	const [isCrawlFinished, setIsCrawlFinished] = React.useState(false);
	const [isCrawlStarted, setIsCrawlStarted] = React.useState(false);
	const [previousScanObjId, setPreviousScanObjId] = React.useState(0);
	const [triggerCrawl, setTriggerCrawl] = React.useState(false);

	let currentScanResults = [];
	let previousScanResults = [];

	const handleCrawl = async () => {
		let endpoint = `/api/site/${siteId}/start_scan/`;

		try {
			const response = await usePostMethod(endpoint);
			const data = await response.data;

			if (Math.floor(response.status / 200) === 1) {
				if (data) {
					return true;
				}
			} else {
				return null;
			}
		} catch (error) {
			return null;
		}
	};

	React.useEffect(() => {
		if (triggerCrawl) {
			setIsCrawlStarted(true);
			setIsCrawlFinished(false);

			handleCrawl();
		} else {
			setIsCrawlStarted(false);
			setIsCrawlFinished(true);
		}
	}, [triggerCrawl, isCrawlStarted, isCrawlFinished]);

	const { scan: currentScan } = useScan({
		querySid: siteId
	});

	React.useEffect(() => {
		if (currentScan && currentScan !== undefined && Object.keys(currentScan).length > 0) {
			if (currentScan.results && currentScan.results !== undefined && Object.keys(currentScan.results).length > 0) {
				currentScanResults = currentScan.results.find((e) => e.finished_at == null && e.force_https == null);
				previousScanResults = currentScan.results.find((e) => e.finished_at !== null && e.force_https !== null);

				if (currentScan.count && currentScan.count > 1) {
					if (previousScanResults && previousScanResults !== undefined && Object.keys(previousScanResults).length > 0) {
						setPreviousScanObjId(previousScanResults.id);
					}

					setFinishedAt(previousScanResults.finished_at);
					setForceHttps(previousScanResults.force_https);
				} else {
					setCurrentScanObjId(currentScanResults.id);
					setFinishedAt(currentScanResults.finished_at);
					setForceHttps(currentScanResults.force_https);
				}

				if (currentScanResults && currentScanResults !== undefined && Object.keys(currentScanResults).length > 0) {
					setIsCrawlStarted(true);
					setIsCrawlFinished(false);
				} else {
					setIsCrawlStarted(false);
					setIsCrawlFinished(true);
				}
			}
		}
	}, [currentScan, currentScanObjId, previousScanObjId]);

	const { stats: previousStats } = useStats({
		querySid: siteId,
		scanObjId:
			previousScanObjId && previousScanObjId !== undefined && previousScanObjId !== 0 ? previousScanObjId : null,
		refreshInterval: 0
	});

	const { stats: currentStats } = useStats({
		querySid: siteId,
		scanObjId: currentScanObjId && currentScanObjId !== undefined && currentScanObjId !== 0 ? currentScanObjId : null,
		refreshInterval: 1000
	});

	React.useEffect(() => {
		if (currentStats && currentStats !== undefined && Object.keys(currentStats).length > 0) {
			if (currentStats.finished_at && currentStats.finished_at !== null) {
				setIsCrawlStarted(false);
				setIsCrawlFinished(true);
			} else {
				setIsCrawlStarted(true);
				setIsCrawlFinished(false);
			}
		}
	}, [currentStats, previousStats, isCrawlStarted, isCrawlFinished]);

	return {
		triggerCrawl,
		setTriggerCrawl,
		finishedAt,
		forceHttps,
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

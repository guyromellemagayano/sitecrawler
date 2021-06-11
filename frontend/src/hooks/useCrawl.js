// React
import * as React from "react";

// External
import PropTypes from "prop-types";

// Hooks
import { useScan } from "src/hooks/useSite";
import usePostMethod from "src/hooks/usePostMethod";

const useCrawl = ({ siteId }) => {
	const [scanObjId, setScanObjId] = React.useState(null);
	const [isCrawlFinished, setIsCrawlFinished] = React.useState(null);
	const [isCrawlStarted, setIsCrawlStarted] = React.useState(null);
	const [scanResult, setScanResult] = React.useState(null);

	const selectedSiteRef = React.useRef(null);

	const { scan: currentScan, mutateScan: mutateCurrentScan } = useScan({
		querySid: siteId
	});

	const handleCrawl = async (e) => {
		let endpoint = `/api/site/${siteId}/start_scan/`;

		e?.preventDefault();

		if (selectedSiteRef?.current && selectedSiteRef?.current.contains(e?.target)) {
			try {
				const response = await usePostMethod(endpoint);
				const data = await response?.data;

				if (Math.floor(response?.status / 200) === 1) {
					if (data) {
						mutateCurrentScan;
						return true;
					}
				} else {
					return null;
				}
			} catch (error) {
				return null;
			}
		}
	};

	React.useEffect(() => {
		let previousScanResult =
			currentScan?.results.find((e) => e?.finished_at !== null && e?.force_https !== null) ?? null;
		let currentScanResult =
			currentScan?.results.find((e) => e?.finished_at == null && e?.force_https == null) ?? previousScanResult;

		setScanResult(currentScanResult);

		currentScan?.count > 1 ? setScanObjId(previousScanResult?.id) : setScanObjId(currentScanResult?.id);
	}, [currentScan, scanResult, scanObjId]);

	React.useEffect(() => {
		if (scanResult?.finished_at == null && scanResult?.force_https == null) {
			setIsCrawlStarted(true);
			setIsCrawlFinished(false);
		} else {
			setIsCrawlStarted(false);
			setIsCrawlFinished(true);
		}
	}, [isCrawlStarted, isCrawlFinished, scanResult]);

	return {
		selectedSiteRef,
		handleCrawl,
		scanResult,
		scanObjId,
		isCrawlStarted,
		isCrawlFinished
	};
};

useCrawl.propTypes = {
	siteId: PropTypes.number
};

export default useCrawl;

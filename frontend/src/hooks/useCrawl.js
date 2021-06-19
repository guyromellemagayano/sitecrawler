// React
import * as React from "react";

// External
import axios from "axios";
import Cookies from "js-cookie";
import PropTypes from "prop-types";

// Hooks
import { useScan } from "src/hooks/useSite";

// Global axios defaults
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["X-CSRFToken"] = Cookies.get("csrftoken");

const useCrawl = ({ siteId }) => {
	const [isCrawlFinished, setIsCrawlFinished] = React.useState(null);
	const [isCrawlStarted, setIsCrawlStarted] = React.useState(null);
	const [scanCount, setScanCount] = React.useState(0);
	const [scanFinishedAt, setScanFinishedAt] = React.useState(null);
	const [scanForceHttps, setScanForceHttps] = React.useState(null);

	const selectedSiteRef = React.useRef(null);

	const { scan } = useScan({
		querySid: siteId
	});

	const handleCrawl = async (e) => {
		let endpoint = `/api/site/${siteId}/start_scan/`;

		e?.preventDefault();

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
									mutateSite;
									return true;
							  }
							: null;
				  }
				: null;
		};

		selectedSiteRef.current && selectedSiteRef.current.contains(e?.target) ? handleMutateCurrentSite(endpoint) : null;
	};

	React.useEffect(() => {
		scan && scan !== undefined
			? () => {
					setScanFinishedAt(scan?.results[0]?.finished_at);
					setScanForceHttps(scan?.results[0]?.force_https);
					setScanCount(scan.count);
			  }
			: null;
	}, [scan, scanFinishedAt, scanForceHttps, scanCount]);

	React.useEffect(() => {
		if (scanFinishedAt == null && scanForceHttps == null) {
			setIsCrawlStarted(true);
			setIsCrawlFinished(false);
		} else {
			setIsCrawlStarted(false);
			setIsCrawlFinished(true);
		}
	}, [isCrawlStarted, isCrawlFinished, scanFinishedAt, scanForceHttps]);

	return {
		selectedSiteRef,
		handleCrawl,
		scanCount,
		scanFinishedAt,
		scanForceHttps,
		isCrawlStarted,
		isCrawlFinished
	};
};

useCrawl.propTypes = {
	siteId: PropTypes.number
};

export default useCrawl;

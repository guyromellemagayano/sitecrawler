import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { orderingByNameQuery, RevalidationInterval, sortByFinishedAtDescending } from "@constants/GlobalValues";
import { ScanSlug } from "@constants/PageLinks";
import { useScan } from "@hooks/useScan";
import { useSiteSelection } from "@hooks/useSiteSelection";
import { useStats } from "@hooks/useStats";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import dayjs from "dayjs";
import useTranslation from "next-translate/useTranslation";
import PropTypes from "prop-types";
import { memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the `SiteList` component
 *
 * @param {object} data
 */
const SiteList = ({ data = null }) => {
	// Site data props
	const siteId = data?.id ?? null;
	const siteName = data?.name ?? null;
	const siteUrl = data?.url ?? null;
	const siteVerificationId = data?.verification_id ?? null;
	const siteVerified = data?.verified ?? null;
	const siteLastFinishedScanId = data?.last_finished_scan_id ?? null;

	// Translations
	const { t } = useTranslation();
	const notYetCrawledText = t("sites:notYetCrawled");

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
	const { isComponentReady } = useContext(SiteCrawlerAppContext);

	// Custom hooks
	const { handleSiteSelectOnClick } = useSiteSelection();

	// Custom `scan` API endpoint
	let customScanApiEndpointQuery = "?" + orderingByNameQuery + sortByFinishedAtDescending;
	const customScanApiEndpoint = SitesApiEndpoint + siteId + ScanSlug;
	const fullCustomScanApiEndpoint = customScanApiEndpoint + customScanApiEndpointQuery;

	// `scan` SWR hooks
	const { scan, isCrawlStarted, isCrawlFinished, scanObjId } = useScan(fullCustomScanApiEndpoint, {
		refreshInterval: RevalidationInterval
	});

	// Custom `stats` API endpoint
	const customStatsApiEndpoint = siteLastFinishedScanId ? customScanApiEndpoint + siteLastFinishedScanId + "/" : null;

	// `stats` SWR hooks
	const { stats } = useStats(customStatsApiEndpoint, {
		refreshInterval: RevalidationInterval
	});

	// Custom variables
	const scanCount = scan?.data?.count ?? 0;
	const totalImages = stats?.data?.num_images ?? 0;
	const totalLinks = stats?.data?.num_links ?? 0;
	const totalPages = stats?.data?.num_pages ?? 0;

	return isComponentReady ? (
		<li id={`listbox-item-${siteId}`}>
			<button
				disabled={scanCount === 0}
				aria-disabled={scanCount === 0}
				aria-hidden={scanCount === 0}
				className={classnames(
					"relative block w-full select-none py-2 pl-3 pr-9 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none",
					totalLinks > 0 ||
						totalPages > 0 ||
						totalImages > 0 ||
						(siteVerified && scanCount > 0) ||
						(!siteVerified && scanCount > 0)
						? "cursor-pointer"
						: "cursor-not-allowed"
				)}
				onClick={(e) => handleSiteSelectOnClick(siteId)}
			>
				<div className="flex items-center space-x-3">
					<span
						aria-label={
							siteVerified && !isCrawlStarted && isCrawlFinished
								? "Verified"
								: siteVerified && isCrawlStarted && !isCrawlFinished
								? "Crawling in Process"
								: "Not Verified"
						}
						className={classnames(
							"inline-block h-2 w-2 flex-shrink-0 rounded-full",
							siteVerified && !isCrawlStarted && isCrawlFinished
								? "bg-green-400"
								: siteVerified && isCrawlStarted && !isCrawlFinished
								? "bg-yellow-400"
								: "bg-red-400"
						)}
					/>

					<span
						className={classnames(
							"block truncate font-medium",
							siteVerified && scanCount > 0 ? "text-gray-500" : "text-gray-400"
						)}
					>
						{siteName}
					</span>
				</div>
			</button>
		</li>
	) : (
		<li>
			<span className="relative block w-full select-none py-2 pl-3 pr-9">
				<div className="flex items-center space-x-3">
					<Skeleton circle={true} duration={2} width={10} height={10} tw="inline-block h-2 w-2 flex-shrink-0" />
					<Skeleton duration={2} width={130} className="block" />
				</div>
			</span>
		</li>
	);
};

SiteList.propTypes = {
	data: PropTypes.shape({
		id: PropTypes.number,
		last_finished_scan_id: PropTypes.number,
		name: PropTypes.string,
		url: PropTypes.string,
		verification_id: PropTypes.string,
		verified: PropTypes.bool
	})
};

/**
 * Memoized custom `SiteList` component
 */
export const MemoizedSiteList = memo(SiteList);

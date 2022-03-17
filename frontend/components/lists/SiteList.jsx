import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { orderingByNameQuery, RevalidationInterval, sortByFinishedAtDescending } from "@constants/GlobalValues";
import { DashboardSitesLink, ScanSlug, SiteOverviewSlug } from "@constants/PageLinks";
import { useScan } from "@hooks/useScan";
import { useStats } from "@hooks/useStats";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import dayjs from "dayjs";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import PropTypes from "prop-types";
import { memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the `SiteList` component
 *
 * @param {object} data
 * @param {function} handleSiteSelectOnClick
 */
const SiteList = ({ data = null, handleSiteSelectOnClick }) => {
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
	const { isComponentReady, isUserReady } = useContext(SiteCrawlerAppContext);

	// Custom `scan` API endpoint
	let customScanApiEndpointQuery = "?" + orderingByNameQuery + sortByFinishedAtDescending;
	const customScanApiEndpoint = SitesApiEndpoint + siteId + ScanSlug;
	const fullCustomScanApiEndpoint = customScanApiEndpoint + customScanApiEndpointQuery;

	// SWR hooks
	const { scan, currentScan, previousScan, scanObjId } = useScan(fullCustomScanApiEndpoint, siteId, {
		refreshInterval: RevalidationInterval
	});

	// Custom `stats` API endpoint
	const customStatsApiEndpoint = scanObjId ? customScanApiEndpoint + scanObjId : null;

	const { totalImages, totalLinks, totalPages } = useStats(customStatsApiEndpoint, {
		refreshInterval: RevalidationInterval
	});

	// Custom variables
	const scanCount = scan?.data?.count ?? null;

	return isComponentReady ? (
		<li id={`listbox-item-${siteId}`}>
			<Link href={scanCount > 0 ? `${DashboardSitesLink + siteId + SiteOverviewSlug}` : "/"} passHref>
				<a
					className={classnames(
						"relative block w-full select-none py-2 pl-3 pr-9 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none",
						totalLinks > 0 || totalPages > 0 || totalImages > 0 || siteVerified || (!siteVerified && scanCount > 0)
							? "cursor-pointer"
							: "cursor-not-allowed"
					)}
				>
					<div className="flex items-center space-x-3">
						<span
							aria-label={
								siteVerified && !currentScan
									? "Verified"
									: siteVerified && currentScan
									? "Recrawling in Process"
									: "Not Verified"
							}
							className={classnames(
								"inline-block h-2 w-2 flex-shrink-0 rounded-full",
								siteVerified && !currentScan
									? "bg-green-400"
									: siteVerified && currentScan
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
				</a>
			</Link>
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

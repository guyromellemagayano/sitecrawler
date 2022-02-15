import { DashboardSitesLink, SiteOverviewSlug } from "@constants/PageLinks";
import { useScan } from "@hooks/useScan";
import { useStats } from "@hooks/useStats";
import dayjs from "dayjs";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import PropTypes from "prop-types";
import { memo } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import tw from "twin.macro";

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

	// SWR hooks
	const { scan, setScanConfig, currentScan, previousScan, scanObjId, scanCount, validatingScan } = useScan(siteId);

	// SWR hooks
	const { stats, errorStats } = useStats(siteId, scanObjId);

	return validatingScan ? (
		<li>
			<div tw="cursor-default w-full select-none block relative py-2 pl-3 pr-9">
				<div tw="flex items-center space-x-3">
					<Skeleton circle={true} duration={2} width={10} height={10} tw="relative top-0.5" />

					<span tw="block">
						<Skeleton duration={2} width={130} />
					</span>
				</div>
			</div>
		</li>
	) : (
		<li
			id={`listbox-item-${siteId}`}
			role="option"
			aria-selected={
				scanCount > 0 && (stats?.data?.num_links > 0 || stats?.data?.num_pages > 0 || stats?.data?.num_images > 0)
					? true
					: false
			}
		>
			<Link
				href={
					scanCount > 0
						? {
								pathname: `${DashboardSitesLink}[siteId]${SiteOverviewSlug}`,
								query: {
									siteId: siteId
								}
						  }
						: {}
				}
				passHref
				replace
			>
				<a
					css={[
						tw`w-full select-none block relative py-2 pl-3 pr-9 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900`,
						stats?.data?.num_links > 0 ||
						stats?.data?.num_pages > 0 ||
						stats?.data?.num_images > 0 ||
						siteVerified ||
						(!siteVerified && scanCount > 0)
							? tw`cursor-pointer`
							: tw`cursor-not-allowed`
					]}
				>
					<div tw="flex items-center space-x-3">
						<span
							aria-label={
								siteVerified && currentScan == null
									? "Verified"
									: siteVerified && currentScan !== null
									? "Recrawling in Process"
									: "Not Verified"
							}
							css={[
								tw`flex-shrink-0 inline-block h-2 w-2 rounded-full`,
								siteVerified && currentScan == null
									? tw`bg-green-400`
									: siteVerified && currentScan !== null
									? tw`bg-yellow-400`
									: tw`bg-red-400`
							]}
						/>

						<span
							css={[
								tw`font-medium block truncate`,
								siteVerified && scanCount > 0 ? tw`text-gray-500` : tw`text-gray-400`
							]}
						>
							{data.name}
						</span>
					</div>
				</a>
			</Link>
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

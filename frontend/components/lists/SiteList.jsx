import { DashboardSitesLink, SiteOverviewSlug } from "@constants/PageLinks";
import { useNotificationMessage } from "@hooks/useNotificationMessage";
import { useScan } from "@hooks/useScan";
import { useStats } from "@hooks/useStats";
import dayjs from "dayjs";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import PropTypes from "prop-types";
import { memo, useMemo, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import tw from "twin.macro";

/**
 * Custom function to render the `SiteList` component
 *
 * @param {object} data
 */
const SiteList = ({ data = null }) => {
	const [scanFinishedAt, setScanFinishedAt] = useState(undefined);
	const [scanForceHttps, setScanForceHttps] = useState(undefined);
	const [scanCount, setScanCount] = useState(null);
	const [scanObjId, setScanObjId] = useState(null);

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

	// Custom hooks
	const { state, setConfig } = useNotificationMessage();

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
	const { scan, errorScan } = useScan(siteId);

	// Handle `scan` object id data
	useMemo(() => {
		let isMounted = true;

		// Update `scanCount`, `scanFinishedAt`, `scanForceHttps` and `scanObjId` states
		(async () => {
			if (!isMounted) return;

			// Show alert message after failed `user` SWR hook fetch
			errorScan
				? setConfig({
						isSites: true,
						method: errorScan?.config?.method ?? null,
						status: errorScan?.status ?? null
				  })
				: null;

			if (scan?.data) {
				const currentScanCount = scan.data?.count ?? null;

				if (currentScanCount > 0) {
					scan.data?.results?.find((result) => {
						if (result.id === siteLastFinishedScanId) {
							setScanCount(currentScanCount);
							setScanFinishedAt(dayjs(result.finished_at).calendar(null, calendarStrings));
							setScanForceHttps(result.force_https);
							setScanObjId(result.id);
						}
					});
				} else {
					setScanCount(currentScanCount);
					setScanFinishedAt(notYetCrawledText);
					setScanForceHttps(null);
					setScanObjId(null);
				}
			}

			return { scanCount, scanFinishedAt, scanForceHttps, scanObjId };
		})();

		return () => {
			isMounted = false;
		};
	}, [scan, errorScan]);

	// SWR hooks
	const { stats, errorStats } = useStats(data?.id, scanObjId);

	return !stats && !scan && !data ? (
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
						(scanCount > 0 &&
							(stats?.data?.num_links > 0 || stats?.data?.num_pages > 0 || stats?.data?.num_images > 0)) ||
						(scan && stats)
							? tw`cursor-pointer`
							: tw`cursor-not-allowed`
					]}
				>
					<div tw="flex items-center space-x-3">
						<span
							aria-label={
								data.verified
									? "Verified"
									: scanFinishedAt == null && scanForceHttps == null
									? "Recrawling in Process"
									: "Not Verified"
							}
							css={[
								tw`flex-shrink-0 inline-block h-2 w-2 rounded-full`,
								data.verified
									? tw`bg-green-400`
									: scanFinishedAt == null && scanForceHttps == null
									? tw`bg-yellow-400`
									: tw`bg-red-400`
							]}
						/>

						<span
							css={[
								tw`font-medium block truncate`,
								data.verified && scanCount > 0 ? tw`text-gray-500` : tw`text-gray-400`
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
		name: PropTypes.string,
		verified: PropTypes.bool
	})
};

/**
 * Memoized custom `SiteList` component
 */
export const MemoizedSiteList = memo(SiteList);

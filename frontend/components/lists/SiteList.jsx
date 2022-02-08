import { DashboardSitesLink, SiteOverviewSlug } from "@constants/PageLinks";
import { useNotificationMessage } from "@hooks/useNotificationMessage";
import { useScan } from "@hooks/useScan";
import { useStats } from "@hooks/useStats";
import { handleConversionStringToBoolean, handleConversionStringToNumber } from "@utils/convertCase";
import Link from "next/link";
import PropTypes from "prop-types";
import { memo, useEffect, useState } from "react";
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

	// Custom hooks
	const { state, setConfig } = useNotificationMessage();

	// SWR hooks
	const { scan, errorScan } = useScan(data?.id ?? null);

	// Handle `scan` response
	useEffect(() => {
		if (scan) {
			const currentScanCount = scan.data.count ? handleConversionStringToNumber(scan?.data.count) : null;
			const currentScanFinishedAt = scan.data.results?.[0]?.finished_at ? scan?.data.results[0].finished_at : null;
			const currentScanForcehttps = scan.data.results?.[0]?.force_https
				? handleConversionStringToBoolean(scan?.data.results[0].force_https)
				: null;
			const currentScanObjId =
				currentScanFinishedAt !== null && currentScanForcehttps !== null && currentScanCount > 1
					? scan.data.results?.[1]?.id
						? handleConversionStringToNumber(scan?.data.results[1].id)
						: null
					: scan.data.results?.[0]?.id
					? handleConversionStringToNumber(scan?.data.results[0].id)
					: null;

			setScanFinishedAt(currentScanFinishedAt);
			setScanForceHttps(currentScanForcehttps);
			setScanCount(currentScanCount);
			setScanObjId(currentScanObjId);

			return { scanFinishedAt, scanForceHttps, scanCount, scanObjId };
		} else return;
	}, [scan]);

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
			id={`listbox-item-${data.id}`}
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
									siteId: data.id
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

import { MemoizedAlert } from "@components/alerts";
import { DashboardSitesLink, SiteOverviewSlug } from "@constants/PageLinks";
import { useAlertMessage } from "@hooks/useAlertMessage";
import { useScan } from "@hooks/useScan";
import { useStats } from "@hooks/useStats";
import { handleConversionStringToBoolean, handleConversionStringToNumber } from "@utils/convertCase";
import Link from "next/link";
import PropTypes from "prop-types";
import { memo, useCallback, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import tw from "twin.macro";

/**
 * Custom function to render the `SiteList` component
 *
 * @param {object} data
 */
const SiteList = ({ data = null }) => {
	const [scanFinishedAt, setScanFinishedAt] = useState(null);
	const [scanForceHttps, setScanForceHttps] = useState(null);
	const [scanCount, setScanCount] = useState(null);
	const [scanObjId, setScanObjId] = useState(null);

	// Custom hooks
	const { state, setConfig } = useAlertMessage();

	// SWR hooks
	const { scan, errorScan, validatingScan } = useScan(data?.id ?? null);

	// TODO: Error handling for failed response
	useEffect(() => {
		// Show alert message after failed response is issued
		errorScan?.length > 0
			? setConfig({
					isScan: true,
					method: errorScan?.config?.method ?? null,
					status: errorScan?.status ?? null
			  })
			: null;
	}, [errorScan]);

	// Handle `scan` response
	const handleScanResponse = useCallback(
		async (isMounted) => {
			if (!isMounted) return;

			if (!validatingScan) {
				const scanResponse = scan;
				const scanResponseData = scanResponse?.data ?? null;

				if (scanResponseData !== null && Object.keys(scanResponseData)?.length > 0) {
					const currentScanCount = scanResponseData?.count
						? handleConversionStringToNumber(scanResponseData.count)
						: null;
					const currentScanFinishedAt = scanResponseData?.results?.[0]?.finished_at
						? scanResponseData.results[0].finished_at
						: null;
					const currentScanForcehttps = scanResponseData?.results?.[0]?.force_https
						? handleConversionStringToBoolean(scanResponseData.results[0].force_https)
						: null;
					const currentScanObjId =
						currentScanFinishedAt !== null && currentScanForcehttps !== null && currentScanCount > 1
							? scanResponseData?.results?.[1]?.id
								? handleConversionStringToNumber(scanResponseData.results[1].id)
								: null
							: scanResponseData?.results?.[0]?.id
							? handleConversionStringToNumber(scanResponseData.results[0].id)
							: null;

					setScanFinishedAt(currentScanFinishedAt);
					setScanForceHttps(currentScanForcehttps);
					setScanCount(currentScanCount);
					setScanObjId(currentScanObjId);

					return { scanFinishedAt, scanForceHttps, scanCount, scanObjId };
				} else return;
			} else return;
		},
		[scan]
	);

	useEffect(() => {
		let isMounted = true;

		handleScanResponse(isMounted);

		return () => {
			isMounted = false;
		};
	}, [handleScanResponse]);

	// console.log(data?.id, scanObjId);

	// SWR hooks
	const { stats, errorStats, validatingStats } = useStats(data?.id, scanObjId);

	// TODO: Error handling for failed response
	useEffect(() => {
		// Show alert message after failed response is issued
		errorStats?.length > 0
			? setConfig({
					isStats: true,
					method: errorStats?.config?.method ?? null,
					status: errorStats?.status ?? null
			  })
			: null;
	}, [errorStats]);

	return data !== null && !errorStats ? (
		<>
			{state?.responses !== [] && state?.responses?.length > 0 ? (
				<div tw="fixed right-6 bottom-6 grid grid-flow-row gap-4">
					{state?.responses?.map((value, key) => {
						// Alert Messsages
						const responseText = value?.responseText ?? null;
						const isSuccess = value?.isSuccess ?? null;

						return <MemoizedAlert key={key} responseText={responseText} isSuccess={isSuccess} />;
					}) ?? null}
				</div>
			) : null}

			{!validatingStats && !validatingScan ? (
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
						href={{
							pathname: `${DashboardSitesLink}[siteId]${SiteOverviewSlug}`,
							query: {
								siteId: data.id
							}
						}}
						passHref
						replace
					>
						<a
							css={[
								tw`w-full select-none block relative py-2 pl-3 pr-9 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900`,
								(scanCount > 0 &&
									(stats?.data?.num_links > 0 || stats?.data?.num_pages > 0 || stats?.data?.num_images > 0)) ||
								(!validatingScan && !validatingStats)
									? tw`cursor-pointer`
									: tw`cursor-not-allowed`
							]}
						>
							<div tw="flex items-center space-x-3">
								<span
									aria-label={
										data.verified
											? scanFinishedAt !== null && scanForceHttps !== null
												? "Verified"
												: "Recrawling in Process"
											: "Not Verified"
									}
									css={[
										tw`flex-shrink-0 inline-block h-2 w-2 rounded-full`,
										data.verified
											? scanFinishedAt !== null && scanForceHttps !== null
												? tw`bg-green-400`
												: tw`bg-yellow-400`
											: tw`bg-red-400`
									]}
								/>

								<span
									css={[
										tw`font-medium block truncate`,
										data.verified && scanFinishedAt !== null && scanForceHttps !== null
											? tw`text-gray-500`
											: tw`text-gray-400`
									]}
								>
									{data.name}
								</span>
							</div>
						</a>
					</Link>
				</li>
			) : (
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
			)}
		</>
	) : null;
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

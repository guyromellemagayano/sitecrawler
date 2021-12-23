/* eslint-disable react-hooks/exhaustive-deps */
import { MemoizedAlert } from "@components/alerts";
import { useAlertMessage } from "@hooks/useAlertMessage";
import { useScan } from "@hooks/useScan";
import { useStats } from "@hooks/useStats";
import { memo, useCallback, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import tw from "twin.macro";

/**
 * Custom function to render the `SiteList` component
 */
export function SiteList({ data, handleSiteSelectOnLoad }) {
	const [scanFinishedAt, setScanFinishedAt] = useState(null);
	const [scanForceHttps, setScanForceHttps] = useState(null);
	const [scanCount, setScanCount] = useState(null);
	const [scanObjId, setScanObjId] = useState(null);

	// SWR hooks
	const { scan, errorScan, validatingScan } = useScan(data?.id ?? null);

	// Custom hooks
	const { state, setConfig } = useAlertMessage();

	// Handle site selection
	const handleSiteSelection = useCallback(async () => {
		const siteId = data?.id ?? null;
		const verified = data?.verified ?? null;
		const updatedScanCount = scanCount ?? null;

		if (
			typeof data !== "undefined" &&
			data !== null &&
			Object.keys(data)?.length > 0 &&
			siteId !== null &&
			verified !== null &&
			updatedScanCount !== null
		) {
			handleSiteSelectOnLoad(siteId);
		} else {
			if (updatedScanCount !== null && updatedScanCount > 0) {
				handleSiteSelectOnLoad(siteId);
			}
		}
	}, [data]);

	useEffect(() => {
		handleSiteSelection();
	}, [handleSiteSelection]);

	// Handle `scan` errors
	const handleScanResponse = useCallback(async () => {
		if (!validatingScan) {
			if (!errorScan) {
				const scanResponse = await scan;
				const scanResponseData = scanResponse?.data ?? null;
				const scanResponseStatus = scanResponse?.status ?? null;
				const scanResponseMethod = scanResponse?.config?.method ?? null;

				if (scanResponseData !== null && Math.round(scanResponseStatus / 200) === 1) {
					if (Object.keys(scanResponseData)?.length > 0) {
						const currentScanCount = scanResponseData?.count ?? null;
						const currentScanFinishedAt = scanResponseData?.results[0]?.finished_at ?? null;
						const currentScanForcehttps = scanResponseData?.results[0]?.force_https ?? null;
						const currentScanObjId =
							currentScanFinishedAt !== null && currentScanForcehttps !== null && currentScanCount > 1
								? scanResponseData?.results?.[1]?.id ?? null
								: scanResponseData?.results?.[0]?.id ?? null;

						setScanFinishedAt(currentScanFinishedAt);
						setScanForceHttps(currentScanForcehttps);
						setScanCount(currentScanCount);
						setScanObjId(currentScanObjId);

						// Show alert message after successful 200 OK or 201 Created response is issued
						setConfig({
							isScan: true,
							method: scanResponseMethod,
							status: scanResponseStatus
						});
					}
				} else {
					// Show alert message after failed response is issued
					setConfig({
						isScan: true,
						method: scanResponseMethod,
						status: scanResponseStatus
					});
				}
			}
		}
	}, [scan, errorScan, validatingScan]);

	useEffect(() => {
		handleScanResponse();
	}, [handleScanResponse]);

	// SWR hooks
	const { stats, errorStats, validatingStats } = useStats(data?.id, scanObjId);

	// Handle `stats` errors
	const handleStatsResponse = useCallback(async () => {
		if (!validatingStats) {
			if (!errorStats) {
				const statsResponse = await stats;
				const statsResponseData = statsResponse?.data ?? null;
				const statsResponseStatus = statsResponse?.status ?? null;
				const statsResponseMethod = statsResponse?.config?.method ?? null;

				if (statsResponseData !== null && Math.round(statsResponseStatus / 200) === 1) {
					if (Object.keys(statsResponseData)?.length > 0) {
						const currentStatsCount = statsResponseData?.count ?? null;
						const currentStatsFinishedAt = statsResponseData?.results[0]?.finished_at ?? null;
						const currentStatsForcehttps = statsResponseData?.results[0]?.force_https ?? null;
						const currentStatsObjId =
							currentStatsFinishedAt !== null && currentStatsForcehttps !== null && currentStatsCount > 1
								? statsResponseData?.results?.[1]?.id ?? null
								: statsResponseData?.results?.[0]?.id ?? null;

						setScanFinishedAt(currentStatsFinishedAt);
						setScanForceHttps(currentStatsForcehttps);
						setScanCount(currentStatsCount);
						setScanObjId(currentStatsObjId);

						// Show alert message after successful 200 OK or 201 Created response is issued
						setConfig({
							isStats: true,
							method: statsResponseMethod,
							status: statsResponseStatus
						});
					}
				} else {
					// Show alert message after failed response is issued
					setConfig({
						isStats: true,
						method: statsResponseMethod,
						status: statsResponseStatus
					});
				}
			}
		}
	}, [stats, errorStats, validatingStats]);

	useEffect(() => {
		handleStatsResponse();
	}, [handleStatsResponse]);

	return (
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

			<li
				id={`listbox-item-${data?.id}`}
				role="option"
				aria-selected={
					scanCount > 0 && (stats.num_links > 0 || stats.num_pages > 0 || stats.num_images > 0) ? true : false
				}
			>
				<button
					css={[
						tw`select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900`,
						scanCount > 0 && (stats.num_links > 0 || stats.num_pages > 0 || stats.num_images > 0)
							? tw`cursor-pointer`
							: tw`cursor-not-allowed`
					]}
					onClick={() => {
						scanCount > 0 && (stats.num_links > 0 || stats.num_pages > 0 || stats.num_images > 0)
							? handleSiteSelection(data?.id, data?.verified, scanCount)
							: null;
					}}
				>
					<div tw="flex items-center space-x-3">
						{!validatingStats ? (
							<span
								aria-label={
									data?.verified
										? scanFinishedAt == null && scanForceHttps == null
											? "Recrawling in Process"
											: "Verified"
										: "Not Verified"
								}
								css={[
									tw`flex-shrink-0 inline-block h-2 w-2 rounded-full`,
									data?.verified
										? scanFinishedAt == null && scanForceHttps == null
											? tw`bg-yellow-400`
											: tw`bg-green-400`
										: tw`bg-red-400`
								]}
							/>
						) : (
							<Skeleton circle={true} duration={2} width={10} height={10} tw="relative top-0.5" />
						)}

						<span
							css={[
								tw`font-medium block truncate`,
								!data?.verified && scanFinishedAt == null && scanForceHttps == null
									? tw`text-gray-400`
									: tw`text-gray-500`
							]}
						>
							{!validatingStats ? data?.name : <Skeleton duration={2} width={130} />}
						</span>
					</div>
				</button>
			</li>
		</>
	);
}

export const MemoizedSiteList = memo(SiteList);

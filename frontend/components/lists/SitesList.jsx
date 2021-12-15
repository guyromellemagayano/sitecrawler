/* eslint-disable react-hooks/exhaustive-deps */
import { MemoizedAlert } from "@components/alerts";
import { useScan } from "@hooks/useScan";
import { useSites } from "@hooks/useSites";
import { useStats } from "@hooks/useStats";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo, useCallback, useEffect, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import tw from "twin.macro";

/**
 * Custom function to render the `SiteList` component
 */
export function SiteList({ data = null, handleSiteSelectOnLoad }) {
	const [scanFinishedAt, setScanFinishedAt] = useState(null);
	const [scanForceHttps, setScanForceHttps] = useState(null);
	const [scanCount, setScanCount] = useState(null);
	const [scanObjId, setScanObjId] = useState(null);
	const [errorMessage, setErrorMessage] = useState([]);

	// Router
	const { asPath } = useRouter();

	// SWR hooks
	const { scan, errorScan, validatingScan } = useScan(data?.id ?? null);

	// Custom functions
	const handleSiteSelection = async (siteId, verified, scanCount) => {
		return verified
			? handleSiteSelectOnLoad(siteId)
			: (() => {
					scanCount > 0 ? handleSiteSelectOnLoad(siteId) : false;
			  })();
	};

	// Translations
	const { t } = useTranslation("alerts");
	const scanBadGatewayGetError = t("scanBadGatewayGetError", { site: data?.name ?? null });
	const scanBadRequestGetError = t("scanBadRequestGetError", { site: data?.name ?? null });
	const scanForbiddenGetError = t("scanForbiddenGetError", { site: data?.name ?? null });
	const scanGatewayTimeoutGetError = t("scanGatewayTimeoutGetError", { site: data?.name ?? null });
	const scanInternalServerGetError = t("scanInternalServerGetError", { site: data?.name ?? null });
	const scanNotFoundGetError = t("scanNotFoundGetError", { site: data?.name ?? null });
	const scanServiceUnavailableGetError = t("scanServiceUnavailableGetError", { site: data?.name ?? null });
	const scanTooManyRequestsError = t("scanTooManyRequestsError", { site: data?.name ?? null });
	const scanUnknownError = t("scanUnknownError", { site: data?.name ?? null });
	const statsBadGatewayGetError = t("statsBadGatewayGetError", { site: data?.name ?? null });
	const statsBadRequestGetError = t("statsBadRequestGetError", { site: data?.name ?? null });
	const statsForbiddenGetError = t("statsForbiddenGetError", { site: data?.name ?? null });
	const statsGatewayTimeoutGetError = t("statsGatewayTimeoutGetError", { site: data?.name ?? null });
	const statsInternalServerGetError = t("statsInternalServerGetError", { site: data?.name ?? null });
	const statsNotFoundGetError = t("statsNotFoundGetError", { site: data?.name ?? null });
	const statsServiceUnavailableGetError = t("statsServiceUnavailableGetError", { site: data?.name ?? null });
	const statsTooManyRequestsError = t("statsTooManyRequestsError", { site: data?.name ?? null });
	const statsUnknownError = t("statsUnknownError", { site: data?.name ?? null });

	// Handle `scan` errors
	const handleScanErrors = useCallback(async () => {
		const errorScanStatus = errorScan?.status ?? null;

		if (!validatingScan) {
			if (typeof scan !== "undefined" && scan !== null && Object.keys(scan).length > 0) {
				const currentScanCount = scan.count;
				const currentScanFinishedAt = scan.results[0]?.finished_at ?? null;
				const currentScanForcehttps = scan.results[0]?.force_https ?? null;
				const currentScanObjId =
					currentScanFinishedAt !== null && currentScanForcehttps !== null && currentScanCount > 1
						? scan.results[1].id
						: scan.results[0].id;

				setScanFinishedAt(currentScanFinishedAt);
				setScanForceHttps(currentScanForcehttps);
				setScanCount(currentScanCount);
				setScanObjId(currentScanObjId);
			} else {
				let errorStatusCodeMessage = "";

				switch (errorScanStatus) {
					case 400:
						errorStatusCodeMessage = scanBadRequestGetError;
						break;
					case 403:
						errorStatusCodeMessage = scanForbiddenGetError;
						break;
					case 404:
						errorStatusCodeMessage = scanNotFoundGetError;
						break;
					case 408:
						errorStatusCodeMessage = scanGatewayTimeoutGetError;
						break;
					case 500:
						errorStatusCodeMessage = scanInternalServerGetError;
						break;
					case 502:
						errorStatusCodeMessage = scanBadGatewayGetError;
						break;
					case 503:
						errorStatusCodeMessage = scanServiceUnavailableGetError;
						break;
					case 504:
						errorStatusCodeMessage = scanGatewayTimeoutGetError;
						break;
					case 429:
						errorStatusCodeMessage = scanTooManyRequestsError;
						break;
					default:
						errorStatusCodeMessage = scanUnknownError;
						break;
				}

				setErrorMessage((prevState) => [
					...prevState,
					prevState.indexOf(errorStatusCodeMessage) !== -1
						? prevState.find((prevState) => prevState === errorStatusCodeMessage)
						: errorStatusCodeMessage
				]);
			}
		}
	}, [scan, errorScan, validatingScan]);

	useEffect(() => {
		handleScanErrors();
	}, [handleScanErrors]);

	// SWR hooks
	const { stats, errorStats, validatingStats } = useStats(data?.id, scanObjId);

	// Handle `stats` errors
	const handleStatsErrors = useCallback(async () => {
		const errorStatsStatus = errorStats?.status ?? null;

		if (!validatingStats) {
			if (typeof stats === "undefined" && stats == null && !(Object.keys(stats).length > 0)) {
				let errorStatusCodeMessage = "";

				switch (errorStatsStatus) {
					case 400:
						errorStatusCodeMessage = statsBadRequestGetError;
						break;
					case 403:
						errorStatusCodeMessage = statsForbiddenGetError;
						break;
					case 404:
						errorStatusCodeMessage = statsNotFoundGetError;
						break;
					case 408:
						errorStatusCodeMessage = statsGatewayTimeoutGetError;
						break;
					case 500:
						errorStatusCodeMessage = statsInternalServerGetError;
						break;
					case 502:
						errorStatusCodeMessage = statsBadGatewayGetError;
						break;
					case 503:
						errorStatusCodeMessage = statsServiceUnavailableGetError;
						break;
					case 504:
						errorStatusCodeMessage = statsGatewayTimeoutGetError;
						break;
					case 429:
						errorStatusCodeMessage = statsTooManyRequestsError;
						break;
					default:
						errorStatusCodeMessage = statsUnknownError;
						break;
				}

				setErrorMessage((prevState) => [
					...prevState,
					prevState.indexOf(errorStatusCodeMessage) !== -1
						? prevState.find((prevState) => prevState === errorStatusCodeMessage)
						: errorStatusCodeMessage
				]);
			}
		}
	}, [stats, errorStats, validatingStats]);

	useEffect(() => {
		handleStatsErrors();
	}, [handleStatsErrors]);

	return (
		<>
			{errorMessage !== [] && errorMessage.length > 0 ? (
				<div tw="fixed right-6 bottom-6 grid grid-flow-row gap-4">
					{errorMessage.map((value, key) => (
						<MemoizedAlert key={key} message={value} isError />
					))}
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

SiteList.propTypes = {
	data: PropTypes.shape({
		id: PropTypes.number,
		name: PropTypes.string,
		verified: PropTypes.bool
	}),
	handleSiteSelectOnLoad: PropTypes.func
};

/**
 * Custom function to render the `SitesList` component
 */
export function SitesList(handleSiteSelectOnLoad) {
	// SWR hooks
	const { sites, errorSites, validatingSites } = useSites();

	// Translations
	const { t } = useTranslation("alerts");
	const siteBadGatewayGetError = t("siteBadGatewayGetError");
	const siteBadRequestGetError = t("siteBadRequestGetError");
	const siteForbiddenGetError = t("siteForbiddenGetError");
	const siteGatewayTimeoutGetError = t("siteGatewayTimeoutGetError");
	const siteInternalServerGetError = t("siteInternalServerGetError");
	const siteNotFoundGetError = t("siteNotFoundGetError");
	const siteServiceUnavailableGetError = t("siteServiceUnavailableGetError");
	const siteTooManyRequestsError = t("siteTooManyRequestsError");
	const siteUnknownError = t("siteUnknownError");

	// Handle site selection errors
	const handleSiteSelectError = useCallback(async () => {
		const errorSitesStatus = errorSites?.status ?? null;

		if (!validatingSites) {
			if (typeof sites === "undefined" && sites == null && !(Object.keys(sites).length > 0)) {
				let errorStatusCodeMessage = "";

				switch (errorSitesStatus) {
					case 400:
						errorStatusCodeMessage = siteBadRequestGetError;
						break;
					case 403:
						errorStatusCodeMessage = siteForbiddenGetError;
						break;
					case 404:
						errorStatusCodeMessage = siteNotFoundGetError;
						break;
					case 408:
						errorStatusCodeMessage = siteGatewayTimeoutGetError;
						break;
					case 500:
						errorStatusCodeMessage = siteInternalServerGetError;
						break;
					case 502:
						errorStatusCodeMessage = siteBadGatewayGetError;
						break;
					case 503:
						errorStatusCodeMessage = siteServiceUnavailableGetError;
						break;
					case 504:
						errorStatusCodeMessage = siteGatewayTimeoutGetError;
						break;
					case 429:
						errorStatusCodeMessage = siteTooManyRequestsError;
						break;
					default:
						errorStatusCodeMessage = siteUnknownError;
						break;
				}

				setErrorMessage((prevState) => [
					...prevState,
					prevState.indexOf(errorStatusCodeMessage) !== -1
						? prevState.find((prevState) => prevState === errorStatusCodeMessage)
						: errorStatusCodeMessage
				]);
			}
		}
	}, [sites, validatingSites]);

	useEffect(() => {
		handleSiteSelectError();
	}, [handleSiteSelectError]);

	return !validatingSites ? (
		typeof sites !== "undefined" && sites !== null && Object.keys(sites).length > 0 ? (
			sites?.results && sites?.results?.length > 0 ? (
				<ul
					tabIndex="-1"
					role="listbox"
					aria-labelledby="listbox-label"
					tw="pt-2 h-48 text-base leading-6 overflow-auto focus:outline-none sm:text-sm sm:leading-5"
				>
					<Scrollbars universal>
						{sites?.results?.map((value, index) => (
							<SiteList key={index} data={value} handleSiteSelectOnLoad={handleSiteSelectOnLoad} />
						))}
					</Scrollbars>
				</ul>
			) : null
		) : null
	) : null;
}

/**
 * Memoized custom `SitesList` component
 */
export const MemoizedSitesList = memo(SitesList);

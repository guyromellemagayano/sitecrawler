import { MemoizedDeleteSiteModal } from "@components/modals/DeleteSiteModal";
import { MemoizedSiteVerifyModal } from "@components/modals/SiteVerifyModal";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useLoading } from "@hooks/useLoading";
import { useScan } from "@hooks/useScan";
import { useStats } from "@hooks/useStats";
import { SiteCrawlerAppContext } from "@pages/_app";
import dayjs from "dayjs";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import PropTypes from "prop-types";
import { memo, useContext, useMemo, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import tw from "twin.macro";

/**
 * Custom function to render the `DataTable` component
 *
 * @param {object} site
 * @param {boolean} disableLocalTime
 */
const DataTable = ({ disableLocalTime = false, site = null }) => {
	const [scanCount, setScanCount] = useState(null);
	const [scanFinishedAt, setScanFinishedAt] = useState(null);
	const [scanForceHttps, setScanForceHttps] = useState(null);
	const [scanObjId, setScanObjId] = useState(null);
	const [linkErrors, setLinkErrors] = useState(0);
	const [pageErrors, setPageErrors] = useState(0);
	const [imageErrors, setImageErrors] = useState(0);
	const [seoErrors, setSeoErrors] = useState(0);
	const [totalErrors, setTotalErrors] = useState(0);

	// Site data props
	const siteId = site?.id ?? null;
	const siteName = site?.name ?? null;
	const siteUrl = site?.url ?? null;
	const siteVerificationId = site?.verification_id ?? null;
	const siteVerified = site?.verified ?? null;

	// Translations
	const { t } = useTranslation();
	const verifySiteText = t("sites:verifySiteTitle");
	const notYetCrawledText = t("sites:notYetCrawled");
	const visitExternalSiteText = t("sites:visitExternalSite");
	const goToSiteOverviewText = t("sites:goToSiteOverview");
	const deleteText = t("sites:delete");

	// Custom context
	const { setConfig } = useContext(SiteCrawlerAppContext);

	// Custom hooks
	const {
		ref: siteVerifyModalRef,
		isComponentVisible: isSiteVerifyModalVisible,
		setIsComponentVisible: setIsSiteVerifyModalVisible
	} = useComponentVisible(false);
	const {
		ref: siteDeleteModalRef,
		isComponentVisible: isSiteDeleteModalVisible,
		setIsComponentVisible: setIsSiteDeleteModalVisible
	} = useComponentVisible(false);
	const { isComponentReady } = useLoading();

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

	// Site `scan` SWR hook
	const { scan, errorScan, validatingScan } = useScan(siteId);

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

			if (!validatingScan && scan?.data) {
				const currentScanCount = scan.data?.count ?? null;
				const currentScanFinishedAt =
					scan.data?.results?.length > 0
						? scan.data.results.find((result) => {
								if (currentScanCount > 0) {
									if (result.finished_at == null) {
										return result;
									}

									return result;
								}
						  })?.finished_at
						: null;

				const currentScanForceHttps =
					scan.data?.results?.length > 0
						? scan.data.results.find((result) => {
								if (currentScanCount > 0) {
									if (result.force_https == null) {
										return result;
									}

									return result;
								}
						  })?.force_https
						: null;

				const currentScanObjId =
					scan.data?.results?.length > 0
						? scan.data.results.find((result) =>
								result.finished_at !== null && result.force_https !== null
									? result.finished_at === currentScanFinishedAt && result.force_https === currentScanForceHttps
									: result.finished_at == currentScanFinishedAt && result.force_https == currentScanForceHttps
						  )?.id
						: null;

				setScanCount(currentScanCount);
				setScanFinishedAt(currentScanFinishedAt);
				setScanForceHttps(currentScanForceHttps);
				setScanObjId(currentScanObjId);
			}

			return { scanCount, scanFinishedAt, scanForceHttps, scanObjId };
		})();

		return () => {
			isMounted = false;
		};
	}, [scan, errorScan, validatingScan]);

	// Site `stats` SWR hook
	const { stats, errorStats, validatingStats } = useStats(siteId, scanObjId);

	// Handle `stats` object data
	useMemo(() => {
		let isMounted = true;

		(async () => {
			if (!isMounted) return;

			// Show alert message after failed `user` SWR hook fetch
			errorStats
				? setConfig({
						isSites: true,
						method: errorStats?.config?.method ?? null,
						status: errorStats?.status ?? null
				  })
				: null;

			if (!validatingStats && stats?.data) {
				const currentLinkErrors = stats.data?.num_non_ok_links ?? 0;
				const currentPageErrors = stats.data?.num_pages_tls_non_ok ?? 0;
				const currentImageErrors =
					stats.data?.num_non_ok_images ??
					0 + stats.data?.num_images_with_missing_alts ??
					0 + stats.data?.num_images_tls_non_ok ??
					0;
				const currentSeoErrors =
					stats.data?.num_pages_without_title ??
					0 + stats.data?.num_pages_without_description ??
					0 + stats.data?.num_pages_without_h1_first ??
					0 + stats.data?.num_pages_without_h2_first ??
					0;
				const currentTotalErrors = await (currentLinkErrors +
					currentPageErrors +
					currentImageErrors +
					currentSeoErrors);

				setLinkErrors(currentLinkErrors);
				setPageErrors(currentPageErrors);
				setImageErrors(currentImageErrors);
				setSeoErrors(currentSeoErrors);
				setTotalErrors(currentTotalErrors);
			}

			return { linkErrors, pageErrors, imageErrors, seoErrors, totalErrors };
		})();

		return () => {
			isMounted = false;
		};
	}, [stats, errorStats, validatingStats]);

	return (
		<tr>
			<td tw="flex-none px-6 py-4 whitespace-nowrap">
				<MemoizedSiteVerifyModal
					setShowModal={setIsSiteVerifyModalVisible}
					showModal={isSiteVerifyModalVisible}
					siteId={siteId}
					siteName={siteName}
					siteUrl={siteUrl}
					siteVerificationId={siteVerificationId}
					ref={siteVerifyModalRef}
				/>

				<MemoizedDeleteSiteModal
					setShowModal={setIsSiteDeleteModalVisible}
					showModal={isSiteDeleteModalVisible}
					ref={siteDeleteModalRef}
					siteId={siteId}
				/>

				<div tw="flex flex-col items-start">
					<div>
						{!validatingScan && !validatingStats && site ? (
							<>
								{siteVerified ? (
									<span
										aria-label="Verified"
										tw="relative -left-3 flex-shrink-0 inline-block h-2 w-2 rounded-full leading-5 bg-green-400"
									></span>
								) : scanFinishedAt == null && scanForceHttps == null ? (
									<span
										aria-label="Recrawling in Process"
										tw="relative -left-3 flex-shrink-0 inline-block h-2 w-2 rounded-full leading-5 bg-yellow-400"
									></span>
								) : (
									<span
										aria-label="Not Verified"
										tw="relative -left-3 flex-shrink-0 inline-block h-2 w-2 rounded-full leading-5 bg-red-400"
									></span>
								)}

								<div tw="inline-flex flex-col justify-start items-start">
									<span tw="flex items-center justify-start text-sm leading-6 font-semibold text-gray-500">
										<p className="truncate-link">{siteName}</p>
									</span>
									<span tw="flex space-x-2 justify-start text-sm leading-5 text-gray-500">
										{scanCount > 0 ? (
											<Link href="/sites/[siteId]/overview" as={`/sites/${siteId}/overview`} passHref replace>
												<a
													type="button"
													tw="cursor-pointer flex items-center justify-start text-sm focus:outline-none leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150"
												>
													{goToSiteOverviewText}
												</a>
											</Link>
										) : null}
										<a
											href={siteUrl}
											tw="cursor-pointer flex items-center justify-start text-sm focus:outline-none leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150"
											title={visitExternalSiteText}
											target="_blank"
											rel="noreferrer"
										>
											{visitExternalSiteText}
										</a>

										{!siteVerified ? (
											<>
												<button
													type="button"
													css={[
														tw`cursor-pointer flex items-center justify-start text-sm focus:outline-none leading-6 font-semibold text-yellow-600 hover:text-yellow-500 transition ease-in-out duration-150`,
														scanCount > 0 && tw`ml-3`
													]}
													onClick={() => setIsSiteVerifyModalVisible(!isSiteVerifyModalVisible)}
												>
													{verifySiteText}
												</button>
												<button
													type="button"
													tw="cursor-pointer ml-3 flex items-center justify-start text-sm focus:outline-none leading-6 font-semibold text-red-600 hover:text-red-500 transition ease-in-out duration-150"
													onClick={() => setIsSiteDeleteModalVisible(!isSiteDeleteModalVisible)}
												>
													{deleteText}
												</button>
											</>
										) : null}
									</span>
								</div>
							</>
						) : (
							<>
								<span tw="relative -left-3 flex items-start py-2 space-x-3">
									<Skeleton
										duration={2}
										width={9}
										height={9}
										circle={true}
										className="relative -left-3 top-4 flex-shrink-0 block"
									/>
									<div tw="inline-flex flex-col justify-start items-start">
										<Skeleton
											duration={2}
											width={150}
											className="relative -left-3 inline-flex flex-col justify-start items-start"
										/>
										<span tw="flex flex-row justify-start text-sm leading-5 text-gray-500 space-x-3">
											<Skeleton duration={2} width={63} />
											<Skeleton duration={2} width={63} />
											<Skeleton duration={2} width={63} />
											<Skeleton duration={2} width={63} />
										</span>
									</div>
								</span>
							</>
						)}
					</div>
				</div>
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5">
				{!validatingScan && scan?.data?.results ? (
					scan?.data?.results?.length > 0 ? (
						<span tw="space-x-2">
							<span tw="text-sm leading-5 text-gray-500">
								{!disableLocalTime
									? dayjs(
											scanFinishedAt == null && scanForceHttps == null
												? scan.data.results.find(
														(result) => result.finished_at !== scanFinishedAt && result.force_https !== scanForceHttps
												  )?.finished_at
												: scan.data.results.find(
														(result) => result.finished_at === scanFinishedAt && result.force_https === scanForceHttps
												  )?.finished_at
									  ).calendar(null, calendarStrings)
									: dayjs
											.utc(
												scanFinishedAt == null && scanForceHttps == null
													? scan.data.results.find(
															(result) => result.finished_at !== scanFinishedAt && result.force_https !== scanForceHttps
													  )?.finished_at
													: scan.data.results.find(
															(result) => result.finished_at === scanFinishedAt && result.force_https === scanForceHttps
													  )?.finished_at
											)
											.calendar(null, calendarStrings)}
							</span>
							<span tw="text-sm leading-5 font-medium text-gray-500">
								({!disableLocalTime ? dayjs.tz.guess() : "UTC"})
							</span>
						</span>
					) : (
						<span tw="space-x-2">
							<span tw="text-sm leading-5 text-gray-500">{notYetCrawledText}</span>
						</span>
					)
				) : (
					<Skeleton duration={2} width={176.7} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{!validatingStats && totalErrors ? (
					<span css={[totalErrors > 0 ? tw`text-red-500` : tw`text-green-500`]}>{totalErrors}</span>
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{!validatingStats && stats?.data?.num_links ? (
					<Link href="/sites/[siteId]/links" as={`/sites/${siteId}/links`} passHref>
						<a tw="cursor-pointer text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150">
							{stats?.data?.num_links}
						</a>
					</Link>
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{!validatingStats && stats?.data?.num_pages ? (
					<Link href="/sites/[siteId]/pages" as={`/sites/${siteId}/pages`} passHref>
						<a tw="cursor-pointer text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150">
							{stats?.data?.num_pages}
						</a>
					</Link>
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{!validatingStats && stats?.data?.num_images ? (
					<Link href="/sites/[siteId]/images" as={`/sites/${siteId}/images`} passHref>
						<a tw="cursor-pointer text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150">
							{stats?.data?.num_images}
						</a>
					</Link>
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
		</tr>
	);
};

DataTable.propTypes = {
	disableLocalTime: PropTypes.bool,
	site: PropTypes.shape({
		id: PropTypes.number,
		name: PropTypes.string,
		url: PropTypes.string,
		verification_id: PropTypes.string,
		verified: PropTypes.bool
	})
};

/**
 * Memoized custom `DataTable` component
 */
export const MemoizedDataTable = memo(DataTable);

import { MemoizedAlert } from "@components/alerts";
import { MemoizedDeleteSiteModal } from "@components/modals/DeleteSiteModal";
import { MemoizedSiteVerifyModal } from "@components/modals/SiteVerifyModal";
import { useAlertMessage } from "@hooks/useAlertMessage";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useLoading } from "@hooks/useLoading";
import { useScan } from "@hooks/useScan";
import { useStats } from "@hooks/useStats";
import { handleConversionStringToNumber } from "@utils/convertCase";
import dayjs from "dayjs";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useMemo, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import tw from "twin.macro";

/**
 * Custom function to render the `DataTable` component
 */
export const DataTable = ({ disableLocalTime = false, site = null, validatingSites = false }) => {
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
	const deleteSiteText = t("sites:deleteSite.headline");
	const notYetCrawledText = t("sites:notYetCrawled");
	const visitExternalSiteText = t("sites:visitExternalSite");
	const goToSiteOverviewText = t("sites:goToSiteOverview");

	// Custom hooks
	const { isComponentReady } = useLoading();
	const { state, setConfig } = useAlertMessage();
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

	// TODO: Error handling for `scan` SWR hook
	useMemo(() => {
		// Show alert message after failed `scan` SWR hook fetch
		errorScan
			? setConfig({
					isSiteScan: true,
					method: errorScan?.config?.method ?? null,
					status: errorScan?.status ?? null
			  })
			: null;
	}, [errorScan]);

	// Handle `scan` object id data
	useMemo(() => {
		let isMounted = true;

		// Update `scanCount`, `scanFinishedAt`, `scanForceHttps` and `scanObjId` states
		(() => {
			if (!isMounted) return;

			if (!validatingScan) {
				const currentScanCount = scan?.data?.count ?? null;
				const currentScanFinishedAt =
					scan?.data?.results?.length > 0
						? scan.data.results?.find((result) =>
								currentScanCount > 1 ? result.finished_at !== null : result.finished_at == null
						  )?.finished_at ?? null
						: null;

				const currentScanForceHttps =
					scan?.data?.results?.length > 0
						? scan.data.results?.find((result) =>
								currentScanCount > 1 ? result.force_https !== null : result.force_https == null
						  )?.force_https ?? null
						: null;

				const currentScanObjId =
					scan?.data?.results?.length > 0
						? scan.data.results?.find((result) =>
								currentScanFinishedAt !== null && currentScanForceHttps !== null
									? result.finished_at === currentScanFinishedAt && result.force_https === currentScanForceHttps
									: result.finished_at == currentScanFinishedAt && result.force_https == currentScanForceHttps
						  )?.id ?? null
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
	}, [scan, validatingScan]);

	// Site `stats` SWR hook
	const { stats, errorStats, validatingStats } = useStats(siteId, scanObjId);

	// TODO: Error handling for `stats` SWR hook
	useMemo(() => {
		// Show alert message after failed `stats` SWR hook fetch
		errorStats
			? setConfig({
					isSiteStats: true,
					method: errorStats?.config?.method ?? null,
					status: errorStats?.status ?? null
			  })
			: null;
	}, [errorStats]);

	// Handle `stats` object data
	useMemo(() => {
		let isMounted = true;

		(() => {
			if (!isMounted) return;

			if (!validatingStats && stats?.data) {
				const currentLinkErrors = handleConversionStringToNumber(stats?.data?.num_non_ok_links ?? 0);
				const currentPageErrors = handleConversionStringToNumber(stats?.data?.num_pages_tls_non_ok ?? 0);
				const currentImageErrors =
					handleConversionStringToNumber(stats?.data?.num_non_ok_images ?? 0) +
					handleConversionStringToNumber(stats?.data?.num_images_with_missing_alts ?? 0) +
					handleConversionStringToNumber(stats?.data?.num_images_tls_non_ok ?? 0);
				const currentSeoErrors =
					handleConversionStringToNumber(stats?.data?.num_pages_without_title ?? 0) +
					handleConversionStringToNumber(stats?.data?.num_pages_without_description ?? 0) +
					handleConversionStringToNumber(stats?.data?.num_pages_without_h1_first ?? 0) +
					handleConversionStringToNumber(stats?.data?.num_pages_without_h2_first ?? 0);
				const currentTotalErrors = handleConversionStringToNumber(
					currentLinkErrors + currentPageErrors + currentImageErrors + currentSeoErrors
				);

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
	}, [stats, validatingStats]);

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

					<span tw="flex flex-col items-start">
						<span>
							{isComponentReady ? (
								!siteVerified ? (
									<>
										<span
											aria-label="Not Verified"
											tw="relative -left-3 flex-shrink-0 inline-block h-2 w-2 rounded-full leading-5 bg-red-400"
										></span>
										<div tw="inline-flex flex-col justify-start items-start">
											<span tw="flex items-center justify-start text-sm leading-6 font-semibold text-gray-500">
												<p className="truncate-link">{siteName}</p>
											</span>
											<span tw="flex justify-start text-sm leading-5 text-gray-500">
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
													{deleteSiteText}
												</button>
											</span>
										</div>
									</>
								) : (
									<>
										<span
											aria-label="Verified"
											css={[
												tw`relative -left-3 flex-shrink-0 inline-block h-2 w-2 rounded-full`,
												scanFinishedAt == null && scanForceHttps == null ? tw`bg-yellow-400` : tw`bg-green-400`
											]}
										></span>
										<div tw="inline-flex flex-col justify-start items-start">
											{stats?.data?.num_links > 0 || stats?.data?.num_pages > 0 || stats?.data?.num_images > 0 ? (
												<Link href="/sites/[siteId]/overview" as={`/sites/${siteId}/overview`} passHref>
													<a
														className="truncate-link"
														tw="text-sm leading-6 font-semibold text-gray-600 hover:text-gray-500"
														title={siteName}
													>
														{siteName}
													</a>
												</Link>
											) : (
												<span tw="flex items-center justify-start text-sm leading-6 font-semibold text-gray-500">
													<p className="truncate-link">{siteName}</p>
												</span>
											)}

											<span tw="flex justify-start text-sm leading-5">
												<a
													href={siteUrl}
													tw="cursor-pointer flex items-center justify-start text-sm focus:outline-none leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150"
													title={visitExternalSiteText}
													target="_blank"
													rel="noreferrer"
												>
													{visitExternalSiteText}
												</a>
											</span>
										</div>
									</>
								)
							) : (
								<>
									<span tw="flex items-start py-2 space-x-3">
										<Skeleton
											circle={true}
											duration={2}
											width={8}
											height={8}
											className="relative -left-3 flex-shrink-0 inline-block"
										/>
										<div tw="inline-flex flex-col justify-start items-start">
											<Skeleton
												duration={2}
												width={150}
												className="relative -left-3 inline-flex flex-col justify-start items-start"
											/>

											<span tw="flex flex-row justify-start text-sm leading-5 text-gray-500 space-x-3">
												<Skeleton duration={2} width={132.39} />
												<Skeleton duration={2} width={70} />
												<Skeleton duration={2} width={73} />
											</span>
										</div>
									</span>
								</>
							)}
						</span>
					</span>
				</td>
				<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5">
					{isComponentReady && scan?.data?.results ? (
						scan?.data?.results?.length > 0 ? (
							<span tw="space-x-2">
								<span tw="text-sm leading-5 text-gray-500">
									{!disableLocalTime
										? dayjs(
												scanCount > 0 && scanFinishedAt == null && scanForceHttps == null
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
																(result) => result.finished_at == scanFinishedAt && result.force_https == scanForceHttps
														  )?.finished_at
														: scan.data.results.find(
																(result) =>
																	result.finished_at === scanFinishedAt && result.force_https === scanForceHttps
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
					{isComponentReady ? (
						<span css={[totalErrors > 0 ? tw`text-red-500` : tw`text-green-500`]}>{totalErrors}</span>
					) : (
						<Skeleton duration={2} width={45} />
					)}
				</td>
				<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
					{isComponentReady ? (
						<Link href="/sites/[siteId]/links" as={`/sites/${siteId}/links`} passHref>
							<a tw="cursor-pointer text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150">
								{!validatingStats ? (
									stats?.data?.num_links > 0 ? (
										stats.data.num_links
									) : (
										0
									)
								) : (
									<Skeleton duration={2} width={45} />
								)}
							</a>
						</Link>
					) : (
						<Skeleton duration={2} width={45} />
					)}
				</td>
				<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
					{isComponentReady ? (
						<Link href="/sites/[siteId]/pages" as={`/sites/${siteId}/pages`} passHref>
							<a tw="cursor-pointer text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150">
								{!validatingStats ? (
									stats?.data?.num_pages > 0 ? (
										stats.data.num_pages
									) : (
										0
									)
								) : (
									<Skeleton duration={2} width={45} />
								)}
							</a>
						</Link>
					) : (
						<Skeleton duration={2} width={45} />
					)}
				</td>
				<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
					{isComponentReady ? (
						<Link href="/sites/[siteId]/images" as={`/sites/${siteId}/images`} passHref>
							<a tw="cursor-pointer text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150">
								{!validatingStats ? (
									stats?.data?.num_images > 0 ? (
										stats.data.num_images
									) : (
										0
									)
								) : (
									<Skeleton duration={2} width={45} />
								)}
							</a>
						</Link>
					) : (
						<Skeleton duration={2} width={45} />
					)}
				</td>
			</tr>
		</>
	);
};

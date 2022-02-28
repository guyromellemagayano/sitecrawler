import { MemoizedDeleteSiteModal } from "@components/modals/DeleteSiteModal";
import { MemoizedSiteVerifyModal } from "@components/modals/SiteVerifyModal";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useScan } from "@hooks/useScan";
import { useStats } from "@hooks/useStats";
import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import dayjs from "dayjs";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo, useContext, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the `SitesData` component
 *
 * @param {object} site
 */
const SitesData = ({ site = null }) => {
	// Site data props
	const siteId = site?.id ?? null;
	const siteName = site?.name ?? null;
	const siteUrl = site?.url ?? null;
	const siteVerificationId = site?.verification_id ?? null;
	const siteVerified = site?.verified ?? null;
	const siteLastFinishedScanId = site?.last_finished_scan_id ?? null;

	// Translations
	const { t } = useTranslation();
	const verifySiteText = t("sites:verifySiteTitle");
	const notYetCrawledText = t("sites:notYetCrawled");
	const visitExternalSiteText = t("sites:visitExternalSite");
	const goToSiteOverviewText = t("sites:goToSiteOverview");
	const deleteText = t("sites:delete");
	const crawlSiteText = t("sites:crawlSite");
	const siteCrawlingInProcessText = t("sites:siteCrawlingInProcess");

	// Custom context
	const { isComponentReady } = useContext(SiteCrawlerAppContext);

	// Router
	const { prefetch } = useRouter();

	// SWR hooks
	const { user, disableLocalTime, permissions } = useUser();

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
	const {
		scan,
		setScanConfig,
		scanObjId,
		scanCount,
		currentScan,
		previousScan,
		handleCrawl,
		selectedSiteRef,
		scanResults
	} = useScan(siteId);

	// Site `stats` SWR hook
	const { stats, totalErrors, totalImages, totalLinks, totalPages } = useStats(siteId, scanObjId);

	useEffect(() => {
		prefetch(`/dashboard/sites/${siteId}/overview`);
	}, [siteId]);

	return (
		<tr ref={selectedSiteRef}>
			<td className="flex-none whitespace-nowrap p-4">
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

				<div className="flex flex-col items-start">
					<div>
						{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
							<>
								{siteVerified && currentScan == null ? (
									<span
										aria-label="Verified"
										className="relative -left-3 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-green-400 leading-5"
									></span>
								) : siteVerified && currentScan !== null ? (
									<span
										aria-label="Recrawling in Process"
										className="relative -left-3 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-yellow-400 leading-5"
									></span>
								) : (
									<span
										aria-label="Not Verified"
										className="relative -left-3 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-red-400 leading-5"
									></span>
								)}

								<div className="inline-flex flex-col items-start justify-start">
									<span className="flex items-center justify-start text-sm font-semibold leading-6 text-gray-500">
										<p className="truncate-link">{siteName}</p>
									</span>
									<span className="flex justify-start space-x-2 text-sm leading-5 text-gray-500">
										{scanCount > 0 ? (
											<Link
												href="/dashboard/sites/[siteId]/overview"
												as={`/dashboard/sites/${siteId}/overview`}
												passHref
												replace
											>
												<a className="flex cursor-pointer items-center justify-start text-sm font-semibold leading-6 text-indigo-600 transition duration-150 ease-in-out hover:text-indigo-500 focus:outline-none">
													{goToSiteOverviewText}
												</a>
											</Link>
										) : null}
										<a
											href={siteUrl}
											className="flex cursor-pointer items-center justify-start text-sm font-semibold leading-6 text-gray-600 transition duration-150 ease-in-out hover:text-gray-500 focus:outline-none"
											title={visitExternalSiteText}
											target="_blank"
											rel="noreferrer"
										>
											{visitExternalSiteText}
										</a>

										{!siteVerified ? (
											<button
												type="button"
												className={classnames(
													"flex cursor-pointer items-center justify-start text-sm font-semibold leading-6 text-yellow-600 transition duration-150 ease-in-out hover:text-yellow-500 focus:outline-none",
													scanCount > 0 && "ml-3"
												)}
												onClick={() => setIsSiteVerifyModalVisible(!isSiteVerifyModalVisible)}
											>
												{verifySiteText}
											</button>
										) : null}

										{siteVerified && permissions.includes("can_start_scan") ? (
											<button
												type="button"
												className="flex ml-3 cursor-pointer items-center justify-start text-sm font-semibold leading-6 text-green-600 transition duration-150 ease-in-out hover:text-green-500 focus:outline-none"
												onClick={handleCrawl}
											>
												{crawlSiteText}
											</button>
										) : null}

										{permissions.includes("delete_site") ? (
											<button
												type="button"
												className="flex ml-3 cursor-pointer items-center justify-start text-sm font-semibold leading-6 text-red-600 transition duration-150 ease-in-out hover:text-red-500 focus:outline-none"
												onClick={() => setIsSiteDeleteModalVisible(!isSiteDeleteModalVisible)}
											>
												{deleteText}
											</button>
										) : null}
									</span>
								</div>
							</>
						) : (
							<span className="flex items-start space-x-3 py-2">
								<Skeleton
									duration={2}
									width={9}
									height={9}
									circle={true}
									className="relative top-1 block flex-shrink-0"
								/>
								<div className="inline-flex flex-col items-start justify-start">
									<Skeleton
										duration={2}
										width={150}
										className="inline-flex relative flex-col items-start justify-start"
									/>
									<span className="flex flex-row justify-start space-x-3 text-sm leading-5 text-gray-500">
										<Skeleton duration={2} width={63} />
										<Skeleton duration={2} width={63} />
										<Skeleton duration={2} width={63} />
										<Skeleton duration={2} width={63} />
										<Skeleton duration={2} width={63} />
									</span>
								</div>
							</span>
						)}
					</div>
				</div>
			</td>
			<td className="whitespace-nowrap px-6 py-4 text-sm leading-5 text-gray-500">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
					scanResults?.length > 0 ? (
						<span className="space-x-2">
							<span className="text-sm leading-5 text-gray-500">
								{scanCount > 1 ? (
									!disableLocalTime ? (
										dayjs(currentScan !== null ? previousScan?.finished_at : previousScan?.finished_at).calendar(
											null,
											calendarStrings
										)
									) : (
										dayjs
											.utc(currentScan !== null ? previousScan?.finished_at : previousScan?.finished_at)
											.calendar(null, calendarStrings)
									)
								) : scanCount === 1 && currentScan !== null ? (
									<span className="text-sm leading-5 text-gray-500">{siteCrawlingInProcessText}</span>
								) : !disableLocalTime ? (
									dayjs(previousScan?.finished_at).calendar(null, calendarStrings)
								) : (
									dayjs.utc(previousScan?.finished_at).calendar(null, calendarStrings)
								)}
							</span>

							{scanCount > 1 ? (
								<span className="text-sm font-medium leading-5 text-gray-500">
									({!disableLocalTime ? dayjs.tz.guess() : "UTC"})
								</span>
							) : null}
						</span>
					) : (
						<span className="space-x-2">
							<span className="text-sm leading-5 text-gray-500">{notYetCrawledText}</span>
						</span>
					)
				) : (
					<Skeleton duration={2} width={176.7} />
				)}
			</td>
			<td className="whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
					totalErrors > 0 ? (
						<span className="text-red-500">{totalErrors}</span>
					) : (
						<span className="text-green-500">{totalErrors}</span>
					)
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td className="whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
					totalLinks > 0 ? (
						<Link href="/dashboard/sites/[siteId]/links" as={`/dashboard/sites/${siteId}/links`} passHref>
							<a className="cursor-pointer text-sm font-semibold leading-6 text-indigo-600 transition duration-150 ease-in-out hover:text-indigo-500">
								{totalLinks}
							</a>
						</Link>
					) : (
						<span className="text-gray-500">0</span>
					)
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td className="whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
					totalPages > 0 ? (
						<Link href="/dashboard/sites/[siteId]/pages" as={`/dashboard/sites/${siteId}/pages`} passHref>
							<a className="cursor-pointer text-sm font-semibold leading-6 text-indigo-600 transition duration-150 ease-in-out hover:text-indigo-500">
								{totalPages}
							</a>
						</Link>
					) : (
						<span className="text-gray-500">0</span>
					)
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td className="whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
					totalImages > 0 ? (
						<Link href="/dashboard/sites/[siteId]/images" as={`/dashboard/sites/${siteId}/images`} passHref>
							<a className="cursor-pointer text-sm font-semibold leading-6 text-indigo-600 transition duration-150 ease-in-out hover:text-indigo-500">
								{totalImages}
							</a>
						</Link>
					) : (
						<span className="text-gray-500">0</span>
					)
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
		</tr>
	);
};

SitesData.propTypes = {
	site: PropTypes.shape({
		id: PropTypes.number,
		last_finished_scan_id: PropTypes.number,
		name: PropTypes.string,
		url: PropTypes.string,
		verification_id: PropTypes.string,
		verified: PropTypes.bool
	})
};

/**
 * Memoized custom `SitesData` component
 */
export const MemoizedSitesData = memo(SitesData);

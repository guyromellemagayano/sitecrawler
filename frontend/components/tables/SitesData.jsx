import { MemoizedDeleteSiteModal } from "@components/modals/DeleteSiteModal";
import { MemoizedSiteVerifyModal } from "@components/modals/SiteVerifyModal";
import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { orderingByNameQuery, RevalidationInterval, sortByFinishedAtDescending } from "@constants/GlobalValues";
import { ScanSlug } from "@constants/PageLinks";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useScan } from "@hooks/useScan";
import { useStats } from "@hooks/useStats";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import dayjs from "dayjs";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo, useContext, useEffect, useMemo, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the `SitesData` component
 *
 * @param {object} site
 */
const SitesData = ({ site = null }) => {
	const [customStatsApiEndpoint, setCustomStatsApiEndpoint] = useState(null);
	const [customScanApiEndpoint, setCustomScanApiEndpoint] = useState(null);

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

	// Router
	const { prefetch } = useRouter();

	// Custom variables
	let customScanApiEndpointQuery = "?" + orderingByNameQuery + sortByFinishedAtDescending;
	let handleCrawlEndpoint = SitesApiEndpoint + siteId;

	// Custom context
	const { isComponentReady, user } = useContext(SiteCrawlerAppContext);

	// Custom `scan` API endpoint
	useMemo(() => {
		siteId ? setCustomScanApiEndpoint(SitesApiEndpoint + siteId + ScanSlug) : setCustomScanApiEndpoint(null);

		return { customScanApiEndpoint };
	}, [siteId]);

	// SWR hooks
	const { scan, previousScan, isCrawlStarted, isCrawlFinished, handleCrawl, selectedSiteRef } = useScan(
		customScanApiEndpoint,
		{
			refreshInterval: RevalidationInterval
		}
	);

	// Custom `stats` API endpoint state
	useMemo(() => {
		customScanApiEndpoint && siteLastFinishedScanId
			? setCustomStatsApiEndpoint(customScanApiEndpoint + siteLastFinishedScanId)
			: setCustomStatsApiEndpoint(null);

		return { customStatsApiEndpoint };
	}, [customScanApiEndpoint, siteLastFinishedScanId]);

	// `stats` SWR hook
	const { stats } = useStats(customStatsApiEndpoint, {
		refreshInterval: RevalidationInterval
	});

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

	useEffect(() => {
		prefetch(`/dashboard/sites/${siteId}/`);
	}, [siteId]);

	// Custom variables
	const disableLocalTime = user?.data?.settings?.disableLocalTime ?? false;
	const permissions = user?.data?.permissions ?? null;
	const scanCount = scan?.data?.count ?? null;
	const scanResults = scan?.data?.results ?? null;
	const previousScanFinishedAt = previousScan?.finished_at ?? null;
	const totalImages = stats?.data?.num_images;
	const totalLinks = stats?.data?.num_links;
	const totalPages = stats?.data?.num_pages;
	const linkErrors = stats?.data?.num_non_ok_links;
	const pageErrors =
		stats?.data?.num_non_ok_scripts +
		stats?.data?.num_non_ok_stylesheets +
		stats?.data?.num_pages_without_title +
		stats?.data?.num_pages_without_description +
		stats?.data?.num_pages_without_h1_first +
		stats?.data?.num_pages_without_h1_second +
		stats?.data?.num_pages_without_h2_first +
		stats?.data?.num_pages_without_h2_second +
		stats?.data?.num_pages_tls_non_ok +
		stats?.data?.num_pages_duplicated_title +
		stats?.data?.num_pages_duplicated_description;
	const imageErrors =
		stats?.data?.num_non_ok_images + stats?.data?.num_images_with_missing_alts + stats?.data?.num_images_tls_non_ok;
	const totalErrors = linkErrors + pageErrors + imageErrors;

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
					scanObjId={siteLastFinishedScanId}
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
						{isComponentReady ? (
							<>
								{siteVerified ? (
									isCrawlStarted && !isCrawlFinished ? (
										<span
											aria-label="Recrawling in Process"
											className="relative -left-3 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-yellow-400 leading-5"
										></span>
									) : (
										<span
											aria-label="Verified"
											className="relative -left-3 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-green-400 leading-5"
										></span>
									)
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
											<Link href="/dashboard/sites/[siteId]/" as={`/dashboard/sites/${siteId}/`} passHref>
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
												onClick={(e) => setIsSiteVerifyModalVisible(!isSiteVerifyModalVisible)}
											>
												{verifySiteText}
											</button>
										) : null}

										{siteVerified &&
										permissions &&
										permissions?.includes("can_start_scan") &&
										!isCrawlStarted &&
										isCrawlFinished &&
										scanCount > 0 ? (
											<button
												type="button"
												className="ml-3 flex cursor-pointer items-center justify-start text-sm font-semibold leading-6 text-green-600 transition duration-150 ease-in-out hover:text-green-500 focus:outline-none"
												onClick={(e) => handleCrawl(e, handleCrawlEndpoint)}
											>
												{crawlSiteText}
											</button>
										) : null}

										<button
											type="button"
											className="ml-3 flex cursor-pointer items-center justify-start text-sm font-semibold leading-6 text-red-600 transition duration-150 ease-in-out hover:text-red-500 focus:outline-none"
											onClick={(e) => setIsSiteDeleteModalVisible(!isSiteDeleteModalVisible)}
										>
											{deleteText}
										</button>
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
										className="relative inline-flex flex-col items-start justify-start"
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
				{isComponentReady && scanResults?.length > 0 ? (
					<span className="space-x-2">
						<span className="text-sm leading-5 text-gray-500">
							{scanCount > 1 ? (
								!disableLocalTime ? (
									dayjs(previousScanFinishedAt).calendar(null, calendarStrings)
								) : (
									dayjs.utc(previousScanFinishedAt).calendar(null, calendarStrings)
								)
							) : scanCount === 1 && isCrawlStarted && !isCrawlFinished ? (
								<span className="text-sm leading-5 text-gray-500">{siteCrawlingInProcessText}</span>
							) : !disableLocalTime ? (
								dayjs(previousScanFinishedAt).calendar(null, calendarStrings)
							) : (
								dayjs.utc(previousScanFinishedAt).calendar(null, calendarStrings)
							)}
						</span>

						{scanCount > 1 ? (
							<span className="text-sm font-medium leading-5 text-gray-500">
								({!disableLocalTime ? dayjs.tz.guess() : "UTC"})
							</span>
						) : null}
					</span>
				) : isComponentReady && scanResults?.length === 0 ? (
					<span className="space-x-2">
						<span className="text-sm leading-5 text-gray-500">{notYetCrawledText}</span>
					</span>
				) : (
					<Skeleton duration={2} width={176.7} />
				)}
			</td>
			<td className="whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady && totalErrors ? (
					<span className={classnames(totalErrors > 0 ? "text-red-500" : "text-green-500")}>{totalErrors}</span>
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td className="whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady && totalLinks ? (
					<Link href="/dashboard/sites/[siteId]/links" as={`/dashboard/sites/${siteId}/links`} passHref>
						<a className="cursor-pointer text-sm font-semibold leading-6 text-indigo-600 transition duration-150 ease-in-out hover:text-indigo-500">
							{totalLinks}
						</a>
					</Link>
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td className="whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady && totalPages ? (
					<Link href="/dashboard/sites/[siteId]/pages" as={`/dashboard/sites/${siteId}/pages`} passHref>
						<a className="cursor-pointer text-sm font-semibold leading-6 text-indigo-600 transition duration-150 ease-in-out hover:text-indigo-500">
							{totalPages}
						</a>
					</Link>
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td className="whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady && totalImages ? (
					<Link href="/dashboard/sites/[siteId]/images" as={`/dashboard/sites/${siteId}/images`} passHref>
						<a className="cursor-pointer text-sm font-semibold leading-6 text-indigo-600 transition duration-150 ease-in-out hover:text-indigo-500">
							{totalImages}
						</a>
					</Link>
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

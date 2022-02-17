import { MemoizedDeleteSiteModal } from "@components/modals/DeleteSiteModal";
import { MemoizedSiteVerifyModal } from "@components/modals/SiteVerifyModal";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useScan } from "@hooks/useScan";
import { useStats } from "@hooks/useStats";
import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import dayjs from "dayjs";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import PropTypes from "prop-types";
import { memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import tw from "twin.macro";

/**
 * Custom function to render the `DataTable` component
 *
 * @param {object} site
 */
const DataTable = ({ site = null }) => {
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
	const { isComponentReady, setConfig } = useContext(SiteCrawlerAppContext);

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
		scanResults,
		validatingScan
	} = useScan(siteId);

	// Site `stats` SWR hook
	const { stats, linkErrors, pageErrors, imageErrors, seoErrors, totalErrors, validatingStats } = useStats(
		siteId,
		scanObjId
	);

	return (
		<tr ref={selectedSiteRef}>
			<td tw="flex-none p-4 whitespace-nowrap">
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
						{isComponentReady &&
						user &&
						Math.round(user?.status / 100) === 2 &&
						!user?.data?.detail &&
						!validatingScan &&
						scan &&
						Math.round(scan?.status / 100) === 2 &&
						!scan?.data?.detail ? (
							<>
								{siteVerified && currentScan == null ? (
									<span
										aria-label="Verified"
										tw="relative -left-3 flex-shrink-0 inline-block h-2 w-2 rounded-full leading-5 bg-green-400"
									></span>
								) : siteVerified && currentScan !== null ? (
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
											<Link
												href="/dashboard/sites/[siteId]/overview"
												as={`/dashboard/sites/${siteId}/overview`}
												passHref
												replace
											>
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
											tw="cursor-pointer flex items-center justify-start text-sm focus:outline-none leading-6 font-semibold text-gray-600 hover:text-gray-500 transition ease-in-out duration-150"
											title={visitExternalSiteText}
											target="_blank"
											rel="noreferrer"
										>
											{visitExternalSiteText}
										</a>

										{!siteVerified ? (
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
										) : null}

										{siteVerified && permissions?.includes("can_start_scan") ? (
											<button
												type="button"
												tw="cursor-pointer ml-3 flex items-center justify-start text-sm focus:outline-none leading-6 font-semibold text-green-600 hover:text-green-500 transition ease-in-out duration-150"
												onClick={handleCrawl}
											>
												{crawlSiteText}
											</button>
										) : null}

										{permissions?.includes("delete_site") ? (
											<button
												type="button"
												tw="cursor-pointer ml-3 flex items-center justify-start text-sm focus:outline-none leading-6 font-semibold text-red-600 hover:text-red-500 transition ease-in-out duration-150"
												onClick={() => setIsSiteDeleteModalVisible(!isSiteDeleteModalVisible)}
											>
												{deleteText}
											</button>
										) : null}
									</span>
								</div>
							</>
						) : (
							<span tw="relative -left-3 flex items-start py-2 space-x-3">
								<Skeleton
									duration={2}
									width={9}
									height={9}
									circle={true}
									className="relative -left-3 top-4 block flex-shrink-0"
								/>
								<div tw="inline-flex flex-col justify-start items-start">
									<Skeleton
										duration={2}
										width={150}
										className="relative -left-3 inline-flex flex-col items-start justify-start"
									/>
									<span tw="flex flex-row justify-start text-sm leading-5 text-gray-500 space-x-3">
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
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5">
				{isComponentReady &&
				user &&
				Math.round(user?.status / 100) === 2 &&
				!user?.data?.detail &&
				!validatingScan &&
				scan &&
				Math.round(scan?.status / 100) === 2 &&
				!scan?.data?.detail ? (
					scanResults?.length > 0 ? (
						<span tw="space-x-2">
							<span tw="text-sm leading-5 text-gray-500">
								{scanCount > 1 ? (
									disableLocalTime ? (
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
									<span tw="text-sm leading-5 text-gray-500">{siteCrawlingInProcessText}</span>
								) : disableLocalTime ? (
									dayjs(previousScan?.finished_at).calendar(null, calendarStrings)
								) : (
									dayjs.utc(previousScan?.finished_at).calendar(null, calendarStrings)
								)}
							</span>

							{scanCount > 1 ? (
								<span tw="text-sm leading-5 font-medium text-gray-500">
									({disableLocalTime ? dayjs.tz.guess() : "UTC"})
								</span>
							) : null}
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
				{isComponentReady &&
				user &&
				Math.round(user?.status / 100) === 2 &&
				!user?.data?.detail &&
				!validatingStats &&
				stats &&
				Math.round(stats?.status / 100) === 2 &&
				!stats?.data?.detail ? (
					totalErrors ? (
						<span css={[totalErrors > 0 ? tw`text-red-500` : tw`text-green-500`]}>{totalErrors}</span>
					) : (
						<span tw="text-gray-500">0</span>
					)
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady &&
				user &&
				Math.round(user?.status / 100) === 2 &&
				!user?.data?.detail &&
				!validatingStats &&
				stats &&
				Math.round(stats?.status / 100) === 2 &&
				!stats?.data?.detail ? (
					stats?.data?.num_links > 0 ? (
						<Link href="/dashboard/sites/[siteId]/links" as={`/dashboard/sites/${siteId}/links`} passHref>
							<a tw="cursor-pointer text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150">
								{stats?.data?.num_links}
							</a>
						</Link>
					) : (
						<span tw="text-gray-500">0</span>
					)
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady &&
				user &&
				Math.round(user?.status / 100) === 2 &&
				!user?.data?.detail &&
				!validatingStats &&
				stats &&
				Math.round(stats?.status / 100) === 2 &&
				!stats?.data?.detail ? (
					stats?.data?.num_pages > 0 ? (
						<Link href="/dashboard/sites/[siteId]/pages" as={`/dashboard/sites/${siteId}/pages`} passHref>
							<a tw="cursor-pointer text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150">
								{stats?.data?.num_pages}
							</a>
						</Link>
					) : (
						<span tw="text-gray-500">0</span>
					)
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady &&
				user &&
				Math.round(user?.status / 100) === 2 &&
				!user?.data?.detail &&
				!validatingStats &&
				stats &&
				Math.round(stats?.status / 100) === 2 &&
				!stats?.data?.detail ? (
					stats?.data?.num_images > 0 ? (
						<Link href="/dashboard/sites/[siteId]/images" as={`/dashboard/sites/${siteId}/images`} passHref>
							<a tw="cursor-pointer text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150">
								{stats?.data?.num_images}
							</a>
						</Link>
					) : (
						<span tw="text-gray-500">0</span>
					)
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
		</tr>
	);
};

DataTable.propTypes = {
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

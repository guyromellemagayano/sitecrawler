// import { MemoizedFilter } from "@components/filters";
import { MemoizedSiteVerifyErrorModal } from "@components/modals/SiteVerifyErrorModal";
import { MemoizedUpgradeErrorModal } from "@components/modals/UpgradeErrorModal";
import { RedirectInterval } from "@constants/GlobalValues";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DocumentTextIcon, ExternalLinkIcon, LinkIcon } from "@heroicons/react/outline";
import { DownloadIcon, GlobeIcon } from "@heroicons/react/solid";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useLinks } from "@hooks/useLinks";
import { usePages } from "@hooks/usePages";
import { useScan } from "@hooks/useScan";
import { useScanApiEndpoint } from "@hooks/useScanApiEndpoint";
import { useSiteId } from "@hooks/useSiteId";
import { useSiteQueries } from "@hooks/useSiteQueries";
import { useSites } from "@hooks/useSites";
import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import { handleConversionStringToLowercase, handleConversionStringToNumber } from "@utils/convertCase";
import dayjs from "dayjs";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { memo, useContext, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import tw from "twin.macro";

/**
 * Custom function to render the `PageOption` component
 *
 * @param {boolean} isImages
 * @param {boolean} isLinks
 * @param {boolean} isPages
 * @param {boolean} isSites
 */
const PageOption = ({ isImages = false, isLinks = false, isPages = false, isSites = false }) => {
	const [isDownloading, setIsDownloading] = useState(false);

	// Translations
	const { t } = useTranslation();
	const linkText = t("sites:link");
	const linksText = t("sites:links");
	const siteText = t("sites:site");
	const sitesText = t("sites:sites");
	const pagesText = t("sites:pages");
	const csvDownloadText = t("sites:csvDownload");
	const crawlingText = t("sites:crawling");
	const crawlText = t("sites:crawlSite");
	const downloadingText = t("sites:downloading");
	const siteCrawlingInProcessText = t("sites:siteCrawlingInProcess");

	// Custom context
	const { isComponentReady } = useContext(SiteCrawlerAppContext);

	// Router
	const { query, asPath } = useRouter();
	const { siteId } = query;

	// Custom variables
	const sanitizedSiteId = handleConversionStringToNumber(siteId);

	// Helper functions
	const { linksPerPage } = useSiteQueries();
	const {
		scanObjId,
		currentScan,
		previousScan,
		handleCrawl,
		scanCount,
		isCrawlStarted,
		isCrawlFinished,
		isProcessing,
		selectedSiteRef
	} = useScan(sanitizedSiteId);
	const { scanApiEndpoint, queryString } = useScanApiEndpoint(linksPerPage);

	// SWR hooks
	const { user, disableLocalTime, permissions } = useUser();
	const { siteIdVerified, siteName, siteUrl } = useSiteId(sanitizedSiteId);
	const { sitesCount, sitesResults, validatingSites } = useSites(scanApiEndpoint);
	const { linksCount, linksResults, validatingLinks } = useLinks(scanApiEndpoint, sanitizedSiteId, scanObjId);
	const { pagesCount, pagesResultsm, validatingPages } = usePages(scanApiEndpoint, sanitizedSiteId, scanObjId);

	// Custom hooks
	const {
		ref: upgradeErrorModalRef,
		isComponentVisible: isUpgradeErrorModalVisible,
		setIsComponentVisible: setIsUpgradeErrorModalVisible
	} = useComponentVisible(false);
	const {
		ref: siteVerifyErrorModalRef,
		isComponentVisible: isSiteVerifyErrorModalVisible,
		setIsComponentVisible: setIsSiteVerifyErrorModalVisible
	} = useComponentVisible(false);

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

	// Custom functions
	const handleCsvDownload = (e) => {
		e.preventDefault();

		const timeout = setTimeout(() => {
			setIsDownloading(false);
		}, RedirectInterval);

		setIsDownloading(!isDownloading);

		if (!isDownloading) {
			const downloadLink = `/api/site/${siteId}/scan/${scanObjId}/${
				isLinks ? "link" : isPages ? "page" : isImages ? "image" : null
			}/?format=csv${queryString}`;

			window.location.assign(downloadLink);
		}

		return () => {
			clearTimeout(timeout);
		};
	};

	return (
		<div tw="flex-none px-4 sm:px-6 md:px-0 md:flex md:items-center md:justify-between">
			{!isSites ? (
				<>
					<MemoizedUpgradeErrorModal
						ref={upgradeErrorModalRef}
						showModal={isUpgradeErrorModalVisible}
						setShowModal={setIsUpgradeErrorModalVisible}
					/>

					<MemoizedSiteVerifyErrorModal
						ref={siteVerifyErrorModalRef}
						showModal={isSiteVerifyErrorModalVisible}
						setShowModal={setIsSiteVerifyErrorModalVisible}
					/>
				</>
			) : null}

			<div ref={selectedSiteRef} tw="flex-1 min-w-0">
				<div tw="mt-4 mb-8 flex flex-col sm:flex-row sm:flex-wrap sm:mt-2 sm:space-x-6 md:justify-between">
					<div tw="mt-2 flex justify-start space-x-6">
						{!isSites ? (
							<>
								<div tw="flex items-center space-x-2 text-sm text-gray-500">
									{isComponentReady &&
									user &&
									Math.round(user?.status / 100) === 2 &&
									!user?.data?.detail &&
									(!validatingLinks || !validatingPages) ? (
										<>
											<GlobeIcon tw="flex-shrink-0 h-5 w-5 text-gray-400" aria-hidden="true" />
											<span tw="text-sm leading-6 font-semibold text-gray-500">
												<a
													href={siteUrl}
													target="_blank"
													title={siteName}
													className="truncate-link"
													tw="max-w-lg hover:text-gray-900 truncate"
													rel="noreferrer"
												>
													{siteName}
												</a>
											</span>
										</>
									) : (
										<>
											<Skeleton duration={2} width={20} height={20} className="flex-shrink-0" />
											<Skeleton duration={2} width={60} height={20} />
										</>
									)}
								</div>

								<div tw="flex items-center space-x-2 text-sm text-gray-500">
									{isComponentReady &&
									user &&
									Math.round(user?.status / 100) === 2 &&
									!user?.data?.detail &&
									(!validatingSites || !validatingLinks || !validatingPages) ? (
										<>
											<FontAwesomeIcon
												icon={["fas", "spider"]}
												tw="flex-shrink-0 h-5 w-5 text-gray-400"
												aria-hidden="true"
											/>
											<span tw="text-sm leading-6 text-gray-500">
												{scanCount > 1 ? (
													!disableLocalTime ? (
														dayjs(
															currentScan !== null ? previousScan?.finished_at : previousScan?.finished_at
														).calendar(null, calendarStrings)
													) : (
														dayjs
															.utc(currentScan !== null ? previousScan?.finished_at : previousScan?.finished_at)
															.calendar(null, calendarStrings)
													)
												) : scanCount === 1 && currentScan !== null ? (
													<span tw="text-sm leading-5 text-gray-500">{siteCrawlingInProcessText}</span>
												) : !disableLocalTime ? (
													dayjs(previousScan?.finished_at).calendar(null, calendarStrings)
												) : (
													dayjs.utc(previousScan?.finished_at).calendar(null, calendarStrings)
												)}
											</span>
										</>
									) : (
										<>
											<Skeleton duration={2} width={20} height={20} className="flex-shrink-0" />
											<Skeleton duration={2} width={60} height={20} />
										</>
									)}
								</div>
							</>
						) : null}

						<div tw="flex items-center space-x-2 text-sm text-gray-500">
							{isComponentReady &&
							user &&
							Math.round(user?.status / 100) === 2 &&
							!user?.data?.detail &&
							(!validatingSites || !validatingLinks || !validatingPages) ? (
								isLinks && linksCount ? (
									<>
										<LinkIcon tw="flex-shrink-0 h-5 w-5 text-gray-400" aria-hidden="true" />
										<span tw="text-sm leading-6 text-gray-500">
											{linksCount > 1
												? linksCount + " " + handleConversionStringToLowercase(linksText)
												: linksCount + " " + linkText}
										</span>
									</>
								) : isSites && sitesCount ? (
									<>
										<ExternalLinkIcon tw="flex-shrink-0 h-5 w-5 text-gray-400" aria-hidden="true" />
										<span tw="text-sm leading-6 text-gray-500">
											{sitesCount > 1
												? sitesCount + " " + handleConversionStringToLowercase(sitesText)
												: sitesCount + " " + siteText}
										</span>
									</>
								) : isPages && pagesCount ? (
									<>
										<DocumentTextIcon tw="flex-shrink-0 h-5 w-5 text-gray-400" aria-hidden="true" />
										<span tw="text-sm leading-6 text-gray-500">
											{pagesCount > 1
												? pagesCount + " " + handleConversionStringToLowercase(pagesText)
												: pagesCount + " " + siteText}
										</span>
									</>
								) : null
							) : (
								<>
									<Skeleton duration={2} width={20} height={20} className="flex-shrink-0" />
									<Skeleton duration={2} width={60} height={20} />
								</>
							)}
						</div>
					</div>

					{!isSites ? (
						<div tw="mt-4 flex md:mt-0 md:ml-4">
							{isComponentReady &&
							user &&
							Math.round(user?.status / 100) === 2 &&
							!user?.data?.detail &&
							(!validatingLinks || !validatingPages) ? (
								permissions.includes("can_start_scan") &&
								permissions.includes("can_see_pages") &&
								permissions.includes("can_see_scripts") &&
								permissions.includes("can_see_stylesheets") &&
								permissions.includes("can_see_images") ? (
									siteIdVerified ? (
										<button
											type="button"
											disabled={(isCrawlStarted && !isCrawlFinished) || isProcessing}
											onClick={handleCrawl}
											css={[
												tw`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white `,
												(isCrawlStarted && !isCrawlFinished) || isProcessing
													? tw`opacity-50 cursor-not-allowed`
													: tw`bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`
											]}
										>
											<span tw="flex items-center space-x-2">
												<FontAwesomeIcon icon={["fas", "spider"]} tw="w-4 h-4 text-white" />
												<span>{isProcessing || (isCrawlStarted && !isCrawlFinished) ? crawlingText : crawlText}</span>
											</span>
										</button>
									) : !siteIdVerified ? (
										<button
											type="button"
											onClick={() => setIsSiteVerifyErrorModalVisible(!isSiteVerifyErrorModalVisible)}
											tw="inline-flex items-center ml-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
										>
											<span tw="flex items-center space-x-2">
												<FontAwesomeIcon icon={["fas", "crown"]} tw="w-4 h-4 text-white" />
												<span>{crawlText}</span>
											</span>
										</button>
									) : null
								) : (
									<button
										type="button"
										onClick={() => setIsUpgradeErrorModalVisible(!isUpgradeErrorModalVisible)}
										tw="inline-flex items-center ml-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none bg-yellow-600 hover:bg-yellow-700 focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
									>
										<span tw="flex items-center space-x-2">
											<FontAwesomeIcon icon={["fas", "crown"]} tw="w-4 h-4 text-white" />
											<span>{crawlText}</span>
										</span>
									</button>
								)
							) : (
								<Skeleton duration={2} width={150} height={40} />
							)}

							{!isSites ? (
								isComponentReady &&
								user &&
								Math.round(user?.status / 100) === 2 &&
								!user?.data?.detail &&
								(!validatingLinks || !validatingPages) ? (
									siteIdVerified ? (
										<button
											type="button"
											disabled={isDownloading}
											css={[
												tw`inline-flex items-center ml-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white`,
												isDownloading
													? tw`opacity-50 cursor-not-allowed`
													: tw`bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
											]}
											onClick={handleCsvDownload}
										>
											<span tw="flex items-center space-x-2">
												<DownloadIcon tw="w-4 h-4 text-white" />
												<span>{isDownloading ? downloadingText : csvDownloadText}</span>
											</span>
										</button>
									) : !siteIdVerified ? (
										<button
											type="button"
											onClick={() => setIsSiteVerifyErrorModalVisible(!isSiteVerifyErrorModalVisible)}
											tw="inline-flex items-center ml-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
										>
											<span tw="flex items-center space-x-2">
												<DownloadIcon tw="w-4 h-4 text-white" />
												<span>{csvDownloadText}</span>
											</span>
										</button>
									) : null
								) : (
									<Skeleton duration={2} width={150} height={40} tw="ml-2" />
								)
							) : null}
						</div>
					) : null}
				</div>

				{/* {isLinks ? (
					<MemoizedFilter isSitesLinksFilter />
				) : isPages ? (
					<MemoizedFilter isSitesPagesFilter />
				) : isImages ? (
					<MemoizedFilter isSitesImagesFilter />
				) : (
					<MemoizedFilter isSitesFilter />
				)} */}
			</div>
		</div>
	);
};

/**
 * Memoized custom `PageOption` component
 */
export const MemoizedPageOption = memo(PageOption);

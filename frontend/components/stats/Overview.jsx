import { MemoizedSiteDangerStatus } from "@components/status/SiteDangerStatus";
import { MemoizedSiteInfoStatus } from "@components/status/SiteInfoStatus";
import { MemoizedSiteInProgressStatus } from "@components/status/SiteInProgressStatus";
import { MemoizedSiteSuccessStatus } from "@components/status/SiteSuccessStatus";
import { SiteCrawlerAppContext } from "@pages/_app";
import useTranslation from "next-translate/useTranslation";
import { memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the `OverviewStats` component
 */
const OverviewStats = () => {
	// Translations
	const { t } = useTranslation();
	const verificationStatusText = t("sites:verificationStatus");
	const sslStatusText = t("sites:sslStatus");
	const forcedHttpsText = t("sites:forcedHttps");
	const crawlStatusText = t("sites:crawlStatus");
	const crawlData = t("sites:crawlData");

	// Custom context
	const { isComponentReady, stats, user, siteId, isCrawlFinished, isCrawlStarted, scan, currentScan, previousScan } =
		useContext(SiteCrawlerAppContext);

	// Custom variables
	const disableLocalTime = user?.data?.settings?.disableLocalTime ?? false;
	const permissions = user?.data?.permissions ?? null;
	const siteVerified = siteId?.data?.verified ?? null;
	const siteValid = stats?.data?.num_pages_tls_non_ok ?? null;
	const statsForceHttps = stats?.data?.force_https ?? null;
	const scanCount = scan?.data?.count ?? null;

	return (
		<div className="h-full overflow-hidden rounded-lg border">
			<div className="flex items-center px-6 pt-6 pb-2">
				{isComponentReady ? (
					<h2 className="text-lg font-bold leading-7 text-gray-900">{crawlData}</h2>
				) : (
					<Skeleton duration={2} width={100} height={15} />
				)}
			</div>

			<div className="px-6 pt-2 pb-4">
				<div className="col-span-4 grid grid-cols-1 sm:grid-cols-2">
					<div className="py-3 sm:col-span-1">
						<dl>
							<dt className="text-sm font-medium leading-5 text-gray-500">
								{isComponentReady &&
								(!isCrawlStarted || isCrawlStarted) &&
								(isCrawlFinished || !isCrawlFinished) &&
								(siteVerified || !siteVerified) ? (
									verificationStatusText
								) : (
									<Skeleton duration={2} width={100} height={15}></Skeleton>
								)}
							</dt>

							<dd className="mt-1">
								{isComponentReady && siteVerified ? (
									<MemoizedSiteSuccessStatus text="Verified" />
								) : isComponentReady && !siteVerified ? (
									<MemoizedSiteDangerStatus text="Unverified" />
								) : (
									<span className="flex space-x-3">
										<Skeleton circle={true} duration={2} width={15} height={15} />
										<Skeleton duration={2} width={100} height={15} />
									</span>
								)}
							</dd>
						</dl>
					</div>

					{isComponentReady &&
					permissions &&
					permissions?.includes("can_see_pages") &&
					permissions?.includes("can_see_scripts") &&
					permissions?.includes("can_see_stylesheets") ? (
						<div className="py-3 sm:col-span-1">
							<dl>
								<dt className="text-sm font-medium leading-5 text-gray-500">
									{isComponentReady && (!isCrawlStarted || isCrawlStarted) && (isCrawlFinished || !isCrawlFinished) ? (
										sslStatusText
									) : (
										<Skeleton duration={2} width={100} height={15}></Skeleton>
									)}
								</dt>

								<dd className="mt-1">
									{isComponentReady && !isCrawlStarted && isCrawlFinished ? (
										siteValid === 0 ? (
											<MemoizedSiteSuccessStatus text="Valid" />
										) : siteValid > 0 ? (
											<span className="flex flex-col items-start justify-start space-x-1">
												<button type="button" onClick={() => {}} className="hover:text-gray-50 focus:outline-none">
													<span className="flex items-center">
														<MemoizedSiteDangerStatus text="Not Valid" />
													</span>
												</button>
											</span>
										) : (
											<span className="flex space-x-3">
												<Skeleton circle={true} duration={2} width={15} height={15} />
												<Skeleton duration={2} width={100} height={15} />
											</span>
										)
									) : isComponentReady && isCrawlStarted && !isCrawlFinished ? (
										<MemoizedSiteInProgressStatus text="Checking..." />
									) : (
										<span className="flex space-x-3">
											<Skeleton circle={true} duration={2} width={15} height={15} />
											<Skeleton duration={2} width={100} height={15} />
										</span>
									)}
								</dd>
							</dl>
						</div>
					) : isComponentReady &&
					  permissions &&
					  !permissions?.includes("can_see_pages") &&
					  !permissions?.includes("can_see_scripts") &&
					  !permissions?.includes("can_see_stylesheets") ? null : (
						<div className="py-3 sm:col-span-1">
							<dl>
								<dt className="text-sm font-medium leading-5 text-gray-500">
									<Skeleton duration={2} width={100} height={15}></Skeleton>
								</dt>

								<dd className="mt-1">
									<span className="flex space-x-3">
										<Skeleton circle={true} duration={2} width={15} height={15} />
										<Skeleton duration={2} width={100} height={15} />
									</span>
								</dd>
							</dl>
						</div>
					)}

					<div className="py-3 sm:col-span-1">
						<dl>
							<dt className="text-sm font-medium leading-5 text-gray-500">
								{isComponentReady &&
								(!isCrawlStarted || isCrawlStarted) &&
								(isCrawlFinished || !isCrawlFinished) &&
								(statsForceHttps || !statsForceHttps) ? (
									forcedHttpsText
								) : (
									<Skeleton duration={2} width={100} height={15}></Skeleton>
								)}
							</dt>

							<dd className="mt-1">
								{isComponentReady && !isCrawlStarted && isCrawlFinished ? (
									statsForceHttps ? (
										<MemoizedSiteSuccessStatus text="Yes" />
									) : !statsForceHttps ? (
										<MemoizedSiteDangerStatus text="No" />
									) : (
										<span className="flex space-x-3">
											<Skeleton circle={true} duration={2} width={15} height={15} />
											<Skeleton duration={2} width={100} height={15} />
										</span>
									)
								) : isComponentReady && isCrawlStarted && !isCrawlFinished ? (
									<MemoizedSiteInProgressStatus text="Checking..." />
								) : (
									<span className="flex space-x-3">
										<Skeleton circle={true} duration={2} width={15} height={15} />
										<Skeleton duration={2} width={100} height={15} />
									</span>
								)}
							</dd>
						</dl>
					</div>

					<div className="py-3 sm:col-span-1">
						<dl>
							<dt className="text-sm font-medium leading-5 text-gray-500">
								{isComponentReady &&
								(!isCrawlStarted || isCrawlStarted) &&
								(isCrawlFinished || !isCrawlFinished) &&
								scanCount ? (
									crawlStatusText
								) : (
									<Skeleton duration={2} width={100} height={15}></Skeleton>
								)}
							</dt>

							<dd className="mt-1">
								{isComponentReady && !isCrawlStarted && isCrawlFinished && scanCount > 0 ? (
									<MemoizedSiteSuccessStatus text="Finished" />
								) : isComponentReady && !isCrawlStarted && isCrawlFinished && scanCount === 0 ? (
									<MemoizedSiteInfoStatus text="Not Crawled Yet" />
								) : isComponentReady && isCrawlStarted && !isCrawlFinished ? (
									<MemoizedSiteInProgressStatus text="Crawling Site..." />
								) : (
									<span className="flex space-x-3">
										<Skeleton circle={true} duration={2} width={15} height={15} />
										<Skeleton duration={2} width={100} height={15} />
									</span>
								)}
							</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>
	);
};

/**
 * Memoized custom `OverviewStats` component
 */
export const MemoizedOverviewStats = memo(OverviewStats);

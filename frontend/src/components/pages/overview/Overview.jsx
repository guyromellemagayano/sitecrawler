// React
import * as React from "react";

// External
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ExclamationIcon } from "@heroicons/react/outline";
import loadable from "@loadable/component";
import Moment from "react-moment";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import tw from "twin.macro";

// JSON
import OverviewLabel from "public/labels/components/sites/Overview.json";

// Loadable
const SiteDangerStatus = loadable(() => import("src/components/status/SiteDangerStatus"));
const SiteSuccessStatus = loadable(() => import("src/components/status/SiteSuccessStatus"));
const SiteVerifyErrorModal = loadable(() => import("src/components/modals/SiteVerifyErrorModal"));
const SiteWarningStatus = loadable(() => import("src/components/status/SiteWarningStatus"));
const TlsErrorModal = loadable(() => import("src/components/modals/TlsErrorModal"));
const UpgradeErrorModal = loadable(() => import("src/components/modals/UpgradeErrorModal"));

const SitesOverview = ({ verified, stats, user, disableLocalTime, handleCrawl, isCrawlStarted, isCrawlFinished }) => {
	const [componentReady, setComponentReady] = React.useState(false);
	const [showSiteVerifyErrorModal, setShowSiteVerifyErrorModal] = React.useState(false);
	const [showTlsErrorModal, setShowTlsErrorModal] = React.useState(false);
	const [showUpgradeErrorModal, setShowUpgradeErrorModal] = React.useState(false);

	const calendarStrings = {
		lastDay: "[Yesterday], dddd",
		sameDay: "[Today], dddd",
		lastWeek: "MMMM DD, YYYY",
		sameElse: "MMMM DD, YYYY"
	};

	React.useEffect(() => {
		stats
			? (() => {
					setComponentReady(false);

					setTimeout(() => {
						setComponentReady(true);
					}, 500);
			  })()
			: null;
	}, [stats]);

	return (
		<div tw="bg-white overflow-hidden rounded-lg h-full border">
			<UpgradeErrorModal show={showUpgradeErrorModal} setShowErrorModal={setShowUpgradeErrorModal} />
			<SiteVerifyErrorModal show={showSiteVerifyErrorModal} setShowErrorModal={setShowSiteVerifyErrorModal} />
			<TlsErrorModal
				show={showTlsErrorModal}
				setShowErrorModal={setShowTlsErrorModal}
				siteId={stats?.site_id}
				scanObjId={stats?.id}
			/>

			<div tw="px-4 py-5 sm:p-6">
				<div tw="flex items-center justify-between mb-5">
					<h2 tw="text-lg font-bold leading-7 text-gray-900">{OverviewLabel[1].label}</h2>
					<div className="btn-crawler">
						{componentReady ? (
							user ? (
								<button
									type="button"
									disabled={isCrawlStarted && !isCrawlFinished}
									onClick={
										user?.permissions.includes("can_start_scan")
											? verified
												? handleCrawl
												: () => setShowSiteVerifyErrorModal(!showSiteVerifyErrorModal)
											: () => setShowUpgradeErrorModal(!showUpgradeErrorModal)
									}
									css={[
										tw`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none`,
										user?.permissions.includes("can_start_scan")
											? verified
												? isCrawlStarted && !isCrawlFinished
													? tw`bg-green-600 opacity-50 cursor-not-allowed`
													: tw`bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500`
												: tw`bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500`
											: tw`bg-yellow-600 hover:bg-yellow-700 focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500`
									]}
								>
									<span tw="flex items-center space-x-2">
										{user?.permissions.includes("can_start_scan") ? null : (
											<FontAwesomeIcon icon={["fas", "crown"]} tw="w-4 h-4 text-white" />
										)}

										{verified ? (
											!isCrawlStarted && isCrawlFinished ? (
												<span>{OverviewLabel[0].label}</span>
											) : (
												<span>{OverviewLabel[6].label}</span>
											)
										) : (
											<span>{OverviewLabel[7].label}</span>
										)}
									</span>
								</button>
							) : null
						) : (
							<Skeleton duration={2} width={150} height={40} />
						)}
					</div>
				</div>
				<dl tw="mb-8 max-w-xl text-sm leading-5">
					<dt tw="text-sm leading-5 font-medium text-gray-500">{OverviewLabel[2].label}</dt>
					{componentReady ? (
						user?.settings.disableLocalTime && disableLocalTime ? (
							<dd tw="mt-1 text-sm leading-5 text-gray-900">
								{stats ? (
									<span tw="space-x-2">
										<Moment calendar={calendarStrings} date={stats?.finished_at} utc />
										<Moment date={stats?.finished_at} format="hh:mm:ss A" utc />
										<span tw="text-sm leading-5 font-medium text-gray-500">(UTC)</span>
									</span>
								) : null}
							</dd>
						) : (
							<dd tw="mt-1 text-sm leading-5 text-gray-900">
								{stats ? (
									<span tw="space-x-2">
										<Moment calendar={calendarStrings} date={stats?.finished_at} local />
										<Moment date={stats?.finished_at} format="hh:mm:ss A" local />
									</span>
								) : null}
							</dd>
						)
					) : (
						<Skeleton duration={2} width={240} height={15} />
					)}
				</dl>
				<dl tw="grid grid-cols-1 col-span-4 sm:grid-cols-2">
					<div tw="py-3 sm:col-span-1">
						<dt tw="text-sm leading-5 font-medium text-gray-500">{OverviewLabel[1].label}</dt>
						<dd tw="mt-1 text-sm leading-5 text-gray-900">
							{componentReady ? (
								verified ? (
									<SiteSuccessStatus text="Verified" />
								) : (
									<SiteDangerStatus text="Unverified" />
								)
							) : (
								<span tw="flex space-x-3">
									<Skeleton circle={true} duration={2} width={15} height={15} />
									<Skeleton duration={2} width={100} height={15} />
								</span>
							)}
						</dd>
					</div>
					{user?.permissions?.includes("can_see_pages") && (
						<div tw="py-3 sm:col-span-1">
							<dt tw="text-sm leading-5 font-medium text-gray-500">{OverviewLabel[3].label}</dt>
							<dd tw="mt-1 text-sm leading-5 text-gray-900">
								{componentReady ? (
									!isCrawlStarted && isCrawlFinished ? (
										stats ? (
											stats.num_pages_tls_non_ok === 0 ? (
												<SiteSuccessStatus text="Valid" />
											) : (
												<span tw="flex items-center justify-start space-x-1">
													<SiteDangerStatus text="Not Valid" />

													<button
														type="button"
														onClick={() => setShowTlsErrorModal(true)}
														tw="focus:outline-none hover:text-gray-50"
													>
														<span tw="flex items-center">
															<ExclamationIcon tw="w-5 h-5 ml-2 mr-1 text-gray-400" />
															<small tw="text-gray-400">{OverviewLabel[9].label}</small>
														</span>
													</button>
												</span>
											)
										) : null
									) : (
										<SiteWarningStatus text="Checking" />
									)
								) : (
									<span tw="flex space-x-3">
										<Skeleton circle={true} duration={2} width={15} height={15} />
										<Skeleton duration={2} width={100} height={15} />
									</span>
								)}
							</dd>
						</div>
					)}
					<div tw="py-3 sm:col-span-1">
						<dt tw="text-sm leading-5 font-medium text-gray-500">{OverviewLabel[4].label}</dt>
						<dd tw="mt-1 text-sm leading-5 text-gray-900">
							{componentReady ? (
								!isCrawlStarted && isCrawlFinished ? (
									stats ? (
										stats.force_https ? (
											<SiteSuccessStatus text="Yes" />
										) : (
											<SiteDangerStatus text="No" />
										)
									) : null
								) : (
									<SiteWarningStatus text="Checking" />
								)
							) : (
								<span tw="flex space-x-3">
									<Skeleton circle={true} duration={2} width={15} height={15} />
									<Skeleton duration={2} width={100} height={15} />
								</span>
							)}
						</dd>
					</div>
					<div tw="py-3 sm:col-span-1">
						<dt tw="text-sm leading-5 font-medium text-gray-500">{OverviewLabel[5].label}</dt>
						<dd tw="mt-1 text-sm leading-5 text-gray-900">
							{componentReady ? (
								!isCrawlStarted && isCrawlFinished ? (
									<SiteSuccessStatus text="Finished" />
								) : (
									<SiteWarningStatus text="In Process" />
								)
							) : (
								<span tw="flex space-x-3">
									<Skeleton circle={true} duration={2} width={15} height={15} />
									<Skeleton duration={2} width={100} height={15} />
								</span>
							)}
						</dd>
					</div>
				</dl>
			</div>
		</div>
	);
};

SitesOverview.propTypes = {};

export default SitesOverview;

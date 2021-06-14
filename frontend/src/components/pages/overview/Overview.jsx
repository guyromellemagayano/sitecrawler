// React
import * as React from "react";

// External
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import loadable from "@loadable/component";
import Moment from "react-moment";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import tw, { styled } from "twin.macro";

// JSON
import OverviewLabel from "public/labels/components/sites/Overview.json";

// Hooks
import useDropdownOutsideClick from "src/hooks/useDropdownOutsideClick";

// Components
import SiteDangerStatus from "src/components/status/SiteDangerStatus";
import SiteSuccessStatus from "src/components/status/SiteSuccessStatus";
import SiteWarningStatus from "src/components/status/SiteWarningStatus";

// Loadable
const UpgradeErrorModal = loadable(() => import("src/components/modals/UpgradeErrorModal"));

const SitesOverviewDiv = styled.div``;

const SitesOverview = ({
	verified,
	stats,
	scanResult,
	user,
	disableLocalTime,
	handleCrawl,
	isCrawlStarted,
	isCrawlFinished
}) => {
	const [componentReady, setComponentReady] = React.useState(false);
	const { ref, isComponentVisible, setIsComponentVisible } = useDropdownOutsideClick(false);

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
		<>
			<SitesOverviewDiv ref={ref} tw="bg-white overflow-hidden rounded-lg h-full border">
				<UpgradeErrorModal show={isComponentVisible} setShowErrorModal={setIsComponentVisible} />

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
												? handleCrawl
												: () => setIsComponentVisible(!isComponentVisible)
										}
										css={[
											tw`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none`,
											user?.permissions.includes("can_start_scan")
												? isCrawlStarted && !isCrawlFinished
													? tw`bg-green-600 opacity-50 cursor-not-allowed`
													: tw`bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500`
												: tw`bg-yellow-600 hover:bg-yellow-700 focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500`
										]}
									>
										<span tw="flex items-center space-x-2">
											{user?.permissions?.includes("can_start_scan") ? null : (
												<FontAwesomeIcon icon={["fas", "crown"]} tw="w-4 h-4 text-white" />
											)}

											{!isCrawlStarted && isCrawlFinished ? (
												<span>{OverviewLabel[0].label}</span>
											) : (
												<span>{OverviewLabel[6].label}</span>
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
										verified ? (
											!isCrawlStarted && isCrawlFinished ? (
												stats ? (
													stats.num_pages_tls_non_ok === 0 ? (
														<SiteSuccessStatus text="Valid" />
													) : (
														<span tw="flex items-center justify-start">
															<SiteDangerStatus text="Not Valid" />
														</span>
													)
												) : null
											) : (
												<SiteWarningStatus text="Checking" />
											)
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
			</SitesOverviewDiv>
		</>
	);
};

SitesOverview.propTypes = {};

export default SitesOverview;

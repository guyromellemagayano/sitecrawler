// React
import { useState, useEffect } from "react";

// External
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import loadable from "@loadable/component";
import Moment from "react-moment";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import tw from "twin.macro";

// JSON
import OverviewLabel from "public/labels/components/sites/Overview.json";

// Components
import SiteDangerStatus from "src/components/status/SiteDangerStatus";
import SiteSuccessStatus from "src/components/status/SiteSuccessStatus";
import SiteWarningStatus from "src/components/status/SiteWarningStatus";

// Loadable
const UpgradeErrorModal = loadable(() => import("src/components/modals/UpgradeErrorModal"));

const SitesOverview = ({
	verified,
	finishedAt,
	forceHttps,
	handleCrawl,
	scan,
	user,
	stats,
	disableLocalTime,
	previousStatsData
}) => {
	const [componentReady, setComponentReady] = useState(false);
	const [showErrorModal, setShowErrorModal] = useState(false);

	// console.log(scan);

	const calendarStrings = {
		lastDay: "[Yesterday], dddd",
		sameDay: "[Today], dddd",
		lastWeek: "MMMM DD, YYYY",
		sameElse: "MMMM DD, YYYY"
	};

	useEffect(() => {
		if (
			user &&
			user !== undefined &&
			Object.keys(user).length > 0 &&
			stats &&
			stats !== undefined &&
			Object.keys(stats).length > 0 &&
			scan &&
			scan !== undefined &&
			Object.keys(scan).length > 0
		) {
			setTimeout(() => {
				setComponentReady(true);
			}, 500);
		}
	}, [user, stats, scan]);

	const handleCrawlPermissions = (e) => {
		e.preventDefault();

		setShowErrorModal(!showErrorModal);
	};

	return (
		<>
			<UpgradeErrorModal
				show={showErrorModal}
				setShowErrorModal={setShowErrorModal}
				component="Overview"
				label={OverviewLabel}
			/>

			<div tw="bg-white overflow-hidden rounded-lg h-full border">
				<div tw="px-4 py-5 sm:p-6">
					<div tw="flex items-center justify-between mb-5">
						<h2 tw="text-lg font-bold leading-7 text-gray-900">
							{componentReady ? OverviewLabel[1].label : <Skeleton duration={2} width={120} height={20} />}
						</h2>
						<div className="btn-crawler">
							{componentReady ? (
								user && user !== undefined && Object.keys(user).length > 0 ? (
									<button
										type="button"
										disabled={user && user.permissions.includes("can_start_scan") && !previousStatsData}
										onClick={user && user.permissions.includes("can_start_scan") ? handleCrawl : handleCrawlPermissions}
										css={[
											tw`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none`,
											user && user.permissions.includes("can_start_scan")
												? !previousStatsData
													? tw`bg-green-600 opacity-50 cursor-not-allowed`
													: tw`bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500`
												: tw`bg-yellow-600 hover:bg-yellow-700 focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500`
										]}
									>
										<span tw="flex items-center space-x-2">
											{user &&
											user !== undefined &&
											Object.keys(user).length > 0 &&
											user.permissions &&
											user.permissions !== undefined &&
											user.permissions.includes("can_start_scan") ? null : (
												<FontAwesomeIcon icon={["fas", "crown"]} tw="w-4 h-4 text-white" />
											)}
											<span>{previousStatsData ? OverviewLabel[0].label : OverviewLabel[6].label}</span>
										</span>
									</button>
								) : null
							) : (
								<Skeleton duration={2} width={150} height={40} />
							)}
						</div>
					</div>
					<dl tw="mb-8 max-w-xl text-sm leading-5">
						<dt tw="text-sm leading-5 font-medium text-gray-500">
							{componentReady ? OverviewLabel[2].label : <Skeleton duration={2} width={100} height={15} />}
						</dt>
						{user && user !== undefined && Object.keys(user).length > 0 && !user.settings.disableLocalTime ? (
							<dd tw="mt-1 text-sm leading-5 text-gray-900">
								{componentReady ? (
									<>
										<Moment calendar={calendarStrings} date={finishedAt} local />
										&nbsp;
										<Moment date={finishedAt} format="hh:mm:ss A" local />
									</>
								) : (
									<Skeleton duration={2} width={240} height={15} />
								)}
							</dd>
						) : (
							<dd tw="mt-1 text-sm leading-5 text-gray-900">
								{componentReady ? (
									<span tw="space-x-2">
										<Moment calendar={calendarStrings} date={finishedAt} utc />
										<Moment date={finishedAt} format="hh:mm:ss A" utc />
										{disableLocalTime && <span tw="text-sm leading-5 font-medium text-gray-500">(UTC)</span>}
									</span>
								) : (
									<Skeleton duration={2} width={240} height={15} />
								)}
							</dd>
						)}
					</dl>
					<dl tw="grid grid-cols-1 col-span-4 sm:grid-cols-2">
						<div tw="py-3 sm:col-span-1">
							<dt tw="text-sm leading-5 font-medium text-gray-500">
								{componentReady ? OverviewLabel[1].label : <Skeleton duration={2} width={100} height={15} />}
							</dt>
							<dd tw="mt-1 text-sm leading-5 text-gray-900">
								{componentReady ? (
									verified && verified !== undefined ? (
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
						{user && user !== undefined && Object.keys(user).length > 0 && user.permissions.includes("can_see_pages") && (
							<div tw="py-3 sm:col-span-1">
								<dt tw="text-sm leading-5 font-medium text-gray-500">
									{componentReady ? OverviewLabel[3].label : <Skeleton duration={2} width={100} height={15} />}
								</dt>
								<dd tw="mt-1 text-sm leading-5 text-gray-900">
									{componentReady ? (
										verified && verified !== undefined ? (
											stats &&
											stats !== undefined &&
											Object.keys(stats).length > 0 &&
											previousStatsData &&
											(stats.num_pages_tls_non_ok === 0 ? (
												<SiteSuccessStatus text="Valid" />
											) : stats.num_pages_tls_non_ok !== 0 ? (
												<span tw="flex items-center justify-start">
													<SiteDangerStatus text="Not Valid" />
												</span>
											) : (
												<SiteWarningStatus text="Checking" />
											))
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
							<dt tw="text-sm leading-5 font-medium text-gray-500">
								{componentReady ? OverviewLabel[4].label : <Skeleton duration={2} width={100} height={15} />}
							</dt>
							<dd tw="mt-1 text-sm leading-5 text-gray-900">
								{componentReady ? (
									previousStatsData ? (
										forceHttps ? (
											<SiteSuccessStatus text="Yes" />
										) : (
											<SiteDangerStatus text="No" />
										)
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
							<dt tw="text-sm leading-5 font-medium text-gray-500">
								{componentReady ? OverviewLabel[5].label : <Skeleton duration={2} width={100} height={15} />}
							</dt>
							<dd tw="mt-1 text-sm leading-5 text-gray-900">
								{componentReady ? (
									previousStatsData ? (
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
		</>
	);
};

SitesOverview.propTypes = {};

export default SitesOverview;

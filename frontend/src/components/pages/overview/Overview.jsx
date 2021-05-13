// React
import { useState, useEffect } from "react";

// NextJS
import Link from "next/link";

// External
import { InformationCircleIcon } from "@heroicons/react/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import loadable from "@loadable/component";
import Moment from "react-moment";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import tw from "twin.macro";

// JSON
import OverviewLabel from "public/labels/components/sites/Overview.json";

// Components
const SiteDangerStatus = loadable(() => import("src/components/status/SiteDangerStatus"));
const SiteSuccessStatus = loadable(() => import("src/components/status/SiteSuccessStatus"));
const SiteWarningStatus = loadable(() => import("src/components/status/SiteWarningStatus"));
const UpgradeErrorModal = loadable(() => import("src/components/modals/UpgradeErrorModal"));

const SitesOverview = ({
	id,
	verified,
	finishedAt,
	forceHttps,
	onCrawl,
	crawlable,
	crawlFinished,
	user,
	stats,
	scanCount,
	disableLocalTime
}) => {
	const [componentReady, setComponentReady] = useState(false);
	const [showErrorModal, setShowErrorModal] = useState(false);

	const calendarStrings = {
		lastDay: "[Yesterday], dddd",
		sameDay: "[Today], dddd",
		lastWeek: "MMMM DD, YYYY",
		sameElse: "MMMM DD, YYYY"
	};

	useEffect(() => {
		if (user && stats) {
			setTimeout(() => {
				setComponentReady(true);
			}, 500);
		}
	}, [user, stats]);

	const handleOnCrawlPermissions = (e) => {
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
										disabled={user.permissions.includes("can_start_scan") && !crawlable}
										onClick={user && user.permissions.includes("can_start_scan") ? onCrawl : handleOnCrawlPermissions}
										css={[
											tw`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none`,
											user.permissions.includes("can_start_scan") ? tw`bg-green-600` : tw`bg-yellow-600`,
											user.permissions.includes("can_start_scan")
												? !crawlFinished
													? tw`opacity-50 cursor-not-allowed`
													: tw`hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500`
												: !crawlFinished
												? tw`opacity-50 cursor-not-allowed`
												: tw`hover:bg-yellow-700 focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500`
										]}
									>
										<span tw="flex items-center space-x-2">
											{user &&
											user !== undefined &&
											user !== [] &&
											Object.keys(user).length > 0 &&
											user.permissions &&
											user.permissions !== undefined &&
											user.permissions.includes("can_see_images") &&
											user.permissions.includes("can_see_pages") &&
											user.permissions.includes("can_see_scripts") &&
											user.permissions.includes("can_see_stylesheets") &&
											user.permissions.includes("can_start_scan") ? null : (
												<FontAwesomeIcon icon={["fas", "crown"]} tw="w-4 h-4 text-white" />
											)}
											<span>
												{crawlFinished
													? OverviewLabel[0].label
													: scanCount == 1
													? OverviewLabel[8].label
													: OverviewLabel[6].label}
											</span>
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
					<dl tw="grid grid-cols-1 col-gap-4 row-gap-8 sm:grid-cols-2">
						<div tw="sm:col-span-1">
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
							<div tw="sm:col-span-1">
								<dt tw="text-sm leading-5 font-medium text-gray-500">
									{componentReady ? OverviewLabel[3].label : <Skeleton duration={2} width={100} height={15} />}
								</dt>
								<dd tw="mt-1 text-sm leading-5 text-gray-900">
									{componentReady ? (
										verified && verified !== undefined ? (
											stats &&
											stats !== undefined &&
											Object.keys(stats).length > 0 &&
											crawlFinished &&
											stats.num_pages_tls_non_ok === 0 ? (
												<SiteSuccessStatus text="Valid" />
											) : crawlFinished && stats.num_pages_tls_non_ok !== 0 ? (
												<>
													<span tw="flex items-center justify-start">
														<SiteDangerStatus text="Not Valid" />

														<a
															data-for="pages-tls-not-ok"
															data-background-color="#E53E3E"
															data-iscapture={true}
															data-scroll-hide={false}
															tw="inline-flex items-center ml-3 focus:outline-none"
														>
															<span tw="w-5 h-5">
																<InformationCircleIcon tw="text-red-400" />
															</span>
														</a>
														{/* <ReactTooltip
															id="pages-tls-not-ok"
															className="ssl-valid-tooltip w-64"
															type="dark"
															effect="solid"
															place="bottom"
															clickable={true}
															multiline={true}
															delayHide={500}
															delayShow={500}
														>
															<span tw="text-left text-xs leading-4 font-normal text-white normal-case tracking-wider">
																<p>
																	<strong tw="block mb-3">Here are our findings:</strong>
																	Apparently you have{" "}
																	{stats &&
																		stats !== undefined &&
																		Object.keys(stats).length > 0 &&
																		stats.num_pages_tls_non_ok}{" "}
																	pages that have some TLS issues. You can check this
																	<strong tw="ml-1">
																		{
																			<Link
																				href="/site/[siteId]/pages/?tls_total=false"
																				as={`/site/${id}/pages/?tls_total=false`}
																				passHref
																			>
																				<a tw="hover:text-red-300">link</a>
																			</Link>
																		}
																	</strong>{" "}
																	for more information.
																</p>
															</span>
														</ReactTooltip> */}
													</span>
												</>
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
											<Skeleton circle={true} duration={2} width={15} height={15} />
										</span>
									)}
								</dd>
							</div>
						)}
						<div tw="sm:col-span-1">
							<dt tw="text-sm leading-5 font-medium text-gray-500">
								{componentReady ? OverviewLabel[4].label : <Skeleton duration={2} width={100} height={15} />}
							</dt>
							<dd tw="mt-1 text-sm leading-5 text-gray-900">
								{componentReady ? (
									forceHttps === true ? (
										<SiteSuccessStatus text="Yes" />
									) : forceHttps === false ? (
										<SiteDangerStatus text="No" />
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
						<div tw="sm:col-span-1">
							<dt tw="text-sm leading-5 font-medium text-gray-500">
								{componentReady ? OverviewLabel[5].label : <Skeleton duration={2} width={100} height={15} />}
							</dt>
							<dd tw="mt-1 text-sm leading-5 text-gray-900">
								{componentReady ? (
									crawlFinished ? (
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

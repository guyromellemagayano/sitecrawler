// React
import { useState, useEffect } from "react";

// NextJS
import Link from "next/link";

// External
import loadable from "@loadable/component";
import Moment from "react-moment";
import ReactTooltip from "react-tooltip";
import tw from "twin.macro";

// JSON
import OverviewLabel from "public/labels/components/sites/Overview.json";

// Hooks
import { useScan, useStats, useNonTlsPages } from "src/hooks/useSite";

// Components
const SiteDangerStatus = loadable(() => import("src/components/status/SiteDangerStatus"));
const SiteSuccessStatus = loadable(() => import("src/components/status/SiteSuccessStatus"));
const SiteWarningStatus = loadable(() => import("src/components/status/SiteWarningStatus"));
const SitesOverviewSkeleton = loadable(() => import("src/components/skeletons/SitesOverviewSkeleton"));

const SitesOverview = ({ id, verified, finishedAt, forceHttps, onCrawl, crawlable, crawlFinished, user }) => {
	const [componentReady, setComponentReady] = useState(false);
	const [nonTlsPagesData, setNonTlsPagesData] = useState([]);
	const [scanData, setScanData] = useState([]);
	const [statsData, setStatsData] = useState([]);

	let scanObjId = "";

	const calendarStrings = {
		lastDay: "[Yesterday], dddd",
		sameDay: "[Today], dddd",
		lastWeek: "MMMM DD, YYYY",
		sameElse: "MMMM DD, YYYY",
	};

	const { scan: scan, scanError: scanError } = useScan({
		querySid: id,
	});

	useEffect(() => {
		if (scan && scan !== undefined && Object.keys(scan).length > 0) {
			setScanData(scan);

			if (scanData.results && scanData.results !== undefined) {
				let scanObj = [];

				scanData.results.map((val) => {
					scanObj.push(val);
					return scanObj;
				});

				scanObj.map((val, index) => {
					if (index == 0) scanObjId = val.id;

					return scanObjId;
				});
			}
		}
	}, [scan]);

	const { stats: stats, statsError: statsError } = useStats({
		querySid: id,
		scanObjId: scanObjId,
	});

	const { nonTlsPages: nonTlsPages, nonTlsPagesError: nonTlsPagesError } = useNonTlsPages({
		querySid: id,
		scanObjId: scanObjId,
	});

	useEffect(() => {
		if (
			stats &&
			stats !== undefined &&
			Object.keys(stats).length > 0 &&
			nonTlsPages &&
			nonTlsPages !== undefined &&
			Object.keys(nonTlsPages).length > 0
		) {
			setStatsData(stats);
			setNonTlsPagesData(nonTlsPages);
		}

		if (scanError || statsError || nonTlsPagesError) {
			// TODO: add generic alert here
			console.log(
				"ERROR: " + scanError
					? scanError
					: statsError
					? statsError
					: nonTlsPagesError
					? nonTlsPagesError
					: OverviewLabel[2].label
			);
		}
	}, [scan, stats, nonTlsPages]);

	useEffect(() => {
		if (user && statsData && nonTlsPagesData) {
			setTimeout(() => {
				setComponentReady(true);
			}, 500);
		}
	}, [user, statsData, nonTlsPagesData]);

	return (
		<>
			{componentReady ? (
				<>
					<style jsx>{`
						.btn-crawler {
							top: 0;
							right: 0;
							@media only screen and (min-width: 1401px) {
								top: 3.5rem;
								right: 1rem;
							}
							@media only screen and (max-width: 1400px) {
								top: 3.5rem;
								right: 1rem;
							}
							@media only screen and (max-width: 768px) and (orientation: landscape) {
								top: 1.75rem;
								right: 0.5rem;
							}
							@media only screen and (max-width: 768px) and (orientation: portrait) {
								top: 3.5rem;
								right: 1rem;
							}
							@media only screen and (max-width: 640px) and (orientation: portrait) {
								top: 1.75rem;
								right: 0.5rem;
							}
							@media only screen and (max-width: 640px) and (orientation: landscape) {
								top: 0;
								right: 0;
							}
							@media only screen and (max-width: 600px) and (orientation: portrait) {
								top: 0;
								right: 0;
							}
						}
					`}</style>

					<div tw="bg-white overflow-hidden ring-1 ring-black ring-opacity-5 rounded-lg h-full">
						<div tw="px-4 py-5 sm:p-6">
							<div tw="flex items-center justify-between mb-5">
								<h2 tw="text-lg font-bold leading-7 text-gray-900">{OverviewLabel[1].label}</h2>
								<div className="btn-crawler">
									{user &&
									user !== undefined &&
									Object.keys(user).length > 0 &&
									user.permissions.includes("can_start_scan") ? (
										<button
											type="button"
											disabled={crawlable}
											onClick={onCrawl}
											css={[
												tw`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600`,
												!crawlFinished
													? tw`opacity-50 cursor-not-allowed`
													: tw`hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`,
											]}
										>
											{OverviewLabel[0].label}
										</button>
									) : null}
								</div>
							</div>
							<dl tw="mb-8 max-w-xl text-sm leading-5">
								{user && user !== undefined && Object.keys(user).length > 0 && !user.settings.disableLocalTime ? (
									<>
										<dt tw="text-sm leading-5 font-medium text-gray-500">{OverviewLabel[2].label}</dt>
										<dd tw="mt-1 text-sm leading-5 text-gray-900">
											<Moment calendar={calendarStrings} date={finishedAt} local />
											&nbsp;
											<Moment date={finishedAt} format="hh:mm:ss A" local />
										</dd>
									</>
								) : (
									<>
										<dt tw="text-sm leading-5 font-medium text-gray-500">{OverviewLabel[2].label}</dt>
										<dd tw="mt-1 text-sm leading-5 text-gray-900">
											<Moment calendar={calendarStrings} date={finishedAt} utc />
											&nbsp;
											<Moment date={finishedAt} format="hh:mm:ss A" utc />
										</dd>
									</>
								)}
							</dl>
							<dl tw="grid grid-cols-1 grid-cols-2 col-gap-4 row-gap-8 sm:grid-cols-2">
								<div tw="sm:col-span-1">
									<dt tw="text-sm leading-5 font-medium text-gray-500">{OverviewLabel[1].label}</dt>
									<dd tw="mt-1 text-sm leading-5 text-gray-900">
										{verified && verified !== undefined ? (
											<SiteSuccessStatus text="Verified" />
										) : (
											<SiteDangerStatus text="Unverified" />
										)}
									</dd>
								</div>
								{user &&
									user !== undefined &&
									Object.keys(user).length > 0 &&
									user.permissions.includes("can_see_pages") && (
										<div tw="sm:col-span-1">
											<dt tw="text-sm leading-5 font-medium text-gray-500">{OverviewLabel[3].label}</dt>
											<dd tw="mt-1 text-sm leading-5 text-gray-900">
												{statsData &&
												statsData.num_pages_tls_non_ok == 0 &&
												statsData.num_pages_tls_non_ok !== undefined ? (
													<SiteSuccessStatus text="Valid" />
												) : (
													<>
														<span tw="flex items-center justify-start">
															<SiteDangerStatus text="Not Valid" />
															<a
																data-tip=""
																data-for="stats-tls-not-ok"
																data-background-color="#E53E3E"
																data-iscapture={true}
																data-scroll-hide={false}
																tw="flex cursor-pointer"
															>
																<span tw="ml-2 inline-block w-4 h-4 overflow-hidden">
																	<svg fill="currentColor" viewBox="0 0 20 20" tw="text-red-400">
																		<path
																			fillRule="evenodd"
																			d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
																			clipRule="evenodd"
																		></path>
																	</svg>
																</span>
															</a>
															<ReactTooltip
																id="stats-tls-not-ok"
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
																		Apparently you have {nonTlsPagesData && nonTlsPagesData.count} pages that have some
																		TLS issues. You can check this
																		<strong tw="ml-1">
																			{
																				<Link
																					href="/dashboard/site/[siteId]/pages/?tls_total=false"
																					as="/dashboard/site/${query.siteId}/pages/?tls_total=false"
																				>
																					<a tw="hover:text-red-300">link</a>
																				</Link>
																			}
																		</strong>{" "}
																		for more information.
																	</p>
																</span>
															</ReactTooltip>
														</span>
													</>
												)}
											</dd>
										</div>
									)}
								<div tw="sm:col-span-1">
									<dt tw="text-sm leading-5 font-medium text-gray-500">{OverviewLabel[4].label}</dt>
									<dd tw="mt-1 text-sm leading-5 text-gray-900">
										{forceHttps && forceHttps !== undefined ? (
											<SiteSuccessStatus text="Yes" />
										) : (
											<SiteDangerStatus text="No" />
										)}
									</dd>
								</div>
								<div tw="sm:col-span-1">
									<dt tw="text-sm leading-5 font-medium text-gray-500">{OverviewLabel[5].label}</dt>
									<dd tw="mt-1 text-sm leading-5 text-gray-900">
										{crawlFinished ? <SiteSuccessStatus text="Finished" /> : <SiteWarningStatus text="In Progress" />}
									</dd>
								</div>
							</dl>
						</div>
					</div>
				</>
			) : (
				<SitesOverviewSkeleton />
			)}
		</>
	);
};

export default SitesOverview;

SitesOverview.propTypes = {};

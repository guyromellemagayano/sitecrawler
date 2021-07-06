// React
import * as React from "react";

// External
import "twin.macro";
import { ExclamationIcon, InformationCircleIcon } from "@heroicons/react/outline";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";

// JSON
import OverviewLabel from "public/labels/components/sites/Overview.json";

// Loadable
const SiteDangerStatus = loadable(() => import("src/components/status/SiteDangerStatus"));
const SiteSuccessStatus = loadable(() => import("src/components/status/SiteSuccessStatus"));
const SiteInProgressStatus = loadable(() => import("src/components/status/SiteInProgressStatus"));
const TlsErrorModal = loadable(() => import("src/components/modals/TlsErrorModal"));

const SitesOverview = ({ verified, stats, user, isCrawlStarted, isCrawlFinished }) => {
	const [componentReady, setComponentReady] = React.useState(false);
	const [showTlsErrorModal, setShowTlsErrorModal] = React.useState(false);

	React.useEffect(() => {
		stats
			? (() => {
					setTimeout(() => {
						setComponentReady(true);
					}, 500);
			  })()
			: null;

		return setComponentReady(false);
	}, [stats]);

	return (
		<>
			<TlsErrorModal
				show={showTlsErrorModal}
				setShowModal={setShowTlsErrorModal}
				siteId={stats?.site_id}
				scanObjId={stats?.id}
			/>

			<div tw="h-full overflow-hidden rounded-lg border">
				<div tw="flex items-center pt-8 pb-4 px-5">
					{componentReady ? (
						<InformationCircleIcon tw="w-5 h-5 text-gray-900 mr-2" />
					) : (
						<span tw="w-6 h-6 mr-2">
							<Skeleton duration={2} width={15} height={15} />
						</span>
					)}
					<h2 tw="text-lg font-bold leading-7 text-gray-900">
						{componentReady ? OverviewLabel[7].label : <Skeleton duration={2} width={100} height={15} />}
					</h2>
				</div>

				<div tw="p-5">
					<dl tw="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 col-span-4">
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
													<span tw="flex flex-col items-start justify-start space-x-1">
														<button
															type="button"
															onClick={() => setShowTlsErrorModal(true)}
															tw="focus:outline-none hover:text-gray-50"
														>
															<span tw="flex items-center">
																<SiteDangerStatus text="Not Valid" />
															</span>
														</button>
													</span>
												)
											) : null
										) : (
											<SiteInProgressStatus text="Checking..." />
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
										<SiteInProgressStatus text="Checking..." />
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
										<SiteInProgressStatus text="Crawling Site..." />
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

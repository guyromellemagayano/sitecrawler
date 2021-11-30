// React
import "twin.macro";
import { InformationCircleIcon } from "@heroicons/react/outline";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";

// Enums
import { OverviewStatsLabels } from "@enums/OverviewLabels";

// Hooks
import { useComponentVisible } from "@hooks/useComponentVisible";

// Components
import SiteDangerStatus from "@components/status/SiteDangerStatus";
import SiteSuccessStatus from "@components/status/SiteSuccessStatus";
import SiteInProgressStatus from "@components/status/SiteInProgressStatus";
import TlsErrorModal from "@components/modals/TlsErrorModal";

const OverviewStats = ({
	componentReady,
	verified,
	stats,
	user,
	isCrawlStarted,
	isCrawlFinished
}) => {
	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

	return (
		<>
			<TlsErrorModal
				ref={ref}
				scanObjId={stats?.id}
				setShowModal={setIsComponentVisible}
				showModal={isComponentVisible}
				siteId={stats?.site_id}
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
						{componentReady ? (
							OverviewStatsLabels[7].label
						) : (
							<Skeleton duration={2} width={100} height={15} />
						)}
					</h2>
				</div>

				<div tw="p-5">
					<dl tw="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 col-span-4">
						<div tw="py-3 sm:col-span-1">
							<dt tw="text-sm leading-5 font-medium text-gray-500">
								{OverviewStatsLabels[1].label}
							</dt>
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
								<dt tw="text-sm leading-5 font-medium text-gray-500">
									{OverviewStatsLabels[3].label}
								</dt>
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
															onClick={() => setIsComponentVisible(!isComponentVisible)}
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
							<dt tw="text-sm leading-5 font-medium text-gray-500">
								{OverviewStatsLabels[4].label}
							</dt>
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
							<dt tw="text-sm leading-5 font-medium text-gray-500">
								{OverviewStatsLabels[5].label}
							</dt>
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

OverviewStats.propTypes = {
	componentReady: PropTypes.bool,
	isCrawlFinished: PropTypes.bool,
	isCrawlStarted: PropTypes.bool,
	stats: PropTypes.object,
	user: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
	verified: PropTypes.bool
};

OverviewStats.defaultProps = {
	componentReady: false,
	isCrawlFinished: false,
	isCrawlStarted: false,
	stats: null,
	user: null,
	verified: false
};

export default OverviewStats;

// React
import * as React from "react";

// NextJS
import Link from "next/link";

// External
import "twin.macro";
import { NextSeo } from "next-seo";
import { Scrollbars } from "react-custom-scrollbars-2";
import PropTypes from "prop-types";

// Enums
import { GlobalLabels, SiteLogoDark } from "@enums/GlobalValues";
import { OverviewLabels } from "@enums/OverviewLabels";
import { LoginLink, SitesLink } from "@enums/PageLinks";

// Hooks
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useStats, useSiteId, useUptime, useUptimeSummary } from "@hooks/useSite";
import useCrawl from "@hooks/useCrawl";
import useUser from "@hooks/useUser";

// Components
// import CurrentStatusStats from "@components/stats/CurrentStatusStats";
// import ResponseTimeStats from "@components/stats/ResponseTimeStats";
// import SitesDowntimeStats from "@components/stats/DowntimeStats";
// import SitesUptimeStats from "@components/stats/UptimeStats";
import AppLogo from "@components/logos/AppLogo";
import Breadcrumbs from "@components/breadcrumbs";
import Footer from "@components/layouts/Footer";
import HeadingOptions from "@components/options/HeadingOptions";
import ImagesStats from "@components/stats/ImagesStats";
import Layout from "@components/layouts";
import LinksStats from "@components/stats/LinksStats";
import MobileSidebarButton from "@components/buttons/MobileSidebarButton";
import OverviewStats from "@components/stats/OverviewStats";
import PagesStats from "@components/stats/PagesStats";
import SeoStats from "@components/stats/SeoStats";
import Sidebar from "@components/layouts/Sidebar";
import Stats from "@components/stats";

const Overview = ({ result }) => {
	const [componentReady, setComponentReady] = React.useState(false);
	const [disableLocalTime, setDisableLocalTime] = React.useState(false);
	const [enableSiteIdHook, setEnableSiteIdHook] = React.useState(false);
	const [scanObjId, setScanObjId] = React.useState(null);

	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

	const { user: user } = useUser({
		redirectIfFound: false,
		redirectTo: LoginLink
	});

	React.useEffect(() => {
		return user ? setEnableSiteIdHook(true) : setEnableSiteIdHook(false);
	}, [user, enableSiteIdHook]);

	const {
		selectedSiteRef,
		handleCrawl,
		currentScan,
		previousScan,
		scanCount,
		isCrawlStarted,
		isCrawlFinished
	} = useCrawl({
		siteId: enableSiteIdHook ? parseInt(result?.siteId) : null
	});

	React.useEffect(() => {
		const handleScanObjId = (scanCount, currentScan, previousScan) => {
			scanCount > 1
				? previousScan !== undefined
					? setScanObjId(previousScan?.id)
					: false
				: currentScan !== undefined
				? setScanObjId(currentScan?.id)
				: setScanObjId(previousScan?.id);

			return scanObjId;
		};

		return handleScanObjId(scanCount, currentScan, previousScan);
	}, [scanCount, currentScan, previousScan]);

	const { siteId } = useSiteId({
		querySid: enableSiteIdHook ? parseInt(result?.siteId) : null,
		redirectIfFound: false,
		redirectTo: enableSiteIdHook ? "/sites" : null
	});

	const { stats } = useStats({
		querySid: enableSiteIdHook ? parseInt(result?.siteId) : null,
		scanObjId: result?.scanObjId ?? scanObjId
	});

	const { uptime } = useUptime({
		querySid: enableSiteIdHook ? parseInt(result?.siteId) : null
	});

	const { uptimeSummary } = useUptimeSummary({
		querySid: enableSiteIdHook ? parseInt(result?.siteId) : null
	});

	React.useEffect(() => {
		user && siteId && stats && uptime && uptimeSummary && result
			? (() => {
					user?.settings?.disableLocalTime ? setDisableLocalTime(true) : setDisableLocalTime(false);

					setComponentReady(true);
			  })()
			: setComponentReady(false);

		return { user, siteId, stats, uptime, uptimeSummary };
	}, [user, siteId, stats, uptime, uptimeSummary, result]);

	return (
		<Layout user={user}>
			<NextSeo title={OverviewLabels[0].label} />

			<section tw="h-screen flex overflow-hidden bg-white">
				<Sidebar
					openSidebar={isComponentVisible}
					ref={ref}
					setOpenSidebar={setIsComponentVisible}
					user={user}
				/>

				<div ref={selectedSiteRef} tw="flex flex-col w-0 flex-1 overflow-hidden">
					<div tw="relative flex-shrink-0 flex">
						<div tw="border-b flex-shrink-0 flex">
							<MobileSidebarButton
								openSidebar={isComponentVisible}
								setOpenSidebar={setIsComponentVisible}
							/>
						</div>

						<Link href={SitesLink} passHref>
							<a tw="p-1 block w-full cursor-pointer lg:hidden">
								<AppLogo
									tw="w-48 h-auto"
									src={SiteLogoDark}
									alt={GlobalLabels[0].label}
									width={GlobalLabels[0].width}
									height={GlobalLabels[0].height}
								/>
							</a>
						</Link>
					</div>

					<Scrollbars universal>
						<main
							tw="flex-1 relative max-w-screen-2xl mx-auto overflow-y-auto focus:outline-none"
							tabIndex="0"
						>
							<div tw="w-full p-6 mx-auto">
								<div tw="max-w-full p-4">
									<Breadcrumbs
										siteId={parseInt(result?.siteId)}
										pageTitle={OverviewLabels[0].label}
									/>
									<HeadingOptions
										componentReady={componentReady}
										disableLocalTime={disableLocalTime}
										handleCrawl={handleCrawl}
										isCrawlFinished={isCrawlFinished}
										isCrawlStarted={isCrawlStarted}
										isOverview
										pageTitle={OverviewLabels[0].label}
										permissions={user?.permissions}
										scanFinishedAt={stats?.finished_at}
										scanObjId={scanObjId}
										siteId={parseInt(result?.siteId)}
										siteName={siteId?.name}
										siteUrl={siteId?.url}
										verified={siteId?.verified}
									/>
								</div>

								<div tw="max-w-full p-4 sm:px-6 md:px-4">
									<div tw="grid grid-cols-1 md:grid-cols-4 gap-8">
										<div tw="col-span-1 md:col-span-2">
											<OverviewStats
												componentReady={componentReady}
												verified={siteId?.verified}
												stats={stats}
												user={user}
												isCrawlStarted={isCrawlStarted}
												isCrawlFinished={isCrawlFinished}
											/>
										</div>

										<div tw="col-span-1 md:col-span-2">
											<Stats componentReady={componentReady} stats={stats} />
										</div>

										<div tw="col-span-1 lg:col-span-2 2xl:col-span-1">
											<LinksStats
												componentReady={componentReady}
												sid={parseInt(result?.siteId)}
												stats={stats}
											/>
										</div>

										<div tw="col-span-1 lg:col-span-2 2xl:col-span-1">
											<PagesStats
												componentReady={componentReady}
												sid={parseInt(result?.siteId)}
												stats={stats}
											/>
										</div>

										<div tw="col-span-1 lg:col-span-2 2xl:col-span-1">
											<ImagesStats
												componentReady={componentReady}
												sid={parseInt(result?.siteId)}
												stats={stats}
											/>
										</div>

										<div tw="col-span-1 lg:col-span-2 2xl:col-span-1">
											<SeoStats
												componentReady={componentReady}
												sid={parseInt(result?.siteId)}
												stats={stats}
											/>
										</div>

										{/* <div tw="col-span-1 md:col-span-4 xl:col-span-4">
												<ResponseTimeStats sid={parseInt(result?.siteId)} uptime={uptime} />
											</div>

											<div tw="flex col-span-1 md:col-span-4 xl:col-span-4">
												<div tw="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8">
													<div tw="col-span-1 md:col-span-1">
														<CurrentStatusStats sid={parseInt(result?.siteId)} uptimeSummary={uptimeSummary} />
													</div>

													<div tw="col-span-1 md:col-span-1">
														<SitesUptimeStats sid={parseInt(result?.siteId)} uptimeSummary={uptimeSummary} />
													</div>

													<div tw="col-span-1 md:col-span-1">
														<SitesDowntimeStats sid={parseInt(result?.siteId)} disableLocalTime={disableLocalTime} uptimeSummary={uptimeSummary} />
													</div>
												</div>
											</div> */}
									</div>
								</div>

								<div tw="static bottom-0 w-full mx-auto p-4">
									<Footer />
								</div>
							</div>
						</main>
					</Scrollbars>
				</div>
			</section>
		</Layout>
	);
};

Overview.propTypes = {
	scanObjId: PropTypes.number,
	siteId: PropTypes.number
};

Overview.defaultProps = {
	scanObjId: null,
	siteId: null
};

export default Overview;

export async function getServerSideProps(ctx) {
	return {
		props: {
			result: ctx.query
		}
	};
}

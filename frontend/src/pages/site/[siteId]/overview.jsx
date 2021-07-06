// React
import * as React from "react";

// NextJS
import Link from "next/link";

// External
import { NextSeo } from "next-seo";
import { Scrollbars } from "react-custom-scrollbars-2";
import { withResizeDetector } from "react-resize-detector";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import tw from "twin.macro";

// JSON
import OverviewLabel from "public/labels/pages/site/overview.json";

// Hooks
import { useStats, useSiteId, useUptime, useUptimeSummary } from "src/hooks/useSite";
import useCrawl from "src/hooks/useCrawl";
import useUser from "src/hooks/useUser";

// Layout
import Layout from "src/components/Layout";

// Components
import AppLogo from "src/components/logos/AppLogo";
import MainSidebar from "src/components/sidebar/MainSidebar";
import MobileSidebarButton from "src/components/buttons/MobileSidebarButton";
import SiteFooter from "src/components/layouts/Footer";

// Components
import SitesCurrentStatusStats from "src/components/pages/overview/CurrentStatusStats";
import SitesDowntimeStats from "src/components/pages/overview/DowntimeStats";
import SitesImagesStats from "src/components/pages/overview/ImagesStats";
import SitesLinksStats from "src/components/pages/overview/LinksStats";
import SitesOverview from "src/components/pages/overview/Overview";
import SitesPagesStats from "src/components/pages/overview/PagesStats";
import SitesResponseTimeStats from "src/components/pages/overview/ResponseTimeStats";
import SitesSeoStats from "src/components/pages/overview/SeoStats";
import SitesStats from "src/components/pages/overview/Stats";
import SitesUptimeStats from "src/components/pages/overview/UptimeStats";

// Loadable
const Breadcrumbs = loadable(() => import("src/components/breadcrumbs/Breadcrumbs"));
const HeadingOptions = loadable(() => import("src/components/headings/HeadingOptions"));
const Loader = loadable(() => import("src/components/layouts/Loader"));

const SiteOverview = ({ width, result }) => {
	const [componentReady, setComponentReady] = React.useState(false);
	const [disableLocalTime, setDisableLocalTime] = React.useState(false);
	const [openMobileSidebar, setOpenMobileSidebar] = React.useState(false);
	const [scanObjId, setScanObjId] = React.useState(null);

	const appLogoAltText = "app-logo";

	const { user: user } = useUser({
		redirectIfFound: false,
		redirectTo: "/login"
	});

	const { selectedSiteRef, handleCrawl, currentScan, previousScan, scanCount, isCrawlStarted, isCrawlFinished } =
		useCrawl({
			siteId: result?.siteId
		});

	const { siteId } = useSiteId({
		querySid: result?.siteId,
		redirectIfFound: false,
		redirectTo: "/sites"
	});

	const homePageLink = "/sites/";
	const pageTitle = OverviewLabel[0].label;

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

	const { stats } = useStats({
		querySid: result?.siteId,
		scanObjId: result?.scanObjId ?? scanObjId
	});

	const { uptime } = useUptime({
		querySid: result?.siteId
	});

	const { uptimeSummary } = useUptimeSummary({
		querySid: result?.siteId
	});

	React.useEffect(() => {
		user && siteId && uptime && uptimeSummary
			? (() => {
					setTimeout(() => {
						setComponentReady(true);
					}, 500);
			  })()
			: null;

		return setComponentReady(false);
	}, [user, siteId, uptime, uptimeSummary]);

	React.useEffect(() => {
		user?.settings?.disableLocalTime ? setDisableLocalTime(true) : setDisableLocalTime(false) ?? null;
	}, [user]);

	return (
		<Layout user={componentReady ? user : null}>
			<NextSeo title={componentReady ? pageTitle : null} />

			<section tw="h-screen flex overflow-hidden bg-white">
				<MainSidebar
					width={width}
					user={componentReady ? user : null}
					openMobileSidebar={openMobileSidebar}
					setOpenMobileSidebar={setOpenMobileSidebar}
				/>

				{componentReady ? (
					<div ref={selectedSiteRef} tw="flex flex-col w-0 flex-1 overflow-hidden">
						<div tw="relative flex-shrink-0 flex bg-white">
							<div tw="border-b flex-shrink-0 flex">
								<MobileSidebarButton
									openMobileSidebar={openMobileSidebar}
									setOpenMobileSidebar={setOpenMobileSidebar}
								/>
							</div>

							<Link href={homePageLink} passHref>
								<a tw="p-1 block w-full cursor-pointer lg:hidden">
									<AppLogo
										className={tw`w-48 h-auto`}
										src="/images/logos/site-logo-dark.svg"
										alt={appLogoAltText}
										width={230}
										height={40}
									/>
								</a>
							</Link>
						</div>

						<Scrollbars universal>
							<main tw="flex-1 relative max-w-screen-2xl mx-auto overflow-y-auto focus:outline-none" tabIndex="0">
								<div tw="w-full p-6 mx-auto">
									<div tw="max-w-full p-4">
										<Breadcrumbs siteId={result?.siteId} pageTitle={pageTitle} />
										<HeadingOptions
											isOverview
											verified={siteId?.verified}
											siteId={result?.siteId}
											siteName={siteId?.name}
											siteUrl={siteId?.url}
											scanObjId={scanObjId}
											permissions={user?.permissions}
											pageTitle={OverviewLabel[0].label}
											handleCrawl={handleCrawl}
											isCrawlStarted={isCrawlStarted}
											isCrawlFinished={isCrawlFinished}
											disableLocalTime={disableLocalTime}
											scanFinishedAt={stats?.finished_at}
										/>
									</div>

									<div tw="max-w-full p-4 sm:px-6 md:px-4">
										<div tw="grid grid-cols-1 md:grid-cols-4 gap-8">
											<div tw="col-span-1 md:col-span-2">
												<SitesOverview
													verified={siteId?.verified}
													stats={stats}
													user={user}
													isCrawlStarted={isCrawlStarted}
													isCrawlFinished={isCrawlFinished}
												/>
											</div>

											<div tw="col-span-1 md:col-span-2">
												<SitesStats stats={stats} />
											</div>

											<div tw="col-span-1 lg:col-span-2 xl:col-span-1">
												<SitesLinksStats sid={result?.siteId} stats={stats} />
											</div>

											<div tw="col-span-1 lg:col-span-2 xl:col-span-1">
												<SitesPagesStats sid={result?.siteId} stats={stats} />
											</div>

											<div tw="col-span-1 lg:col-span-2 xl:col-span-1">
												<SitesImagesStats sid={result?.siteId} stats={stats} />
											</div>

											<div tw="col-span-1 lg:col-span-2 xl:col-span-1">
												<SitesSeoStats sid={result?.siteId} stats={stats} />
											</div>

											<div tw="col-span-1 md:col-span-4 xl:col-span-2">
												<SitesResponseTimeStats sid={result?.siteId} uptime={uptime} />
											</div>

											<div tw="flex col-span-1 md:col-span-4 xl:col-span-2">
												<div tw="flex-1 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-2 gap-8">
													<div tw="col-span-1 md:col-span-1 xl:col-span-2">
														<SitesCurrentStatusStats sid={result?.siteId} uptimeSummary={uptimeSummary} />
													</div>

													<div tw="col-span-1 md:col-span-1">
														<SitesUptimeStats sid={result?.sid} uptimeSummary={uptimeSummary} />
													</div>

													<div tw="col-span-1 md:col-span-1">
														<SitesDowntimeStats sid={result?.siteId} uptimeSummary={uptimeSummary} />
													</div>
												</div>
											</div>
										</div>
									</div>

									{componentReady ? (
										<div tw="static bottom-0 w-full mx-auto p-4">
											<SiteFooter />
										</div>
									) : null}
								</div>
							</main>
						</Scrollbars>
					</div>
				) : (
					<div tw="mx-auto">
						<Loader />
					</div>
				)}
			</section>
		</Layout>
	);
};

SiteOverview.propTypes = {};

export default withResizeDetector(SiteOverview);

export async function getServerSideProps(ctx) {
	return {
		props: {
			result: ctx.query
		}
	};
}

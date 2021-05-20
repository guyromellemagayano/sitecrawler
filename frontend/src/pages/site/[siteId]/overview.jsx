// React
import { useState, useEffect } from "react";

// NextJS
import Link from "next/link";

// External
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/solid";
import { NextSeo } from "next-seo";
import { withResizeDetector } from "react-resize-detector";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import tw from "twin.macro";

// JSON
import OverviewLabel from "public/labels/pages/site/overview.json";

// Hooks
import usePostMethod from "src/hooks/usePostMethod";
import useUser from "src/hooks/useUser";
import { useScan, useStats, useSite, useSiteId } from "src/hooks/useSite";

// Layout
import Layout from "src/components/Layout";

// Components
import MainSidebar from "src/components/sidebar/MainSidebar";
import SitesImagesStats from "src/components/pages/overview/ImagesStats";
import SitesLinksStats from "src/components/pages/overview/LinksStats";
import SitesOverview from "src/components/pages/overview/Overview";
import SitesPagesStats from "src/components/pages/overview/PagesStats";
import SitesSeoStats from "src/components/pages/overview/SeoStats";
import SitesStats from "src/components/pages/overview/Stats";

// Loadable
const AppLogo = loadable(() => import("src/components/logos/AppLogo"));
const Loader = loadable(() => import("src/components/layouts/Loader"));
const MobileSidebarButton = loadable(() => import("src/components/buttons/MobileSidebarButton"));
const ProfileSkeleton = loadable(() => import("src/components/skeletons/ProfileSkeleton"));
const SiteFooter = loadable(() => import("src/components/layouts/Footer"));

const SiteOverview = ({ width, result }) => {
	const [crawlFinished, setCrawlFinished] = useState(false);
	const [disableLocalTime, setDisableLocalTime] = useState(false);
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
	const [pageLoaded, setPageLoaded] = useState(false);
	const [previousScanDataActive, setPreviousScanDataActive] = useState(true);
	const [recrawlable, setRecrawlable] = useState(false);
	const [scanObjId, setScanObjId] = useState(0);

	let currentScanResults = [];
	let homeLabel = "Home";
	let homePageLink = "/";
	let pageTitle = "";
	let previousScanResults = [];
	let reCrawlEndpoint = `/api/site/${result.siteId}/start_scan/`;
	let sitesApiEndpoint = "/api/site/?ordering=name";

	const { user: user } = useUser({
		redirectIfFound: false,
		redirectTo: "/login"
	});

	const { scan: scan } = useScan({
		querySid: result.siteId
	});

	const { site: site } = useSite({
		endpoint: sitesApiEndpoint
	});

	const { siteId: siteId } = useSiteId({
		querySid: result.siteId
	});

	if (siteId && siteId !== undefined && Object.keys(siteId).length > 0) {
		pageTitle =
			siteId.name && siteId.name !== undefined ? OverviewLabel[0].label + " - " + siteId.name : OverviewLabel[0].label;
	}

	useEffect(() => {
		if (user && user !== undefined && Object.keys(user).length > 0) {
			if (user && user !== undefined && user !== [] && Object.keys(user).length > 0) {
				if (user.settings && user.settings !== []) {
					if (user.settings.disableLocalTime) {
						setDisableLocalTime(true);
					} else {
						setDisableLocalTime(false);
					}
				}
			}
		}

		if (
			user &&
			user !== undefined &&
			Object.keys(user).length > 0 &&
			site &&
			site !== undefined &&
			Object.keys(site).length > 0 &&
			siteId &&
			siteId !== undefined &&
			Object.keys(siteId).length > 0
		) {
			setTimeout(() => {
				setPageLoaded(true);
			}, 500);
		}
	}, [user, site, siteId]);

	useEffect(() => {
		if (scan && scan !== undefined && Object.keys(scan).length > 0) {
			if (scan.results && scan.results !== undefined && Object.keys(scan.results).length > 0) {
				currentScanResults = scan.results.find((e) => e.finished_at === null);
				previousScanResults = scan.results.find((e) => e.finished_at !== null);

				if (currentScanResults !== [] || currentScanResults !== undefined) {
					if (!crawlFinished) {
						if (previousScanResults !== undefined) {
							setScanObjId(previousScanResults.id);
						} else {
							setScanObjId(currentScanResults.id);
						}
					} else {
						if (previousScanResults !== undefined) {
							setScanObjId(previousScanResults.id);
							setPreviousScanDataActive(false);
						} else {
							setScanObjId(currentScanResults.id);
						}
					}
				}
			}
		}
	}, [crawlFinished, scan, scanObjId]);

	const { stats: stats } = useStats({
		querySid: result.siteId,
		scanObjId: scanObjId && scanObjId !== undefined && scanObjId !== 0 && scanObjId,
		refreshInterval: crawlFinished ? 0 : 1000
	});

	const onCrawlHandler = async () => {
		setCrawlFinished(false);

		try {
			const response = await usePostMethod(reCrawlEndpoint);
			const data = await response.data;

			if (Math.floor(response.status / 200) === 1) {
				if (data) {
					return data;
				}
			} else {
				return null;
			}
		} catch (error) {
			return null;
		}
	};

	const crawlableHandler = (finished) => {
		if (finished) setCrawlFinished(true);

		if (
			user &&
			user !== undefined &&
			Object.keys(user).length > 0 &&
			user &&
			user.permissions !== undefined &&
			user.permissions !== [] &&
			user.permissions.includes("can_start_scan") &&
			siteId &&
			siteId !== undefined &&
			Object.keys(siteId).length > 0 &&
			siteId.verified &&
			finished
		)
			setRecrawlable(true);
		else setRecrawlable(false);
	};

	return user && user !== undefined && Object.keys(user).length > 0 && pageLoaded ? (
		<Layout user={user}>
			<NextSeo title={pageTitle} />

			<section tw="h-screen flex overflow-hidden bg-white">
				<MainSidebar
					width={width}
					user={user}
					crawlFinished={crawlFinished}
					openMobileSidebar={openMobileSidebar}
					setOpenMobileSidebar={setOpenMobileSidebar}
				/>

				<div tw="flex flex-col w-0 flex-1 overflow-hidden">
					<div tw="relative z-10 flex-shrink-0 flex h-16 lg:h-0 bg-white border-b lg:border-0 border-gray-200 lg:mb-4">
						<MobileSidebarButton openMobileSidebar={openMobileSidebar} setOpenMobileSidebar={setOpenMobileSidebar} />
						<Link href={homePageLink} passHref>
							<a tw="p-1 block w-full cursor-pointer lg:hidden">
								<AppLogo
									className={tw`mt-4 mx-auto h-8 w-auto`}
									src="/images/logos/site-logo-dark.svg"
									alt="app-logo"
								/>
							</a>
						</Link>
					</div>

					<main tw="flex-1 relative overflow-y-auto focus:outline-none" tabIndex="0">
						<div tw="w-full p-6 mx-auto min-h-screen">
							<div className="max-w-full py-4 px-8">
								<nav tw="flex pt-4 pb-8" aria-label="Breadcrumb">
									<ol tw="flex items-center space-x-4">
										<li>
											<div>
												<Link href={homePageLink} passHref>
													<a tw="text-gray-400 hover:text-gray-500">
														<HomeIcon tw="flex-shrink-0 h-5 w-5" />
														<span tw="sr-only">{homeLabel}</span>
													</a>
												</Link>
											</div>
										</li>
										<li>
											<div tw="flex items-center">
												<ChevronRightIcon tw="flex-shrink-0 h-5 w-5 text-gray-400" />
												<p aria-current="page" tw="cursor-default ml-4 text-sm font-medium text-gray-700">
													{pageTitle}
												</p>
											</div>
										</li>
									</ol>
								</nav>

								<div className="pt-4 m-auto">
									<h1 className="text-2xl leading-6 font-medium text-gray-900">{pageTitle}</h1>
								</div>
							</div>

							<div tw="max-w-full px-4 py-4 sm:px-6 md:px-8">
								<div tw="grid grid-cols-1 xl:grid-cols-2 gap-8">
									{stats && stats !== undefined && Object.keys(stats).length > 0 && (
										<SitesStats
											crawlableHandler={crawlableHandler}
											user={user}
											stats={stats}
											previousScanDataActive={previousScanDataActive}
											setPreviousScanDataActive={setPreviousScanDataActive}
										/>
									)}

									{siteId &&
										siteId !== undefined &&
										Object.keys(siteId).length > 0 &&
										scan &&
										scan !== undefined &&
										Object.keys(scan).length > 0 &&
										stats &&
										stats !== undefined &&
										Object.keys(stats).length > 0 &&
										scan &&
										scan !== undefined &&
										Object.keys(scan).length > 0 && (
											<SitesOverview
												id={siteId.id}
												verified={siteId.verified}
												finishedAt={
													scan &&
													scan !== undefined &&
													Object.keys(scan).length > 0 &&
													scan.results.find((e) => e.finished_at !== null) !== undefined
														? scan.results.find((e) => e.finished_at !== null).finished_at
														: null
												}
												forceHttps={
													scan &&
													scan !== undefined &&
													Object.keys(scan).length > 0 &&
													scan.results.find((e) => e.force_https !== null) !== undefined
														? scan.results.find((e) => e.force_https !== null).force_https
														: null
												}
												onCrawl={onCrawlHandler}
												crawlable={recrawlable}
												crawlFinished={crawlFinished}
												user={user}
												stats={stats}
												scanCount={scan.count}
												disableLocalTime={disableLocalTime}
											/>
										)}

									{stats && stats !== undefined && Object.keys(stats).length > 0 && (
										<>
											<div tw="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2 gap-8">
												<SitesLinksStats sid={result.siteId} stats={stats} />
												<SitesPagesStats sid={result.siteId} stats={stats} />
											</div>
											<div tw="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2 gap-8">
												<SitesImagesStats sid={result.siteId} stats={stats} />
												<SitesSeoStats sid={result.siteId} stats={stats} />
											</div>
										</>
									)}
								</div>
							</div>

							<div tw="static bottom-0 w-full mx-auto px-8 py-4">
								<SiteFooter />
							</div>
						</div>
					</main>
				</div>
			</section>
		</Layout>
	) : (
		<Loader />
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

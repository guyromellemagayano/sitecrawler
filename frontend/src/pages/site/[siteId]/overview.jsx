// React
import { useState, useEffect } from "react";

// NextJS
import Link from "next/link";

// External
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
import { useScan, useSite, useSiteId } from "src/hooks/useSite";

// Layout
import Layout from "src/components/Layout";

// Components
const AppLogo = loadable(() => import("src/components/logo/AppLogo"));
const ChevronRightSvg = loadable(() => import("src/components/svg/solid/ChevronRightSvg"));
const HomeSvg = loadable(() => import("src/components/svg/solid/HomeSvg"));
const Loader = loadable(() => import("src/components/layout/Loader"));
const MainSidebar = loadable(() => import("src/components/sidebar/MainSidebar"));
const MobileSidebarButton = loadable(() => import("src/components/sidebar/MobileSidebarButton"));
const ProfileSkeleton = loadable(() => import("src/components/skeletons/ProfileSkeleton"));
const SiteFooter = loadable(() => import("src/components/footer/SiteFooter"));
const SitesImagesStats = loadable(() => import("src/components/sites/ImagesStats"));
const SitesLinksStats = loadable(() => import("src/components/sites/LinksStats"));
const SitesOverview = loadable(() => import("src/components/sites/Overview"));
const SitesPagesStats = loadable(() => import("src/components/sites/PagesStats"));
const SitesSeoStats = loadable(() => import("src/components/sites/SeoStats"));
const SitesStats = loadable(() => import("src/components/sites/Stats"));

const SiteOverview = ({ width, result }) => {
	const [crawlFinished, setCrawlFinished] = useState(false);
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
	const [pageLoaded, setPageLoaded] = useState(false);
	const [recrawlable, setRecrawlable] = useState(false);
	const [scanData, setScanData] = useState([]);
	const [siteData, setSiteData] = useState([]);
	const [siteIdData, setSiteIdData] = useState([]);
	const [userData, setUserData] = useState([]);

	const pageTitle = siteIdData.name && siteIdData.name !== undefined ? "Overview - " + siteIdData.name : "Overview";
	const homeLabel = "Home";
	const homePageLink = "/";
	const reCrawlEndpoint = `/api/site/${result.siteId}/start_scan/`;
	const sitesApiEndpoint = "/api/site/?ordering=name";

	const { user: user } = useUser({
		redirectIfFound: false,
		redirectTo: "/login",
		refreshInterval: 1000
	});

	const { scan: scan } = useScan({
		querySid: result.siteId,
		refreshInterval: 1000
	});

	const { site: site } = useSite({
		endpoint: sitesApiEndpoint,
		refreshInterval: 1000
	});

	const { siteId: siteId } = useSiteId({
		querySid: result.siteId
	});

	useEffect(() => {
		if (
			user &&
			user !== undefined &&
			Object.keys(user).length > 0 &&
			scan &&
			scan !== undefined &&
			Object.keys(scan).length > 0 &&
			site &&
			site !== undefined &&
			Object.keys(site).length > 0 &&
			siteId &&
			siteId !== undefined &&
			Object.keys(siteId).length > 0
		) {
			setUserData(user);
			setScanData(scan);
			setSiteData(site);
			setSiteIdData(siteId);
		}

		if (userData && scanData && siteData && siteIdData) {
			setTimeout(() => {
				setPageLoaded(true);
			}, 500);
		}
	}, [user, scan, site, siteId]);

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
				// FIXME: report issues from here to Sentry
				return null;
			}
		} catch (error) {
			throw error.message;
		}
	};

	const crawlableHandler = (finished) => {
		if (finished) setCrawlFinished(true);

		if (
			user &&
			userData.permissions !== undefined &&
			userData.permissions.includes("can_start_scan") &&
			siteIdData &&
			siteIdData.verified &&
			finished
		)
			setRecrawlable(true);
		else setRecrawlable(false);
	};

	return pageLoaded ? (
		<Layout user={userData}>
			<NextSeo title={pageTitle} />

			<section tw="h-screen flex overflow-hidden bg-white">
				<MainSidebar
					width={width}
					user={userData}
					site={siteData}
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
							{pageLoaded ? (
								<div className="max-w-full py-4 px-8">
									<nav tw="flex pt-4 pb-8" aria-label="Breadcrumb">
										<ol tw="flex items-center space-x-4">
											<li>
												<div>
													<Link href={homePageLink} passHref>
														<a tw="text-gray-400 hover:text-gray-500">
															<HomeSvg className={tw`flex-shrink-0 h-5 w-5`} />
															<span tw="sr-only">{homeLabel}</span>
														</a>
													</Link>
												</div>
											</li>
											<li>
												<div tw="flex items-center">
													<ChevronRightSvg className={tw`flex-shrink-0 h-5 w-5 text-gray-400`} />
													<p aria-current="page" tw="cursor-default ml-4 text-sm font-medium text-gray-700">
														{pageTitle}
													</p>
												</div>
											</li>
										</ol>
									</nav>
									<div className="pt-4 m-auto">
										<h4 className="text-2xl leading-6 font-medium text-gray-900">{pageTitle}</h4>
									</div>
								</div>
							) : (
								<ProfileSkeleton />
							)}
							<div tw="max-w-full px-4 py-4 sm:px-6 md:px-8">
								<div tw="grid grid-cols-1 xl:grid-cols-2 gap-8">
									<SitesStats crawlableHandler={crawlableHandler} sid={result.siteId} user={userData} />
									<SitesOverview
										id={siteIdData.id}
										verified={siteIdData.verified}
										finishedAt={
											scanData &&
											scanData !== undefined &&
											Object.keys(scanData).length > 0 &&
											scanData.results
												.map((e) => {
													return e.finished_at;
												})
												.sort()
												.reverse()[0]
										}
										forceHttps={
											scanData &&
											scanData !== undefined &&
											Object.keys(scanData).length > 0 &&
											scanData.results
												.map((e) => {
													return e.force_https;
												})
												.sort()
												.reverse()[0]
										}
										onCrawl={onCrawlHandler}
										crawlable={recrawlable}
										crawlFinished={crawlFinished}
										user={userData}
									/>

									{userData && userData !== undefined && Object.keys(userData).length > 0 && (
										<>
											<div tw="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2 gap-8">
												<SitesLinksStats sid={result.siteId} />
												<SitesPagesStats sid={result.siteId} />
											</div>
											<div tw="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2 gap-8">
												<SitesImagesStats sid={result.siteId} />
												<SitesSeoStats sid={result.siteId} />
											</div>
										</>
									)}
								</div>
							</div>

							<div tw="static bottom-0 w-full mx-auto px-12 py-4">
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

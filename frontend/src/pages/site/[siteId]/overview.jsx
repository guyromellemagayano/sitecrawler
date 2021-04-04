// React
import { useState, useEffect } from "react";

// NextJS
import Link from "next/link";

// External
import { NextSeo } from "next-seo";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import tw from "twin.macro";

// JSON
import OverviewLabel from "public/labels/pages/site/overview.json";

// Utils
import { getCookie } from "src/utils/cookie";

// Hooks
import usePostMethod from "src/hooks/usePostMethod";
import useUser from "src/hooks/useUser";
import { useScan, useSite, useSiteId } from "src/hooks/useSite";

// Layout
import Layout from "src/components/Layout";

// Components
// const SitesImagesStats = loadable(() => import("src/components/sites/ImagesStats"));
// const SitesLinksStats = loadable(() => import("src/components/sites/LinksStats"));
// const SitesPagesStats = loadable(() => import("src/components/sites/PagesStats"));
// const SitesSeoStats = loadable(() => import("src/components/sites/SeoStats"));
const ChevronRightSvg = loadable(() => import("src/components/svg/solid/ChevronRightSvg"));
const HomeSvg = loadable(() => import("src/components/svg/solid/HomeSvg"));
const MainSidebar = loadable(() => import("src/components/sidebar/MainSidebar"));
const MobileSidebar = loadable(() => import("src/components/sidebar/MobileSidebar"));
const MobileSidebarButton = loadable(() => import("src/components/sidebar/MobileSidebarButton"));
const ProfileSkeleton = loadable(() => import("src/components/skeletons/ProfileSkeleton"));
const SiteFooter = loadable(() => import("src/components/footer/SiteFooter"));
const SitesOverview = loadable(() => import("src/components/sites/Overview"));
const SitesStats = loadable(() => import("src/components/sites/Stats"));

const SitesDashboard = ({ token, sid }) => {
	const [crawlFinished, setCrawlFinished] = useState(false);
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
	const [pageLoaded, setPageLoaded] = useState(false);
	const [recrawlable, setRecrawlable] = useState(false);
	const [scanData, setScanData] = useState([]);
	const [siteData, setSiteData] = useState([]);
	const [siteIdData, setSiteIdData] = useState([]);
	const [userData, setUserData] = useState([]);

	const pageTitle = siteIdData.name && siteIdData.name !== undefined ? "Overview | " + siteIdData.name : "Overview";
	const homeLabel = "Home";
	const homePageLink = "/";
	const reCrawlEndpoint = `/api/site/${sid}/start_scan/`;
	const sitesApiEndpoint = "/api/site/?ordering=name";

	const { user: user, userError: userError } = useUser();

	const { scan: scan, scanError: scanError } = useScan({
		querySid: sid,
	});

	const { site: site, siteError: siteError } = useSite({
		endpoint: sitesApiEndpoint,
		refreshInterval: 1000,
	});

	const { siteId: siteId, siteIdError: siteIdError } = useSiteId({
		querySid: sid,
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
			Object.keys(siteId).length > 0 &&
			token &&
			token !== undefined &&
			token !== ""
		) {
			setUserData(user);
			setScanData(scan);
			setSiteData(site);
			setSiteIdData(siteId);
		}

		if (userError || scanError || siteError || siteIdError) {
			// TODO: add generic alert here
			console.log("ERROR: " + userError ? userError : scanError ? scanError : siteError ? siteError : siteIdError);
		}

		if (userData && scanData && siteData && siteIdData) {
			setTimeout(() => {
				setPageLoaded(true);
			}, 500);
		}
	}, [user, scan, site, siteId, token]);

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
			siteData &&
			siteData.verified &&
			finished
		)
			setRecrawlable(true);
		else setRecrawlable(false);
	};

	useEffect(() => {
		if (userData && siteIdData) {
			if (
				userData.permissions !== undefined &&
				userData.permissions !== "" &&
				userData.permissions.includes("can_start_scan") &&
				siteIdData.verified
			) {
				setRecrawlable(true);
			} else setRecrawlable(false);
		}
	}, [userData, siteIdData]);

	return (
		<Layout user={userData}>
			<NextSeo title={pageTitle} />

			<section tw="h-screen flex overflow-hidden bg-white">
				{/* FIXME: fix mobile sidebar */}
				{/* <MobileSidebar show={openMobileSidebar} setShow={setOpenMobileSidebar} /> */}
				<MainSidebar user={userData} site={siteData} />

				<div tw="flex flex-col w-0 flex-1 overflow-hidden">
					<div tw="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
						<MobileSidebarButton openMobileSidebar={openMobileSidebar} setOpenMobileSidebar={setOpenMobileSidebar} />
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
										<h4 className="text-2xl leading-6 font-medium text-gray-900">{OverviewLabel[0].label}</h4>
									</div>
								</div>
							) : (
								<ProfileSkeleton />
							)}
							<div tw="max-w-full px-4 py-4 sm:px-6 md:px-8">
								<div tw="pb-4">
									<SitesStats crawlableHandler={crawlableHandler} sid={sid} user={userData} />
								</div>
								<div tw="grid grid-cols-2 grid-cols-1 xl:grid-cols-2 gap-8 pb-10">
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
									{/* <SitesLinksStats url={query} /> */}
								</div>
								{/* {userData.permissions.includes("can_see_pages") && userData.permissions.includes("can_see_images") && (
								<div tw="grid grid-cols-1 xl:grid-cols-3 gap-8">
									<SitesSeoStats url={query} />
									<SitesPagesStats url={query} />
									<SitesImagesStats url={query} />
								</div>
							)} */}
							</div>

							<div tw="static bottom-0 w-full mx-auto px-4 sm:px-6 py-4">
								<SiteFooter />
							</div>
						</div>
					</main>
				</div>
			</section>
		</Layout>
	);
};

SitesDashboard.propTypes = {};

export default SitesDashboard;

export async function getServerSideProps({ req, query }) {
	let token = getCookie("token", req);

	if (!token) {
		return {
			props: {
				notLoggedIn: true,
			},
		};
	}

	return {
		props: {
			token: token || "",
			sid: query.siteId || 0,
		},
	};
}

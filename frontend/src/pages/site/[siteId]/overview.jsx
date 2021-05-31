// React
import { useState, useEffect } from "react";

// NextJS
import Link from "next/link";

// External
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/solid";
import { NextSeo } from "next-seo";
import { withResizeDetector } from "react-resize-detector";
import PropTypes from "prop-types";
import tw from "twin.macro";

// JSON
import OverviewLabel from "public/labels/pages/site/overview.json";

// Hooks
import { useScan, useStats, useSite, useSiteId } from "src/hooks/useSite";
import usePostMethod from "src/hooks/usePostMethod";
import useUser from "src/hooks/useUser";

// Layout
import Layout from "src/components/Layout";

// Components
import AppLogo from "src/components/logos/AppLogo";
import Loader from "src/components/layouts/Loader";
import MainSidebar from "src/components/sidebar/MainSidebar";
import MobileSidebarButton from "src/components/buttons/MobileSidebarButton";
import SiteFooter from "src/components/layouts/Footer";
import SitesImagesStats from "src/components/pages/overview/ImagesStats";
import SitesLinksStats from "src/components/pages/overview/LinksStats";
import SitesOverview from "src/components/pages/overview/Overview";
import SitesPagesStats from "src/components/pages/overview/PagesStats";
import SitesSeoStats from "src/components/pages/overview/SeoStats";
import SitesStats from "src/components/pages/overview/Stats";

const SiteOverview = ({ width, result }) => {
	const [disableLocalTime, setDisableLocalTime] = useState(false);
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
	const [pageLoaded, setPageLoaded] = useState(false);
	const [currentScanResultId, setCurrentScanResultId] = useState(0);
	const [previousScanResultId, setPreviousScanResultId] = useState(0);
	const [finishedAt, setFinishedAt] = useState("");
	const [forceHttps, setForceHttps] = useState("");
	const [previousStatsData, usePreviousStatsData] = useState(false);
	const [enableCrawl, setEnableCrawl] = useState(false);

	let pageTitle = "";
	const homeLabel = "Home";
	let homePageLink = "/";

	const sitesApiEndpoint = "/api/site/?ordering=name";
	let reCrawlEndpoint = `/api/site/${result.siteId}/start_scan/`;

	let previousScanResults = [];
	let currentScanResults = [];

	const { user: user } = useUser({
		redirectIfFound: false,
		redirectTo: "/login"
	});

	const { scan: previousScan } = useScan({
		addQuery: `&finished_at__isnull=false&force_https__isnull=false`,
		querySid: result.siteId
	});

	const { scan: currentScan } = useScan({
		addQuery: `&finished_at__isnull=true&force_https__isnull=true`,
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
		if (
			currentScan &&
			currentScan !== undefined &&
			Object.keys(currentScan).length > 0 &&
			currentScan.count &&
			currentScan.count > 0
		) {
			if (
				currentScan.results &&
				currentScan.results !== undefined &&
				currentScan.results !== [] &&
				Object.keys(currentScan.results).length > 0
			) {
				currentScanResults = currentScan.results.find((e) => e.finished_at == null && e.force_https == null);

				setCurrentScanResultId(currentScanResults.id);

				if (currentScan.results.find((e) => e.finished_at == null) !== undefined) {
					setFinishedAt(currentScan.results.find((e) => e.finished_at == null).finished_at);
				}

				if (currentScan.results.find((e) => e.force_https == null) !== undefined) {
					setForceHttps(currentScan.results.find((e) => e.force_https == null).force_https);
				}

				usePreviousStatsData(false);
			}
		} else {
			if (
				previousScan &&
				previousScan !== undefined &&
				Object.keys(previousScan).length > 0 &&
				previousScan.count &&
				previousScan.count > 0
			) {
				if (
					previousScan.results &&
					previousScan.results !== undefined &&
					previousScan.results !== [] &&
					Object.keys(previousScan.results).length > 0
				) {
					previousScanResults = previousScan.results.find((e) => e.finished_at !== null && e.force_https !== null);

					setPreviousScanResultId(previousScanResults.id);

					if (previousScan.results.find((e) => e.finished_at !== null) !== undefined) {
						setFinishedAt(previousScan.results.find((e) => e.finished_at !== null).finished_at);
					}

					if (previousScan.results.find((e) => e.force_https == null) !== undefined) {
						setForceHttps(previousScan.results.find((e) => e.force_https == null).force_https);
					}

					usePreviousStatsData(true);
				}
			}
		}
	}, [previousScan, currentScan, previousScanResultId, currentScanResultId]);

	const { stats: currentStats } = useStats({
		querySid: result.siteId,
		scanObjId:
			currentScanResultId && currentScanResultId !== undefined && currentScanResultId !== 0
				? currentScanResultId
				: null,
		refreshInterval: enableCrawl ? 1000 : 0
	});

	const { stats: previousStats } = useStats({
		querySid: result.siteId,
		scanObjId:
			previousScanResultId && previousScanResultId !== undefined && previousScanResultId !== 0
				? previousScanResultId
				: null
	});

	const handleCrawl = async () => {
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

	useEffect(() => {
		console.log(previousStatsData);

		if (previousStatsData) {
			setEnableCrawl(false);
		} else {
			setEnableCrawl(true);
		}
	}, [previousStatsData]);

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

	return user && user !== undefined && Object.keys(user).length > 0 && pageLoaded ? (
		<Layout user={user}>
			<NextSeo title={pageTitle} />

			<section tw="h-screen flex overflow-hidden bg-white">
				<MainSidebar
					width={width}
					user={user}
					openMobileSidebar={openMobileSidebar}
					setOpenMobileSidebar={setOpenMobileSidebar}
				/>

				<div tw="flex flex-col w-0 flex-1 overflow-hidden">
					<div tw="relative flex-shrink-0 flex bg-white lg:mb-4">
						<div tw="border-b flex-shrink-0 flex">
							<MobileSidebarButton openMobileSidebar={openMobileSidebar} setOpenMobileSidebar={setOpenMobileSidebar} />
						</div>

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
									<SitesStats user={user} stats={previousStatsData ? previousStats : currentStats} />

									<SitesOverview
										id={
											siteId &&
											siteId !== undefined &&
											Object.keys(siteId).length > 0 &&
											siteId.id &&
											siteId.id !== null &&
											siteId.id
										}
										verified={
											siteId &&
											siteId !== undefined &&
											Object.keys(siteId).length > 0 &&
											siteId.verified &&
											siteId.verified !== null &&
											siteId.verified &&
											siteId.verified
										}
										finishedAt={finishedAt}
										forceHttps={forceHttps}
										handleCrawl={handleCrawl}
										scan={
											currentScan &&
											currentScan !== undefined &&
											Object.keys(currentScan).length > 0 &&
											currentScan.count &&
											currentScan.count > 0
												? currentScan
												: previousScan
										}
										user={user}
										stats={previousStatsData ? previousStats : currentStats}
										disableLocalTime={disableLocalTime}
										previousStatsData={previousStatsData}
									/>

									<div tw="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2 gap-8">
										<SitesLinksStats sid={result.siteId} stats={previousStatsData ? previousStats : currentStats} />
										<SitesPagesStats sid={result.siteId} stats={previousStatsData ? previousStats : currentStats} />
									</div>
									<div tw="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2 gap-8">
										<SitesImagesStats sid={result.siteId} stats={previousStatsData ? previousStats : currentStats} />
										<SitesSeoStats sid={result.siteId} stats={previousStatsData ? previousStats : currentStats} />
									</div>
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

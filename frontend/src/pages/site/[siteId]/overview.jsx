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
import { useSiteId } from "src/hooks/useSite";
import useCrawl from "src/hooks/useCrawl";
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

const OverviewSection = styled.section`
	.url-type-tooltip,
	.status-tooltip {
		max-width: 15rem;
		margin-left: 5px !important;
		padding: 1rem 1.5rem;
	}

	@media only screen and (max-width: 1400px) {
		td:first-child {
			max-width: 15rem;
		}
	}

	@media only screen and (min-width: 1600px) {
		td {
			min-width: 10rem;

			&:first-child {
				max-width: 20rem;
			}
		}

		.min-width-adjust {
			min-width: 15rem;
		}
	}
`;

const SiteOverview = ({ width, result }) => {
	const [disableLocalTime, setDisableLocalTime] = useState(false);
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);

	let pageTitle = "";
	const homeLabel = "Home";
	let homePageLink = "/";

	const { selectedSiteRef, handleCrawl, currentScan, currentStats, previousStats, isCrawlStarted, isCrawlFinished } =
		useCrawl({
			siteId: result.siteId
		});

	const { user: user } = useUser({
		redirectIfFound: false,
		redirectTo: "/login"
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
	}, [user, siteId]);

	return user && user !== undefined && Object.keys(user).length > 0 ? (
		<Layout user={user}>
			<NextSeo title={pageTitle} />

			<OverviewSection tw="h-screen flex overflow-hidden bg-white">
				<MainSidebar
					width={width}
					user={user}
					openMobileSidebar={openMobileSidebar}
					setOpenMobileSidebar={setOpenMobileSidebar}
				/>

				{siteId && siteId !== undefined && Object.keys(siteId).length > 0 ? (
					<>
						<div ref={selectedSiteRef} tw="flex flex-col w-0 flex-1 overflow-hidden">
							<div tw="relative flex-shrink-0 flex bg-white lg:mb-4">
								<div tw="border-b flex-shrink-0 flex">
									<MobileSidebarButton
										openMobileSidebar={openMobileSidebar}
										setOpenMobileSidebar={setOpenMobileSidebar}
									/>
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
											<SitesStats
												stats={
													currentScan &&
													currentScan !== undefined &&
													Object.keys(currentScan).length > 0 &&
													currentScan.count > 1
														? previousStats
														: currentStats
												}
											/>

											<SitesOverview
												verified={siteId && siteId !== undefined && Object.keys(siteId).length > 0 && siteId.verified}
												stats={isCrawlStarted && !isCrawlFinished ? currentStats : previousStats}
												user={user}
												stats={isCrawlStarted && !isCrawlFinished ? currentStats : previousStats}
												disableLocalTime={disableLocalTime}
												handleCrawl={handleCrawl}
												isCrawlStarted={isCrawlStarted}
												isCrawlFinished={isCrawlFinished}
											/>

											<div tw="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2 gap-8">
												<SitesLinksStats
													sid={result.siteId}
													stats={
														currentScan &&
														currentScan !== undefined &&
														Object.keys(currentScan).length > 0 &&
														currentScan.count > 1
															? previousStats
															: currentStats
													}
												/>
												<SitesPagesStats
													sid={result.siteId}
													stats={
														currentScan &&
														currentScan !== undefined &&
														Object.keys(currentScan).length > 0 &&
														currentScan.count > 1
															? previousStats
															: currentStats
													}
												/>
											</div>
											<div tw="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2 gap-8">
												<SitesImagesStats
													sid={result.siteId}
													stats={
														currentScan &&
														currentScan !== undefined &&
														Object.keys(currentScan).length > 0 &&
														currentScan.count > 1
															? previousStats
															: currentStats
													}
												/>
												<SitesSeoStats
													sid={result.siteId}
													stats={
														currentScan &&
														currentScan !== undefined &&
														Object.keys(currentScan).length > 0 &&
														currentScan.count > 1
															? previousStats
															: currentStats
													}
												/>
											</div>
										</div>
									</div>

									<div tw="static bottom-0 w-full mx-auto px-8 py-4">
										<SiteFooter />
									</div>
								</div>
							</main>
						</div>
					</>
				) : (
					<div tw="mx-auto">
						<Loader />
					</div>
				)}
			</OverviewSection>
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

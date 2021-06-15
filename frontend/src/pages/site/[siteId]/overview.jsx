// React
import * as React from "react";

// NextJS
import Link from "next/link";

// External
import { GlobeIcon } from "@heroicons/react/solid";
import { NextSeo } from "next-seo";
import { withResizeDetector } from "react-resize-detector";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import tw, { styled } from "twin.macro";

// JSON
import OverviewLabel from "public/labels/pages/site/overview.json";

// Hooks
import { useStats, useSiteId } from "src/hooks/useSite";
import useCrawl from "src/hooks/useCrawl";
import useUser from "src/hooks/useUser";

// Layout
import Layout from "src/components/Layout";

// Components
import AppLogo from "src/components/logos/AppLogo";
import MainSidebar from "src/components/sidebar/MainSidebar";
import MobileSidebarButton from "src/components/buttons/MobileSidebarButton";
import SiteFooter from "src/components/layouts/Footer";

// Loadable
const Breadcrumbs = loadable(() => import("src/components/breadcrumbs/Breadcrumbs"));
const Loader = loadable(() => import("src/components/layouts/Loader"));
const SitesImagesStats = loadable(() => import("src/components/pages/overview/ImagesStats"));
const SitesLinksStats = loadable(() => import("src/components/pages/overview/LinksStats"));
const SitesOverview = loadable(() => import("src/components/pages/overview/Overview"));
const SitesPagesStats = loadable(() => import("src/components/pages/overview/PagesStats"));
const SitesSeoStats = loadable(() => import("src/components/pages/overview/SeoStats"));
const SitesStats = loadable(() => import("src/components/pages/overview/Stats"));

const OverviewSection = styled.section`
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
	const [disableLocalTime, setDisableLocalTime] = React.useState(false);
	const [openMobileSidebar, setOpenMobileSidebar] = React.useState(false);

	const { user: user } = useUser({
		redirectIfFound: false,
		redirectTo: "/login"
	});

	const { selectedSiteRef, handleCrawl, scanResult, scanObjId, isCrawlStarted, isCrawlFinished } = useCrawl({
		siteId: result.siteId
	});

	const { siteId: siteId } = useSiteId({
		querySid: result.siteId
	});

	const homePageLink = "/sites";
	const pageTitle = OverviewLabel[0].label;

	const { stats } = useStats({
		querySid: result.siteId,
		scanObjId: scanObjId
	});

	React.useEffect(() => {
		user?.settings?.disableLocalTime ? setDisableLocalTime(true) : setDisableLocalTime(false) ?? null;
	}, [user]);

	return user ? (
		<Layout user={user}>
			<NextSeo title={pageTitle} />

			<OverviewSection tw="h-screen flex overflow-hidden bg-white">
				<MainSidebar
					width={width}
					user={user}
					openMobileSidebar={openMobileSidebar}
					setOpenMobileSidebar={setOpenMobileSidebar}
				/>

				{siteId ? (
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
										className={tw`mt-4 mx-auto h-8 w-auto`}
										src="/images/logos/site-logo-dark.svg"
										alt="app-logo"
									/>
								</a>
							</Link>
						</div>

						<main tw="flex-1 relative overflow-y-auto focus:outline-none" tabIndex="0">
							<div tw="w-full p-6 mx-auto">
								<div tw="max-w-full p-4">
									<Breadcrumbs siteId={result.siteId} pageTitle={pageTitle} />

									<div tw="pt-4 m-auto md:flex md:items-center md:justify-between">
										<div tw="flex-1 min-w-0">
											<h2 tw="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">{pageTitle}</h2>
											<div tw="mt-4 flex flex-col sm:flex-row sm:flex-wrap sm:mt-2 sm:space-x-6">
												<div tw="mt-2 flex items-center text-sm text-gray-500">
													<GlobeIcon tw="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
													<a
														href={siteId?.url}
														target="_blank"
														title={siteId?.name}
														className="truncate-link"
														tw="max-w-2xl text-sm leading-6 font-semibold text-gray-500 hover:text-gray-900 truncate"
													>
														{siteId?.name}
													</a>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div tw="max-w-full p-4 sm:px-6 md:px-4">
									<div tw="grid grid-cols-1 xl:grid-cols-2 gap-8">
										<SitesOverview
											verified={siteId?.verified}
											stats={stats}
											scanResult={scanResult}
											user={user}
											disableLocalTime={disableLocalTime}
											handleCrawl={handleCrawl}
											isCrawlStarted={isCrawlStarted}
											isCrawlFinished={isCrawlFinished}
										/>

										<SitesStats stats={stats} scanResult={scanResult} />

										<div tw="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2 gap-8">
											<SitesLinksStats sid={result.siteId} stats={stats} scanResult={scanResult} />
											<SitesPagesStats sid={result.siteId} stats={stats} scanResult={scanResult} />
										</div>
										<div tw="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2 gap-8">
											<SitesImagesStats sid={result.siteId} stats={stats} scanResult={scanResult} />
											<SitesSeoStats sid={result.siteId} stats={stats} scanResult={scanResult} />
										</div>
									</div>
								</div>

								<div tw="static bottom-0 w-full mx-auto px-8 py-4">
									<SiteFooter />
								</div>
							</div>
						</main>
					</div>
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

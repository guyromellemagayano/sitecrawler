// React
import { useState, useEffect } from "react";

// NextJS
import Link from "next/link";

// External
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/solid";
import { NextSeo } from "next-seo";
import { withResizeDetector } from "react-resize-detector";
import bytes from "bytes";
import loadable from "@loadable/component";
import Moment from "react-moment";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import tw, { styled } from "twin.macro";

// JSON
import PagesLabel from "public/labels/pages/site/pages.json";

// Hooks
import { useScan, useSite, useSiteId, usePageDetail } from "src/hooks/useSite";
import useUser from "src/hooks/useUser";

// Layout
import Layout from "src/components/Layout";

// Components
const AppLogo = loadable(() => import("src/components/logos/AppLogo"));
const Loader = loadable(() => import("src/components/layouts/Loader"));
const MainSidebar = loadable(() => import("src/components/sidebar/MainSidebar"));
const MobileSidebarButton = loadable(() => import("src/components/sidebar/MobileSidebarButton"));
const SiteDangerBadge = loadable(() => import("src/components/badges/SiteDangerBadge"));
const SiteSuccessBadge = loadable(() => import("src/components/badges/SiteSuccessBadge"));
const SiteFooter = loadable(() => import("src/components/layouts/Footer"));

const PageDetailDiv = styled.div`
	.url-heading {
		font-size: 1.4rem;
	}
`;

const PageDetail = ({ width, result }) => {
	const [pageDetailData, setPageDetailData] = useState([]);
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
	const [pageLoaded, setPageLoaded] = useState(false);
	const [scanData, setScanData] = useState([]);
	const [scanObjId, setScanObjId] = useState(0);
	const [siteData, setSiteData] = useState([]);
	const [siteIdData, setSiteIdData] = useState([]);
	const [userData, setUserData] = useState([]);

	const pagesPageTitle =
		siteIdData.name && siteIdData.name !== undefined
			? PagesLabel[1].label + " - " + siteIdData.name
			: PagesLabel[1].label;
	const pagesDetailPageTitle =
		pageDetailData.url && pageDetailData.url !== undefined && siteIdData.name && siteIdData.name !== undefined
			? pageDetailData.url + " | " + siteIdData.name
			: "Links Detail";
	const homeLabel = "Home";
	const homePageLink = `/site/${result.siteId}/overview`;
	const calendarStrings = {
		lastDay: "[Yesterday], dddd",
		sameDay: "[Today], dddd",
		lastWeek: "MMMM DD, YYYY",
		sameElse: "MMMM DD, YYYY"
	};
	const sitesApiEndpoint = "/api/site/?ordering=name";

	const { user: user } = useUser({
		redirectIfFound: false,
		redirectTo: "/login"
	});

	const { scan: scan } = useScan({
		querySid: result.siteId
	});

	useEffect(() => {
		if (scan && scan !== undefined && Object.keys(scan).length > 0) {
			setScanData(scan);

			if (scanData.results && scanData.results !== undefined && Object.keys(scanData.results).length > 0) {
				setScanObjId(
					scanData.results
						.map((e) => {
							return e.id;
						})
						.sort()
						.reverse()[0]
				);
			}
		}
	});

	const { pageDetail: pageDetail } = usePageDetail({
		querySid: result.siteId,
		scanObjId: scanObjId,
		linkId: result.pageId
	});

	const { site: site } = useSite({
		endpoint: sitesApiEndpoint
	});

	const { siteId: siteId } = useSiteId({
		querySid: result.siteId
	});

	useEffect(() => {
		if (
			user &&
			user !== undefined &&
			Object.keys(user).length > 0 &&
			site &&
			site !== undefined &&
			Object.keys(site).length > 0 &&
			site &&
			site !== undefined &&
			Object.keys(site).length > 0 &&
			pageDetail &&
			pageDetail !== undefined &&
			Object.keys(pageDetail).length > 0
		) {
			setUserData(user);
			setSiteData(site);
			setSiteIdData(siteId);
			setPageDetailData(pageDetail);
		}

		if (userData && siteData && siteIdData && pageDetailData) {
			setTimeout(() => {
				setPageLoaded(true);
			}, 500);
		}
	}, [user, site, siteId, pageDetail]);

	return pageLoaded ? (
		<Layout user={userData}>
			<NextSeo title={pagesDetailPageTitle} />

			<PageDetailDiv tw="h-screen flex overflow-hidden bg-white">
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
						<div tw="w-full p-6 mx-auto grid gap-16 xl:grid-cols-1 2xl:grid-cols-3 lg:col-gap-5 lg:row-gap-12">
							<div tw="lg:col-span-2 xl:col-span-2 xl:pr-8 xl:border-r xl:border-gray-200">
								<div tw="max-w-full py-4 px-8">
									{pageLoaded ? (
										<>
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
															<Link href={`/site/${result.siteId}/pages`} passHref>
																<a aria-current="page" tw="cursor-pointer ml-4 text-sm text-gray-700">
																	{pagesPageTitle}
																</a>
															</Link>
														</div>
													</li>
													<li>
														<div tw="flex items-center">
															<ChevronRightIcon tw="flex-shrink-0 h-5 w-5 text-gray-400" />
															<p aria-current="page" tw="cursor-default ml-4 text-sm font-medium text-gray-700">
																{pageDetailData.url}
															</p>
														</div>
													</li>
												</ol>
											</nav>
											<div tw="pt-4 m-auto">
												<h4 tw="flex items-center text-2xl leading-8 font-medium text-gray-900 leading-8 break-all">
													{pageDetailData.url} - {siteIdData.name}
												</h4>
											</div>
										</>
									) : (
										<ProfileSkeleton />
									)}
								</div>
								<div tw="max-w-4xl py-6 px-8">
									<div tw="bg-white border border-gray-300 overflow-hidden sm:rounded-lg py-2 px-1">
										<div tw="px-4 py-5 sm:p-0">
											<dl>
												<div tw="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
													<dt tw="text-sm leading-5 font-medium text-gray-500">Created at</dt>
													<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
														{!user.settings.disableLocalTime ? (
															<>
																<Moment calendar={calendarStrings} date={pageDetailData.created_at} local />
																&nbsp;
																<Moment date={pageDetailData.created_at} format="hh:mm:ss A" local />
															</>
														) : (
															<>
																<Moment calendar={calendarStrings} date={pageDetailData.created_at} utc />
																&nbsp;
																<Moment date={pageDetailData.created_at} format="hh:mm:ss A" utc />
															</>
														)}
													</dd>
												</div>
												<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
													<dt tw="text-sm leading-5 font-medium text-gray-500">Page Size</dt>
													<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
														{pageDetailData.size_total !== null &&
														pageDetailData.size_total !== undefined &&
														pageDetailData.size_total !== ""
															? bytes(pageDetailData.size_total, {
																	thousandsSeparator: " ",
																	unitSeparator: " "
															  })
															: 0}
													</dd>
												</div>
												<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
													<dt tw="text-sm leading-5 font-medium text-gray-500">Total Size of Images</dt>
													<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
														{pageDetailData.size_images !== null &&
														pageDetailData.size_images !== undefined &&
														pageDetailData.size_images !== ""
															? bytes(pageDetailData.size_images, {
																	thousandsSeparator: " ",
																	unitSeparator: " "
															  })
															: 0}
													</dd>
												</div>
												<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
													<dt tw="text-sm leading-5 font-medium text-gray-500">Total Size of Scripts</dt>
													<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
														{pageDetailData.size_scripts !== null &&
														pageDetailData.size_scripts !== undefined &&
														pageDetailData.size_scripts !== ""
															? bytes(pageDetailData.size_scripts, {
																	thousandsSeparator: " ",
																	unitSeparator: " "
															  })
															: 0}
													</dd>
												</div>
												<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
													<dt tw="text-sm leading-5 font-medium text-gray-500">Total Size of Stylesheets</dt>
													<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
														{pageDetailData.size_stylesheets !== null &&
														pageDetailData.size_stylesheets !== undefined &&
														pageDetailData.size_stylesheets !== ""
															? bytes(pageDetailData.size_stylesheets, {
																	thousandsSeparator: " ",
																	unitSeparator: " "
															  })
															: 0}
													</dd>
												</div>
												<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
													<dt tw="text-sm leading-5 font-medium text-gray-500">Total Number of Working Images</dt>
													<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
														{pageDetailData.num_ok_images !== null &&
														pageDetailData.num_ok_images !== undefined &&
														pageDetailData.num_ok_images !== "" &&
														pageDetailData.num_ok_images !== 0
															? pageDetailData.num_ok_images
															: 0}
													</dd>
												</div>
												<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
													<dt tw="text-sm leading-5 font-medium text-gray-500">Total Number of Non-Working Images</dt>
													<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
														{pageDetailData.num_non_ok_images !== null &&
														pageDetailData.num_non_ok_images !== undefined &&
														pageDetailData.num_non_ok_images !== "" &&
														pageDetailData.num_non_ok_images !== 0
															? pageDetailData.num_non_ok_images
															: 0}
													</dd>
												</div>
											</dl>
										</div>
									</div>
								</div>

								<div tw="max-w-4xl py-6 px-8">
									<div tw="bg-white border border-gray-300 overflow-hidden sm:rounded-lg py-2 px-1">
										<div tw="px-4 py-5 sm:p-0">
											<dl>
												<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
													<dt tw="text-sm leading-5 font-medium text-gray-500">TLS Status - Page</dt>
													<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
														{pageDetailData.tls_status !== null &&
														pageDetailData.tls_status !== undefined &&
														pageDetailData.tls_status !== "" &&
														pageDetailData.tls_status !== 0 ? (
															<SiteSuccessBadge text={"OK"} />
														) : pageDetailData.tls_status === "NONE" ? (
															<SiteDangerBadge text={"NONE"} />
														) : (
															<SiteDangerBadge text={"ERROR"} />
														)}
													</dd>
												</div>

												<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
													<dt tw="text-sm leading-5 font-medium text-gray-500">TLS Status - Resources</dt>
													<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
														{pageDetailData.tls_total !== null &&
														pageDetailData.tls_total !== undefined &&
														pageDetailData.tls_total !== "" &&
														pageDetailData.tls_total !== 0 &&
														pageDetailData.tls_total == true ? (
															<SiteSuccessBadge text={"OK"} />
														) : (
															<SiteDangerBadge text={"ERROR"} />
														)}
													</dd>
												</div>

												<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
													<dt tw="text-sm leading-5 font-medium text-gray-500">Total Number of Non-Secured Images</dt>
													<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
														{pageDetailData.num_non_tls_images !== null &&
														pageDetailData.num_non_tls_images !== undefined &&
														pageDetailData.num_non_tls_images !== "" &&
														pageDetailData.num_non_tls_images !== 0
															? pageDetailData.num_non_tls_images
															: 0}
													</dd>
												</div>

												<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
													<dt tw="text-sm leading-5 font-medium text-gray-500">Total Number of Non-Secured Scripts</dt>
													<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
														{pageDetailData.num_non_tls_scripts !== null &&
														pageDetailData.num_non_tls_scripts !== undefined &&
														pageDetailData.num_non_tls_scripts !== "" &&
														pageDetailData.num_non_tls_scripts !== 0
															? pageDetailData.num_non_tls_scripts
															: 0}
													</dd>
												</div>

												<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
													<dt tw="text-sm leading-5 font-medium text-gray-500">
														Total Number of Non-Secured Stylesheets
													</dt>
													<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
														{pageDetailData.num_non_tls_stylesheets !== null &&
														pageDetailData.num_non_tls_stylesheets !== undefined &&
														pageDetailData.num_non_tls_stylesheets !== "" &&
														pageDetailData.num_non_tls_stylesheets !== 0
															? pageDetailData.num_non_tls_stylesheets
															: 0}
													</dd>
												</div>
											</dl>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div tw="static bottom-0 w-full mx-auto px-12 py-4 bg-white border-t border-gray-200">
							<SiteFooter />
						</div>
					</main>
				</div>
			</PageDetailDiv>
		</Layout>
	) : (
		<Loader />
	);
};

PageDetail.propTypes = {};

export default withResizeDetector(PageDetail);

export async function getServerSideProps(context) {
	return {
		props: {
			result: context.query
		}
	};
}

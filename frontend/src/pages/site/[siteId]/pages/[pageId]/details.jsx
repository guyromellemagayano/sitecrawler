// React
import { useState, useEffect } from "react";

// NextJS
import Link from "next/link";

// External
import { ChevronRightIcon, HomeIcon, LinkIcon } from "@heroicons/react/solid";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { NextSeo } from "next-seo";
import { withResizeDetector } from "react-resize-detector";
import bytes from "bytes";
import Moment from "react-moment";
import PropTypes from "prop-types";
import tw, { styled } from "twin.macro";

// JSON
import PagesLabel from "public/labels/pages/site/pages.json";

// Hooks
import { useScan, useSite, useSiteId, usePageDetail, usePageDetailLink } from "src/hooks/useSite";
import useUser from "src/hooks/useUser";

// Layout
import Layout from "src/components/Layout";

// Components
import AppLogo from "src/components/logos/AppLogo";
import Loader from "src/components/layouts/Loader";
import MainSidebar from "src/components/sidebar/MainSidebar";
import MobileSidebarButton from "src/components/buttons/MobileSidebarButton";
import SiteDangerBadge from "src/components/badges/SiteDangerBadge";
import SiteSuccessBadge from "src/components/badges/SiteSuccessBadge";
import SiteFooter from "src/components/layouts/Footer";

const PageDetailDiv = styled.div`
	.url-heading {
		font-size: 1.4rem;
	}
`;

const PageDetail = ({ width, result }) => {
	const [copied, setCopied] = useState(false);
	const [copyValue, setCopyValue] = useState(null);
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
	const [pageLoaded, setPageLoaded] = useState(false);
	const [scanObjId, setScanObjId] = useState(0);

	let pageTitle = "";
	let detailPageTitle = "";

	const homeLabel = "Home";
	const homePageLink = `/site/${result.siteId}/overview`;

	const sitesApiEndpoint = "/api/site/?ordering=name";
	const brokenLinksQuery = "tls_status__neq=OK";

	let previousScanResults = [];
	let currentScanResults = [];

	const calendarStrings = {
		lastDay: "[Yesterday], dddd",
		sameDay: "[Today], dddd",
		lastWeek: "MMMM DD, YYYY",
		sameElse: "MMMM DD, YYYY"
	};

	const { user: user } = useUser({
		redirectIfFound: false,
		redirectTo: "/login"
	});

	const { scan: scan } = useScan({
		querySid: result.siteId
	});

	useEffect(() => {
		if (scan && scan !== undefined && Object.keys(scan).length > 0) {
			if (scan.results && scan.results !== undefined && Object.keys(scan.results).length > 0) {
				currentScanResults = scan.results.find((e) => e.finished_at === null);
				previousScanResults = scan.results.find((e) => e.finished_at !== null);

				if (currentScanResults !== [] || currentScanResults !== undefined) {
					if (previousScanResults !== undefined) {
						setScanObjId(previousScanResults.id);
					} else {
						setScanObjId(currentScanResults.id);
					}
				}
			}
		}
	}, [scan, scanObjId]);

	const { pageDetail: pageDetail } = usePageDetail({
		querySid: result.siteId,
		scanObjId: scanObjId,
		linkId: result.pageId
	});

	const { pageDetailLink: pageDetailLink } = usePageDetailLink({
		addQuery: brokenLinksQuery,
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

	if (
		siteId &&
		siteId !== undefined &&
		Object.keys(siteId).length > 0 &&
		pageDetail &&
		pageDetail !== undefined &&
		Object.keys(pageDetail).length > 0
	) {
		pageTitle =
			siteId && siteId !== undefined && Object.keys(siteId).length > 0 && siteId.name && siteId.name !== undefined
				? PagesLabel[1].label + " - " + siteId.name
				: PagesLabel[1].label;

		detailPageTitle =
			pageDetail &&
			pageDetail !== undefined &&
			Object.keys(pageDetail).length > 0 &&
			pageDetail.url &&
			pageDetail.url !== undefined &&
			siteId &&
			siteId !== undefined &&
			siteId.name &&
			siteId.name !== undefined
				? pageDetail.url + " | " + siteId.name
				: "Links Detail";
	}

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
			Object.keys(pageDetail).length > 0 &&
			pageDetailLink &&
			pageDetailLink !== undefined &&
			Object.keys(pageDetailLink).length > 0
		) {
			setTimeout(() => {
				setPageLoaded(true);
			}, 500);
		}
	}, [user, site, siteId, pageDetail, pageDetailLink]);

	const handleUrlCopy = (e) => {
		setCopyValue(e);
		setCopied(true);
	};

	return user && user !== undefined && Object.keys(user).length > 0 && pageLoaded ? (
		<Layout user={user}>
			<NextSeo title={detailPageTitle} />

			<PageDetailDiv tw="h-screen flex overflow-hidden bg-white">
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
						<div tw="w-full p-6 mx-auto grid gap-16 xl:grid-cols-1 2xl:grid-cols-3 lg:col-span-5 lg:gap-y-12">
							<div tw="lg:col-span-2 xl:col-span-2 xl:pr-8 xl:border-r xl:border-gray-200">
								<div tw="max-w-full py-4 px-8">
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
															{pageTitle}
														</a>
													</Link>
												</div>
											</li>

											{pageDetail && pageDetail !== undefined && Object.keys(pageDetail).length > 0 && (
												<li>
													<div tw="flex items-center">
														<ChevronRightIcon tw="flex-shrink-0 h-5 w-5 text-gray-400" />
														<p aria-current="page" tw="cursor-default ml-4 text-sm font-medium text-gray-700">
															{pageDetail.url}
														</p>
													</div>
												</li>
											)}
										</ol>
									</nav>

									{pageDetail &&
										pageDetail !== undefined &&
										Object.keys(pageDetail).length > 0 &&
										siteId &&
										siteId !== undefined &&
										Object.keys(siteId).length > 0 && (
											<div tw="pt-4 m-auto">
												<h4 tw="flex items-center text-2xl leading-8 font-medium text-gray-900 break-all">
													{pageDetail.url} - {siteId.name}
												</h4>
											</div>
										)}
								</div>
								<div tw="max-w-4xl py-6 px-8">
									<div tw="bg-white border border-gray-300 overflow-hidden sm:rounded-lg py-2 px-1">
										<div tw="px-4 py-5 sm:p-0">
											<dl>
												<div tw="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
													<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabel[7].label}</dt>
													<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
														{pageDetail &&
															pageDetail !== undefined &&
															Object.keys(pageDetail).length > 0 &&
															(user &&
															user !== undefined &&
															Object.keys(user).length > 0 &&
															!user.settings.disableLocalTime ? (
																<>
																	<Moment calendar={calendarStrings} date={pageDetail.created_at} local />
																	&nbsp;
																	<Moment date={pageDetail.created_at} format="hh:mm:ss A" local />
																</>
															) : (
																<>
																	<Moment calendar={calendarStrings} date={pageDetail.created_at} utc />
																	&nbsp;
																	<Moment date={pageDetail.created_at} format="hh:mm:ss A" utc />
																</>
															))}
													</dd>
												</div>
												<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
													<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabel[8].label}</dt>
													<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
														{pageDetail &&
														pageDetail !== undefined &&
														Object.keys(pageDetail).length > 0 &&
														(pageDetail.size_total !== null ||
															(pageDetail.size_total !== undefined && pageDetail.size_total !== ""))
															? bytes(pageDetail.size_total, {
																	thousandsSeparator: " ",
																	unitSeparator: " "
															  })
															: 0}
													</dd>
												</div>
												<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
													<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabel[9].label}</dt>
													<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
														{pageDetail &&
														pageDetail !== undefined &&
														Object.keys(pageDetail).length > 0 &&
														pageDetail.size_images !== null &&
														pageDetail.size_images !== undefined &&
														pageDetail.size_images !== ""
															? bytes(pageDetail.size_images, {
																	thousandsSeparator: " ",
																	unitSeparator: " "
															  })
															: 0}
													</dd>
												</div>
												<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
													<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabel[10].label}</dt>
													<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
														{pageDetail &&
														pageDetail !== undefined &&
														Object.keys(pageDetail).length > 0 &&
														pageDetail.size_scripts !== null &&
														pageDetail.size_scripts !== undefined &&
														pageDetail.size_scripts !== ""
															? bytes(pageDetail.size_scripts, {
																	thousandsSeparator: " ",
																	unitSeparator: " "
															  })
															: 0}
													</dd>
												</div>
												<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
													<dt tw="text-sm leading-5 font-medium text-gray-500">Total Size of Stylesheets</dt>
													<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
														{pageDetail &&
														pageDetail !== undefined &&
														Object.keys(pageDetail).length > 0 &&
														pageDetail.size_stylesheets !== null &&
														pageDetail.size_stylesheets !== undefined &&
														pageDetail.size_stylesheets !== ""
															? bytes(pageDetail.size_stylesheets, {
																	thousandsSeparator: " ",
																	unitSeparator: " "
															  })
															: 0}
													</dd>
												</div>
												<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
													<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabel[11].label}</dt>
													<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
														{pageDetail &&
														pageDetail !== undefined &&
														Object.keys(pageDetail).length > 0 &&
														pageDetail.num_ok_images !== null &&
														pageDetail.num_ok_images !== undefined &&
														pageDetail.num_ok_images !== "" &&
														pageDetail.num_ok_images > 0
															? pageDetail.num_ok_images
															: 0}
													</dd>
												</div>
												<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
													<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabel[12].label}</dt>
													<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
														{pageDetail &&
														pageDetail !== undefined &&
														Object.keys(pageDetail).length > 0 &&
														pageDetail.num_non_ok_images !== null &&
														pageDetail.num_non_ok_images !== undefined &&
														pageDetail.num_non_ok_images !== "" &&
														pageDetail.num_non_ok_images > 0
															? pageDetail.num_non_ok_images
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
													<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabel[13].label}</dt>
													<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
														{pageDetail &&
														pageDetail !== undefined &&
														Object.keys(pageDetail).length > 0 &&
														pageDetail.tls_status !== null &&
														pageDetail.tls_status !== undefined &&
														pageDetail.tls_status !== "" &&
														pageDetail.tls_status > 0 ? (
															<SiteSuccessBadge text={"OK"} />
														) : pageDetail.tls_status === "NONE" ? (
															<SiteDangerBadge text={"NONE"} />
														) : (
															<SiteDangerBadge text={"ERROR"} />
														)}
													</dd>
												</div>

												<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
													<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabel[15].label}</dt>
													<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
														{pageDetail &&
															pageDetail !== undefined &&
															Object.keys(pageDetail).length > 0 &&
															(pageDetail.tls_total !== null &&
															pageDetail.tls_total !== undefined &&
															pageDetail.tls_total !== "" &&
															pageDetail.tls_total > 0 &&
															pageDetail.tls_total == true ? (
																<SiteSuccessBadge text={"OK"} />
															) : (
																<SiteDangerBadge text={"ERROR"} />
															))}
													</dd>
												</div>

												<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
													<dt tw="text-sm leading-5 font-medium text-gray-500">Total Number of Non-Secured Images</dt>
													<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
														{pageDetail &&
															pageDetail !== undefined &&
															Object.keys(pageDetail).length > 0 &&
															(pageDetail.num_non_tls_images !== null &&
															pageDetail.num_non_tls_images !== undefined &&
															pageDetail.num_non_tls_images !== "" &&
															pageDetail.num_non_tls_images > 0
																? pageDetail.num_non_tls_images
																: 0)}
													</dd>
												</div>

												<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
													<dt tw="text-sm leading-5 font-medium text-gray-500">Total Number of Non-Secured Scripts</dt>
													<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
														{pageDetail &&
															pageDetail !== undefined &&
															Object.keys(pageDetail).length > 0 &&
															(pageDetail.num_non_tls_scripts !== null &&
															pageDetail.num_non_tls_scripts !== undefined &&
															pageDetail.num_non_tls_scripts !== "" &&
															pageDetail.num_non_tls_scripts > 0
																? pageDetail.num_non_tls_scripts
																: 0)}
													</dd>
												</div>

												<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
													<dt tw="text-sm leading-5 font-medium text-gray-500">
														Total Number of Non-Secured Stylesheets
													</dt>
													<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
														{pageDetail &&
															pageDetail !== undefined &&
															Object.keys(pageDetail).length > 0 &&
															(pageDetail.num_non_tls_stylesheets !== null &&
															pageDetail.num_non_tls_stylesheets !== undefined &&
															pageDetail.num_non_tls_stylesheets !== "" &&
															pageDetail.num_non_tls_stylesheets > 0
																? pageDetail.num_non_tls_stylesheets
																: 0)}
													</dd>
												</div>
											</dl>
										</div>
									</div>
								</div>

								{pageDetailLink &&
									pageDetailLink !== undefined &&
									Object.keys(pageDetailLink).length > 0 &&
									pageDetailLink.count &&
									pageDetailLink.count !== undefined &&
									pageDetailLink.count !== null &&
									pageDetailLink.count > 0 &&
									pageDetailLink.results &&
									pageDetailLink.results !== undefined && (
										<div tw="max-w-4xl py-6 px-8">
											<div tw="bg-white border border-gray-300 overflow-hidden sm:rounded-lg py-2 px-1">
												<div tw="px-4 py-5 sm:p-0">
													<dl>
														<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
															<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabel[14].label}</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																<ul>
																	{pageDetailLink.results.map((val, key) => {
																		return (
																			<li key={key} tw="pb-3 flex items-center justify-between text-sm leading-5">
																				<div tw="w-0 flex-1 flex items-center">
																					<LinkIcon tw="flex-shrink-0 h-5 w-5 text-gray-400" />
																					<span tw="ml-2 flex-1 w-0">
																						<a
																							href={val.url}
																							target="_blank"
																							title={val.url}
																							tw="break-words block p-2 font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out"
																						>
																							{val.url}
																						</a>
																					</span>
																				</div>
																				<div tw="ml-4 flex-shrink-0">
																					<CopyToClipboard onCopy={handleUrlCopy} text={val.url}>
																						<button tw="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out">
																							{copied && copyValue === val.url ? "Copied!" : "Copy URL"}
																						</button>
																					</CopyToClipboard>
																				</div>
																			</li>
																		);
																	})}
																</ul>
															</dd>
														</div>
													</dl>
												</div>
											</div>
										</div>
									)}
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

// React
import * as React from "react";

// NextJS
import Link from "next/link";

// External
import { LinkIcon } from "@heroicons/react/solid";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { NextSeo } from "next-seo";
import { Scrollbars } from "react-custom-scrollbars-2";
import { withResizeDetector } from "react-resize-detector";
import bytes from "bytes";
import dayjs from "dayjs";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import tw from "twin.macro";

// JSON
import PagesLabel from "public/labels/pages/site/pages.json";

// Hooks
import { useSiteId, usePageDetail, usePageDetailLink } from "src/hooks/useSite";
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
const SiteDangerBadge = loadable(() => import("src/components/badges/SiteDangerBadge"));
const SiteSuccessBadge = loadable(() => import("src/components/badges/SiteSuccessBadge"));

const PageDetail = (props) => {
	const [componentReady, setComponentReady] = React.useState(false);
	const [copied, setCopied] = React.useState(false);
	const [copyValue, setCopyValue] = React.useState(null);
	const [enableSiteIdHook, setEnableSiteIdHook] = React.useState(false);
	const [openMobileSidebar, setOpenMobileSidebar] = React.useState(false);
	const [scanObjId, setScanObjId] = React.useState(null);

	const calendar = require("dayjs/plugin/calendar");
	const timezone = require("dayjs/plugin/timezone");
	const utc = require("dayjs/plugin/utc");

	dayjs.extend(calendar);
	dayjs.extend(utc);
	dayjs.extend(timezone);

	const appLogoAltText = "app-logo";
	const brokenLinksQuery = "tls_status__neq=OK";
	const homePageLink = "/sites/";

	const calendarStrings = {
		lastDay: "[Yesterday], dddd [at] hh:mm:ss A",
		lastWeek: "MMMM DD, YYYY [at] hh:mm:ss A",
		sameDay: "[Today], dddd [at] hh:mm:ss A",
		sameElse: "MMMM DD, YYYY [at] hh:mm:ss A"
	};

	const { user } = useUser({
		redirectIfFound: false,
		redirectTo: "/login"
	});

	React.useEffect(() => {
		return user
			? (() => {
					setEnableSiteIdHook(true);
			  })()
			: null;
	}, [user, enableSiteIdHook]);

	const { currentScan, previousScan } = useCrawl({
		siteId: enableSiteIdHook ? props.result.siteId : null
	});

	const { siteId } = useSiteId({
		querySid: enableSiteIdHook ? props.result.siteId : null,
		redirectIfFound: false,
		redirectTo: enableSiteIdHook ? homePageLink : null
	});

	React.useEffect(() => {
		currentScan ? setScanObjId(currentScan?.id) : setScanObjId(previousScan?.id);
	}, [currentScan, previousScan]);

	const { pageDetail } = usePageDetail({
		querySid: enableSiteIdHook ? props.result.siteId : null,
		scanObjId: enableSiteIdHook ? scanObjId : null,
		linkId: enableSiteIdHook ? props.result.pageId : null
	});

	const pageDetailPageTitle = PagesLabel[1].label + " - " + siteId?.name + " - " + pageDetail?.url;

	const { pageDetailLink } = usePageDetailLink({
		addQuery: enableSiteIdHook ? brokenLinksQuery : null,
		querySid: enableSiteIdHook ? props.result.siteId : null,
		scanObjId: enableSiteIdHook ? scanObjId : null,
		pageId: enableSiteIdHook ? props.result.pageId : null
	});

	React.useEffect(() => {
		user && siteId && pageDetail && pageDetailLink
			? (() => {
					setTimeout(() => {
						setComponentReady(true);
					}, 500);
			  })()
			: null;

		return setComponentReady(false);
	}, [user, siteId, pageDetail, pageDetailLink]);

	const handleUrlCopy = (e) => {
		setCopyValue(e);
		setCopied(true);
	};

	return (
		<Layout user={user}>
			<NextSeo title={componentReady ? pageDetailPageTitle : null} />

			<section tw="h-screen flex overflow-hidden bg-white">
				<MainSidebar
					width={props.width}
					user={user}
					openMobileSidebar={openMobileSidebar}
					setOpenMobileSidebar={setOpenMobileSidebar}
				/>

				{componentReady ? (
					<div tw="flex flex-col w-0 flex-1 overflow-hidden">
						<div tw="relative flex-shrink-0 flex bg-white">
							<div tw="border-b flex-shrink-0 flex">
								<MobileSidebarButton
									openMobileSidebar={openMobileSidebar}
									setOpenMobileSidebar={setOpenMobileSidebar}
								/>
							</div>

							{/* TODO: Turn this into a single component */}
							<Link href={homePageLink} passHref>
								<a tw="p-1 block w-full cursor-pointer lg:hidden">
									<AppLogo
										tw="flex justify-start w-60 h-12 mb-8"
										src="/images/logos/site-logo-dark.svg"
										alt={appLogoAltText}
										width={320}
										height={60}
									/>
								</a>
							</Link>
						</div>

						<Scrollbars universal>
							<main tw="flex-1 relative z-0 overflow-y-auto focus:outline-none" tabIndex="0">
								<div tw="max-w-screen-2xl mx-auto p-4 sm:px-6 md:px-8">
									<div tw="w-full py-6 mx-auto grid gap-16 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-12">
										<div tw="lg:col-span-2 xl:col-span-2 xl:pr-8 xl:border-r xl:border-gray-200">
											<div tw="max-w-full p-4">
												<Breadcrumbs
													isPages
													siteId={props.result.siteId}
													dataId={props.result.pageId}
													pageTitle={PagesLabel[1].label}
													pageDetailTitle={pageDetail?.url}
												/>

												<div tw="pt-4 m-auto">
													{pageDetail?.url ? (
														<h2 tw="flex items-center text-2xl leading-7 font-bold text-gray-900 break-all sm:text-3xl">
															{pageDetail?.url}
														</h2>
													) : (
														<Skeleton duration={2} width={300} />
													)}
												</div>
											</div>

											<div tw="max-w-4xl py-6 px-4">
												<div tw="overflow-hidden py-2">
													<div tw="px-4 py-5 sm:p-0">
														<dl>
															<div tw="sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
																<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabel[7].label}</dt>
																<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																	{componentReady ? (
																		<span tw="space-x-2">
																			<span tw="text-sm">
																				{!user?.settings?.disableLocalTime
																					? dayjs(pageDetail?.created_at).calendar(null, calendarStrings)
																					: dayjs.utc(pageDetail?.created_at).calendar(null, calendarStrings)}
																			</span>
																			<span tw="font-medium">
																				({!user?.settings?.disableLocalTime ? dayjs.tz.guess() : "UTC"})
																			</span>
																		</span>
																	) : (
																		<Skeleton duration={2} width={176.7} />
																	)}
																</dd>
															</div>
															<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
																<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabel[8].label}</dt>
																<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																	{componentReady ? (
																		bytes(pageDetail?.size_total, {
																			thousandsSeparator: " ",
																			unitSeparator: " "
																		})
																	) : (
																		<Skeleton duration={2} width={75} />
																	)}
																</dd>
															</div>
															<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
																<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabel[9].label}</dt>
																<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																	{componentReady ? (
																		bytes(pageDetail?.size_images, {
																			thousandsSeparator: " ",
																			unitSeparator: " "
																		})
																	) : (
																		<Skeleton duration={2} width={75} />
																	)}
																</dd>
															</div>
															<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
																<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabel[10].label}</dt>
																<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																	{componentReady ? (
																		bytes(pageDetail?.size_scripts, {
																			thousandsSeparator: " ",
																			unitSeparator: " "
																		})
																	) : (
																		<Skeleton duration={2} width={75} />
																	)}
																</dd>
															</div>
															<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
																<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabel[18].label}</dt>
																<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																	{componentReady ? (
																		bytes(pageDetail?.size_stylesheets, {
																			thousandsSeparator: " ",
																			unitSeparator: " "
																		})
																	) : (
																		<Skeleton duration={2} width={75} />
																	)}
																</dd>
															</div>
															<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
																<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabel[11].label}</dt>
																<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																	{componentReady ? pageDetail?.num_ok_images : <Skeleton duration={2} width={45} />}
																</dd>
															</div>
															<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
																<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabel[12].label}</dt>
																<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																	{componentReady ? (
																		pageDetail?.num_non_ok_images
																	) : (
																		<Skeleton duration={2} width={45} />
																	)}
																</dd>
															</div>
														</dl>
													</div>
												</div>
											</div>

											<div tw="max-w-4xl py-6 px-4 border-t border-gray-200">
												<div tw="overflow-hidden py-2">
													<div tw="px-4 py-5 sm:p-0">
														<dl>
															<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
																<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabel[15].label}</dt>
																<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																	{componentReady ? (
																		pageDetail?.tls_total ? (
																			<SiteSuccessBadge text={"OK"} />
																		) : (
																			<SiteDangerBadge text={"ERROR"} />
																		)
																	) : (
																		<Skeleton duration={2} width={150} />
																	)}
																</dd>
															</div>

															<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
																<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabel[13].label}</dt>
																<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																	{componentReady ? (
																		pageDetail?.tls_status ? (
																			<SiteSuccessBadge text={"OK"} />
																		) : (
																			<SiteDangerBadge text={"ERROR"} />
																		)
																	) : (
																		<Skeleton duration={2} width={150} />
																	)}
																</dd>
															</div>

															{pageDetail?.num_non_tls_images > 0 && (
																<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
																	<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabel[19].label}</dt>
																	<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																		{componentReady ? (
																			pageDetail?.num_non_tls_images
																		) : (
																			<Skeleton duration={2} width={45} />
																		)}
																	</dd>
																</div>
															)}

															{pageDetail?.num_non_tls_scripts > 0 && (
																<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
																	<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabel[20].label}</dt>
																	<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																		{componentReady ? (
																			pageDetail?.num_non_tls_scripts
																		) : (
																			<Skeleton duration={2} width={45} />
																		)}
																	</dd>
																</div>
															)}

															{pageDetail?.num_non_tls_stylesheets > 0 && (
																<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
																	<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabel[21].label}</dt>
																	<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																		{componentReady ? (
																			pageDetail?.num_non_tls_stylesheets
																		) : (
																			<Skeleton duration={2} width={45} />
																		)}
																	</dd>
																</div>
															)}
														</dl>
													</div>
												</div>
											</div>
											{pageDetailLink?.count > 0 ? (
												<div tw="max-w-4xl py-6 px-4">
													<div tw="overflow-hidden py-2">
														<div tw="px-4 py-5 sm:p-0">
															<dl>
																<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
																	<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabel[14].label}</dt>
																	<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																		<ul>
																			{pageDetailLink?.results.map((val, key) => {
																				return componentReady ? (
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
																				) : (
																					<li tw="pb-3 flex items-center justify-between">
																						<div tw="w-0 flex-1 flex items-center">
																							<Skeleton duration={2} width={20} height={20} />
																							<span tw="ml-2 flex-1 w-0">
																								<Skeleton duration={2} width={350} />
																							</span>
																						</div>
																						<div tw="ml-4 flex-shrink-0">
																							<Skeleton duration={2} width={75} />
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
											) : null}
										</div>
									</div>

									<div tw="static bottom-0 w-full mx-auto p-4 border-t border-gray-200">
										<SiteFooter />
									</div>
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

PageDetail.propTypes = {};

export default withResizeDetector(PageDetail);

export async function getServerSideProps(context) {
	return {
		props: {
			result: context.query
		}
	};
}

// React
import Breadcrumbs from "@components/breadcrumbs";
import Layout from "@components/layouts";
import Sidebar from "@components/layouts/Sidebar";
// Enums
import { GlobalLabels, SiteLogoDark } from "@enums/GlobalValues";
import { LoginLink, SitesLink } from "@enums/PageLinks";
import { PagesLabels } from "@enums/PagesLabels";
import { LinkIcon } from "@heroicons/react/solid";
// Hooks
import { useComponentVisible } from "@hooks/useComponentVisible";
import useCrawl from "@hooks/useCrawl";
import { usePageDetail, usePageDetailLink, useSiteId } from "@hooks/useSite";
import useUser from "@hooks/useUser";
import bytes from "bytes";
import dayjs from "dayjs";
import { NextSeo } from "next-seo";
// NextJS
import Link from "next/link";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Scrollbars } from "react-custom-scrollbars-2";
import Skeleton from "react-loading-skeleton";
import SiteDangerBadge from "src/components/badges/SiteDangerBadge";
import SiteSuccessBadge from "src/components/badges/SiteSuccessBadge";
import MobileSidebarButton from "src/components/buttons/MobileSidebarButton";
import Footer from "src/components/layouts/Footer";
// Components
import { AppLogo } from "src/components/logos/AppLogo";
// External
import "twin.macro";

const PageDetail = ({ result }) => {
	const [componentReady, setComponentReady] = useState(false);
	const [copied, setCopied] = useState(false);
	const [copyValue, setCopyValue] = useState(null);
	const [enableSiteIdHook, setEnableSiteIdHook] = useState(false);
	const [scanObjId, setScanObjId] = useState(null);

	const calendar = require("dayjs/plugin/calendar");
	const timezone = require("dayjs/plugin/timezone");
	const utc = require("dayjs/plugin/utc");

	dayjs.extend(calendar);
	dayjs.extend(utc);
	dayjs.extend(timezone);

	const brokenLinksQuery = "tls_status__neq=OK";

	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

	const calendarStrings = {
		lastDay: "[Yesterday], dddd [at] hh:mm:ss A",
		lastWeek: "MMMM DD, YYYY [at] hh:mm:ss A",
		sameDay: "[Today], dddd [at] hh:mm:ss A",
		sameElse: "MMMM DD, YYYY [at] hh:mm:ss A"
	};

	const { user } = useUser({
		redirectIfFound: false,
		redirectTo: LoginLink
	});

	useEffect(() => {
		return user ? setEnableSiteIdHook(true) : setEnableSiteIdHook(false);
	}, [user, enableSiteIdHook]);

	const { selectedSiteRef, currentScan, previousScan } = useCrawl({
		siteId: enableSiteIdHook ? parseInt(result?.siteId) : null
	});

	const { siteId } = useSiteId({
		querySid: enableSiteIdHook ? parseInt(result?.siteId) : null,
		redirectIfFound: false,
		redirectTo: enableSiteIdHook ? SitesLink : null
	});

	useEffect(() => {
		currentScan ? setScanObjId(currentScan?.id) : setScanObjId(previousScan?.id);

		return scanObjId;
	}, [currentScan, previousScan]);

	const { pageDetail } = usePageDetail({
		querySid: enableSiteIdHook ? parseInt(result?.siteId) : null,
		scanObjId: enableSiteIdHook ? scanObjId : null,
		linkId: enableSiteIdHook ? parseInt(result?.pageId) : null
	});

	const pageDetailPageTitle = PagesLabels[1].label + " - " + siteId?.name + " - " + pageDetail?.url;

	const { pageDetailLink } = usePageDetailLink({
		addQuery: enableSiteIdHook ? brokenLinksQuery : null,
		querySid: enableSiteIdHook ? parseInt(result?.siteId) : null,
		scanObjId: enableSiteIdHook ? scanObjId : null,
		pageId: enableSiteIdHook ? parseInt(result?.pageId) : null
	});

	useEffect(() => {
		user && siteId && pageDetail && pageDetailLink ? setComponentReady(true) : setComponentReady(false);

		return { user, siteId, pageDetail, pageDetailLink };
	}, [user, siteId, pageDetail, pageDetailLink]);

	const handleUrlCopy = (e) => {
		setCopyValue(e);
		setCopied(true);
	};

	return (
		<Layout user={user}>
			<NextSeo title={pageDetailPageTitle} />

			<section tw="h-screen flex overflow-hidden bg-white">
				<Sidebar openSidebar={isComponentVisible} ref={ref} setOpenSidebar={setIsComponentVisible} user={user} />

				<div ref={selectedSiteRef} tw="flex flex-col w-0 flex-1 overflow-hidden">
					<div tw="relative flex-shrink-0 flex bg-white">
						<div tw="border-b flex-shrink-0 flex">
							<MobileSidebarButton openSidebar={isComponentVisible} setOpenSidebar={setIsComponentVisible} />
						</div>

						{/* TODO: Turn this into a single component */}
						<Link href={SitesLink} passHref>
							<a tw="p-1 block w-full cursor-pointer lg:hidden">
								<AppLogo
									tw="w-48 h-auto"
									src={SiteLogoDark}
									alt={GlobalLabels[0].label}
									width={GlobalLabels[0].width}
									height={GlobalLabels[0].height}
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
												siteId={parseInt(result?.siteId)}
												dataId={parseInt(result?.pageId)}
												pageTitle={PagesLabels[1].label}
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
															<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabels[7].label}</dt>
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
															<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabels[8].label}</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{componentReady ? (
																	pageDetail?.size_total ? (
																		bytes(pageDetail?.size_total, {
																			thousandsSeparator: " ",
																			unitSeparator: " "
																		})
																	) : (
																		<span tw="text-gray-500">Not Available</span>
																	)
																) : (
																	<Skeleton duration={2} width={75} />
																)}
															</dd>
														</div>

														<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
															<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabels[9].label}</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{componentReady ? (
																	pageDetail?.size_images ? (
																		bytes(pageDetail?.size_images, {
																			thousandsSeparator: " ",
																			unitSeparator: " "
																		})
																	) : (
																		<span tw="text-gray-500">Not Available</span>
																	)
																) : (
																	<Skeleton duration={2} width={75} />
																)}
															</dd>
														</div>

														<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
															<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabels[10].label}</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{componentReady ? (
																	pageDetail?.size_scripts ? (
																		bytes(pageDetail?.size_scripts, {
																			thousandsSeparator: " ",
																			unitSeparator: " "
																		})
																	) : (
																		<span tw="text-gray-500">Not Available</span>
																	)
																) : (
																	<Skeleton duration={2} width={75} />
																)}
															</dd>
														</div>

														<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
															<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabels[18].label}</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{componentReady ? (
																	pageDetail?.size_stylesheets ? (
																		bytes(pageDetail?.size_stylesheets, {
																			thousandsSeparator: " ",
																			unitSeparator: " "
																		})
																	) : (
																		<span tw="text-gray-500">Not Available</span>
																	)
																) : (
																	<Skeleton duration={2} width={75} />
																)}
															</dd>
														</div>

														<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
															<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabels[11].label}</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{componentReady ? (
																	pageDetail?.num_ok_images ? (
																		pageDetail?.num_ok_images
																	) : (
																		<span tw="text-gray-500">Not Available</span>
																	)
																) : (
																	<Skeleton duration={2} width={45} />
																)}
															</dd>
														</div>

														<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
															<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabels[12].label}</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{componentReady ? (
																	pageDetail?.num_non_ok_images >= 0 ? (
																		pageDetail?.num_non_ok_images === 0 ? (
																			<span tw="text-gray-500">Not Available</span>
																		) : (
																			pageDetail?.num_non_ok_images
																		)
																	) : (
																		<span tw="text-gray-500">Not Available</span>
																	)
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
															<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabels[15].label}</dt>
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
															<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabels[13].label}</dt>
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

														<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
															<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabels[19].label}</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{componentReady ? (
																	pageDetail?.num_non_tls_images >= 0 ? (
																		pageDetail?.num_non_tls_images == 0 ? (
																			<span tw="text-gray-500">Not Available</span>
																		) : (
																			pageDetail?.num_non_tls_images
																		)
																	) : (
																		<span tw="text-gray-500">Not Available</span>
																	)
																) : (
																	<Skeleton duration={2} width={45} />
																)}
															</dd>
														</div>

														<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
															<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabels[20].label}</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{componentReady ? (
																	pageDetail?.num_non_tls_scripts >= 0 ? (
																		pageDetail?.num_non_tls_scripts == 0 ? (
																			<span tw="text-gray-500">Not Available</span>
																		) : (
																			pageDetail?.num_non_tls_scripts
																		)
																	) : (
																		<span tw="text-gray-500">Not Available</span>
																	)
																) : (
																	<Skeleton duration={2} width={45} />
																)}
															</dd>
														</div>

														<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
															<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabels[21].label}</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{componentReady ? (
																	pageDetail?.num_non_tls_stylesheets >= 0 ? (
																		pageDetail?.num_non_tls_stylesheets == 0 ? (
																			<span tw="text-gray-500">Not Available</span>
																		) : (
																			pageDetail?.num_non_tls_stylesheets
																		)
																	) : (
																		<span tw="text-gray-500">Not Available</span>
																	)
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
															<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabels[14].label}</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{pageDetailLink?.results !== undefined && pageDetailLink?.count > 0 ? (
																	<ul>
																		{pageDetailLink?.results.map((val, key) => {
																			return componentReady ? (
																				<li key={key} tw="pb-6 flex items-center justify-between text-sm leading-5">
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
																) : (
																	<span tw="text-gray-500">Not Available</span>
																)}
															</dd>
														</div>
													</dl>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div tw="static bottom-0 w-full mx-auto p-4 border-t border-gray-200">
									<Footer />
								</div>
							</div>
						</main>
					</Scrollbars>
				</div>
			</section>
		</Layout>
	);
};

PageDetail.propTypes = {
	pageId: PropTypes.number,
	siteId: PropTypes.number
};

PageDetail.defaultProps = {
	pageId: null,
	siteId: null
};

export default PageDetail;

export async function getServerSideProps(context) {
	return {
		props: {
			result: context.query
		}
	};
}

// React
import SiteDangerBadge from "@components/badges/SiteDangerBadge";
import SiteSuccessBadge from "@components/badges/SiteSuccessBadge";
import SiteWarningBadge from "@components/badges/SiteWarningBadge";
import Breadcrumbs from "@components/breadcrumbs";
import MobileSidebarButton from "@components/buttons/MobileSidebarButton";
import Layout from "@components/layouts";
import Footer from "@components/layouts/Footer";
import Sidebar from "@components/layouts/Sidebar";
// Components
import { AppLogo } from "@components/logos/AppLogo";
// Enums
import { GlobalLabels, SiteLogoDark } from "@enums/GlobalValues";
import { LinksLabels } from "@enums/LinksLabels";
import { LoginLink, SitesLink } from "@enums/PageLinks";
import { DocumentTextIcon } from "@heroicons/react/solid";
// Hooks
import { useComponentVisible } from "@hooks/useComponentVisible";
import useCrawl from "@hooks/useCrawl";
import { useLinkDetail, useSiteId } from "@hooks/useSite";
import useUser from "@hooks/useUser";
import dayjs from "dayjs";
import { NextSeo } from "next-seo";
// NextJS
import Link from "next/link";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Scrollbars } from "react-custom-scrollbars-2";
import Skeleton from "react-loading-skeleton";
// External
import "twin.macro";

const LinkDetail = ({ result }) => {
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

	const calendarStrings = {
		lastDay: "[Yesterday], dddd [at] hh:mm:ss A",
		lastWeek: "MMMM DD, YYYY [at] hh:mm:ss A",
		sameDay: "[Today], dddd [at] hh:mm:ss A",
		sameElse: "MMMM DD, YYYY [at] hh:mm:ss A"
	};

	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

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

	const { linkDetail } = useLinkDetail({
		querySid: enableSiteIdHook ? parseInt(result?.siteId) : null,
		scanObjId: enableSiteIdHook ? scanObjId : null,
		linkId: enableSiteIdHook ? parseInt(result?.linkId) : null
	});

	const linksDetailPageTitle = LinksLabels[1].label + " - " + siteId?.name + " - " + linkDetail?.url;

	useEffect(() => {
		user && siteId && linkDetail ? setComponentReady(true) : setComponentReady(false);

		return { user, siteId, linkDetail };
	}, [user, siteId, linkDetail]);

	const handleUrlCopy = (e) => {
		setCopyValue(e);
		setCopied(true);
	};

	return (
		<Layout user={user}>
			<NextSeo title={linksDetailPageTitle} />

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
												isLinks
												siteId={parseInt(result?.siteId)}
												dataId={parseInt(result?.linkId)}
												pageTitle={LinksLabels[1].label}
												pageDetailTitle={linkDetail?.url}
											/>

											<div tw="pt-4 m-auto">
												{linkDetail?.url ? (
													<h2 tw="flex items-center text-2xl leading-7 font-bold text-gray-900 break-all sm:text-3xl">
														{linkDetail?.url}
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
															<dt tw="text-sm leading-5 font-medium text-gray-500">{LinksLabels[14].label}</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{componentReady ? (
																	<span tw="space-x-2">
																		<span tw="text-sm">
																			{!user?.settings?.disableLocalTime
																				? dayjs(linkDetail?.created_at).calendar(null, calendarStrings)
																				: dayjs.utc(linkDetail?.created_at).calendar(null, calendarStrings)}
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
															<dt tw="text-sm leading-5 font-medium text-gray-500">{LinksLabels[15].label}</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{componentReady ? (
																	linkDetail?.type === "PAGE" ? (
																		"Page"
																	) : linkDetail?.type === "EXTERNAL" ? (
																		"External"
																	) : (
																		"Other"
																	)
																) : (
																	<Skeleton duration={2} width={100} />
																)}
															</dd>
														</div>

														<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
															<dt tw="text-sm leading-5 font-medium text-gray-500">{LinksLabels[16].label}</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{componentReady ? (
																	linkDetail?.status === "OK" ? (
																		<SiteSuccessBadge text={"OK"} />
																	) : linkDetail?.status === "TIMEOUT" ? (
																		<SiteWarningBadge text={"TIMEOUT"} />
																	) : linkDetail?.status === "HTTP_ERROR" ? (
																		<SiteDangerBadge text={"HTTP ERROR"} />
																	) : (
																		<SiteDangerBadge text={"OTHER ERROR"} />
																	)
																) : (
																	<Skeleton duration={2} width={150} />
																)}
															</dd>
														</div>

														<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
															<dt tw="text-sm leading-5 font-medium text-gray-500">{LinksLabels[17].label}</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{componentReady ? (
																	linkDetail?.response_time + "ms"
																) : (
																	<Skeleton duration={2} width={150} />
																)}
															</dd>
														</div>

														{linkDetail?.error !== null && linkDetail?.error ? (
															<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
																<dt tw="text-sm leading-5 font-medium text-gray-500">{LinksLabels[18].label}</dt>
																<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																	{componentReady ? (
																		<SiteDangerBadge text={linkDetail?.error} />
																	) : (
																		<Skeleton duration={2} width={200} />
																	)}
																</dd>
															</div>
														) : null}

														<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
															<dt tw="text-sm leading-5 font-medium text-gray-500">{LinksLabels[19].label}</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{linkDetail?.pages !== undefined && linkDetail?.pages.length > 0 ? (
																	<ul>
																		{componentReady ? (
																			linkDetail?.pages.map((val, key) => {
																				return componentReady ? (
																					<li key={key} tw="pb-3 flex text-sm leading-5">
																						<div tw="w-full flex-1 flex items-center">
																							<DocumentTextIcon tw="flex-shrink h-5 w-5 text-gray-400" />
																							<span tw="ml-2 flex-1 w-0">
																								<Link
																									href={`/site/${parseInt(result?.siteId)}/pages/${val.id}/`}
																									passHref
																								>
																									<a
																										title={val.url}
																										target="_blank"
																										tw="break-words block p-2 font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out"
																									>
																										{val.url}
																									</a>
																								</Link>

																								<div tw="block px-2 space-x-3">
																									<a
																										href={val.url}
																										target="_blank"
																										title="Visit External Site"
																										tw="cursor-pointer text-sm focus:outline-none leading-6 font-semibold text-gray-600 hover:text-gray-500 transition ease-in-out duration-150"
																									>
																										Visit External Site
																									</a>
																									<CopyToClipboard onCopy={handleUrlCopy} text={val.url}>
																										<button tw="cursor-pointer  text-sm focus:outline-none leading-6 font-semibold text-gray-600 hover:text-gray-500 transition ease-in-out duration-150">
																											{copied && copyValue === val.url ? "Copied!" : "Copy URL"}
																										</button>
																									</CopyToClipboard>
																								</div>
																							</span>
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
																			})
																		) : (
																			<li tw="pb-3 flex items-center justify-between">
																				<div tw="w-0 flex-1 flex items-center">
																					<Skeleton duration={2} width={20} height={20} />
																					<span tw="ml-2 flex-1 w-0">
																						<Skeleton duration={2} width={350} height={36} />
																					</span>
																				</div>
																				<div tw="ml-4 flex-shrink-0">
																					<Skeleton duration={2} width={75} height={36} />
																				</div>
																			</li>
																		)}
																	</ul>
																) : (
																	<span tw="text-gray-500">None</span>
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

LinkDetail.propTypes = {
	linkId: PropTypes.number,
	siteId: PropTypes.number
};

LinkDetail.defaultProps = {
	linkId: null,
	siteId: null
};

export default LinkDetail;

export async function getServerSideProps(context) {
	return {
		props: {
			result: context.query
		}
	};
}

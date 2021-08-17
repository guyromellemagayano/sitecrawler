// React
import * as React from "react";

// NextJS
import Link from "next/link";

// External
import "twin.macro";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { DocumentTextIcon } from "@heroicons/react/solid";
import { NextSeo } from "next-seo";
import { Scrollbars } from "react-custom-scrollbars-2";
import bytes from "bytes";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";

// Enums
import { GlobalLabels, SiteLogoDark } from "@enums/GlobalValues";
import { ImagesLabels } from "@enums/ImagesLabels";
import { LoginLink, SitesLink } from "@enums/PageLinks";

// Hooks
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useSiteId, useImageDetail } from "@hooks/useSite";
import useCrawl from "@hooks/useCrawl";
import useUser from "@hooks/useUser";

// Components
import AppLogo from "src/components/logos/AppLogo";
import Breadcrumbs from "@components/breadcrumbs";
import Footer from "src/components/layouts/Footer";
import Layout from "@components/layouts";
import MobileSidebarButton from "src/components/buttons/MobileSidebarButton";
import Sidebar from "@components/layouts/Sidebar";
import SiteDangerBadge from "src/components/badges/SiteDangerBadge";
import SiteSuccessBadge from "src/components/badges/SiteSuccessBadge";
import SiteWarningBadge from "src/components/badges/SiteWarningBadge";

const ImagesDetail = ({ result }) => {
	const [componentReady, setComponentReady] = React.useState(false);
	const [copied, setCopied] = React.useState(false);
	const [copyValue, setCopyValue] = React.useState(null);
	const [enableSiteIdHook, setEnableSiteIdHook] = React.useState(false);
	const [scanObjId, setScanObjId] = React.useState(null);

	const calendar = require("dayjs/plugin/calendar");
	const timezone = require("dayjs/plugin/timezone");
	const utc = require("dayjs/plugin/utc");

	dayjs.extend(calendar);
	dayjs.extend(utc);
	dayjs.extend(timezone);

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

	React.useEffect(() => {
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

	React.useEffect(() => {
		currentScan ? setScanObjId(currentScan?.id) : setScanObjId(previousScan?.id);

		return scanObjId;
	}, [currentScan, previousScan]);

	const { imageDetail } = useImageDetail({
		querySid: enableSiteIdHook ? parseInt(result?.siteId) : null,
		scanObjId: enableSiteIdHook ? scanObjId : null,
		linkId: enableSiteIdHook ? parseInt(result?.imageId) : null
	});

	const imageDetailPageTitle =
		ImagesLabels[1].label + " - " + siteId?.name + " - " + imageDetail?.url;

	React.useEffect(() => {
		user && siteId && imageDetail ? setComponentReady(true) : setComponentReady(false);

		return { user, siteId, imageDetail };
	}, [user, siteId, imageDetail]);

	const handleUrlCopy = (e) => {
		setCopyValue(e);
		setCopied(true);
	};

	return (
		<Layout user={user}>
			<NextSeo title={imageDetailPageTitle} />

			<section tw="h-screen flex overflow-hidden bg-white">
				<Sidebar
					openSidebar={isComponentVisible}
					ref={ref}
					setOpenSidebar={setIsComponentVisible}
					user={user}
				/>

				<div ref={selectedSiteRef} tw="flex flex-col w-0 flex-1 overflow-hidden">
					<div tw="relative flex-shrink-0 flex bg-white">
						<div tw="border-b flex-shrink-0 flex">
							<MobileSidebarButton
								openSidebar={isComponentVisible}
								setOpenSidebar={setIsComponentVisible}
							/>
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
												isImages
												siteId={parseInt(result?.siteId)}
												dataId={parseInt(result?.imageId)}
												pageTitle={ImagesLabels[1].label}
												pageDetailTitle={imageDetail?.url}
											/>

											<div tw="pt-4 m-auto">
												{imageDetail?.url ? (
													<h2 tw="flex items-center text-2xl leading-7 font-bold text-gray-900 break-all sm:text-3xl">
														{imageDetail?.url}
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
															<dt tw="text-sm leading-5 font-medium text-gray-500">
																{ImagesLabels[6].label}
															</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{componentReady ? (
																	<span tw="space-x-2">
																		<span tw="text-sm">
																			{!user?.settings?.disableLocalTime
																				? dayjs(imageDetail?.created_at).calendar(
																						null,
																						calendarStrings
																				  )
																				: dayjs
																						.utc(imageDetail?.created_at)
																						.calendar(null, calendarStrings)}
																		</span>
																		<span tw="font-medium">
																			(
																			{!user?.settings?.disableLocalTime ? dayjs.tz.guess() : "UTC"}
																			)
																		</span>
																	</span>
																) : (
																	<Skeleton duration={2} width={176.7} />
																)}
															</dd>
														</div>

														<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
															<dt tw="text-sm leading-5 font-medium text-gray-500">
																{ImagesLabels[7].label}
															</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{componentReady ? (
																	imageDetail?.type ? (
																		imageDetail?.type === "PAGE" ? (
																			"Page"
																		) : imageDetail?.type === "EXTERNAL" ? (
																			"External"
																		) : imageDetail?.type === "NON_WEB" ? (
																			"Non-Web"
																		) : (
																			"Other"
																		)
																	) : (
																		<span tw="text-gray-500">Not Available</span>
																	)
																) : (
																	<Skeleton duration={2} width={75} />
																)}
															</dd>
														</div>

														<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
															<dt tw="text-sm leading-5 font-medium text-gray-500">
																{ImagesLabels[8].label}
															</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{componentReady ? (
																	imageDetail?.status ? (
																		imageDetail?.status === "OK" ? (
																			<SiteSuccessBadge text={"OK"} />
																		) : imageDetail?.status === "TIMEOUT" ? (
																			<SiteWarningBadge text={"TIMEOUT"} />
																		) : imageDetail?.status === "HTTP_ERROR" ? (
																			<SiteDangerBadge text={"HTTP ERROR"} />
																		) : (
																			<SiteDangerBadge text={"OTHER ERROR"} />
																		)
																	) : (
																		<span tw="text-gray-500">Not Available</span>
																	)
																) : (
																	<Skeleton duration={2} width={100} />
																)}
															</dd>
														</div>

														{imageDetail?.error && (
															<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
																<dt tw="text-sm leading-5 font-medium text-gray-500">
																	{ImagesLabels[9].label}
																</dt>
																<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																	{componentReady ? (
																		<SiteDangerBadge text={imageDetail?.error} />
																	) : (
																		<Skeleton duration={2} width={100} />
																	)}
																</dd>
															</div>
														)}

														<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
															<dt className="text-sm leading-5 font-medium text-gray-500">
																{ImagesLabels[10].label}
															</dt>
															<dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{componentReady ? (
																	imageDetail?.size ? (
																		bytes(imageDetail?.size, {
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
															<dt tw="text-sm leading-5 font-medium text-gray-500">
																{ImagesLabels[11].label}
															</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{imageDetail?.pages !== undefined &&
																imageDetail?.pages.length > 0 ? (
																	<ul>
																		{componentReady ? (
																			imageDetail?.pages.map((val, key) => {
																				return componentReady ? (
																					<li
																						key={key}
																						tw="pb-6 flex items-center justify-between text-sm leading-5"
																					>
																						<div tw="w-0 flex-1 flex items-center">
																							<DocumentTextIcon tw="flex-shrink-0 h-5 w-5 text-gray-400" />
																							<span tw="ml-2 flex-1 w-0">
																								<Link
																									href={`/site/${parseInt(result?.siteId)}/pages/${
																										val.id
																									}/`}
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

																								<span tw="block px-2 text-sm leading-5 font-medium text-gray-500">
																									{ImagesLabels[12].label}{" "}
																									<span tw="text-gray-400">
																										{val.alt_text && val.alt_text !== null
																											? val.alt_text
																											: "No Alt Text"}
																									</span>
																								</span>

																								<div tw="block p-2 space-x-3">
																									<a
																										href={val.url}
																										target="_blank"
																										title="Visit External Site"
																										tw="cursor-pointer text-sm focus:outline-none leading-6 font-semibold text-gray-600 hover:text-gray-500 transition ease-in-out duration-150"
																									>
																										Visit External Site
																									</a>
																									<CopyToClipboard
																										onCopy={handleUrlCopy}
																										text={val.url}
																									>
																										<button tw="cursor-pointer  text-sm focus:outline-none leading-6 font-semibold text-gray-600 hover:text-gray-500 transition ease-in-out duration-150">
																											{copied && copyValue === val.url
																												? "Copied!"
																												: "Copy URL"}
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
																							<span tw="ml-2 space-y-2 flex-1 w-0">
																								<Skeleton duration={2} width={250} height={36} />
																								<Skeleton duration={2} width={150} height={36} />
																							</span>
																						</div>
																						<div tw="ml-4 flex-shrink-0">
																							<Skeleton duration={2} width={75} height={36} />
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

ImagesDetail.propTypes = {
	imageId: PropTypes.number,
	siteId: PropTypes.number
};

ImagesDetail.defaultProps = {
	imageId: null,
	siteId: null
};

export default ImagesDetail;

export async function getServerSideProps(context) {
	return {
		props: {
			result: context.query
		}
	};
}

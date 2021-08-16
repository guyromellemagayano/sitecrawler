// React
import * as React from "react";

// NextJS
import Link from "next/link";

// External
import "twin.macro";
import { NextSeo } from "next-seo";
import { Scrollbars } from "react-custom-scrollbars-2";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";

// Enums
import { GlobalLabels, SiteLogoDark } from "@enums/GlobalValues";
import { LoginLink, SitesLink } from "@enums/PageLinks";
import { SeoLabels } from "@enums/SeoLabels";

// Hooks
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useSiteId, usePageDetail } from "src/hooks/useSite";
import useCrawl from "src/hooks/useCrawl";
import useUser from "src/hooks/useUser";

// Components
import AppLogo from "src/components/logos/AppLogo";
import Breadcrumbs from "@components/breadcrumbs";
import Footer from "src/components/layouts/Footer";
import Layout from "@components/layouts";
import MobileSidebarButton from "src/components/buttons/MobileSidebarButton";
import Sidebar from "@components/layouts/Sidebar";

const SeoDetail = ({ result }) => {
	const [componentReady, setComponentReady] = React.useState(false);
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

	const { pageDetail } = usePageDetail({
		querySid: enableSiteIdHook ? parseInt(result?.siteId) : null,
		scanObjId: enableSiteIdHook ? scanObjId : null,
		linkId: enableSiteIdHook ? parseInt(result?.seoId) : null
	});

	const seoDetailPageTitle = SeoLabels[1].label + " - " + siteId?.name + " - " + pageDetail?.url;

	React.useEffect(() => {
		user && siteId && pageDetail ? setComponentReady(true) : setComponentReady(false);

		return { user, siteId, pageDetail };
	}, [user, siteId, pageDetail]);

	return (
		<Layout user={componentReady ? user : null}>
			<NextSeo title={componentReady ? seoDetailPageTitle : null} />

			<section tw="h-screen flex overflow-hidden bg-white">
				<Sidebar
					openSidebar={isComponentVisible}
					ref={ref}
					setOpenSidebar={setIsComponentVisible}
					user={componentReady ? user : null}
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
												isSeo
												siteId={parseInt(result?.siteId)}
												dataId={parseInt(result?.seoId)}
												pageTitle={SeoLabels[1].label}
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
															<dt tw="text-sm leading-5 font-medium text-gray-500">
																{SeoLabels[9].label}
															</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{componentReady ? (
																	<span tw="space-x-2">
																		<span tw="text-sm">
																			{!user?.settings?.disableLocalTime
																				? dayjs(pageDetail?.created_at).calendar(
																						null,
																						calendarStrings
																				  )
																				: dayjs
																						.utc(pageDetail?.created_at)
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
																{SeoLabels[10].label}
															</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{componentReady ? (
																	pageDetail?.num_links ? (
																		pageDetail?.num_links
																	) : (
																		<span tw="text-gray-500">Not Available</span>
																	)
																) : (
																	<Skeleton duration={2} width={45} />
																)}
															</dd>
														</div>

														<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
															<dt tw="text-sm leading-5 font-medium text-gray-500">
																{SeoLabels[11].label}
															</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{componentReady ? (
																	pageDetail?.num_ok_links ? (
																		pageDetail?.num_ok_links
																	) : (
																		<span tw="text-gray-500">Not Available</span>
																	)
																) : (
																	<Skeleton duration={2} width={45} />
																)}
															</dd>
														</div>

														<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
															<dt tw="text-sm leading-5 font-medium text-gray-500">
																{SeoLabels[12].label}
															</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{componentReady ? (
																	pageDetail?.num_non_ok_links ? (
																		pageDetail?.num_non_ok_links
																	) : (
																		<span tw="text-gray-500">Not Available</span>
																	)
																) : (
																	<Skeleton duration={2} width={45} />
																)}
															</dd>
														</div>

														<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
															<dt tw="text-sm leading-5 font-medium text-gray-500">
																{SeoLabels[13].label}
															</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{componentReady ? (
																	pageDetail?.pagedata?.title ? (
																		pageDetail?.pagedata?.title
																	) : (
																		<span tw="text-gray-500">Not Available</span>
																	)
																) : (
																	<Skeleton duration={2} width={200} />
																)}
															</dd>
														</div>

														<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
															<dt tw="text-sm leading-5 font-medium text-gray-500">
																{SeoLabels[14].label}
															</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{componentReady ? (
																	pageDetail?.pagedata?.description ? (
																		pageDetail?.pagedata?.description
																	) : (
																		<span tw="text-gray-500">Not Available</span>
																	)
																) : (
																	<Skeleton duration={2} width={200} />
																)}
															</dd>
														</div>

														<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
															<dt tw="text-sm leading-5 font-medium text-gray-500">
																{SeoLabels[15].label}
															</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{componentReady ? (
																	pageDetail?.pagedata?.h1_first ? (
																		pageDetail?.pagedata?.h1_first
																	) : (
																		<span tw="text-gray-500">Not Available</span>
																	)
																) : (
																	<Skeleton duration={2} width={200} />
																)}
															</dd>
														</div>

														<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
															<dt tw="text-sm leading-5 font-medium text-gray-500">
																{SeoLabels[16].label}
															</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{componentReady ? (
																	pageDetail?.pagedata?.h1_second ? (
																		pageDetail?.pagedata?.h1_second
																	) : (
																		<span tw="text-gray-500">Not Available</span>
																	)
																) : (
																	<Skeleton duration={2} width={200} />
																)}
															</dd>
														</div>

														<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
															<dt tw="text-sm leading-5 font-medium text-gray-500">
																{SeoLabels[17].label}
															</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{componentReady ? (
																	pageDetail?.pagedata?.h2_first ? (
																		pageDetail?.pagedata?.h2_first
																	) : (
																		<span tw="text-gray-500">Not Available</span>
																	)
																) : (
																	<Skeleton duration={2} width={200} />
																)}
															</dd>
														</div>

														<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
															<dt tw="text-sm leading-5 font-medium text-gray-500">
																{SeoLabels[18].label}
															</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{componentReady ? (
																	pageDetail?.pagedata?.h2_second ? (
																		pageDetail?.pagedata?.h2_second
																	) : (
																		<span tw="text-gray-500">Not Available</span>
																	)
																) : (
																	<Skeleton duration={2} width={200} />
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

SeoDetail.propTypes = {
	seoId: PropTypes.number,
	siteId: PropTypes.number
};

SeoDetail.defaultProps = {
	seoId: null,
	siteId: null
};

export default SeoDetail;

export async function getServerSideProps(context) {
	return {
		props: {
			result: context.query
		}
	};
}

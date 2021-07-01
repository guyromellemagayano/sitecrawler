// React
import * as React from "react";

// NextJS
import Link from "next/link";

// External
import { NextSeo } from "next-seo";
import { withResizeDetector } from "react-resize-detector";
import dayjs from "dayjs";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import tw from "twin.macro";

// JSON
import SeoLabel from "public/labels/pages/site/seo.json";

// Hooks
import { useSiteId, usePageDetail } from "src/hooks/useSite";
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

const SeoDetail = ({ width, result }) => {
	const [componentReady, setComponentReady] = React.useState(false);
	const [openMobileSidebar, setOpenMobileSidebar] = React.useState(false);
	const [scanObjId, setScanObjId] = React.useState(null);

	const calendar = require("dayjs/plugin/calendar");
	const timezone = require("dayjs/plugin/timezone");
	const utc = require("dayjs/plugin/utc");

	dayjs.extend(calendar);
	dayjs.extend(utc);
	dayjs.extend(timezone);

	const appLogoAltText = "app-logo";
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

	const { currentScan, previousScan, scanCount } = useCrawl({
		siteId: result.siteId
	});

	const { siteId } = useSiteId({
		querySid: result.siteId
	});

	React.useEffect(() => {
		currentScan ? setScanObjId(currentScan?.id) : setScanObjId(previousScan?.id);
	}, [currentScan, previousScan]);

	const { pageDetail } = usePageDetail({
		querySid: result.siteId,
		scanObjId: scanObjId,
		linkId: result.seoId
	});

	const seoDetailPageTitle = SeoLabel[1].label + " - " + siteId?.name + " - " + pageDetail?.url;

	React.useEffect(() => {
		pageDetail
			? (() => {
					setComponentReady(false);

					setTimeout(() => {
						setComponentReady(true);
					}, 500);
			  })()
			: null;
	}, [pageDetail]);

	React.useEffect(() => {
		user && siteId && pageDetail
			? (() => {
					setTimeout(() => {
						setComponentReady(true);
					}, 500);
			  })()
			: null;

		return setComponentReady(false);
	}, [user, siteId, pageDetail]);

	return (
		<Layout user={componentReady ? user : null}>
			<NextSeo title={componentReady ? seoDetailPageTitle : null} />

			<div tw="h-screen flex overflow-hidden bg-white">
				<MainSidebar
					width={width}
					user={componentReady ? user : null}
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
										className={tw`flex justify-start w-60 h-12 mb-8`}
										src="/images/logos/site-logo-dark.svg"
										alt={appLogoAltText}
										width={320}
										height={60}
									/>
								</a>
							</Link>
						</div>

						<main tw="flex-1 relative z-0 overflow-y-auto focus:outline-none" tabIndex="0">
							<div tw="max-w-full p-4 sm:px-6 md:px-8">
								<div tw="w-full py-6 mx-auto grid gap-16 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-12">
									<div tw="lg:col-span-2 xl:col-span-2 xl:pr-8 xl:border-r xl:border-gray-200">
										<div tw="max-w-full p-4">
											<Breadcrumbs
												isSeo
												siteId={result.siteId}
												dataId={result.seoId}
												pageTitle={SeoLabel[1].label}
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
											<div tw="bg-white border border-gray-300 overflow-hidden sm:rounded-lg py-2 px-1">
												<div tw="px-4 py-5 sm:p-0">
													<dl>
														<div tw="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
															<dt tw="text-sm leading-5 font-medium text-gray-500">{SeoLabel[9].label}</dt>
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
														<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
															<dt tw="text-sm leading-5 font-medium text-gray-500">{SeoLabel[10].label}</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{componentReady ? pageDetail?.num_links : <Skeleton duration={2} width={45} />}
															</dd>
														</div>
														<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
															<dt tw="text-sm leading-5 font-medium text-gray-500">{SeoLabel[11].label}</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{componentReady ? pageDetail?.num_ok_links : <Skeleton duration={2} width={45} />}
															</dd>
														</div>
														<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
															<dt tw="text-sm leading-5 font-medium text-gray-500">{SeoLabel[12].label}</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{componentReady ? pageDetail?.num_non_ok_links : <Skeleton duration={2} width={45} />}
															</dd>
														</div>
														<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
															<dt tw="text-sm leading-5 font-medium text-gray-500">{SeoLabel[13].label}</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{componentReady ? (
																	pageDetail?.pagedata?.title ? (
																		pageDetail?.pagedata?.title
																	) : (
																		<span tw="text-gray-500">None</span>
																	)
																) : (
																	<Skeleton duration={2} width={200} />
																)}
															</dd>
														</div>
														<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
															<dt tw="text-sm leading-5 font-medium text-gray-500">{SeoLabel[14].label}</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{componentReady ? (
																	pageDetail?.pagedata?.description ? (
																		pageDetail?.pagedata?.description
																	) : (
																		<span tw="text-gray-500">None</span>
																	)
																) : (
																	<Skeleton duration={2} width={200} />
																)}
															</dd>
														</div>
														<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
															<dt tw="text-sm leading-5 font-medium text-gray-500">{SeoLabel[15].label}</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{componentReady ? (
																	pageDetail?.pagedata?.h1_first ? (
																		pageDetail?.pagedata?.h1_first
																	) : (
																		<span tw="text-gray-500">None</span>
																	)
																) : (
																	<Skeleton duration={2} width={200} />
																)}
															</dd>
														</div>
														<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
															<dt tw="text-sm leading-5 font-medium text-gray-500">{SeoLabel[16].label}</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{componentReady ? (
																	pageDetail?.pagedata?.h1_second ? (
																		pageDetail?.pagedata?.h1_second
																	) : (
																		<span tw="text-gray-500">None</span>
																	)
																) : (
																	<Skeleton duration={2} width={200} />
																)}
															</dd>
														</div>
														<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
															<dt tw="text-sm leading-5 font-medium text-gray-500">{SeoLabel[17].label}</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{componentReady ? (
																	pageDetail?.pagedata?.h2_first ? (
																		pageDetail?.pagedata?.h2_first
																	) : (
																		<span tw="text-gray-500">None</span>
																	)
																) : (
																	<Skeleton duration={2} width={200} />
																)}
															</dd>
														</div>
														<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
															<dt tw="text-sm leading-5 font-medium text-gray-500">{SeoLabel[18].label}</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{componentReady ? (
																	pageDetail?.pagedata?.h2_second ? (
																		pageDetail?.pagedata?.h2_second
																	) : (
																		<span tw="text-gray-500">None</span>
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

								<div tw="static bottom-0 w-full mx-auto p-4 border-t border-gray-200 bg-white">
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
			</div>
		</Layout>
	);
};

SeoDetail.propTypes = {};

export default withResizeDetector(SeoDetail);

export async function getServerSideProps(context) {
	return {
		props: {
			result: context.query
		}
	};
}

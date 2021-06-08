// React
import * as React from "react";

// NextJS
import Link from "next/link";

// External
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/solid";
import { NextSeo } from "next-seo";
import { withResizeDetector } from "react-resize-detector";
import Moment from "react-moment";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import tw, { styled } from "twin.macro";

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
import Loader from "src/components/layouts/Loader";
import MainSidebar from "src/components/sidebar/MainSidebar";
import MobileSidebarButton from "src/components/buttons/MobileSidebarButton";
import SiteFooter from "src/components/layouts/Footer";

const SeoDetailDiv = styled.div`
	.url-heading {
		font-size: 1.4rem;
	}
`;

const SeoDetail = ({ width, result }) => {
	const [openMobileSidebar, setOpenMobileSidebar] = React.useState(false);
	const [componentReady, setComponentReady] = React.useState(false);

	let seoPageTitle = "";
	let seoDetailPageTitle = "";
	let homeLabel = "Home";
	let homePageLink = `/site/${result.siteId}/overview`;

	const calendarStrings = {
		lastDay: "[Yesterday], dddd",
		sameDay: "[Today], dddd",
		lastWeek: "MMMM DD, YYYY",
		sameElse: "MMMM DD, YYYY"
	};

	const { user } = useUser({
		redirectIfFound: false,
		redirectTo: "/login"
	});

	const { scanResult, scanObjId } = useCrawl({
		siteId: result.siteId
	});

	const { pageDetail } = usePageDetail({
		querySid: result.siteId,
		scanObjId: scanObjId,
		linkId: result.seoId
	});

	const { siteId } = useSiteId({
		querySid: result.siteId
	});

	siteId ? (seoPageTitle = siteId?.name ? SeoLabel[1].label + " - " + siteId.name : SeoLabel[1].label) : null;
	siteId ? (seoDetailPageTitle = pageDetail?.url ? pageDetail?.url + " | " + siteId?.name : SeoLabel[8].label) : null;

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

	return user ? (
		<Layout user={user}>
			<NextSeo title={seoDetailPageTitle} />

			<SeoDetailDiv tw="h-screen flex overflow-hidden bg-white">
				<MainSidebar
					width={width}
					user={user}
					openMobileSidebar={openMobileSidebar}
					setOpenMobileSidebar={setOpenMobileSidebar}
				/>

				{siteId ? (
					siteId?.verified ? (
						<div tw="flex flex-col w-0 flex-1 overflow-hidden">
							<div tw="relative z-10 flex-shrink-0 flex  lg:h-0 bg-white border-b lg:border-0 border-gray-200 lg:mb-4">
								<MobileSidebarButton
									openMobileSidebar={openMobileSidebar}
									setOpenMobileSidebar={setOpenMobileSidebar}
								/>

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
								<div tw="w-full p-6 mx-auto grid gap-16 xl:grid-cols-1 2xl:grid-cols-3 lg:gap-x-5 lg:gap-y-12">
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
															<Link href={`/site/${result.siteId}/seo`} passHref>
																<a aria-current="page" tw="cursor-pointer ml-4 text-sm text-gray-700">
																	{seoPageTitle}
																</a>
															</Link>
														</div>
													</li>
													<li>
														<div tw="flex items-center">
															<ChevronRightIcon tw="flex-shrink-0 h-5 w-5 text-gray-400" />
															<p aria-current="page" tw="cursor-default ml-4 text-sm font-medium text-gray-700">
																{pageDetail?.url}
															</p>
														</div>
													</li>
												</ol>
											</nav>
											<div tw="pt-4 m-auto">
												<h4 tw="flex items-center text-2xl leading-8 font-medium text-gray-900 break-all">
													{pageDetail?.url} - {siteId?.name}
												</h4>
											</div>
										</div>
										<div tw="max-w-4xl py-6 px-8">
											<div tw="bg-white border border-gray-300 overflow-hidden sm:rounded-lg py-2 px-1">
												<div tw="px-4 py-5 sm:p-0">
													<dl>
														<div tw="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
															<dt tw="text-sm leading-5 font-medium text-gray-500">{SeoLabel[9].label}</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{componentReady ? (
																	<span tw="space-x-2">
																		<span>
																			{!user?.settings?.disableLocalTime ? (
																				<Moment calendar={calendarStrings} date={pageDetail?.created_at} local />
																			) : (
																				<Moment calendar={calendarStrings} date={pageDetail?.created_at} utc />
																			)}
																		</span>
																		<span>
																			{!user?.settings?.disableLocalTime ? (
																				<Moment date={pageDetail?.created_at} format="hh:mm:ss A" local />
																			) : (
																				<Moment date={pageDetail?.created_at} format="hh:mm:ss A" utc />
																			)}
																		</span>
																		{user?.settings?.disableLocalTime && <span tw="font-medium">(UTC)</span>}
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
								<div tw="static bottom-0 w-full mx-auto px-12 py-4 bg-white border-t border-gray-200">
									<SiteFooter />
								</div>
							</main>
						</div>
					) : (
						<div tw="mx-auto">
							<section tw="flex flex-col justify-center min-h-screen">
								<div tw="px-4 py-5 sm:p-6 flex items-center justify-center">
									<h3 tw="text-lg leading-6 font-medium text-gray-500">{SeoLabel[19].label}</h3>
								</div>
							</section>
						</div>
					)
				) : (
					<div tw="mx-auto">
						<Loader />
					</div>
				)}
			</SeoDetailDiv>
		</Layout>
	) : (
		<Loader />
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

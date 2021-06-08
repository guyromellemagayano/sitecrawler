// React
import * as React from "react";

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
import Skeleton from "react-loading-skeleton";
import tw, { styled } from "twin.macro";

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
	const [copied, setCopied] = React.useState(false);
	const [copyValue, setCopyValue] = React.useState(null);
	const [openMobileSidebar, setOpenMobileSidebar] = React.useState(false);
	const [componentReady, setComponentReady] = React.useState(false);

	let pagePageTitle = "";
	let pageDetailPageTitle = "";
	let homeLabel = "Home";
	let homePageLink = `/site/${result.siteId}/overview`;

	const brokenLinksQuery = "tls_status__neq=OK";

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
		linkId: result.pageId
	});

	const { pageDetailLink } = usePageDetailLink({
		addQuery: brokenLinksQuery,
		querySid: result.siteId,
		scanObjId: scanObjId,
		pageId: result.pageId
	});

	const { siteId } = useSiteId({
		querySid: result.siteId
	});

	siteId ? (pagePageTitle = siteId?.name ? PagesLabel[1].label + " - " + siteId.name : PagesLabel[1].label) : null;
	siteId
		? (pageDetailPageTitle = pageDetail?.url ? pageDetail?.url + " | " + siteId?.name : PagesLabel[18].label)
		: null;

	React.useEffect(() => {
		pageDetail && pageDetailLink
			? (() => {
					setComponentReady(false);

					setTimeout(() => {
						setComponentReady(true);
					}, 500);
			  })()
			: null;
	}, [pageDetail, pageDetailLink]);

	const handleUrlCopy = (e) => {
		setCopyValue(e);
		setCopied(true);
	};

	return user ? (
		<Layout user={user}>
			<NextSeo title={pageDetailPageTitle} />

			<PageDetailDiv tw="h-screen flex overflow-hidden bg-white">
				<MainSidebar
					width={width}
					user={user}
					openMobileSidebar={openMobileSidebar}
					setOpenMobileSidebar={setOpenMobileSidebar}
				/>

				{siteId ? (
					siteId?.verified ? (
						<div tw="flex flex-col w-0 flex-1 overflow-hidden">
							<div tw="relative flex-shrink-0 flex bg-white lg:mb-4">
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
																	{pagePageTitle}
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
															<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabel[7].label}</dt>
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
														<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
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
														<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
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
														<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
															<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabel[19].label}</dt>
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
														<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
															<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabel[11].label}</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{componentReady ? pageDetail?.num_ok_images : <Skeleton duration={2} width={45} />}
															</dd>
														</div>
														<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
															<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabel[12].label}</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																{componentReady ? pageDetail?.num_non_ok_images : <Skeleton duration={2} width={45} />}
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

														{pageDetail?.num_non_tls_images > 0 && (
															<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
																<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabel[20].label}</dt>
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
															<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
																<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabel[21].label}</dt>
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
															<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
																<dt tw="text-sm leading-5 font-medium text-gray-500">{PagesLabel[22].label}</dt>
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

										<div tw="max-w-4xl py-6 px-8">
											<div tw="bg-white border border-gray-300 overflow-hidden sm:rounded-lg py-2 px-1">
												<div tw="px-4 py-5 sm:p-0">
													<dl>
														<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
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

														{pageDetailLink?.count > 0 && (
															<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
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
														)}
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
									<h3 tw="text-lg leading-6 font-medium text-gray-500">{PagesLabel[16].label}</h3>
								</div>
							</section>
						</div>
					)
				) : (
					<div tw="mx-auto">
						<Loader />
					</div>
				)}
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

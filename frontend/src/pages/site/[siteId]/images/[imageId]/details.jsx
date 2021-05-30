// React
import { useState, useEffect } from "react";

// NextJS
import Link from "next/link";

// External
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/solid";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { NextSeo } from "next-seo";
import { withResizeDetector } from "react-resize-detector";
import bytes from "bytes";
import Moment from "react-moment";
import PropTypes from "prop-types";
import tw, { styled } from "twin.macro";

// JSON
import ImagesLabel from "public/labels/pages/site/images.json";

// Hooks
import { useScan, useSite, useSiteId, useImageDetail } from "src/hooks/useSite";
import useUser from "src/hooks/useUser";

// Layout
import Layout from "src/components/Layout";

// Components
import AppLogo from "src/components/logos/AppLogo";
import Loader from "src/components/layouts/Loader";
import MainSidebar from "src/components/sidebar/MainSidebar";
import MobileSidebarButton from "src/components/buttons/MobileSidebarButton";
import SiteDangerBadge from "src/components/badges/SiteDangerBadge";
import SiteFooter from "src/components/layouts/Footer";
import SiteSuccessBadge from "src/components/badges/SiteSuccessBadge";
import SiteWarningBadge from "src/components/badges/SiteWarningBadge";

const ImagesDetailDiv = styled.section`
	.url-heading {
		font-size: 1.4rem;
	}
`;

const ImagesDetail = ({ width, result }) => {
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

	const { imageDetail: imageDetail } = useImageDetail({
		querySid: result.siteId,
		scanObjId: scanObjId,
		linkId: result.imageId
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
		imageDetail &&
		imageDetail !== undefined &&
		Object.keys(imageDetail).length > 0
	) {
		pageTitle =
			siteId.name && siteId.name !== undefined ? ImagesLabel[1].label + " - " + siteId.name : ImagesLabel[1].label;

		detailPageTitle =
			imageDetail.url && imageDetail.url !== undefined && siteId.name && siteId.name !== undefined
				? imageDetail.url + " | " + siteId.name
				: "Images Detail";
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
			imageDetail &&
			imageDetail !== undefined &&
			Object.keys(imageDetail).length > 0
		) {
			setTimeout(() => {
				setPageLoaded(true);
			}, 500);
		}
	}, [user, site, siteId, imageDetail]);

	const handleUrlCopy = (e) => {
		setCopyValue(e);
		setCopied(true);
	};

	return user && user !== undefined && Object.keys(user).length > 0 && pageLoaded ? (
		<Layout user={user}>
			<NextSeo title={detailPageTitle} />

			<ImagesDetailDiv tw="h-screen flex overflow-hidden bg-white">
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
													<Link href={`/site/${result.siteId}/images`} passHref>
														<a aria-current="page" tw="cursor-pointer ml-4 text-sm text-gray-700">
															{pageTitle}
														</a>
													</Link>
												</div>
											</li>
											{imageDetail && imageDetail !== undefined && Object.keys(imageDetail).length > 0 && (
												<li>
													<div tw="flex items-center">
														<ChevronRightIcon tw="flex-shrink-0 h-5 w-5 text-gray-400" />
														<p aria-current="page" tw="cursor-default ml-4 text-sm font-medium text-gray-700">
															{imageDetail.url}
														</p>
													</div>
												</li>
											)}
										</ol>
									</nav>

									{imageDetail &&
										imageDetail !== undefined &&
										Object.keys(imageDetail).length > 0 &&
										siteId &&
										siteId !== undefined &&
										Object.keys(siteId).length > 0 && (
											<div tw="pt-4 m-auto">
												<h4 tw="flex items-center text-2xl leading-8 font-medium text-gray-900 break-all">
													{imageDetail.url} - {siteId.name}
												</h4>
											</div>
										)}
								</div>
								<div tw="max-w-4xl py-6 px-8">
									<div tw="bg-white border border-gray-300 overflow-hidden sm:rounded-lg py-2 px-1">
										<div tw="px-4 py-5 sm:p-0">
											<dl>
												<div tw="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
													<dt tw="text-sm leading-5 font-medium text-gray-500">{ImagesLabel[6].label}</dt>
													<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
														{imageDetail &&
															imageDetail !== undefined &&
															Object.keys(imageDetail).length > 0 &&
															(user &&
															user !== undefined &&
															Object.keys(user).length > 0 &&
															!user.settings.disableLocalTime ? (
																<>
																	<Moment calendar={calendarStrings} date={imageDetail.created_at} local />
																	&nbsp;
																	<Moment date={imageDetail.created_at} format="hh:mm:ss A" local />
																</>
															) : (
																<>
																	<Moment calendar={calendarStrings} date={imageDetail.created_at} utc />
																	&nbsp;
																	<Moment date={imageDetail.created_at} format="hh:mm:ss A" utc />
																</>
															))}
													</dd>
												</div>
												<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
													<dt tw="text-sm leading-5 font-medium text-gray-500">{ImagesLabel[7].label}</dt>
													<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
														{imageDetail &&
															imageDetail !== undefined &&
															Object.keys(imageDetail).length > 0 &&
															(imageDetail.type === "PAGE"
																? "Page"
																: imageDetail.type === "EXTERNAL"
																? "External"
																: imageDetail.type === "NON_WEB"
																? "Non-Web"
																: "Other")}
													</dd>
												</div>
												<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
													<dt tw="text-sm leading-5 font-medium text-gray-500">{ImagesLabel[8].label}</dt>
													<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
														{imageDetail &&
															imageDetail !== undefined &&
															Object.keys(imageDetail).length > 0 &&
															(imageDetail.status === "OK" ? (
																<SiteSuccessBadge text={"OK"} />
															) : imageDetail.status === "TIMEOUT" ? (
																<SiteWarningBadge text={"TIMEOUT"} />
															) : imageDetail.status === "HTTP_ERROR" ? (
																<SiteDangerBadge text={"HTTP ERROR"} />
															) : (
																<SiteDangerBadge text={"OTHER ERROR"} />
															))}
													</dd>
												</div>
												{imageDetail &&
													imageDetail !== undefined &&
													Object.keys(imageDetail).length > 0 &&
													(imageDetail.error !== null && imageDetail.error !== undefined ? (
														<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
															<dt tw="text-sm leading-5 font-medium text-gray-500">{ImagesLabel[9].label}</dt>
															<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
																<SiteDangerBadge text={imageDetail.error} />
															</dd>
														</div>
													) : null)}
												<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
													<dt className="text-sm leading-5 font-medium text-gray-500">{ImagesLabel[10].label}</dt>
													<dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
														{imageDetail &&
															imageDetail !== undefined &&
															Object.keys(imageDetail).length > 0 &&
															(imageDetail.size !== null &&
															imageDetail.size !== undefined &&
															imageDetail.size !== "" ? (
																bytes(imageDetail.size, {
																	thousandsSeparator: " ",
																	unitSeparator: " "
																})
															) : (
																<span tw="text-gray-500">None</span>
															))}
													</dd>
												</div>
												<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
													<dt tw="text-sm leading-5 font-medium text-gray-500">{ImagesLabel[11].label}</dt>
													<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
														{imageDetail && imageDetail !== undefined && Object.keys(imageDetail).length > 0 && (
															<ul>
																{imageDetail.pages &&
																	imageDetail.pages !== undefined &&
																	imageDetail.pages.map((val, key) => {
																		return (
																			<li key={key} tw="pb-3 flex items-center justify-between text-sm leading-5">
																				<div tw="w-0 flex-1 flex items-center">
																					<svg
																						tw="flex-shrink-0 h-5 w-5 text-gray-400"
																						fill="none"
																						strokeLinecap="round"
																						strokeLinejoin="round"
																						strokeWidth="2"
																						viewBox="0 0 24 24"
																						stroke="currentColor"
																					>
																						<path
																							fillRule="evenodd"
																							d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
																							clipRule="evenodd"
																						/>
																					</svg>
																					<span tw="ml-2 flex-1 w-0">
																						<a
																							href={val.url}
																							target="_blank"
																							title={val.url}
																							tw="break-words block p-2 font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out"
																						>
																							{val.url}
																						</a>
																						{val.alt_text && val.alt_text !== null && (
																							<span tw="block px-2 text-sm leading-5 font-medium text-gray-500">
																								{ImagesLabel[12].label} <span tw="text-gray-400">{val.alt_text}</span>
																							</span>
																						)}
																						<span tw="block px-2 text-sm leading-5 font-medium text-gray-500">
																							Alt Text: Hello World
																						</span>
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
			</ImagesDetailDiv>
		</Layout>
	) : (
		<Loader />
	);
};

ImagesDetail.propTypes = {};

export default withResizeDetector(ImagesDetail);

export async function getServerSideProps(context) {
	return {
		props: {
			result: context.query
		}
	};
}

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
import loadable from "@loadable/component";
import Moment from "react-moment";
import PropTypes from "prop-types";
import tw, { styled } from "twin.macro";

// JSON
import ImagesLabel from "public/labels/pages/site/links.json";

// Hooks
import { useScan, useSite, useSiteId, useImageDetail } from "src/hooks/useSite";
import useUser from "src/hooks/useUser";

// Layout
import Layout from "src/components/Layout";

// Components
const AppLogo = loadable(() => import("src/components/logos/AppLogo"));
const Loader = loadable(() => import("src/components/layouts/Loader"));
const MainSidebar = loadable(() => import("src/components/sidebar/MainSidebar"));
const MobileSidebarButton = loadable(() => import("src/components/buttons/MobileSidebarButton"));
const SiteDangerBadge = loadable(() => import("src/components/badges/SiteDangerBadge"));
const SiteFooter = loadable(() => import("src/components/layouts/Footer"));
const SiteSuccessBadge = loadable(() => import("src/components/badges/SiteSuccessBadge"));
const SiteWarningBadge = loadable(() => import("src/components/badges/SiteWarningBadge"));

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
	const [scanData, setScanData] = useState([]);
	const [scanObjId, setScanObjId] = useState(0);
	const [siteData, setSiteData] = useState([]);
	const [siteIdData, setSiteIdData] = useState([]);
	const [userData, setUserData] = useState([]);
	const [imageDetailData, setImageDetailData] = useState([]);

	const imagesPageTitle =
		siteIdData.name && siteIdData.name !== undefined
			? ImagesLabel[1].label + " - " + siteIdData.name
			: ImagesLabel[1].label;
	const imagesDetailPageTitle =
		imageDetailData.url && imageDetailData.url !== undefined && siteIdData.name && siteIdData.name !== undefined
			? imageDetailData.url + " | " + siteIdData.name
			: "Images Detail";
	const homeLabel = "Home";
	const homePageLink = `/site/${result.siteId}/overview`;
	const calendarStrings = {
		lastDay: "[Yesterday], dddd",
		sameDay: "[Today], dddd",
		lastWeek: "MMMM DD, YYYY",
		sameElse: "MMMM DD, YYYY"
	};
	const sitesApiEndpoint = "/api/site/?ordering=name";

	const { user: user } = useUser({
		redirectIfFound: false,
		redirectTo: "/login"
	});

	const { scan: scan } = useScan({
		querySid: result.siteId
	});

	useEffect(() => {
		if (scan && scan !== undefined && Object.keys(scan).length > 0) {
			setScanData(scan);

			if (scanData.results && scanData.results !== undefined && Object.keys(scanData.results).length > 0) {
				setScanObjId(
					scanData.results
						.map((e) => {
							return e.id;
						})
						.sort()
						.reverse()[0]
				);
			}
		}
	});

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
			setUserData(user);
			setSiteData(site);
			setSiteIdData(siteId);
			setImageDetailData(imageDetail);
		}

		if (userData && siteData && siteIdData && imageDetailData) {
			setTimeout(() => {
				setPageLoaded(true);
			}, 500);
		}
	}, [user, site, siteId, imageDetail]);

	const handleUrlCopy = (e) => {
		setCopyValue(e);
		setCopied(true);
	};

	return pageLoaded ? (
		<Layout user={userData}>
			<NextSeo title={imagesDetailPageTitle} />

			<ImagesDetailDiv tw="h-screen flex overflow-hidden bg-white">
				<MainSidebar
					width={width}
					user={userData}
					openMobileSidebar={openMobileSidebar}
					setOpenMobileSidebar={setOpenMobileSidebar}
				/>

				<div tw="flex flex-col w-0 flex-1 overflow-hidden">
					<div tw="relative z-10 flex-shrink-0 flex h-16 lg:h-0 bg-white border-b lg:border-0 border-gray-200 lg:mb-4">
						<MobileSidebarButton openMobileSidebar={openMobileSidebar} setOpenMobileSidebar={setOpenMobileSidebar} />
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
						<div tw="w-full p-6 mx-auto grid gap-16 xl:grid-cols-1 2xl:grid-cols-3 lg:col-gap-5 lg:row-gap-12">
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
															{imagesPageTitle}
														</a>
													</Link>
												</div>
											</li>
											<li>
												<div tw="flex items-center">
													<ChevronRightIcon tw="flex-shrink-0 h-5 w-5 text-gray-400" />
													<p aria-current="page" tw="cursor-default ml-4 text-sm font-medium text-gray-700">
														{imageDetailData.url}
													</p>
												</div>
											</li>
										</ol>
									</nav>
									<div tw="pt-4 m-auto">
										<h4 tw="flex items-center text-2xl leading-8 font-medium text-gray-900 leading-8 break-all">
											{imageDetailData.url} - {siteIdData.name}
										</h4>
									</div>
								</div>
								<div tw="max-w-4xl py-6 px-8">
									<div tw="bg-white border border-gray-300 overflow-hidden sm:rounded-lg py-2 px-1">
										<div tw="px-4 py-5 sm:p-0">
											<dl>
												<div tw="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
													<dt tw="text-sm leading-5 font-medium text-gray-500">Created at</dt>
													<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
														{user && user !== undefined && !user.settings.disableLocalTime ? (
															<>
																<Moment calendar={calendarStrings} date={imageDetailData.created_at} local />
																&nbsp;
																<Moment date={imageDetailData.created_at} format="hh:mm:ss A" local />
															</>
														) : (
															<>
																<Moment calendar={calendarStrings} date={imageDetailData.created_at} utc />
																&nbsp;
																<Moment date={imageDetailData.created_at} format="hh:mm:ss A" utc />
															</>
														)}
													</dd>
												</div>
												<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
													<dt tw="text-sm leading-5 font-medium text-gray-500">Type</dt>
													<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
														{imageDetailData.type === "PAGE"
															? "Page"
															: imageDetailData.type === "EXTERNAL"
															? "External"
															: imageDetailData.type === "NON_WEB"
															? "Non-Web"
															: "Other"}
													</dd>
												</div>
												<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
													<dt tw="text-sm leading-5 font-medium text-gray-500">Status</dt>
													<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
														{imageDetailData.status === "OK" ? (
															<SiteSuccessBadge text={"OK"} />
														) : imageDetailData.status === "TIMEOUT" ? (
															<SiteWarningBadge text={"TIMEOUT"} />
														) : imageDetailData.status === "HTTP_ERROR" ? (
															<SiteDangerBadge text={"HTTP ERROR"} />
														) : (
															<SiteDangerBadge text={"OTHER ERROR"} />
														)}
													</dd>
												</div>
												{imageDetailData.error !== null && imageDetailData.error !== undefined ? (
													<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
														<dt tw="text-sm leading-5 font-medium text-gray-500">Error</dt>
														<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
															<SiteDangerBadge text={imageDetailData.error} />
														</dd>
													</div>
												) : null}
												<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
													<dt className="text-sm leading-5 font-medium text-gray-500">Image Size</dt>
													<dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
														{imageDetailData.size !== null &&
														imageDetailData.size !== undefined &&
														imageDetailData.size !== "" ? (
															bytes(imageDetailData.size, {
																thousandsSeparator: " ",
																unitSeparator: " "
															})
														) : (
															<span tw="text-gray-500">None</span>
														)}
													</dd>
												</div>
												<div tw="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
													<dt tw="text-sm leading-5 font-medium text-gray-500">Page Links</dt>
													<dd tw="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
														<ul>
															{imageDetailData &&
																imageDetailData !== undefined &&
																imageDetailData !== [] &&
																Object.keys(imageDetailData).length > 0 &&
																imageDetailData.pages.map((val, key) => {
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

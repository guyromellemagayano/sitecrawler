// React
import { Fragment, useState, useEffect } from "react";

// NextJS
import Link from "next/link";
import { useRouter } from "next/router";

// External
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/solid";
import { LinkIcon } from "@heroicons/react/outline";
import { NextSeo } from "next-seo";
import { withResizeDetector } from "react-resize-detector";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import tw, { styled } from "twin.macro";

// JSON
import LinksLabel from "public/labels/pages/site/links.json";
import LinksUrlContent from "public/data/links-url.json";

// Hooks
import { useScan, useSite, useLinks, useSiteId } from "src/hooks/useSite";
import usePostMethod from "src/hooks/usePostMethod";
import useUser from "src/hooks/useUser";

// Layout
import Layout from "src/components/Layout";

// Components
import LinkFilter from "src/components/helpers/filters/LinkFilter";
import LinkOptions from "src/components/pages/overview/LinkOptions";
import LinkSorting from "src/components/helpers/sorting/LinkSorting";
import LinkTable from "src/components/tables/LinkTable";
import Loader from "src/components/layouts/Loader";
import MainSidebar from "src/components/sidebar/MainSidebar";
import MobileSidebarButton from "src/components/buttons/MobileSidebarButton";
import MyPagination from "src/components/pagination/Pagination";
import SiteFooter from "src/components/layouts/Footer";

// Helpers
import { removeURLParameter } from "src/helpers/functions";

const LinksDiv = styled.section`
	.url-type-tooltip,
	.status-tooltip {
		max-width: 15rem;
		margin-left: 5px !important;
		padding: 1rem 1.5rem;
	}

	@media only screen and (max-width: 1400px) {
		td:first-child {
			max-width: 15rem;
		}
	}

	@media only screen and (min-width: 1600px) {
		td {
			min-width: 10rem;

			&:first-child {
				max-width: 20rem;
			}
		}

		.min-width-adjust {
			min-width: 15rem;
		}
	}
`;

const Links = ({ width, result }) => {
	const [crawlFinished, setCrawlFinished] = useState(false);
	const [linksPerPage, setLinksPerPage] = useState(20);
	const [loadQueryString, setLoadQueryString] = useState("");
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
	const [pageLoaded, setPageLoaded] = useState(false);
	const [pagePath, setPagePath] = useState("");
	const [recrawlable, setRecrawlable] = useState(false);
	const [scanObjId, setScanObjId] = useState(0);
	const [searchKey, setSearchKey] = useState("");

	const { asPath } = useRouter();
	const router = useRouter();

	let pageTitle = "";
	let homeLabel = "Home";
	let homePageLink = `/site/${result.siteId}/overview`;

	let reCrawlEndpoint = `/api/site/${result.siteId}/start_scan/`;
	let sitesApiEndpoint = `/api/site/?ordering=name`;

	let scanApiEndpoint = "";

	let currentScanResults = [];
	let previousScanResults = [];

	let queryString = "";
	let statusString = "";
	let typeString = "";

	const { user: user } = useUser({
		redirectIfFound: false,
		redirectTo: "/login"
	});

	const { scan: scan } = useScan({
		querySid: result.siteId
	});

	const { site: site } = useSite({
		endpoint: sitesApiEndpoint
	});

	const { siteId: siteId } = useSiteId({
		querySid: result.siteId
	});

	if (siteId && siteId !== undefined && Object.keys(siteId).length > 0) {
		pageTitle =
			siteId.name && siteId.name !== undefined ? LinksLabel[1].label + " - " + siteId.name : LinksLabel[1].label;
	}

	useEffect(() => {
		if (scan && scan !== undefined && Object.keys(scan).length > 0) {
			if (scan.results && scan.results !== undefined && Object.keys(scan.results).length > 0) {
				currentScanResults = scan.results.find((e) => e.finished_at === null);
				previousScanResults = scan.results.find((e) => e.finished_at !== null);

				if (currentScanResults !== [] || currentScanResults !== undefined) {
					if (!crawlFinished) {
						if (previousScanResults !== undefined) {
							setScanObjId(previousScanResults.id);
						} else {
							setScanObjId(currentScanResults.id);
						}
					} else {
						if (previousScanResults !== undefined) {
							setScanObjId(previousScanResults.id);
						} else {
							setScanObjId(currentScanResults.id);
						}
					}
				}
			}
		}
	}, [crawlFinished, scan, scanObjId]);

	scanApiEndpoint =
		result.page !== undefined
			? `/api/site/${result.siteId}/scan/${scanObjId}/link/?per_page=` + linksPerPage + `&page=` + result.page
			: `/api/site/${result.siteId}/scan/${scanObjId}/link/?per_page=` + linksPerPage;

	statusString = Array.isArray(result.status) ? result.status.join("&status=") : result.status;

	queryString +=
		result.status !== undefined
			? scanApiEndpoint.includes("?")
				? `&status=${statusString}`
				: `?status=${statusString}`
			: "";

	typeString = Array.isArray(result.type) ? result.type.join("&type=") : result.type;

	queryString +=
		result.type !== undefined ? (scanApiEndpoint.includes("?") ? `&type=${typeString}` : `?type=${typeString}`) : "";

	queryString +=
		result.search !== undefined
			? scanApiEndpoint.includes("?")
				? `&search=${result.search}`
				: `?search=${result.search}`
			: "";

	queryString +=
		result.ordering !== undefined
			? scanApiEndpoint.includes("?")
				? `&ordering=${result.ordering}`
				: `?ordering=${result.ordering}`
			: "";

	queryString +=
		typeof window !== "undefined" && loadQueryString.toString() !== "" && loadQueryString.toString() !== undefined
			? scanApiEndpoint.includes("?")
				? window.location.search.replace("?", "&")
				: window.location.search
			: "";

	scanApiEndpoint += queryString;

	const { links: links, mutateLinks: mutateLinks } = useLinks({
		endpoint: scanApiEndpoint,
		querySid: result.siteId,
		scanObjId: scanObjId && scanObjId !== undefined && scanObjId !== 0 && scanObjId
	});

	useEffect(() => {
		if (
			user &&
			user !== undefined &&
			Object.keys(user).length > 0 &&
			site &&
			site !== undefined &&
			Object.keys(site).length > 0 &&
			siteId &&
			siteId !== undefined &&
			Object.keys(siteId).length > 0 &&
			links &&
			links !== undefined &&
			Object.keys(links).length > 0
		) {
			setTimeout(() => {
				setPageLoaded(true);
			}, 500);
		}
	}, [user, site, siteId, links]);

	const handleSearch = async (e) => {
		const searchTargetValue = e.target.value;

		if (e.keyCode !== 13) return false;

		let newPath = asPath;
		newPath = removeURLParameter(newPath, "search");
		newPath = removeURLParameter(newPath, "page");

		if (!/\S/.test(searchTargetValue)) {
			setSearchKey(searchTargetValue);
		} else {
			if (newPath.includes("?")) newPath += `&search=${searchTargetValue}`;
			else newPath += `?search=${searchTargetValue}`;

			setSearchKey(searchTargetValue);
		}

		if (newPath.includes("?")) setPagePath(`${newPath}&`);
		else setPagePath(`${newPath}?`);

		router.push(newPath);
		mutateLinks;
	};

	const onItemsPerPageChange = (count) => {
		const countValue = parseInt(count.target.value);

		let newPath = asPath;
		newPath = removeURLParameter(newPath, "page");

		if (countValue) {
			if (newPath.includes("per_page")) {
				newPath = removeURLParameter(newPath, "per_page");
			}
			if (newPath.includes("?")) newPath += `&per_page=${countValue}`;
			else newPath += `?per_page=${countValue}`;

			setLinksPerPage(countValue);

			if (newPath.includes("?")) setPagePath(`${newPath}&`);
			else setPagePath(`${newPath}?`);

			router.push(newPath);
			mutateLinks;
		}
	};

	useEffect(() => {
		if (removeURLParameter(asPath, "page").includes("?")) setPagePath(`${removeURLParameter(asPath, "page")}&`);
		else setPagePath(`${removeURLParameter(asPath, "page")}?`);

		if (result.search !== undefined) setSearchKey(result.search);

		if (result.per_page !== undefined) setLinksPerPage(result.per_page);
	}, []);

	const handleOnCrawl = async () => {
		setCrawlFinished(false);

		try {
			const response = await usePostMethod(reCrawlEndpoint);
			const data = await response.data;

			if (Math.floor(response.status / 200) === 1) {
				if (data) {
					return data;
				}
			} else {
				// FIXME: report issues from here to Sentry
				return null;
			}
		} catch (error) {
			throw error.message;
		}
	};

	const handleCrawl = (finished) => {
		if (finished) setCrawlFinished(true);

		if (
			user &&
			user.permissions !== undefined &&
			user.permissions.includes("can_start_scan") &&
			siteId &&
			siteId.verified &&
			finished
		)
			setRecrawlable(true);
		else setRecrawlable(false);
	};

	return user && user !== undefined && Object.keys(user).length > 0 && pageLoaded ? (
		<Layout user={user}>
			<NextSeo title={pageTitle} />

			<LinksDiv tw="h-screen flex overflow-hidden bg-white">
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

						<LinkOptions
							sid={result.siteId}
							user={user}
							searchKey={searchKey}
							onSearchEvent={handleSearch}
							onCrawl={handleOnCrawl}
							crawlable={recrawlable}
							crawlFinished={crawlFinished}
							crawlableHandler={handleCrawl}
						/>
					</div>

					<main tw="flex-1 relative overflow-y-auto focus:outline-none" tabIndex="0">
						<div tw="w-full p-6 mx-auto">
							<div className="max-w-full py-4 px-8">
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
												<p aria-current="page" tw="cursor-default ml-4 text-sm font-medium text-gray-700">
													{pageTitle}
												</p>
											</div>
										</li>
									</ol>
								</nav>
								<div className="pt-4 m-auto">
									<h4 className="flex items-center text-2xl leading-6 font-medium text-gray-900">
										{pageTitle}
										{links && links !== undefined && links !== [] && Object.keys(links).length > 0 ? (
											<dl tw="inline-flex flex-col mb-2 lg:mb-0 lg:ml-5 sm:flex-row sm:flex-wrap">
												<dd tw="flex items-center text-base leading-5 text-gray-500 font-medium sm:mr-6">
													<LinkIcon tw="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
													{links.count > 1
														? links.count + " " + LinksLabel[2].label
														: links.count == 1
														? links.count + " " + LinksLabel[11].label
														: LinksLabel[3].label}
												</dd>
											</dl>
										) : null}
									</h4>
								</div>
							</div>
						</div>
						<div tw="max-w-full px-4 py-4 sm:px-6 md:px-8">
							<LinkFilter
								result={result}
								loadQueryString={loadQueryString}
								setLoadQueryString={setLoadQueryString}
								mutateLinks={mutateLinks}
								setPagePath={setPagePath}
							/>

							<div tw="pb-4">
								<div tw="flex flex-col">
									<div tw="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
										<div tw="align-middle inline-block min-w-full overflow-hidden rounded-lg border-gray-300">
											<table tw="relative min-w-full">
												<thead>
													<tr>
														{LinksUrlContent.map((site, key) => {
															return (
																<Fragment key={key}>
																	<th
																		className="min-width-adjust"
																		tw="px-6 py-3 border-b border-gray-300 bg-white text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
																	>
																		<div tw="flex items-center justify-start">
																			{site.slug && site.slug !== undefined ? (
																				<LinkSorting
																					result={result}
																					slug={site.slug}
																					mutateLinks={mutateLinks}
																					linksUrlContent={LinksUrlContent}
																					setPagePath={setPagePath}
																				/>
																			) : null}
																			<span className="label" tw="flex items-center">
																				{site.label}
																				{site.slug &&
																				(site.slug === "url-type" ||
																					site.slug === "status" ||
																					site.slug === "http-code") ? (
																					<>
																						<a
																							data-tip
																							data-for={site.slug}
																							data-background-color={"#4A5568"}
																							data-iscapture="true"
																							tw="flex items-center"
																						>
																							<span tw="ml-2 inline-block w-4 h-4 overflow-hidden">
																								<svg fill="currentColor" viewBox="0 0 20 20">
																									<path
																										fillRule="evenodd"
																										d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
																										clipRule="evenodd"
																									></path>
																								</svg>
																							</span>
																						</a>
																						<ReactTooltip
																							id={site.slug}
																							tw="w-36"
																							className={site.slug + "-tooltip"}
																							type="dark"
																							effect="solid"
																							place="bottom"
																							multiline={true}
																						>
																							<span tw="text-left text-xs leading-4 font-normal text-white normal-case tracking-wider">
																								{site.slug === "status" ? (
																									<ul>
																										<li tw="mb-2">
																											<strong>{LinksLabel[5].label}</strong> -{" "}
																											{LinksLabel[5].description}
																										</li>
																										<li tw="mb-2">
																											<strong>{LinksLabel[6].label}</strong> -{" "}
																											{LinksLabel[6].description}
																										</li>
																										<li tw="mb-2">
																											<strong>{LinksLabel[7].label}</strong> -{" "}
																											{LinksLabel[7].description}
																										</li>
																										<li tw="mb-2">
																											<strong>{LinksLabel[8].label}</strong> -{" "}
																											{LinksLabel[8].description}
																										</li>
																									</ul>
																								) : (
																									<p>{LinksLabel[9].label}</p>
																								)}
																							</span>
																						</ReactTooltip>
																					</>
																				) : null}
																			</span>
																		</div>
																	</th>
																</Fragment>
															);
														})}
													</tr>
												</thead>
												<tbody tw="relative">
													{links &&
														links !== undefined &&
														links !== [] &&
														Object.keys(links).length > 0 &&
														links.results &&
														links.results.map((val, key) => <LinkTable key={key} val={val} user={user} />)}
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</div>

							<MyPagination
								href="/site/[siteId]/links/"
								pathName={pagePath}
								apiEndpoint={scanApiEndpoint}
								page={result.page ? result.page : 0}
								linksPerPage={linksPerPage}
								onItemsPerPageChange={onItemsPerPageChange}
							/>
						</div>

						<div tw="static bottom-0 w-full mx-auto px-12 py-4">
							<SiteFooter />
						</div>
					</main>
				</div>
			</LinksDiv>
		</Layout>
	) : (
		<Loader />
	);
};

Links.propTypes = {};

export default withResizeDetector(Links);

export async function getServerSideProps(ctx) {
	return {
		props: {
			result: ctx.query
		}
	};
}

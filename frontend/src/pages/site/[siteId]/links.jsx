// React
import { Fragment, useState, useEffect } from "react";

// NextJS
import Link from "next/link";
import Router, { useRouter } from "next/router";

// External
import { NextSeo } from "next-seo";
import { withResizeDetector } from "react-resize-detector";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import tw, { styled } from "twin.macro";

// JSON
import LinksLabel from "public/labels/pages/site/links.json";
import LinksUrlContent from "public/data/links-url.json";

// Hooks
import usePostMethod from "src/hooks/usePostMethod";
import { useScan, useSite, useLinks, useSiteId } from "src/hooks/useSite";
import useUser from "src/hooks/useUser";

// Layout
import Layout from "src/components/Layout";

// Components
import ChevronRightSvg from "src/components/svg/solid/ChevronRightSvg";
import HomeSvg from "src/components/svg/solid/HomeSvg";
import LinkFilter from "src/components/site/LinkFilter";
import LinkOptions from "src/components/site/LinkOptions";
import LinkSorting from "src/components/site/LinkSorting";
import LinkTable from "src/components/site/LinkTable";
import LinksSvg from "src/components/svg/outline/LinksSvg";
import MainSidebar from "src/components/sidebar/MainSidebar";
import MyPagination from "src/components/sites/Pagination";

// Loadable
const Loader = loadable(() => import("src/components/layout/Loader"));
const MobileSidebarButton = loadable(() => import("src/components/sidebar/MobileSidebarButton"));
const SiteFooter = loadable(() => import("src/components/footer/SiteFooter"));

// Helpers
import { removeURLParameter, slugToCamelcase, getSortKeyFromSlug, getSlugFromSortKey } from "src/helpers/functions";

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
	}

	@media only screen and (max-width: 960px) {
		.min-width-adjust {
			min-width: 12rem;
		}
	}
`;

const initialOrder = {
	linkUrl: "default",
	urlType: "default",
	status: "default",
	httpCode: "default",
	linkLocation: "default",
	occurrences: "default"
};

const Links = ({ width, result }) => {
	const [allFilter, setAllFilter] = useState(false);
	const [crawlFinished, setCrawlFinished] = useState(false);
	const [externalFilter, setExternalFilter] = useState(false);
	const [internalFilter, setInternalFilter] = useState(false);
	const [issueFilter, setIssueFilter] = useState(false);
	const [linksData, setLinksData] = useState([]);
	const [linksPerPage, setLinksPerPage] = useState(20);
	const [loadQueryString, setLoadQueryString] = useState("");
	const [noIssueFilter, setNoIssueFilter] = useState(false);
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
	const [pageLoaded, setPageLoaded] = useState(false);
	const [pagePath, setPagePath] = useState("");
	const [recrawlable, setRecrawlable] = useState(false);
	const [scanData, setScanData] = useState([]);
	const [scanObjId, setScanObjId] = useState(0);
	const [searchKey, setSearchKey] = useState("");
	const [siteData, setSiteData] = useState([]);
	const [siteIdData, setSiteIdData] = useState([]);
	const [sortOrder, setSortOrder] = useState(initialOrder);
	const [userData, setUserData] = useState([]);

	const { asPath } = useRouter();

	const pageTitle =
		siteIdData.name && siteIdData.name !== undefined
			? LinksLabel[1].label + " - " + siteIdData.name
			: LinksLabel[1].label;
	const homeLabel = "Home";
	const homePageLink = `/site/${result.siteId}/overview`;
	const reCrawlEndpoint = `/api/site/${result.siteId}/start_scan/`;
	const sitesApiEndpoint = `/api/site/?ordering=name`;

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

	let scanApiEndpoint =
		result.page !== undefined
			? `/api/site/${result.siteId}/scan/${scanObjId}/link/?per_page=` + linksPerPage + `&page=` + result.page
			: `/api/site/${result.siteId}/scan/${scanObjId}/link/?per_page=` + linksPerPage;

	let queryString = "";

	const statusString = Array.isArray(result.status) ? result.status.join("&status=") : result.status;

	queryString +=
		result.status !== undefined
			? scanApiEndpoint.includes("?")
				? `&status=${statusString}`
				: `?status=${statusString}`
			: "";

	const typeString = Array.isArray(result.type) ? result.type.join("&type=") : result.type;

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
		scanObjId: scanObjId
	});

	useEffect(() => {
		if (user && user !== undefined && Object.keys(user).length > 0) {
			setUserData(user);
		}

		if (site && site !== undefined && Object.keys(site).length > 0) {
			setSiteData(site);
		}

		if (siteId && siteId !== undefined && Object.keys(siteId).length > 0) {
			setSiteIdData(siteId);
		}

		if (links && links !== undefined && Object.keys(links).length > 0) {
			setLinksData(links);
		}

		if (userData && siteData && siteIdData && linksData) {
			setTimeout(() => {
				setPageLoaded(true);
			}, 500);
		}
	}, [user, site, siteId, links]);

	const searchEventHandler = async (e) => {
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

		Router.push(newPath);
		mutateLinks();
	};

	const filterChangeHandler = async (e) => {
		const filterType = e.target.value;
		const filterStatus = e.target.checked;

		let newPath = asPath;
		newPath = removeURLParameter(newPath, "page");

		if (filterType == "issues" && filterStatus == true) {
			setIssueFilter(true);
			setNoIssueFilter(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "status");

			if (newPath.includes("?")) newPath += `&status=TIMEOUT&status=HTTP_ERROR&status=OTHER_ERROR`;
			else newPath += `?status=TIMEOUT&status=HTTP_ERROR&status=OTHER_ERROR`;
		} else if (filterType == "issues" && filterStatus == false) {
			loadQueryString && loadQueryString.delete("status");
			loadQueryString && loadQueryString.delete("page");

			if (newPath.includes("status")) newPath = removeURLParameter(newPath, "status");

			setIssueFilter(false);
		}

		if (filterType == "no-issues" && filterStatus == true) {
			setIssueFilter(false);
			setNoIssueFilter(true);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "status");

			if (newPath.includes("?")) newPath += `&status=OK`;
			else newPath += `?status=OK`;
		} else if (filterType == "no-issues" && filterStatus == false) {
			loadQueryString && loadQueryString.delete("status");
			loadQueryString && loadQueryString.delete("page");

			if (newPath.includes("status")) newPath = removeURLParameter(newPath, "status");

			setNoIssueFilter(false);
		}

		if (filterType == "internal" && filterStatus == true) {
			setInternalFilter(true);
			setExternalFilter(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "type");
			newPath = removeURLParameter(newPath, "page");

			if (newPath.includes("?")) newPath += `&type=PAGE`;
			else newPath += `?type=PAGE`;
		} else if (filterType == "internal" && filterStatus == false) {
			loadQueryString && loadQueryString.delete("type");
			loadQueryString && loadQueryString.delete("page");

			if (newPath.includes("type=PAGE")) newPath = removeURLParameter(newPath, "type");

			setInternalFilter(false);
		}

		if (filterType == "external" && filterStatus == true) {
			setExternalFilter(true);
			setInternalFilter(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "page");
			newPath = removeURLParameter(newPath, "type");

			if (newPath.includes("?")) newPath += `&type=EXTERNAL`;
			else newPath += `?type=EXTERNAL`;
		} else if (filterType == "external" && filterStatus == false) {
			loadQueryString && loadQueryString.delete("type");
			loadQueryString && loadQueryString.delete("page");

			if (newPath.includes("type=EXTERNAL")) newPath = removeURLParameter(newPath, "type");

			setExternalFilter(false);
		}

		if (filterType == "all" && filterStatus == true) {
			setAllFilter(true);
			setIssueFilter(false);
			setNoIssueFilter(false);
			setExternalFilter(false);
			setInternalFilter(false);

			newPath = removeURLParameter(newPath, "status");
			newPath = removeURLParameter(newPath, "type");
			newPath = removeURLParameter(newPath, "page");

			// if (!newPath.includes("search") && !newPath.includes("ordering"))
			//   newPath = newPath.replace("?", "");
		}

		if (newPath.includes("?")) setPagePath(`${newPath}&`);
		else setPagePath(`${newPath}?`);

		Router.push(newPath);
		mutateLinks();

		return true;
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

			Router.push(newPath);
			mutateLinks();

			return true;
		}
	};

	useEffect(() => {
		if (removeURLParameter(asPath, "page").includes("?")) setPagePath(`${removeURLParameter(asPath, "page")}&`);
		else setPagePath(`${removeURLParameter(asPath, "page")}?`);

		if (result.search !== undefined) setSearchKey(result.search);

		if (result.ordering !== undefined) {
			const slug = getSlugFromSortKey(LinksUrlContent, result.ordering.replace("-", ""));
			const orderItem = slugToCamelcase(slug);

			if (result.ordering.includes("-")) setSortOrder((prevState) => ({ ...prevState, [orderItem]: "desc" }));
			else setSortOrder((prevState) => ({ ...prevState, [orderItem]: "asc" }));
		}

		if (result.per_page !== undefined) setLinksPerPage(result.per_page);

		setLoadQueryString(new URLSearchParams(window.location.search));

		let loadQueryStringValue = new URLSearchParams(window.location.search);

		if (loadQueryStringValue.has("status")) {
			if (
				loadQueryStringValue.getAll("status").includes("TIMEOUT") &&
				loadQueryStringValue.getAll("status").includes("HTTP_ERROR") &&
				loadQueryStringValue.getAll("status").includes("OTHER_ERROR")
			) {
				setIssueFilter(true);
				setNoIssueFilter(false);
				setAllFilter(false);
				setInternalFilter(false);
				setExternalFilter(false);
			}

			if (loadQueryStringValue.get("status") === "OK") {
				setNoIssueFilter(true);
				setIssueFilter(false);
				setAllFilter(false);
				setInternalFilter(false);
				setExternalFilter(false);
			}
		}

		if (loadQueryStringValue.has("type")) {
			if (loadQueryStringValue.get("type") === "PAGE") {
				setInternalFilter(true);
				setExternalFilter(false);
				setAllFilter(false);
			} else if (loadQueryStringValue.get("type") === "EXTERNAL") {
				setExternalFilter(true);
				setInternalFilter(false);
				setAllFilter(false);
			} else if (loadQueryStringValue.get("type") === "EXTERNALOTHER") {
				setExternalFilter(true);
				setInternalFilter(false);
				setAllFilter(false);
			}
		}

		if (!loadQueryStringValue.has("type") && !loadQueryStringValue.has("status")) {
			setNoIssueFilter(false);
			setIssueFilter(false);
			setInternalFilter(false);
			setExternalFilter(false);
			setAllFilter(true);
		}
	}, []);

	useEffect(() => {
		if (result.status !== undefined && result.status === "OK") {
			setNoIssueFilter(true);
			setIssueFilter(false);
			setAllFilter(false);
			setInternalFilter(false);
			setExternalFilter(false);
		}

		if (
			result.status !== undefined &&
			result.status.includes("TIMEOUT") &&
			result.status.includes("HTTP_ERROR") &&
			result.status.includes("OTHER_ERROR")
		) {
			setIssueFilter(true);
			setNoIssueFilter(false);
			setAllFilter(false);
			setInternalFilter(false);
			setExternalFilter(false);
		}

		if (
			result.status == undefined &&
			result.type !== undefined &&
			(result.type === "EXTERNAL" || result.type === "PAGE")
		) {
			setIssueFilter(false);
			setNoIssueFilter(false);
			setAllFilter(false);
			setInternalFilter(false);
			setExternalFilter(false);
		}

		if (result.type !== undefined && result.type == "PAGE") {
			setInternalFilter(true);
			setExternalFilter(false);
			setAllFilter(false);
		}

		if (Array.isArray(result.type)) {
			if (result.type !== undefined && result.type.join("") == "EXTERNALOTHER") {
				setExternalFilter(true);
				setInternalFilter(false);
				setAllFilter(false);
			}
		} else {
			if (result.type !== undefined && result.type == "EXTERNAL") {
				setExternalFilter(true);
				setInternalFilter(false);
				setAllFilter(false);
			}
		}

		if (loadQueryString && loadQueryString !== undefined && loadQueryString.toString().length === 0) {
			if (result.type == undefined && result.status == undefined) {
				setIssueFilter(false);
				setNoIssueFilter(false);
				setInternalFilter(false);
				setExternalFilter(false);
				setAllFilter(true);
			}
		}
	}, [filterChangeHandler, loadQueryString]);

	const SortHandler = (slug, dir) => {
		setSortOrder({ ...initialOrder });

		let newPath = removeURLParameter(asPath, "ordering");

		const sortItem = slugToCamelcase(slug);
		const sortKey = getSortKeyFromSlug(LinksUrlContent, slug);

		if (sortOrder[sortItem] == "default") {
			setSortOrder((prevState) => ({ ...prevState, [sortItem]: dir }));
			if (dir == "asc") {
				if (newPath.includes("?")) newPath += `&ordering=${sortKey}`;
				else newPath += `?ordering=${sortKey}`;
			} else {
				if (newPath.includes("?")) newPath += `&ordering=-${sortKey}`;
				else newPath += `?ordering=-${sortKey}`;
			}
		} else if (sortOrder[sortItem] == "asc") {
			setSortOrder((prevState) => ({ ...prevState, [sortItem]: "desc" }));
			if (newPath.includes("?")) newPath += `&ordering=-${sortKey}`;
			else newPath += `?ordering=-${sortKey}`;
		} else {
			setSortOrder((prevState) => ({ ...prevState, [sortItem]: "asc" }));
			if (newPath.includes("?")) newPath += `&ordering=${sortKey}`;
			else newPath += `?ordering=${sortKey}`;
		}

		// console.log('[pagePath]', newPath)
		if (newPath.includes("?")) setPagePath(`${removeURLParameter(newPath, "page")}&`);
		else setPagePath(`${removeURLParameter(newPath, "page")}?`);

		Router.push(newPath);
		mutateLinks();
	};

	const onCrawlHandler = async () => {
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

	const crawlableHandler = (finished) => {
		if (finished) setCrawlFinished(true);

		if (
			user &&
			user.permissions !== undefined &&
			user.permissions.includes("can_start_scan") &&
			siteIdData &&
			siteIdData.verified &&
			finished
		)
			setRecrawlable(true);
		else setRecrawlable(false);
	};

	return pageLoaded ? (
		<Layout user={userData}>
			<NextSeo title={pageTitle} />

			<LinksDiv tw="h-screen flex overflow-hidden bg-white">
				<MainSidebar
					width={width}
					user={userData}
					site={siteData}
					openMobileSidebar={openMobileSidebar}
					setOpenMobileSidebar={setOpenMobileSidebar}
				/>

				<div tw="flex flex-col w-0 flex-1 overflow-hidden">
					<div tw="relative flex-shrink-0 flex h-16 bg-white border-b border-gray-200 lg:mb-4">
						<MobileSidebarButton openMobileSidebar={openMobileSidebar} setOpenMobileSidebar={setOpenMobileSidebar} />
						<LinkOptions
							sid={result.siteId}
							user={userData}
							searchKey={searchKey}
							onSearchEvent={searchEventHandler}
							onCrawl={onCrawlHandler}
							crawlable={recrawlable}
							crawlFinished={crawlFinished}
							crawlableHandler={crawlableHandler}
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
														<HomeSvg className={tw`flex-shrink-0 h-5 w-5`} />
														<span tw="sr-only">{homeLabel}</span>
													</a>
												</Link>
											</div>
										</li>
										<li>
											<div tw="flex items-center">
												<ChevronRightSvg className={tw`flex-shrink-0 h-5 w-5 text-gray-400`} />
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
										<dl tw="inline-flex flex-col mb-2 lg:mb-0 lg:ml-5 sm:flex-row sm:flex-wrap">
											<dd tw="flex items-center text-base leading-5 text-gray-500 font-medium sm:mr-6">
												<LinksSvg className={tw`flex-shrink-0 mr-2 h-5 w-5 text-gray-400`} />
												{linksData.count > 1
													? linksData.count + " " + LinksLabel[2].label
													: linksData.count == 1
													? linksData.count + " " + LinksLabel[11].label
													: LinksLabel[3].label}
											</dd>
										</dl>
									</h4>
								</div>
							</div>
						</div>
						<div tw="max-w-full px-4 py-4 sm:px-6 md:px-8">
							<LinkFilter
								onFilterChange={filterChangeHandler}
								allFilter={allFilter}
								noIssueFilter={noIssueFilter}
								issueFilter={issueFilter}
								internalFilter={internalFilter}
								externalFilter={externalFilter}
							/>
							<div tw="pb-4">
								<div tw="flex flex-col">
									<div tw="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
										<div tw="align-middle inline-block min-w-full overflow-hidden rounded-lg border-gray-300">
											<table tw="min-w-full">
												<thead>
													<tr>
														{LinksUrlContent.map((site, key) => {
															return (
																<Fragment key={key}>
																	<th
																		css={[
																			tw`px-6 py-3 border-b border-gray-300 bg-white text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider`,
																			site.slug === "url-type" || site.slug === "occurrences"
																				? "min-width-adjust"
																				: "min-w-full"
																		]}
																	>
																		<div tw="flex items-center justify-start">
																			{site.slug !== undefined ? (
																				<LinkSorting
																					sortOrder={sortOrder}
																					onSortHandler={SortHandler}
																					key={key}
																					slug={site.slug}
																				/>
																			) : null}
																			<span className="label" tw="flex items-center">
																				{site.label}
																				{site.slug === "url-type" ||
																				site.slug === "status" ||
																				site.slug === "http-code" ? (
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
												<tbody>
													{userData &&
														userData !== undefined &&
														userData !== [] &&
														Object.keys(userData).length > 0 &&
														linksData &&
														linksData !== undefined &&
														linksData !== [] &&
														Object.keys(linksData).length > 0 &&
														linksData.results &&
														linksData.results.map((val, key) => <LinkTable key={key} val={val} user={userData} />)}
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

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
import tw, { styled } from "twin.macro";

// JSON
import LinksPagesContent from "public/data/links-pages.json";
import PagesLabel from "public/labels/pages/site/pages.json";

// Hooks
import usePostMethod from "src/hooks/usePostMethod";
import { useScan, useSite, usePages, useSiteId } from "src/hooks/useSite";
import useUser from "src/hooks/useUser";

// Layout
import Layout from "src/components/Layout";

// Components
import ChevronRightSvg from "src/components/svg/solid/ChevronRightSvg";
import HomeSvg from "src/components/svg/solid/HomeSvg";
import LinkOptions from "src/components/site/LinkOptions";
import MainSidebar from "src/components/sidebar/MainSidebar";
import MyPagination from "src/components/sites/Pagination";
import PageFilter from "src/components/site/PageFilter";
import PageSorting from "src/components/site/PageSorting";
import PageSvg from "src/components/svg/outline/PageSvg";
import PageTable from "src/components/site/PageTable";
import PageTableSkeleton from "src/components/skeletons/PageTableSkeleton";
import ProfileSkeleton from "src/components/skeletons/ProfileSkeleton";

// Loadable
const Loader = loadable(() => import("src/components/layout/Loader"));
const MobileSidebarButton = loadable(() => import("src/components/sidebar/MobileSidebarButton"));
const SiteFooter = loadable(() => import("src/components/footer/SiteFooter"));

// Helpers
import { removeURLParameter, slugToCamelcase, getSortKeyFromSlug, getSlugFromSortKey } from "src/helpers/functions";

const PagesDiv = styled.section`
	@media only screen and (max-width: 960px) {
		.min-width-adjust {
			min-width: 12rem;
		}
	}
`;

const initialOrder = {
	pageLargePages: "default",
	pageBrokenSecurity: "default"
};

const Pages = ({ width, result }) => {
	const [allFilter, setAllFilter] = useState(false);
	const [brokenSecurityFilter, setBrokenSecurityFilter] = useState(false);
	const [crawlFinished, setCrawlFinished] = useState(false);
	const [largePageSizeFilter, setLargePageSizeFilter] = useState(false);
	const [linksPerPage, setLinksPerPage] = useState(20);
	const [loadQueryString, setLoadQueryString] = useState("");
	const [noIssueFilter, setNoIssueFilter] = useState(false);
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
	const [pageLoaded, setPageLoaded] = useState(false);
	const [pagePath, setPagePath] = useState("");
	const [pagesData, setPagesData] = useState([]);
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
			? PagesLabel[1].label + " - " + siteIdData.name
			: PagesLabel[1].label;
	const homeLabel = "Home";
	const homePageLink = `/site/${result.siteId}/overview`;
	const reCrawlEndpoint = `/api/site/${result.siteId}/start_scan/`;
	const sitesApiEndpoint = `/api/site/?ordering=name`;

	let pages = [];
	let mutatePages = [];
	let scanApiEndpoint = "";
	let queryString = "";

	const { user: user } = useUser({
		redirectIfFound: false,
		redirectTo: "/login"
		// refreshInterval: 1000
	});

	const { scan: scan } = useScan({
		querySid: result.siteId
		// refreshInterval: 1000
	});

	const { site: site } = useSite({
		endpoint: sitesApiEndpoint
		// refreshInterval: 1000
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

	if (
		user &&
		user !== undefined &&
		user !== [] &&
		Object.keys(user).length > 0 &&
		user.permissions &&
		user.permissions !== undefined &&
		user.permissions.includes("can_see_images") &&
		user.permissions.includes("can_see_pages") &&
		user.permissions.includes("can_see_scripts") &&
		user.permissions.includes("can_see_stylesheets") &&
		user.permissions.includes("can_start_scan")
	) {
		scanApiEndpoint =
			result.page !== undefined
				? `/api/site/${result.siteId}/scan/${scanObjId}/page/?per_page=` + linksPerPage + `&page=` + result.page
				: `/api/site/${result.siteId}/scan/${scanObjId}/page/?per_page=` + linksPerPage;

		queryString +=
			result.size_total_min !== undefined
				? scanApiEndpoint.includes("?")
					? `&size_total_min=1048576`
					: `?size_total_min=1048576`
				: "";

		queryString +=
			result.size_total_max !== undefined
				? scanApiEndpoint.includes("?")
					? `&size_total_max=1048575`
					: `?size_total_max=1048575`
				: "";

		queryString +=
			result.tls_total !== undefined
				? result.tls_total === "true"
					? scanApiEndpoint.includes("?")
						? `&tls_total=true`
						: `?tls_total=true`
					: scanApiEndpoint.includes("?")
					? `&tls_total=false`
					: `?tls_total=false`
				: "";

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
	}

	({ pages: pages, mutatePages: mutatePages } = usePages({
		endpoint: scanApiEndpoint,
		querySid: result.siteId,
		scanObjId: scanObjId
		// refreshInterval: 1000
	}));

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

		if (pages && pages !== undefined && Object.keys(pages).length > 0) {
			setPagesData(pages);
		}

		if (userData && siteData && siteIdData && pagesData) {
			setTimeout(() => {
				setPageLoaded(true);
			}, 500);
		}
	}, [user, site, siteId, pages]);

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
		mutatePages();
	};

	const filterChangeHandler = async (e) => {
		const filterType = e.target.value;
		const filterStatus = e.target.checked;

		let newPath = asPath;
		newPath = removeURLParameter(newPath, "page");

		if (filterType == "no-issues" && filterStatus == true) {
			setNoIssueFilter(true);
			setLargePageSizeFilter(false);
			setBrokenSecurityFilter(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "size_total_max");
			newPath = removeURLParameter(newPath, "size_total_min");
			newPath = removeURLParameter(newPath, "tls_total");

			if (newPath.includes("?")) newPath += `&size_total_max=1048575&tls_total=true`;
			else newPath += `?size_total_max=1048575&tls_total=true`;
		} else if (filterType == "no-issues" && filterStatus == false) {
			loadQueryString && loadQueryString.delete("size_total_max");
			// loadQueryString && loadQueryString.delete('size_total_min');
			loadQueryString && loadQueryString.delete("tls_total");
			loadQueryString && loadQueryString.delete("page");

			if (
				newPath.includes("size_total_max") &&
				newPath.includes("tls_total")
				// newPath.includes('size_total_min')
			) {
				newPath = removeURLParameter(newPath, "size_total_max");
				// newPath = removeURLParameter(newPath, 'size_total_min');
				newPath = removeURLParameter(newPath, "tls_total");
			}

			setNoIssueFilter(false);
		}

		if (filterType == "pageLargePages" && filterStatus == true) {
			setLargePageSizeFilter(true);
			setNoIssueFilter(false);
			setBrokenSecurityFilter(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "size_total_max");
			newPath = removeURLParameter(newPath, "size_total_min");
			newPath = removeURLParameter(newPath, "tls_total");

			if (newPath.includes("?")) newPath += `&size_total_min=1048576`;
			else newPath += `?size_total_min=1048576`;
		} else if (filterType == "pageLargePages" && filterStatus == false) {
			loadQueryString && loadQueryString.delete("size_total_min");
			loadQueryString && loadQueryString.delete("page");

			if (newPath.includes("size_total_min")) {
				newPath = removeURLParameter(newPath, "size_total_min");
			}

			setLargePageSizeFilter(false);
		}

		if (filterType == "pageBrokenSecurity" && filterStatus == true) {
			setBrokenSecurityFilter(true);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "size_total_min");
			newPath = removeURLParameter(newPath, "size_total_max");
			newPath = removeURLParameter(newPath, "tls_total");

			if (newPath.includes("?")) newPath += `&tls_total=false`;
			else newPath += `?tls_total=false`;
		} else if (filterType == "pageBrokenSecurity" && filterStatus == false) {
			loadQueryString && loadQueryString.delete("tls_total");
			loadQueryString && loadQueryString.delete("size_total_min");
			loadQueryString && loadQueryString.delete("size_total_max");
			loadQueryString && loadQueryString.delete("page");

			if (newPath.includes("tls_total")) {
				newPath = removeURLParameter(newPath, "size_total_max");
				newPath = removeURLParameter(newPath, "size_total_min");
				newPath = removeURLParameter(newPath, "tls_total");
			}

			setBrokenSecurityFilter(false);
		}

		if (filterType == "all" && filterStatus == true) {
			setNoIssueFilter(false);
			setLargePageSizeFilter(false);
			setBrokenSecurityFilter(false);
			setAllFilter(true);

			newPath = removeURLParameter(newPath, "size_total_min");
			newPath = removeURLParameter(newPath, "size_total_max");
			newPath = removeURLParameter(newPath, "tls_total");

			// if (!newPath.includes("search") && !newPath.includes("size_total_min"))
			//   newPath = newPath.replace("?", "");
		}

		if (newPath.includes("?")) setPagePath(`${newPath}&`);
		else setPagePath(`${newPath}?`);

		// console.log(newPath);

		Router.push(newPath);
		mutatePages();

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
			mutatePages();

			return true;
		}
	};

	useEffect(() => {
		if (removeURLParameter(asPath, "page").includes("?")) setPagePath(`${removeURLParameter(asPath, "page")}&`);
		else setPagePath(`${removeURLParameter(asPath, "page")}?`);

		if (result.search !== undefined) setSearchKey(result.search);

		if (result.ordering !== undefined) {
			const slug = getSlugFromSortKey(LinksPagesContent, result.ordering.replace("-", ""));
			const orderItem = slugToCamelcase(slug);

			if (result.ordering.includes("-")) setSortOrder((prevState) => ({ ...prevState, [orderItem]: "desc" }));
			else setSortOrder((prevState) => ({ ...prevState, [orderItem]: "asc" }));
		}

		if (result.per_page !== undefined) setLinksPerPage(result.per_page);

		setLoadQueryString(new URLSearchParams(window.location.search));

		let loadQueryStringValue = new URLSearchParams(window.location.search);

		if (loadQueryStringValue.has("size_total_min")) {
			setLargePageSizeFilter(true);
			setAllFilter(false);
			setNoIssueFilter(false);
			setBrokenSecurityFilter(false);
		}

		if (loadQueryStringValue.get("tls_total") === "false") {
			setBrokenSecurityFilter(true);
			setLargePageSizeFilter(false);
			setAllFilter(false);
			setNoIssueFilter(false);
		}

		if (loadQueryStringValue.has("size_total_max") && loadQueryStringValue.get("tls_total") === "true") {
			setBrokenSecurityFilter(false);
			setLargePageSizeFilter(false);
			setAllFilter(false);
			setNoIssueFilter(true);
		}

		if (
			!loadQueryStringValue.has("size_total_max") &&
			!loadQueryStringValue.has("size_total_min") &&
			!loadQueryStringValue.has("tls_total")
		) {
			setLargePageSizeFilter(false);
			setBrokenSecurityFilter(false);
			setNoIssueFilter(false);
			setAllFilter(true);
		}
	}, []);

	useEffect(() => {
		if (result.size_total_max !== undefined && result.tls_total !== undefined && result.tls_total == "true") {
			loadQueryString && loadQueryString.delete("size_total_min");

			setNoIssueFilter(true);
			setBrokenSecurityFilter(false);
			setLargePageSizeFilter(false);
			setAllFilter(false);
		}

		if (result.size_total_min !== undefined) {
			loadQueryString && loadQueryString.delete("size_total_max");
			loadQueryString && loadQueryString.delete("tls_total");

			setNoIssueFilter(false);
			setBrokenSecurityFilter(false);
			setLargePageSizeFilter(true);
			setAllFilter(false);
		}

		if (result.tls_total !== undefined && result.tls_total == "false") {
			setNoIssueFilter(false);
			setBrokenSecurityFilter(true);
			setLargePageSizeFilter(false);
			setAllFilter(false);
		}

		if (loadQueryString && loadQueryString !== undefined && loadQueryString.toString().length === 0) {
			if (result.size_total_max == undefined && result.size_total_min == undefined && result.tls_total == undefined) {
				setLargePageSizeFilter(false);
				setNoIssueFilter(false);
				setBrokenSecurityFilter(false);
				setAllFilter(true);
			}
		}
	}, [filterChangeHandler, loadQueryString]);

	const SortHandler = (slug, dir) => {
		setSortOrder({ ...initialOrder });

		let newPath = removeURLParameter(asPath, "ordering");

		const sortItem = slugToCamelcase(slug);
		const sortKey = getSortKeyFromSlug(LinksPagesContent, slug);

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
		mutatePages();
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

			<PagesDiv tw="h-screen flex overflow-hidden bg-white">
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
							{pageLoaded ? (
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
											{pagesData && pagesData !== undefined && pagesData !== [] && Object.keys(pagesData).length > 0 ? (
												<dl tw="inline-flex flex-col mb-2 lg:mb-0 lg:ml-5 sm:flex-row sm:flex-wrap">
													<dd tw="flex items-center text-base leading-5 text-gray-500 font-medium sm:mr-6">
														<PageSvg className={tw`flex-shrink-0 mr-2 h-5 w-5 text-gray-400`} />
														{pagesData.count > 1
															? pagesData.count + " " + PagesLabel[2].label
															: pagesData.count == 1
															? pagesData.count + " " + PagesLabel[6].label
															: PagesLabel[3].label}
													</dd>
												</dl>
											) : null}
										</h4>
									</div>
								</div>
							) : (
								<ProfileSkeleton />
							)}
						</div>
						<div tw="max-w-full px-4 py-4 sm:px-6 md:px-8">
							{userData &&
							userData !== undefined &&
							userData !== [] &&
							Object.keys(userData).length > 0 &&
							userData.permissions &&
							userData.permissions !== undefined &&
							userData.permissions.includes("can_see_images") &&
							userData.permissions.includes("can_see_pages") &&
							userData.permissions.includes("can_see_scripts") &&
							userData.permissions.includes("can_see_stylesheets") &&
							userData.permissions.includes("can_start_scan") ? (
								<PageFilter
									onFilterChange={filterChangeHandler}
									allFilter={allFilter}
									noIssueFilter={noIssueFilter}
									largePageSizeFilter={largePageSizeFilter}
									brokenSecurityFilter={brokenSecurityFilter}
								/>
							) : null}

							<div tw="pb-4">
								<div tw="flex flex-col">
									<div tw="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
										<div tw="align-middle inline-block min-w-full overflow-hidden rounded-lg border-gray-300">
											<table tw="min-w-full">
												<thead>
													<tr>
														{LinksPagesContent.map((site, key) => {
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
																				<PageSorting
																					sortOrder={sortOrder}
																					onSortHandler={SortHandler}
																					key={key}
																					slug={site.slug}
																					user={userData}
																				/>
																			) : null}
																			<div tw="flex items-center space-x-2">
																				<span className="label">{site.label}</span>
																			</div>
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
													userData.permissions &&
													userData.permissions !== undefined &&
													userData.permissions.includes("can_see_images") &&
													userData.permissions.includes("can_see_pages") &&
													userData.permissions.includes("can_see_scripts") &&
													userData.permissions.includes("can_see_stylesheets") &&
													userData.permissions.includes("can_start_scan") &&
													pagesData &&
													pagesData !== undefined &&
													pagesData !== [] &&
													Object.keys(pagesData).length > 0 &&
													pagesData.results ? (
														pagesData.results.map((val, key) => <PageTable key={key} val={val} user={userData} />)
													) : (
														<PageTableSkeleton />
													)}
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</div>
							{userData &&
							userData !== undefined &&
							userData !== [] &&
							Object.keys(userData).length > 0 &&
							userData.permissions &&
							userData.permissions !== undefined &&
							userData.permissions.includes("can_see_images") &&
							userData.permissions.includes("can_see_pages") &&
							userData.permissions.includes("can_see_scripts") &&
							userData.permissions.includes("can_see_stylesheets") &&
							userData.permissions.includes("can_start_scan") ? (
								<MyPagination
									href="/site/[siteId]/pages"
									pathName={pagePath}
									apiEndpoint={scanApiEndpoint}
									page={result.page ? result.page : 0}
									linksPerPage={linksPerPage}
									onItemsPerPageChange={onItemsPerPageChange}
								/>
							) : null}
						</div>

						<div tw="static bottom-0 w-full mx-auto px-12 py-4">
							<SiteFooter />
						</div>
					</main>
				</div>
			</PagesDiv>
		</Layout>
	) : (
		<Loader />
	);
};

Pages.propTypes = {};

export default withResizeDetector(Pages);

export async function getServerSideProps(ctx) {
	return {
		props: {
			result: ctx.query
		}
	};
}

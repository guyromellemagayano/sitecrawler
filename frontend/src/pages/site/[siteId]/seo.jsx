// React
import { Fragment, useState, useEffect } from "react";

// NextJS
import Link from "next/link";
import { useRouter } from "next/router";

// External
import { ChevronRightIcon, HomeIcon, SearchIcon } from "@heroicons/react/solid";
import { NextSeo } from "next-seo";
import { withResizeDetector } from "react-resize-detector";
import PropTypes from "prop-types";
import { styled } from "twin.macro";

// JSON
import SeoLabel from "public/labels/pages/site/seo.json";
import SeoTableContent from "public/data/seo-table.json";

// Hooks
import { useScan, useSite, usePages, useSiteId, useStats } from "src/hooks/useSite";
import usePostMethod from "src/hooks/usePostMethod";
import useUser from "src/hooks/useUser";

// Layout
import Layout from "src/components/Layout";

// Components
import LinkOptions from "src/components/pages/overview/LinkOptions";
import MainSidebar from "src/components/sidebar/MainSidebar";
import MyPagination from "src/components/pagination/Pagination";
import SeoFilter from "src/components/helpers/filters/SeoFilter";
import SeoSorting from "src/components/helpers/sorting/SeoSorting";
import SeoTable from "src/components/tables/SeoTable";
import SeoTableSkeleton from "src/components/skeletons/SeoTableSkeleton";
import Loader from "src/components/layouts/Loader";
import MobileSidebarButton from "src/components/buttons/MobileSidebarButton";
import SiteFooter from "src/components/layouts/Footer";
import UpgradeErrorAlert from "src/components/alerts/UpgradeErrorAlert";

// Helpers
import { removeURLParameter } from "src/helpers/functions";

const SeoDiv = styled.section`
	@media only screen and (max-width: 1600px) {
		.min-width-adjust {
			min-width: 15rem;
		}
	}
`;

const Seo = ({ width, result }) => {
	const [crawlFinished, setCrawlFinished] = useState(false);
	const [disableLocalTime, setDisableLocalTime] = useState(false);
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

	let previousScanResults = [];
	let currentScanResults = [];

	let queryString = "";
	let hasTitleString = "";
	let hasDescriptionString = "";
	let hasH1FirstString = "";
	let hasH2FirstString = "";

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
		pageTitle = siteId.name && siteId.name !== undefined ? SeoLabel[1].label + " - " + siteId.name : SeoLabel[1].label;
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

	const { stats: stats } = useStats({
		querySid: result.siteId,
		scanObjId: scanObjId && scanObjId !== undefined && scanObjId !== 0 && scanObjId
	});

	if (
		user &&
		user !== undefined &&
		user !== [] &&
		Object.keys(user).length > 0 &&
		user.permissions &&
		user.permissions !== undefined &&
		user.permissions.includes("can_see_pages") &&
		user.permissions.includes("can_see_scripts") &&
		user.permissions.includes("can_see_stylesheets") &&
		user.permissions.includes("can_start_scan")
	) {
		scanApiEndpoint =
			result.page !== undefined
				? `/api/site/${result.siteId}/scan/${scanObjId}/page/?per_page=` + linksPerPage + `&page=` + result.page
				: `/api/site/${result.siteId}/scan/${scanObjId}/page/?per_page=` + linksPerPage;

		hasTitleString = Array.isArray(result.has_title) ? result.has_title.join("&has_title=") : result.has_title;

		queryString +=
			result.has_title !== undefined
				? scanApiEndpoint.includes("?")
					? `&has_title=${hasTitleString}`
					: `?has_title=${hasTitleString}`
				: "";

		hasDescriptionString = Array.isArray(result.has_description)
			? result.has_description.join("&has_description=")
			: result.has_description;

		queryString +=
			result.has_description !== undefined
				? scanApiEndpoint.includes("?")
					? `&has_description=${hasDescriptionString}`
					: `?has_description=${hasDescriptionString}`
				: "";

		hasH1FirstString = Array.isArray(result.has_h1_first)
			? result.has_h1_first.join("&has_h1_first=")
			: result.has_h1_first;

		queryString +=
			result.has_h1_first !== undefined
				? scanApiEndpoint.includes("?")
					? `&has_h1_first=${hasH1FirstString}`
					: `?has_h1_first=${hasH1FirstString}`
				: "";

		queryString +=
			result.has_h1_second !== undefined
				? scanApiEndpoint.includes("?")
					? `&has_h1_second=false`
					: `?has_h1_second=false`
				: "";

		hasH2FirstString = Array.isArray(result.has_h2_first)
			? result.has_h2_first.join("&has_h2_first=")
			: result.has_h2_first;

		queryString +=
			result.has_h2_first !== undefined
				? scanApiEndpoint.includes("?")
					? `&has_h2_first=${hasH2FirstString}`
					: `?has_h2_first=${hasH2FirstString}`
				: "";

		queryString +=
			result.has_h2_second !== undefined
				? scanApiEndpoint.includes("?")
					? `&has_h2_second=false`
					: `?has_h2_second=false`
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

	const { pages: pages, mutatePages: mutatePages } = usePages({
		endpoint: scanApiEndpoint,
		querySid: result.siteId,
		scanObjId: scanObjId && scanObjId !== undefined && scanObjId !== 0 && scanObjId
	});

	useEffect(() => {
		if (user && user !== undefined && Object.keys(user).length > 0) {
			if (user.settings && user.settings !== undefined && user.settings !== []) {
				if (user.settings.disableLocalTime) {
					setDisableLocalTime(true);
				} else {
					setDisableLocalTime(false);
				}
			}
		}

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
			stats &&
			stats !== undefined &&
			Object.keys(stats).length > 0
		) {
			setTimeout(() => {
				setPageLoaded(true);
			}, 500);
		}
	}, [user, site, siteId, pages, stats]);

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
		mutatePages;
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
			mutatePages;
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
			siteId !== undefined &&
			Object.keys(siteId).length > 0 &&
			siteId.verified &&
			finished
		)
			setRecrawlable(true);
		else setRecrawlable(false);
	};

	return user && user !== undefined && Object.keys(user).length > 0 && pageLoaded ? (
		<Layout user={user}>
			<NextSeo title={pageTitle} />

			<SeoDiv tw="h-screen flex overflow-hidden bg-white">
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
										{pages && pages !== undefined && pages !== [] && Object.keys(pages).length > 0 ? (
											<dl tw="inline-flex flex-col mb-2 lg:mb-0 lg:ml-5 sm:flex-row sm:flex-wrap">
												<dd tw="flex items-center text-base leading-5 text-gray-500 font-medium sm:mr-6">
													<SearchIcon tw="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
													{pages.count > 1
														? pages.count + " " + SeoLabel[2].label
														: pages.count == 1
														? pages.count + " " + SeoLabel[6].label
														: SeoLabel[3].label}
												</dd>
											</dl>
										) : null}
									</h4>
								</div>
							</div>
						</div>
						<div tw="max-w-full px-4 py-4 sm:px-6 md:px-8">
							{user &&
							user.permissions &&
							Object.keys(user.permissions).length > 0 &&
							user.permissions.includes("can_see_pages") &&
							user.permissions.includes("can_see_scripts") &&
							user.permissions.includes("can_see_stylesheets") ? (
								<SeoFilter
									result={result}
									loadQueryString={loadQueryString}
									setLoadQueryString={setLoadQueryString}
									mutatePages={mutatePages}
									setPagePath={setPagePath}
								/>
							) : null}

							<div tw="pb-4">
								<div tw="flex flex-col">
									<div tw="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
										<div tw="align-middle inline-block min-w-full overflow-hidden rounded-lg border-gray-300">
											<table tw="relative min-w-full">
												<thead>
													<tr>
														{SeoTableContent.map((site, key) => {
															return (
																<Fragment key={key}>
																	<th
																		className="min-width-adjust"
																		tw="px-6 py-3 border-b border-gray-300 bg-white text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
																	>
																		<span tw="flex items-center justify-start">
																			{user &&
																			user.permissions &&
																			Object.keys(user.permissions).length > 0 &&
																			user.permissions.includes("can_see_pages") &&
																			site &&
																			site !== undefined &&
																			site.slug &&
																			site.slug !== undefined ? (
																				<SeoSorting
																					result={result}
																					slug={site.slug}
																					mutatePages={mutatePages}
																					seoTableContent={SeoTableContent}
																					setPagePath={setPagePath}
																				/>
																			) : null}
																			<span className="label" tw="flex items-center">
																				{site.label}
																			</span>
																		</span>
																	</th>
																</Fragment>
															);
														})}
													</tr>
												</thead>
												<tbody tw="relative">
													{user &&
													user.permissions &&
													Object.keys(user.permissions).length > 0 &&
													user.permissions.includes("can_see_pages") &&
													user.permissions.includes("can_see_scripts") &&
													user.permissions.includes("can_see_stylesheets") &&
													pages &&
													pages !== undefined &&
													Object.keys(pages).length > 0 &&
													pages.results &&
													pages.results !== undefined
														? pages.results.map((val, key) => (
																<SeoTable
																	key={key}
																	val={val}
																	user={user}
																	disableLocalTime={disableLocalTime}
																	label={SeoLabel}
																/>
														  ))
														: null}

													{user && user.permissions && Object.keys(user.permissions).length === 0 ? (
														<SeoTableSkeleton />
													) : null}
												</tbody>
											</table>

											{user && user.permissions && Object.keys(user.permissions).length === 0 ? (
												<UpgradeErrorAlert link="/settings/subscription-plans" />
											) : null}
										</div>
									</div>
								</div>
							</div>

							{user &&
							user !== undefined &&
							user !== [] &&
							Object.keys(user).length > 0 &&
							user.permissions &&
							user.permissions !== undefined &&
							user.permissions.includes("can_see_pages") &&
							user.permissions.includes("can_see_scripts") &&
							user.permissions.includes("can_see_stylesheets") &&
							pages &&
							pages !== undefined &&
							pages !== [] &&
							Object.keys(pages).length > 0 ? (
								<MyPagination
									href="/site/[siteId]/seo"
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
			</SeoDiv>
		</Layout>
	) : (
		<Loader />
	);
};

Seo.propTypes = {};

export default withResizeDetector(Seo);

export async function getServerSideProps(ctx) {
	return {
		props: {
			result: ctx.query
		}
	};
}

// React
import { Fragment, useState, useEffect } from "react";

// NextJS
import Link from "next/link";
import Router, { useRouter } from "next/router";

// External
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/solid";
import { DocumentIcon } from "@heroicons/react/outline";
import { NextSeo } from "next-seo";
import { withResizeDetector } from "react-resize-detector";
import PropTypes from "prop-types";
import { styled } from "twin.macro";

// JSON
import LinksPagesContent from "public/data/links-pages.json";
import PagesLabel from "public/labels/pages/site/pages.json";

// Hooks
import { useScan, useSite, usePages, useSiteId } from "src/hooks/useSite";
import usePostMethod from "src/hooks/usePostMethod";
import useUser from "src/hooks/useUser";

// Layout
import Layout from "src/components/Layout";

// Components
import LinkOptions from "src/components/pages/overview/LinkOptions";
import Loader from "src/components/layouts/Loader";
import MainSidebar from "src/components/sidebar/MainSidebar";
import MobileSidebarButton from "src/components/buttons/MobileSidebarButton";
import MyPagination from "src/components/pagination/Pagination";
import PageFilter from "src/components/helpers/filters/PageFilter";
import PageSorting from "src/components/helpers/sorting/PageSorting";
import PageTable from "src/components/tables/PageTable";
import PageTableSkeleton from "src/components/skeletons/PageTableSkeleton";
import ProfileSkeleton from "src/components/skeletons/ProfileSkeleton";
import SiteFooter from "src/components/layouts/Footer";
import UpgradeErrorAlert from "src/components/alerts/UpgradeErrorAlert";

// Helpers
import { removeURLParameter, slugToCamelcase, getSortKeyFromSlug, getSlugFromSortKey } from "src/helpers/functions";

const PagesDiv = styled.section`
	@media only screen and (max-width: 960px) {
		.min-width-adjust {
			min-width: 15rem;
		}
	}
`;

const Pages = ({ width, result }) => {
	const [crawlFinished, setCrawlFinished] = useState(false);
	const [linksPerPage, setLinksPerPage] = useState(20);
	const [loadQueryString, setLoadQueryString] = useState("");
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
	const [userData, setUserData] = useState([]);

	const { asPath } = useRouter();
	const router = useRouter();

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

			Router.push(newPath);
			mutatePages();

			return true;
		}
	};

	useEffect(() => {
		if (removeURLParameter(asPath, "page").includes("?")) setPagePath(`${removeURLParameter(asPath, "page")}&`);
		else setPagePath(`${removeURLParameter(asPath, "page")}?`);

		if (result.search !== undefined) setSearchKey(result.search);

		if (result.per_page !== undefined) setLinksPerPage(result.per_page);
	}, []);

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
											{pagesData && pagesData !== undefined && pagesData !== [] && Object.keys(pagesData).length > 0 ? (
												<dl tw="inline-flex flex-col mb-2 lg:mb-0 lg:ml-5 sm:flex-row sm:flex-wrap">
													<dd tw="flex items-center text-base leading-5 text-gray-500 font-medium sm:mr-6">
														<DocumentIcon tw="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
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
							{user &&
							user.permissions &&
							Object.keys(user.permissions).length > 0 &&
							user.permissions.includes("can_see_pages") ? (
								<PageFilter
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
														{LinksPagesContent.map((site, key) => {
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
																				<PageSorting
																					result={result}
																					slug={site.slug}
																					mutatePages={mutatePages}
																					linksPagesContent={LinksPagesContent}
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
													pages &&
													pages !== undefined &&
													Object.keys(pages).length > 0 &&
													pages.results &&
													pages.results !== undefined
														? pages.results.map((val, key) => <PageTable key={key} val={val} user={user} />)
														: null}

													{user && user.permissions && Object.keys(user.permissions).length === 0 ? (
														<PageTableSkeleton />
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

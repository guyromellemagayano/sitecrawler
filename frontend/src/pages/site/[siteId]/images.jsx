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
import ImagesLabel from "public/labels/pages/site/images.json";
import ImageTableContent from "public/data/image-table.json";

// Hooks
import usePostMethod from "src/hooks/usePostMethod";
import { useScan, useSite, useImages, useSiteId, useStats } from "src/hooks/useSite";
import useUser from "src/hooks/useUser";

// Layout
import Layout from "src/components/Layout";

// Components
const ChevronRightSvg = loadable(() => import("src/components/svg/solid/ChevronRightSvg"));
const HomeSvg = loadable(() => import("src/components/svg/solid/HomeSvg"));
const ImageFilter = loadable(() => import("src/components/site/ImageFilter"));
const LinkOptions = loadable(() => import("src/components/site/LinkOptions"));
const Loader = loadable(() => import("src/components/layout/Loader"));
const ImageSorting = loadable(() => import("src/components/site/ImageSorting"));
const ImageTable = loadable(() => import("src/components/site/ImageTable"));
const ImageSvg = loadable(() => import("src/components/svg/outline/ImageSvg"));
const MainSidebar = loadable(() => import("src/components/sidebar/MainSidebar"));
const MobileSidebarButton = loadable(() => import("src/components/sidebar/MobileSidebarButton"));
const ImageTableSkeleton = loadable(() => import("src/components/skeletons/ImageTableSkeleton"));
const ProfileSkeleton = loadable(() => import("src/components/skeletons/ProfileSkeleton"));
const MyPagination = loadable(() => import("src/components/sites/Pagination"));
const SiteFooter = loadable(() => import("src/components/footer/SiteFooter"));

// Helpers
import { removeURLParameter, slugToCamelcase, getSortKeyFromSlug, getSlugFromSortKey } from "src/helpers/functions";

const ImagesDiv = styled.section`
	@media only screen and (max-width: 1600px) {
		.min-width-adjust {
			min-width: 12rem;
		}
	}
`;

const initialOrder = {
	imageUrl: "default",
	imageSize: "default",
	status: "default",
	httpCode: "default",
	occurrences: "default"
};

const Images = ({ width, result }) => {
	const [allFilter, setAllFilter] = useState(false);
	const [crawlFinished, setCrawlFinished] = useState(false);
	const [imageBrokenSecurityFilter, setImageBrokenSecurityFilter] = useState(false);
	const [imageNotWorkingFilter, setImageNotWorkingFilter] = useState(false);
	const [imagesData, setImagesData] = useState([]);
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
	const [statsData, setStatsData] = useState([]);
	const [userData, setUserData] = useState([]);

	const { asPath } = useRouter();

	const pageTitle =
		siteIdData.name && siteIdData.name !== undefined
			? ImagesLabel[1].label + " - " + siteIdData.name
			: ImagesLabel[1].label;
	const homeLabel = "Home";
	const homePageLink = `/site/${result.siteId}/overview`;
	const reCrawlEndpoint = `/api/site/${result.siteId}/start_scan/`;
	const sitesApiEndpoint = `/api/site/?ordering=name`;

	let images = [];
	let mutateImages = [];
	let scanApiEndpoint = "";
	let queryString = "";
	let statusString = "";

	const { user: user } = useUser({
		redirectIfFound: false,
		redirectTo: "/login",
		refreshInterval: 1000
	});

	const { scan: scan } = useScan({
		querySid: result.siteId,
		refreshInterval: 1000
	});

	const { site: site } = useSite({
		endpoint: sitesApiEndpoint,
		refreshInterval: 1000
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

	const { stats: stats } = useStats({
		querySid: result.siteId,
		scanObjId: scanObjId,
		refreshInterval: 1000
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
				? `/api/site/${result.siteId}/scan/${scanObjId}/image/?per_page=` + linksPerPage + `&page=` + result.page
				: `/api/site/${result.siteId}/scan/${scanObjId}/image/?per_page=` + linksPerPage;

		statusString = Array.isArray(result.status) ? result.status.join("&status=") : result.status;

		queryString +=
			result.status !== undefined
				? scanApiEndpoint.includes("?")
					? `&status=${statusString}`
					: `?status=${statusString}`
				: "";

		const tlsStatusString = Array.isArray(result.tls_status)
			? result.tls_status.join("&tls_status=")
			: result.tls_status;

		queryString +=
			result.tls_status !== undefined
				? scanApiEndpoint.includes("?")
					? `&tls_status=${tlsStatusString}`
					: `?tls_status=${tlsStatusString}`
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

	({ images: images, mutateImages: mutateImages } = useImages({
		endpoint: scanApiEndpoint,
		querySid: result.siteId,
		scanObjId: scanObjId,
		refreshInterval: 1000
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

		if (images && images !== undefined && Object.keys(images).length > 0) {
			setImagesData(images);
		}

		if (stats && stats !== undefined && Object.keys(stats).length > 0) {
			setStatsData(stats);
		}

		if (userData && siteData && siteIdData && imagesData && statsData) {
			setTimeout(() => {
				setPageLoaded(true);
			}, 500);
		}
	}, [user, site, siteId, images, stats]);

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
		mutateImages();
	};

	const SortHandler = (slug, dir) => {
		setSortOrder({ ...initialOrder });

		let newPath = removeURLParameter(asPath, "ordering");

		const sortItem = slugToCamelcase(slug);
		const sortKey = getSortKeyFromSlug(ImageTableContent, slug);

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
		mutateImages();
	};

	const filterChangeHandler = async (e) => {
		const filterType = e.target.value;
		const filterStatus = e.target.checked;

		let newPath = asPath;
		newPath = removeURLParameter(newPath, "page");

		if (filterType == "notWorking" && filterStatus == true) {
			setImageNotWorkingFilter(true);
			setImageBrokenSecurityFilter(false);
			setNoIssueFilter(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "status");
			newPath = removeURLParameter(newPath, "tls_status");

			if (newPath.includes("?")) newPath += `&status=TIMEOUT&status=HTTP_ERROR&status=OTHER_ERROR`;
			else newPath += `?status=TIMEOUT&status=HTTP_ERROR&status=OTHER_ERROR`;
		} else if (filterType == "notWorking" && filterStatus == false) {
			loadQueryString && loadQueryString.delete("status");
			loadQueryString && loadQueryString.delete("page");

			if (newPath.includes("status")) {
				newPath = removeURLParameter(newPath, "status");
			}

			setImageNotWorkingFilter(false);
		}

		if (filterType == "no-issues" && filterStatus == true) {
			setImageNotWorkingFilter(false);
			setImageBrokenSecurityFilter(false);
			setNoIssueFilter(true);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "status");
			newPath = removeURLParameter(newPath, "tls_status");

			if (newPath.includes("?")) newPath += `&status=OK&tls_status=OK`;
			else newPath += `?status=OK&tls_status=OK`;
		} else if (filterType == "no-issues" && filterStatus == false) {
			loadQueryString && loadQueryString.delete("status");
			loadQueryString && loadQueryString.delete("tls_status");
			loadQueryString && loadQueryString.delete("page");

			if (newPath.includes("status") && newPath.includes("tls_status")) {
				newPath = removeURLParameter(newPath, "status");
				newPath = removeURLParameter(newPath, "tls_status");
			}

			setNoIssueFilter(false);
		}

		if (filterType == "brokenSecurity" && filterStatus == true) {
			setImageNotWorkingFilter(false);
			setImageBrokenSecurityFilter(true);
			setNoIssueFilter(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "status");
			newPath = removeURLParameter(newPath, "tls_status");

			if (newPath.includes("?")) newPath += `&tls_status=ERROR&tls_status=NONE`;
			else newPath += `?tls_status=ERROR&tls_status=NONE`;
		} else if (filterType == "brokenSecurity" && filterStatus == false) {
			loadQueryString && loadQueryString.delete("tls_status");
			loadQueryString && loadQueryString.delete("page");

			if (newPath.includes("tls_status")) {
				newPath = removeURLParameter(newPath, "tls_status");
			}

			setImageBrokenSecurityFilter(false);
		}

		if (filterType == "all" && filterStatus == true) {
			setImageNotWorkingFilter(false);
			setImageBrokenSecurityFilter(false);
			setNoIssueFilter(false);
			setAllFilter(true);

			newPath = removeURLParameter(newPath, "status");
			newPath = removeURLParameter(newPath, "tls_status");

			// if (!newPath.includes("search") && !newPath.includes("status"))
			//   newPath = newPath.replace("?", "");
		}

		if (newPath.includes("?")) setPagePath(`${newPath}&`);
		else setPagePath(`${newPath}?`);

		Router.push(newPath);
		mutateImages();

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
			mutateImages();

			return true;
		}
	};

	useEffect(() => {
		if (removeURLParameter(asPath, "page").includes("?")) setPagePath(`${removeURLParameter(asPath, "page")}&`);
		else setPagePath(`${removeURLParameter(asPath, "page")}?`);

		if (result.search !== undefined) setSearchKey(result.search);

		if (result.ordering !== undefined) {
			const slug = getSlugFromSortKey(ImageTableContent, result.ordering.replace("-", ""));
			const orderItem = slugToCamelcase(slug);

			if (result.ordering.includes("-")) setSortOrder((prevState) => ({ ...prevState, [orderItem]: "desc" }));
			else setSortOrder((prevState) => ({ ...prevState, [orderItem]: "asc" }));
		}

		if (result.per_page !== undefined) setLinksPerPage(result.per_page);

		setLoadQueryString(new URLSearchParams(window.location.search));

		let loadQueryStringValue = new URLSearchParams(window.location.search);

		if (
			loadQueryStringValue.getAll("status").includes("TIMEOUT") &&
			loadQueryStringValue.getAll("status").includes("HTTP_ERROR") &&
			loadQueryStringValue.getAll("status").includes("OTHER_ERROR")
		) {
			setImageNotWorkingFilter(true);
			setImageBrokenSecurityFilter(false);
			setAllFilter(false);
			setNoIssueFilter(false);
		}

		if (loadQueryStringValue.get("status") === "OK" && loadQueryStringValue.get("tls_status") === "OK") {
			setImageNotWorkingFilter(false);
			setImageBrokenSecurityFilter(false);
			setAllFilter(false);
			setNoIssueFilter(true);
		}

		if (
			loadQueryStringValue.getAll("tls_status").includes("ERROR") &&
			loadQueryStringValue.getAll("tls_status").includes("NONE")
		) {
			setImageNotWorkingFilter(false);
			setImageBrokenSecurityFilter(true);
			setAllFilter(false);
			setNoIssueFilter(false);
		}

		if (!loadQueryStringValue.has("status") && !loadQueryStringValue.has("tls_status")) {
			setImageNotWorkingFilter(false);
			setImageBrokenSecurityFilter(false);
			setAllFilter(true);
			setNoIssueFilter(false);
		}
	}, []);

	useEffect(() => {
		if (
			result.status !== undefined &&
			result.tls_status == undefined &&
			result.status.includes("HTTP_ERROR") &&
			result.status.includes("OTHER_ERROR") &&
			result.status.includes("TIMEOUT")
		) {
			setImageNotWorkingFilter(true);
			setImageBrokenSecurityFilter(false);
			setNoIssueFilter(false);
			setAllFilter(false);
		}

		if (
			result.status == undefined &&
			result.tls_status !== undefined &&
			result.tls_status.includes("ERROR") &&
			result.tls_status.includes("NONE")
		) {
			setImageNotWorkingFilter(false);
			setImageBrokenSecurityFilter(true);
			setNoIssueFilter(false);
			setAllFilter(false);
		}

		if (
			result.status !== undefined &&
			result.tls_status !== undefined &&
			result.status.includes("OK") &&
			result.tls_status.includes("OK")
		) {
			setImageNotWorkingFilter(false);
			setImageBrokenSecurityFilter(false);
			setNoIssueFilter(true);
			setAllFilter(false);
		}

		if (loadQueryString && loadQueryString !== undefined && loadQueryString.toString().length === 0) {
			if (result.status == undefined && result.tls_status == undefined) {
				setImageNotWorkingFilter(false);
				setNoIssueFilter(false);
				setImageBrokenSecurityFilter(false);
				setAllFilter(true);
			}
		}
	}, [filterChangeHandler, loadQueryString]);

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

			<ImagesDiv tw="h-screen flex overflow-hidden bg-white">
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
											<dl tw="inline-flex flex-col mb-2 lg:mb-0 lg:ml-5 sm:flex-row sm:flex-wrap">
												<dd tw="flex items-center text-base leading-5 text-gray-500 font-medium sm:mr-6">
													<ImageSvg className={tw`flex-shrink-0 mr-2 h-5 w-5 text-gray-400`} />
													{statsData.num_images > 0
														? statsData.num_images + " " + ImagesLabel[2].label
														: ImagesLabel[2].label}
												</dd>
											</dl>
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
								<ImageFilter
									user={userData}
									onFilterChange={filterChangeHandler}
									allFilter={allFilter}
									noIssueFilter={noIssueFilter}
									imageNotWorkingFilter={imageNotWorkingFilter}
									imageBrokenSecurityFilter={imageBrokenSecurityFilter}
								/>
							) : null}

							<div tw="pb-4">
								<div tw="flex flex-col">
									<div tw="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
										<div tw="align-middle inline-block min-w-full overflow-hidden rounded-lg border-gray-300">
											<table tw="min-w-full">
												<thead>
													<tr>
														{ImageTableContent.map((site, key) => {
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
																				<ImageSorting
																					sortOrder={sortOrder}
																					onSortHandler={SortHandler}
																					key={key}
																					slug={site.slug}
																					user={userData}
																				/>
																			) : null}
																			<span className="label" tw="flex items-center">
																				{site.label}
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
													userData.permissions &&
													userData.permissions !== undefined &&
													userData.permissions.includes("can_see_images") &&
													userData.permissions.includes("can_see_pages") &&
													userData.permissions.includes("can_see_scripts") &&
													userData.permissions.includes("can_see_stylesheets") &&
													userData.permissions.includes("can_start_scan") &&
													imagesData &&
													imagesData !== undefined &&
													imagesData !== [] &&
													Object.keys(imagesData).length > 0 &&
													imagesData.results ? (
														imagesData.results.map((val, key) => <ImageTable key={key} val={val} user={userData} />)
													) : (
														<ImageTableSkeleton />
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
							userData.permissions.includes("can_start_scan") &&
							pagesData &&
							pagesData !== undefined &&
							pagesData !== [] &&
							Object.keys(pagesData).length > 0 ? (
								<MyPagination
									href="/site/[siteId]/images/"
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
			</ImagesDiv>
		</Layout>
	) : (
		<Loader />
	);
};

Images.propTypes = {};

export default withResizeDetector(Images);

export async function getServerSideProps(ctx) {
	return {
		props: {
			result: ctx.query
		}
	};
}

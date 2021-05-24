// React
import { useState, useEffect } from "react";

// NextJS
import { useRouter } from "next/router";

// External
import "twin.macro";
import { NextSeo } from "next-seo";
import { withResizeDetector } from "react-resize-detector";
import loadable from "@loadable/component";
import PropTypes from "prop-types";

// JSON
import DashboardLabel from "public/labels/pages/dashboard.json";
import DataTableHeadsContent from "public/data/data-table-heads.json";

// Hooks
import { useSite } from "src/hooks/useSite";
import useUser from "src/hooks/useUser";

// Layout
import Layout from "src/components/Layout";

// Components
import AddSite from "src/components/pages/dashboard/AddSite";
import DataTable from "src/components/tables/DataTable";
import MainSidebar from "src/components/sidebar/MainSidebar";
import MyPagination from "src/components/pagination/Pagination";
import SiteSorting from "src/components/helpers/sorting/SiteSorting";

// Loadable
const Loader = loadable(() => import("src/components/layouts/Loader"));
const MobileSidebarButton = loadable(() => import("src/components/buttons/MobileSidebarButton"));
const SiteFooter = loadable(() => import("src/components/layouts/Footer"));

// Helpers
import { getSlugFromSortKey, getSortKeyFromSlug, removeURLParameter, slugToCamelcase } from "src/helpers/functions";

const initialOrder = {
	siteName: "asc",
	crawlStatus: "default",
	lastCrawled: "default",
	totalIssues: "default"
};

const Dashboard = ({ width, result }) => {
	const [disableLocalTime, setDisableLocalTime] = useState(false);
	const [linksPerPage, setLinksPerPage] = useState(20);
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
	const [pageLoaded, setPageLoaded] = useState(false);
	const [pagePath, setPagePath] = useState(null);
	const [searchKey, setSearchKey] = useState(null);
	const [siteData, setSiteData] = useState([]);
	const [sortOrder, setSortOrder] = useState(initialOrder);
	const [userData, setUserData] = useState([]);

	const pageTitle = DashboardLabel[0].label;

	const { asPath } = useRouter();
	const router = useRouter();

	const { user: user } = useUser({
		redirectIfFound: false,
		redirectTo: "/login"
	});

	let scanApiEndpoint =
		result.page !== undefined
			? "/api/site/?per_page=" + linksPerPage + `&ordering=name` + `&page=` + result.page
			: "/api/site/?per_page=" + linksPerPage + `&ordering=name`;
	let queryString = "";

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

	scanApiEndpoint += queryString;

	const { site: site, mutateSite: mutateSite } = useSite({
		endpoint: scanApiEndpoint
	});

	useEffect(() => {
		if (user && user !== undefined && Object.keys(user).length > 0) {
			setUserData(user);
		}

		if (site && site !== undefined && Object.keys(site).length > 0) {
			setSiteData(site);
		}
	}, [user, site]);

	useEffect(() => {
		if (
			userData &&
			userData !== undefined &&
			userData !== [] &&
			Object.keys(userData).length > 0 &&
			siteData &&
			siteData !== undefined &&
			siteData !== [] &&
			Object.keys(siteData).length > 0
		) {
			if (userData.settings !== []) {
				if (userData.settings.disableLocalTime) {
					setDisableLocalTime(true);
				} else {
					setDisableLocalTime(false);
				}
			}

			setTimeout(() => {
				setPageLoaded(true);
			}, 500);
		}
	}, [userData, siteData]);

	const onSearchEventHandler = async (e) => {
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

		mutateSite();

		setTimeout(() => {
			router.push(newPath);
		}, 500);
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

			mutateSite();
			router.push(newPath);

			return true;
		}
	};

	const SortHandler = (slug, dir) => {
		setSortOrder({ ...initialOrder });

		let newPath = removeURLParameter(asPath, "ordering");

		const sortItem = slugToCamelcase(slug);
		const sortKey = getSortKeyFromSlug(DataTableHeadsContent, slug);

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

		if (newPath.includes("?")) setPagePath(`${removeURLParameter(newPath, "page")}&`);
		else setPagePath(`${removeURLParameter(newPath, "page")}?`);

		mutateSite();

		setTimeout(() => {
			router.push(newPath);
		}, 500);
	};

	useEffect(() => {
		if (removeURLParameter(asPath, "page").includes("?")) setPagePath(`${removeURLParameter(asPath, "page")}&`);
		else setPagePath(`${removeURLParameter(asPath, "page")}?`);

		if (result.search !== undefined) setSearchKey(result.search);

		if (result.ordering !== undefined) {
			const slug = getSlugFromSortKey(DataTableHeadsContent, result.ordering.replace("-", ""));
			const orderItem = slugToCamelcase(slug);

			if (result.ordering.includes("-")) setSortOrder((prevState) => ({ ...prevState, [orderItem]: "desc" }));
			else setSortOrder((prevState) => ({ ...prevState, [orderItem]: "asc" }));
		}

		if (result.per_page !== undefined) setLinksPerPage(result.per_page);
	}, []);

	return pageLoaded ? (
		<Layout user={userData}>
			<NextSeo title={pageTitle} />

			<section tw="h-screen flex overflow-hidden bg-white">
				<MainSidebar
					width={width}
					user={userData}
					openMobileSidebar={openMobileSidebar}
					setOpenMobileSidebar={setOpenMobileSidebar}
				/>

				<div tw="flex flex-col w-0 flex-1 overflow-hidden">
					<div tw="relative flex-shrink-0 flex  bg-white border-b border-gray-200 lg:mb-4">
						<MobileSidebarButton openMobileSidebar={openMobileSidebar} setOpenMobileSidebar={setOpenMobileSidebar} />
						<AddSite user={userData} site={siteData} searchKey={searchKey} onSearchEvent={onSearchEventHandler} />
					</div>

					{userData && Object.keys(userData).length > 0 && siteData && Object.keys(siteData).length > 0 ? (
						siteData.count > 0 ? (
							<main tw="flex-1 relative overflow-y-auto focus:outline-none" tabIndex="0">
								<div tw="max-w-full mx-12">
									<div tw="py-4">
										<div tw="flex flex-col">
											<div tw="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
												<div tw="align-middle inline-block min-w-full overflow-hidden border-gray-300">
													<table tw="relative min-w-full">
														<thead>
															<tr>
																{DataTableHeadsContent.map((site, key) => {
																	return (
																		<th
																			key={key}
																			tw="sm:w-48 lg:w-auto px-6 py-3 border-b border-gray-300 bg-white text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
																		>
																			<span tw="flex items-center justify-start">
																				{site &&
																				site !== undefined &&
																				Object.keys(site).length > 0 &&
																				site.slug !== undefined ? (
																					<SiteSorting
																						sortOrder={sortOrder}
																						onSortHandler={SortHandler}
																						key={key}
																						slug={site.slug}
																					/>
																				) : null}
																				<span tw="flex items-center">{site.label}</span>
																			</span>
																		</th>
																	);
																})}
															</tr>
														</thead>
														{userData &&
															userData !== undefined &&
															userData !== [] &&
															siteData.results &&
															siteData.results.map((val, key) => {
																return (
																	<DataTable
																		key={key}
																		site={val}
																		user={userData}
																		disableLocalTime={disableLocalTime}
																		mutateSite={mutateSite}
																		router={router}
																	/>
																);
															})}
													</table>
												</div>
											</div>
										</div>
									</div>

									<MyPagination
										pathName={pagePath}
										apiEndpoint={scanApiEndpoint}
										page={result.page ? result.page : 0}
										linksPerPage={linksPerPage}
										onItemsPerPageChange={onItemsPerPageChange}
									/>
								</div>
							</main>
						) : null
					) : null}

					<div tw="static bottom-0 w-full mx-auto px-12 py-4">
						<SiteFooter />
					</div>
				</div>
			</section>
		</Layout>
	) : (
		<Loader />
	);
};

Dashboard.propTypes = {};

export default withResizeDetector(Dashboard);

export async function getServerSideProps(ctx) {
	return {
		props: {
			result: ctx.query
		}
	};
}

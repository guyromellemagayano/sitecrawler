// React
import { useState, useEffect } from "react";

// NextJS
import Router, { useRouter } from "next/router";

// External
import { NextSeo } from "next-seo";
import loadable from "@loadable/component";
import LogRocket from "logrocket";
import PropTypes from "prop-types";
import setupLogRocketReact from "logrocket-react";
import tw from "twin.macro";
import useSWR from "swr";

// JSON
import DataTableHeadsContent from "public/data/data-table-heads.json";

// Hooks
import useFetcher from "src/hooks/useFetcher";
import useUser from "src/hooks/useUser";

// Layout
import Layout from "src/components/Layout";

// Components
const AddSite = loadable(() => import("src/components/sites/AddSite"));
const DataTable = loadable(() => import("src/components/sites/DataTable"));
const MainSidebar = loadable(() => import("src/components/sidebar/MainSidebar"));
const MobileSidebar = loadable(() => import("src/components/sidebar/MobileSidebar"));
const MobileSidebarButton = loadable(() => import("src/components/sidebar/MobileSidebarButton"));
const MyPagination = loadable(() => import("src/components/sites/Pagination"));
const SiteFooter = loadable(() => import("src/components/footer/SiteFooter"));
const SiteSorting = loadable(() => import("src/components/sites/SiteSorting"));

// Helpers
import { getSlugFromSortKey, getSortKeyFromSlug, removeURLParameter, slugToCamelcase } from "src/helpers/functions";

if (typeof window !== "undefined") {
	LogRocket.init("epic-design-labs/link-app");
	setupLogRocketReact(LogRocket);
}

const initialOrder = {
	siteName: "asc",
	lastCrawled: "default",
	totalIssues: "default",
};

const Dashboard = ({ userInfo, tokenKey }, props) => {
	const [linksPerPage, setLinksPerPage] = useState(20);
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
	const [pagePath, setPagePath] = useState(null);
	const [searchKey, setSearchKey] = useState(null);
	const [sortOrder, setSortOrder] = useState(initialOrder);

	const pageTitle = "Dashboard";

	const { asPath } = useRouter();
	const { user: user } = useUser({
		token: tokenKey,
		userInfo: userInfo,
	});

	let sitesApiEndpoint =
		props.page !== undefined
			? "/api/site/?per_page=" + linksPerPage + `&ordering=name` + `&page=` + props.page
			: "/api/site/?per_page=" + linksPerPage + `&ordering=name`;
	let queryString = "";

	queryString +=
		props.search !== undefined
			? sitesApiEndpoint.includes("?")
				? `&search=${props.search}`
				: `?search=${props.search}`
			: "";

	queryString +=
		props.ordering !== undefined
			? sitesApiEndpoint.includes("?")
				? `&ordering=${props.ordering}`
				: `?ordering=${props.ordering}`
			: "";

	sitesApiEndpoint += queryString;

	const { data: site, mutate: updateSites, error: siteError } = useSWR(sitesApiEndpoint, useFetcher);

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

		Router.push(newPath);
		updateSites();
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
			updateSites();

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

		// console.log('[pagePath]', newPath)
		if (newPath.includes("?")) setPagePath(`${removeURLParameter(newPath, "page")}&`);
		else setPagePath(`${removeURLParameter(newPath, "page")}?`);

		Router.push(newPath);
		updateSites();
	};

	useEffect(() => {
		if (removeURLParameter(asPath, "page").includes("?")) setPagePath(`${removeURLParameter(asPath, "page")}&`);
		else setPagePath(`${removeURLParameter(asPath, "page")}?`);

		if (props.search !== undefined) setSearchKey(props.search);

		if (props.ordering !== undefined) {
			const slug = getSlugFromSortKey(DataTableHeadsContent, props.ordering.replace("-", ""));
			const orderItem = slugToCamelcase(slug);

			if (props.ordering.includes("-")) setSortOrder((prevState) => ({ ...prevState, [orderItem]: "desc" }));
			else setSortOrder((prevState) => ({ ...prevState, [orderItem]: "asc" }));
		}

		if (props.per_page !== undefined) setLinksPerPage(props.per_page);
	}, []);

	useEffect(() => {
		if (userInfo && userInfo !== undefined && Object.keys(userInfo).length > 0) {
			LogRocket.identify("epic-design-labs/link-app", {
				name: userInfo.first_name + " " + userInfo.last_name,
				email: userInfo.email,
			});
		}
	}, [userInfo]);

	return (
		<Layout>
			<NextSeo title={pageTitle} />

			<section tw="h-screen flex overflow-hidden bg-white">
				{/* FIXME: fix mobile sidebar */}
				{/* <MobileSidebar show={openMobileSidebar} setShow={setOpenMobileSidebar} /> */}
				<MainSidebar user={userInfo} />

				<div tw="flex flex-col w-0 flex-1 overflow-hidden">
					<div tw="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 lg:mb-4">
						<MobileSidebarButton openMobileSidebar={openMobileSidebar} setOpenMobileSidebar={setOpenMobileSidebar} />
						<AddSite user={userInfo} site={site} searchKey={searchKey} onSearchEvent={onSearchEventHandler} />
					</div>

					<main tw="flex-1 relative overflow-y-auto focus:outline-none" tabIndex="-1">
						<div tw="max-w-full mx-12">
							{site && site !== undefined && site.count > 0 && (
								<>
									<div tw="py-4">
										<div tw="flex flex-col">
											<div tw="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
												<div tw="align-middle inline-block min-w-full overflow-hidden border-gray-300">
													<table tw="min-w-full">
														<thead>
															<tr>
																{DataTableHeadsContent.map((site, key) => {
																	return (
																		<th
																			key={key}
																			tw="sm:w-48 lg:w-auto px-6 py-3 border-b border-gray-300 bg-white text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
																		>
																			<div tw="flex items-center justify-start">
																				{site.slug != undefined ? (
																					<SiteSorting
																						sortOrder={sortOrder}
																						onSortHandler={SortHandler}
																						key={key}
																						slug={site.slug}
																					/>
																				) : null}
																				<span tw="flex items-center">{site.label}</span>
																			</div>
																		</th>
																	);
																})}
															</tr>
														</thead>
														<tbody tw="bg-white">
															{site.results && site.results !== undefined
																? site.results.map((val, key) => <DataTable key={key} site={val} userInfo={userInfo} />)
																: null}
														</tbody>
													</table>
												</div>
											</div>
										</div>
									</div>

									<MyPagination
										pathName={pagePath}
										apiEndpoint={sitesApiEndpoint}
										page={props.page ? props.page : 0}
										linksPerPage={linksPerPage}
										onItemsPerPageChange={onItemsPerPageChange}
									/>
								</>
							)}
						</div>
						<div tw="static bottom-0 w-full mx-auto px-12 py-4">
							<SiteFooter />
						</div>
					</main>
				</div>
			</section>
		</Layout>
	);
};

Dashboard.getInitialProps = ({ query }) => {
	return {
		page: query.page,
		search: query.search,
		per_page: query.per_page,
		ordering: query.ordering,
	};
};

Dashboard.propTypes = {};

export default Dashboard;

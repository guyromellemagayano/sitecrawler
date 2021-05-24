// React
import { useState, useEffect } from "react";

// NextJS
import { useRouter } from "next/router";

// External
import { styled } from "twin.macro";
import { NextSeo } from "next-seo";
import { withResizeDetector } from "react-resize-detector";
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
import Loader from "src/components/layouts/Loader";
import MobileSidebarButton from "src/components/buttons/MobileSidebarButton";
import SiteFooter from "src/components/layouts/Footer";

// Helpers
import { removeURLParameter } from "src/helpers/functions";

const DashboardDiv = styled.section`
	@media only screen and (max-width: 1600px) {
		.min-width-adjust {
			min-width: 15rem;
		}
	}
`;

const Dashboard = ({ width, result }) => {
	const [disableLocalTime, setDisableLocalTime] = useState(false);
	const [linksPerPage, setLinksPerPage] = useState(20);
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
	const [pageLoaded, setPageLoaded] = useState(false);
	const [pagePath, setPagePath] = useState("");
	const [searchKey, setSearchKey] = useState("");

	const pageTitle = DashboardLabel[0].label;

	const { asPath } = useRouter();
	const router = useRouter();

	let scanApiEndpoint = "";
	let queryString = "";

	const { user: user } = useUser({
		redirectIfFound: false,
		redirectTo: "/login"
	});

	scanApiEndpoint =
		result.page !== undefined
			? "/api/site/?per_page=" + linksPerPage + `&ordering=name` + `&page=` + result.page
			: "/api/site/?per_page=" + linksPerPage + `&ordering=name`;

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
		if (
			user &&
			user !== undefined &&
			Object.keys(user).length > 0 &&
			site &&
			site !== undefined &&
			Object.keys(site).length > 0
		) {
			if (user.settings !== []) {
				if (user.settings.disableLocalTime) {
					setDisableLocalTime(true);
				} else {
					setDisableLocalTime(false);
				}
			}

			setTimeout(() => {
				setPageLoaded(true);
			}, 500);
		}
	}, [user, site]);

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
		mutateSite;
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
			mutateSite;
		}
	};

	useEffect(() => {
		if (removeURLParameter(asPath, "page").includes("?")) setPagePath(`${removeURLParameter(asPath, "page")}&`);
		else setPagePath(`${removeURLParameter(asPath, "page")}?`);

		if (result.search !== undefined) setSearchKey(result.search);

		if (result.per_page !== undefined) setLinksPerPage(result.per_page);
	}, []);

	return user && user !== undefined && Object.keys(user).length > 0 && pageLoaded ? (
		<Layout user={user}>
			<NextSeo title={pageTitle} />

			<DashboardDiv tw="h-screen flex overflow-hidden bg-white">
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

						<AddSite
							user={user}
							site={site && Object.keys(site).length > 0 && site}
							searchKey={searchKey}
							onSearchEvent={handleSearch}
						/>
					</div>

					{user && user !== undefined && Object.keys(user).length > 0 && site && Object.keys(site).length > 0 ? (
						site.count > 0 ? (
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
																			className="min-width-adjust"
																			tw="px-6 py-3 border-b border-gray-300 bg-white text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
																		>
																			<span tw="flex items-center justify-start">
																				{site &&
																				site !== undefined &&
																				Object.keys(site).length > 0 &&
																				site.slug &&
																				site.slug !== undefined ? (
																					<SiteSorting
																						result={result}
																						slug={site.slug}
																						mutateSite={mutateSite}
																						dataTableHeadsContent={DataTableHeadsContent}
																						setPagePath={setPagePath}
																					/>
																				) : null}
																				<span tw="flex items-center">{site.label}</span>
																			</span>
																		</th>
																	);
																})}
															</tr>
														</thead>
														{user &&
															user !== undefined &&
															site &&
															Object.keys(site).length > 0 &&
															site.results &&
															site.results.map((val, key) => {
																return (
																	<DataTable
																		key={key}
																		site={val}
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
			</DashboardDiv>
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

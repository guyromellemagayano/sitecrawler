// React
import * as React from "react";

// NextJS
import { useRouter } from "next/router";

// External
import { NextSeo } from "next-seo";
import { styled } from "twin.macro";
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
import MainSidebar from "src/components/sidebar/MainSidebar";
import MobileSidebarButton from "src/components/buttons/MobileSidebarButton";
import SiteFooter from "src/components/layouts/Footer";

// Loadable
const AddSite = loadable(() => import("src/components/pages/dashboard/AddSite"));
const DataTable = loadable(() => import("src/components/tables/DataTable"));
const Loader = loadable(() => import("src/components/layouts/Loader"));
const MyPagination = loadable(() => import("src/components/pagination/Pagination"));
const SiteSorting = loadable(() => import("src/components/helpers/sorting/SiteSorting"));

// Helpers
import { removeURLParameter } from "src/helpers/functions";

const SitesSection = styled.section`
	@media only screen and (max-width: 1600px) {
		.min-width-adjust {
			min-width: 15rem;
		}
	}
`;

const Sites = ({ width, result }) => {
	const [componentReady, setComponentReady] = React.useState(false);
	const [disableLocalTime, setDisableLocalTime] = React.useState(false);
	const [linksPerPage, setLinksPerPage] = React.useState(20);
	const [openMobileSidebar, setOpenMobileSidebar] = React.useState(false);
	const [pagePath, setPagePath] = React.useState("");
	const [searchKey, setSearchKey] = React.useState("");

	const pageTitle = DashboardLabel[0].label;

	const { asPath } = useRouter();
	const router = useRouter();

	const { user } = useUser({
		redirectIfFound: false,
		redirectTo: "/login"
	});

	React.useEffect(() => {
		user?.settings?.disableLocalTime ? setDisableLocalTime(true) : setDisableLocalTime(false) ?? null;
	}, [user]);

	let scanApiEndpoint = "";
	let queryString = "";

	scanApiEndpoint = `/api/site/?per_page=` + linksPerPage + `&ordering=name`;

	queryString +=
		result.page !== undefined ? (scanApiEndpoint.includes("?") ? `&page=${result.page}` : `?page=${result.page}`) : "";

	queryString += result.search
		? scanApiEndpoint.includes("?")
			? `&search=${result.search}`
			: `?search=${result.search}`
		: "";

	queryString += result.ordering
		? scanApiEndpoint.includes("?")
			? `&ordering=${result.ordering}`
			: `?ordering=${result.ordering}`
		: "";

	scanApiEndpoint += queryString;

	// console.log(scanApiEndpoint, result);

	const { site, mutateSite } = useSite({
		endpoint: scanApiEndpoint
	});

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

	React.useEffect(() => {
		if (removeURLParameter(asPath, "page").includes("?")) setPagePath(`${removeURLParameter(asPath, "page")}&`);
		else setPagePath(`${removeURLParameter(asPath, "page")}?`);

		if (result.search !== undefined) setSearchKey(result.search);

		if (result.per_page !== undefined) setLinksPerPage(result.per_page);

		setComponentReady(false);

		setTimeout(() => {
			setComponentReady(true);
		}, 500);
	}, []);

	return user ? (
		<Layout user={user}>
			<NextSeo title={pageTitle} />

			<SitesSection tw="h-screen flex overflow-hidden bg-white">
				<MainSidebar
					width={width}
					user={user}
					openMobileSidebar={openMobileSidebar}
					setOpenMobileSidebar={setOpenMobileSidebar}
				/>

				{componentReady ? (
					<div tw="flex flex-col w-0 flex-1 overflow-hidden">
						<div tw="relative flex-shrink-0 flex bg-white">
							<div tw="border-b flex-shrink-0 flex">
								<MobileSidebarButton
									openMobileSidebar={openMobileSidebar}
									setOpenMobileSidebar={setOpenMobileSidebar}
								/>
							</div>

							<AddSite user={user} site={site ? site : null} searchKey={searchKey} onSearchEvent={handleSearch} />
						</div>

						<main tw="flex-1 relative overflow-y-auto focus:outline-none" tabIndex="0">
							<div tw="max-w-full px-4 py-4 sm:px-6 md:px-8">
								<div className="pb-4">
									<div tw="flex flex-col">
										<div tw="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
											<div tw="relative min-w-full rounded-lg border-gray-300">
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
																			<SiteSorting
																				result={result}
																				slug={site.slug}
																				mutateSite={mutateSite}
																				dataTableHeadsContent={DataTableHeadsContent}
																				setPagePath={setPagePath}
																			/>
																			<span tw="flex items-center">{site.label}</span>
																		</span>
																	</th>
																);
															})}
														</tr>
													</thead>
													{site?.results.map((val, key) => (
														<DataTable
															key={key}
															site={val}
															disableLocalTime={disableLocalTime}
															mutateSite={mutateSite}
															router={router}
														/>
													)) ?? null}
												</table>
											</div>
										</div>
									</div>
								</div>

								<MyPagination
									href="/sites/"
									pathName={pagePath}
									apiEndpoint={scanApiEndpoint}
									page={result.page ? result.page : 0}
									linksPerPage={linksPerPage}
									onItemsPerPageChange={onItemsPerPageChange}
								/>

								<div tw="static bottom-0 w-full mx-auto p-4">
									<SiteFooter />
								</div>
							</div>
						</main>
					</div>
				) : (
					<div tw="mx-auto">
						<Loader />
					</div>
				)}
			</SitesSection>
		</Layout>
	) : (
		<Loader />
	);
};

Sites.propTypes = {};

export default withResizeDetector(Sites);

export async function getServerSideProps(ctx) {
	return {
		props: {
			result: ctx.query
		}
	};
}

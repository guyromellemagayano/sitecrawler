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
import SitesLabel from "public/labels/pages/sites.json";
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
const AddSite = loadable(() => import("src/components/pages/sites/AddSite"));
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

const SitesNotFoundSection = styled.section``;

const Sites = ({ width, result }) => {
	const [componentReady, setComponentReady] = React.useState(false);
	const [disableLocalTime, setDisableLocalTime] = React.useState(false);
	const [linksPerPage, setLinksPerPage] = React.useState(20);
	const [openMobileSidebar, setOpenMobileSidebar] = React.useState(false);
	const [pagePath, setPagePath] = React.useState("");
	const [searchKey, setSearchKey] = React.useState("");

	const pageTitle = SitesLabel[0].label;

	const { asPath } = useRouter();
	const router = useRouter();

	const { user } = useUser({
		redirectIfFound: false,
		redirectTo: "/login"
	});

	React.useEffect(() => {
		user?.settings.disableLocalTime ? setDisableLocalTime(true) : setDisableLocalTime(false) ?? null;
	}, [user]);

	let scanApiEndpoint = "";
	let queryString = "";

	scanApiEndpoint = `/api/site/?per_page=` + linksPerPage + `&ordering=name&format=json`;

	queryString +=
		result?.page !== undefined
			? scanApiEndpoint.includes("?")
				? `&page=${result?.page}`
				: `?page=${result?.page}`
			: "";

	queryString += result?.search
		? scanApiEndpoint.includes("?")
			? `&search=${result?.search}`
			: `?search=${result?.search}`
		: "";

	queryString += result?.ordering
		? scanApiEndpoint.includes("?")
			? `&ordering=${result?.ordering}`
			: `?ordering=${result?.ordering}`
		: "";

	scanApiEndpoint += queryString;

	const { site, mutateSite } = useSite({
		endpoint: scanApiEndpoint,
		refreshInterval: 7500
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
		setTimeout(() => {
			setComponentReady(true);
		}, 500);

		return setComponentReady(false);
	}, []);

	React.useEffect(() => {
		removeURLParameter(asPath, "page").includes("?")
			? setPagePath(`${removeURLParameter(asPath, "page")}&`)
			: setPagePath(`${removeURLParameter(asPath, "page")}?`);

		result?.search ? setSearchKey(result?.search) : null;
		result?.per_page ? setLinksPerPage(result?.per_page) : null;
	}, [result, asPath]);

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
												{site?.count > 0 && (
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
																siteId={val.id}
																siteName={val.name}
																siteUrl={val.url}
																siteVerified={val.verified}
																siteVerificationId={val.verification_id}
																disableLocalTime={disableLocalTime}
																mutateSite={mutateSite}
															/>
														))}
													</table>
												)}

												{site?.count == 0 && result?.search == undefined && result?.ordering == undefined && (
													<SitesNotFoundSection tw="flex flex-col justify-center h-80">
														<div tw="px-4 py-5 sm:p-6 flex items-center justify-center">
															<h3 tw="text-lg leading-6 font-medium text-gray-500">{SitesLabel[1].label}</h3>
														</div>
													</SitesNotFoundSection>
												)}
											</div>
										</div>
									</div>
								</div>

								<MyPagination
									href="/sites/"
									pathName={pagePath}
									apiEndpoint={scanApiEndpoint}
									page={result?.page ? result?.page : 0}
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
	await new Promise((resolve) => {
		setTimeout(resolve, 500);
	});

	return {
		props: {
			result: ctx.query
		}
	};
}

// React
import * as React from "react";

// NextJS
import { useRouter } from "next/router";

// External
import tw from "twin.macro";
import { ExternalLinkIcon } from "@heroicons/react/solid";
import { NextSeo } from "next-seo";
import { Scrollbars } from "react-custom-scrollbars-2";
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

const Sites = ({ width, result }) => {
	const [componentReady, setComponentReady] = React.useState(false);
	const [disableLocalTime, setDisableLocalTime] = React.useState(false);
	const [linksPerPage, setLinksPerPage] = React.useState(20);
	const [openMobileSidebar, setOpenMobileSidebar] = React.useState(false);
	const [pagePath, setPagePath] = React.useState("");
	const [searchKey, setSearchKey] = React.useState("");

	const pageTitle = SitesLabel[0].label;
	const siteRefreshInterval = 3000;

	const { asPath } = useRouter();
	const router = useRouter();

	const { user } = useUser({
		redirectIfFound: false,
		redirectTo: "/login"
	});

	let scanApiEndpoint = "";
	let queryString = "";

	scanApiEndpoint = `/api/site/?per_page=` + linksPerPage + `&ordering=name`;

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
		refreshInterval: siteRefreshInterval
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
		}
	};

	React.useEffect(() => {
		user && site
			? (() => {
					user?.settings.disableLocalTime ? setDisableLocalTime(true) : setDisableLocalTime(false) ?? null;

					setTimeout(() => {
						setComponentReady(true);
					}, 500);
			  })()
			: null;

		return setComponentReady(false);
	}, [user, site]);

	React.useEffect(() => {
		removeURLParameter(asPath, "page").includes("?")
			? setPagePath(`${removeURLParameter(asPath, "page")}&`)
			: setPagePath(`${removeURLParameter(asPath, "page")}?`);

		result?.search ? setSearchKey(result?.search) : null;
		result?.per_page ? setLinksPerPage(result?.per_page) : null;
	}, [result, asPath]);

	return (
		<Layout user={componentReady ? user : null}>
			<NextSeo title={componentReady ? pageTitle : null} />

			<section tw="flex overflow-hidden bg-white">
				<MainSidebar
					width={width}
					user={componentReady ? user : null}
					openMobileSidebar={openMobileSidebar}
					setOpenMobileSidebar={setOpenMobileSidebar}
				/>

				{componentReady ? (
					<div tw="flex flex-col w-0 flex-1 overflow-hidden min-h-screen">
						<div tw="relative flex-shrink-0 flex bg-white">
							<div tw="border-b flex-shrink-0 flex">
								<MobileSidebarButton
									openMobileSidebar={openMobileSidebar}
									setOpenMobileSidebar={setOpenMobileSidebar}
								/>
							</div>

							<AddSite
								user={componentReady ? user : null}
								site={site ? site : null}
								searchKey={searchKey}
								onSearchEvent={handleSearch}
							/>
						</div>

						<Scrollbars universal>
							<div tw="absolute w-full h-full max-w-screen-2xl mx-auto left-0 right-0">
								<div tw="flex flex-col h-full">
									{site?.count > 0 && (
										<div tw="flex-none px-4 pt-12 sm:px-6 md:px-8 md:flex md:items-start md:justify-between">
											<div tw="flex-1 min-w-0">
												<h2 tw="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">{pageTitle}</h2>
												<div tw="mt-4 flex flex-col sm:flex-row sm:flex-wrap sm:mt-2 sm:space-x-6">
													<div tw="mt-2 flex items-center text-sm text-gray-500">
														<ExternalLinkIcon tw="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
														<span tw="text-sm leading-6 font-semibold text-gray-500">
															{site?.count + " "}
															{site?.count > 1 ? SitesLabel[3].label : SitesLabel[2].label}
														</span>
													</div>
												</div>
											</div>
										</div>
									)}

									<div
										css={[
											tw`flex-grow focus:outline-none px-4 pt-8 sm:px-6 md:px-8`,
											site?.count < 1 && tw`flex flex-col flex-auto items-center justify-center`
										]}
										tabIndex="0"
									>
										<div css={[tw`flex-1 w-full h-full`, site?.count < 1 && tw`flex flex-auto`]}>
											<div css={[tw`flex-1 w-full h-full`, site?.count < 1 && tw`flex flex-initial`]}>
												<div
													css={[
														tw`flex-1 w-full h-full py-2 overflow-x-auto`,
														site?.count < 1 && tw`flex items-center`
													]}
												>
													<div tw="min-w-full h-full rounded-lg border-gray-300">
														{site?.count > 0 && (
															<table tw="relative w-full">
																<thead>
																	<tr>
																		{DataTableHeadsContent.map((site, key) => {
																			return (
																				<th
																					key={key}
																					className="min-width-adjust"
																					tw="px-6 py-3 border-b border-gray-200 bg-white text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
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

																<tbody tw="relative divide-y divide-gray-200">
																	{site?.results.map((value, index) => (
																		<DataTable
																			key={index}
																			siteId={value.id}
																			siteName={value.name}
																			siteUrl={value.url}
																			siteVerified={value.verified}
																			siteVerificationId={value.verification_id}
																			disableLocalTime={disableLocalTime}
																			mutateSite={mutateSite}
																		/>
																	))}
																</tbody>
															</table>
														)}

														{site?.count == 0 && result?.search == undefined && result?.ordering == undefined && (
															<section tw="flex flex-col justify-center h-full">
																<div tw="px-4 py-5 sm:p-6 flex items-center justify-center">
																	<h3 tw="text-lg leading-6 font-medium text-gray-500">{SitesLabel[1].label}</h3>
																</div>
															</section>
														)}
													</div>
												</div>
											</div>
										</div>
									</div>

									<div tw="flex-none px-4 sm:px-6 md:px-8">
										<div tw="pt-4 border-t border-gray-200">
											<MyPagination
												href="/sites/"
												pathName={pagePath}
												apiEndpoint={scanApiEndpoint}
												page={result?.page ? result?.page : 0}
												linksPerPage={linksPerPage}
												onItemsPerPageChange={onItemsPerPageChange}
											/>
										</div>

										{componentReady ? (
											<div tw="w-full p-4 border-t border-gray-200">
												<SiteFooter />
											</div>
										) : null}
									</div>
								</div>
							</div>
						</Scrollbars>
					</div>
				) : (
					<div tw="mx-auto">
						<Loader />
					</div>
				)}
			</section>
		</Layout>
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

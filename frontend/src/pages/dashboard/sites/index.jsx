import MobileSidebarButton from "@components/buttons/MobileSidebarButton";
import Layout from "@components/layouts";
import Footer from "@components/layouts/Footer";
import { Sidebar } from "@components/layouts/Sidebar";
import DataPagination from "@components/pagination";
import AddSite from "@components/sites/AddSite";
import SiteSorting from "@components/sorting/SiteSorting";
import DataTable from "@components/tables/DataTable";
import { SiteApiEndpoint, UserApiEndpoint } from "@configs/ApiEndpoints";
import { server } from "@configs/ServerEnv";
import { SitesTableLabels } from "@configs/SitesTableLabels";
import {
	handleItemsPerPageChange,
	handleScanApiEndpoint,
	handleSiteQueries,
	handleSiteSearch
} from "@helpers/handleSiteQueries";
import { handleSites } from "@helpers/handleSites";
import { handleUser } from "@helpers/handleUser";
import { ExternalLinkIcon } from "@heroicons/react/outline";
import { useComponentVisible } from "@hooks/useComponentVisible";
import axios from "axios";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import PropTypes from "prop-types";
import * as React from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { SWRConfig } from "swr";
import tw from "twin.macro";

export async function getServerSideProps({ req, query }) {
	const userResponse = await axios.get(`${server + UserApiEndpoint}`, {
		headers: req.headers,
		validateStatus: (status) => {
			return status < 500;
		}
	});
	const userData = userResponse?.data ?? null;
	const userStatus = userResponse?.status ?? null;

	const siteResponse = await axios.get(`${server + SiteApiEndpoint}`, {
		headers: req.headers,
		validateStatus: (status) => {
			return status < 500;
		}
	});
	const siteData = siteResponse?.data ?? null;
	const siteStatus = siteResponse?.status ?? null;

	return {
		props: {
			result: query ?? null,
			status: {
				user: userStatus ?? null,
				site: siteStatus ?? null
			},
			fallback: {
				UserApiEndpoint: userData ?? null,
				SiteApiEndpoint: siteData ?? null
			}
		}
	};
}

const Sites = ({ result, status, fallback }) => {
	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

	const { linksPerPage, setLinksPerPage, pagePath, setPagePath, searchKey, setSearchKey } = handleSiteQueries({
		result: result ?? null
	});
	const { scanApiEndpoint } = handleScanApiEndpoint(result, linksPerPage);
	const { validatingUser, isUserReady, userData, disableLocalTime } = handleUser({
		endpoint: UserApiEndpoint,
		status: status?.user ?? null
	});
	const { validatingSite, isSiteReady, siteData, mutateSite } = handleSites({
		endpoint: !validatingUser && isUserReady ? scanApiEndpoint : null,
		status: status?.site ?? null
	});

	const onHandleSiteSearch = async (event) => {
		return await handleSiteSearch(event, scanApiEndpoint, setSearchKey);
	};
	const onHandleItemsPerPageChange = async (count) => {
		return await handleItemsPerPageChange(scanApiEndpoint, count, setLinksPerPage);
	};

	const { t } = useTranslation("sites");
	const sites = t("sites");
	const site = t("site");
	const noAvailableSites = t("noAvailableSites");

	const labelsArray = SitesTableLabels();

	return (
		<SWRConfig value={{ fallback }}>
			<Layout>
				<NextSeo title={sites} />

				<section tw="h-screen flex overflow-hidden bg-white">
					<Sidebar
						ref={ref}
						isUserReady={isUserReady}
						validatingUser={validatingUser}
						isUserReady={isUserReady}
						user={userData}
						openSidebar={isComponentVisible}
						setOpenSidebar={setIsComponentVisible}
					/>

					<div tw="flex flex-col w-0 flex-1 overflow-hidden min-h-screen">
						<div tw="relative flex-shrink-0 flex">
							<div tw="border-b flex-shrink-0 flex">
								<MobileSidebarButton openSidebar={isComponentVisible} setOpenSidebar={setIsComponentVisible} />
							</div>

							<AddSite user={userData} site={siteData} searchKey={searchKey} onSearchEvent={onHandleSiteSearch} />
						</div>

						<Scrollbars universal>
							<div tw="absolute w-full h-full max-w-screen-2xl mx-auto left-0 right-0">
								<div tw="flex flex-col h-full">
									{siteData?.count > 0 && (
										<div tw="flex-none px-4 pt-12 sm:px-6 md:px-8 md:flex md:items-start md:justify-between">
											<div tw="flex-1 min-w-0">
												<h2 tw="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">{sites}</h2>
												<div tw="mt-4 flex flex-col sm:flex-row sm:flex-wrap sm:mt-2 sm:space-x-6">
													<div tw="mt-2 flex items-center text-sm text-gray-500">
														<ExternalLinkIcon tw="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
														<span tw="text-sm leading-6 font-semibold text-gray-500">
															{siteData?.count + " "}
															{siteData?.count > 1 ? sites : site}
														</span>
													</div>
												</div>
											</div>
										</div>
									)}

									<div
										css={[
											tw`flex-grow focus:outline-none px-4 pt-8 sm:px-6 md:px-8`,
											siteData?.count < 1 && tw`flex flex-col flex-auto items-center justify-center`
										]}
										tabIndex="0"
									>
										<div css={[tw`flex-1 w-full h-full`, siteData?.count < 1 && tw`flex flex-auto`]}>
											<div css={[tw`flex-1 w-full h-full`, siteData?.count < 1 && tw`flex flex-initial`]}>
												<div
													css={[
														tw`flex-1 w-full h-full py-2 overflow-x-auto`,
														siteData?.count < 1 && tw`flex items-center`
													]}
												>
													<div tw="min-w-full h-full rounded-lg border-gray-300">
														{siteData?.count > 0 && (
															<table tw="relative w-full">
																<thead>
																	<tr>
																		{labelsArray.map((label, key) => {
																			return (
																				<th
																					key={key}
																					className="min-width-adjust"
																					tw="px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
																				>
																					<span tw="flex items-center justify-start">
																						<SiteSorting
																							result={result}
																							slug={label.slug}
																							mutateSite={mutateSite}
																							sitesTableLabels={label.label}
																							setPagePath={setPagePath}
																						/>
																						<span tw="flex items-center">{label.label}</span>
																					</span>
																				</th>
																			);
																		})}
																	</tr>
																</thead>

																<tbody tw="relative divide-y divide-gray-200">
																	{siteData?.results.map((value, index) => (
																		<DataTable
																			componentReady={isSiteReady}
																			disableLocalTime={disableLocalTime}
																			key={index}
																			mutateSite={mutateSite}
																			siteId={parseInt(value.id)}
																			siteName={value.name}
																			siteUrl={value.url}
																			siteVerificationId={parseInt(value.verification_id)}
																			siteVerified={value.verified}
																		/>
																	))}
																</tbody>
															</table>
														)}

														{siteData?.count == 0 && result?.search == undefined && result?.ordering == undefined && (
															<section tw="flex flex-col justify-center h-full">
																<div tw="px-4 py-5 sm:p-6 flex items-center justify-center">
																	<h3 tw="text-lg leading-6 font-medium text-gray-500">{noAvailableSites}</h3>
																</div>
															</section>
														)}
													</div>
												</div>
											</div>
										</div>
									</div>

									<div tw="flex-none px-4 sm:px-6 md:px-8">
										<DataPagination
											activePage={parseInt(result?.page ? result?.page : 0)}
											apiEndpoint={scanApiEndpoint}
											handleItemsPerPageChange={onHandleItemsPerPageChange}
											linksPerPage={parseInt(linksPerPage)}
											pathName={pagePath}
											componentReady={isSiteReady}
										/>

										<div tw="w-full p-4 border-t border-gray-200">
											<Footer />
										</div>
									</div>
								</div>
							</div>
						</Scrollbars>
					</div>
				</section>
			</Layout>
		</SWRConfig>
	);
};

Sites.propTypes = {
	fallback: PropTypes.any,
	result: PropTypes.shape({
		ordering: PropTypes.any,
		page: PropTypes.any,
		per_page: PropTypes.any,
		search: PropTypes.any
	}),
	status: PropTypes.any
};

export default Sites;

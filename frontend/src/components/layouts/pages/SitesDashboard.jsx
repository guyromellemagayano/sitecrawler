import DataPagination from "@components/pagination";
import { SitesTableLabels } from "@configs/SitesTableLabels";
import { handleItemsPerPageChange, handleScanApiEndpoint, handleSiteQueries } from "@helpers/handleSiteQueries";
import { ExternalLinkIcon } from "@heroicons/react/outline";
import { useSites } from "@hooks/useSites";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { memo } from "react";
import tw from "twin.macro";
import Footer from "../components/Footer";

/**
 * Memoized function to render the `SitesDashboardPageLayout` component
 */
const SitesDashboardPageLayout = memo(() => {
	// Router
	const { query } = useRouter();

	// Helper functions
	const { linksPerPage, setLinksPerPage, pagePath, setPagePath } = handleSiteQueries(query);
	const { scanApiEndpoint } = handleScanApiEndpoint(query, linksPerPage);

	// SWR hooks
	const { sites, errorSites, validatingSites } = useSites({
		endpoint: scanApiEndpoint
	});

	// Custom functions
	const onHandleItemsPerPageChange = async (count) => {
		return await handleItemsPerPageChange(scanApiEndpoint, count, setLinksPerPage);
	};

	// Translations
	const { t } = useTranslation("sites");
	const site = t("site");
	const noAvailableSites = t("noAvailableSites");

	// Sites table labels with translations
	const labelsArray = SitesTableLabels();

	return (
        <>
			{sites?.count > 0 && (
				<div tw="flex-none px-4 pt-12 sm:px-6 md:px-8 md:flex md:items-start md:justify-between">
					<div tw="flex-1 min-w-0">
						<h2 tw="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">{sites}</h2>
						<div tw="mt-4 flex flex-col sm:flex-row sm:flex-wrap sm:mt-2 sm:space-x-6">
							<div tw="mt-2 flex items-center text-sm text-gray-500">
								<ExternalLinkIcon tw="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
								<span tw="text-sm leading-6 font-semibold text-gray-500">
									{sites?.count + " "}
									{sites?.count > 1 ? sites : site}
								</span>
							</div>
						</div>
					</div>
				</div>
			)}

			<div
				css={[
					tw`flex-grow focus:outline-none px-4 pt-8 sm:px-6 md:px-8`,
					sites?.count < 1 ? tw`flex flex-col flex-auto items-center justify-center` : null
				]}
				tabIndex="0"
			>
				<div css={[tw`flex-1 w-full h-full`, sites?.count < 1 && tw`flex flex-auto`]}>
					<div css={[tw`flex-1 w-full h-full`, sites?.count < 1 && tw`flex flex-initial`]}>
						<div css={[tw`flex-1 w-full h-full py-2 overflow-x-auto`, sites?.count < 1 && tw`flex items-center`]}>
							<div tw="min-w-full h-full rounded-lg border-gray-300">
								{sites?.count > 0 && sites?.results?.length > 0 ? (
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
																	result={query}
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
											{sites?.results?.map((value, index) => (
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
								) : null}

								{sites?.count === 0 &&
								typeof query?.search === "undefined" &&
								typeof query?.ordering === "undefined" ? (
									<section tw="flex flex-col justify-center h-full">
										<div tw="px-4 py-5 sm:p-6 flex items-center justify-center">
											<h3 tw="text-lg leading-6 font-medium text-gray-500">{noAvailableSites}</h3>
										</div>
									</section>
								) : null}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div tw="flex-none px-4 sm:px-6 md:px-8">
				<DataPagination
					activePage={parseInt(query?.page ? query?.page : 0)}
					apiEndpoint={scanApiEndpoint}
					handleItemsPerPageChange={onHandleItemsPerPageChange}
					linksPerPage={parseInt(linksPerPage)}
					pathName={pagePath}
					componentReady={!validatingSites}
				/>

				<div tw="w-full p-4 border-t border-gray-200">
					<Footer />
				</div>
			</div>
		</>
    );
});

export default SitesDashboardPageLayout;

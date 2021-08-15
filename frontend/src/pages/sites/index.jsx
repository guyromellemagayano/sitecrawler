// React
import * as React from "react";

// NextJS
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

// External
import { ExternalLinkIcon } from "@heroicons/react/solid";
import { NextSeo } from "next-seo";
import { Scrollbars } from "react-custom-scrollbars-2";
import PropTypes from "prop-types";
import tw from "twin.macro";

// Enums
import { EndpointRefreshInterval } from "@enums/GlobalValues";
import { SitesLabels } from "@enums/SitesLabels";
import { SitesTableLabels } from "@enums/SitesTableLabels";

// Hooks
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useSite } from "@hooks/useSite";
import useUser from "@hooks/useUser";

// Components
import AddSite from "@components/sites/AddSite";
import DataPagination from "@components/pagination";
import DataTable from "@components/tables/DataTable";
import Footer from "@components/layouts/Footer";
import Layout from "@components/layouts";
import MobileSidebarButton from "@components/buttons/MobileSidebarButton";
import Sidebar from "@components/layouts/Sidebar";
import SiteSorting from "@components/sorting/SiteSorting";

// Utils
import { LoginLink } from "@enums/PageLinks";
import { removeURLParameter } from "@utils/functions";

const Sites = ({ result }) => {
	const [componentReady, setComponentReady] = React.useState(false);
	const [disableLocalTime, setDisableLocalTime] = React.useState(false);
	const [linksPerPage, setLinksPerPage] = React.useState(20);
	const [pagePath, setPagePath] = React.useState("");
	const [searchKey, setSearchKey] = React.useState("");

	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
	const { asPath } = useRouter();
	const router = useRouter();

	const { user } = useUser({
		redirectIfFound: false,
		redirectTo: LoginLink
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
		refreshInterval: EndpointRefreshInterval
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

		mutateSite(scanApiEndpoint);
	};

	const handleItemsPerPageChange = (count) => {
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

			mutateSite(scanApiEndpoint);
		}
	};

	React.useEffect(() => {
		user && site
			? (() => {
					user?.settings?.disableLocalTime ? setDisableLocalTime(true) : setDisableLocalTime(false);

					setComponentReady(true);
			  })()
			: setComponentReady(false);

		return { user, site };
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
			<NextSeo title={componentReady ? SitesLabels[0].label : null} />

			<section tw="h-screen flex overflow-hidden bg-white">
				<Sidebar
					ref={ref}
					user={componentReady ? user : null}
					openSidebar={isComponentVisible}
					setOpenSidebar={setIsComponentVisible}
				/>

				<div tw="flex flex-col w-0 flex-1 overflow-hidden min-h-screen">
					<div tw="relative flex-shrink-0 flex">
						<div tw="border-b flex-shrink-0 flex">
							<MobileSidebarButton
								openSidebar={isComponentVisible}
								setOpenSidebar={setIsComponentVisible}
							/>
						</div>

						<AddSite
							user={componentReady ? user : null}
							site={componentReady ? site : null}
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
											<h2 tw="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
												{SitesLabels[0].label}
											</h2>
											<div tw="mt-4 flex flex-col sm:flex-row sm:flex-wrap sm:mt-2 sm:space-x-6">
												<div tw="mt-2 flex items-center text-sm text-gray-500">
													<ExternalLinkIcon
														tw="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
														aria-hidden="true"
													/>
													<span tw="text-sm leading-6 font-semibold text-gray-500">
														{site?.count + " "}
														{site?.count > 1 ? SitesLabels[3].label : SitesLabels[2].label}
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
																	{SitesTableLabels.map((site, key) => {
																		return (
																			<th
																				key={key}
																				className="min-width-adjust"
																				tw="px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
																			>
																				<span tw="flex items-center justify-start">
																					<SiteSorting
																						result={result}
																						slug={site.slug}
																						mutateSite={mutateSite}
																						sitesTableLabels={SitesTableLabels}
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
																		componentReady={componentReady}
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

													{/* TODO: Develop a single component for NoSitesAvailableState */}
													{site?.count == 0 &&
														result?.search == undefined &&
														result?.ordering == undefined && (
															<section tw="flex flex-col justify-center h-full">
																<div tw="px-4 py-5 sm:p-6 flex items-center justify-center">
																	<h3 tw="text-lg leading-6 font-medium text-gray-500">
																		{SitesLabels[1].label}
																	</h3>
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
										<DataPagination
											activePage={parseInt(result?.page ? result?.page : 0)}
											apiEndpoint={scanApiEndpoint}
											handleItemsPerPageChange={handleItemsPerPageChange}
											linksPerPage={parseInt(linksPerPage)}
											pathName={pagePath}
											componentReady={componentReady}
										/>
									</div>

									{componentReady ? (
										<div tw="w-full p-4 border-t border-gray-200">
											<Footer />
										</div>
									) : null}
								</div>
							</div>
						</div>
					</Scrollbars>
				</div>
			</section>
		</Layout>
	);
};

Sites.propTypes = {
	ordering: PropTypes.string,
	page: PropTypes.string,
	per_page: PropTypes.string,
	search: PropTypes.string
};

Sites.defaultProps = {
	ordering: null,
	page: null,
	per_page: null,
	search: null
};

export default Sites;

export async function getServerSideProps(ctx) {
	return {
		props: {
			result: ctx.query
		}
	};
}

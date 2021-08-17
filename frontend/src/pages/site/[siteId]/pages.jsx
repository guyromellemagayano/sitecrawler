// React
import * as React from "react";

// NextJS
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

// External
import "twin.macro";
import { NextSeo } from "next-seo";
import { Scrollbars } from "react-custom-scrollbars-2";
import PropTypes from "prop-types";

// Enums
import { PagesLabels } from "@enums/PagesLabels";
import { PagesTableLabels } from "@enums/PagesTableLabels";

// Hooks
import { LoginLink, SitesLink, SubscriptionPlansLink } from "@enums/PageLinks";
import { SiteApiEndpoint } from "@enums/ApiEndpoints";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { usePages, useSiteId } from "@hooks/useSite";
import useCrawl from "@hooks/useCrawl";
import useUser from "@hooks/useUser";

// Components
import Breadcrumbs from "@components/breadcrumbs";
import DataPagination from "@components/pagination";
import Footer from "@components/layouts/Footer";
import HeadingOptions from "@components/options/HeadingOptions";
import Layout from "@components/layouts";
import LinkOptions from "@components/options/LinkOptions";
import MobileSidebarButton from "@components/buttons/MobileSidebarButton";
import PageSorting from "@components/sorting/PageSorting";
import PageTable from "@components/tables/PageTable";
import PageTableSkeleton from "@components/skeletons/PageTableSkeleton";
import Sidebar from "@components/layouts/Sidebar";
import UpgradeErrorAlert from "@components/alerts/UpgradeErrorAlert";

// Dynamic
const PageFilter = dynamic(() => import("@components/filters/PageFilter"), { ssr: false });

// Utils
import { removeURLParameter } from "@utils/functions";

const Pages = ({ result }) => {
	const [componentReady, setComponentReady] = React.useState(false);
	const [enableSiteIdHook, setEnableSiteIdHook] = React.useState(false);
	const [linksPerPage, setLinksPerPage] = React.useState(20);
	const [pagePath, setPagePath] = React.useState("");
	const [scanObjId, setScanObjId] = React.useState(null);
	const [searchKey, setSearchKey] = React.useState("");

	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
	const { asPath } = useRouter();
	const router = useRouter();

	const { user } = useUser({
		redirectIfFound: false,
		redirectTo: LoginLink
	});

	React.useEffect(() => {
		return user ? setEnableSiteIdHook(true) : setEnableSiteIdHook(false);
	}, [user, enableSiteIdHook]);

	const {
		selectedSiteRef,
		handleCrawl,
		currentScan,
		previousScan,
		isCrawlStarted,
		isCrawlFinished
	} = useCrawl({
		siteId: enableSiteIdHook ? parseInt(result?.siteId) : null
	});

	const { siteId } = useSiteId({
		querySid: enableSiteIdHook ? parseInt(result?.siteId) : null,
		redirectIfFound: false,
		redirectTo: enableSiteIdHook ? SitesLink : null
	});

	React.useEffect(() => {
		currentScan ? setScanObjId(currentScan?.id) : setScanObjId(previousScan?.id);

		return scanObjId;
	}, [currentScan, previousScan]);

	const pageTitle = PagesLabels[1].label + " - " + siteId?.name;

	let scanApiEndpoint = "";
	let queryString = "";
	let filterQueryString = "";

	if (typeof window !== "undefined") {
		filterQueryString = new URLSearchParams(window.location.search);
	}

	user?.permissions.includes("can_see_pages") &&
	user?.permissions.includes("can_see_scripts") &&
	user?.permissions.includes("can_see_stylesheets")
		? (() => {
				scanApiEndpoint =
					result?.page !== undefined
						? `${SiteApiEndpoint + parseInt(result?.siteId)}/scan/${scanObjId}/page/?per_page=` +
						  linksPerPage +
						  `&page=` +
						  result?.page
						: `${SiteApiEndpoint + parseInt(result?.siteId)}/scan/${scanObjId}/page/?per_page=` +
						  linksPerPage;

				queryString +=
					result?.size_total_min !== undefined
						? scanApiEndpoint.includes("?")
							? `&size_total_min=1048576`
							: `?size_total_min=1048576`
						: "";

				queryString +=
					result?.size_total_max !== undefined
						? scanApiEndpoint.includes("?")
							? `&size_total_max=1048575`
							: `?size_total_max=1048575`
						: "";

				queryString +=
					result?.tls_total !== undefined
						? result?.tls_total === "true"
							? scanApiEndpoint.includes("?")
								? `&tls_total=true`
								: `?tls_total=true`
							: scanApiEndpoint.includes("?")
							? `&tls_total=false`
							: `?tls_total=false`
						: "";

				queryString +=
					result?.has_duplicated_title !== undefined
						? scanApiEndpoint.includes("?")
							? `&has_duplicated_title=true`
							: `?has_duplicated_title=true`
						: "";

				queryString +=
					result?.has_duplicated_description !== undefined
						? scanApiEndpoint.includes("?")
							? `&has_duplicated_description=true`
							: `?has_duplicated_description=true`
						: "";

				queryString +=
					result?.search !== undefined
						? scanApiEndpoint.includes("?")
							? `&search=${result?.search}`
							: `?search=${result?.search}`
						: "";

				queryString +=
					result?.ordering !== undefined
						? scanApiEndpoint.includes("?")
							? `&ordering=${result?.ordering}`
							: `?ordering=${result?.ordering}`
						: "";

				queryString +=
					typeof window !== "undefined" &&
					filterQueryString.toString() !== "" &&
					filterQueryString.toString() !== undefined
						? scanApiEndpoint.includes("?")
							? window.location.search.replace("?", "&")
							: window.location.search
						: "";

				scanApiEndpoint += queryString;
		  })()
		: null;

	const { pages, mutatePages } = usePages({
		endpoint: enableSiteIdHook ? scanApiEndpoint : null,
		querySid: enableSiteIdHook ? parseInt(result?.siteId) : null,
		scanObjId: enableSiteIdHook ? scanObjId : null
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

		mutatePages(scanApiEndpoint);
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

			mutatePages(scanApiEndpoint);
		}
	};

	React.useEffect(() => {
		if (removeURLParameter(asPath, "page").includes("?"))
			setPagePath(`${removeURLParameter(asPath, "page")}&`);
		else setPagePath(`${removeURLParameter(asPath, "page")}?`);

		if (result?.search !== undefined) setSearchKey(result?.search);

		if (result?.per_page !== undefined) setLinksPerPage(result?.per_page);
	}, [result]);

	React.useEffect(() => {
		user && siteId && pages ? setComponentReady(true) : setComponentReady(false);

		return { user, siteId, pages };
	}, [user, siteId, pages]);

	return (
		<Layout user={user}>
			<NextSeo title={pageTitle} />

			<section tw="h-screen flex overflow-hidden bg-white">
				<Sidebar
					ref={ref}
					user={user}
					openSidebar={isComponentVisible}
					setOpenSidebar={setIsComponentVisible}
				/>

				<div ref={selectedSiteRef} tw="flex flex-col w-0 flex-1 overflow-hidden min-h-screen">
					<div tw="relative flex-shrink-0 flex">
						<div tw="border-b flex-shrink-0 flex">
							<MobileSidebarButton
								openSidebar={isComponentVisible}
								setOpenSidebar={setIsComponentVisible}
							/>
						</div>

						<LinkOptions
							permissions={user?.permissions}
							searchKey={searchKey}
							onSearchEvent={handleSearch}
						/>
					</div>

					<Scrollbars universal>
						<main tw="absolute w-full h-full mx-auto left-0 right-0">
							<div tw="flex flex-col h-full p-6 mx-auto">
								<div tw="flex-none p-4">
									<Breadcrumbs siteId={parseInt(result?.siteId)} pageTitle={PagesLabels[1].label} />

									<HeadingOptions
										componentReady={componentReady}
										count={pages?.count}
										dataLabel={[PagesLabels[2].label, PagesLabels[6].label, PagesLabels[3].label]}
										handleCrawl={handleCrawl}
										isCrawlFinished={isCrawlFinished}
										isCrawlStarted={isCrawlStarted}
										isPages
										pageTitle={PagesLabels[1].label}
										permissions={user?.permissions}
										queryString={queryString}
										scanObjId={scanObjId}
										scanResult={currentScan}
										siteId={parseInt(result?.siteId)}
										siteName={siteId?.name}
										siteUrl={siteId?.url}
										verified={siteId?.verified}
									/>
								</div>

								<div tw="flex-grow max-w-full p-4 pb-0">
									{user?.permissions.includes("can_see_pages") &&
									user?.permissions.includes("can_see_scripts") &&
									user?.permissions.includes("can_see_stylesheets") ? (
										<PageFilter
											filterQueryString={filterQueryString}
											scanApiEndpoint={scanApiEndpoint}
											setPagePath={setPagePath}
										/>
									) : null}

									{pages?.results !== undefined && pages?.results.length !== 0 && (
										<div tw="pb-4">
											<div tw="flex flex-col">
												<div tw="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
													<div tw="min-w-full h-full rounded-lg border-gray-300">
														{pages?.results !== undefined && pages?.results.length > 0 && (
															<>
																<table tw="relative min-w-full">
																	<thead>
																		<tr>
																			{PagesTableLabels.map((site, key) => {
																				return (
																					<th
																						key={key}
																						className="min-width-adjust"
																						tw="px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
																					>
																						<span tw="flex items-center justify-start">
																							{user?.permissions.includes("can_see_pages") &&
																							user?.permissions.includes("can_see_scripts") &&
																							user?.permissions.includes("can_see_stylesheets") ? (
																								site?.slug ? (
																									<PageSorting
																										result={result}
																										slug={site?.slug}
																										mutatePages={mutatePages}
																										labels={PagesTableLabels}
																										setPagePath={setPagePath}
																									/>
																								) : null
																							) : null}
																							<span className="label" tw="flex items-center">
																								{site?.label}
																							</span>
																						</span>
																					</th>
																				);
																			})}
																		</tr>
																	</thead>
																	<tbody tw="relative">
																		{user?.permissions.includes("can_see_pages") &&
																		user?.permissions.includes("can_see_scripts") &&
																		user?.permissions.includes("can_see_stylesheets") ? (
																			pages?.results !== undefined && pages?.results.length > 0 ? (
																				pages?.results.map((val, key) => (
																					<PageTable
																						key={key}
																						siteId={parseInt(result?.siteId)}
																						val={val}
																						componentReady={componentReady}
																					/>
																				))
																			) : null
																		) : (
																			<PageTableSkeleton />
																		)}
																	</tbody>
																</table>

																{user?.permissions.length == 0 ? (
																	<div tw="absolute left-0 right-0">
																		<UpgradeErrorAlert link={SubscriptionPlansLink} />
																	</div>
																) : null}
															</>
														)}
													</div>
												</div>
											</div>
										</div>
									)}

									{pages?.results !== undefined && pages?.results.length == 0 && (
										<section tw="flex flex-col justify-center h-full">
											<div tw="px-4 py-5 sm:p-6 sm:-mt-12 flex items-center justify-center">
												<h3 tw="text-lg leading-6 font-medium text-gray-500">
													{PagesLabels[3].label}
												</h3>
											</div>
										</section>
									)}
								</div>

								<div tw="flex-none p-4 pt-0">
									<DataPagination
										activePage={parseInt(result?.page) ? parseInt(result?.page) : 0}
										apiEndpoint={scanApiEndpoint}
										componentReady={componentReady}
										handleItemsPerPageChange={handleItemsPerPageChange}
										linksPerPage={parseInt(linksPerPage)}
										pathName={pagePath}
									/>

									{componentReady ? (
										<div tw="w-full p-4 border-t border-gray-200">
											<Footer />
										</div>
									) : null}
								</div>
							</div>
						</main>
					</Scrollbars>
				</div>
			</section>
		</Layout>
	);
};

Pages.propTypes = {
	result: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};

Pages.defaultProps = {
	result: null
};

export default Pages;

export async function getServerSideProps(ctx) {
	return {
		props: {
			result: ctx.query
		}
	};
}

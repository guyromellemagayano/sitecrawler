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
		scanCount,
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
		const handleScanObjId = (scanCount, currentScan, previousScan) => {
			scanCount > 1
				? previousScan
					? setScanObjId(previousScan?.id)
					: false
				: currentScan
				? setScanObjId(currentScan?.id)
				: setScanObjId(previousScan?.id);

			return scanObjId;
		};

		handleScanObjId(scanCount, currentScan, previousScan);
	}, [scanCount, currentScan, previousScan]);

	const pageTitle = PagesLabels[1].label + " - " + siteId?.name;

	let scanApiEndpoint = "";
	let queryString = "";

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
		<Layout user={componentReady ? user : null}>
			<NextSeo title={componentReady ? pageTitle : null} />

			<section tw="h-screen flex overflow-hidden bg-white">
				<Sidebar
					ref={ref}
					user={componentReady ? user : null}
					openSidebar={isComponentVisible}
					setOpenSidebar={setIsComponentVisible}
				/>

				<div ref={selectedSiteRef} tw="flex flex-col w-0 flex-1 overflow-hidden">
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
						<main
							tw="flex-1 relative max-w-screen-2xl mx-auto overflow-y-auto focus:outline-none"
							tabIndex="0"
						>
							<div tw="w-full p-6 mx-auto">
								<div className="max-w-full p-4">
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
							</div>
							<div tw="max-w-full px-4 py-4 sm:px-6 md:px-8">
								{user?.permissions.includes("can_see_pages") &&
								user?.permissions.includes("can_see_scripts") &&
								user?.permissions.includes("can_see_stylesheets") ? (
									<PageFilter scanApiEndpoint={scanApiEndpoint} setPagePath={setPagePath} />
								) : null}

								<div tw="pb-4">
									<div tw="flex flex-col">
										<div tw="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
											<div tw="relative min-w-full rounded-lg border-gray-300">
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
															pages?.results !== undefined ? (
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
											</div>
										</div>
									</div>
								</div>

								<DataPagination
									activePage={parseInt(result?.page) ? parseInt(result?.page) : 0}
									apiEndpoint={scanApiEndpoint}
									componentReady={componentReady}
									handleItemsPerPageChange={handleItemsPerPageChange}
									linksPerPage={parseInt(linksPerPage)}
									pathName={pagePath}
								/>

								<div tw="static bottom-0 w-full mx-auto p-4 border-t border-gray-200">
									<Footer />
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
	result: PropTypes.object
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

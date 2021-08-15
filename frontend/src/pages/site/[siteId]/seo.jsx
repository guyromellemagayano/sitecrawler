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
import { SeoLabels } from "@enums/SeoLabels";
import { SeoTableLabels } from "@enums/SeoTableLabels";

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
import SeoSorting from "@components/sorting/SeoSorting";
import SeoTable from "@components/tables/SeoTable";
import SeoTableSkeleton from "@components/skeletons/SeoTableSkeleton";
import Layout from "@components/layouts";
import LinkOptions from "@components/options/LinkOptions";
import MobileSidebarButton from "@components/buttons/MobileSidebarButton";
import Sidebar from "@components/layouts/Sidebar";
import UpgradeErrorAlert from "@components/alerts/UpgradeErrorAlert";

// Dynamic
const SeoFilter = dynamic(() => import("@components/filters/SeoFilter"), { ssr: false });

// Utils
import { removeURLParameter } from "@utils/functions";

const Seo = ({ result }) => {
	const [componentReady, setComponentReady] = React.useState(false);
	const [disableLocalTime, setDisableLocalTime] = React.useState(false);
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

	const pageTitle = SeoLabels[1].label + " - " + siteId?.name;

	let scanApiEndpoint = "";
	let queryString = "";
	let hasTitleString = "";
	let hasDescriptionString = "";
	let hasH1FirstString = "";
	let hasH2FirstString = "";

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

				hasTitleString = Array.isArray(result?.has_title)
					? result?.has_title.join("&has_title=")
					: result?.has_title;

				queryString +=
					result?.has_title !== undefined
						? scanApiEndpoint.includes("?")
							? `&has_title=${hasTitleString}`
							: `?has_title=${hasTitleString}`
						: "";

				hasDescriptionString = Array.isArray(result?.has_description)
					? result?.has_description.join("&has_description=")
					: result?.has_description;

				queryString +=
					result?.has_description !== undefined
						? scanApiEndpoint.includes("?")
							? `&has_description=${hasDescriptionString}`
							: `?has_description=${hasDescriptionString}`
						: "";

				hasH1FirstString = Array.isArray(result?.has_h1_first)
					? result?.has_h1_first.join("&has_h1_first=")
					: result?.has_h1_first;

				queryString +=
					result?.has_h1_first !== undefined
						? scanApiEndpoint.includes("?")
							? `&has_h1_first=${hasH1FirstString}`
							: `?has_h1_first=${hasH1FirstString}`
						: "";

				queryString +=
					result?.has_h1_second !== undefined
						? scanApiEndpoint.includes("?")
							? `&has_h1_second=false`
							: `?has_h1_second=false`
						: "";

				hasH2FirstString = Array.isArray(result?.has_h2_first)
					? result?.has_h2_first.join("&has_h2_first=")
					: result?.has_h2_first;

				queryString +=
					result?.has_h2_first !== undefined
						? scanApiEndpoint.includes("?")
							? `&has_h2_first=${hasH2FirstString}`
							: `?has_h2_first=${hasH2FirstString}`
						: "";

				queryString +=
					result?.has_h2_second !== undefined
						? scanApiEndpoint.includes("?")
							? `&has_h2_second=false`
							: `?has_h2_second=false`
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
		user && siteId && pages
			? (() => {
					user?.settings?.disableLocalTime ? setDisableLocalTime(true) : setDisableLocalTime(false);

					setComponentReady(true);
			  })()
			: setComponentReady(false);

		return { user, siteId, pages };
	}, [user, siteId, pages]);

	return (
		<Layout user={componentReady ? user : null}>
			<NextSeo title={componentReady ? pageTitle : null} />

			<section tw="h-screen flex overflow-hidden bg-white">
				<Sidebar
					openSidebar={isComponentVisible}
					ref={ref}
					setOpenSidebar={setIsComponentVisible}
					user={componentReady ? user : null}
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
									<Breadcrumbs siteId={parseInt(result?.siteId)} pageTitle={SeoLabels[1].label} />
									<HeadingOptions
										componentReady={componentReady}
										count={pages?.count}
										dataLabel={[SeoLabels[2].label, SeoLabels[6].label, SeoLabels[3].label]}
										handleCrawl={handleCrawl}
										isCrawlFinished={isCrawlFinished}
										isCrawlStarted={isCrawlStarted}
										isSeo
										pageTitle={SeoLabels[1].label}
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
									<SeoFilter scanApiEndpoint={scanApiEndpoint} setPagePath={setPagePath} />
								) : null}

								<div tw="pb-4">
									<div tw="flex flex-col">
										<div tw="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
											<div tw="relative min-w-full rounded-lg border-gray-300">
												<table tw="relative min-w-full">
													<thead>
														<tr>
															{SeoTableLabels.map((site, key) => {
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
																					<SeoSorting
																						result={result}
																						slug={site?.slug}
																						mutatePages={mutatePages}
																						labels={SeoTableLabels}
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
																	<SeoTable
																		componentReady={componentReady}
																		key={key}
																		siteId={parseInt(result?.siteId)}
																		val={val}
																		disableLocalTime={disableLocalTime}
																	/>
																))
															) : null
														) : (
															<SeoTableSkeleton />
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

Seo.propTypes = {
	result: PropTypes.object
};

Seo.defaultProps = {
	result: null
};

export default Seo;

export async function getServerSideProps(ctx) {
	return {
		props: {
			result: ctx.query
		}
	};
}

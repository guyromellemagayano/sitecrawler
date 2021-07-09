// React
import * as React from "react";

// NextJS
import { useRouter } from "next/router";

// External
import "twin.macro";
import { NextSeo } from "next-seo";
import { Scrollbars } from "react-custom-scrollbars-2";
import { withResizeDetector } from "react-resize-detector";
import loadable from "@loadable/component";
import PropTypes from "prop-types";

// JSON
import SeoLabel from "public/labels/pages/site/seo.json";
import SeoTableContent from "public/data/seo-table.json";

// Hooks
import { usePages, useSiteId } from "src/hooks/useSite";
import useCrawl from "src/hooks/useCrawl";
import useUser from "src/hooks/useUser";

// Layout
import Layout from "src/components/Layout";

// Components
import MainSidebar from "src/components/sidebar/MainSidebar";
import MobileSidebarButton from "src/components/buttons/MobileSidebarButton";
import SiteFooter from "src/components/layouts/Footer";

// Loadable
const Breadcrumbs = loadable(() => import("src/components/breadcrumbs/Breadcrumbs"));
const HeadingOptions = loadable(() => import("src/components/headings/HeadingOptions"));
const LinkOptions = loadable(() => import("src/components/pages/overview/LinkOptions"));
const Loader = loadable(() => import("src/components/layouts/Loader"));
const MyPagination = loadable(() => import("src/components/pagination/Pagination"));
const SeoFilter = loadable(() => import("src/components/helpers/filters/SeoFilter"));
const SeoSorting = loadable(() => import("src/components/helpers/sorting/SeoSorting"));
const SeoTable = loadable(() => import("src/components/tables/SeoTable"));
const SeoTableSkeleton = loadable(() => import("src/components/skeletons/SeoTableSkeleton"));
const UpgradeErrorAlert = loadable(() => import("src/components/alerts/UpgradeErrorAlert"));

// Helpers
import { removeURLParameter } from "src/helpers/functions";

const Seo = (props) => {
	const [componentReady, setComponentReady] = React.useState(false);
	const [disableLocalTime, setDisableLocalTime] = React.useState(false);
	const [enableSiteIdHook, setEnableSiteIdHook] = React.useState(false);
	const [linksPerPage, setLinksPerPage] = React.useState(20);
	const [loadQueryString, setLoadQueryString] = React.useState("");
	const [openMobileSidebar, setOpenMobileSidebar] = React.useState(false);
	const [pagePath, setPagePath] = React.useState("");
	const [scanObjId, setScanObjId] = React.useState(null);
	const [searchKey, setSearchKey] = React.useState("");

	const { asPath } = useRouter();
	const router = useRouter();

	const { user } = useUser({
		redirectIfFound: false,
		redirectTo: "/login"
	});

	React.useEffect(() => {
		return user
			? (() => {
					setEnableSiteIdHook(true);
			  })()
			: null;
	}, [user, enableSiteIdHook]);

	const { selectedSiteRef, handleCrawl, currentScan, previousScan, scanCount, isCrawlStarted, isCrawlFinished } =
		useCrawl({
			siteId: enableSiteIdHook ? props.result?.siteId : null
		});

	const { siteId } = useSiteId({
		querySid: enableSiteIdHook ? props.result?.siteId : null,
		redirectIfFound: false,
		redirectTo: enableSiteIdHook ? "/sites" : null
	});

	React.useEffect(() => {
		const handleScanObjId = (scanCount, currentScan, previousScan) => {
			scanCount > 1
				? previousScan !== undefined
					? setScanObjId(previousScan?.id)
					: false
				: currentScan !== undefined
				? setScanObjId(currentScan?.id)
				: setScanObjId(previousScan?.id);

			return scanObjId;
		};

		return handleScanObjId(scanCount, currentScan, previousScan);
	}, [scanCount, currentScan, previousScan]);

	const pageTitle = SeoLabel[1].label + " - " + siteId?.name;

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
					props.result?.page !== undefined
						? `/api/site/${props.result?.siteId}/scan/${scanObjId}/page/?per_page=` +
						  linksPerPage +
						  `&page=` +
						  props.result?.page
						: `/api/site/${props.result?.siteId}/scan/${scanObjId}/page/?per_page=` + linksPerPage;

				hasTitleString = Array.isArray(props.result?.has_title)
					? props.result?.has_title.join("&has_title=")
					: props.result?.has_title;

				queryString +=
					props.result?.has_title !== undefined
						? scanApiEndpoint.includes("?")
							? `&has_title=${hasTitleString}`
							: `?has_title=${hasTitleString}`
						: "";

				hasDescriptionString = Array.isArray(props.result?.has_description)
					? props.result?.has_description.join("&has_description=")
					: props.result?.has_description;

				queryString +=
					props.result?.has_description !== undefined
						? scanApiEndpoint.includes("?")
							? `&has_description=${hasDescriptionString}`
							: `?has_description=${hasDescriptionString}`
						: "";

				hasH1FirstString = Array.isArray(props.result?.has_h1_first)
					? props.result?.has_h1_first.join("&has_h1_first=")
					: props.result?.has_h1_first;

				queryString +=
					props.result?.has_h1_first !== undefined
						? scanApiEndpoint.includes("?")
							? `&has_h1_first=${hasH1FirstString}`
							: `?has_h1_first=${hasH1FirstString}`
						: "";

				queryString +=
					props.result?.has_h1_second !== undefined
						? scanApiEndpoint.includes("?")
							? `&has_h1_second=false`
							: `?has_h1_second=false`
						: "";

				hasH2FirstString = Array.isArray(props.result?.has_h2_first)
					? props.result?.has_h2_first.join("&has_h2_first=")
					: props.result?.has_h2_first;

				queryString +=
					props.result?.has_h2_first !== undefined
						? scanApiEndpoint.includes("?")
							? `&has_h2_first=${hasH2FirstString}`
							: `?has_h2_first=${hasH2FirstString}`
						: "";

				queryString +=
					props.result?.has_h2_second !== undefined
						? scanApiEndpoint.includes("?")
							? `&has_h2_second=false`
							: `?has_h2_second=false`
						: "";

				queryString +=
					props.result?.search !== undefined
						? scanApiEndpoint.includes("?")
							? `&search=${props.result?.search}`
							: `?search=${props.result?.search}`
						: "";

				queryString +=
					props.result?.ordering !== undefined
						? scanApiEndpoint.includes("?")
							? `&ordering=${props.result?.ordering}`
							: `?ordering=${props.result?.ordering}`
						: "";

				queryString +=
					typeof window !== "undefined" && loadQueryString.toString() !== "" && loadQueryString.toString() !== undefined
						? scanApiEndpoint.includes("?")
							? window.location.search.replace("?", "&")
							: window.location.search
						: "";

				scanApiEndpoint += queryString;
		  })()
		: null;

	const { pages, mutatePages } = usePages({
		endpoint: enableSiteIdHook ? scanApiEndpoint : null,
		querySid: enableSiteIdHook ? props.result?.siteId : null,
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
		mutatePages;
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
			mutatePages;
		}
	};

	React.useEffect(() => {
		if (removeURLParameter(asPath, "page").includes("?")) setPagePath(`${removeURLParameter(asPath, "page")}&`);
		else setPagePath(`${removeURLParameter(asPath, "page")}?`);

		if (props.result?.search !== undefined) setSearchKey(props.result?.search);

		if (props.result?.per_page !== undefined) setLinksPerPage(props.result?.per_page);
	}, [props.result]);

	React.useEffect(() => {
		user && siteId && pages ? setComponentReady(true) : setComponentReady(false);

		return { user, siteId, pages };
	}, [user, siteId, pages]);

	return (
		<Layout user={componentReady ? user : null}>
			<NextSeo title={componentReady ? pageTitle : null} />

			<section tw="h-screen flex overflow-hidden bg-white">
				<MainSidebar
					width={props.width}
					user={componentReady ? user : null}
					openMobileSidebar={openMobileSidebar}
					setOpenMobileSidebar={setOpenMobileSidebar}
				/>

				{componentReady ? (
					<div ref={selectedSiteRef} tw="flex flex-col w-0 flex-1 overflow-hidden">
						<div tw="relative flex-shrink-0 flex">
							<div tw="border-b flex-shrink-0 flex">
								<MobileSidebarButton
									openMobileSidebar={openMobileSidebar}
									setOpenMobileSidebar={setOpenMobileSidebar}
								/>
							</div>

							<LinkOptions
								verified={siteId?.verified}
								permissions={user?.permissions}
								scanResult={currentScan}
								searchKey={searchKey}
								onSearchEvent={handleSearch}
								handleCrawl={handleCrawl}
								isCrawlStarted={isCrawlStarted}
								isCrawlFinished={isCrawlFinished}
							/>
						</div>

						<Scrollbars universal>
							<main tw="flex-1 relative max-w-screen-2xl mx-auto overflow-y-auto focus:outline-none" tabIndex="0">
								<div tw="w-full p-6 mx-auto">
									<div className="max-w-full p-4">
										<Breadcrumbs siteId={props.result?.siteId} pageTitle={SeoLabel[1].label} />
										<HeadingOptions
											isSeo
											queryString={queryString}
											verified={siteId?.verified}
											siteId={props.result?.siteId}
											siteName={siteId?.name}
											siteUrl={siteId?.url}
											scanObjId={scanObjId}
											permissions={user?.permissions}
											pageTitle={SeoLabel[1].label}
											count={pages?.count}
											dataLabel={[SeoLabel[2].label, SeoLabel[6].label, SeoLabel[3].label]}
											isCrawlStarted={isCrawlStarted}
											isCrawlFinished={isCrawlFinished}
											handleCrawl={handleCrawl}
											scanResult={currentScan}
										/>
									</div>
								</div>
								<div tw="max-w-full px-4 py-4 sm:px-6 md:px-8">
									{user?.permissions.includes("can_see_pages") &&
									user?.permissions.includes("can_see_scripts") &&
									user?.permissions.includes("can_see_stylesheets") ? (
										<SeoFilter
											result={props.result}
											loadQueryString={loadQueryString}
											setLoadQueryString={setLoadQueryString}
											mutatePages={mutatePages}
											setPagePath={setPagePath}
										/>
									) : null}

									<div tw="pb-4">
										<div tw="flex flex-col">
											<div tw="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
												<div tw="relative min-w-full rounded-lg border-gray-300">
													<table tw="relative min-w-full">
														<thead>
															<tr>
																{SeoTableContent.map((site, key) => {
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
																							result={props.result}
																							slug={site?.slug}
																							mutatePages={mutatePages}
																							seoTableContent={SeoTableContent}
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
																pages ? (
																	pages?.results.map((val, key) => (
																		<SeoTable
																			key={key}
																			siteId={props.result?.siteId}
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
															<UpgradeErrorAlert link="/settings/subscription-plans" />
														</div>
													) : null}
												</div>
											</div>
										</div>
									</div>

									<MyPagination
										href="/site/[siteId]/seo/"
										pathName={pagePath}
										apiEndpoint={scanApiEndpoint}
										page={props.result?.page ? props.result?.page : 0}
										linksPerPage={linksPerPage}
										onItemsPerPageChange={onItemsPerPageChange}
									/>

									<div tw="static bottom-0 w-full mx-auto p-4 border-t border-gray-200">
										<SiteFooter />
									</div>
								</div>
							</main>
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

Seo.propTypes = {};

export default withResizeDetector(Seo);

export async function getServerSideProps(ctx) {
	return {
		props: {
			result: ctx.query
		}
	};
}

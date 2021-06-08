// React
import * as React from "react";

// NextJS
import Link from "next/link";
import { useRouter } from "next/router";

// External
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/solid";
import { DocumentTextIcon } from "@heroicons/react/outline";
import { NextSeo } from "next-seo";
import { styled } from "twin.macro";
import { withResizeDetector } from "react-resize-detector";
import PropTypes from "prop-types";

// JSON
import LinksPagesContent from "public/data/links-pages.json";
import PagesLabel from "public/labels/pages/site/pages.json";

// Hooks
import { usePages, useSiteId } from "src/hooks/useSite";
import useCrawl from "src/hooks/useCrawl";
import useUser from "src/hooks/useUser";

// Layout
import Layout from "src/components/Layout";

// Components
import LinkOptions from "src/components/pages/overview/LinkOptions";
import Loader from "src/components/layouts/Loader";
import MainSidebar from "src/components/sidebar/MainSidebar";
import MobileSidebarButton from "src/components/buttons/MobileSidebarButton";
import MyPagination from "src/components/pagination/Pagination";
import PageFilter from "src/components/helpers/filters/PageFilter";
import PageSorting from "src/components/helpers/sorting/PageSorting";
import PageTable from "src/components/tables/PageTable";
import PageTableSkeleton from "src/components/skeletons/PageTableSkeleton";
import SiteFooter from "src/components/layouts/Footer";
import UpgradeErrorAlert from "src/components/alerts/UpgradeErrorAlert";

// Helpers
import { removeURLParameter } from "src/helpers/functions";

const PageSection = styled.section`
	@media only screen and (max-width: 1600px) {
		.min-width-adjust {
			min-width: 15rem;
		}
	}
`;

const Pages = ({ width, result }) => {
	const [linksPerPage, setLinksPerPage] = React.useState(20);
	const [loadQueryString, setLoadQueryString] = React.useState("");
	const [openMobileSidebar, setOpenMobileSidebar] = React.useState(false);
	const [pagePath, setPagePath] = React.useState("");
	const [searchKey, setSearchKey] = React.useState("");

	const { asPath } = useRouter();
	const router = useRouter();

	let pageTitle = "";
	let homeLabel = "Home";
	let homePageLink = `/site/${result.siteId}/overview`;

	let scanApiEndpoint = "";
	let queryString = "";

	const { user } = useUser({
		redirectIfFound: false,
		redirectTo: "/login"
	});

	const { selectedSiteRef, handleCrawl, scanResult, scanObjId, isCrawlStarted, isCrawlFinished } = useCrawl({
		siteId: result.siteId
	});

	const { siteId } = useSiteId({
		querySid: result.siteId
	});

	siteId ? (pageTitle = siteId?.name ? PagesLabel[1].label + " - " + siteId?.name : PagesLabel[1].label) : null;

	user?.permissions.includes("can_see_pages") &&
	user?.permissions.includes("can_see_scripts") &&
	user?.permissions.includes("can_see_stylesheets") &&
	user?.permissions.includes("can_start_scan")
		? (() => {
				scanApiEndpoint =
					result.page !== undefined
						? `/api/site/${result.siteId}/scan/${scanObjId}/page/?per_page=` + linksPerPage + `&page=` + result.page
						: `/api/site/${result.siteId}/scan/${scanObjId}/page/?per_page=` + linksPerPage;

				queryString +=
					result.size_total_min !== undefined
						? scanApiEndpoint.includes("?")
							? `&size_total_min=1048576`
							: `?size_total_min=1048576`
						: "";

				queryString +=
					result.size_total_max !== undefined
						? scanApiEndpoint.includes("?")
							? `&size_total_max=1048575`
							: `?size_total_max=1048575`
						: "";

				queryString +=
					result.tls_total !== undefined
						? result.tls_total === "true"
							? scanApiEndpoint.includes("?")
								? `&tls_total=true`
								: `?tls_total=true`
							: scanApiEndpoint.includes("?")
							? `&tls_total=false`
							: `?tls_total=false`
						: "";

				queryString +=
					result.search !== undefined
						? scanApiEndpoint.includes("?")
							? `&search=${result.search}`
							: `?search=${result.search}`
						: "";

				queryString +=
					result.ordering !== undefined
						? scanApiEndpoint.includes("?")
							? `&ordering=${result.ordering}`
							: `?ordering=${result.ordering}`
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
		endpoint: scanApiEndpoint,
		querySid: result.siteId,
		scanObjId: scanObjId
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

		if (result.search !== undefined) setSearchKey(result.search);

		if (result.per_page !== undefined) setLinksPerPage(result.per_page);
	}, []);

	return user ? (
		<Layout user={user}>
			<NextSeo title={pageTitle} />

			<PageSection tw="h-screen flex overflow-hidden bg-white">
				<MainSidebar
					width={width}
					user={user}
					openMobileSidebar={openMobileSidebar}
					setOpenMobileSidebar={setOpenMobileSidebar}
				/>

				{siteId ? (
					siteId?.verified ? (
						<div ref={selectedSiteRef} tw="flex flex-col w-0 flex-1 overflow-hidden">
							<div tw="relative flex-shrink-0 flex bg-white lg:mb-4">
								<div tw="border-b flex-shrink-0 flex">
									<MobileSidebarButton
										openMobileSidebar={openMobileSidebar}
										setOpenMobileSidebar={setOpenMobileSidebar}
									/>
								</div>

								<LinkOptions
									verified={siteId?.verified}
									sid={result.siteId}
									user={user}
									scanResult={scanResult}
									searchKey={searchKey}
									onSearchEvent={handleSearch}
									handleCrawl={handleCrawl}
									isCrawlStarted={isCrawlStarted}
									isCrawlFinished={isCrawlFinished}
								/>
							</div>

							<main tw="flex-1 relative overflow-y-auto focus:outline-none" tabIndex="0">
								<div tw="w-full p-6 mx-auto">
									<div className="max-w-full py-4 px-8">
										<nav tw="flex pt-4 pb-8" aria-label="Breadcrumb">
											<ol tw="flex items-center space-x-4">
												<li>
													<div>
														<Link href={homePageLink} passHref>
															<a tw="text-gray-400 hover:text-gray-500">
																<HomeIcon tw="flex-shrink-0 h-5 w-5" />
																<span tw="sr-only">{homeLabel}</span>
															</a>
														</Link>
													</div>
												</li>
												<li>
													<div tw="flex items-center">
														<ChevronRightIcon tw="flex-shrink-0 h-5 w-5 text-gray-400" />
														<p aria-current="page" tw="cursor-default ml-4 text-sm font-medium text-gray-700">
															{pageTitle}
														</p>
													</div>
												</li>
											</ol>
										</nav>
										<div className="pt-4 m-auto">
											<h4 className="flex items-center text-2xl leading-6 font-medium text-gray-900">
												{pageTitle}
												{user?.permissions.includes("can_see_pages") &&
												user?.permissions.includes("can_see_scripts") &&
												user?.permissions.includes("can_see_stylesheets") &&
												user?.permissions.includes("can_start_scan") ? (
													pages ? (
														<dl tw="inline-flex flex-col mb-2 lg:mb-0 lg:ml-5 sm:flex-row sm:flex-wrap">
															<dd tw="flex items-center text-base leading-5 text-gray-500 font-medium sm:mr-6">
																<DocumentTextIcon tw="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
																{pages?.count > 1
																	? pages?.count + " " + PagesLabel[2].label
																	: pages?.count == 1
																	? pages?.count + " " + PagesLabel[6].label
																	: PagesLabel[3].label}
															</dd>
														</dl>
													) : (
														<dl tw="inline-flex flex-col mb-2 lg:mb-0 lg:ml-5 sm:flex-row sm:flex-wrap">
															<dd tw="flex items-center text-base leading-5 text-gray-500 font-medium sm:mr-6">
																<DocumentTextIcon tw="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
																{PagesLabel[17].label}
															</dd>
														</dl>
													)
												) : null}
											</h4>
										</div>
									</div>
								</div>
								<div tw="max-w-full px-4 py-4 sm:px-6 md:px-8">
									{user?.permissions.includes("can_see_pages") &&
									user?.permissions.includes("can_see_scripts") &&
									user?.permissions.includes("can_see_stylesheets") &&
									user?.permissions.includes("can_start_scan") ? (
										<PageFilter
											result={result}
											loadQueryString={loadQueryString}
											setLoadQueryString={setLoadQueryString}
											mutatePages={mutatePages}
											setPagePath={setPagePath}
										/>
									) : null}

									<div tw="pb-4">
										<div tw="flex flex-col">
											<div tw="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
												<div tw="align-middle inline-block min-w-full overflow-hidden rounded-lg border-gray-300">
													<table tw="relative min-w-full">
														<thead>
															<tr>
																{LinksPagesContent.map((site, key) => {
																	return (
																		<React.Fragment key={key}>
																			<th
																				className="min-width-adjust"
																				tw="px-6 py-3 border-b border-gray-300 bg-white text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
																			>
																				<span tw="flex items-center justify-start">
																					{user?.permissions.includes("can_see_pages") &&
																					user?.permissions.includes("can_see_scripts") &&
																					user?.permissions.includes("can_see_stylesheets") &&
																					user?.permissions.includes("can_start_scan") ? (
																						site.slug ? (
																							<PageSorting
																								result={result}
																								slug={site.slug}
																								mutatePages={mutatePages}
																								linksPagesContent={LinksPagesContent}
																								setPagePath={setPagePath}
																							/>
																						) : null
																					) : null}
																					<span className="label" tw="flex items-center">
																						{site.label}
																					</span>
																				</span>
																			</th>
																		</React.Fragment>
																	);
																})}
															</tr>
														</thead>
														<tbody tw="relative">
															{user?.permissions.includes("can_see_pages") &&
															user?.permissions.includes("can_see_scripts") &&
															user?.permissions.includes("can_see_stylesheets") &&
															user?.permissions.includes("can_start_scan")
																? pages
																	? pages?.results.map((val, key) => (
																			<PageTable key={key} siteId={result.siteId} val={val} />
																	  ))
																	: null
																: null}
														</tbody>
													</table>

													{!user?.permissions
														? (() => {
																<>
																	<PageTableSkeleton />
																	<UpgradeErrorAlert link="/settings/subscription-plans" />
																</>;
														  })()
														: null}
												</div>
											</div>
										</div>
									</div>

									{user?.permissions.includes("can_see_pages") &&
									user?.permissions.includes("can_see_scripts") &&
									user?.permissions.includes("can_see_stylesheets") &&
									user?.permissions.includes("can_start_scan") ? (
										pages ? (
											<MyPagination
												href="/site/[siteId]/seo"
												pathName={pagePath}
												apiEndpoint={scanApiEndpoint}
												page={result.page ? result.page : 0}
												linksPerPage={linksPerPage}
												onItemsPerPageChange={onItemsPerPageChange}
											/>
										) : null
									) : null}
								</div>

								<div tw="static bottom-0 w-full mx-auto px-12 py-4">
									<SiteFooter />
								</div>
							</main>
						</div>
					) : (
						<div tw="mx-auto">
							<section tw="flex flex-col justify-center min-h-screen">
								<div tw="px-4 py-5 sm:p-6 flex items-center justify-center">
									<h3 tw="text-lg leading-6 font-medium text-gray-500">{PagesLabel[16].label}</h3>
								</div>
							</section>
						</div>
					)
				) : (
					<div tw="mx-auto">
						<Loader />
					</div>
				)}
			</PageSection>
		</Layout>
	) : (
		<Loader />
	);
};

Pages.propTypes = {};

export default withResizeDetector(Pages);

export async function getServerSideProps(ctx) {
	return {
		props: {
			result: ctx.query
		}
	};
}

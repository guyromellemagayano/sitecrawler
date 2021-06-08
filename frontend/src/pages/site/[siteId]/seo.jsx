// React
import * as React from "react";

// NextJS
import Link from "next/link";
import { useRouter } from "next/router";

// External
import { ChevronRightIcon, HomeIcon, SearchIcon } from "@heroicons/react/solid";
import { NextSeo } from "next-seo";
import { styled } from "twin.macro";
import { withResizeDetector } from "react-resize-detector";
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
import LinkOptions from "src/components/pages/overview/LinkOptions";
import Loader from "src/components/layouts/Loader";
import MainSidebar from "src/components/sidebar/MainSidebar";
import MobileSidebarButton from "src/components/buttons/MobileSidebarButton";
import MyPagination from "src/components/pagination/Pagination";
import SeoFilter from "src/components/helpers/filters/SeoFilter";
import SeoSorting from "src/components/helpers/sorting/SeoSorting";
import SeoTable from "src/components/tables/SeoTable";
import SeoTableSkeleton from "src/components/skeletons/SeoTableSkeleton";
import SiteFooter from "src/components/layouts/Footer";
import UpgradeErrorAlert from "src/components/alerts/UpgradeErrorAlert";

// Helpers
import { removeURLParameter } from "src/helpers/functions";

const SeoSection = styled.section`
	@media only screen and (max-width: 1600px) {
		.min-width-adjust {
			min-width: 15rem;
		}
	}
`;

const Seo = ({ width, result }) => {
	const [disableLocalTime, setDisableLocalTime] = React.useState(false);
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
	let hasTitleString = "";
	let hasDescriptionString = "";
	let hasH1FirstString = "";
	let hasH2FirstString = "";

	const { user: user } = useUser({
		redirectIfFound: false,
		redirectTo: "/login"
	});

	const { selectedSiteRef, handleCrawl, scanResult, scanObjId, isCrawlStarted, isCrawlFinished } = useCrawl({
		siteId: result.siteId
	});

	const { siteId } = useSiteId({
		querySid: result.siteId
	});

	siteId ? (pageTitle = siteId?.name ? SeoLabel[1].label + " - " + siteId?.name : SeoLabel[1].label) : null;

	user?.permissions.includes("can_see_pages") &&
	user?.permissions.includes("can_see_scripts") &&
	user?.permissions.includes("can_see_stylesheets") &&
	user?.permissions.includes("can_start_scan")
		? (() => {
				scanApiEndpoint =
					result.page !== undefined
						? `/api/site/${result.siteId}/scan/${scanObjId}/page/?per_page=` + linksPerPage + `&page=` + result.page
						: `/api/site/${result.siteId}/scan/${scanObjId}/page/?per_page=` + linksPerPage;

				hasTitleString = Array.isArray(result.has_title) ? result.has_title.join("&has_title=") : result.has_title;

				queryString +=
					result.has_title !== undefined
						? scanApiEndpoint.includes("?")
							? `&has_title=${hasTitleString}`
							: `?has_title=${hasTitleString}`
						: "";

				hasDescriptionString = Array.isArray(result.has_description)
					? result.has_description.join("&has_description=")
					: result.has_description;

				queryString +=
					result.has_description !== undefined
						? scanApiEndpoint.includes("?")
							? `&has_description=${hasDescriptionString}`
							: `?has_description=${hasDescriptionString}`
						: "";

				hasH1FirstString = Array.isArray(result.has_h1_first)
					? result.has_h1_first.join("&has_h1_first=")
					: result.has_h1_first;

				queryString +=
					result.has_h1_first !== undefined
						? scanApiEndpoint.includes("?")
							? `&has_h1_first=${hasH1FirstString}`
							: `?has_h1_first=${hasH1FirstString}`
						: "";

				queryString +=
					result.has_h1_second !== undefined
						? scanApiEndpoint.includes("?")
							? `&has_h1_second=false`
							: `?has_h1_second=false`
						: "";

				hasH2FirstString = Array.isArray(result.has_h2_first)
					? result.has_h2_first.join("&has_h2_first=")
					: result.has_h2_first;

				queryString +=
					result.has_h2_first !== undefined
						? scanApiEndpoint.includes("?")
							? `&has_h2_first=${hasH2FirstString}`
							: `?has_h2_first=${hasH2FirstString}`
						: "";

				queryString +=
					result.has_h2_second !== undefined
						? scanApiEndpoint.includes("?")
							? `&has_h2_second=false`
							: `?has_h2_second=false`
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

	React.useEffect(() => {
		user?.settings?.disableLocalTime ? setDisableLocalTime(true) : setDisableLocalTime(false) ?? null;
	}, [user]);

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

			<SeoSection tw="h-screen flex overflow-hidden bg-white">
				<MainSidebar
					width={width}
					user={user}
					openMobileSidebar={openMobileSidebar}
					setOpenMobileSidebar={setOpenMobileSidebar}
				/>

				{siteId ? (
					siteId.verified ? (
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
																<SearchIcon tw="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
																{pages?.count > 1
																	? pages?.count + " " + SeoLabel[2].label
																	: pages?.count == 1
																	? pages?.count + " " + SeoLabel[6].label
																	: SeoLabel[3].label}
															</dd>
														</dl>
													) : (
														<dl tw="inline-flex flex-col mb-2 lg:mb-0 lg:ml-5 sm:flex-row sm:flex-wrap">
															<dd tw="flex items-center text-base leading-5 text-gray-500 font-medium sm:mr-6">
																<SearchIcon tw="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
																{SeoLabel[7].label}
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
									user?.permissions.includes("can_see_stylesheets") ? (
										<SeoFilter
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
																{SeoTableContent.map((site, key) => {
																	return (
																		<React.Fragment key={key}>
																			<th
																				className="min-width-adjust"
																				tw="px-6 py-3 border-b border-gray-300 bg-white text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
																			>
																				<span tw="flex items-center justify-start">
																					{user?.permissions.includes("can_see_pages") ? (
																						site?.slug ? (
																							<SeoSorting
																								result={result}
																								slug={site.slug}
																								mutatePages={mutatePages}
																								seoTableContent={SeoTableContent}
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
																			<SeoTable
																				key={key}
																				siteId={result.siteId}
																				val={val}
																				disableLocalTime={disableLocalTime}
																			/>
																	  ))
																	: null
																: null}
														</tbody>
													</table>

													{!user?.permissions
														? (() => {
																<>
																	<SeoTableSkeleton />
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
									user?.permissions.includes("can_see_stylesheets") ? (
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
									<h3 tw="text-lg leading-6 font-medium text-gray-500">{SeoLabel[19].label}</h3>
								</div>
							</section>
						</div>
					)
				) : (
					<div tw="mx-auto">
						<Loader />
					</div>
				)}
			</SeoSection>
		</Layout>
	) : (
		<Loader />
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

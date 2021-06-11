// React
import * as React from "react";

// NextJS
import Link from "next/link";
import { useRouter } from "next/router";

// External
import { ChevronRightIcon, HomeIcon, SearchIcon } from "@heroicons/react/solid";
import { LinkIcon } from "@heroicons/react/outline";
import { NextSeo } from "next-seo";
import { styled } from "twin.macro";
import { withResizeDetector } from "react-resize-detector";
import PropTypes from "prop-types";

// JSON
import LinksLabel from "public/labels/pages/site/links.json";
import LinksUrlContent from "public/data/links-url.json";

// Hooks
import { useLinks, useSiteId } from "src/hooks/useSite";
import useCrawl from "src/hooks/useCrawl";
import useUser from "src/hooks/useUser";

// Layout
import Layout from "src/components/Layout";

// Components
import LinkFilter from "src/components/helpers/filters/LinkFilter";
import LinkOptions from "src/components/pages/overview/LinkOptions";
import LinkSorting from "src/components/helpers/sorting/LinkSorting";
import LinkTable from "src/components/tables/LinkTable";
import Loader from "src/components/layouts/Loader";
import MainSidebar from "src/components/sidebar/MainSidebar";
import MobileSidebarButton from "src/components/buttons/MobileSidebarButton";
import MyPagination from "src/components/pagination/Pagination";
import SiteFooter from "src/components/layouts/Footer";

// Helpers
import { removeURLParameter } from "src/helpers/functions";

const LinksSection = styled.section`
	@media only screen and (max-width: 1400px) {
		td:first-child {
			max-width: 15rem;
		}
	}

	@media only screen and (min-width: 1600px) {
		td {
			min-width: 10rem;

			&:first-child {
				max-width: 25rem;
			}
		}

		.min-width-adjust {
			min-width: 15rem;
		}
	}
`;

const Links = ({ width, result }) => {
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
	let statusString = "";
	let typeString = "";

	const { user: user } = useUser({
		redirectIfFound: false,
		redirectTo: "/login"
	});

	const { selectedSiteRef, handleCrawl, scanResult, scanObjId, isCrawlStarted, isCrawlFinished } = useCrawl({
		siteId: result.siteId
	});

	const { siteId: siteId } = useSiteId({
		querySid: result.siteId
	});

	siteId ? (pageTitle = siteId?.name ? LinksLabel[1].label + " - " + siteId?.name : LinksLabel[1].label) : null;

	scanApiEndpoint =
		result.page !== undefined
			? `/api/site/${result.siteId}/scan/${scanObjId}/link/?per_page=` + linksPerPage + `&page=` + result.page
			: `/api/site/${result.siteId}/scan/${scanObjId}/link/?per_page=` + linksPerPage;

	statusString = Array.isArray(result.status) ? result.status.join("&status=") : result.status;

	queryString +=
		result.status !== undefined
			? scanApiEndpoint.includes("?")
				? `&status=${statusString}`
				: `?status=${statusString}`
			: "";

	typeString = Array.isArray(result.type) ? result.type.join("&type=") : result.type;

	queryString +=
		result.type !== undefined ? (scanApiEndpoint.includes("?") ? `&type=${typeString}` : `?type=${typeString}`) : "";

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

	const { links, mutateLinks } = useLinks({
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
		mutateLinks;
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
			mutateLinks;
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

			<LinksSection tw="h-screen flex overflow-hidden bg-white">
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
												{links ? (
													<dl tw="inline-flex flex-col mb-2 lg:mb-0 lg:ml-5 sm:flex-row sm:flex-wrap">
														<dd tw="flex items-center text-base leading-5 text-gray-500 font-medium sm:mr-6">
															<LinkIcon tw="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
															{links?.count > 1
																? links?.count + " " + LinksLabel[2].label
																: links?.count == 1
																? links?.count + " " + LinksLabel[11].label
																: LinksLabel[3].label}
														</dd>
													</dl>
												) : (
													<dl tw="inline-flex flex-col mb-2 lg:mb-0 lg:ml-5 sm:flex-row sm:flex-wrap">
														<dd tw="flex items-center text-base leading-5 text-gray-500 font-medium sm:mr-6">
															<SearchIcon tw="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
															{LinksLabel[12].label}
														</dd>
													</dl>
												)}
											</h4>
										</div>
									</div>
								</div>
								<div tw="max-w-full px-4 py-4 sm:px-6 md:px-8">
									<LinkFilter
										result={result}
										loadQueryString={loadQueryString}
										setLoadQueryString={setLoadQueryString}
										mutateLinks={mutateLinks}
										setPagePath={setPagePath}
									/>

									<div tw="pb-4">
										<div tw="flex flex-col">
											<div tw="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
												<div tw="align-middle inline-block min-w-full overflow-hidden rounded-lg border-gray-300">
													<table tw="relative min-w-full">
														<thead>
															<tr>
																{LinksUrlContent.map((site, key) => {
																	return (
																		<React.Fragment key={key}>
																			<th
																				className="min-width-adjust"
																				tw="px-6 py-3 border-b border-gray-300 bg-white text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
																			>
																				<div tw="flex items-center justify-start">
																					{site?.slug ? (
																						<LinkSorting
																							result={result}
																							slug={site.slug}
																							mutateLinks={mutateLinks}
																							linksUrlContent={LinksUrlContent}
																							setPagePath={setPagePath}
																						/>
																					) : null}
																					<span className="label" tw="flex items-center">
																						{site.label}
																					</span>
																				</div>
																			</th>
																		</React.Fragment>
																	);
																})}
															</tr>
														</thead>
														<tbody tw="relative">
															{links
																? links?.results.map((val, key) => (
																		<LinkTable key={key} siteId={result.siteId} val={val} />
																  ))
																: null}
														</tbody>
													</table>
												</div>
											</div>
										</div>
									</div>

									<MyPagination
										href="/site/[siteId]/links/"
										pathName={pagePath}
										apiEndpoint={scanApiEndpoint}
										page={result.page ? result.page : 0}
										linksPerPage={linksPerPage}
										onItemsPerPageChange={onItemsPerPageChange}
									/>
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
									<h3 tw="text-lg leading-6 font-medium text-gray-500">{LinksLabel[13].label}</h3>
								</div>
							</section>
						</div>
					)
				) : (
					<div tw="mx-auto">
						<Loader />
					</div>
				)}
			</LinksSection>
		</Layout>
	) : (
		<Loader />
	);
};

Links.propTypes = {};

export default withResizeDetector(Links);

export async function getServerSideProps(ctx) {
	return {
		props: {
			result: ctx.query
		}
	};
}

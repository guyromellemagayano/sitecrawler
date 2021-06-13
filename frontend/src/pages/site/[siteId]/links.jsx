// React
import * as React from "react";

// NextJS
import { useRouter } from "next/router";

// External
import { NextSeo } from "next-seo";
import { styled } from "twin.macro";
import { withResizeDetector } from "react-resize-detector";
import loadable from "@loadable/component";
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
import MainSidebar from "src/components/sidebar/MainSidebar";
import MobileSidebarButton from "src/components/buttons/MobileSidebarButton";
import SiteFooter from "src/components/layouts/Footer";

// Loadable
const Breadcrumbs = loadable(() => import("src/components/breadcrumbs/Breadcrumbs"));
const HeadingOptions = loadable(() => import("src/components/headings/HeadingOptions"));
const LinkFilter = loadable(() => import("src/components/helpers/filters/LinkFilter"));
const LinkOptions = loadable(() => import("src/components/pages/overview/LinkOptions"));
const LinkSorting = loadable(() => import("src/components/helpers/sorting/LinkSorting"));
const LinkTable = loadable(() => import("src/components/tables/LinkTable"));
const Loader = loadable(() => import("src/components/layouts/Loader"));
const MyPagination = loadable(() => import("src/components/pagination/Pagination"));

// Helpers
import { removeURLParameter } from "src/helpers/functions";

const LinksSection = styled.section`
	@media only screen and (max-width: 1600px) {
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

	const pageTitle = LinksLabel[1].label + " - " + siteId?.name;

	let scanApiEndpoint = "";
	let queryString = "";
	let statusString = "";
	let typeString = "";

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
					<div ref={selectedSiteRef} tw="flex flex-col w-0 flex-1 overflow-hidden">
						<div tw="relative flex-shrink-0 flex bg-white">
							<div tw="border-b flex-shrink-0 flex">
								<MobileSidebarButton
									openMobileSidebar={openMobileSidebar}
									setOpenMobileSidebar={setOpenMobileSidebar}
								/>
							</div>

							<LinkOptions
								permissions={user?.permissions}
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
								<div className="max-w-full p-4">
									<Breadcrumbs siteId={result.siteId} pageTitle={LinksLabel[1].label} />

									<HeadingOptions
										isLinks
										siteId={result.siteId}
										siteName={siteId?.name}
										siteUrl={siteId?.url}
										scanObjId={scanObjId}
										permissions={user?.permissions}
										pageTitle={LinksLabel[1].label}
										count={links?.count}
										dataLabel={[LinksLabel[2].label, LinksLabel[11].label, LinksLabel[3].label, LinksLabel[12].label]}
									/>
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
																	<th
																		key={key}
																		className="min-width-adjust"
																		tw="px-6 py-3 border-b border-gray-300 bg-white text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
																	>
																		<div tw="flex items-center justify-start">
																			{site?.slug ? (
																				<LinkSorting
																					result={result}
																					slug={site?.slug}
																					mutateLinks={mutateLinks}
																					linksUrlContent={LinksUrlContent}
																					setPagePath={setPagePath}
																				/>
																			) : null}
																			<span className="label" tw="flex items-center">
																				{site?.label}
																			</span>
																		</div>
																	</th>
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

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
import ImagesLabel from "public/labels/pages/site/images.json";
import ImageTableContent from "public/data/image-table.json";

// Hooks
import { useImages, useSiteId } from "src/hooks/useSite";
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
const ImageFilter = loadable(() => import("src/components/helpers/filters/ImageFilter"));
const ImageSorting = loadable(() => import("src/components/helpers/sorting/ImageSorting"));
const ImageTable = loadable(() => import("src/components/tables/ImageTable"));
const ImageTableSkeleton = loadable(() => import("src/components/skeletons/ImageTableSkeleton"));
const LinkOptions = loadable(() => import("src/components/pages/overview/LinkOptions"));
const Loader = loadable(() => import("src/components/layouts/Loader"));
const MyPagination = loadable(() => import("src/components/pagination/Pagination"));
const UpgradeErrorAlert = loadable(() => import("src/components/alerts/UpgradeErrorAlert"));

// Helpers
import { removeURLParameter } from "src/helpers/functions";

const Images = ({ width, result }) => {
	const [componentReady, setComponentReady] = React.useState(false);
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

	const { selectedSiteRef, handleCrawl, currentScan, previousScan, scanCount, isCrawlStarted, isCrawlFinished } =
		useCrawl({
			siteId: result?.siteId
		});

	const { siteId } = useSiteId({
		querySid: result?.siteId
	});

	React.useEffect(() => {
		currentScan !== undefined ? setScanObjId(currentScan?.id) : setScanObjId(previousScan?.id);
	}, [currentScan, previousScan]);

	const pageTitle = ImagesLabel[1].label + " - " + siteId?.name;

	let scanApiEndpoint = "";
	let queryString = "";
	let statusString = "";
	let tlsStatusString = "";
	let missingAltsString = "";

	user?.permissions.includes("can_see_images")
		? (() => {
				scanApiEndpoint = `/api/site/${result?.siteId}/scan/${scanObjId}/image/?per_page=` + linksPerPage;

				queryString +=
					result?.page !== undefined
						? scanApiEndpoint.includes("?")
							? `&page=${result?.page}`
							: `?page=${result?.page}`
						: "";

				statusString = result?.status__neq;

				queryString +=
					result?.status__neq !== undefined
						? scanApiEndpoint.includes("?")
							? `&status__neq=${statusString}`
							: `?status__neq=${statusString}`
						: "";

				tlsStatusString = result?.tls_status__neq;

				queryString +=
					result?.tls_status__neq !== undefined
						? scanApiEndpoint.includes("?")
							? `&tls_status__neq=${tlsStatusString}`
							: `?tls_status__neq=${tlsStatusString}`
						: "";

				missingAltsString = result?.missing_alts__gt;

				queryString +=
					result?.missing_alts__gt !== undefined
						? scanApiEndpoint.includes("?")
							? `&missing_alts__gt=${missingAltsString}`
							: `?missing_alts__gt=${missingAltsString}`
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
					loadQueryString.toString() !== "" &&
					loadQueryString.toString() !== undefined &&
					result?.status__neq == undefined &&
					result?.tls_status__neq == undefined &&
					result?.missing_alts__gt == undefined &&
					result?.type == undefined
						? scanApiEndpoint.includes("?")
							? window.location.search.replace("?", "&")
							: window.location.search
						: "";

				scanApiEndpoint += queryString;
		  })()
		: null;

	const { images, mutateImages } = useImages({
		endpoint: scanApiEndpoint,
		querySid: result?.siteId,
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
		mutateImages;
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
			mutateImages;
		}
	};

	React.useEffect(() => {
		if (removeURLParameter(asPath, "page").includes("?")) setPagePath(`${removeURLParameter(asPath, "page")}&`);
		else setPagePath(`${removeURLParameter(asPath, "page")}?`);

		if (result?.search !== undefined) setSearchKey(result?.search);

		if (result?.per_page !== undefined) setLinksPerPage(result?.per_page);
	}, [result]);

	React.useEffect(() => {
		user !== undefined && siteId !== undefined
			? (() => {
					setTimeout(() => {
						setComponentReady(true);
					}, 500);
			  })()
			: null;

		return setComponentReady(false);
	}, [user, siteId]);

	return (
		<Layout user={componentReady ? user : null}>
			<NextSeo title={componentReady ? pageTitle : null} />

			<section tw="h-screen flex overflow-hidden bg-white">
				<MainSidebar
					width={width}
					user={componentReady ? user : null}
					openMobileSidebar={openMobileSidebar}
					setOpenMobileSidebar={setOpenMobileSidebar}
				/>

				{componentReady ? (
					<div ref={selectedSiteRef} tw="flex flex-col w-0 flex-1 overflow-hidden">
						<div tw="relative flex-shrink-0 flex bg-white">
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
							<main tw="flex-1 relative overflow-y-auto focus:outline-none" tabIndex="0">
								<div tw="w-full p-6 mx-auto">
									<div className="max-w-full p-4">
										<Breadcrumbs siteId={result?.siteId} pageTitle={ImagesLabel[1].label} />

										<HeadingOptions
											isImages
											queryString={queryString}
											siteId={result?.siteId}
											siteName={siteId?.name}
											siteUrl={siteId?.url}
											scanObjId={scanObjId}
											permissions={user?.permissions}
											pageTitle={ImagesLabel[1].label}
											count={images?.count}
											dataLabel={[
												ImagesLabel[2].label,
												ImagesLabel[14].label,
												ImagesLabel[3].label,
												ImagesLabel[13].label
											]}
										/>
									</div>
								</div>
								<div tw="max-w-full px-4 py-4 sm:px-6 md:px-8">
									{user?.permissions.includes("can_see_images") ? (
										<ImageFilter
											result={result}
											loadQueryString={loadQueryString}
											setLoadQueryString={setLoadQueryString}
											mutateImages={mutateImages}
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
																{ImageTableContent.map((site, key) => {
																	return (
																		<th
																			key={key}
																			className="min-width-adjust"
																			tw="px-6 py-3 border-b border-gray-200 bg-white text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
																		>
																			<span tw="flex items-center justify-start">
																				{user?.permissions.includes("can_see_images") ? (
																					site?.slug ? (
																						<ImageSorting
																							result={result}
																							slug={site?.slug}
																							mutateImages={mutateImages}
																							imageTableContent={ImageTableContent}
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
															{user?.permissions.includes("can_see_images") ? (
																images ? (
																	images?.results.map((val, key) => (
																		<ImageTable key={key} siteId={result?.siteId} val={val} />
																	))
																) : null
															) : (
																<ImageTableSkeleton />
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

									{user?.permissions.includes("can_see_images") ? (
										images ? (
											<MyPagination
												href="/site/[siteId]/images/"
												pathName={pagePath}
												apiEndpoint={scanApiEndpoint}
												page={result?.page ? result?.page : 0}
												linksPerPage={linksPerPage}
												onItemsPerPageChange={onItemsPerPageChange}
											/>
										) : null
									) : null}

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

Images.propTypes = {};

export default withResizeDetector(Images);

export async function getServerSideProps(ctx) {
	return {
		props: {
			result: ctx.query
		}
	};
}

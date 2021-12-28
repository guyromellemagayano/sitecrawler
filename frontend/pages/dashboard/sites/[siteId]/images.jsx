// React
import UpgradeErrorAlert from "@components/alerts/UpgradeErrorAlert";
// Components
import Breadcrumbs from "@components/breadcrumbs";
import MobileSidebarButton from "@components/buttons/MobileSidebarButton";
import { Layout } from "@components/layouts";
import Footer from "@components/layouts/Footer";
import Sidebar from "@components/layouts/Sidebar";
import HeadingOptions from "@components/options/HeadingOptions";
import LinkOptions from "@components/options/LinkOptions";
import DataPagination from "@components/pagination";
import ImageTableSkeleton from "@components/skeletons/ImageTableSkeleton";
import ImageSorting from "@components/sorting/ImageSorting";
import ImageTable from "@components/tables/ImageTable";
import { SitesApiEndpoint } from "@enums/ApiEndpoints";
// Enums
import { ImagesLabels } from "@enums/ImagesLabels";
import { ImagesTableLabels } from "@enums/ImagesTableLabels";
// Hooks
import { LoginLink, SitesLink, SubscriptionPlansLink } from "@enums/PageLinks";
import { useComponentVisible } from "@hooks/useComponentVisible";
import useCrawl from "@hooks/useCrawl";
import { useImages, useSiteId } from "@hooks/useSite";
import useUser from "@hooks/useUser";
// Utils
import { removeURLParameter } from "@utils/functions";
import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
// NextJS
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
// External
import "twin.macro";

// Dynamic
const ImageFilter = dynamic(() => import("@components/filters/ImageFilter"), { ssr: true });

const Images = ({ result }) => {
	const [componentReady, setComponentReady] = useState(false);
	const [enableSiteIdHook, setEnableSiteIdHook] = useState(false);
	const [linksPerPage, setLinksPerPage] = useState(20);
	const [pagePath, setPagePath] = useState("");
	const [scanObjId, setScanObjId] = useState(null);
	const [searchKey, setSearchKey] = useState("");

	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
	const { asPath } = useRouter();
	const router = useRouter();

	const { user } = useUser({
		redirectIfFound: false,
		redirectTo: LoginLink
	});

	useEffect(() => {
		return user ? setEnableSiteIdHook(true) : setEnableSiteIdHook(false);
	}, [user, enableSiteIdHook]);

	const { selectedSiteRef, handleCrawl, currentScan, previousScan, isCrawlStarted, isCrawlFinished } = useCrawl({
		siteId: enableSiteIdHook ? parseInt(result?.siteId) : null
	});

	const { siteId } = useSiteId({
		querySid: enableSiteIdHook ? parseInt(result?.siteId) : null,
		redirectIfFound: false,
		redirectTo: enableSiteIdHook ? SitesLink : null
	});

	useEffect(() => {
		currentScan ? setScanObjId(currentScan?.id) : setScanObjId(previousScan?.id);

		return scanObjId;
	}, [currentScan, previousScan]);

	const pageTitle = ImagesLabels[1].label + " - " + siteId?.name;

	let scanApiEndpoint = "";
	let queryString = "";
	let statusString = "";
	let tlsStatusString = "";
	let missingAltsString = "";
	let filterQueryString = "";

	if (typeof window !== "undefined") {
		filterQueryString = new URLSearchParams(window.location.search);
	}

	user?.permissions.includes("can_see_images")
		? (() => {
				scanApiEndpoint =
					`${SitesApiEndpoint + parseInt(result?.siteId)}/scan/${scanObjId}/image/?per_page=` + linksPerPage;

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
					filterQueryString.toString() !== "" &&
					filterQueryString.toString() !== undefined
						? scanApiEndpoint.includes("?")
							? window.location.search.replace("?", "&")
							: window.location.search
						: "";

				scanApiEndpoint += queryString;
		  })()
		: null;

	const { images, mutateImages } = useImages({
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

		mutateImages(scanApiEndpoint);
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

			mutateImages(scanApiEndpoint);
		}
	};

	useEffect(() => {
		if (removeURLParameter(asPath, "page").includes("?")) setPagePath(`${removeURLParameter(asPath, "page")}&`);
		else setPagePath(`${removeURLParameter(asPath, "page")}?`);

		if (result?.search !== undefined) setSearchKey(result?.search);

		if (result?.per_page !== undefined) setLinksPerPage(result?.per_page);
	}, [result]);

	useEffect(() => {
		user && siteId && images ? setComponentReady(true) : setComponentReady(false);

		return { user, siteId, images };
	}, [user, siteId, images]);

	return (
		<Layout user={user}>
			<NextSeo title={pageTitle} />

			<section tw="h-screen flex overflow-hidden bg-white">
				<Sidebar ref={ref} user={user} openSidebar={isComponentVisible} setOpenSidebar={setIsComponentVisible} />

				<div ref={selectedSiteRef} tw=" min-h-screen">
					<div tw="relative flex-shrink-0 flex">
						<div tw="border-b flex-shrink-0 flex">
							<MobileSidebarButton openSidebar={isComponentVisible} setOpenSidebar={setIsComponentVisible} />
						</div>

						<LinkOptions permissions={user?.permissions} searchKey={searchKey} onSearchEvent={handleSearch} />
					</div>

					<Scrollbars universal>
						<main tw="absolute w-full h-full mx-auto left-0 right-0">
							<div tw="flex flex-col h-full p-6 mx-auto">
								<div tw="flex-none p-4">
									<Breadcrumbs siteId={parseInt(result?.siteId)} pageTitle={ImagesLabels[1].label} />

									<HeadingOptions
										componentReady={componentReady}
										count={images?.count}
										dataLabel={[ImagesLabels[2].label, ImagesLabels[14].label, ImagesLabels[3].label]}
										handleCrawl={handleCrawl}
										isCrawlFinished={isCrawlFinished}
										isCrawlStarted={isCrawlStarted}
										isImages
										pageTitle={ImagesLabels[1].label}
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
									{user?.permissions.includes("can_see_images") ? (
										<ImageFilter
											filterQueryString={filterQueryString}
											scanApiEndpoint={scanApiEndpoint}
											setPagePath={setPagePath}
										/>
									) : null}

									{images?.results !== undefined && images?.results.length !== 0 && (
										<div tw="pb-4">
											<div tw="flex flex-col">
												<div tw="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
													<div tw="min-w-full h-full rounded-lg border-gray-300">
														{images?.results !== undefined && images?.results.length > 0 && (
															<>
																<table tw="relative min-w-full">
																	<thead>
																		<tr>
																			{ImagesTableLabels.map((site, key) => {
																				return (
																					<th
																						key={key}
																						className="min-width-adjust"
																						tw="px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
																					>
																						<span tw="flex items-center justify-start">
																							{user?.permissions.includes("can_see_images") ? (
																								site?.slug ? (
																									<ImageSorting
																										result={result}
																										slug={site?.slug}
																										mutateImages={mutateImages}
																										labels={ImagesTableLabels}
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
																			images?.results !== undefined && images?.results.length > 0 ? (
																				images?.results.map((val, key) => (
																					<ImageTable
																						key={key}
																						siteId={parseInt(result?.siteId)}
																						val={val}
																						componentReady={componentReady}
																					/>
																				))
																			) : null
																		) : (
																			<ImageTableSkeleton />
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

									{images?.results !== undefined && images?.results.length == 0 && (
										<section tw="flex flex-col justify-center h-full">
											<div tw="px-4 py-5 sm:p-6 sm:-mt-12 flex items-center justify-center">
												<h3 tw="text-lg leading-6 font-medium text-gray-500">{ImagesLabels[3].label}</h3>
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

Images.propTypes = {
	result: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};

Images.defaultProps = {
	result: null
};

export default Images;

export async function getServerSideProps(ctx) {
	return {
		props: {
			result: ctx.query
		}
	};
}

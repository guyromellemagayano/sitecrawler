import { AppLogo } from "@components/logos/AppLogo";
import SiteSelect from "@components/select/SiteSelect";
import { AuthAppLogo, SiteLogoWhite, SiteRoute } from "@configs/GlobalValues";
import { DashboardSitesLink } from "@configs/PageLinks";
import { SidebarMenus } from "@configs/SidebarMenus";
import { CogIcon, DocumentTextIcon, PhotographIcon } from "@heroicons/react/outline";
import { ArrowLeftIcon, LinkIcon, SearchIcon, ViewGridIcon } from "@heroicons/react/solid";
import useCrawl from "@hooks/useCrawl";
import { useSiteId } from "@hooks/useSiteId";
import { useStats } from "@hooks/useStats";
import * as Sentry from "@sentry/nextjs";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useState, useMemo, useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import tw from "twin.macro";

/**
 * Memoized function to generate the `SiteMenu` component.
 */
const SiteMenu = memo(() => {
	const [scanObjId, setScanObjId] = useState(null);

	// Router
	const { asPath } = useRouter();
	const { pathname } = useRouter();
	const { query } = useRouter();

	// Custom hooks
	const { currentScan, previousScan, scanCount } = useCrawl(query.siteId ?? null);

	useMemo(() => {
		const handleScanObjId = (scanCount, currentScan, previousScan) => {
			scanCount > 1
				? previousScan !== undefined
					? setScanObjId(previousScan.id)
					: false
				: currentScan !== undefined
				? setScanObjId(currentScan.id)
				: setScanObjId(previousScan.id);

			return scanObjId;
		};

		handleScanObjId(scanCount, currentScan, previousScan);
	}, [scanCount, currentScan, previousScan]);

	// SWR hooks
	const { siteId, errorSiteId, validatingSiteId } = useSiteId(query.siteId);
	const { stats, errorStats, validatingStats } = useStats(query.siteId, scanObjId);

	// Translations
	const { t } = useTranslation();
	const appLogo = t("common:appLogo");
	const siteIdBadGatewayGetError = t("alerts:siteIdBadGatewayGetError", { site: siteId.name });
	const siteIdBadRequestGetError = t("alerts:siteIdBadRequestGetError", { site: siteId.name });
	const siteIdForbiddenGetError = t("alerts:siteIdForbiddenGetError", { site: siteId.name });
	const siteIdGatewayTimeoutGetError = t("alerts:siteIdGatewayTimeoutGetError", { site: siteId.name });
	const siteIdInternalServerGetError = t("alerts:siteIdInternalServerGetError", { site: siteId.name });
	const siteIdNotFoundGetError = t("alerts:siteIdNotFoundGetError", { site: siteId.name });
	const siteIdServiceUnavailableGetError = t("alerts:siteIdServiceUnavailableGetError", { site: siteId.name });
	const siteIdTooManyRequestsError = t("alerts:siteIdTooManyRequestsError", { site: siteId.name });
	const siteIdUnknownError = t("alerts:siteIdUnknownError", { site: siteId.name });
	const statsBadGatewayGetError = t("alerts:statsBadGatewayGetError", { site: siteId.name });
	const statsBadRequestGetError = t("alerts:statsBadRequestGetError", { site: siteId.name });
	const statsForbiddenGetError = t("alerts:statsForbiddenGetError", { site: siteId.name });
	const statsGatewayTimeoutGetError = t("alerts:statsGatewayTimeoutGetError", { site: siteId.name });
	const statsInternalServerGetError = t("alerts:statsInternalServerGetError", { site: siteId.name });
	const statsNotFoundGetError = t("alerts:statsNotFoundGetError", { site: siteId.name });
	const statsServiceUnavailableGetError = t("alerts:statsServiceUnavailableGetError", { site: siteId.name });
	const statsTooManyRequestsError = t("alerts:statsTooManyRequestsError", { site: siteId.name });
	const statsUnknownError = t("alerts:statsUnknownError", { site: siteId.name });

	// Sidebar menus
	const { SiteSidebarMenus } = SidebarMenus();

	useEffect(() => {
		if (!validatingSiteId) {
			if ((typeof siteId === "undefined" || siteId == null) && !(Object.keys(siteId).length > 0)) {
				let errorStatusCodeMessage = "";

				switch (errorSiteId.status) {
					case 400:
						errorStatusCodeMessage = siteIdBadRequestGetError;
						break;
					case 403:
						errorStatusCodeMessage = siteIdForbiddenGetError;
						break;
					case 404:
						errorStatusCodeMessage = siteIdNotFoundGetError;
						break;
					case 408:
						errorStatusCodeMessage = siteIdGatewayTimeoutGetError;
						break;
					case 500:
						errorStatusCodeMessage = siteIdInternalServerGetError;
						break;
					case 502:
						errorStatusCodeMessage = siteIdBadGatewayGetError;
						break;
					case 503:
						errorStatusCodeMessage = siteIdServiceUnavailableGetError;
						break;
					case 504:
						errorStatusCodeMessage = siteIdGatewayTimeoutGetError;
						break;
					case 429:
						errorStatusCodeMessage = siteIdTooManyRequestsError;
						break;
					default:
						errorStatusCodeMessage = siteIdUnknownError;
						break;
				}

				setErrorMessage((prevState) => [
					...prevState,
					prevState.indexOf(errorStatusCodeMessage) !== -1
						? prevState.find((prevState) => prevState === errorStatusCodeMessage)
						: errorStatusCodeMessage
				]);

				// Capture unknown errors and send to Sentry
				Sentry.configureScope((scope) => {
					scope.setTag("route", asPath);
					scope.setTag("status", errorSiteId.status);
					scope.setTag(
						"message",
						errorMessage.find((message) => message === errorStatusCodeMessage)
					);
					Sentry.captureException(new Error(errorSiteId));
				});
			}
		}
	}, [siteId, validatingSiteId]);

	useEffect(() => {
		if (!validatingStats) {
			if ((typeof stats === "undefined" || stats == null) && !(Object.keys(stats).length > 0)) {
				let errorStatusCodeMessage = "";

				switch (errorStats.status) {
					case 400:
						errorStatusCodeMessage = statsBadRequestGetError;
						break;
					case 403:
						errorStatusCodeMessage = statsForbiddenGetError;
						break;
					case 404:
						errorStatusCodeMessage = statsNotFoundGetError;
						break;
					case 408:
						errorStatusCodeMessage = statsGatewayTimeoutGetError;
						break;
					case 500:
						errorStatusCodeMessage = statsInternalServerGetError;
						break;
					case 502:
						errorStatusCodeMessage = statsBadGatewayGetError;
						break;
					case 503:
						errorStatusCodeMessage = statsServiceUnavailableGetError;
						break;
					case 504:
						errorStatusCodeMessage = statsGatewayTimeoutGetError;
						break;
					case 429:
						errorStatusCodeMessage = statsTooManyRequestsError;
						break;
					default:
						errorStatusCodeMessage = statsUnknownError;
						break;
				}

				setErrorMessage((prevState) => [
					...prevState,
					prevState.indexOf(errorStatusCodeMessage) !== -1
						? prevState.find((prevState) => prevState === errorStatusCodeMessage)
						: errorStatusCodeMessage
				]);

				// Capture unknown errors and send to Sentry
				Sentry.configureScope((scope) => {
					scope.setTag("route", asPath);
					scope.setTag("status", errorStats.status);
					scope.setTag(
						"message",
						errorMessage.find((message) => message === errorStatusCodeMessage)
					);
					Sentry.captureException(new Error(errorStats));
				});
			}
		}
	}, [stats, validatingStats]);

	return (
		<Scrollbars renderThumbVertical={(props) => <div {...props} className="scroll-dark-bg" />} universal>
			<div tw="flex flex-col min-h-screen py-4 lg:py-8">
				<div tw="flex items-center flex-shrink-0 flex-row px-3 mb-0">
					<Link href={DashboardSitesLink} passHref>
						<a tw="p-1 block w-full cursor-pointer">
							<AppLogo
								className="flex"
								src={SiteLogoWhite}
								alt={appLogo}
								width={AuthAppLogo.width}
								height={AuthAppLogo.height}
							/>
						</a>
					</Link>
				</div>

				<div tw="flex-1 flex flex-col overflow-y-auto">
					<nav tw="flex-1 px-4">
						{SiteSidebarMenus.map((value, index) => {
							return (
								<div key={index} tw="mb-4">
									<h3 tw="mt-8 text-xs leading-4 font-semibold text-gray-200 uppercase tracking-wider">
										{value.category}
									</h3>

									<div tw="my-3" role="group">
										{value.links ? (
											value.links.map((value2, index2) => {
												const hrefVal = `${SiteRoute}[siteId]` + value2.url;
												const asVal = SiteRoute + siteId + value2.url;

												return value2.slug !== "go-back-to-sites" ? (
													<Link key={index2} href={hrefVal} as={asVal} passHref>
														<a
															className={`group ${
																!pathname.includes(SiteRoute + siteId + value2.url)
																	? "hover:bg-gray-1100 focus:bg-gray-1100"
																	: "bg-gray-1100"
															}`}
															css={[
																tw`cursor-pointer`,
																pathname.includes(SiteRoute + siteId + value2.url)
																	? tw`mt-1 flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-100 rounded-md `
																	: tw`mt-1 flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-400 rounded-md hover:text-gray-100 focus:outline-none transition ease-in-out duration-150`
															]}
														>
															{value2.slug === "overview" ? (
																<ViewGridIcon tw="mr-3 h-6 w-5" />
															) : value2.slug === "links" ? (
																<LinkIcon tw="mr-3 h-6 w-5" />
															) : value2.slug === "pages" ? (
																<DocumentTextIcon tw="mr-3 h-6 w-5" />
															) : value2.slug === "images" ? (
																<PhotographIcon tw="mr-3 h-6 w-5" />
															) : value2.slug === "seo" ? (
																<SearchIcon tw="mr-3 h-6 w-5" />
															) : value2.slug === "site-settings" ? (
																<CogIcon tw="mr-3 h-6 w-5" />
															) : null}

															{value2.title ? <span>{value2.title}</span> : null}

															{value2.url === "/links" && stats ? (
																<span tw="ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-white text-black">
																	{stats.num_links ? stats.num_links : null}
																</span>
															) : value2.url === "/pages" && stats ? (
																<span tw="ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-white text-black">
																	{stats.num_pages ? stats.num_pages : null}
																</span>
															) : value2.url === "/images" && stats ? (
																<span tw="ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-white text-black">
																	{stats.num_images ? stats.num_images : null}
																</span>
															) : null}
														</a>
													</Link>
												) : (
													<Link key={index} href={value2.url} passHref>
														<a
															className="group"
															tw="cursor-pointer mt-1 flex items-center py-2 text-sm leading-5 font-medium text-gray-400 rounded-md hover:text-gray-100 focus:outline-none focus:text-white"
														>
															<ArrowLeftIcon tw="mr-3 h-6 w-5" />
															{value2.title ? <span>{value2.title}</span> : null}
														</a>
													</Link>
												);
											})
										) : (
											<SiteSelect />
										)}
									</div>
								</div>
							);
						})}
					</nav>
				</div>
			</div>
		</Scrollbars>
	);
});

export default SiteMenu;

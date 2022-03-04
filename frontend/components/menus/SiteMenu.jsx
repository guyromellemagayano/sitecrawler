import { MemoizedSiteSelect } from "@components/select/SiteSelect";
import { SiteLogoWhite } from "@components/svgs/SiteLogo";
import { AuthAppLogo } from "@constants/GlobalValues";
import { DashboardSitesLink, SettingsSlug } from "@constants/PageLinks";
import { SidebarMenus } from "@constants/SidebarMenus";
import { CogIcon, DocumentTextIcon, PhotographIcon } from "@heroicons/react/outline";
import { ArrowLeftIcon, LinkIcon, SearchIcon, ViewGridIcon } from "@heroicons/react/solid";
import { useScan } from "@hooks/useScan";
import { useStats } from "@hooks/useStats";
import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import { handleConversionStringToNumber } from "@utils/convertCase";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useContext, useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the `SiteMenu` component
 */
const SiteMenu = () => {
	// Translations
	const { t } = useTranslation("common");
	const appLogo = t("appLogo");

	// Router
	const { asPath, pathname, query, prefetch } = useRouter();
	const { siteId } = query;

	// Custom variables
	const sanitizedSiteId = handleConversionStringToNumber(siteId);

	// Custom context
	const { isComponentReady } = useContext(SiteCrawlerAppContext);

	// SWR hooks
	const { user } = useUser();
	const { scan, scanObjId } = useScan(sanitizedSiteId);
	const { stats, totalImages, totalLinks, totalPages } = useStats(sanitizedSiteId, scanObjId);

	// Sidebar menus
	const { SiteSidebarMenus } = SidebarMenus();

	// Prefetch page
	useEffect(() => {
		prefetch(`/dashboard/sites/${siteId}/overview`);
	}, []);

	return (
		<Scrollbars autoHide renderThumbVertical={(props) => <div {...props} className="scroll-dark-bg" />} universal>
			<div className="flex h-full flex-col py-4 lg:py-8">
				<div className="mb-0 flex flex-shrink-0 flex-row items-center px-3">
					<Link href={DashboardSitesLink} passHref>
						<a
							className={classnames(
								"block w-full p-1",
								isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail
									? "cursor-pointer"
									: null
							)}
						>
							<SiteLogoWhite className="flex" width={AuthAppLogo.width} height={AuthAppLogo.height} />
						</a>
					</Link>
				</div>

				<div className="flex flex-1 flex-col overflow-y-auto">
					<nav className="flex-1 px-4">
						{SiteSidebarMenus.filter((e) => {
							return !asPath?.includes(DashboardSitesLink + siteId) ? e.slug !== "navigation" : true;
						}).map((value, index) => {
							return (
								<div key={index} className="mb-4">
									<h3 className="mt-8 inline-block text-xs font-semibold uppercase leading-4 tracking-wider text-gray-200">
										{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
											value.category
										) : (
											<Skeleton duration={2} width={128} height={16} />
										)}
									</h3>

									<div className="my-3" role="group">
										{value.links ? (
											value.links.map((value2, index2) => {
												return value2.slug !== "go-back-to-sites" && value2.slug !== "logout" ? (
													<Link
														key={index2}
														href={DashboardSitesLink + "[siteId]" + value2.url}
														as={DashboardSitesLink + siteId + value2.url}
														passHref
													>
														<a
															className={classnames(
																"group mt-1 flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium leading-5",
																asPath.includes(value2.url) &&
																	isComponentReady &&
																	user &&
																	Math.round(user?.status / 100) === 2 &&
																	!user?.data?.detail
																	? "!cursor-default bg-gray-1100"
																	: null,
																asPath.includes(value2.url) ||
																	(asPath.includes(SettingsSlug) && SettingsSlug.includes(value2.url))
																	? "text-gray-100"
																	: "text-gray-400",
																isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail
																	? "cursor-pointer transition duration-150 ease-in-out hover:bg-gray-1100 hover:text-gray-100 focus:bg-gray-1100 focus:outline-none"
																	: "cursor-default"
															)}
														>
															<span className="flex items-center justify-start">
																{value2.slug === "overview" ? (
																	isComponentReady &&
																	user &&
																	Math.round(user?.status / 100) === 2 &&
																	!user?.data?.detail ? (
																		<ViewGridIcon className="mr-3 h-6 w-5" />
																	) : (
																		<Skeleton duration={2} width={20} height={20} circle={true} className="mr-3" />
																	)
																) : value2.slug === "links" ? (
																	isComponentReady &&
																	user &&
																	Math.round(user?.status / 100) === 2 &&
																	!user?.data?.detail ? (
																		<LinkIcon className="mr-3 h-6 w-5" />
																	) : (
																		<Skeleton duration={2} width={20} height={20} circle={true} className="mr-3" />
																	)
																) : value2.slug === "pages" ? (
																	isComponentReady &&
																	user &&
																	Math.round(user?.status / 100) === 2 &&
																	!user?.data?.detail ? (
																		<DocumentTextIcon className="mr-3 h-6 w-5" />
																	) : (
																		<Skeleton duration={2} width={20} height={20} circle={true} className="mr-3" />
																	)
																) : value2.slug === "images" ? (
																	isComponentReady &&
																	user &&
																	Math.round(user?.status / 100) === 2 &&
																	!user?.data?.detail ? (
																		<PhotographIcon className="mr-3 h-6 w-5" />
																	) : (
																		<Skeleton duration={2} width={20} height={20} circle={true} className="mr-3" />
																	)
																) : value2.slug === "seo" ? (
																	isComponentReady &&
																	user &&
																	Math.round(user?.status / 100) === 2 &&
																	!user?.data?.detail ? (
																		<SearchIcon className="mr-3 h-6 w-5" />
																	) : (
																		<Skeleton duration={2} width={20} height={20} circle={true} className="mr-3" />
																	)
																) : value2.slug === "site-settings" ? (
																	isComponentReady &&
																	user &&
																	Math.round(user?.status / 100) === 2 &&
																	!user?.data?.detail ? (
																		<CogIcon className="mr-3 h-6 w-5" />
																	) : (
																		<Skeleton duration={2} width={20} height={20} circle={true} className="mr-3" />
																	)
																) : null}

																{value2.title ? (
																	isComponentReady &&
																	user &&
																	Math.round(user?.status / 100) === 2 &&
																	!user?.data?.detail ? (
																		value2.title
																	) : (
																		<Skeleton duration={2} width={128} height={20} />
																	)
																) : null}
															</span>

															{value2.slug === "links" ? (
																isComponentReady &&
																user &&
																Math.round(user?.status / 100) === 2 &&
																!user?.data?.detail ? (
																	totalLinks > 0 ? (
																		<span className="ml-auto inline-block rounded-full bg-white py-1 px-3 text-xs leading-4 text-black">
																			{totalLinks}
																		</span>
																	) : null
																) : (
																	<span className="flex items-center pl-3">
																		<Skeleton duration={2} width={30} height={20} className="rounded-full" />
																	</span>
																)
															) : null}

															{value2.slug === "pages" ? (
																isComponentReady &&
																user &&
																Math.round(user?.status / 100) === 2 &&
																!user?.data?.detail ? (
																	totalPages > 0 ? (
																		<span className="ml-auto inline-block rounded-full bg-white py-1 px-3 text-xs leading-4 text-black">
																			{totalPages}
																		</span>
																	) : null
																) : (
																	<span className="flex items-center pl-3">
																		<Skeleton duration={2} width={30} height={20} className="rounded-full" />
																	</span>
																)
															) : null}

															{value2.slug === "images" ? (
																isComponentReady &&
																user &&
																Math.round(user?.status / 100) === 2 &&
																!user?.data?.detail ? (
																	totalImages > 0 ? (
																		<span className="ml-auto inline-block rounded-full bg-white py-1 px-3 text-xs leading-4 text-black">
																			{totalImages}
																		</span>
																	) : null
																) : (
																	<span className="flex items-center pl-3">
																		<Skeleton duration={2} width={30} height={20} className="rounded-full" />
																	</span>
																)
															) : null}
														</a>
													</Link>
												) : value2.slug !== "logout" ? (
													<Link key={index} href={value2.url} passHref>
														<a
															className={classnames(
																"group mt-1 flex items-center rounded-md py-2 text-sm font-medium leading-5 text-gray-400 hover:text-gray-100 focus:text-white focus:outline-none",
																isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail
																	? "cursor-pointer"
																	: null
															)}
														>
															{isComponentReady &&
															user &&
															Math.round(user?.status / 100) === 2 &&
															!user?.data?.detail ? (
																<ArrowLeftIcon className="mr-3 h-6 w-5" />
															) : (
																<Skeleton duration={2} width={20} height={20} circle={true} className="mr-3" />
															)}

															{value2.title ? (
																<span>
																	{isComponentReady &&
																	user &&
																	Math.round(user?.status / 100) === 2 &&
																	!user?.data?.detail ? (
																		value2.title
																	) : (
																		<Skeleton duration={2} width={128} height={20} />
																	)}
																</span>
															) : null}
														</a>
													</Link>
												) : null;
											})
										) : (
											<MemoizedSiteSelect />
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
};

/**
 * Memoized custom `SiteMenu` component
 */
export const MemoizedSiteMenu = memo(SiteMenu);

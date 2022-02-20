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
import { handleConversionStringToNumber } from "@utils/convertCase";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useContext } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import tw from "twin.macro";

/**
 * Custom function to render the `SiteMenu` component
 */
const SiteMenu = () => {
	// Translations
	const { t } = useTranslation("common");
	const appLogo = t("appLogo");

	// Router
	const { asPath, pathname, query } = useRouter();
	const { siteId } = query;

	// Custom variables
	const sanitizedSiteId = handleConversionStringToNumber(siteId);

	// Custom context
	const { isComponentReady } = useContext(SiteCrawlerAppContext);

	// SWR hooks
	const { user } = useUser();
	const { scan, scanObjId } = useScan(sanitizedSiteId);
	const { stats, totalImages, totalLinks, totalPages, validatingStats } = useStats(sanitizedSiteId, scanObjId);

	// Sidebar menus
	const { SiteSidebarMenus } = SidebarMenus();

	return (
		<Scrollbars renderThumbVertical={(props) => <div {...props} className="scroll-dark-bg" />} universal>
			<div tw="flex flex-col h-full py-4 lg:py-8">
				<div tw="flex items-center flex-shrink-0 flex-row px-3 mb-0">
					<Link href={DashboardSitesLink} passHref>
						<a
							css={[
								tw`p-1 block w-full`,
								isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail
									? tw`cursor-pointer`
									: null
							]}
						>
							<SiteLogoWhite className="flex" width={AuthAppLogo.width} height={AuthAppLogo.height} />
						</a>
					</Link>
				</div>

				<div tw="flex-1 flex flex-col overflow-y-auto">
					<nav tw="flex-1 px-4">
						{SiteSidebarMenus.filter((e) => {
							return !asPath?.includes(DashboardSitesLink + siteId) ? e.slug !== "navigation" : true;
						}).map((value, index) => {
							return (
								<div key={index} tw="mb-4">
									<h3 tw="mt-8 text-xs leading-4 font-semibold text-gray-200 uppercase tracking-wider inline-block">
										{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
											value.category
										) : (
											<Skeleton duration={2} width={128} height={16} />
										)}
									</h3>

									<div tw="my-3" role="group">
										{value.links ? (
											value.links.map((value2, index2) => {
												return value2.slug !== "go-back-to-sites" && value2.slug !== "logout" ? (
													<Link
														key={index2}
														href={`${DashboardSitesLink + "[siteId]" + value2.url}`}
														as={`${DashboardSitesLink + siteId + value2.url}`}
														passHref
													>
														<a
															className="group"
															css={[
																tw`mt-1 flex items-center justify-between px-3 py-2 text-sm leading-5 font-medium rounded-md `,
																asPath.includes(value2.url) &&
																isComponentReady &&
																user &&
																Math.round(user?.status / 100) === 2 &&
																!user?.data?.detail
																	? tw`bg-gray-1100 !cursor-default`
																	: null,
																asPath.includes(value2.url) ||
																(asPath.includes(SettingsSlug) && SettingsSlug.includes(value2.url))
																	? tw`text-gray-100`
																	: tw`text-gray-400`,
																isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail
																	? tw`cursor-pointer hover:text-gray-100 focus:outline-none transition ease-in-out duration-150 hover:bg-gray-1100 focus:bg-gray-1100`
																	: tw`cursor-default`
															]}
														>
															<span tw="flex items-center justify-start">
																{value2.slug === "overview" ? (
																	isComponentReady &&
																	user &&
																	Math.round(user?.status / 100) === 2 &&
																	!user?.data?.detail ? (
																		<ViewGridIcon tw="mr-3 h-6 w-5" />
																	) : (
																		<Skeleton duration={2} width={20} height={20} circle={true} tw="mr-3" />
																	)
																) : value2.slug === "links" ? (
																	isComponentReady &&
																	user &&
																	Math.round(user?.status / 100) === 2 &&
																	!user?.data?.detail ? (
																		<LinkIcon tw="mr-3 h-6 w-5" />
																	) : (
																		<Skeleton duration={2} width={20} height={20} circle={true} tw="mr-3" />
																	)
																) : value2.slug === "pages" ? (
																	isComponentReady &&
																	user &&
																	Math.round(user?.status / 100) === 2 &&
																	!user?.data?.detail ? (
																		<DocumentTextIcon tw="mr-3 h-6 w-5" />
																	) : (
																		<Skeleton duration={2} width={20} height={20} circle={true} tw="mr-3" />
																	)
																) : value2.slug === "images" ? (
																	isComponentReady &&
																	user &&
																	Math.round(user?.status / 100) === 2 &&
																	!user?.data?.detail ? (
																		<PhotographIcon tw="mr-3 h-6 w-5" />
																	) : (
																		<Skeleton duration={2} width={20} height={20} circle={true} tw="mr-3" />
																	)
																) : value2.slug === "seo" ? (
																	isComponentReady &&
																	user &&
																	Math.round(user?.status / 100) === 2 &&
																	!user?.data?.detail ? (
																		<SearchIcon tw="mr-3 h-6 w-5" />
																	) : (
																		<Skeleton duration={2} width={20} height={20} circle={true} tw="mr-3" />
																	)
																) : value2.slug === "site-settings" ? (
																	isComponentReady &&
																	user &&
																	Math.round(user?.status / 100) === 2 &&
																	!user?.data?.detail ? (
																		<CogIcon tw="mr-3 h-6 w-5" />
																	) : (
																		<Skeleton duration={2} width={20} height={20} circle={true} tw="mr-3" />
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
																!user?.data?.detail &&
																totalLinks &&
																!validatingStats ? (
																	totalLinks > 0 ? (
																		<span tw="ml-auto inline-block text-xs leading-4 rounded-full py-1 px-3 bg-white text-black">
																			{totalLinks}
																		</span>
																	) : null
																) : (
																	<span tw="flex items-center pl-3">
																		<Skeleton duration={2} width={30} height={20} tw="rounded-full" />
																	</span>
																)
															) : null}

															{value2.slug === "pages" ? (
																isComponentReady &&
																user &&
																Math.round(user?.status / 100) === 2 &&
																!user?.data?.detail &&
																totalPages &&
																!validatingStats ? (
																	totalPages > 0 ? (
																		<span tw="ml-auto inline-block text-xs leading-4 rounded-full py-1 px-3 bg-white text-black">
																			{totalPages}
																		</span>
																	) : null
																) : (
																	<span tw="flex items-center pl-3">
																		<Skeleton duration={2} width={30} height={20} tw="rounded-full" />
																	</span>
																)
															) : null}

															{value2.slug === "images" ? (
																isComponentReady &&
																user &&
																Math.round(user?.status / 100) === 2 &&
																!user?.data?.detail &&
																totalImages &&
																!validatingStats ? (
																	totalImages > 0 ? (
																		<span tw="ml-auto inline-block text-xs leading-4 rounded-full py-1 px-3 bg-white text-black">
																			{totalImages}
																		</span>
																	) : null
																) : (
																	<span tw="flex items-center pl-3">
																		<Skeleton duration={2} width={30} height={20} tw="rounded-full" />
																	</span>
																)
															) : null}
														</a>
													</Link>
												) : value2.slug !== "logout" ? (
													<Link key={index} href={value2.url} passHref>
														<a
															className="group"
															css={[
																tw`mt-1 flex items-center py-2 text-sm leading-5 font-medium text-gray-400 rounded-md hover:text-gray-100 focus:outline-none focus:text-white`,
																isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail
																	? tw`cursor-pointer`
																	: null
															]}
														>
															{isComponentReady &&
															user &&
															Math.round(user?.status / 100) === 2 &&
															!user?.data?.detail ? (
																<ArrowLeftIcon tw="mr-3 h-6 w-5" />
															) : (
																<Skeleton duration={2} width={20} height={20} circle={true} tw="mr-3" />
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

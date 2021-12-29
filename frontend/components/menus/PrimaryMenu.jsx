/* eslint-disable jsx-a11y/anchor-is-valid */
import { MemoizedAppLogo } from "@components/logos/AppLogo";
import { MemoizedSiteSelect } from "@components/select/SiteSelect";
import { AuthAppLogo, SiteLogoWhite } from "@constants/GlobalValues";
import { AddNewSiteSlug, DashboardSitesLink, SitesSlug } from "@constants/PageLinks";
import { SidebarMenus } from "@constants/SidebarMenus";
import { DocumentReportIcon, ExternalLinkIcon } from "@heroicons/react/outline";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import { useLoading } from "@hooks/useLoading";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import tw from "twin.macro";

/**
 * Custom function to render the `PrimaryMenu` component
 */
export function PrimaryMenu() {
	// Translations
	const { t } = useTranslation("common");
	const appLogo = t("appLogo");

	// Router
	const { asPath } = useRouter();

	// Sidebar menus
	const { PrimarySidebarMenus } = SidebarMenus();

	// Custom hooks
	const { isComponentReady } = useLoading();

	return (
		<Scrollbars renderThumbVertical={(props) => <div {...props} className="scroll-dark-bg" />} universal>
			<div tw="flex flex-col min-h-screen py-4 lg:py-8">
				<div tw="flex items-center flex-shrink-0 flex-row px-3 mb-0">
					<Link href={DashboardSitesLink} passHref>
						<a tw="p-1 block w-full cursor-pointer">
							<MemoizedAppLogo
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
						{PrimarySidebarMenus.filter((e) => {
							return !asPath?.includes(AddNewSiteSlug) ? e.slug !== "navigation" : true;
						}).map((value, index) => {
							return (
								<div key={index} tw="mb-4">
									<h3 tw="mt-8 text-xs leading-4 font-semibold text-gray-200 uppercase tracking-wider inline-block">
										{isComponentReady ? value.category : <Skeleton duration={2} width={128} height={16} />}
									</h3>

									<div tw="my-3" role="group">
										{value.links ? (
											value.links.map((value2, index2) => {
												return value2.slug !== "go-back-to-sites" ? (
													<Link key={index2} href={value2.url} passHref>
														<a
															className="group"
															css={[
																tw`mt-1 flex items-center px-3 py-2 text-sm leading-5 font-medium rounded-md `,
																asPath.includes(value2.url) && isComponentReady
																	? tw`bg-gray-1100 !cursor-default`
																	: null,
																asPath.includes(value2.url) ||
																(asPath.includes(SitesSlug) && SitesSlug.includes(value2.url))
																	? tw`text-gray-100`
																	: tw`text-gray-400`,
																isComponentReady
																	? tw`cursor-pointer hover:text-gray-100 focus:outline-none transition ease-in-out duration-150 hover:bg-gray-1100 focus:bg-gray-1100`
																	: tw`cursor-default`
															]}
														>
															{value2.slug === "sites" ? (
																isComponentReady ? (
																	<ExternalLinkIcon tw="mr-3 h-6 w-5" />
																) : (
																	<Skeleton duration={2} width={20} height={20} circle={true} tw="mr-3" />
																)
															) : value2.slug === "audit-logs" ? (
																isComponentReady ? (
																	<DocumentReportIcon tw="mr-3 h-6 w-5" />
																) : (
																	<Skeleton duration={2} width={20} height={20} circle={true} tw="mr-3" />
																)
															) : null}

															{value2.title ? (
																<span>
																	{isComponentReady ? value2.title : <Skeleton duration={2} width={128} height={20} />}
																</span>
															) : null}
														</a>
													</Link>
												) : (
													<Link key={index} href={value2.url} passHref>
														<a
															className="group"
															css={[
																tw`mt-1 flex items-center py-2 text-sm leading-5 font-medium text-gray-400 rounded-md hover:text-gray-100 focus:outline-none focus:text-white`,
																isComponentReady ? tw`cursor-pointer` : null
															]}
														>
															{isComponentReady ? (
																<ArrowLeftIcon tw="mr-3 h-6 w-5" />
															) : (
																<Skeleton duration={2} width={20} height={20} circle={true} tw="mr-3" />
															)}

															{value2.title ? (
																<span>
																	{isComponentReady ? value2.title : <Skeleton duration={2} width={128} height={20} />}
																</span>
															) : null}
														</a>
													</Link>
												);
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
}

/**
 * Memoized custom `PrimaryMenu` component
 */
export const MemoizedPrimaryMenu = memo(PrimaryMenu);

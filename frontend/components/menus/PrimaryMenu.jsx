/* eslint-disable jsx-a11y/anchor-is-valid */
import { MemoizedAppLogo } from "@components/logos/AppLogo";
import { MemoizedSiteSelect } from "@components/select/SiteSelect";
import { AuthAppLogo, ComponentReadyInterval, SiteLogoWhite } from "@constants/GlobalValues";
import { DashboardSitesLink, SitesSlug } from "@constants/PageLinks";
import { SidebarMenus } from "@constants/SidebarMenus";
import { DocumentReportIcon, ExternalLinkIcon } from "@heroicons/react/outline";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useEffect, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import tw from "twin.macro";

/**
 * Custom function to render the `PrimaryMenu` component
 */
export function PrimaryMenu() {
	const [isComponentReady, setIsComponentReady] = useState(false);

	// Router
	const { asPath, isReady, pathname } = useRouter();

	useEffect(() => {
		if (isReady && pathname) {
			setTimeout(() => {
				setIsComponentReady(true);
			}, ComponentReadyInterval);
		}

		return () => {
			setIsComponentReady(false);
		};
	}, [isReady, pathname]);

	// Translations
	const { t } = useTranslation("common");
	const appLogo = t("appLogo");

	// Sidebar menus
	const { PrimarySidebarMenus } = SidebarMenus();

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
							return !pathname.includes(SitesSlug) ? e.slug !== "navigation" : true;
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
																tw`cursor-pointer`,
																value2.url.includes(pathname) && isComponentReady ? tw`bg-gray-1100` : null,
																value2.url.includes(pathname) ||
																(asPath.includes(SitesSlug) && value2.url.includes(SitesSlug))
																	? tw`mt-1 flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-100 rounded-md`
																	: tw`mt-1 flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-400 rounded-md hover:text-gray-100 focus:outline-none transition ease-in-out duration-150 hover:bg-gray-1100 focus:bg-gray-1100`
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
															tw="cursor-pointer mt-1 flex items-center py-2 text-sm leading-5 font-medium text-gray-400 rounded-md hover:text-gray-100 focus:outline-none focus:text-white"
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

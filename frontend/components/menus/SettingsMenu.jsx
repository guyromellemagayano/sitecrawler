import { MemoizedSiteSelect } from "@components/select/SiteSelect";
import { SiteLogoWhite } from "@components/svgs/SiteLogo";
import { AuthAppLogo } from "@constants/GlobalValues";
import { DashboardSitesLink, SettingsSlug } from "@constants/PageLinks";
import { SidebarMenus } from "@constants/SidebarMenus";
import { GlobeIcon } from "@heroicons/react/outline";
import { ArrowLeftIcon, CreditCardIcon, SupportIcon, UserCircleIcon, ViewBoardsIcon } from "@heroicons/react/solid";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useContext } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the `SettingsMenu` component
 */
const SettingsMenu = () => {
	// Translations
	const { t } = useTranslation("common");
	const appLogo = t("appLogo");

	// Router
	const { asPath } = useRouter();

	// Sidebar menus
	const { SettingsSidebarMenus } = SidebarMenus();

	// Custom context
	const { isComponentReady } = useContext(SiteCrawlerAppContext);

	return (
		<Scrollbars autoHide renderThumbVertical={(props) => <div {...props} className="scroll-dark-bg" />} universal>
			<div className="flex h-full flex-col py-4 lg:py-8">
				<div className="mb-0 flex flex-shrink-0 flex-row items-center px-3">
					<Link href={DashboardSitesLink} passHref>
						<a className={classnames("block w-full p-1", isComponentReady ? "cursor-pointer" : null)}>
							<SiteLogoWhite className="flex" width={AuthAppLogo.width} height={AuthAppLogo.height} />
						</a>
					</Link>
				</div>

				<div className="flex flex-1 flex-col overflow-y-auto">
					<nav className="flex-1 px-4">
						{SettingsSidebarMenus?.filter((e) =>
							!asPath?.includes(SettingsSlug) ? e.slug !== "navigation" : true
						).map((value, index) => {
							return (
								<div key={index} className="mb-4">
									<h3 className="mt-8 inline-block text-xs font-semibold uppercase leading-4 tracking-wider text-gray-200">
										{isComponentReady ? value.category : <Skeleton duration={2} width={128} height={16} />}
									</h3>

									<div className="my-3" role="group">
										{value.links ? (
											value.links.map((value2, index2) => {
												return value2.slug !== "go-back-to-sites" && value2.slug !== "logout" ? (
													<Link key={index2} href={value2.url} passHref>
														<a
															disabled={!isComponentReady}
															aria-disabled={!isComponentReady}
															aria-hidden={!isComponentReady}
															className={classnames(
																"group mt-1 flex items-center rounded-md px-3 py-2 text-sm font-medium leading-5 cursor-pointer transition duration-150 ease-in-out hover:bg-gray-1100 hover:text-gray-100 focus:bg-gray-1100 focus:outline-none",
																asPath.includes(value2.url) && isComponentReady ? "!cursor-default bg-gray-1100" : null,
																asPath.includes(value2.url) ||
																	(asPath.includes(SettingsSlug) && SettingsSlug.includes(value2.url))
																	? "text-gray-100"
																	: "text-gray-400",
																!isComponentReady ? "cursor-default" : null
															)}
														>
															{value2.slug === "profile-settings" ? (
																isComponentReady ? (
																	<UserCircleIcon className="mr-3 h-6 w-5" />
																) : (
																	<Skeleton duration={2} width={20} height={20} circle={true} className="mr-3" />
																)
															) : value2.slug === "subscription-plans" ? (
																isComponentReady ? (
																	<ViewBoardsIcon className="mr-3 h-6 w-5" />
																) : (
																	<Skeleton duration={2} width={20} height={20} circle={true} className="mr-3" />
																)
															) : value2.slug === "billing-settings" ? (
																isComponentReady ? (
																	<CreditCardIcon className="mr-3 h-6 w-5" />
																) : (
																	<Skeleton duration={2} width={20} height={20} circle={true} className="mr-3" />
																)
															) : value2.slug === "global-settings" ? (
																isComponentReady ? (
																	<GlobeIcon className="mr-3 h-6 w-5" />
																) : (
																	<Skeleton duration={2} width={20} height={20} circle={true} className="mr-3" />
																)
															) : value2.slug === "subscription-plans" ? (
																isComponentReady ? (
																	<ViewBoardsIcon className="mr-3 h-6 w-5" />
																) : (
																	<Skeleton duration={2} width={20} height={20} circle={true} className="mr-3" />
																)
															) : value2.slug === "help-support" ? (
																isComponentReady ? (
																	<SupportIcon className="mr-3 h-6 w-5" />
																) : (
																	<Skeleton duration={2} width={20} height={20} circle={true} className="mr-3" />
																)
															) : null}

															{value2.title ? (
																<span>
																	{isComponentReady ? value2.title : <Skeleton duration={2} width={128} height={20} />}
																</span>
															) : null}
														</a>
													</Link>
												) : value2.slug !== "logout" ? (
													<Link key={index} href={value2.url} passHref>
														<a
															className={classnames(
																"group mt-1 flex items-center rounded-md py-2 text-sm font-medium leading-5 text-gray-400 hover:text-gray-100 focus:text-white focus:outline-none",
																isComponentReady ? "cursor-pointer" : null
															)}
														>
															{isComponentReady ? (
																<ArrowLeftIcon className="mr-3 h-6 w-5" />
															) : (
																<Skeleton duration={2} width={20} height={20} circle={true} className="mr-3" />
															)}

															{value2.title ? (
																<span>
																	{isComponentReady ? value2.title : <Skeleton duration={2} width={128} height={20} />}
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
 * Memoized custom `SettingsMenu` component
 */
export const MemoizedSettingsMenu = memo(SettingsMenu);

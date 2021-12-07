/* eslint-disable jsx-a11y/anchor-is-valid */
import { MemoizedAppLogo } from "@components/logos/AppLogo";
import { MemoizedSiteSelect } from "@components/select/SiteSelect";
import { AuthAppLogo, SiteLogoWhite } from "@constants/GlobalValues";
import { DashboardSitesLink, SettingsSlug } from "@constants/PageLinks";
import { SidebarMenus } from "@constants/SidebarMenus";
import { GlobeIcon } from "@heroicons/react/outline";
import { ArrowLeftIcon, CreditCardIcon, SupportIcon, UserCircleIcon, ViewBoardsIcon } from "@heroicons/react/solid";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import tw from "twin.macro";

/**
 * Custom function to render the `SettingsMenu` component
 */
export function SettingsMenu() {
	// Router
	const { pathname } = useRouter();

	// Translations
	const { t } = useTranslation("common");
	const appLogo = t("appLogo");

	// Sidebar menus
	const { SettingsSidebarMenus } = SidebarMenus();

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
						{SettingsSidebarMenus.filter((e) => {
							return !pathname.includes(SettingsSlug) ? e.slug !== "navigation" : true;
						}).map((value, index) => {
							return (
								<div key={index} tw="mb-4">
									<h3 tw="mt-8 text-xs leading-4 font-semibold text-gray-200 uppercase tracking-wider">
										{value.category}
									</h3>

									<div tw="my-3" role="group">
										{value.links ? (
											value.links.map((value2, index2) => {
												return value2.slug !== "go-back-to-sites" && value2.slug !== "logout" ? (
													<Link key={index2} href={value2.url} passHref>
														<a
															className="group"
															css={[
																tw`cursor-pointer`,
																value2.url.includes(pathname)
																	? tw`mt-1 flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-100 rounded-md bg-gray-1100`
																	: tw`mt-1 flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-400 rounded-md hover:text-gray-100 focus:outline-none transition ease-in-out duration-150 hover:bg-gray-1100 focus:bg-gray-1100`
															]}
														>
															{value2.slug === "profile-settings" ? (
																<UserCircleIcon tw="mr-3 h-6 w-5" />
															) : value2.slug === "subscription-plans" ? (
																<ViewBoardsIcon tw="mr-3 h-6 w-5" />
															) : value2.slug === "billing-settings" ? (
																<CreditCardIcon tw="mr-3 h-6 w-5" />
															) : value2.slug === "global-settings" ? (
																<GlobeIcon tw="mr-3 h-6 w-5" />
															) : value2.slug === "subscription-plans" ? (
																<ViewBoardsIcon tw="mr-3 h-6 w-5" />
															) : value2.slug === "help-support" ? (
																<SupportIcon tw="mr-3 h-6 w-5" />
															) : null}

															{value2.title ? <span>{value2.title}</span> : null}
														</a>
													</Link>
												) : value2.slug !== "logout" ? (
													<Link key={index} href={value2.url} passHref>
														<a
															className="group"
															tw="cursor-pointer mt-1 flex items-center py-2 text-sm leading-5 font-medium text-gray-400 rounded-md hover:text-gray-100 focus:outline-none focus:text-white"
														>
															<ArrowLeftIcon tw="mr-3 h-6 w-5" />
															{value2.title ? <span>{value2.title}</span> : null}
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
}

/**
 * Memoized custom `SettingsMenu` component
 */
export const MemoizedSettingsMenu = memo(SettingsMenu);

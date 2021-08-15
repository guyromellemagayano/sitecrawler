// React
import * as React from "react";

// NextJS
import { useRouter } from "next/router";
import Link from "next/link";

// External
import {
	ArrowLeftIcon,
	UserCircleIcon,
	ViewBoardsIcon,
	CreditCardIcon,
	SupportIcon
} from "@heroicons/react/solid";
import { GlobeIcon } from "@heroicons/react/outline";
import { Scrollbars } from "react-custom-scrollbars-2";
import PropTypes from "prop-types";
import tw from "twin.macro";

// Enums
import { GlobalLabels, SiteLogoWhite } from "@enums/GlobalValues";
import { SitesLink } from "@enums/PageLinks";
import { SettingsSidebarMenu } from "@enums/SidebarMenus";

// Components
import AppLogo from "@components/logos/AppLogo";
import SiteSelect from "@components/select/SiteSelect";

const SettingsMenu = ({ site }) => {
	const router = useRouter();

	return (
		<Scrollbars
			renderThumbVertical={(props) => <div {...props} className="scroll-dark-bg" />}
			universal
		>
			<div tw="flex flex-col min-h-screen py-4 lg:py-8">
				<div tw="flex items-center flex-shrink-0 flex-row px-3 mb-0">
					<Link href={SitesLink} passHref>
						<a tw="p-1 block w-full cursor-pointer">
							<AppLogo
								className="flex"
								src={SiteLogoWhite}
								alt={GlobalLabels[1].label}
								width={GlobalLabels[1].width}
								height={GlobalLabels[1].height}
							/>
						</a>
					</Link>
				</div>

				<div tw="flex-1 flex flex-col overflow-y-auto">
					<nav tw="flex-1 px-4">
						{SettingsSidebarMenu.map((value, index) => {
							return (
								<div key={index} tw="mb-4">
									<h3 tw="mt-8 text-xs leading-4 font-semibold text-gray-200 uppercase tracking-wider">
										{value?.category}
									</h3>

									<div tw="my-3" role="group">
										{value?.links ? (
											value?.links.map((value2, index) => {
												return value2?.slug !== "go-back-to-sites" ? (
													<Link key={index} href={value2?.url} passHref>
														<a
															className={`group ${
																router.pathname !== value2?.url
																	? "hover:bg-gray-1100 focus:bg-gray-1100"
																	: "bg-gray-1100"
															}`}
															css={[
																tw`cursor-pointer`,
																router.pathname == value2.url
																	? tw`mt-1 flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-100 rounded-md `
																	: tw`mt-1 flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-400 rounded-md hover:text-gray-100 focus:outline-none  transition ease-in-out duration-150`
															]}
														>
															{value2?.slug === "profile-settings" ? (
																<UserCircleIcon tw="mr-3 h-6 w-5" />
															) : value2?.slug === "subscription-plans" ? (
																<ViewBoardsIcon tw="mr-3 h-6 w-5" />
															) : value2?.slug === "billing-settings" ? (
																<CreditCardIcon tw="mr-3 h-6 w-5" />
															) : value2?.slug === "global-settings" ? (
																<GlobeIcon tw="mr-3 h-6 w-5" />
															) : value2?.slug === "subscription-plans" ? (
																<ViewBoardsIcon tw="mr-3 h-6 w-5" />
															) : value2?.slug === "help-support" ? (
																<SupportIcon tw="mr-3 h-6 w-5" />
															) : null}
															{value2?.title ? <span>{value2?.title}</span> : null}
														</a>
													</Link>
												) : (
													<Link key={index} href={value2?.url} passHref>
														<a
															className="group"
															tw="cursor-pointer mt-1 flex items-center py-2 text-sm leading-5 font-medium text-gray-400 rounded-md hover:text-gray-100 focus:outline-none focus:text-white"
														>
															<ArrowLeftIcon tw="mr-3 h-6 w-5" />
															{value2?.title ? <span>{value2?.title}</span> : null}
														</a>
													</Link>
												);
											})
										) : (
											<SiteSelect site={site} />
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

SettingsMenu.propTypes = {
	site: PropTypes.object
};

SettingsMenu.defaultProps = {
	site: null
};

export default SettingsMenu;

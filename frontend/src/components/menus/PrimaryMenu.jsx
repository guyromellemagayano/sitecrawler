// React
import * as React from "react";

// NextJS
import { useRouter } from "next/router";
import Link from "next/link";

// External
import { DocumentReportIcon, ExternalLinkIcon } from "@heroicons/react/outline";
import { Scrollbars } from "react-custom-scrollbars-2";
import AppLogo from "src/components/logos/AppLogo";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import tw from "twin.macro";

// JSON
import DashboardPages from "public/data/dashboard-pages.json";
import PrimaryMenuLabel from "public/labels/components/sidebar/PrimaryMenu.json";

// Hooks
import useDropdownOutsideClick from "src/hooks/useDropdownOutsideClick";

// Components
import SiteSelectionMenu from "src/components/menus/SiteSelectionMenu";

// Loadable
const SiteSelectionDropdown = loadable(() => import("src/components/dropdowns/SiteSelectionDropdown"));

const PrimaryMenu = ({ user, site }) => {
	const [selectedSite, setSelectedSite] = React.useState(null);
	const [selectedSiteDetails, setSelectedSiteDetails] = React.useState([]);
	const { ref, isComponentVisible, setIsComponentVisible } = useDropdownOutsideClick(false);

	const appLogoAltText = "app-logo";
	const siteDashboardLink = "/sites/";

	const { asPath } = useRouter();
	const router = useRouter();

	return (
		<Scrollbars renderThumbVertical={(props) => <div {...props} className="scroll-dark-bg" />} universal>
			<div tw="flex flex-col pt-8 pb-4">
				<div css={[tw`flex items-center flex-shrink-0 flex-row px-3`, user ? tw`mb-0` : tw`mb-8`]}>
					<Link href={siteDashboardLink} passHref>
						<a tw="p-1 block w-full cursor-pointer">
							<AppLogo
								className={tw`w-48 h-auto`}
								src="/images/logos/site-logo-white.svg"
								alt={appLogoAltText}
								width={230}
								height={40}
							/>
						</a>
					</Link>
				</div>
				<div tw="flex-1 flex flex-col overflow-y-auto">
					<nav tw="flex-1 px-4">
						{DashboardPages.map((value, index) => {
							return (
								<div key={index} css={[user ? tw`mb-8` : tw`mb-4`]}>
									{user ? (
										<h3 tw="mt-8 text-xs leading-4 font-semibold text-gray-200 uppercase tracking-wider">
											{value?.category}
										</h3>
									) : (
										<Skeleton duration={2} width={100} height={16} />
									)}

									<div tw="my-3" role="group">
										{value?.links ? (
											value?.links.map((value2, index) => {
												return (
													<Link key={index} href={value2?.url} passHref>
														<a
															className={`group ${
																router.pathname == value2?.url ||
																(asPath.includes("/sites") && value2?.url.includes("/sites"))
																	? "bg-gray-1100"
																	: "hover:bg-gray-1100 focus:bg-gray-1100"
															}`}
															css={[
																tw`cursor-pointer`,
																router.pathname == value2?.url ||
																(asPath.includes("/sites") && value2?.url.includes("/sites"))
																	? tw`mt-1 flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-100 rounded-md `
																	: tw`mt-1 flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-400 rounded-md hover:text-gray-100 focus:outline-none  transition ease-in-out duration-150`
															]}
														>
															{user ? (
																value2?.slug === "sites" ? (
																	<ExternalLinkIcon tw="mr-3 h-6 w-5" />
																) : value2?.slug === "audit-logs" ? (
																	<DocumentReportIcon tw="mr-3 h-6 w-5" />
																) : null
															) : (
																<Skeleton duration={2} tw="mr-3" width={20} height={20} />
															)}
															{user ? (
																value2?.title ? (
																	<span>{value2?.title}</span>
																) : null
															) : (
																<Skeleton duration={2} width={100} height={16} />
															)}
														</a>
													</Link>
												);
											})
										) : (
											<div tw="space-y-1">
												<div ref={ref} tw="relative">
													<div tw="relative">
														<span tw="inline-block w-full rounded-md shadow-sm">
															{user ? (
																<SiteSelectionMenu
																	label={[PrimaryMenuLabel[0].label]}
																	selectedSite={selectedSite}
																	selectedSiteDetails={selectedSiteDetails}
																	setIsComponentVisible={() => setIsComponentVisible(!isComponentVisible)}
																/>
															) : (
																<Skeleton duration={2} width={209} height={38} tw="relative w-full pl-3 pr-10 py-2" />
															)}
														</span>

														<SiteSelectionDropdown
															site={site}
															label={[PrimaryMenuLabel[2].label]}
															isComponentVisible={isComponentVisible}
															selectedSite={selectedSite}
															setSelectedSite={setSelectedSite}
															setSelectedSiteDetails={setSelectedSiteDetails}
															isComponentVisible={isComponentVisible}
															setIsComponentVisible={setIsComponentVisible}
														/>
													</div>
												</div>
											</div>
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

PrimaryMenu.propTypes = {};

export default PrimaryMenu;

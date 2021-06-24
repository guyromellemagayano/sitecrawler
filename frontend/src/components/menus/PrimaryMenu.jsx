// React
import * as React from "react";

// NextJS
import { useRouter } from "next/router";
import Link from "next/link";

// External
import { DocumentReportIcon, ExternalLinkIcon } from "@heroicons/react/outline";
import { PlusIcon, SelectorIcon } from "@heroicons/react/solid";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Transition } from "@headlessui/react";
import AppLogo from "src/components/logos/AppLogo";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import tw from "twin.macro";

// JSON
import DashboardPages from "public/data/dashboard-pages.json";
import PrimaryMenuLabel from "public/labels/components/sidebar/PrimaryMenu.json";

// Hooks
import useDropdownOutsideClick from "src/hooks/useDropdownOutsideClick";

const PrimaryMenu = ({ user, site }) => {
	const [selectedSite, setSelectedSite] = React.useState("");
	const [selectedSiteDetails, setSelectedSiteDetails] = React.useState([]);
	const [sitesLoaded, setSitesLoaded] = React.useState(false);
	const { ref, isComponentVisible, setIsComponentVisible } = useDropdownOutsideClick(false);

	const siteDashboardLink = "/sites/";

	const { asPath } = useRouter();
	const router = useRouter();

	const handleSiteSelectOnLoad = (siteId) => {
		site?.results
			? (() => {
					for (let i = 0; i < site?.results.length; i++) {
						if (site?.results[i]?.id == siteId) {
							setSelectedSite(site?.results[i]?.name);

							setTimeout(() => {
								router.push(`/site/[siteId]/overview`, `/site/${siteId}/overview`);
							}, 500);
						}
					}
			  })()
			: null;
	};

	const handleDropdownHandler = (siteId) => {
		handleSiteSelectOnLoad(siteId);
		setIsComponentVisible(!isComponentVisible);
	};

	React.useEffect(() => {
		isComponentVisible
			? (() => {
					setTimeout(() => {
						setSitesLoaded(true);
					}, 500);
			  })()
			: setSitesLoaded(false);
	}, [isComponentVisible]);

	React.useEffect(() => {
		site?.results
			? site?.results
					.filter((result) => result.name === selectedSite)
					.map((val) => {
						setSelectedSiteDetails(val);
					})
			: null;
	}, [selectedSite, site]);

	return (
		<Scrollbars renderThumbVertical={(props) => <div {...props} className="scroll-dark-bg" />} universal>
			<div tw="flex flex-col h-full pt-8 pb-4">
				<div css={[tw`flex items-center flex-shrink-0 flex-row px-3`, user ? tw`mb-0` : tw`mb-8`]}>
					<Link href={siteDashboardLink} passHref>
						<a tw="p-1 block w-full cursor-pointer">
							<AppLogo className={tw`h-8 w-auto`} src="/images/logos/site-logo-white.svg" alt="app-logo" />
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
																<button
																	type="button"
																	aria-haspopup="listbox"
																	aria-expanded="true"
																	aria-labelledby="listbox-label"
																	className="focus:ring-gray-1100"
																	tw="cursor-default relative w-full rounded-md border border-gray-700 pl-3 pr-10 py-2 text-left bg-white focus:outline-none focus:ring-1  transition ease-in-out duration-150 sm:text-sm sm:leading-5"
																	onClick={() => setIsComponentVisible(!isComponentVisible)}
																>
																	<div tw="flex items-center space-x-3">
																		<span tw="block truncate text-gray-600">
																			{selectedSite !== "" ? (
																				selectedSiteDetails ? (
																					<div tw="flex items-center space-x-3">
																						<span
																							aria-label={value?.verified ? "Verified" : "Not Verified"}
																							css={[
																								tw`flex-shrink-0 inline-block h-2 w-2 rounded-full`,
																								selectedSiteDetails?.verified ? tw`bg-green-400` : tw`bg-red-400`
																							]}
																						></span>
																						<span tw="font-medium block truncate text-gray-500">{selectedSite}</span>
																					</div>
																				) : null
																			) : (
																				PrimaryMenuLabel[0].label
																			)}
																		</span>
																	</div>
																	<span tw="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
																		<SelectorIcon tw="w-4 h-4 text-gray-400" />
																	</span>
																</button>
															) : (
																<Skeleton duration={2} width={209} height={38} tw="relative w-full pl-3 pr-10 py-2" />
															)}
														</span>

														<Transition
															show={isComponentVisible}
															enter="transition ease-out duration-100"
															enterFrom="transform opacity-0 scale-95"
															enterTo="transform opacity-100 scale-100"
															leave="transition ease-in duration-75"
															leaveFrom="transform opacity-100 scale-100"
															leaveTo="transform opacity-0 scale-95"
															tw="absolute mt-1 w-full rounded-md bg-white shadow-lg overflow-hidden"
														>
															{site && site?.results ? (
																site?.results.length > 0 ? (
																	<Scrollbars style={{ height: 180 }} universal>
																		<ul
																			tabIndex="-1"
																			role="listbox"
																			aria-labelledby="listbox-label"
																			tw="pt-2 text-base leading-6 overflow-auto focus:outline-none sm:text-sm sm:leading-5"
																		>
																			{site?.results.map((value, index) => {
																				return (
																					<li
																						key={index}
																						onClick={() => handleDropdownHandler(value?.id)}
																						id={`listbox-item-${index + 1}`}
																						role="option"
																						tw="select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
																					>
																						<div tw="flex items-center space-x-3">
																							{sitesLoaded ? (
																								<span
																									aria-label={value?.verified ? "Verified" : "Not Verified"}
																									css={[
																										tw`flex-shrink-0 inline-block h-2 w-2 rounded-full`,
																										value?.verified ? tw`bg-green-400` : tw`bg-red-400`
																									]}
																								/>
																							) : (
																								<Skeleton
																									circle={true}
																									duration={2}
																									width={10}
																									height={10}
																									className="relative top-0.5"
																								/>
																							)}

																							<span tw="font-medium block truncate text-gray-500">
																								{sitesLoaded ? value?.name : <Skeleton duration={2} width={130} />}
																							</span>
																						</div>
																					</li>
																				);
																			})}
																		</ul>
																	</Scrollbars>
																) : null
															) : null}

															<span tw="flex m-2 justify-center shadow-sm rounded-md">
																<Link href="/sites/add-new-site/" passHref>
																	<a tw="w-full flex items-center justify-center rounded-md px-3 py-2 border border-transparent text-sm leading-4 font-medium text-white bg-green-600 cursor-pointer transition ease-in-out duration-150 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
																		<PlusIcon tw="-ml-3 mr-2 h-4 w-4" />
																		{PrimaryMenuLabel[2].label}
																	</a>
																</Link>
															</span>
														</Transition>
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

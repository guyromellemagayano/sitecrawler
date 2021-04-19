// React
import { useState, useEffect } from "react";

// NextJS
import Link from "next/link";
import { useRouter } from "next/router";

// External
import { Transition } from "@headlessui/react";
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
const PlusSvg = loadable(() => import("src/components/svg/solid/PlusSvg"));
const SelectorSvg = loadable(() => import("src/components/svg/solid/SelectorSvg"));

const PrimaryMenu = ({ user, site }) => {
	const [componentReady, setComponentReady] = useState(false);
	const [selectedSite, setSelectedSite] = useState("");
	const [selectedSiteDetails, setSelectedSiteDetails] = useState([]);
	const [siteData, setSiteData] = useState([]);
	const [sitesLoaded, setSitesLoaded] = useState(false);
	const { ref, isComponentVisible, setIsComponentVisible } = useDropdownOutsideClick(false);

	const { query } = useRouter();
	const router = useRouter();

	useEffect(() => {
		if (
			site &&
			site !== undefined &&
			Object.keys(site).length > 0 &&
			query &&
			query !== undefined &&
			query.siteId !== ""
		) {
			setSiteData(site);
			handleSiteSelectOnLoad(query.siteId);
		}
	}, [site, query]);

	const handleSiteSelectOnLoad = (siteId) => {
		if (siteData && siteData.results !== undefined && Object.keys(siteData.results).length > 0) {
			for (let i = 0; i < siteData.results.length; i++) {
				if (siteData.results[i].id == siteId) {
					setSelectedSite(siteData.results[i].name);

					setTimeout(() => {
						router.replace(`/site/[siteId]/overview`, `/site/${siteId}/overview`);
					}, 500);
				}
			}
		}
	};

	const handleDropdownHandler = (siteId, verified) => {
		if (!verified) return false;

		handleSiteSelectOnLoad(siteId);
		setIsComponentVisible(!isComponentVisible);
	};

	useEffect(() => {
		if (user && siteData && siteData !== undefined && Object.keys(siteData).length > 0) {
			setTimeout(() => {
				setComponentReady(true);
			}, 500);
		}
	}, [user, siteData]);

	useEffect(() => {
		if (isComponentVisible) {
			setTimeout(() => {
				setSitesLoaded(true);
			}, 500);
		} else {
			setSitesLoaded(false);
		}
	}, [isComponentVisible]);

	useEffect(() => {
		if (siteData && siteData !== undefined && Object.keys(siteData).length > 0) {
			if (Object.keys(siteData.results).length > 0) {
				siteData.results
					.filter((result) => result.name === selectedSite)
					.map((val) => {
						setSelectedSiteDetails(val);
					});
			}
		}
	}, [selectedSite, siteData]);

	return (
		<div tw="flex-1 flex flex-col overflow-y-auto">
			<nav tw="flex-1 px-4">
				{DashboardPages.map((value, index) => {
					return (
						(user.group.name === "Agency" || (user.group.name !== "Agency" && value.slug !== "reports")) && (
							<div key={index} tw="mb-8">
								<h3 tw="mt-8 text-xs leading-4 font-semibold text-gray-200 uppercase tracking-wider">
									{componentReady ? value.category : <Skeleton duration={2} width={125} height={20} />}
								</h3>

								<div tw="my-3" role="group">
									{value.links && value.links !== undefined && Object.keys(value.links).length > 0 ? (
										value.links.map((value, index) => {
											return componentReady ? (
												<Link key={index} href={value.url} passHref>
													<a
														className="group"
														css={[
															tw`cursor-pointer`,
															router.pathname == value.url
																? tw`mt-1 flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-100 rounded-md bg-gray-1100`
																: tw`mt-1 flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-400 rounded-md hover:text-gray-100 hover:bg-gray-1100 focus:outline-none focus:bg-gray-1100 transition ease-in-out duration-150`
														]}
													>
														<svg tw="mr-3 h-6 w-5" stroke="currentColor" fill="none" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={value.icon} />
														</svg>
														<span>{value.title}</span>
													</a>
												</Link>
											) : (
												<span key={index} tw="mt-1 flex items-center px-3 py-2 space-x-3">
													<Skeleton circle={true} duration={2} width={20} height={20} />
													<Skeleton duration={2} width={150} height={20} />
												</span>
											);
										})
									) : componentReady ? (
										<div tw="space-y-1">
											<div ref={ref} tw="relative">
												<div tw="relative">
													<span tw="inline-block w-full rounded-md shadow-sm">
														<button
															type="button"
															aria-haspopup="listbox"
															aria-expanded="true"
															aria-labelledby="listbox-label"
															tw="cursor-default relative w-full rounded-md border border-gray-700 pl-3 pr-10 py-2 text-left bg-white focus:outline-none focus:ring-1 focus:ring-gray-1100 focus:border-gray-1100 transition ease-in-out duration-150 sm:text-sm sm:leading-5"
															onClick={() => setIsComponentVisible(!isComponentVisible)}
														>
															<div tw="flex items-center space-x-3">
																<span tw="block truncate text-gray-600">
																	{selectedSite !== "" ? (
																		selectedSiteDetails ? (
																			<div tw="flex items-center space-x-3">
																				<span
																					aria-label="Verified"
																					css={[
																						tw`flex-shrink-0 inline-block h-2 w-2 rounded-full`,
																						selectedSiteDetails.verified ? tw`bg-green-400` : tw`bg-red-400`
																					]}
																				></span>
																				<span
																					css={[
																						tw`font-medium block truncate`,
																						selectedSiteDetails.verified
																							? tw`text-gray-500`
																							: tw`text-gray-600 opacity-25`
																					]}
																				>
																					{selectedSite}
																				</span>
																			</div>
																		) : null
																	) : (
																		PrimaryMenuLabel[0].label
																	)}
																</span>
															</div>
															<span tw="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
																<SelectorSvg className={tw`w-4 h-4 text-gray-400`} />
															</span>
														</button>
													</span>

													<Transition
														show={isComponentVisible}
														enter="transition ease-out duration-100"
														enterFrom="transform opacity-0 scale-95"
														enterTo="transform opacity-100 scale-100"
														leave="transition ease-in duration-75"
														leaveFrom="transform opacity-100 scale-100"
														leaveTo="transform opacity-0 scale-95"
														className="absolute mt-1 w-full rounded-md bg-white shadow-lg overflow-hidden"
													>
														{siteData && siteData.results !== undefined ? (
															siteData.results.length > 0 ? (
																<ul
																	tabIndex="-1"
																	role="listbox"
																	aria-labelledby="listbox-label"
																	tw="max-h-60 pt-2 text-base leading-6 overflow-auto focus:outline-none sm:text-sm sm:leading-5"
																>
																	{siteData.results.map((value, index) => {
																		return (
																			<li
																				key={index}
																				onClick={() => handleDropdownHandler(value.id, value.verified)}
																				id={`listbox-item-${index + 1}`}
																				role="option"
																				css={[
																					tw`select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900`,
																					value.verified ? tw`cursor-pointer` : tw`cursor-not-allowed`
																				]}
																			>
																				<div tw="flex items-center space-x-3">
																					{sitesLoaded ? (
																						<>
																							<span
																								aria-label="Verified"
																								css={[
																									tw`flex-shrink-0 inline-block h-2 w-2 rounded-full`,
																									value.verified ? tw`bg-green-400` : tw`bg-red-400`
																								]}
																							></span>
																							<span
																								css={[
																									tw`font-medium block truncate`,
																									value.verified ? tw`text-gray-500` : tw`text-gray-600 opacity-25`
																								]}
																							>
																								{value.name}
																							</span>
																						</>
																					) : (
																						<div tw="flex items-center space-x-3 my-1">
																							<div>
																								<Skeleton circle={true} duration={2} width={20} height={20} />
																							</div>
																							<div tw="ml-3">
																								<Skeleton duration={2} width={145} />
																							</div>
																						</div>
																					)}
																				</div>
																			</li>
																		);
																	})}
																</ul>
															) : null
														) : null}

														<span tw="flex m-2 justify-center shadow-sm rounded-md">
															<Link href="/add-site/information">
																<a tw="w-full flex items-center justify-center rounded-md px-3 py-2 border border-transparent text-sm leading-4 font-medium text-white bg-green-600 cursor-pointer transition ease-in-out duration-150 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
																	<PlusSvg className={tw`-ml-3 mr-2 h-4 w-4`} />
																	{PrimaryMenuLabel[2].label}
																</a>
															</Link>
														</span>
													</Transition>
												</div>
											</div>
										</div>
									) : (
										<div tw="space-y-1">
											<span tw="mt-1 flex items-center py-2">
												<Skeleton duration={2} width={220} height={35} />
											</span>
										</div>
									)}
								</div>
							</div>
						)
					);
				})}
			</nav>
		</div>
	);
};

PrimaryMenu.propTypes = {};

export default PrimaryMenu;

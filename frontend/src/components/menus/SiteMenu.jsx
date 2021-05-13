// React
import { useState, useEffect } from "react";

// NextJS
import { useRouter } from "next/router";
import Link from "next/link";

// External
import { PlusIcon, SelectorIcon } from "@heroicons/react/solid";
import { Transition } from "@headlessui/react";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import tw from "twin.macro";

// JSON
import SitePages from "public/data/site-pages.json";
import PrimaryMenuLabel from "public/labels/components/sidebar/PrimaryMenu.json";

// Hooks
import { useScan, useStats } from "src/hooks/useSite";
import useDropdownOutsideClick from "src/hooks/useDropdownOutsideClick";

const SiteMenu = ({ user, crawlFinished, site }) => {
	const [componentReady, setComponentReady] = useState(false);
	const [scanObjId, setScanObjId] = useState(0);
	const [selectedSite, setSelectedSite] = useState("");
	const [selectedSiteDetails, setSelectedSiteDetails] = useState([]);
	const [sid, setSid] = useState(0);
	const [sitesLoaded, setSitesLoaded] = useState(false);
	const { ref, isComponentVisible, setIsComponentVisible } = useDropdownOutsideClick(false);

	let currentScanResults = [];
	let previousScanResults = [];

	const { query, asPath } = useRouter();
	const router = useRouter();

	const { scan: scan } = useScan({
		querySid: sid
	});

	useEffect(() => {
		if (query.siteId && query.siteId !== undefined && query.siteId !== "") {
			setSid(query.siteId);
		}
	}, []);

	useEffect(() => {
		if (scan && scan !== undefined && Object.keys(scan).length > 0) {
			if (scan.results && scan.results !== undefined && Object.keys(scan.results).length > 0) {
				currentScanResults = scan.results.find((e) => e.finished_at === null);
				previousScanResults = scan.results.find((e) => e.finished_at !== null);

				if (currentScanResults !== [] || currentScanResults !== undefined) {
					if (!crawlFinished) {
						if (previousScanResults !== undefined) {
							setScanObjId(previousScanResults.id);
						} else {
							setScanObjId(currentScanResults.id);
						}
					} else {
						if (previousScanResults !== undefined) {
							setScanObjId(previousScanResults.id);
						} else {
							setScanObjId(currentScanResults.id);
						}
					}
				}
			}
		}
	}, [crawlFinished, scan, scanObjId]);

	const { stats: stats } = useStats({
		querySid: sid,
		scanObjId: scanObjId && scanObjId !== undefined && scanObjId !== 0 && scanObjId,
		refreshInterval: crawlFinished ? 0 : 1000
	});

	useEffect(() => {
		if (site && site !== undefined && Object.keys(site).length > 0 && sid && sid !== undefined && sid !== "") {
			handleSiteSelectOnLoad(site, sid);
		}

		if (
			user &&
			site &&
			site !== undefined &&
			Object.keys(site).length > 0 &&
			stats &&
			stats !== undefined &&
			Object.keys(stats).length > 0
		) {
			setTimeout(() => {
				setComponentReady(true);
			}, 500);
		}
	}, [user, site, stats, sid]);

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
		if (site && site !== undefined && Object.keys(site).length > 0) {
			if (site.results && site.results !== undefined && Object.keys(site.results).length > 0) {
				site.results
					.filter((result) => result.name === selectedSite)
					.map((val) => {
						setSelectedSiteDetails(val);
					});
			}
		}

		if (selectedSite === "" && sid !== 0) {
			if (site && site !== undefined && Object.keys(site).length > 0) {
				if (site.results && site.results !== undefined && Object.keys(site.results).length > 0) {
					let currentSite = site.results.find((result) => result.id === parseInt(sid));

					if (currentSite !== undefined) {
						setSelectedSite(currentSite.name);
					}
				}
			}
		}
	}, [selectedSite, site, sid]);

	const handleSiteSelectOnLoad = (siteId) => {
		if (site && site.results !== undefined && Object.keys(site.results).length > 0) {
			for (let i = 0; i < site.results.length; i++) {
				if (site.results[i].id == siteId) {
					setSelectedSite(site.results[i].name);

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

	return (
		<div tw="flex-1 flex flex-col overflow-y-auto">
			<nav tw="flex-1 px-4">
				{SitePages.map((value, index) => {
					return (
						<div key={index} tw="mb-8">
							<h3 tw="mt-8 text-xs leading-4 font-semibold text-gray-200 uppercase tracking-wider">
								{componentReady ? value.category : <Skeleton duration={2} width={125} height={20} />}
							</h3>

							<div tw="my-3" role="group">
								{value.links && value.links !== undefined && Object.keys(value.links).length > 0 ? (
									value.links.map((value2, index) => {
										const hrefVal = "/site/[siteId]" + value2.url;
										const asVal = "/site/" + sid + value2.url;

										return componentReady ? (
											value2.slug !== "go-back-to-sites" ? (
												<Link key={index} href={hrefVal} as={asVal} passHref>
													<a
														className="group"
														css={[
															tw`cursor-pointer`,
															asPath.includes("/site/" + sid + value2.url)
																? tw`mt-1 flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-100 rounded-md bg-gray-1100`
																: tw`mt-1 flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-400 rounded-md hover:text-gray-100 hover:bg-gray-1100 focus:outline-none focus:bg-gray-1100`
														]}
													>
														<svg tw="mr-3 h-6 w-5" stroke="currentColor" fill="none" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={value2.icon} />
															{value2.icon2 ? (
																<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={value2.icon2} />
															) : null}
														</svg>
														<span>{value2.title ? value2.title : null}</span>
														{value2.url === "/links" &&
															stats &&
															stats !== undefined &&
															Object.keys(stats).length > 0 && (
																<span tw="ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-white text-black">
																	{stats.num_links ? stats.num_links : null}
																</span>
															)}
														{value2.url === "/pages" &&
															stats &&
															stats !== undefined &&
															Object.keys(stats).length > 0 && (
																<span tw="ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-white text-black">
																	{stats.num_pages ? stats.num_pages : null}
																</span>
															)}
														{value2.url === "/seo" && stats && stats !== undefined && Object.keys(stats).length > 0 && (
															<span tw="ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-white text-black">
																{stats.num_pages ? stats.num_pages : null}
															</span>
														)}
														{value2.url === "/images" &&
															stats &&
															stats !== undefined &&
															Object.keys(stats).length > 0 && (
																<span tw="ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-white text-black">
																	{stats.num_images ? stats.num_images : null}
																</span>
															)}
														{value2.url === "/stylesheets" &&
															stats &&
															stats !== undefined &&
															Object.keys(stats).length > 0 && (
																<span tw="ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-white text-black">
																	{stats.num_stylesheets ? stats.num_stylesheets : null}
																</span>
															)}
														{value2.url === "/scripts" &&
															stats &&
															stats !== undefined &&
															Object.keys(stats).length > 0 && (
																<span tw="ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-white text-black">
																	{stats.num_scripts ? stats.num_scripts : null}
																</span>
															)}
													</a>
												</Link>
											) : (
												<Link key={index} href={value2.url} passHref>
													<a
														className="group"
														tw="cursor-pointer mt-1 flex items-center py-2 text-sm leading-5 font-medium text-gray-400 rounded-md hover:text-gray-100 focus:outline-none focus:text-white"
													>
														<svg tw="mr-3 h-6 w-5" stroke="currentColor" fill="none" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={value2.icon} />
															{value2.icon2 ? (
																<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={value2.icon2} />
															) : null}
														</svg>
														<span>{value2.title ? value2.title : null}</span>
													</a>
												</Link>
											)
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
														tw="cursor-default relative w-full rounded-md border border-gray-700 pl-3 pr-10 py-2 text-left bg-white focus:outline-none focus:ring-1 focus:ring-gray-1100 focus:border-gray-1100 sm:text-sm sm:leading-5"
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
															<SelectorIcon tw="w-4 h-4 text-gray-400" />
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
													{site && site.results !== undefined ? (
														site.results.length > 0 ? (
															<ul
																tabIndex="-1"
																role="listbox"
																aria-labelledby="listbox-label"
																tw="max-h-60 pt-2 text-base leading-6 overflow-auto focus:outline-none sm:text-sm sm:leading-5"
															>
																{site.results.map((value, index) => {
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
																					<span
																						aria-label="Verified"
																						css={[
																							tw`flex-shrink-0 inline-block h-2 w-2 rounded-full`,
																							value.verified ? tw`bg-green-400` : tw`bg-red-400`
																						]}
																					/>
																				) : (
																					<Skeleton circle={true} duration={2} width={10} height={10} />
																				)}

																				<span
																					css={[
																						tw`font-medium block truncate`,
																						value.verified ? tw`text-gray-500` : tw`text-gray-600 opacity-25`
																					]}
																				>
																					{sitesLoaded ? value.name : <Skeleton duration={2} width={150} />}
																				</span>
																			</div>
																		</li>
																	);
																})}
															</ul>
														) : null
													) : null}

													<span tw="flex m-2 justify-center shadow-sm rounded-md">
														<Link href="/add-site/information">
															<a tw="w-full flex items-center justify-center rounded-md px-3 py-2 border border-transparent text-sm leading-4 font-medium text-white bg-green-600 cursor-pointer hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
																<PlusIcon tw="-ml-3 mr-2 h-4 w-4" />
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
					);
				})}
			</nav>
		</div>
	);
};

SiteMenu.propTypes = {};

export default SiteMenu;
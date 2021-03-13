// React
import React, { useState, useEffect } from 'react';

// NextJS
import Link from 'next/link';
import Router, { useRouter } from 'next/router';

// External
import { Transition } from '@headlessui/react';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import tw from 'twin.macro';

// JSON
import DashboardPages from 'public/data/dashboard-pages.json';
import PrimaryMenuLabel from 'public/label/components/sidebar/PrimaryMenu.json';

// Hooks
import useDropdownOutsideClick from 'src/hooks/useDropdownOutsideClick';

// Components
import PlusSvg from 'src/components/svg/PlusSvg';
import SelectorSvg from 'src/components/svg/SelectorSvg';

const MobilePrimaryMenu = ({ user, userLoaded, site, sitesLoaded }) => {
	const [selectedSite, setSelectedSite] = useState(null);
	const [pagesLoaded, setPagesLoaded] = useState(false);
	const {
		ref,
		isComponentVisible,
		setIsComponentVisible
	} = useDropdownOutsideClick(false);

	const { query } = useRouter();

	const handleDropdownToggle = () => {
		setIsComponentVisible(!isComponentVisible);
	};

	const handleSiteSelectOnLoad = (siteId) => {
		if (site == undefined) return false;

		for (let i = 0; i < site.results.length; i++) {
			if (site.results[i].id == siteId) setSelectedSite(site.results[i]);
		}
	};

	const handleDropdownHandler = (siteId, verified) => {
		if (!verified) return false;

		Router.push(
			`/dashboard/site/[siteId]/overview`,
			`/dashboard/site/${siteId}/overview`
		);

		setTimeout(() => {
			handleSiteSelectOnLoad(siteId);
			setIsComponentVisible(!isComponentVisible);
		}, 250);
	};

	const getSiteResults = (site) => {
		if (site && site.results.length) {
			if (sitesLoaded) {
				if (selectedSite) {
					return selectedSite;
				} else {
					return PrimaryMenuLabel[0].label;
				}
			} else {
				return (
					<div tw="flex items-center">
						<div>
							<Skeleton circle={true} duration={2} width={5} height={5} />
						</div>
						<div tw="ml-3">
							<Skeleton duration={2} width={120} />
							<Skeleton duration={2} width={120} />
						</div>
					</div>
				);
			}
		} else {
			return PrimaryMenuLabel[1].label;
		}
	};

	useEffect(() => {
		handleSiteSelectOnLoad(query.siteId);
	}, [site, query]);

	return (
		<nav tw="flex-1 px-4 bg-gray-1000">
			{DashboardPages.map((val, key) => {
				setTimeout(() => {
					setPagesLoaded(true);
				}, 1500);

				return (
					(user.group.name === 'Agency' ||
						(user.group.name !== 'Agency' && val.slug !== 'reports')) && (
						<div key={key} tw="mb-8">
							{pagesLoaded ? (
								<h3 tw="mt-8 text-xs leading-4 font-semibold text-gray-200 uppercase tracking-wider">
									{val.category}
								</h3>
							) : (
								<span tw="mt-8 block">
									<Skeleton duration={2} width={100} />
								</span>
							)}

							{pagesLoaded ? (
								<div tw="my-3" role="group">
									{val.links ? (
										val.links.map((val2, key) => {
											return (
												<Link key={key} href={val2.url}>
													<a
														className="group"
														css={[
															tw`cursor-pointer`,
															useRouter().pathname.indexOf(val2.url) == 0
																? tw`mt-1 flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-100 rounded-md bg-gray-1100`
																: tw`mt-1 flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-400 rounded-md hover:text-gray-100 hover:bg-gray-1100 focus:outline-none focus:bg-gray-1100 transition ease-in-out duration-150`
														]}
													>
														<svg
															tw="mr-3 h-6 w-5"
															stroke="currentColor"
															fill="none"
															viewBox="0 0 24 24"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth="2"
																d={val2.icon}
															/>
														</svg>
														<span>{val2.title}</span>
													</a>
												</Link>
											);
										})
									) : (
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
															onClick={handleDropdownToggle}
														>
															<div tw="flex items-center space-x-3">
																<span tw="block truncate text-gray-600">
																	{getSiteResults(site)}
																</span>
															</div>
															<span tw="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
																<SelectorSvg
																	className={tw`w-4 h-4 text-gray-400`}
																/>
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
													>
														<div tw="absolute mt-1 w-full rounded-md bg-white shadow-lg overflow-hidden">
															{site && site.results.length ? (
																<ul
																	tabIndex="-1"
																	role="listbox"
																	aria-labelledby="listbox-label"
																	tw="max-h-60 py-2 text-base leading-6 overflow-auto focus:outline-none sm:text-sm sm:leading-5"
																>
																	{site.results.map((val, key) => {
																		return (
																			<li
																				key={key}
																				onClick={() =>
																					handleDropdownHandler(
																						val.id,
																						val.verified
																					)
																				}
																				id={`listbox-item-${key}`}
																				role="option"
																				css={[
																					tw`hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900 select-none relative py-2 pl-3 pr-9`,
																					val.verified
																						? tw`cursor-pointer`
																						: tw`cursor-not-allowed`
																				]}
																			>
																				<div tw="flex items-center space-x-3">
																					<span
																						aria-label="Online"
																						css={[
																							tw`flex-shrink-0 inline-block h-2 w-2 rounded-full`,
																							val.verified
																								? tw`bg-green-400`
																								: tw`bg-red-400`
																						]}
																					></span>
																					<span tw="font-normal block truncate">
																						{val.name}
																					</span>
																				</div>
																			</li>
																		);
																	})}
																</ul>
															) : null}

															<span tw="flex m-2 justify-center shadow-sm rounded-md">
																<Link href="/dashboard/sites/information">
																	<a tw="w-full flex items-center justify-center rounded-md px-3 py-2 border border-transparent text-sm leading-4 font-medium text-white bg-green-600 cursor-pointer transition ease-in-out duration-150 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
																		<PlusSvg
																			className={tw`-ml-3 mr-2 h-4 w-4`}
																		/>
																		{PrimaryMenuLabel[2].label}
																	</a>
																</Link>
															</span>
														</div>
													</Transition>
												</div>
											</div>
										</div>
									)}
								</div>
							) : (
								<div tw="my-3">
									<Skeleton duration={2} width={175} height={30} />
								</div>
							)}
						</div>
					)
				);
			})}
		</nav>
	);
};

PrimaryMenu.propTypes = {};

export default MobilePrimaryMenu;

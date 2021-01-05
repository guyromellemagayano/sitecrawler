// React
import React, { useState, Fragment, useEffect } from 'react';

// NextJS
import Link from 'next/link';
import Router, { useRouter } from 'next/router';

// External
import { Transition } from '@tailwindui/react';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';
import useSWR from 'swr';

// JSON
import DashboardPages from 'public/data/dashboard-pages.json';
import PrimaryMenuLabel from 'public/label/components/sidebar/PrimaryMenu.json';

// Hooks
import useDropdownOutsideClick from 'src/hooks/useDropdownOutsideClick';
import useFetcher from 'src/hooks/useFetcher';
import useUser from 'src/hooks/useUser';

const MobilePrimaryMenuDiv = styled.nav``;

const MobilePrimaryMenu = () => {
	const [selectedSite, setSelectedSite] = useState(null);
	const {
		ref,
		isComponentVisible,
		setIsComponentVisible
	} = useDropdownOutsideClick(false);

	const siteApiEndpoint = '/api/site/';

	const setDropdownToggle = () => {
		setIsComponentVisible(!isComponentVisible);
	};

	const { query } = useRouter();

	const { user: user } = useUser({
		redirectTo: '/',
		redirectIfFound: false
	});

	const { data: site } = useSWR(siteApiEndpoint, useFetcher);

	const siteSelectOnLoad = (siteId = query.siteId) => {
		if (site == undefined) return false;

		for (let i = 0; i < site.results.length; i++) {
			if (site.results[i].id == siteId) setSelectedSite(site.results[i]);
		}
	};

	const dropdownHandler = (siteId, verified) => {
		if (!verified) return false;

		Router.push(
			`/dashboard/site/[siteId]/overview`,
			`/dashboard/site/${siteId}/overview`
		);

		setTimeout(() => {
			siteSelectOnLoad(siteId);
			setIsComponentVisible(!isComponentVisible);
		}, 250);
	};

	useEffect(() => {
		siteSelectOnLoad();
	}, [site]);

	return user && site ? (
		<MobilePrimaryMenuDiv className="flex-1 px-4 bg-gray-1000">
			{DashboardPages.map((val, key) => {
				return (
					<Fragment key={key}>
						{user.group.id === 3 ||
						(user.group.id !== 3 && val.slug !== 'reports') ? (
							<Fragment>
								<h3
									className={`${val.slug}-headline mt-8 text-xs leading-4 font-semibold text-gray-300 uppercase tracking-wider`}
								>
									{val.category}
								</h3>
								<div
									className="my-3"
									role="group"
									aria-labelledby={`${val.slug}-headline`}
								>
									{val.links ? (
										val.links.map((val2, key) => {
											return (
												<Link key={key} href={val2.url}>
													<a
														className={`${
															useRouter().pathname.indexOf(val2.url) == 0
																? 'group mt-1 flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-100 rounded-md bg-gray-1100'
																: 'mt-1 group flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-500 rounded-md hover:text-gray-100 hover:bg-gray-1100 focus:outline-none focus:bg-gray-1100 transition ease-in-out duration-150'
														}`}
													>
														<svg
															className="mr-3 h-6 w-5"
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
														{val2.url === '/dashboard/sites' && (
															<span className="ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-white text-black transition ease-in-out duration-150">
																{site.count}
															</span>
														)}
													</a>
												</Link>
											);
										})
									) : (
										<div className="space-y-1">
											<div ref={ref} className="relative">
												<div className="relative">
													<span className="inline-block w-full rounded-md shadow-sm">
														<button
															type="button"
															aria-haspopup="listbox"
															aria-expanded="true"
															aria-labelledby="listbox-label"
															className="cursor-default relative w-full rounded-md border border-gray-700 pl-3 pr-10 py-2 text-left focus:outline-none transition ease-in-out duration-150 sm:text-sm sm:leading-5"
															onClick={setDropdownToggle}
														>
															<div className="flex items-center space-x-3">
																<span className="block truncate text-gray-600">
																	{PrimaryMenuLabel[0].label}
																</span>
															</div>
															<span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
																<svg
																	className="h-5 w-5 text-gray-400"
																	viewBox="0 0 20 20"
																	fill="none"
																	stroke="currentColor"
																>
																	<path
																		d="M7 7l3-3 3 3m0 6l-3 3-3-3"
																		strokeWidth="1.5"
																		strokeLinecap="round"
																		strokeLinejoin="round"
																	/>
																</svg>
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
														<div className="absolute mt-1 w-full rounded-md bg-white shadow-lg overflow-hidden">
															{site && site.results.length ? (
																<>
																	<ul
																		tabIndex="-1"
																		role="listbox"
																		aria-labelledby="listbox-label"
																		aria-activedescendant="listbox-item-3"
																		className="max-h-xs py-2 rounded-md text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5"
																	>
																		{site.results.map((val, key) => {
																			return (
																				<li
																					key={key}
																					onClick={() =>
																						dropdownHandler(
																							val.id,
																							val.verified
																						)
																					}
																					id={`listbox-item-${key}`}
																					role="option"
																					className={`hover:text-white hover:bg-indigo-600 text-gray-900 ${
																						val.verified
																							? 'cursor-pointer'
																							: 'cursor-not-allowed'
																					} select-none relative py-2 pl-3 pr-9`}
																				>
																					<div className="flex items-center space-x-3">
																						<span
																							aria-label="Online"
																							className={`${
																								val.verified
																									? 'bg-green-400'
																									: 'bg-red-400'
																							} flex-shrink-0 inline-block h-2 w-2 rounded-full`}
																						></span>
																						<span className="font-normal block truncate">
																							{val.name}
																						</span>
																					</div>
																				</li>
																			);
																		})}
																	</ul>
																	<span className="flex m-2 justify-center shadow-sm rounded-md">
																		<Link href="/dashboard/sites/information">
																			<a className="w-full flex items-center justify-center rounded-md px-3 py-2 border border-transparent text-sm leading-4 font-medium text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:shadow-xs-outline-green focus:border-green-700 active:bg-green-700 transition ease-in-out duration-150">
																				<svg
																					className="-ml-3 mr-2 h-4 w-4"
																					viewBox="0 0 20 20"
																					fill="currentColor"
																				>
																					<path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
																				</svg>
																				{PrimaryMenuLabel[1].label}
																			</a>
																		</Link>
																	</span>
																</>
															) : (
																<span className="flex m-2 justify-center shadow-sm rounded-md">
																	<Link href="/dashboard/sites/information">
																		<a className="w-full flex items-center justify-center rounded-md px-3 py-2 border border-transparent text-sm leading-4 font-medium text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:shadow-xs-outline-green focus:border-green-700 active:bg-green-700 transition ease-in-out duration-150">
																			<svg
																				className="-ml-3 mr-2 h-4 w-4"
																				viewBox="0 0 20 20"
																				fill="currentColor"
																			>
																				<path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
																			</svg>
																			{PrimaryMenuLabel[1].label}
																		</a>
																	</Link>
																</span>
															)}
														</div>
													</Transition>
												</div>
											</div>
										</div>
									)}
								</div>
							</Fragment>
						) : null}
					</Fragment>
				);
			})}
		</MobilePrimaryMenuDiv>
	) : (
		<MobilePrimaryMenuDiv className="mt-5 flex-1 px-2 bg-gray-1000">
			{[...Array(3)].map((index) => {
				return (
					<a
						key={index}
						className="group ml-1 mt-2 flex justify-start items-center"
					>
						<Skeleton circle={true} duration={2} width={30} height={30} />
						<span className="ml-3">
							<Skeleton duration={2} width={150} />
						</span>
					</a>
				);
			})}
		</MobilePrimaryMenuDiv>
	);
};

MobilePrimaryMenu.propTypes = {
	selectedSite: PropTypes.string
};

export default MobilePrimaryMenu;

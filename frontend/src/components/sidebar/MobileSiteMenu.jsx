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
import PrimaryMenuLabel from 'public/label/components/sidebar/PrimaryMenu.json';
import SitePages from 'public/data/site-pages.json';

// Hooks
import useDropdownOutsideClick from 'src/hooks/useDropdownOutsideClick';
import useFetcher from 'src/hooks/useFetcher';

// Helpers
import { removeURLParameter } from 'src/helpers/functions';

const MobileSiteMenuDiv = styled.nav`
	div[aria-labelledby='navigation-headline'] {
		.back-nav {
			margin-top: 2rem;
			margin-bottom: 0.5rem;
		}
	}
`;

const MobileSiteMenu = (props) => {
	const [selectedSite, setSelectedSite] = useState(null);
	const {
		ref,
		isComponentVisible,
		setIsComponentVisible
	} = useDropdownOutsideClick(false);

	const setDropdownToggle = () => {
		setIsComponentVisible(!isComponentVisible);
	};

	const { query, asPath } = useRouter();

	const sitesApiEndpoint =
		props.page !== undefined ? '/api/site/?page=' + props.page : '/api/site/';

	const { data: user } = useSWR('/api/auth/user/', useFetcher);
	const { data: scan } = useSWR(
		() =>
			query.siteId
				? `/api/site/${query.siteId}/scan/?ordering=-finished_at`
				: null,
		useFetcher
	);

	let scanObjId = '';

	if (scan) {
		let scanObj = [];

		scan.results.map((val) => {
			scanObj.push(val);
			return scanObj;
		});

		scanObj.map((val, index) => {
			if (index == 0) scanObjId = val.id;

			return scanObjId;
		});
	}

	const { data: stats } = useSWR(
		() =>
			query.siteId && scanObjId
				? `/api/site/${query.siteId}/scan/${scanObjId}/`
				: null,
		getFetcher
	);

	const { data: site } = useSWR(sitesApiEndpoint, useFetcher);

	const siteSelectOnLoad = (siteId = query.siteId) => {
		if (site == undefined) return false;

		for (let i = 0; i < site.results.length; i++) {
			if (site.results[i].id == siteId) setSelectedSite(site.results[i]);
		}
	};

	const dropdownHandler = (siteId, verified) => {
		if (!verified) return false;

		const newPath = removeURLParameter(asPath, 'page');
		const pageName = newPath.split('?')[0].split('/')[4];
		const pageParams = newPath.split('?')[1];

		Router.push(
			`/dashboard/site/[siteId]/${pageName}`,
			`/dashboard/site/${siteId}/${pageName}${
				pageParams !== undefined ? '?' + pageParams : ''
			}`
		);

		setTimeout(() => {
			siteSelectOnLoad(siteId);
			setIsComponentVisible(!isComponentVisible);
		}, 250);
	};

	useEffect(() => {
		if (stats && stats.finished_at)
			props.crawlableHandler !== undefined && props.crawlableHandler(true);
		else if (stats && stats.started_at && stats.finished_at == null)
			props.crawlableHandler !== undefined && props.crawlableHandler(false);
	}, [stats]);

	useEffect(() => {
		siteSelectOnLoad();
	}, [site]);

	return user && stats && site && scan && selectedSite !== undefined ? (
		<MobileSiteMenuDiv className="flex-1 px-4 bg-gray-1000">
			{SitePages.map((val, key) => {
				return (
					<Fragment key={key}>
						{val.slug !== 'navigation' && val.slug !== 'dashboard' ? (
							<>
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
									{val.links.map((val2, key) => {
										const hrefVal =
											val2.url.indexOf('/dashboard/sites') > -1
												? val2.url
												: `/dashboard/site/[siteId]${val2.url}`;
										const asVal =
											val2.url.indexOf('/dashboard/sites') > -1
												? val2.url
												: '/dashboard/site/' + query.siteId + val2.url;

										if (
											user.permissions.includes('can_see_images') &&
											user.permissions.includes('can_see_pages') &&
											user.permissions.includes('can_see_scripts') &&
											user.permissions.includes('can_see_stylesheets') &&
											user.permissions.includes('can_start_scan')
										) {
											return (
												<Link key={key} href={hrefVal} as={asVal}>
													<a
														className={`${
															asPath.includes(
																'/dashboard/site/' + query.siteId + val2.url
															)
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
															{val2.icon2 ? (
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	strokeWidth="2"
																	d={val2.icon2}
																/>
															) : null}
														</svg>
														<span>{val2.title}</span>
														{val2.url === '/links' && (
															<span className="ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-white text-black transition ease-in-out duration-150">
																{stats.num_links}
															</span>
														)}
														{val2.url === '/pages' && (
															<span className="ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-white text-black transition ease-in-out duration-150">
																{stats.num_pages}
															</span>
														)}
														{val2.url === '/seo' && (
															<span className="ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-white text-black transition ease-in-out duration-150">
																{stats.num_pages}
															</span>
														)}
														{val2.url === '/images' && (
															<span className="ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-white text-black transition ease-in-out duration-150">
																{stats.num_images}
															</span>
														)}
														{val2.url === '/stylesheets' && (
															<span className="ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-white text-black transition ease-in-out duration-150">
																{stats.num_stylesheets}
															</span>
														)}
														{val2.url === '/scripts' && (
															<span className="ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-white text-black transition ease-in-out duration-150">
																{stats.num_scripts}
															</span>
														)}
													</a>
												</Link>
											);
										} else {
											if (
												val2.slug !== 'images' &&
												val2.slug !== 'seo' &&
												val2.slug !== 'pages'
											) {
												return (
													<Link key={key} href={hrefVal} as={asVal}>
														<a
															className={`${
																asPath.includes(
																	'/dashboard/site/' + query.siteId + val2.url
																)
																	? 'group mt-1 flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-500 rounded-md bg-gray-1100'
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
																{val2.icon2 ? (
																	<path
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		strokeWidth="2"
																		d={val2.icon2}
																	/>
																) : null}
															</svg>
															<span>{val2.title}</span>
															{val2.url === '/links' && (
																<span className="ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-white text-black transition ease-in-out duration-150">
																	{stats.num_links}
																</span>
															)}
															{val2.url === '/pages' && (
																<span className="ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-white text-black transition ease-in-out duration-150">
																	{stats.num_pages}
																</span>
															)}
															{val2.url === '/seo' && (
																<span className="ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-white text-black transition ease-in-out duration-150">
																	{stats.num_pages}
																</span>
															)}
															{val2.url === '/images' && (
																<span className="ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-white text-black transition ease-in-out duration-150">
																	{stats.num_images}
																</span>
															)}
															{val2.url === '/stylesheets' && (
																<span className="ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-white text-black transition ease-in-out duration-150">
																	{stats.num_stylesheets}
																</span>
															)}
															{val2.url === '/scripts' && (
																<span className="ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-white text-black transition ease-in-out duration-150">
																	{stats.num_scripts}
																</span>
															)}
														</a>
													</Link>
												);
											}
										}
									})}
								</div>
							</>
						) : (
							<div
								className="mt-1"
								role="group"
								aria-labelledby={`${val.slug}-headline`}
							>
								{val.links.map((val2, key) => {
									const hrefVal =
										val2.url.indexOf('/dashboard/sites') > -1
											? val2.url
											: `/dashboard/site/[siteId]${val2.url}`;
									const asVal =
										val2.url.indexOf('/dashboard/sites') > -1
											? val2.url
											: '/dashboard/site/' + query.siteId + val2.url;

									return (
										<Fragment key={key}>
											<Link href={hrefVal} as={asVal}>
												<a
													className={`${
														asPath.includes(
															'/dashboard/site/' + query.siteId + val2.url
														)
															? 'group mt-2 flex items-center text-sm leading-5 font-medium text-gray-100'
															: 'back-nav mt-2 group flex items-center text-sm leading-5 font-medium text-gray-500 rounded-md hover:text-gray-100 transition ease-in-out duration-150'
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
														{val2.icon2 ? (
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth="2"
																d={val2.icon2}
															/>
														) : null}
													</svg>
													<span>{val2.title}</span>
													{val2.url === '/links' && (
														<span className="ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-purple-100 text-purple-800 transition ease-in-out duration-150">
															{stats.num_links}
														</span>
													)}
													{val2.url === '/pages' && (
														<span className="ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-purple-100 text-purple-800 transition ease-in-out duration-150">
															{stats.num_pages}
														</span>
													)}
												</a>
											</Link>
											{val.slug !== 'dashboard' ? (
												<div className="text-left py-4">
													<div className="space-y-1">
														<div ref={ref} className="relative">
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
																		<span
																			aria-label="Online"
																			className={`${
																				selectedSite.verified
																					? 'bg-green-400'
																					: 'bg-red-400'
																			} flex-shrink-0 inline-block h-2 w-2 rounded-full`}
																		></span>
																		<span className="block truncate text-gray-600">
																			{selectedSite.name}
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
																<div className="absolute mt-1 w-full rounded-md bg-white shadow-lg">
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
																					{selectedSite.id == val.id ? (
																						<span className="hover:text-white text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4">
																							<svg
																								className="h-5 w-5"
																								viewBox="0 0 20 20"
																								fill="currentColor"
																							>
																								<path
																									fillRule="evenodd"
																									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
																									clipRule="evenodd"
																								/>
																							</svg>
																						</span>
																					) : null}
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
																</div>
															</Transition>
														</div>
													</div>
												</div>
											) : null}
										</Fragment>
									);
								})}
							</div>
						)}
					</Fragment>
				);
			})}
		</MobileSiteMenuDiv>
	) : (
		<MobileSiteMenuDiv className="mt-5 flex-1 px-2 bg-gray-1000">
			{[...Array(5)].map((index) => {
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
		</MobileSiteMenuDiv>
	);
};

MobileSiteMenu.getInitialProps = ({ query }) => {
	return {
		page: query.page
	};
};

MobileSiteMenu.propTypes = {
	selectedSite: PropTypes.string
};

export default MobileSiteMenu;

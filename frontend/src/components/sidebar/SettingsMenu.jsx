// React
import { useState, useEffect } from 'react';

// NextJS
import { useRouter } from 'next/router';
import Link from 'next/link';

// External
import { Transition } from '@headlessui/react';
import loadable from '@loadable/component';
import PropTypes from 'prop-types';
import tw from 'twin.macro';
import useSWR from 'swr';

// JSON
import SettingsPages from 'public/data/settings-pages.json';
import PrimaryMenuLabel from 'public/labels/components/sidebar/PrimaryMenu.json';

// Hooks
import useDropdownOutsideClick from 'src/hooks/useDropdownOutsideClick';
import useFetcher from 'src/hooks/useFetcher';

// Components
const PlusSvg = loadable(() => import('src/components/svg/PlusSvg'));
const SelectorSvg = loadable(() => import('src/components/svg/SelectorSvg'));
const SettingsMenuSkeleton = loadable(() =>
	import('src/components/skeletons/SettingsMenuSkeleton')
);
const SidebarSiteResultsSkeleton = loadable(() =>
	import('src/components/skeletons/SidebarSiteResultsSkeleton')
);

const SettingsMenu = () => {
	const [sitesLoaded, setSitesLoaded] = useState(false);
	const [userLoaded, setUserLoaded] = useState(false);
	const {
		ref,
		isComponentVisible,
		setIsComponentVisible
	} = useDropdownOutsideClick(false);

	const userApiEndpoint = '/api/auth/user/';
	const siteApiEndpoint = '/api/site/';

	const { query } = useRouter();

	const { data: user } = useSWR(userApiEndpoint, useFetcher);
	const { data: site } = useSWR(siteApiEndpoint, useFetcher);

	const handleDropdownToggle = () => {
		setIsComponentVisible(!isComponentVisible);
	};

	const handleDropdownHandler = (siteId, verified) => {
		if (!verified) return false;

		router.push(
			`/dashboard/site/[siteId]/overview`,
			`/dashboard/site/${siteId}/overview`
		);

		setTimeout(() => {
			// handleSiteSelectOnLoad(siteId);
			setIsComponentVisible(!isComponentVisible);
		}, 500);
	};

	const getSiteResults = (site) => {
		if (site && site.results !== undefined) {
			return PrimaryMenuLabel[0].label;
		}
	};

	useEffect(() => {
		if (user && user !== undefined) {
			setTimeout(() => {
				setUserLoaded(true);
			}, 500);
		}
	}, [user]);

	useEffect(() => {
		if (isComponentVisible) {
			setTimeout(() => {
				setSitesLoaded(true);
			}, 500);
		} else {
			setSitesLoaded(false);
		}
	}, [isComponentVisible]);

	return (
		<div tw='flex-1 flex flex-col overflow-y-auto'>
			<nav tw='flex-1 px-4'>
				{userLoaded ? (
					SettingsPages.map((value, index) => {
						return (
							<div key={index} tw='mb-8'>
								{value.slug !== 'navigation' ? (
									<>
										<h3 tw='mt-8 text-xs leading-4 font-semibold text-gray-200 uppercase tracking-wider'>
											{value.category}
										</h3>

										<div tw='my-3' role='group'>
											{value.links ? (
												value.links.map((value2, index) => {
													return (
														<Link key={index} href={value2.url} passHref>
															<a
																className='group'
																css={[
																	tw`cursor-pointer`,
																	useRouter().pathname.indexOf(value2.url) == 0
																		? tw`mt-1 flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-100 rounded-md bg-gray-1100`
																		: tw`mt-1 flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-400 rounded-md hover:text-gray-100 hover:bg-gray-1100 focus:outline-none focus:bg-gray-1100 transition ease-in-out duration-150`
																]}
															>
																<svg
																	tw='mr-3 h-6 w-5'
																	stroke='currentColor'
																	fill='none'
																	viewBox='0 0 24 24'
																>
																	<path
																		strokeLinecap='round'
																		strokeLinejoin='round'
																		strokeWidth='2'
																		d={value2.icon}
																	/>
																</svg>
																<span>{value2.title}</span>
															</a>
														</Link>
													);
												})
											) : (
												<div tw='space-y-1'>
													<div ref={ref} tw='relative'>
														<div tw='relative'>
															<span tw='inline-block w-full rounded-md shadow-sm'>
																<button
																	type='button'
																	aria-haspopup='listbox'
																	aria-expanded='true'
																	aria-labelledby='listbox-label'
																	tw='cursor-default relative w-full rounded-md border border-gray-700 pl-3 pr-10 py-2 text-left bg-white focus:outline-none focus:ring-1 focus:ring-gray-1100 focus:border-gray-1100 transition ease-in-out duration-150 sm:text-sm sm:leading-5'
																	onClick={handleDropdownToggle}
																>
																	<div tw='flex items-center space-x-3'>
																		<span tw='block truncate text-gray-600'>
																			{getSiteResults(site)}
																		</span>
																	</div>
																	<span tw='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
																		<SelectorSvg
																			className={tw`w-4 h-4 text-gray-400`}
																		/>
																	</span>
																</button>
															</span>

															<Transition
																show={isComponentVisible}
																enter='transition ease-out duration-100'
																enterFrom='transform opacity-0 scale-95'
																enterTo='transform opacity-100 scale-100'
																leave='transition ease-in duration-75'
																leaveFrom='transform opacity-100 scale-100'
																leaveTo='transform opacity-0 scale-95'
																className='absolute mt-1 w-full rounded-md bg-white shadow-lg overflow-hidden'
															>
																{sitesLoaded ? (
																	site && site.results !== undefined ? (
																		site.results.length > 0 ? (
																			<ul
																				tabIndex='-1'
																				role='listbox'
																				aria-labelledby='listbox-label'
																				tw='max-h-60 pt-2 text-base leading-6 overflow-auto focus:outline-none sm:text-sm sm:leading-5'
																			>
																				{site.results.map((value, index) => {
																					return (
																						<li
																							key={index}
																							onClick={() =>
																								handleDropdownHandler(
																									value.id,
																									value.verified
																								)
																							}
																							id={`listbox-item-${index}`}
																							role='option'
																							css={[
																								tw`select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900`,
																								value.verified
																									? tw`cursor-pointer`
																									: tw`cursor-not-allowed`
																							]}
																						>
																							<div tw='flex items-center space-x-3'>
																								<span
																									aria-label='Online'
																									css={[
																										tw`flex-shrink-0 inline-block h-2 w-2 rounded-full`,
																										value.verified
																											? tw`bg-green-400`
																											: tw`bg-red-400`
																									]}
																								></span>
																								<span
																									css={[
																										tw`font-medium block truncate`,
																										value.verified
																											? tw`text-gray-500`
																											: tw`text-gray-600 opacity-25`
																									]}
																								>
																									{value.name}
																								</span>
																							</div>
																						</li>
																					);
																				})}
																			</ul>
																		) : null
																	) : null
																) : (
																	<SidebarSiteResultsSkeleton />
																)}

																<span tw='flex m-2 justify-center shadow-sm rounded-md'>
																	<Link href='/dashboard/sites/information'>
																		<a tw='w-full flex items-center justify-center rounded-md px-3 py-2 border border-transparent text-sm leading-4 font-medium text-white bg-green-600 cursor-pointer transition ease-in-out duration-150 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'>
																			<PlusSvg
																				className={tw`-ml-3 mr-2 h-4 w-4`}
																			/>
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
									</>
								) : (
									<div tw='mt-4' role='group'>
										{value.links.map((value2, index) => {
											return (
												<Link
													key={index}
													href={
														value2.url.indexOf('/dashboard/sites') > -1
															? value2.url
															: '/dashboard/site/' + query.siteId + value2.url
													}
													passHref
												>
													<a
														className='group'
														css={[
															tw`cursor-pointer`,
															useRouter().pathname.indexOf(value2.url) === 0
																? tw`mt-1 flex items-center px-3 pl-0 py-2 text-sm leading-5 font-medium text-gray-100 rounded-md bg-gray-1100`
																: tw`mt-1 flex items-center px-3 pl-0 py-2 text-sm leading-5 font-medium text-gray-400 rounded-md hover:text-gray-100 focus:outline-none transition ease-in-out duration-150`
														]}
													>
														{/* FIXME: change this into SVG component */}
														<svg
															tw='mr-3 h-6 w-5'
															stroke='currentColor'
															fill='none'
															viewBox='0 0 24 24'
														>
															<path
																strokeLinecap='round'
																strokeLinejoin='round'
																strokeWidth='2'
																d={value2.icon}
															/>
															{value2.icon2 ? (
																<path
																	strokeLinecap='round'
																	strokeLinejoin='round'
																	strokeWidth='2'
																	d={value2.icon2}
																/>
															) : null}
														</svg>
														<span>{value2.title}</span>
														{value2.url === '/links' && (
															<span tw='ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-purple-100 text-purple-800 transition ease-in-out duration-150'>
																{stats.num_links}
															</span>
														)}
														{value2.url === '/pages' && (
															<span tw='ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-purple-100 text-purple-800 transition ease-in-out duration-150'>
																{stats.num_pages}
															</span>
														)}
													</a>
												</Link>
											);
										})}
									</div>
								)}
							</div>
						);
					})
				) : (
					<SettingsMenuSkeleton />
				)}
			</nav>
		</div>
	);
};

SettingsMenu.propTypes = {};

export default SettingsMenu;

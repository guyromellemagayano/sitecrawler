// React
import React, { Fragment } from 'react';

// NextJS
import { useRouter } from 'next/router';
import Link from 'next/link';

// External

import PropTypes from 'prop-types';
import styled from 'styled-components';

// JSON
import SettingsPages from 'public/data/settings-pages.json';

// Hooks
import useUser from 'src/hooks/useUser';

const SettingsMenuDiv = styled.nav`
	.back-nav {
		margin-bottom: 1rem;
	}
`;

const SettingsMenu = () => {
	const { user: user } = useUser({
		redirectTo: '/',
		redirectIfFound: false
	});

	return user ? (
		<SettingsMenuDiv className="flex-1 px-4 bg-gray-1000">
			{SettingsPages.map((val, key) => {
				return (
					<Fragment key={key}>
						{val.slug !== 'navigation' ? (
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
												</a>
											</Link>
										);
									})}
								</div>
							</>
						) : (
							<div
								className="mt-8"
								role="group"
								aria-labelledby={`${val.slug}-headline`}
							>
								{val.links.map((val2, key) => {
									return (
										<Link
											key={key}
											href={
												val2.url.indexOf('/dashboard/sites') > -1
													? val2.url
													: '/dashboard/site/' + query.siteId + val2.url
											}
										>
											<a
												className={`${
													useRouter().pathname.indexOf(val2.url) == 0
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
									);
								})}
							</div>
						)}
					</Fragment>
				);
			})}
		</SettingsMenuDiv>
	) : (
		<SettingsMenuDiv className="mt-5 flex-1 px-2 bg-white">
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
		</SettingsMenuDiv>
	);
};

SettingsMenu.propTypes = {};

export default SettingsMenu;

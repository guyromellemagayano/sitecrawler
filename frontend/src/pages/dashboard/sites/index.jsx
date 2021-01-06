// React
import { Fragment, useState, useEffect } from 'react';

// NextJS
import Router, { useRouter } from 'next/router';

// External

import { NextSeo } from 'next-seo';
import Cookies from 'js-cookie';
import LogRocket from 'logrocket';
import PropTypes from 'prop-types';
import setupLogRocketReact from 'logrocket-react';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';
import useSWR from 'swr';

// JSON
import DataTableHeadsContent from 'public/data/data-table-heads.json';

// Hooks
import useFetcher from 'src/hooks/useFetcher';
import useUser from 'src/hooks/useUser';

// Components
import AddSite from 'src/components/sites/AddSite';
import DataTable from 'src/components/sites/DataTable';
import Layout from 'src/components/Layout';
import MainSidebar from 'src/components/sidebar/MainSidebar';
import MobileSidebar from 'src/components/sidebar/MobileSidebar';
import MyPagination from 'src/components/sites/Pagination';
import SiteFooter from 'src/components/footer/SiteFooter';
import SiteSorting from 'src/components/sites/SiteSorting';

// Helpers
import {
	getSlugFromSortKey,
	getSortKeyFromSlug,
	removeURLParameter,
	slugToCamelcase
} from 'src/helpers/functions';

if (typeof window !== 'undefined') {
	LogRocket.init('epic-design-labs/link-app');
	setupLogRocketReact(LogRocket);
}

const SitesDiv = styled.section``;

const initialOrder = {
	siteName: 'asc',
	lastCrawled: 'default',
	totalIssues: 'default'
};

const Sites = (props) => {
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
	const [userLoaded, setUserLoaded] = useState(false);
	const [linksPerPage, setLinksPerPage] = useState(20);
	const [pagePath, setPagePath] = useState(null);
	const [sortOrder, setSortOrder] = useState(initialOrder);
	const [searchKey, setSearchKey] = useState(null);

	const pageTitle = 'Sites';

	const { asPath } = useRouter();

	let sitesApiEndpoint =
		props.page !== undefined
			? '/api/site/?per_page=' +
			  linksPerPage +
			  `&ordering=name` +
			  `&page=` +
			  props.page
			: '/api/site/?per_page=' + linksPerPage + `&ordering=name`;
	let queryString = '';

	queryString +=
		props.search !== undefined
			? sitesApiEndpoint.includes('?')
				? `&search=${props.search}`
				: `?search=${props.search}`
			: '';

	queryString +=
		props.ordering !== undefined
			? sitesApiEndpoint.includes('?')
				? `&ordering=${props.ordering}`
				: `?ordering=${props.ordering}`
			: '';

	sitesApiEndpoint += queryString;

	// console.log(sitesApiEndpoint);

	const { user: user } = useUser({
		redirectTo: '/',
		redirectIfFound: false
	});

	const { data: site, mutate: updateSites } = useSWR(
		sitesApiEndpoint,
		useFetcher
	);

	const searchEventHandler = async (e) => {
		const searchTargetValue = e.target.value;

		if (e.keyCode !== 13) return false;

		let newPath = asPath;
		newPath = removeURLParameter(newPath, 'search');
		newPath = removeURLParameter(newPath, 'page');

		if (!/\S/.test(searchTargetValue)) {
			setSearchKey(searchTargetValue);
		} else {
			if (newPath.includes('?')) newPath += `&search=${searchTargetValue}`;
			else newPath += `?search=${searchTargetValue}`;

			setSearchKey(searchTargetValue);
		}

		if (newPath.includes('?')) setPagePath(`${newPath}&`);
		else setPagePath(`${newPath}?`);

		Router.push(newPath);
		updateSites();
	};

	const onItemsPerPageChange = (count) => {
		const countValue = parseInt(count.target.value);

		let newPath = asPath;
		newPath = removeURLParameter(newPath, 'page');

		if (countValue) {
			if (newPath.includes('per_page')) {
				newPath = removeURLParameter(newPath, 'per_page');
			}
			if (newPath.includes('?')) newPath += `&per_page=${countValue}`;
			else newPath += `?per_page=${countValue}`;

			setLinksPerPage(countValue);

			if (newPath.includes('?')) setPagePath(`${newPath}&`);
			else setPagePath(`${newPath}?`);

			Router.push(newPath);
			updateSites();

			return true;
		}
	};

	const SortHandler = (slug, dir) => {
		setSortOrder({ ...initialOrder });

		let newPath = removeURLParameter(asPath, 'ordering');

		const sortItem = slugToCamelcase(slug);
		const sortKey = getSortKeyFromSlug(DataTableHeadsContent, slug);

		if (sortOrder[sortItem] == 'default') {
			setSortOrder((prevState) => ({ ...prevState, [sortItem]: dir }));
			if (dir == 'asc') {
				if (newPath.includes('?')) newPath += `&ordering=${sortKey}`;
				else newPath += `?ordering=${sortKey}`;
			} else {
				if (newPath.includes('?')) newPath += `&ordering=-${sortKey}`;
				else newPath += `?ordering=-${sortKey}`;
			}
		} else if (sortOrder[sortItem] == 'asc') {
			setSortOrder((prevState) => ({ ...prevState, [sortItem]: 'desc' }));
			if (newPath.includes('?')) newPath += `&ordering=-${sortKey}`;
			else newPath += `?ordering=-${sortKey}`;
		} else {
			setSortOrder((prevState) => ({ ...prevState, [sortItem]: 'asc' }));
			if (newPath.includes('?')) newPath += `&ordering=${sortKey}`;
			else newPath += `?ordering=${sortKey}`;
		}

		// console.log('[pagePath]', newPath)
		if (newPath.includes('?'))
			setPagePath(`${removeURLParameter(newPath, 'page')}&`);
		else setPagePath(`${removeURLParameter(newPath, 'page')}?`);

		Router.push(newPath);
		updateSites();
	};

	useEffect(() => {
		if (removeURLParameter(asPath, 'page').includes('?'))
			setPagePath(`${removeURLParameter(asPath, 'page')}&`);
		else setPagePath(`${removeURLParameter(asPath, 'page')}?`);

		if (props.search !== undefined) setSearchKey(props.search);

		if (props.ordering !== undefined) {
			const slug = getSlugFromSortKey(
				DataTableHeadsContent,
				props.ordering.replace('-', '')
			);
			const orderItem = slugToCamelcase(slug);

			if (props.ordering.includes('-'))
				setSortOrder((prevState) => ({ ...prevState, [orderItem]: 'desc' }));
			else setSortOrder((prevState) => ({ ...prevState, [orderItem]: 'asc' }));
		}

		if (props.per_page !== undefined) setLinksPerPage(props.per_page);
	}, []);

	useEffect(() => {
		if (user && user !== undefined && user.username) {
			setUserLoaded(true);
		}
	}, [user]);

	user
		? LogRocket.identify('epic-design-labs/link-app', {
				name: user.first_name + ' ' + user.last_name,
				email: user.email
		  })
		: null;

	return (
		<Layout>
			{userLoaded && site ? (
				<>
					<NextSeo title={pageTitle} />

					<SitesDiv className={`h-screen flex overflow-hidden bg-gray-200`}>
						<MobileSidebar show={openMobileSidebar} />
						<MainSidebar />

						<div className={`flex flex-col w-0 flex-1 overflow-hidden`}>
							<div className={`md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3`}>
								<button
									className={`-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:bg-gray-200 transition ease-in-out duration-150`}
									aria-label={`Open sidebar`}
									onClick={() =>
										setTimeout(
											() => setOpenMobileSidebar(!openMobileSidebar),
											150
										)
									}
								>
									<svg
										className={`h-6 w-5`}
										stroke={`currentColor`}
										fill={`none`}
										viewBox={`0 0 24 24`}
									>
										<path
											strokeLinecap={`round`}
											strokeLinejoin={`round`}
											strokeWidth={`2`}
											d={`M4 6h16M4 12h16M4 18h16`}
										/>
									</svg>
								</button>
							</div>
							<main
								className={`flex-1 relative z-0 overflow-y-auto pt-2 pb-6 focus:outline-none md:py-6`}
								tabIndex={`0`}
							>
								<div
									className={`max-w-full mx-auto px-4 md:py-4 sm:px-6 md:px-8`}
								>
									<div
										className={`mt-2 md:flex md:items-center md:justify-between`}
									>
										<div className={`flex-1 min-w-0`}>
											<h2
												className={`text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate lg:overflow-visible`}
											>
												Sites
											</h2>
										</div>
									</div>
								</div>
								<div className={`max-w-full mx-auto px-4 py-4 sm:px-6 md:px-8`}>
									<AddSite
										searchKey={searchKey}
										onSearchEvent={searchEventHandler}
									/>
									<MyPagination
										href="/dashboard/sites/"
										pathName={pagePath}
										apiEndpoint={sitesApiEndpoint}
										page={props.page ? props.page : 0}
										linksPerPage={linksPerPage}
										onItemsPerPageChange={onItemsPerPageChange}
									/>
									<div className={`pb-4`}>
										<div className={`flex flex-col`}>
											<div
												className={`-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8`}
											>
												<div
													className={`align-middle inline-block min-w-full shadow-xs overflow-hidden sm:rounded-lg border-gray-300`}
												>
													<table className={`min-w-full`}>
														<thead>
															<tr>
																{DataTableHeadsContent.map((site, key) => {
																	return (
																		<Fragment key={key}>
																			<th
																				className={`w-48 px-6 py-3 border-b border-gray-300 bg-white text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider`}
																			>
																				<div className="flex items-center justify-start">
																					{site.slug != undefined ? (
																						<SiteSorting
																							sortOrder={sortOrder}
																							onSortHandler={SortHandler}
																							key={key}
																							slug={site.slug}
																						/>
																					) : null}
																					<span className="label flex items-center">
																						{site.label}
																					</span>
																				</div>
																			</th>
																		</Fragment>
																	);
																})}
															</tr>
														</thead>
														<tbody className={`bg-white`}>
															{site.results
																? site.results.map((val, key) => (
																		<DataTable
																			key={key}
																			site={val}
																			user={user}
																		/>
																  ))
																: null}
														</tbody>
													</table>
												</div>
											</div>
										</div>
									</div>
									<MyPagination
										href="/dashboard/sites/"
										pathName={pagePath}
										apiEndpoint={sitesApiEndpoint}
										page={props.page ? props.page : 0}
										linksPerPage={linksPerPage}
										onItemsPerPageChange={onItemsPerPageChange}
									/>
								</div>

								<div
									className={`static bottom-0 w-full mx-auto px-4 sm:px-6 py-4`}
								>
									<SiteFooter />
								</div>
							</main>
						</div>
					</SitesDiv>
				</>
			) : null}
		</Layout>
	);
};

Sites.getInitialProps = ({ query }) => {
	return {
		page: query.page,
		search: query.search,
		per_page: query.per_page,
		ordering: query.ordering
	};
};

Sites.propTypes = {
	page: PropTypes.number,
	search: PropTypes.string,
	per_page: PropTypes.number,
	ordering: PropTypes.string,
	openMobileSidebar: PropTypes.bool,
	userLoaded: PropTypes.bool,
	linksPerPage: PropTypes.number,
	pagePath: PropTypes.string,
	sortOrder: PropTypes.array,
	searchKey: PropTypes.string
};

export default Sites;

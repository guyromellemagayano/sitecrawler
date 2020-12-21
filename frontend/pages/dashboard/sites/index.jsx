import { removeURLParameter } from 'helpers/functions';
import { Fragment, useState, useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import Cookies from 'js-cookie';
import Head from 'next/head';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import useSWR from 'swr';
import DataTableHeadsContent from 'public/data/data-table-heads.json';
import useUser from 'hooks/useUser';
import Layout from 'components/Layout';
import MobileSidebar from 'components/sidebar/MobileSidebar';
import MainSidebar from 'components/sidebar/MainSidebar';
import AddSite from 'components/sites/AddSite';
import DataTable from 'components/sites/DataTable';
import MyPagination from 'components/sites/Pagination';
import SiteFooter from 'components/footer/SiteFooter';

if (typeof window !== 'undefined') {
	LogRocket.init('epic-design-labs/link-app');
	setupLogRocketReact(LogRocket);
}

const fetcher = async (url) => {
	const res = await fetch(url, {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'X-CSRFToken': Cookies.get('csrftoken')
		}
	});

	const data = await res.json();

	if (res.status !== 200) {
		throw new Error(data.message);
	}

	return data;
};

const SitesDiv = styled.section``;

const Sites = (props) => {
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
	const [userLoaded, setUserLoaded] = useState(false);
	const [linksPerPage, setLinksPerPage] = useState(20);
	const [pagePath, setPagePath] = useState('');
	const [searchKey, setSearchKey] = useState('');

	const pageTitle = 'Sites';

	const { asPath } = useRouter();

	let sitesApiEndpoint =
		props.page !== undefined
			? '/api/site/?per_page=' + linksPerPage + `&page=` + props.page
			: '/api/site/?per_page=' + linksPerPage;
	let queryString = '';

	queryString +=
		props.search !== undefined
			? sitesApiEndpoint.includes('?')
				? `&search=${props.search}`
				: `?search=${props.search}`
			: '';

	sitesApiEndpoint += queryString;

	const { user: user, userError: userError } = useUser({
		redirectTo: '/',
		redirectIfFound: false
	});

	const { data: site, error: siteError, mutate: updateSites } = useSWR(
		sitesApiEndpoint,
		fetcher
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

	useEffect(() => {
		if (removeURLParameter(asPath, 'page').includes('?'))
			setPagePath(`${removeURLParameter(asPath, 'page')}&`);
		else setPagePath(`${removeURLParameter(asPath, 'page')}?`);

		if (props.search !== undefined) setSearchKey(props.search);

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

	{
		userError && <Layout>{userError.message}</Layout>;
	}
	{
		siteError && <Layout>{siteError.message}</Layout>;
	}

	return (
		<Layout>
			{userLoaded && site ? (
				<Fragment>
					<Head>
						<title>{pageTitle}</title>
					</Head>

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
										href='/dashboard/sites/'
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
																				<div className='flex items-center justify-between'>
																					{site.label}
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
										href='/dashboard/sites/'
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
				</Fragment>
			) : null}
		</Layout>
	);
};

Sites.getInitialProps = ({ query }) => {
	return {
		page: query.page,
		search: query.search,
		per_page: query.per_page
	};
};

export default Sites;

Sites.propTypes = {
	openMobileSidebar: PropTypes.bool,
	pageTitle: PropTypes.string,
	sitesApiEndpoint: PropTypes.string,
	router: PropTypes.elementType
};

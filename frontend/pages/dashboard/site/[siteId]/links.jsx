import {
	removeURLParameter,
	slugToCamelcase,
	getSortKeyFromSlug,
	getSlugFromSortKey
} from 'helpers/functions';
import { Fragment, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import fetch from 'node-fetch';
import Head from 'next/head';
import Layout from 'components/Layout';
import Link from 'next/link';
import LinkFilter from 'components/site/LinkFilter';
import LinkOptions from 'components/site/LinkOptions';
import LinksLabel from 'public/label/pages/site/links.json';
import LinkSorting from 'components/site/LinkSorting';
import LinksUrlContent from 'public/data/links-url.json';
import LinkUrlTable from 'components/site/LinkTable';
import MainSidebar from 'components/sidebar/MainSidebar';
import MobileSidebar from 'components/sidebar/MobileSidebar';
import MyPagination from 'components/sites/Pagination';
import ReactTooltip from 'react-tooltip';
import Router, { useRouter } from 'next/router';
import SiteFooter from 'components/footer/SiteFooter';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';
import useSWR, { mutate } from 'swr';
import useUser from 'hooks/useUser';
import { array } from 'prop-types';

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

const LinksDiv = styled.section`
	.url-type-tooltip,
	.status-tooltip {
		max-width: 15rem;
		margin-left: 5px !important;
		padding: 1rem 1.5rem;
	}
	@media only screen and (max-width: 1400px) {
		td:first-child {
			max-width: 15rem;
		}
	}
	@media only screen and (min-width: 1600px) {
		td {
			min-width: 10rem;

			&:first-child {
				max-width: 20rem;
			}
		}
	}
	.btn-crawler {
		top: 0;
		right: 0;
		padding: 2.25rem 1.5rem;

		@media only screen and (max-width: 1024px) {
			margin: 0;
		}

		@media only screen and (max-width: 639px) {
			padding: 0 1rem;
		}

		@media only screen and (min-width: 640px) and (max-width: 767px) {
			padding: 0 1.5rem;
		}

		@media only screen and (min-width: 768px) and (max-width: 1023px) {
			padding: 0 2rem;
		}
	}

	@media only screen and (max-width: 960px) {
		.min-width-adjust {
			min-width: 12rem;
		}
	}
`;

const initialOrder = {
	linkUrl: 'default',
	urlType: 'default',
	status: 'default',
	httpCode: 'default',
	linkLocation: 'default',
	occurrences: 'default'
};

const Links = (props) => {
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
	const [allFilter, setAllFilter] = useState(false);
	const [issueFilter, setIssueFilter] = useState(false);
	const [noIssueFilter, setNoIssueFilter] = useState(false);
	const [internalFilter, setInternalFilter] = useState(false);
	const [externalFilter, setExternalFilter] = useState(false);
	const [recrawlable, setRecrawlable] = useState(false);
	const [crawlFinished, setCrawlFinished] = useState(false);
	const [linksPerPage, setLinksPerPage] = useState(20);
	const [pagePath, setPagePath] = useState('');
	const [sortOrder, setSortOrder] = useState(initialOrder);
	const [searchKey, setSearchKey] = useState('');
	const [filterQueryString, setFilterQueryString] = useState('');

	const pageTitle = 'Links |';

	const { user: user, userError: userError } = useUser({
		redirectTo: '/',
		redirectIfFound: false
	});

	const { query, asPath } = useRouter();
	const { data: site, error: siteError } = useSWR(
		() => (query.siteId ? `/api/site/${query.siteId}/` : null),
		fetcher
	);

	const { data: scan, error: scanError } = useSWR(
		() =>
			query.siteId
				? `/api/site/${query.siteId}/scan/?ordering=-finished_at`
				: null,
		fetcher
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

	let scanApiEndpoint =
		props.result.page !== undefined
			? `/api/site/${query.siteId}/scan/${scanObjId}/link/?per_page=` +
			  linksPerPage +
			  `&page=` +
			  props.result.page
			: `/api/site/${query.siteId}/scan/${scanObjId}/link/?per_page=` +
			  linksPerPage;

	const statusString = Array.isArray(props.result.status)
		? props.result.status.join('&status=')
		: props.result.status;

	let queryString =
		props.result.status != undefined && props.result.status.length != 0
			? scanApiEndpoint.includes('?')
				? `&status=${statusString}`
				: `?status=${statusString}`
			: Array.from(filterQueryString).length > 0
			? '&' + filterQueryString.toString()
			: '';

	const typeString = Array.isArray(props.result.type)
		? props.result.type.join('&type=')
		: props.result.type;

	queryString +=
		props.result.type !== undefined
			? scanApiEndpoint.includes('?')
				? `&type=${typeString}`
				: `?type=${typeString}`
			: '';

	queryString +=
		props.result.search !== undefined
			? props.result.page !== undefined ||
			  props.result.status !== undefined ||
			  props.result.type !== undefined
				? `&search=${props.result.search}`
				: `?search=${props.result.search}`
			: '';

	queryString +=
		props.result.ordering !== undefined
			? (scanApiEndpoint + queryString).includes('?')
				? `&ordering=${props.result.ordering}`
				: `?ordering=${props.result.ordering}`
			: '';

	scanApiEndpoint += queryString;

	// console.log(scanApiEndpoint);

	const { data: link, error: linkError, mutate: updateLinks } = useSWR(
		() => (query.siteId && scanObjId ? scanApiEndpoint : null),
		fetcher
	);

	const searchEventHandler = async (e) => {
		if (e.keyCode != 13) return false;

		let newPath = removeURLParameter(asPath, 'search');
		newPath = removeURLParameter(newPath, 'page');

		if (e.target.value == '' || e.target.value == ' ') {
			setSearchKey(e.target.value);
			if (newPath.includes('?')) setPagePath(`${newPath}&`);
			else setPagePath(`${newPath}?`);

			Router.push('/dashboard/site/[siteId]/links/', newPath);
			return;
		}

		if (newPath.includes('?')) newPath += `&search=${e.target.value}`;
		else newPath += `?search=${e.target.value}`;

		setSearchKey(e.target.value);
		if (newPath.includes('?')) setPagePath(`${newPath}&`);
		else setPagePath(`${newPath}?`);

		Router.push('/dashboard/site/[siteId]/links/', newPath);

		updateLinks();
	};

	const filterChangeHandler = async (e) => {
		const filterType = e.target.value;
		const filterStatus = e.target.checked;

		let newPath = asPath;
		newPath = removeURLParameter(newPath, 'per_page');

		if (filterType == 'issues' && filterStatus == true) {
			setIssueFilter(true);
			setNoIssueFilter(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, 'status');

			if (newPath.includes('?'))
				newPath += `&status=TIMEOUT&status=HTTP_ERROR&status=OTHER_ERROR`;
			else newPath += `?status=TIMEOUT&status=HTTP_ERROR&status=OTHER_ERROR`;
		} else if (filterType == 'issues' && filterStatus == false) {
			filterQueryString && filterQueryString.delete('status');

			if (newPath.includes('status'))
				newPath = removeURLParameter(newPath, 'status');

			setIssueFilter(false);
		}

		if (filterType == 'no-issues' && filterStatus == true) {
			setIssueFilter(false);
			setNoIssueFilter(true);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, 'status');

			if (newPath.includes('?')) newPath += `&status=OK`;
			else newPath += `?status=OK`;
		} else if (filterType == 'no-issues' && filterStatus == false) {
			filterQueryString && filterQueryString.delete('status');

			if (newPath.includes('status'))
				newPath = removeURLParameter(newPath, 'status');

			setNoIssueFilter(false);
		}

		if (filterType == 'internal' && filterStatus == true) {
			setInternalFilter(true);
			setExternalFilter(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, 'type');
			newPath = removeURLParameter(newPath, 'page');

			if (newPath.includes('?')) newPath += `&type=PAGE`;
			else newPath += `?type=PAGE`;
		} else if (filterType == 'internal' && filterStatus == false) {
			if (newPath.includes('type=PAGE'))
				newPath = removeURLParameter(newPath, 'type');

			setInternalFilter(false);
		}

		if (filterType == 'external' && filterStatus == true) {
			setExternalFilter(true);
			setInternalFilter(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, 'page');
			newPath = removeURLParameter(newPath, 'type');

			if (newPath.includes('?')) newPath += `&type=EXTERNAL`;
			else newPath += `?type=EXTERNAL`;
		} else if (filterType == 'external' && filterStatus == false) {
			if (newPath.includes('type=EXTERNAL'))
				newPath = removeURLParameter(newPath, 'type');

			setExternalFilter(false);
		}

		if (filterType == 'all' && filterStatus == true) {
			setAllFilter(true);
			setIssueFilter(false);
			setNoIssueFilter(false);
			setExternalFilter(false);
			setInternalFilter(false);

			console.log(filterQueryString);

			newPath = removeURLParameter(newPath, 'status');
			newPath = removeURLParameter(newPath, 'type');
			newPath = removeURLParameter(newPath, 'page');

			// if (!newPath.includes("search") && !newPath.includes("ordering"))
			//   newPath = newPath.replace("?", "");
		}

		if (newPath.includes('?')) setPagePath(`${newPath}&`);
		else setPagePath(`${newPath}?`);

		// console.log(newPath);

		Router.push(newPath);

		updateLinks();

		return true;
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

			Router.push('/dashboard/site/[siteId]/links/', newPath);

			updateLinks();

			return true;
		}
	};

	useEffect(() => {
		if (removeURLParameter(asPath, 'page').includes('?'))
			setPagePath(`${removeURLParameter(asPath, 'page')}&`);
		else setPagePath(`${removeURLParameter(asPath, 'page')}?`);

		if (props.result.search !== undefined) setSearchKey(props.result.search);

		if (props.result.ordering !== undefined) {
			const slug = getSlugFromSortKey(
				LinksUrlContent,
				props.result.ordering.replace('-', '')
			);
			const orderItem = slugToCamelcase(slug);

			if (props.result.ordering.includes('-'))
				setSortOrder((prevState) => ({ ...prevState, [orderItem]: 'desc' }));
			else setSortOrder((prevState) => ({ ...prevState, [orderItem]: 'asc' }));
		}

		if (props.result.per_page !== undefined)
			setLinksPerPage(props.result.per_page);

		setFilterQueryString(new URLSearchParams(window.location.search));

		let filterQueryStringValue = new URLSearchParams(window.location.search);

		if (filterQueryStringValue.has('status')) {
			if (
				filterQueryStringValue.getAll('status').includes('TIMEOUT') &&
				filterQueryStringValue.getAll('status').includes('HTTP_ERROR') &&
				filterQueryStringValue.getAll('status').includes('OTHER_ERROR')
			) {
				setIssueFilter(true);
				setNoIssueFilter(false);
				setAllFilter(false);
				setInternalFilter(false);
				setExternalFilter(false);
			}

			if (filterQueryStringValue.get('status') === 'OK') {
				setNoIssueFilter(true);
				setIssueFilter(false);
				setAllFilter(false);
				setInternalFilter(false);
				setExternalFilter(false);
			}
		}

		if (filterQueryStringValue.has('type')) {
			if (filterQueryStringValue.get('type') === 'PAGE') {
				setInternalFilter(true);
				setExternalFilter(false);
				setAllFilter(false);
			} else if (filterQueryStringValue.get('type') === 'EXTERNAL') {
				setExternalFilter(true);
				setInternalFilter(false);
				setAllFilter(false);
			} else if (filterQueryStringValue.get('type') === 'EXTERNALOTHER') {
				setExternalFilter(true);
				setInternalFilter(false);
				setAllFilter(false);
			}
		}

		if (!filterQueryStringValue.toString().length) {
			setNoIssueFilter(false);
			setIssueFilter(false);
			setInternalFilter(false);
			setExternalFilter(false);
			setAllFilter(true);
		}

		// console.log('[ENDPOINT]', process.env.NODE_ENV, process.env.ENDPOINT)
	}, []);

	useEffect(() => {
		if (props.result.status !== undefined && props.result.status === 'OK') {
			setNoIssueFilter(true);
			setIssueFilter(false);
			setAllFilter(false);
			setInternalFilter(false);
			setExternalFilter(false);
		}

		if (
			props.result.status !== undefined &&
			props.result.status.includes('TIMEOUT') &&
			props.result.status.includes('HTTP_ERROR') &&
			props.result.status.includes('OTHER_ERROR')
		) {
			setIssueFilter(true);
			setNoIssueFilter(false);
			setAllFilter(false);
			setInternalFilter(false);
			setExternalFilter(false);
		}

		if (props.result.type !== undefined && props.result.type == 'PAGE') {
			setInternalFilter(true);
			setExternalFilter(false);
			setAllFilter(false);
		}

		if (Array.isArray(props.result.type)) {
			if (
				props.result.type !== undefined &&
				props.result.type.join('') == 'EXTERNALOTHER'
			) {
				setExternalFilter(true);
				setInternalFilter(false);
				setAllFilter(false);
			}
		} else {
			if (props.result.type !== undefined && props.result.type == 'EXTERNAL') {
				setExternalFilter(true);
				setInternalFilter(false);
				setAllFilter(false);
			}
		}

		if (
			props.result.type == undefined &&
			props.result.status == undefined &&
			filterQueryString &&
			!filterQueryString.toString().length
		) {
			setIssueFilter(false);
			setNoIssueFilter(false);
			setInternalFilter(false);
			setExternalFilter(false);
			setAllFilter(true);
		}
	}, [filterChangeHandler, filterQueryString]);

	const SortHandler = (slug, dir) => {
		setSortOrder({ ...initialOrder });

		let newPath = removeURLParameter(asPath, 'ordering');

		const sortItem = slugToCamelcase(slug);
		const sortKey = getSortKeyFromSlug(LinksUrlContent, slug);

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

		Router.push('/dashboard/site/[siteId]/links/', newPath);
		updateLinks();
	};

	const reCrawlEndpoint = `/api/site/${query.siteId}/start_scan/`;

	const onCrawlHandler = async () => {
		setCrawlFinished(false);
		const res = await fetch(reCrawlEndpoint, {
			method: 'POST',
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

		// console.log('[onCrawlHandler]', data)

		return data;
	};

	const crawlableHandler = (finished) => {
		if (finished) setCrawlFinished(true);

		if (
			user &&
			user.permissions !== undefined &&
			user.permissions[0] == 'can_start_scan' &&
			site &&
			site.verified &&
			finished
		)
			setRecrawlable(true);
		else setRecrawlable(false);
	};

	useEffect(() => {
		if (
			user &&
			user.permissions !== undefined &&
			user.permissions[0] == 'can_start_scan' &&
			site &&
			site.verified
		)
			setRecrawlable(true);
		else setRecrawlable(false);
	}, [user, site]);

	{
		userError && <Layout>{userError.message}</Layout>;
	}
	{
		linkError && <Layout>{linkError.message}</Layout>;
	}
	{
		scanError && <Layout>{scanError.message}</Layout>;
	}
	{
		siteError && <Layout>{siteError.message}</Layout>;
	}

	return (
		<Layout>
			{user && link && site ? (
				<Fragment>
					<Head>
						<title>
							{pageTitle} {site.name}
						</title>
					</Head>

					<LinksDiv className={`h-screen flex overflow-hidden bg-gray-300`}>
						<MobileSidebar
							show={openMobileSidebar}
							crawlableHandler={crawlableHandler}
						/>
						<MainSidebar crawlableHandler={crawlableHandler} />

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
									className={`max-w-full mx-auto px-4 pt-4 pb-0 lg:px-8 lg:py-8 sm:px-6 md:px-8`}
								>
									<div>
										<nav className={`sm:hidden`}>
											<Link
												href={'/dashboard/site/' + query.siteId + '/overview'}
											>
												<a
													className={`flex items-center text-sm leading-5 font-medium text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out`}
												>
													<svg
														className={`flex-shrink-0 -ml-1 mr-1 h-5 w-5 text-gray-400`}
														viewBox='0 0 20 20'
														fill='currentColor'
													>
														<path
															fillRule='evenodd'
															d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
															clipRule='evenodd'
														/>
													</svg>
													{LinksLabel[0].label}
												</a>
											</Link>
										</nav>
										<nav
											className={`hidden sm:flex items-center text-sm leading-5`}
										>
											<Link
												href='/dashboard/site/[siteId]/overview'
												as={'/dashboard/site/' + query.siteId + '/overview'}
											>
												<a
													className={`font-normal text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out`}
												>
													{site.name}
												</a>
											</Link>
											<svg
												className={`flex-shrink-0 mx-2 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor`}
											>
												<path
													fillRule='evenodd'
													d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
													clipRule='evenodd'
												/>
											</svg>
											<Link
												href='/dashboard/site/[siteId]/links/'
												as={'/dashboard/site/' + query.siteId + '/links'}
											>
												<a
													className={`font-medium text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out`}
												>
													{LinksLabel[1].label}
												</a>
											</Link>
										</nav>
									</div>
									<div
										className={`mt-2 md:flex md:items-center md:justify-between`}
									>
										<div className={`flex-1 min-w-0`}>
											<div className={`flex items-center`}>
												<div>
													<div className={`lg:flex lg:items-center`}>
														<h2
															className={`mb-2 lg:my-auto text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate`}
														>
															{site.name}
														</h2>
														<dl
															className={`flex flex-col mb-2 lg:mb-0 lg:ml-5 sm:flex-row sm:flex-wrap`}
														>
															<dd
																className={`flex items-center text-md leading-5 text-gray-500 font-medium sm:mr-6`}
															>
																<svg
																	className={`flex-shrink-0 mr-2 h-5 w-5 text-gray-400`}
																	viewBox='0 0 20 20'
																	fill='currentColor'
																>
																	<path
																		fillRule='evenodd'
																		d='M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z'
																		clipRule='evenodd'
																	/>
																</svg>
																{link.count > 0
																	? link.count + ' ' + LinksLabel[2].label
																	: LinksLabel[3].label}
															</dd>
														</dl>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className={`btn-crawler lg:absolute mt-8`}>
									{user.permissions.includes('can_start_scan') ? (
										recrawlable ? (
											<button
												type={`button`}
												onClick={onCrawlHandler}
												className={`w-32 mt-3 mr-3 rounded-md shadow sm:mt-0 relative items-center px-4 py-2 border border-transparent text-sm uppercase leading-5 font-medium rounded-md block text-white text-center bg-gray-1000 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:border-gray-900 focus:shadow-outline-gray active:bg-gray-900 transition ease-in-out duration-150`}
											>
												{LinksLabel[4].label}
											</button>
										) : (
											<button
												disabled={`disabled`}
												type={`button`}
												className={`w-32 mt-3 mr-3 rounded-md shadow sm:mt-0 relative items-center px-4 py-2 border border-transparent text-sm uppercase leading-5 font-medium rounded-md block text-white text-center bg-gray-1000 opacity-50 cursor-not-allowed`}
											>
												{LinksLabel[4].label}
											</button>
										)
									) : null}
								</div>
								<div
									className={`max-w-full mx-auto px-4 pt-4 pb-0 sm:pb-4 lg:px-8 lg:py-8 sm:px-6 md:px-8`}
								>
									<LinkOptions
										searchKey={searchKey}
										onSearchEvent={searchEventHandler}
									/>
									<LinkFilter
										onFilterChange={filterChangeHandler}
										allFilter={allFilter}
										noIssueFilter={noIssueFilter}
										issueFilter={issueFilter}
										internalFilter={internalFilter}
										externalFilter={externalFilter}
									/>
									<MyPagination
										href='/dashboard/site/[siteId]/links/'
										pathName={pagePath}
										apiEndpoint={scanApiEndpoint}
										page={props.result.page ? props.result.page : 0}
										linksPerPage={linksPerPage}
										onItemsPerPageChange={onItemsPerPageChange}
									/>
									<div className={`pb-4`}>
										<div className={`flex flex-col`}>
											<div
												className={`-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8`}
											>
												<div
													className={`align-middle inline-block min-w-full shadow-xs overflow-hidden rounded-lg border-gray-300`}
												>
													<table className={`min-w-full`}>
														<thead>
															<tr>
																{LinksUrlContent.map((site, key) => {
																	return (
																		<Fragment key={key}>
																			<th
																				className={`px-6 py-3 border-b border-gray-300 bg-white text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider ${
																					site.slug === 'url-type' ||
																					site.slug === 'occurrences'
																						? 'min-width-adjust'
																						: 'min-w-full'
																				}`}
																			>
																				<div
																					className={`flex items-center justify-start`}
																				>
																					{site.slug != undefined ? (
																						<LinkSorting
																							sortOrder={sortOrder}
																							onSortHandler={SortHandler}
																							key={key}
																							slug={site.slug}
																						/>
																					) : null}
																					<span className='label flex items-center'>
																						{site.label}
																						{site.slug === 'url-type' ||
																						site.slug === 'status' ||
																						site.slug === 'http-code' ? (
																							<Fragment>
																								<a
																									data-tip
																									data-for={site.slug}
																									data-background-color={
																										'#4A5568'
																									}
																									data-iscapture='true'
																									className={`flex items-center`}
																								>
																									<span
																										className={`ml-2 inline-block w-4 h-4 overflow-hidden`}
																									>
																										<svg
																											fill='currentColor'
																											viewBox='0 0 20 20'
																										>
																											<path
																												fillRule='evenodd'
																												d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z'
																												clipRule='evenodd'
																											></path>
																										</svg>
																									</span>
																								</a>
																								<ReactTooltip
																									id={site.slug}
																									className={`${
																										site.slug + '-tooltip'
																									} w-36`}
																									type='dark'
																									effect='solid'
																									place='bottom'
																									multiline={true}
																								>
																									<span
																										className={`text-left text-xs leading-4 font-normal text-white normal-case tracking-wider`}
																									>
																										{site.slug === 'status' ? (
																											<ul>
																												<li className={`mb-2`}>
																													<strong>
																														{
																															LinksLabel[5]
																																.label
																														}
																													</strong>{' '}
																													-{' '}
																													{
																														LinksLabel[5]
																															.description
																													}
																												</li>
																												<li className={`mb-2`}>
																													<strong>
																														{
																															LinksLabel[6]
																																.label
																														}
																													</strong>{' '}
																													-{' '}
																													{
																														LinksLabel[6]
																															.description
																													}
																												</li>
																												<li className={`mb-2`}>
																													<strong>
																														{
																															LinksLabel[7]
																																.label
																														}
																													</strong>{' '}
																													-{' '}
																													{
																														LinksLabel[7]
																															.description
																													}
																												</li>
																												<li className={`mb-2`}>
																													<strong>
																														{
																															LinksLabel[8]
																																.label
																														}
																													</strong>{' '}
																													-{' '}
																													{
																														LinksLabel[8]
																															.description
																													}
																												</li>
																											</ul>
																										) : (
																											<p>
																												{LinksLabel[9].label}
																											</p>
																										)}
																									</span>
																								</ReactTooltip>
																							</Fragment>
																						) : null}
																					</span>
																				</div>
																			</th>
																		</Fragment>
																	);
																})}
															</tr>
														</thead>
														{link.results &&
															link.results.map((val, key) => (
																<LinkUrlTable key={key} val={val} />
															))}
													</table>
												</div>
											</div>
										</div>
									</div>

									<MyPagination
										href='/dashboard/site/[siteId]/links/'
										pathName={pagePath}
										apiEndpoint={scanApiEndpoint}
										page={props.result.page ? props.result.page : 0}
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
					</LinksDiv>
				</Fragment>
			) : null}
		</Layout>
	);
};

export async function getServerSideProps(context) {
	return {
		props: {
			result: context.query
		}
	};
}

export default Links;

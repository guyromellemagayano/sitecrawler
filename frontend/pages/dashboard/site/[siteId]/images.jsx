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
import ImageFilter from 'components/site/ImageFilter';
import ImagesLabel from 'public/label/pages/site/images.json';
import ImageSorting from 'components/site/ImageSorting';
import ImageTable from 'components/site/ImageTable';
import ImageTableContent from 'public/data/image-table.json';
import Layout from 'components/Layout';
import Link from 'next/link';
import LinkOptions from 'components/site/LinkOptions';
import MainSidebar from 'components/sidebar/MainSidebar';
import MobileSidebar from 'components/sidebar/MobileSidebar';
import MyPagination from 'components/sites/Pagination';
import PropTypes from 'prop-types';
import Router, { useRouter } from 'next/router';
import SiteFooter from 'components/footer/SiteFooter';
import styled from 'styled-components';
import useSWR, { mutate } from 'swr';
import useUser from 'hooks/useUser';

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

const initialOrder = {
	imageUrl: 'default',
	imageSize: 'default',
	status: 'default',
	httpCode: 'default',
	occurrences: 'default'
};

const ImagesDiv = styled.section`
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
			padding: 0.5rem 1.5rem;
		}

		@media only screen and (min-width: 768px) and (max-width: 1023px) {
			padding: 0 2rem;
		}
	}

	@media only screen and (max-width: 1600px) {
		.min-width-adjust {
			min-width: 12rem;
		}
	}
`;

const Images = (props) => {
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
	const [pagePath, setPagePath] = useState('');
	const [sortOrder, setSortOrder] = useState(initialOrder);
	const [allFilter, setAllFilter] = useState(false);
	const [noIssueFilter, setNoIssueFilter] = useState(false);
	const [imageNotWorkingFilter, setImageNotWorkingFilter] = useState(false);
	const [imageBrokenSecurityFilter, setImageBrokenSecurityFilter] = useState(
		false
	);
	const [recrawlable, setRecrawlable] = useState(false);
	const [crawlFinished, setCrawlFinished] = useState(false);
	const [linksPerPage, setLinksPerPage] = useState(20);
	const [searchKey, setSearchKey] = useState('');
	const pageTitle = 'Images |';
	const [filterQueryString, setFilterQueryString] = useState('');

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
			? `/api/site/${query.siteId}/scan/${scanObjId}/image/?per_page=` +
			  linksPerPage +
			  `&page=` +
			  props.result.page
			: `/api/site/${query.siteId}/scan/${scanObjId}/image/?per_page=` +
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

	const tlsStatusString = Array.isArray(props.result.tls_status)
		? props.result.tls_status.join('&tls_status=')
		: props.result.tls_status;

	queryString +=
		props.result.tls_status !== undefined
			? scanApiEndpoint.includes('?')
				? `&tls_status=${tlsStatusString}`
				: `?tls_status=${tlsStatusString}`
			: '';

	queryString +=
		props.result.search !== undefined
			? (scanApiEndpoint + queryString).includes('?')
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

	console.log(scanApiEndpoint);

	const { data: image, error: imageError, mutate: updateImages } = useSWR(
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

			Router.push('/dashboard/site/[siteId]/images', newPath);
			return;
		}

		if (newPath.includes('?')) newPath += `&search=${e.target.value}`;
		else newPath += `?search=${e.target.value}`;

		setSearchKey(e.target.value);
		if (newPath.includes('?')) setPagePath(`${newPath}&`);
		else setPagePath(`${newPath}?`);

		Router.push('/dashboard/site/[siteId]/images', newPath);
		updateImages();
	};

	const SortHandler = (slug, dir) => {
		setSortOrder({ ...initialOrder });

		let newPath = removeURLParameter(asPath, 'ordering');

		const sortItem = slugToCamelcase(slug);
		const sortKey = getSortKeyFromSlug(ImageTableContent, slug);

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

		if (newPath.includes('?'))
			setPagePath(`${removeURLParameter(newPath, 'page')}&`);
		else setPagePath(`${removeURLParameter(newPath, 'page')}?`);

		Router.push('/dashboard/site/[siteId]/images', newPath);
		updateImages();
	};

	const filterChangeHandler = async (e) => {
		const filterType = e.target.value;
		const filterStatus = e.target.checked;

		let newPath = asPath;
		newPath = removeURLParameter(newPath, 'page');

		if (filterType == 'notWorking' && filterStatus == true) {
			setImageNotWorkingFilter(true);
			setImageBrokenSecurityFilter(false);
			setNoIssueFilter(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, 'status');
			newPath = removeURLParameter(newPath, 'tls_status');

			if (newPath.includes('?'))
				newPath += `&status=TIMEOUT&status=HTTP_ERROR&status=OTHER_ERROR`;
			else newPath += `?status=TIMEOUT&status=HTTP_ERROR&status=OTHER_ERROR`;
		} else if (filterType == 'notWorking' && filterStatus == false) {
			filterQueryString && filterQueryString.delete('status');
			filterQueryString && filterQueryString.delete('tls_status');

			if (newPath.includes('status') || newPath.includes('tls_status')) {
				newPath = removeURLParameter(newPath, 'status');
				newPath = removeURLParameter(newPath, 'tls_status');
			}

			setImageNotWorkingFilter(false);
		}

		if (filterType == 'no-issues' && filterStatus == true) {
			setImageNotWorkingFilter(false);
			setImageBrokenSecurityFilter(false);
			setNoIssueFilter(true);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, 'status');
			newPath = removeURLParameter(newPath, 'tls_status');

			if (newPath.includes('?')) newPath += `&status=OK&tls_status=OK`;
			else newPath += `?status=OK&tls_status=OK`;
		} else if (filterType == 'no-issues' && filterStatus == false) {
			filterQueryString && filterQueryString.delete('status');
			filterQueryString && filterQueryString.delete('tls_status');

			if (newPath.includes('status') && newPath.includes('tls_status')) {
				newPath = removeURLParameter(newPath, 'status');
				newPath = removeURLParameter(newPath, 'tls_status');
			}

			setNoIssueFilter(false);
		}

		if (filterType == 'brokenSecurity' && filterStatus == true) {
			setImageNotWorkingFilter(false);
			setImageBrokenSecurityFilter(true);
			setNoIssueFilter(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, 'status');
			newPath = removeURLParameter(newPath, 'tls_status');

			if (newPath.includes('?')) newPath += `&tls_status=ERROR&tls_status=NONE`;
			else newPath += `?tls_status=ERROR&tls_status=NONE`;
		} else if (filterType == 'brokenSecurity' && filterStatus == false) {
			filterQueryString && filterQueryString.delete('status');
			filterQueryString && filterQueryString.delete('tls_status');

			if (newPath.includes('status') && newPath.includes('tls_status')) {
				newPath = removeURLParameter(newPath, 'status');
				newPath = removeURLParameter(newPath, 'tls_status');
			}

			setImageBrokenSecurityFilter(false);
		}

		if (filterType == 'all' && filterStatus == true) {
			setImageNotWorkingFilter(false);
			setImageBrokenSecurityFilter(false);
			setNoIssueFilter(false);
			setAllFilter(true);

			newPath = removeURLParameter(newPath, 'status');
			newPath = removeURLParameter(newPath, 'tls_status');

			// if (!newPath.includes("search") && !newPath.includes("status"))
			//   newPath = newPath.replace("?", "");
		}

		if (newPath.includes('?')) setPagePath(`${newPath}&`);
		else setPagePath(`${newPath}?`);

		Router.push(newPath);

		updateImages();

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

			Router.push('/dashboard/site/[siteId]/images/', newPath);

			updateImages();

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
				ImageTableContent,
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

		if (
			filterQueryStringValue.getAll('status').includes('TIMEOUT') &&
			filterQueryStringValue.getAll('status').includes('HTTP_ERROR') &&
			filterQueryStringValue.getAll('status').includes('OTHER_ERROR')
		) {
			setImageNotWorkingFilter(true);
			setImageBrokenSecurityFilter(false);
			setAllFilter(false);
			setNoIssueFilter(false);
		}

		if (
			filterQueryStringValue.get('status') === 'OK' &&
			filterQueryStringValue.get('tls_status') === 'OK'
		) {
			setImageNotWorkingFilter(false);
			setImageBrokenSecurityFilter(false);
			setAllFilter(false);
			setNoIssueFilter(true);
		}

		if (
			filterQueryStringValue.getAll('tls_status').includes('ERROR') &&
			filterQueryStringValue.getAll('tls_status').includes('NONE')
		) {
			setImageNotWorkingFilter(false);
			setImageBrokenSecurityFilter(true);
			setAllFilter(false);
			setNoIssueFilter(false);
		}

		if (!filterQueryStringValue.toString().length) {
			setImageNotWorkingFilter(false);
			setImageBrokenSecurityFilter(false);
			setAllFilter(true);
			setNoIssueFilter(false);
		}
	}, []);

	useEffect(() => {
		if (
			props.result.status !== undefined &&
			props.result.tls_status == undefined &&
			props.result.status.includes('HTTP_ERROR') &&
			props.result.status.includes('OTHER_ERROR') &&
			props.result.status.includes('TIMEOUT')
		) {
			setImageNotWorkingFilter(true);
			setImageBrokenSecurityFilter(false);
			setNoIssueFilter(false);
			setAllFilter(false);
		}

		if (
			props.result.status == undefined &&
			props.result.tls_status !== undefined &&
			props.result.tls_status.includes('ERROR') &&
			props.result.tls_status.includes('NONE')
		) {
			setImageNotWorkingFilter(false);
			setImageBrokenSecurityFilter(true);
			setNoIssueFilter(false);
			setAllFilter(false);
		}

		if (
			props.result.status !== undefined &&
			props.result.tls_status !== undefined &&
			props.result.status.includes('OK') &&
			props.result.tls_status.includes('OK')
		) {
			setImageNotWorkingFilter(false);
			setImageBrokenSecurityFilter(false);
			setNoIssueFilter(true);
			setAllFilter(false);
		}

		if (
			props.result.status == undefined &&
			props.result.tls_status == undefined &&
			filterQueryString &&
			!filterQueryString.toString().length
		) {
			setImageNotWorkingFilter(false);
			setNoIssueFilter(false);
			setImageBrokenSecurityFilter(false);
			setAllFilter(true);
		}
	}, [filterChangeHandler, filterQueryString]);

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
		imageError && <Layout>{imageError.message}</Layout>;
	}
	{
		scanError && <Layout>{scanError.message}</Layout>;
	}
	{
		siteError && <Layout>{siteError.message}</Layout>;
	}

	return (
		<Layout>
			{user && image && site ? (
				<Fragment>
					<Head>
						<title>
							{pageTitle} {site.name}
						</title>
					</Head>

					<ImagesDiv className={`h-screen flex overflow-hidden bg-gray-300`}>
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
									className={`max-w-full mx-auto px-4 md:py-4 sm:px-6 md:px-8`}
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
													{ImagesLabel[0].label}
												</a>
											</Link>
										</nav>
										<nav
											className={`hidden sm:flex items-center text-sm leading-5`}
										>
											<Link
												href={'/dashboard/site/' + query.siteId + '/overview'}
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
												href={'/dashboard/site/' + query.siteId + '/images'}
											>
												<a
													className={`font-medium text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out`}
												>
													{ImagesLabel[1].label}
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
																		d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z'
																		clipRule='evenodd'
																	/>
																</svg>
																{image.count > 0
																	? image.count + ' ' + ImagesLabel[2].label
																	: ImagesLabel[3].label}
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
												{ImagesLabel[4].label}
											</button>
										) : (
											<button
												disabled={`disabled`}
												type={`button`}
												className={`w-32 mt-3 mr-3 rounded-md shadow sm:mt-0 relative items-center px-4 py-2 border border-transparent text-sm uppercase leading-5 font-medium rounded-md block text-white text-center bg-gray-1000 opacity-50 cursor-not-allowed`}
											>
												{ImagesLabel[4].label}
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
									<ImageFilter
										onFilterChange={filterChangeHandler}
										allFilter={allFilter}
										noIssueFilter={noIssueFilter}
										imageNotWorkingFilter={imageNotWorkingFilter}
										imageBrokenSecurityFilter={imageBrokenSecurityFilter}
									/>
									<MyPagination
										href='/dashboard/site/[siteId]/images'
										pathName={pagePath}
										apiEndpoint={scanApiEndpoint}
										page={props.result.page ? props.result.page : 0}
										linksPerPage={linksPerPage}
										onItemsPerPageChange={onItemsPerPageChange}
									/>
									<div className={`py-4`}>
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
																{ImageTableContent.map((site, key) => {
																	return (
																		<Fragment key={key}>
																			<th
																				className={`px-6 py-3 border-b border-gray-300 bg-white text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider ${
																					site.slug === 'image-size' ||
																					site.slug === 'status' ||
																					site.slug === 'occurrences'
																						? 'min-width-adjust'
																						: 'min-w-full'
																				}`}
																			>
																				<div className={`flex items-center`}>
																					{site.slug != undefined ? (
																						<ImageSorting
																							sortOrder={sortOrder}
																							onSortHandler={SortHandler}
																							key={key}
																							slug={site.slug}
																						/>
																					) : null}
																					<span className='label'>
																						{site.label}
																					</span>
																				</div>
																			</th>
																		</Fragment>
																	);
																})}
															</tr>
														</thead>
														{image.results &&
															image.results.map((val, key) => (
																<ImageTable key={key} val={val} />
															))}
													</table>
												</div>
											</div>
										</div>
									</div>

									<MyPagination
										href='/dashboard/site/[siteId]/images'
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
					</ImagesDiv>
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

export default Images;

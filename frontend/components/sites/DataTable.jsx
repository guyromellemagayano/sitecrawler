import { useState, Fragment } from 'react';
import fetch from 'node-fetch';
import Cookies from 'js-cookie';
import useSWR from 'swr';
import Link from 'next/link';
import styled from 'styled-components';
import Moment from 'react-moment';
import Layout from '../Layout';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Skeleton from 'react-loading-skeleton';
import { Transition } from '@tailwindui/react';

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

const DataTableDiv = styled.tr`
	div {
		ol {
			list-style-type: decimal;
			list-style-position: inside;
			margin-left: 1rem;
		}
	}
`;

const DataTable = (props) => {
	const [copyValue, setCopyValue] = useState(
		`<meta name="epic-crawl-id" content="${props.site.verification_id}" />`
	);
	const [copied, setCopied] = useState(false);
	const [siteVerifyId, setSiteVerifyId] = useState(props.site.id);
	const [errorMsg, setErrorMsg] = useState('');
	const [successMsg, setSuccessMsg] = useState('');
	const [disableSiteVerify, setDisableSiteVerify] = useState(false);
	const [enableNextStep, setEnableNextStep] = useState(false);
	const [showVerifySiteModal, setShowVerifySiteModal] = useState(false);
	const [showDeleteSiteModal, setShowDeleteSiteModal] = useState(false);
	const calendarStrings = {
		lastDay: '[Yesterday], dddd',
		sameDay: '[Today], dddd',
		lastWeek: 'MMMM DD, YYYY',
		sameElse: 'MMMM DD, YYYY'
	};

	const handleInputChange = ({ copyValue }) => {
		setCopyValue({ copyValue, copied });
	};

	const handleHiddenInputChange = (e) => {
		setSiteVerifyId({ value: e.currentTarget.site_verify_id.value });
	};

	const handleInputCopy = () => {
		setCopied(true);
	};

	const deleteSiteSettings = async (endpoint) => {
		await fetch(endpoint, {
			method: 'DELETE',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'X-CSRFToken': Cookies.get('csrftoken')
			}
		});
	};

	const handleSiteDeletion = async (e) => {
		e.preventDefault();

		await deleteSiteSettings(`/api/site/${props.site.id}/`);

		setTimeout(() => {
			setShowDeleteSiteModal(false);
		}, 500);
	};

	const handleSiteVerification = async (e) => {
		e.preventDefault();

		if (errorMsg) setErrorMsg('');
		if (successMsg) setSuccessMsg('');

		const body = {
			sid: e.currentTarget.site_verify_id.value
		};

		const response = await fetch('/api/site/' + props.site.id + '/verify/', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'X-CSRFToken': Cookies.get('csrftoken')
			},
			body: JSON.stringify(body)
		});

		const data = await response.json();

		if (response.ok && data.verified) {
			setSuccessMsg('Site verification success. Proceed to the next step.');
			setDisableSiteVerify(!disableSiteVerify);
			setEnableNextStep(!enableNextStep);
		} else if (response.ok && !data.verified) {
			setErrorMsg(
				'Site verification failed. You have not verify the site yet.'
			);
		} else {
			throw new Error(await response.text());
		}
	};

	const { data: scan, error: scanError } = useSWR(
		() =>
			props ? `/api/site/${props.site.id}/scan/?ordering=-finished_at` : null,
		fetcher,
		{ refreshInterval: 1000 }
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

	const { data: stats, error: statsError } = useSWR(
		() =>
			props && scanObjId
				? `/api/site/${props.site.id}/scan/${scanObjId}/`
				: `/api/site/${props.site.id}/`,
		fetcher,
		{ refreshInterval: 1000 }
	);

	const { data: links, error: linksError } = useSWR(
		() =>
			props && scanObjId
				? `/api/site/${props.site.id}/scan/${scanObjId}/link/`
				: null,
		fetcher,
		{
			refreshInterval: 1000
		}
	);

	const { data: images, error: imagesError } = useSWR(
		() =>
			props && scanObjId
				? `/api/site/${props.site.id}/scan/${scanObjId}/image/?tls_status=NONE&tls_status=ERROR`
				: null,
		fetcher,
		{
			refreshInterval: 1000
		}
	);

	const setLinkErrors = (type) => {
		let valLength = 0;

		if (links) {
			links.results.map((val, key) => {
				if (
					val.status === 'HTTP_ERROR' ||
					val.status === 'TIMEOUT' ||
					val.status === 'OTHER_ERROR'
				) {
					if (val.type === type) {
						valLength++;
					}
				}
			});
		}

		return valLength;
	};

	const setSeoErrors = () => {
		let valLength = 0;

		if (stats) {
			if (
				(stats.num_pages_without_title !== 0 &&
					stats.num_pages_without_title !== undefined) ||
				(stats.num_pages_without_description !== 0 &&
					stats.num_pages_without_description !== undefined) ||
				(stats.num_pages_without_h1_first !== 0 &&
					stats.num_pages_without_h1_first !== undefined) ||
				(stats.num_pages_without_h2_first !== 0 &&
					stats.num_pages_without_h2_first !== undefined)
			) {
				valLength =
					(stats ? stats.num_pages_without_title : 0) +
					(stats ? stats.num_pages_without_description : 0) +
					(stats ? stats.num_pages_without_h1_first : 0) +
					(stats ? stats.num_pages_without_h2_first : 0);
			}
		}

		return valLength;
	};

	const setPageErrors = () => {
		let valLength = 0;

		if (stats) {
			if (
				(stats.num_pages_big !== 0 && stats.num_pages_big !== undefined) ||
				(stats.num_pages_tls_non_ok !== 0 &&
					stats.num_pages_tls_non_ok !== undefined)
			) {
				valLength =
					(stats ? stats.num_pages_big : 0) +
					(stats ? stats.num_pages_tls_non_ok : 0);
			}
		}

		return valLength;
	};

	const setImageErrors = () => {
		let valLength = 0;

		if (stats) {
			if (
				stats.num_non_ok_images !== 0 &&
				stats.num_non_ok_images !== undefined
			) {
				valLength = stats ? stats.num_non_ok_images : 0;
			}
		}

		if (images && images.count !== undefined) {
			valLength = valLength + (images.count ? images.count : 0);
		}

		return valLength;
	};

	const setTotalIssues = () => {
		let valLength = 0;

		valLength =
			setLinkErrors('PAGE') +
			setLinkErrors('EXTERNAL') +
			setSeoErrors() +
			setPageErrors() +
			setImageErrors();

		return valLength;
	};

	{
		statsError && <Layout>{statsError.message}</Layout>;
	}
	{
		scanError && <Layout>{scanError.message}</Layout>;
	}
	{
		linksError && <Layout>{linksError.message}</Layout>;
	}
	{
		imagesError && <Layout>{imagesError.message}</Layout>;
	}

	if (!scan || !stats) {
		return (
			<Fragment>
				<DataTableDiv>
					{[...Array(6)].map((val, index) => (
						<td
							className={`flex-none px-6 py-4 whitespace-no-wrap border-b border-gray-300`}
							key={index}
						>
							<Skeleton duration={2} />
						</td>
					))}
				</DataTableDiv>
			</Fragment>
		);
	}

	return (
		<DataTableDiv>
			<td
				className={`flex-none px-6 py-4 whitespace-no-wrap border-b border-gray-300`}
			>
				<div className={`flex items-center`}>
					{props.site.url && props.site.name ? (
						<div className={`mr-4`}>
							<div
								className={`text-overflow text-sm leading-5 font-medium text-gray-900`}
							>
								{!props.site.verified ? (
									<span
										className={`text-sm leading-5 font-semibold text-gray-500`}
									>
										{props.site.name}
									</span>
								) : (
									<Link
										href='/dashboard/site/[siteId]/overview'
										as={`/dashboard/site/${props.site.id}/overview`}
									>
										<a
											className={`text-sm leading-6 font-semibold transition ease-in-out duration-150 text-indigo-600 hover:text-indigo-500`}
										>
											{props.site.name}
										</a>
									</Link>
								)}
							</div>
							<div
								className={`flex justify-start text-sm leading-5 text-gray-500`}
							>
								{!props.site.verified && (
									<Fragment>
										<button
											type={`button`}
											id={`siteVerifySiteModalButton`}
											className={`flex items-center justify-start text-sm leading-6 font-semibold text-yellow-600 hover:text-yellow-500 transition ease-in-out duration-150`}
											onClick={() =>
												setShowVerifySiteModal(!showVerifySiteModal)
											}
										>
											Verify Site
										</button>
										<button
											type={`button`}
											id={`siteVerifySiteModalButton`}
											className={`ml-3 flex items-center justify-start text-sm leading-6 font-semibold text-red-600 hover:text-red-500 transition ease-in-out duration-150`}
											onClick={(e) =>
												setShowDeleteSiteModal(!showDeleteSiteModal)
											}
										>
											Delete Site
										</button>
									</Fragment>
								)}
							</div>
						</div>
					) : null}
				</div>
			</td>
			<td className={`px-6 py-4 whitespace-no-wrap border-b border-gray-300`}>
				<div className={`text-sm leading-5 text-gray-900`}>
					{!props.user.settings.disableLocalTime ? (
						<Moment calendar={calendarStrings} date={stats.finished_at} local />
					) : (
						<Moment calendar={calendarStrings} date={stats.finished_at} utc />
					)}
				</div>
				<div className={`text-sm leading-5 text-gray-500`}>
					{!props.user.settings.disableLocalTime ? (
						<Moment date={stats.finished_at} format='hh:mm:ss A' local />
					) : (
						<Moment date={stats.finished_at} format='hh:mm:ss A' utc />
					)}
				</div>
			</td>
			{setTotalIssues() > 0 ? (
				<td
					className={`px-6 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 font-semibold text-red-500`}
				>
					<Link
						href='/dashboard/site/[siteId]/overview'
						as={`/dashboard/site/${props.site.id}/overview`}
					>
						<a>{setTotalIssues()}</a>
					</Link>
				</td>
			) : (
				<td
					className={`px-6 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 font-semibold text-red-500`}
				>
					<Link
						href='/dashboard/site/[siteId]/overview'
						as={`/dashboard/site/${props.site.id}/overview`}
					>
						<a>0</a>
					</Link>
				</td>
			)}
			{stats.num_links ? (
				<td
					className={`px-6 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 font-semibold text-gray-500`}
				>
					<Link
						href='/dashboard/site/[siteId]/links'
						as={`/dashboard/site/${props.site.id}/links`}
					>
						<a
							className={`text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}
						>
							{stats.num_links}
						</a>
					</Link>
				</td>
			) : (
				<td
					className={`px-6 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 font-semibold text-gray-500`}
				>
					0
				</td>
			)}
			{stats.num_pages ? (
				<td
					className={`px-6 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 font-semibold text-gray-500`}
				>
					<Link
						href='/dashboard/site/[siteId]/pages'
						as={`/dashboard/site/${props.site.id}/pages`}
					>
						<a
							className={`text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}
						>
							{stats.num_pages}
						</a>
					</Link>
				</td>
			) : (
				<td
					className={`px-6 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 font-semibold text-gray-500`}
				>
					0
				</td>
			)}
			{stats.num_images ? (
				<td
					className={`px-6 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 font-semibold text-gray-500`}
				>
					<Link
						href='/dashboard/site/[siteId]/images'
						as={`/dashboard/site/${props.site.id}/images`}
					>
						<a
							className={`text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}
						>
							{stats.num_images}
						</a>
					</Link>
				</td>
			) : (
				<td
					className={`px-6 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 font-semibold text-gray-500`}
				>
					0
				</td>
			)}

			<Transition show={showVerifySiteModal}>
				<div
					className={`fixed bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center`}
				>
					<Transition.Child
						enter='ease-out duration-300'
						enterFrom='opacity-0'
						enterTo='opacity-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100'
						leaveTo='opacity-100'
					>
						<div className={`fixed inset-0 transition-opacity`}>
							<div className={`absolute inset-0 bg-gray-500 opacity-75`}></div>
						</div>
					</Transition.Child>
					<Transition.Child
						enter='ease-out duration-300'
						enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
						enterTo='opacity-100 translate-y-0 sm:scale-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100 translate-y-0 sm:scale-100'
						leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
					>
						<div
							className={`bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xs-xl transform transition-all sm:max-w-lg sm:w-full sm:p-6`}
							role='dialog'
							aria-modal='true'
							aria-labelledby='modal-headline'
						>
							<div className={`sm:flex sm:items-start`}>
								<div
									className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10`}
								>
									<svg
										className={`h-6 w-6 text-yellow-600`}
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
											d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
										/>
									</svg>
								</div>
								<div
									className={`mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left`}
								>
									<h3
										className={`text-lg leading-6 font-medium text-gray-800`}
										id='modal-headline'
									>
										Verify Site:{' '}
										<a
											href={stats.url}
											target='_blank'
											title={stats.url}
											className={`break-all text-md leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}
										>
											{stats.url}
										</a>
									</h3>
									<div className={`mt-2`}>
										<p className={`text-sm leading-5 text-gray-600`}>
											At the end of the day, going forward, a new normal that
											has evolved from generation X is on the runway heading
											towards a streamlined cloud solution.
										</p>
										<p
											className={`text-md font-medium leading-6 text-gray-700 mt-4 mb-3`}
										>
											Instructions:
										</p>
										<ol>
											<li className={`text-sm leading-6 text-gray-600`}>
												Sign in to your website.
											</li>
											<li className={`text-sm leading-6 text-gray-600`}>
												Copy the meta tag below and add it within your website's{' '}
												<strong>{`<HEAD>`}</strong> tag <br />
												<div>
													<div className={`my-3 flex`}>
														<div
															className={`rounded-md shadow-xs-sm max-w-sm relative flex-grow focus-within:z-10`}
														>
															<input
																id='email'
																className={`form-input block w-full rounded-none rounded-l-md transition ease-in-out duration-150 sm:text-sm sm:leading-5`}
																name={`verify_id_meta_tag`}
																value={copyValue}
																onChange={handleInputChange}
																autoComplete={`off`}
															/>
														</div>
														<CopyToClipboard
															onCopy={handleInputCopy}
															text={copyValue}
														>
															<button
																className={`-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-r-md text-gray-700 bg-gray-100 hover:text-gray-500 hover:bg-white focus:outline-none focus:shadow-xs-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150`}
															>
																<span>{copied ? 'Copied!' : 'Copy'}</span>
															</button>
														</CopyToClipboard>
													</div>
												</div>
											</li>
											<li className={`text-sm leading-6 text-gray-600`}>
												Press <strong>Verify Site</strong> button below
											</li>
										</ol>
									</div>

									{errorMsg && (
										<div className={`block p-2 mt-3`}>
											<div
												className={`flex sm:ml-2 justify-center sm:justify-start`}
											>
												<div>
													<h3
														className={`text-sm leading-5 font-medium text-red-800 break-words`}
													>
														{errorMsg}
													</h3>
												</div>
											</div>
										</div>
									)}

									{successMsg && (
										<div className={`block p-2 mt-3`}>
											<div
												className={`flex sm:ml-2 justify-center sm:justify-start`}
											>
												<div>
													<h3
														className={`text-sm leading-5 font-medium text-green-800 break-words`}
													>
														{successMsg}
													</h3>
												</div>
											</div>
										</div>
									)}
								</div>
							</div>

							<div
								className={`w-full my-3 sm:mt-4 sm:inline-flex sm:flex-row-reverse`}
							>
								{!disableSiteVerify ? (
									<span
										className={`mt-3 sm:ml-3 flex w-full rounded-md shadow-xs-sm sm:mt-0 sm:w-auto`}
									>
										<form
											onSubmit={handleSiteVerification}
											className={`w-full`}
										>
											<input
												type='hidden'
												value={siteVerifyId}
												name={`site_verify_id`}
												onChange={handleHiddenInputChange}
											/>
											<button
												type={`submit`}
												className={`inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-sm leading-5 font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-xs-outline-indigo focus:border-indigo-700 active:bg-indigo-700`}
											>
												Verify Site
											</button>
										</form>
									</span>
								) : null}

								{enableNextStep ? (
									<span
										className={`mt-3 sm:ml-3 flex w-full rounded-md shadow-xs-sm sm:mt-0 sm:w-auto`}
									>
										<Link
											href='/dashboard/site/[siteId]/overview'
											as={`/dashboard/site/${props.site.id}/overview`}
										>
											<a
												className={`inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-sm leading-5 font-medium text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:shadow-xs-outline-green focus:border-green-700 active:bg-green-700`}
											>
												Go to Site Overview
											</a>
										</Link>
									</span>
								) : null}

								<span
									className={`mt-3 flex w-full rounded-md shadow-xs-sm sm:mt-0 sm:w-auto`}
								>
									<button
										type='button'
										className={`inline-flex justify-center w-full rounded-md border border-gray-300 sm:ml-3 px-4 py-2 bg-white text-sm leading-5 font-medium text-gray-700 shadow-xs-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-xs-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5`}
										onClick={() =>
											setTimeout(
												() => setShowVerifySiteModal(!showVerifySiteModal),
												150
											)
										}
									>
										Close
									</button>
								</span>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Transition>

			<Transition show={showDeleteSiteModal}>
				<div
					className={`fixed bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center`}
				>
					<Transition.Child
						enter='ease-out duration-300'
						enterFrom='opacity-0'
						enterTo='opacity-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100'
						leaveTo='opacity-100'
					>
						<div className={`fixed inset-0 transition-opacity`}>
							<div className={`absolute inset-0 bg-gray-500 opacity-75`}></div>
						</div>
					</Transition.Child>
					<Transition.Child
						enter='ease-out duration-300'
						enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
						enterTo='opacity-100 translate-y-0 sm:scale-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100 translate-y-0 sm:scale-100'
						leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
					>
						<div
							className={`bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xs-xl transform transition-all sm:max-w-lg sm:w-full sm:p-6`}
							role='dialog'
							aria-modal='true'
							aria-labelledby='modal-headline'
						>
							<div className={`sm:flex sm:items-start`}>
								<div
									className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10`}
								>
									<svg
										className={`h-6 w-6 text-red-600`}
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
											d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
										/>
									</svg>
								</div>
								<div
									className={`mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left`}
								>
									<h3
										className={`text-lg leading-6 font-medium text-gray-900`}
										id='modal-headline'
									>
										Delete Site
									</h3>
									<div className={`mt-2`}>
										<p className={`text-sm leading-5 text-gray-500`}>
											Are you sure you want to delete this website? You will
											lose all its data and settings.
										</p>
									</div>
								</div>
							</div>
							<div className={`mt-5 sm:mt-4 sm:flex sm:flex-row-reverse`}>
								<span
									className={`flex w-full rounded-md shadow-xs-sm sm:ml-3 sm:w-auto`}
								>
									<button
										type='button'
										className={`inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-red-600 text-base leading-6 font-medium text-white shadow-xs-sm hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-xs-outline-red transition ease-in-out duration-150 sm:text-sm sm:leading-5`}
										onClick={(e) => handleSiteDeletion(e)}
									>
										Delete
									</button>
								</span>
								<span
									className={`mt-3 flex w-full rounded-md shadow-xs-sm sm:mt-0 sm:w-auto`}
								>
									<button
										type='button'
										className={`inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-xs-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-xs-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5`}
										onClick={() =>
											setTimeout(
												() => setShowDeleteSiteModal(!showDeleteSiteModal),
												150
											)
										}
									>
										Cancel
									</button>
								</span>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Transition>
		</DataTableDiv>
	);
};

export default DataTable;

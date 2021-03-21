// React
import { useState } from 'react';

// NextJS
import Link from 'next/link';

// External
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Transition } from '@headlessui/react';
import Moment from 'react-moment';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import Skeleton from 'react-loading-skeleton';
import tw, { styled } from 'twin.macro';
import useSWR from 'swr';

// JSON
import DataTableLabel from 'public/labels/components/sites/DataTable.json';

// Hooks
import useDeleteMethod from 'src/hooks/useDeleteMethod';
import useFetcher from 'src/hooks/useFetcher';
import usePostMethod from 'src/hooks/usePostMethod';

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
	const [errorMsg, setErrorMsg] = useState(null);
	const [successMsg, setSuccessMsg] = useState(null);
	const [disableSiteVerify, setDisableSiteVerify] = useState(false);
	const [enableNextStep, setEnableNextStep] = useState(false);
	const [showVerifySiteModal, setShowVerifySiteModal] = useState(false);
	const [showDeleteSiteModal, setShowDeleteSiteModal] = useState(false);

	const siteIdApiEndpoint = '/api/site/' + props.site.id;
	const siteVerifyApiEndpoint = '/api/site/' + props.site.id + '/verify/';
	const scanApiEndpoint =
		'/api/site/' + props.site.id + '/scan/?ordering=-finished_at';
	const statsApiEndpoint = '/api/site/' + props.site.id + '/scan/';

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

	const handleSiteDeletion = async (e) => {
		e.preventDefault();

		await useDeleteMethod(siteIdApiEndpoint);

		setTimeout(() => {
			setShowDeleteSiteModal(false);
		}, 500);
	};

	const handleSiteVerification = async (e) => {
		e.preventDefault();

		if (errorMsg) setErrorMsg('');
		if (successMsg) setSuccessMsg('');

		setDisableSiteVerify(!disableSiteVerify);

		const body = {
			sid: e.currentTarget.site_verify_id.value
		};

		const response = await usePostMethod(siteVerifyApiEndpoint, body);

		if (Math.floor(response.status / 200) === 1) {
			if (response.data.verified === true) {
				setTimeout(() => {
					setEnableNextStep(!enableNextStep);
					setSuccessMsg(DataTableLabel[13].label);
					setDisableSiteVerify(false);
				}, 500);
			} else {
				setErrorMsg(DataTableLabel[14].label);
				setTimeout(() => {
					setDisableSiteVerify(false);
				}, 500);
			}
		} else {
			// FIXME: Error handling for response
			if (response.data) {
				console.log('ERROR: ' + response.data);
			} else {
				setSubmitting(false);
				resetForm({ values: '' });
				setErrorMsg(DataTableLabel[15]);
			}
		}
	};

	const { data: scan } = useSWR(
		() => (props ? scanApiEndpoint : null),
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
			props && scanObjId ? statsApiEndpoint + scanObjId : siteIdApiEndpoint,
		useFetcher
	);

	const { data: links } = useSWR(
		() => (props && scanObjId ? statsApiEndpoint + scanObjId + '/link/' : null),
		useFetcher
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

	return scan && stats ? (
		<DataTableDiv>
			<td tw='flex-none px-6 py-4 whitespace-nowrap border-b border-gray-300'>
				<div tw='flex items-center'>
					{props.site.url && props.site.name ? (
						<div tw='mr-4'>
							<div tw='truncate text-sm leading-5 font-medium text-gray-900'>
								{!props.site.verified ? (
									<span tw='text-sm leading-5 font-semibold text-gray-500'>
										{props.site.name}
									</span>
								) : (
									<Link
										href='/dashboard/site/[siteId]/overview'
										as={`/dashboard/site/${props.site.id}/overview`}
									>
										<a tw='text-sm leading-6 font-semibold transition ease-in-out duration-150 text-indigo-600 hover:text-indigo-500'>
											{props.site.name}
										</a>
									</Link>
								)}
							</div>
							<div tw='flex justify-start text-sm leading-5 text-gray-500'>
								{!props.site.verified && (
									<>
										<button
											type='button'
											id='siteVerifySiteModalButton'
											tw='flex items-center justify-start text-sm focus:outline-none  leading-6 font-semibold text-yellow-600 hover:text-yellow-500 transition ease-in-out duration-150'
											onClick={() =>
												setShowVerifySiteModal(!showVerifySiteModal)
											}
										>
											{DataTableLabel[0].label}
										</button>
										<button
											type='button'
											id='siteVerifySiteModalButton'
											tw='ml-3 flex items-center justify-start text-sm focus:outline-none leading-6 font-semibold text-red-600 hover:text-red-500 transition ease-in-out duration-150'
											onClick={(e) =>
												setShowDeleteSiteModal(!showDeleteSiteModal)
											}
										>
											{DataTableLabel[1].label}
										</button>
									</>
								)}
							</div>
						</div>
					) : null}
				</div>
			</td>
			<td tw='px-6 py-4 whitespace-nowrap border-b border-gray-300'>
				{stats['verified'] === undefined ? (
					<>
						<div tw='text-sm leading-5 text-gray-900'>
							{!props.userInfo.settings.disableLocalTime ? (
								<Moment
									calendar={calendarStrings}
									date={stats.finished_at}
									local
								/>
							) : (
								<Moment
									calendar={calendarStrings}
									date={stats.finished_at}
									utc
								/>
							)}
						</div>
						<div tw='text-sm leading-5 text-gray-500'>
							{!props.userInfo.settings.disableLocalTime ? (
								<Moment date={stats.finished_at} format='hh:mm:ss A' local />
							) : (
								<Moment date={stats.finished_at} format='hh:mm:ss A' utc />
							)}
						</div>
					</>
				) : (
					<div tw='text-sm leading-5 text-gray-500'>
						{DataTableLabel[2].label}
					</div>
				)}
			</td>
			{setTotalIssues() > 0 ? (
				<td tw='px-6 py-4 whitespace-nowrap border-b border-gray-300 text-sm leading-5 font-semibold text-red-500'>
					<Link
						href='/dashboard/site/[siteId]/overview'
						as={`/dashboard/site/${props.site.id}/overview`}
					>
						<a>{setTotalIssues()}</a>
					</Link>
				</td>
			) : (
				<td tw='px-6 py-4 whitespace-nowrap border-b border-gray-300 text-sm leading-5 font-semibold text-red-500'>
					<Link
						href='/dashboard/site/[siteId]/overview'
						as={`/dashboard/site/${props.site.id}/overview`}
					>
						<a>0</a>
					</Link>
				</td>
			)}
			{stats.num_links ? (
				<td tw='px-6 py-4 whitespace-nowrap border-b border-gray-300 text-sm leading-5 font-semibold text-gray-500'>
					<Link
						href='/dashboard/site/[siteId]/links'
						as={`/dashboard/site/${props.site.id}/links`}
					>
						<a tw='text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150'>
							{stats.num_links}
						</a>
					</Link>
				</td>
			) : (
				<td tw='px-6 py-4 whitespace-nowrap border-b border-gray-300 text-sm leading-5 font-semibold text-gray-500'>
					0
				</td>
			)}
			{stats.num_pages ? (
				<td tw='px-6 py-4 whitespace-nowrap border-b border-gray-300 text-sm leading-5 font-semibold text-gray-500'>
					<Link
						href='/dashboard/site/[siteId]/pages'
						as={`/dashboard/site/${props.site.id}/pages`}
					>
						<a tw='text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150'>
							{stats.num_pages}
						</a>
					</Link>
				</td>
			) : (
				<td tw='px-6 py-4 whitespace-nowrap border-b border-gray-300 text-sm leading-5 font-semibold text-gray-500'>
					0
				</td>
			)}
			{stats.num_images ? (
				<td tw='px-6 py-4 whitespace-nowrap border-b border-gray-300 text-sm leading-5 font-semibold text-gray-500'>
					<Link
						href='/dashboard/site/[siteId]/images'
						as={`/dashboard/site/${props.site.id}/images`}
					>
						<a tw='text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150'>
							{stats.num_images}
						</a>
					</Link>
				</td>
			) : (
				<td tw='px-6 py-4 whitespace-nowrap border-b border-gray-300 text-sm leading-5 font-semibold text-gray-500'>
					0
				</td>
			)}

			<Transition show={showVerifySiteModal}>
				<div tw='fixed bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center'>
					<Transition.Child
						enter='ease-out duration-300'
						enterFrom='opacity-0'
						enterTo='opacity-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100'
						leaveTo='opacity-100'
					>
						<div tw='fixed inset-0 transition-opacity'>
							<div tw='absolute inset-0 bg-gray-500 opacity-75'></div>
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
							tw='bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden ring-1 ring-black ring-opacity-5 transform transition-all sm:max-w-lg sm:w-full sm:p-6'
							role='dialog'
							aria-modal='true'
							aria-labelledby='modal-headline'
						>
							<div tw='sm:flex sm:items-start'>
								<div tw='mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10'>
									{/* TODO: change this to SVG component */}
									<svg
										className='h-6 w-6 text-yellow-600'
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
								<div tw='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
									<h3
										tw='text-lg leading-6 font-medium text-gray-800'
										id='modal-headline'
									>
										{DataTableLabel[3].label}&nbsp;
										<a
											href={stats.url}
											target='_blank'
											title={stats.url}
											tw='break-all text-base leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150'
										>
											{stats.url}
										</a>
									</h3>
									<div tw='mt-2'>
										<p tw='text-sm leading-5 text-gray-600'>
											{DataTableLabel[4].label}
										</p>
										<p tw='text-base font-medium leading-6 text-gray-700 mt-4 mb-3'>
											{DataTableLabel[5].label}
										</p>
										<ol>
											<li tw='text-sm leading-6 text-gray-600'>
												{DataTableLabel[6].label}
											</li>
											<li tw='text-sm leading-6 text-gray-600'>
												{ReactHtmlParser(DataTableLabel[7].label)}
												<div>
													<div tw='my-3 flex'>
														<div tw='rounded-md shadow-sm max-w-sm relative flex-grow focus-within:z-10'>
															<input
																id='email'
																css={[
																	tw`block w-full rounded-none rounded-l-md transition ease-in-out duration-150 sm:text-sm sm:leading-5`,
																	disableSiteVerify
																		? tw`opacity-50 bg-gray-300 cursor-not-allowed`
																		: null
																]}
																name='verify_id_meta_tag'
																value={copyValue}
																onChange={handleInputChange}
																autoComplete='off'
															/>
														</div>
														<CopyToClipboard
															onCopy={handleInputCopy}
															text={copyValue}
														>
															<button
																css={[
																	tw`-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-r-md text-gray-700 bg-gray-100`,
																	disableSiteVerify
																		? tw`opacity-50 bg-indigo-300 cursor-not-allowed`
																		: tw`hover:text-gray-500 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150`
																]}
															>
																{copied ? (
																	<span>Copied</span>
																) : (
																	<span>Copy</span>
																)}
															</button>
														</CopyToClipboard>
													</div>
												</div>
											</li>
											<li tw='text-sm leading-6 text-gray-600'>
												{ReactHtmlParser(DataTableLabel[8].label)}
											</li>
										</ol>
									</div>

									{errorMsg && (
										<div tw='block p-2 my-5'>
											<div tw='flex justify-center sm:justify-start'>
												<div>
													<h3 tw='text-sm leading-5 font-medium text-red-800 break-words'>
														{errorMsg}
													</h3>
												</div>
											</div>
										</div>
									)}

									{successMsg && (
										<div tw='block p-2 my-5'>
											<div tw='flex justify-center sm:justify-start'>
												<div>
													<h3 tw='text-sm leading-5 font-medium text-green-800 break-words'>
														{successMsg}
													</h3>
												</div>
											</div>
										</div>
									)}
								</div>
							</div>

							<div tw='w-full my-3 sm:mt-4 sm:inline-flex sm:flex-row-reverse'>
								<span tw='mt-3 sm:ml-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto'>
									<form onSubmit={handleSiteVerification} tw='w-full'>
										<input
											type='hidden'
											value={siteVerifyId}
											name='site_verify_id'
											onChange={handleHiddenInputChange}
										/>
										<button
											type='submit'
											disabled={disableSiteVerify}
											css={[
												tw`inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 text-sm leading-5 font-medium text-white bg-indigo-600`,
												disableSiteVerify
													? tw`opacity-50 cursor-not-allowed`
													: tw`hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 active:bg-indigo-700`
											]}
										>
											{disableSiteVerify
												? DataTableLabel[12].label
												: DataTableLabel[0].label}
										</button>
									</form>
								</span>

								{enableNextStep ? (
									<span tw='mt-3 sm:ml-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto'>
										<Link
											href='/dashboard/site/[siteId]/overview'
											as={`/dashboard/site/${props.site.id}/overview`}
										>
											<a tw='inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 text-sm leading-5 font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 active:bg-green-700'>
												Go to Site Overview
											</a>
										</Link>
									</span>
								) : null}

								<span tw='mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto'>
									<button
										type='button'
										disabled={disableSiteVerify}
										css={[
											tw`inline-flex justify-center w-full rounded-md border border-gray-300 sm:ml-3 px-4 py-2 bg-white text-sm leading-5 font-medium text-gray-700 shadow-sm sm:text-sm sm:leading-5`,
											disableSiteVerify
												? tw`opacity-50 cursor-not-allowed`
												: tw`hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ease-in-out duration-150`
										]}
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
				<div tw='fixed z-20 bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center'>
					<Transition.Child
						enter='ease-out duration-300'
						enterFrom='opacity-0'
						enterTo='opacity-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100'
						leaveTo='opacity-100'
					>
						<div tw='fixed inset-0 transition-opacity'>
							<div tw='absolute inset-0 bg-gray-500 opacity-75'></div>
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
							tw='bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden ring-1 ring-black ring-opacity-5 transform transition-all sm:max-w-lg sm:w-full sm:p-6'
							role='dialog'
							aria-modal='true'
							aria-labelledby='modal-headline'
						>
							<div tw='sm:flex sm:items-start'>
								<div tw='mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10'>
									{/* TODO: change this to JSX component */}
									<svg
										tw='h-6 w-6 text-red-600'
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
								<div tw='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
									<h3
										tw='text-lg leading-6 font-medium text-gray-900'
										id='modal-headline'
									>
										{DataTableLabel[1].label}
									</h3>
									<div tw='mt-2'>
										<p tw='text-sm leading-5 text-gray-500'>
											{DataTableLabel[9].label}
										</p>
									</div>
								</div>
							</div>
							<div tw='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
								<span tw='flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto'>
									<button
										type='button'
										tw='inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-red-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition ease-in-out duration-150 sm:text-sm sm:leading-5'
										onClick={(e) => handleSiteDeletion(e)}
									>
										{DataTableLabel[10].label}
									</button>
								</span>
								<span tw='mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto'>
									<button
										type='button'
										tw='inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ease-in-out duration-150 sm:text-sm sm:leading-5'
										onClick={() =>
											setTimeout(
												() => setShowDeleteSiteModal(!showDeleteSiteModal),
												150
											)
										}
									>
										{DataTableLabel[11].label}
									</button>
								</span>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Transition>
		</DataTableDiv>
	) : (
		<DataTableDiv>
			{[...Array(6)].map((val, key) => (
				<td
					tw='flex-none px-6 py-4 whitespace-nowrap border-b border-gray-300'
					key={key}
				>
					<Skeleton duration={2} />
				</td>
			))}
		</DataTableDiv>
	);
};

DataTable.propTypes = {};

export default DataTable;

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Transition } from '@tailwindui/react';
import { useState, useEffect, Fragment } from 'react';
import Cookies from 'js-cookie';
import fetch from 'node-fetch';
import Head from 'next/head';
import HowToSetup from 'components/sites/HowToSetup';
import Layout from 'components/Layout';
import Link from 'next/link';
import MainSidebar from 'components/sidebar/MainSidebar';
import MobileSidebar from 'components/sidebar/MobileSidebar';
import PropTypes from 'prop-types';
import ReactHtmlParser, {
	processNodes,
	convertNodeToElement,
	htmlparser2
} from 'react-html-parser';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';
import useUser from 'hooks/useUser';
import VerifyUrlLabel from 'public/label/pages/sites/verify-url.json';

const SitesVerifyUrlDiv = styled.section`
	ol {
		list-style-type: decimal;
		margin-left: 1rem;
	}

	.wizard-indicator {
		height: 0.25rem;
	}

	.instructions-textarea {
		margin-top: 0.5rem !important;
	}
`;

const SitesVerifyUrl = (props) => {
	const [copyValue, setCopyValue] = useState(
		`<meta name="epic-crawl-id" content="${props.vid}" />`
	);
	const [copied, setCopied] = useState(false);
	const [htmlCopied, setHtmlCopied] = useState(false);
	const [siteVerifyId, setSiteVerifyId] = useState(props.sid);
	const [errorMsg, setErrorMsg] = useState('');
	const [successMsg, setSuccessMsg] = useState('');
	const [disableSiteVerify, setDisableSiteVerify] = useState(false);
	const [enableNextStep, setEnableNextStep] = useState(false);
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
	const [showNotificationStatus, setShowNotificationStatus] = useState(false);
	const pageTitle = 'Verify Site URL';
	let htmlText =
		'1. Sign in to the administrator account of the following website: ' +
		props.surl +
		'\n\n';
	htmlText +=
		"2. Copy the following meta tag and add it within your website's <head> tag: " +
		'\n' +
		copyValue +
		'\n\n';
	htmlText += '3. Save the changes you made in that file.' + '\n\n';
	htmlText +=
		'4. Inform your client that you already made the update to the website.';

	const handleInputChange = ({ copyValue }) => {
		setCopyValue({ copyValue, copied });
	};

	const handleTextareaChange = ({ copyValue }) => {
		setCopyValue({ copyValue, htmlCopied });
	};

	const handleHiddenInputChange = (e) => {
		setSiteVerifyId({ value: e.currentTarget.site_verify_id.value });
	};

	const handleInputCopy = () => {
		setCopied(true);
	};

	const handleTextAreaCopy = () => {
		setHtmlCopied(true);
	};

	const handleSiteVerification = async (e) => {
		e.preventDefault();

		if (errorMsg) setErrorMsg('');
		if (successMsg) setSuccessMsg('');

		const body = {
			sid: e.currentTarget.site_verify_id.value
		};

		try {
			const response = await fetch('/api/site/' + body.sid + '/verify/', {
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
				setSuccessMsg('You can now proceed to the site overview.');
				setTimeout(() => setShowNotificationStatus(true), 1500);
				setDisableSiteVerify(!disableSiteVerify);
				setTimeout(() => setEnableNextStep(!enableNextStep), 1500);
			} else if (response.ok && !data.verified) {
				setErrorMsg(
					'Site verification failed. You have not verify the site yet.'
				);
				setTimeout(() => setShowNotificationStatus(true), 1500);
			} else {
				throw new Error(await response.text());
			}
		} catch (error) {
			setErrorMsg('Internal server error. Please try again.');
			setTimeout(() => setShowNotificationStatus(true), 1500);
		}
	};

	useEffect(() => {
		if (showNotificationStatus === true)
			setTimeout(() => setShowNotificationStatus(false), 7500);
	}, [showNotificationStatus]);

	const { user: user, userError: userError } = useUser({
		redirectTo: '/',
		redirectIfFound: false
	});

	{
		userError && <Layout>{userError.message}</Layout>;
	}

	return (
		<Layout>
			{user ? (
				<Fragment>
					<Head>
						<title>{pageTitle}</title>
					</Head>

					<SitesVerifyUrlDiv
						className={`h-screen flex overflow-hidden bg-gray-300`}
					>
						<MobileSidebar show={openMobileSidebar} />
						<MainSidebar />

						<Transition show={showNotificationStatus}>
							<div
								className={`fixed z-50 inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end`}
							>
								<Transition.Child
									enter='transform ease-out duration-300 transition'
									enterFrom='translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2'
									enterTo='translate-y-0 opacity-100 sm:translate-x-0'
									leave='transition ease-in duration-100'
									leaveFrom='opacity-100'
									leaveTo='opacity-0'
									className='max-w-sm w-full'
								>
									<div
										className={`bg-white shadow-lg rounded-lg pointer-events-auto`}
									>
										<div className={`rounded-lg shadow-xs overflow-hidden`}>
											<div className={`p-4`}>
												<div className={`flex items-start`}>
													<div className={`flex-shrink-0`}>
														{errorMsg ? (
															<svg
																className={`h-8 w-8 text-red-400`}
																fill='currentColor'
																viewBox='0 0 24 24'
																stroke='currentColor'
															>
																<path
																	fillRule='evenodd'
																	d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
																	clipRule='evenodd'
																></path>
															</svg>
														) : successMsg ? (
															<svg
																className={`h-8 w-8 text-green-400`}
																fill='currentColor'
																viewBox='0 0 24 24'
																stroke='currentColor'
															>
																<path
																	fillRule='evenodd'
																	d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
																	clipRule='evenodd'
																></path>
															</svg>
														) : (
															<svg
																className={`h-8 w-8 text-gray-400`}
																fill='currentColor'
																viewBox='0 0 24 24'
																stroke='currentColor'
															>
																<path
																	fillRule='evenodd'
																	d='M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z'
																	clipRule='evenodd'
																></path>
															</svg>
														)}
													</div>
													<div className={`ml-3 w-0 flex-1 pt-0.5`}>
														<p
															className={`text-sm leading-5 font-medium ${
																errorMsg !== undefined && errorMsg !== ''
																	? 'text-red-500'
																	: 'text-gray-900'
															} ${
																successMsg !== undefined && successMsg !== ''
																	? 'text-green-500'
																	: 'text-gray-900'
															}`}
														>
															{errorMsg !== undefined && errorMsg !== ''
																? 'Site Verification Failed!'
																: successMsg !== undefined && successMsg !== ''
																? 'Site Verification Success!'
																: 'Verifying...'}
														</p>
														<p
															className={`mt-1 text-sm leading-5 text-gray-500`}
														>
															{errorMsg !== undefined && errorMsg !== ''
																? errorMsg
																: successMsg}
														</p>
													</div>
													<div className={`ml-4 flex-shrink-0 flex`}>
														<button
															className={`inline-flex text-gray-400 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150`}
															onClick={() =>
																setTimeout(
																	() =>
																		setShowNotificationStatus(
																			!showNotificationStatus
																		),
																	150
																)
															}
														>
															<svg
																className={`h-5 w-5`}
																viewBox='0 0 20 20'
																fill='currentColor'
															>
																<path
																	fillRule='evenodd'
																	d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
																	clipRule='evenodd'
																/>
															</svg>
														</button>
													</div>
												</div>
											</div>
										</div>
									</div>
								</Transition.Child>
							</div>
						</Transition>

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
									className={`max-w-full mx-auto px-4 md:py-4 sm:px-6 md:px-8 grid gap-16 lg:grid-cols-3 lg:col-gap-5 lg:row-gap-12`}
								>
									<div
										className={`lg:col-span-2 bg-white overflow-hidden shadow-xs rounded-lg`}
									>
										<div className={`px-8 pt-4 sm:px-8 sm:pt-8`}>
											<div className={`max-w-full pt-4 m-auto`}>
												<h4
													className={`text-2xl leading-6 font-medium text-gray-900`}
												>
													{VerifyUrlLabel[0].label}
												</h4>
												<p
													className={`max-w-full mt-2 text-sm leading-5 text-gray-500`}
												>
													{VerifyUrlLabel[0].description}
												</p>
											</div>
										</div>
										<div
											className={`max-w-full px-8 pb-8 sm:pt-6 grid gap-16 pt-12 lg:grid-cols-2 lg:col-gap-5 lg:row-gap-12`}
										>
											<div className={`wizard-indicator bg-green-500`}>
												<p
													className={`max-w-2xl mt-4 text-sm leading-2 font-medium text-green-500`}
												>
													<span
														className={`max-w-xs inline-flex items-center justify-between`}
													>
														<svg
															className={`w-5`}
															fill='currentColor'
															viewBox='0 0 20 20'
														>
															<path
																fillRule='evenodd'
																d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
																clipRule='evenodd'
															></path>
														</svg>
														&nbsp;{VerifyUrlLabel[1].label}
													</span>
												</p>
											</div>
											<div className={`wizard-indicator bg-green-500`}>
												<p
													className={`${
														enableNextStep ? 'text-green-500' : 'text-black-400'
													} font-medium  max-w-2xl mt-4 text-sm leading-2`}
												>
													<span
														className={`max-w-xs inline-flex items-center justify-between`}
													>
														{enableNextStep ? (
															<svg
																className={`w-5`}
																fill='currentColor'
																viewBox='0 0 20 20'
															>
																<path
																	fillRule='evenodd'
																	d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
																	clipRule='evenodd'
																></path>
															</svg>
														) : (
															'2.'
														)}
														&nbsp;{VerifyUrlLabel[2].label}
													</span>
												</p>
											</div>
										</div>

										<div className={`max-w-full block px-8 pt-8 pb-12 sm:px-8`}>
											<div className={`max-w-full py-4 m-auto`}>
												<div>
													<h4
														className={`text-lg leading-7 font-medium text-gray-900 mb-5`}
													>
														{VerifyUrlLabel[3].label}:{' '}
														<a
															href={props.surl}
															target='_blank'
															title={props.surl}
															className={`break-all text-md leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}
														>
															{props.surl}
														</a>
													</h4>
													<p
														className={`max-w-full text-md leading-6 text-gray-700 mb-3`}
													>
														<strong>{VerifyUrlLabel[4].label}:</strong>
													</p>
													<ol className='mb-5'>
														<li className={`text-sm leading-6 text-gray-600`}>
															{VerifyUrlLabel[5].label}.
														</li>
														<li className={`text-sm leading-6 text-gray-600`}>
															{ReactHtmlParser(VerifyUrlLabel[6].label)}
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
																			<span>
																				{copied
																					? VerifyUrlLabel[7].label
																					: VerifyUrlLabel[8].label}
																			</span>
																		</button>
																	</CopyToClipboard>
																</div>
															</div>
														</li>
														<li className={`text-sm leading-6 text-gray-600`}>
															{ReactHtmlParser(VerifyUrlLabel[9].label)}
														</li>
													</ol>
												</div>
											</div>

											<div className={`mb-5 sm:flex sm:justify-between`}>
												<div className={`sm:flex sm:justify-start`}>
													<form
														onSubmit={handleSiteVerification}
														className={`sm:flex sm:items-center`}
													>
														<input
															type='hidden'
															value={siteVerifyId}
															name={`site_verify_id`}
															onChange={handleHiddenInputChange}
														/>
														<span
															className={`inline-flex rounded-md shadow-xs-sm`}
														>
															{disableSiteVerify ? (
																<button
																	disabled={`disabled`}
																	type={`submit`}
																	className={`w-full mt-3 mr-3 rounded-md shadow-xs sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 opacity-50 cursor-not-allowed`}
																>
																	{VerifyUrlLabel[10].label}
																</button>
															) : (
																<button
																	type={`submit`}
																	className={`w-full mt-3 mr-3 rounded-md shadow-xs sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-xs-outline-indigo focus:border-indigo-700 active:bg-indigo-700 transition ease-in-out duration-150`}
																>
																	{VerifyUrlLabel[10].label}
																</button>
															)}
														</span>

														<span className='inline-flex rounded-md shadow-xs-sm'>
															{disableSiteVerify ? (
																<button
																	disabled={`disabled`}
																	type={`submit`}
																	className={`w-full mt-3 mr-3 rounded-md shadow-xs sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-yellow-600 opacity-50 cursor-not-allowed`}
																>
																	{VerifyUrlLabel[11].label}
																</button>
															) : (
																<Link href='/dashboard/sites'>
																	<a
																		className={`w-full mt-3 mr-3 rounded-md shadow-xs sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-500 focus:outline-none focus:shadow-xs-outline-yellow focus:border-yellow-700 active:bg-yellow-700 transition ease-in-out duration-150`}
																	>
																		{VerifyUrlLabel[11].label}
																	</a>
																</Link>
															)}
														</span>

														<span
															className={`inline-flex rounded-md shadow-xs-sm`}
														>
															{disableSiteVerify ? (
																<Link
																	href={{
																		pathname: '/dashboard/sites/information',
																		query: {
																			sid: props.sid
																		}
																	}}
																>
																	<a
																		disabled={`disabled`}
																		className={`inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-sm leading-5 font-medium text-gray-700 shadow-xs-sm sm:text-sm sm:leading-5 opacity-50 cursor-not-allowed`}
																	>
																		{VerifyUrlLabel[12].label}
																	</a>
																</Link>
															) : (
																<Link
																	href={{
																		pathname: '/dashboard/sites/information',
																		query: {
																			sid: props.sid
																		}
																	}}
																>
																	<a
																		className={`inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-sm leading-5 font-medium text-gray-700 shadow-xs-sm transition ease-in-out duration-150 sm:text-sm sm:leading-5 hover:text-gray-500 focus:outline-none`}
																	>
																		{VerifyUrlLabel[12].label}
																	</a>
																</Link>
															)}
														</span>
													</form>
												</div>

												{enableNextStep ? (
													<Fragment>
														<div>
															<Link
																href='/dashboard/site/[id]/overview'
																as={`/dashboard/site/${props.sid}/overview`}
															>
																<a
																	className={`mt-3 mr-3 rounded-md shadow-xs sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:shadow-xs-outline-green focus:border-green-700 active:bg-green-700`}
																>
																	{VerifyUrlLabel[13].label}
																</a>
															</Link>
														</div>
													</Fragment>
												) : null}
											</div>

											<div
												className={`w-full bg-orange-300 mt-5 sm:rounded-lg inline-block`}
											>
												<div className={`px-4 py-5 sm:p-6`}>
													<h3
														className={`text-lg leading-6 font-medium text-gray-900`}
													>
														{VerifyUrlLabel[14].label}
													</h3>
													<div
														className={`mt-2 max-w-full text-sm leading-5 text-gray-800`}
													>
														<p className={`italic`}>
															{VerifyUrlLabel[15].label}
														</p>
														<ol className={`my-3`}>
															<li className={`text-sm leading-6 text-gray-800`}>
																{VerifyUrlLabel[16].label}
																<br />
																<textarea
																	name={`verify_site_instructions`}
																	id={`instructions`}
																	className={`instructions-textarea h-56 resize-none block w-full p-3 pb-0 mb-3`}
																	value={htmlText}
																	onChange={handleTextareaChange}
																></textarea>
																<CopyToClipboard
																	onCopy={handleTextAreaCopy}
																	text={htmlText}
																>
																	<button
																		className={`mb-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-800 bg-gray-100 hover:text-gray-500 hover:bg-white focus:outline-none focus:shadow-xs-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150`}
																	>
																		<span>
																			{htmlCopied
																				? VerifyUrlLabel[7].label
																				: VerifyUrlLabel[8].label}
																		</span>
																	</button>
																</CopyToClipboard>
															</li>
															<li className={`text-sm leading-6 text-gray-800`}>
																{VerifyUrlLabel[17].label}
															</li>
														</ol>
													</div>
												</div>
											</div>
										</div>
									</div>

									<div
										className={`lg:col-span-1 bg-white overflow-hidden shadow-xs rounded-lg`}
									>
										<HowToSetup />
									</div>
								</div>
							</main>
						</div>
					</SitesVerifyUrlDiv>
				</Fragment>
			) : null}
		</Layout>
	);
};

SitesVerifyUrl.getInitialProps = ({ query }) => {
	return {
		sid: query.sid,
		sname: query.sname,
		surl: query.surl,
		vid: query.vid,
		v: query.v
	};
};

export default SitesVerifyUrl;

SitesVerifyUrl.propTypes = {
	copyValue: PropTypes.string,
	copied: PropTypes.bool,
	siteVerifyId: PropTypes.number,
	errorMsg: PropTypes.string,
	successMsg: PropTypes.string,
	dataQuery: PropTypes.object,
	disableSiteVerify: PropTypes.bool,
	enableNextStep: PropTypes.bool,
	pageTitle: PropTypes.string
};

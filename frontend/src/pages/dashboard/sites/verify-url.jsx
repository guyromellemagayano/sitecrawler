// React
import React, { useState, useEffect } from 'react';

// NextJS
import Link from 'next/link';

// External
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { NextSeo } from 'next-seo';
import { Transition } from '@tailwindui/react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import styled from 'styled-components';

// JSON
import VerifyUrlLabel from 'public/label/pages/sites/verify-url.json';

// Hooks
import useUser from 'src/hooks/useUser';
import usePostMethod from 'src/hooks/usePostMethod';

// Components
import HowToSetup from 'src/components/sites/HowToSetup';
import Layout from 'src/components/Layout';
import MainSidebar from 'src/components/sidebar/MainSidebar';
import MobileSidebar from 'src/components/sidebar/MobileSidebar';

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

	const { user: user } = useUser({
		redirectTo: '/',
		redirectIfFound: false
	});

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

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (errorMsg) setErrorMsg('');
		if (successMsg) setSuccessMsg('');

		setDisableSiteVerify(!disableSiteVerify);

		const body = {
			sid: e.currentTarget.site_verify_id.value
		};

		const response = await usePostMethod('/api/site/' + body.sid + '/verify/');

		if (Math.floor(response.status / 200) === 1) {
			if (response.data.verified === true) {
				setSuccessMsg(VerifyUrlLabel[20].label);
				setTimeout(() => {
					setEnableNextStep(!enableNextStep);
					setDisableSiteVerify(false);
				}, 1500);
			} else {
				setErrorMsg(VerifyUrlLabel[21].label);
				setTimeout(() => {
					setDisableSiteVerify(false);
				}, 1500);
			}
		} else {
			// FIXME: Error handling for response
			if (response.data) {
				console.log('ERROR: ' + response.data);
			} else {
				setSubmitting(false);
				resetForm({ values: '' });
				setErrorMsg(InformationLabel[12]);
			}
		}
	};

	return (
		<Layout>
			{user ? (
				<>
					<NextSeo title={pageTitle} />

					<SitesVerifyUrlDiv className="h-screen flex overflow-hidden bg-gray-200">
						<MobileSidebar show={openMobileSidebar} />
						<MainSidebar />

						<div className="flex flex-col w-0 flex-1 overflow-hidden">
							<div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
								<button
									className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:bg-gray-200 transition ease-in-out duration-150"
									aria-label="Open sidebar"
									onClick={() =>
										setTimeout(
											() => setOpenMobileSidebar(!openMobileSidebar),
											150
										)
									}
								>
									<svg
										className="h-6 w-5"
										stroke="currentColor"
										fill="none"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M4 6h16M4 12h16M4 18h16"
										/>
									</svg>
								</button>
							</div>
							<main
								className="flex-1 relative z-0 overflow-y-auto pt-2 pb-6 focus:outline-none md:py-6"
								tabIndex="0"
							>
								<div className="max-w-full mx-auto px-4 md:py-4 sm:px-6 md:px-8 grid gap-16 lg:grid-cols-3 lg:col-gap-5 lg:row-gap-12">
									<div className="lg:col-span-2 bg-white overflow-hidden shadow-xs rounded-lg">
										<div className="px-8 pt-4 sm:px-8 sm:pt-8">
											<div className="max-w-full pt-4 m-auto">
												<h4 className="text-2xl leading-6 font-medium text-gray-900">
													{VerifyUrlLabel[0].label}
												</h4>
												<p className="max-w-full mt-2 text-sm leading-5 text-gray-500">
													{VerifyUrlLabel[0].description}
												</p>
											</div>
										</div>
										<div className="max-w-full px-8 pb-8 sm:pt-6 grid gap-16 pt-12 lg:grid-cols-2 lg:col-gap-5 lg:row-gap-12">
											<div className="wizard-indicator bg-green-500">
												<p className="max-w-2xl mt-4 text-sm leading-2 font-medium text-green-500">
													<span className="max-w-xs inline-flex items-center justify-between">
														<svg
															className="w-5"
															fill="currentColor"
															viewBox="0 0 20 20"
														>
															<path
																fillRule="evenodd"
																d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
																clipRule="evenodd"
															></path>
														</svg>
														&nbsp;{VerifyUrlLabel[1].label}
													</span>
												</p>
											</div>
											<div className="wizard-indicator bg-green-500">
												<p
													className={`${
														enableNextStep ? 'text-green-500' : 'text-black-400'
													} font-medium  max-w-2xl mt-4 text-sm leading-2`}
												>
													<span className="max-w-xs inline-flex items-center justify-between">
														{enableNextStep ? (
															<svg
																className="w-5"
																fill="currentColor"
																viewBox="0 0 20 20"
															>
																<path
																	fillRule="evenodd"
																	d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
																	clipRule="evenodd"
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

										<div className="max-w-full block px-8 pt-8 pb-12 sm:px-8">
											<div className="max-w-full py-4 m-auto">
												<div>
													<h4 className="text-lg leading-7 font-medium text-gray-900 mb-5">
														{VerifyUrlLabel[3].label}:{' '}
														<a
															href={props.surl}
															target="_blank"
															title={props.surl}
															className="break-all text-md leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150"
														>
															{props.surl}
														</a>
													</h4>
													<p className="max-w-full text-md leading-6 text-gray-700 mb-3">
														<strong>{VerifyUrlLabel[4].label}:</strong>
													</p>
													<ol className="mb-5">
														<li className="text-sm leading-6 text-gray-600">
															{VerifyUrlLabel[5].label}.
														</li>
														<li className="text-sm leading-6 text-gray-600">
															{ReactHtmlParser(VerifyUrlLabel[6].label)}
															<div>
																<div className="my-3 flex">
																	<div className="rounded-md shadow-sm max-w-sm relative flex-grow focus-within:z-10">
																		<input
																			id="email"
																			className={`form-input block w-full rounded-none rounded-l-md transition ease-in-out duration-150 sm:text-sm sm:leading-5 ${
																				disableSiteVerify
																					? 'opacity-50 bg-gray-300 cursor-not-allowed'
																					: ''
																			}`}
																			name="verify_id_meta_tag"
																			value={copyValue}
																			onChange={handleInputChange}
																			autoComplete="off"
																		/>
																	</div>
																	<CopyToClipboard
																		onCopy={handleInputCopy}
																		text={copyValue}
																	>
																		<button
																			className={`-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-r-md text-gray-700 bg-gray-100 ${
																				disableSiteVerify
																					? 'opacity-50 bg-indigo-300 cursor-not-allowed'
																					: 'hover:text-gray-500 hover:bg-white focus:outline-none focus:shadow-xs-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150'
																			}`}
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
														<li className="text-sm leading-6 text-gray-600">
															{ReactHtmlParser(VerifyUrlLabel[9].label)}
														</li>
													</ol>
												</div>
											</div>

											<div className="mb-5 sm:flex sm:justify-between">
												<div className="sm:flex sm:justify-start">
													<form
														onSubmit={handleSubmit}
														className="sm:flex sm:items-center"
													>
														<input
															type="hidden"
															value={siteVerifyId}
															name="site_verify_id"
															onChange={handleHiddenInputChange}
														/>
														<span className="inline-flex rounded-md shadow-sm">
															<button
																type="submit"
																disabled={disableSiteVerify}
																className={`w-full mt-3 mr-3 shadow-xs sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 ${
																	disableSiteVerify
																		? 'opacity-50 cursor-not-allowed'
																		: 'hover:bg-indigo-500 focus:outline-none focus:shadow-xs-outline-indigo focus:border-indigo-700 active:bg-indigo-700 transition ease-in-out duration-150'
																}`}
															>
																{disableSiteVerify
																	? VerifyUrlLabel[18].label
																	: VerifyUrlLabel[10].label}
															</button>
														</span>

														<span className="inline-flex rounded-md shadow-sm">
															<Link href="/dashboard/sites">
																<a
																	className={`w-full mt-3 mr-3 shadow-xs sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-yellow-600 ${
																		disableSiteVerify
																			? 'opacity-50 cursor-not-allowed'
																			: 'hover:bg-yellow-500 focus:outline-none focus:shadow-xs-outline-yellow focus:border-yellow-700 active:bg-yellow-700 transition ease-in-out duration-150'
																	}`}
																>
																	{VerifyUrlLabel[11].label}
																</a>
															</Link>
														</span>

														<span className="inline-flex rounded-md shadow-sm">
															<Link
																href={{
																	pathname: '/dashboard/sites/information',
																	query: {
																		sid: props.sid,
																		edit: true
																	}
																}}
															>
																<a
																	disabled="disabled"
																	className={`inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-sm leading-5 font-medium text-gray-700 shadow-sm sm:text-sm sm:leading-5 ${
																		disableSiteVerify
																			? 'opacity-50 cursor-not-allowed'
																			: 'transition ease-in-out duration-150 sm:text-sm sm:leading-5 hover:text-gray-500 focus:outline-none'
																	} `}
																>
																	{VerifyUrlLabel[12].label}
																</a>
															</Link>
														</span>
													</form>
												</div>

												{enableNextStep ? (
													<>
														<div>
															<Link
																href="/dashboard/site/[id]/overview"
																as="/dashboard/site/${props.sid}/overview"
															>
																<a className="mt-3 mr-3 rounded-md shadow-xs sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:shadow-xs-outline-green focus:border-green-700 active:bg-green-700">
																	{VerifyUrlLabel[13].label}
																</a>
															</Link>
														</div>
													</>
												) : null}
											</div>

											{errorMsg && (
												<div className="block py-2 mt-3">
													<div className="flex sm:ml-2 justify-center sm:justify-start">
														<div>
															<h3 className="text-sm leading-5 font-medium text-red-800 break-words">
																{errorMsg}
															</h3>
														</div>
													</div>
												</div>
											)}

											{successMsg && (
												<div className="block py-2 mt-3">
													<div className="flex sm:ml-2 justify-center sm:justify-start">
														<div>
															<h3 className="text-sm leading-5 font-medium text-green-800 break-words">
																{successMsg}
															</h3>
														</div>
													</div>
												</div>
											)}

											<div className="w-full bg-orange-300 mt-5 sm:rounded-lg inline-block">
												<div className="px-4 py-5 sm:p-6">
													<h3 className="text-lg leading-6 font-medium text-gray-900">
														{VerifyUrlLabel[14].label}
													</h3>
													<div className="mt-2 max-w-full text-sm leading-5 text-gray-800">
														<p className="italic">{VerifyUrlLabel[15].label}</p>
														<ol className="my-3">
															<li className="text-sm leading-6 text-gray-800">
																{VerifyUrlLabel[16].label}
																<br />
																<textarea
																	name="verify_site_instructions"
																	id="instructions"
																	className="instructions-textarea h-56 resize-none block w-full p-3 pb-0 mb-3"
																	value={htmlText}
																	onChange={handleTextareaChange}
																></textarea>
																<CopyToClipboard
																	onCopy={handleTextAreaCopy}
																	text={htmlText}
																>
																	<button className="mb-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-800 bg-gray-100 hover:text-gray-500 hover:bg-white focus:outline-none focus:shadow-xs-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150">
																		<span>
																			{htmlCopied
																				? VerifyUrlLabel[7].label
																				: VerifyUrlLabel[8].label}
																		</span>
																	</button>
																</CopyToClipboard>
															</li>
															<li className="text-sm leading-6 text-gray-800">
																{VerifyUrlLabel[17].label}
															</li>
														</ol>
													</div>
												</div>
											</div>
										</div>
									</div>

									<div className="lg:col-span-1 bg-white overflow-hidden shadow-xs rounded-lg">
										<HowToSetup />
									</div>
								</div>
							</main>
						</div>
					</SitesVerifyUrlDiv>
				</>
			) : null}
		</Layout>
	);
};

SitesVerifyUrl.propTypes = {};

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

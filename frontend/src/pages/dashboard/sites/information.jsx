// React
import React, { useEffect, useState } from 'react';

// NextJS
import Router, { withRouter } from 'next/router';

// External
import { NextSeo } from 'next-seo';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import styled from 'styled-components';
import Url from 'url-parse';
import useSWR from 'swr';

// JSON
import InformationLabel from 'public/label/pages/sites/information.json';

// Hooks
import useFetcher from 'src/hooks/useFetcher';
import useUser from 'src/hooks/useUser';
import useGetMethod from 'src/hooks/useGetMethod';
import usePostMethod from 'src/hooks/usePostMethod';
import usePatchMethod from 'src/hooks/usePatchMethod';

// Components
import HowToSetup from 'src/components/sites/HowToSetup';
import Layout from 'src/components/Layout';
import MainSidebar from 'src/components/sidebar/MainSidebar';
import MobileSidebar from 'src/components/sidebar/MobileSidebar';

const SitesInformationDiv = styled.section`
	.wizard-indicator {
		height: 0.25rem;
	}
`;

const SitesInformation = (props) => {
	const [disableSiteVerify, setDisableSiteVerify] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');
	const [errorSiteNameMsg, setErrorSiteNameMsg] = useState('');
	const [errorSiteUrlMsg, setErrorSiteUrlMsg] = useState('');
	const [dupSiteProtocolExists, setDupSiteProtocolExists] = useState(false);
	const [siteName, setSiteName] = useState('');
	const [urlProtocol, setUrlProtocol] = useState('https://');
	const [siteUrl, setSiteUrl] = useState('');
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);

	const pageTitle = 'Add New Site';
	const siteApiEndpoint = '/api/site/';

	const { router } = props;

	const { user: user } = useUser({
		redirectTo: '/',
		redirectIfFound: false
	});

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (errorMsg) setErrorMsg('');
		if (errorSiteNameMsg) setErrorSiteNameMsg('');
		if (errorSiteUrlMsg) setErrorSiteUrlMsg('');

		const siteUrl = new Url(e.currentTarget.urlpath.value);
		const body = {
			url: siteUrl.href,
			name: siteName
		};

		if (
			body.name !== undefined &&
			body.url !== 'https://undefined' &&
			body.url !== 'http://undefined'
		) {
			if (
				siteUrl.origin === 'https://https:' ||
				siteUrl.origin === 'https://http:' ||
				siteUrl.origin === 'http://https:' ||
				siteUrl.origin === 'http://http:'
			) {
				setDupSiteProtocolExists(true);
				setErrorSiteUrlMsg(
					ReactHtmlParser(
						'You should only add hostname inside the input <br /><em>e.g. yourdomain.com</em>'
					)
				);
			} else {
				try {
					const response = await useGetMethod(siteApiEndpoint);
					const data = await response.data;

					if (
						response.statusText === 'OK' &&
						Math.floor(response.status / 200) === 1
					) {
						const result = data.results.find(
							(site) => site.url === siteUrl.href
						);

						if (typeof result !== 'undefined') {
							setErrorMsg(
								'Unfortunately, this site URL already exists. Please try again.'
							);
							return false;
						} else {
							try {
								const siteResponse = await usePostMethod(siteApiEndpoint, body);
								const siteData = await siteResponse.data;

								if (
									siteResponse.statusText === 'Created' &&
									Math.floor(siteResponse.status / 200) === 1
								) {
									setDisableSiteVerify(!disableSiteVerify);

									Router.push({
										pathname: '/dashboard/sites/verify-url/',
										query: {
											sid: siteData.id,
											sname: siteData.name,
											surl: siteData.url,
											vid: siteData.verification_id,
											v: false
										}
									});
								}
							} catch (error) {
								setErrorMsg('An unexpected error occurred. Please try again.');

								throw error.message;
							}
						}
					}
				} catch (error) {
					setErrorMsg('An unexpected error occurred. Please try again.');

					throw error.message;
				}
			}
		} else {
			setErrorSiteNameMsg('Please fill in the empty field.');
			setErrorSiteUrlMsg('Please fill in the empty field.');
		}
	};

	const handleUpdateSubmit = async (e) => {
		e.preventDefault();

		if (errorMsg) setErrorMsg('');

		const body = {
			name: siteName
		};

		if (body.name !== '' && body.name !== undefined && body.name !== null) {
			try {
				const response = await useGetMethod(
					'/api/site/' + router.query.sid + '/'
				);

				if (
					response.statusText === 'OK' &&
					Math.floor(response.status / 200) === 1
				) {
					try {
						const siteResponse = await usePatchMethod(
							'/api/site/' + router.query.sid + '/',
							body
						);
						const siteData = await siteResponse.data;

						if (
							siteResponse.statusText === 'OK' &&
							Math.floor(siteResponse.status / 200) === 1
						) {
							setDisableSiteVerify(!disableSiteVerify);

							Router.push({
								pathname: '/dashboard/sites/verify-url',
								query: {
									sid: siteData.id,
									sname: siteData.name,
									surl: siteData.url,
									vid: siteData.verification_id,
									v: false
								}
							});
						}
					} catch (error) {
						setErrorMsg('An unexpected error occurred. Please try again.');

						throw error.message;
					}
				}
			} catch (error) {
				setErrorMsg('An unexpected error occurred. Please try again.');

				throw error.message;
			}
		} else {
			if (body.name === '' || body.name === undefined || body.name === null) {
				setErrorSiteNameMsg('Please fill in the empty field.');
			}
		}
	};

	const { data: sites } = useSWR(siteApiEndpoint, useFetcher);

	useEffect(() => {
		if (sites !== '' && sites !== undefined) {
			setSiteName(sites.name);
			setSiteUrl(sites.url);
		}
	}, [sites]);

	if (router.query.sid !== undefined) {
		const { data: site } = useSWR(`/api/site/${router.query.sid}`, useFetcher);

		useEffect(() => {
			if (site !== '' && site !== undefined) {
				setSiteName(site.name);
				setSiteUrl(site.url);
			}
		}, [site]);
	}

	return (
		<Layout>
			{user ? (
				<>
					<NextSeo title={pageTitle} />

					<SitesInformationDiv className="h-screen flex overflow-hidden bg-gray-200">
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
										<div className="pt-4 px-8 sm:pt-8">
											<div className="max-w-full pt-4 m-auto">
												<h4 className="text-2xl leading-6 font-medium text-gray-900">
													{InformationLabel[0].label}
												</h4>
												<p className="max-w-full mt-2 text-sm leading-5 text-gray-500">
													{InformationLabel[0].description}
												</p>
											</div>
										</div>
										<div className="max-w-full px-8 pb-8 sm:pt-6 grid gap-16 pt-12 lg:grid-cols-2 lg:col-gap-5 lg:row-gap-12">
											<div className="wizard-indicator bg-green-500">
												<p className="max-w-2xl mt-4 text-sm leading-2 font-medium text-black-400">
													{InformationLabel[1].label}
												</p>
											</div>
											<div className="wizard-indicator bg-gray-100">
												<p className="max-w-2xl mt-4 text-sm leading-2 font-medium text-black-400">
													{InformationLabel[2].label}
												</p>
											</div>
										</div>
										<div className="inline-block pt-8 pb-12 px-8">
											<div className="max-w-full py-4 m-auto">
												<div>
													<h4 className="text-lg leading-7 font-medium text-gray-900">
														{InformationLabel[3].label}
													</h4>
													<p className="mt-1 text-sm leading-5 text-gray-500 max-w-full">
														{InformationLabel[3].description}
													</p>
												</div>

												<form
													onSubmit={
														router.query.sid ? handleUpdateSubmit : handleSubmit
													}
												>
													<div className="my-6 max-w-sm">
														<label
															htmlFor="sitename"
															className="block text-sm font-medium leading-5 text-gray-700"
														>
															{InformationLabel[4].label}
														</label>
														<div className="mt-1 mb-1 relative rounded-md shadow-xs-sm">
															<input
																id="sitename"
																type="text"
																disabled={disableSiteVerify ? true : false}
																name="sitename"
																value={siteName ? siteName : ''}
																className={`${
																	errorSiteNameMsg && !siteName
																		? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-300 focus:shadow-outline-red form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5'
																		: 'form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5'
																} ${
																	disableSiteVerify
																		? 'opacity-50 bg-gray-300 cursor-not-allowed'
																		: ''
																}`}
																placeholder={InformationLabel[4].placeholder}
																aria-describedby={`${
																	errorSiteNameMsg
																		? 'site-name-error'
																		: 'site-name'
																}`}
																aria-invalid={`${
																	errorSiteNameMsg ? true : false
																}`}
																onChange={(e) => setSiteName(e.target.value)}
															/>
															{errorSiteNameMsg && !siteName ? (
																<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
																	<svg
																		className="h-5 w-5 text-red-500"
																		fill="currentColor"
																		viewBox="0 0 20 20"
																	>
																		<path
																			fillRule="evenodd"
																			d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
																			clipRule="evenodd"
																		/>
																	</svg>
																</div>
															) : null}
														</div>

														{errorSiteNameMsg && !siteName ? (
															<div className="inline-block py-2">
																<div className="flex">
																	<div>
																		<h3 className="text-sm leading-5 font-medium text-red-800 break-words">
																			{errorSiteNameMsg}
																		</h3>
																	</div>
																</div>
															</div>
														) : null}
													</div>

													<div className="my-6 max-w-sm">
														<label
															htmlFor="siteurl"
															className="block text-sm font-medium leading-5 text-gray-700"
														>
															{InformationLabel[5].label}
														</label>
														<div className="mt-1 relative rounded-md shadow-xs-sm">
															<div className="absolute inset-y-0 left-0 flex items-center">
																<select
																	disabled={
																		disableSiteVerify ||
																		router.query.sid !== undefined
																			? true
																			: false
																	}
																	tabIndex="-1"
																	value={urlProtocol}
																	aria-label="site-url"
																	className="form-select h-full py-0 pl-3 pr-8 border-transparent bg-transparent text-gray-500 sm:text-sm sm:leading-5"
																	onChange={(e) =>
																		setUrlProtocol(e.target.value)
																	}
																>
																	<option value="https://">https://</option>
																	<option value="http://">http://</option>
																</select>
															</div>
															<input
																id="siteurl"
																type="text"
																name="siteurl"
																disabled={
																	disableSiteVerify ||
																	router.query.sid !== undefined
																		? true
																		: false
																}
																value={
																	siteUrl
																		? siteUrl.replace(
																				/^(?:https?:\/\/)?(?:www\.)?/i,
																				''
																		  )
																		: ''
																}
																className={`${
																	(errorSiteUrlMsg && !siteUrl) ||
																	dupSiteProtocolExists
																		? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-300 focus:shadow-outline-red form-input block pl-24 w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5'
																		: 'form-input block pl-24 w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5'
																} ${
																	router.query.sid || disableSiteVerify
																		? 'opacity-50 bg-gray-300 cursor-not-allowed'
																		: ''
																}`}
																placeholder={InformationLabel[5].placeholder}
																aria-describedby="site-url"
																aria-describedby={`${
																	errorSiteUrlMsg
																		? 'site-url-error'
																		: 'site-url'
																}`}
																aria-invalid={`${
																	errorSiteUrlMsg ? true : false
																}`}
																onChange={(e) =>
																	setSiteUrl(
																		e.target.value.replace(
																			/^http(s?):\/\//i,
																			''
																		)
																	)
																}
															/>
															<input
																id="urlpath"
																type="hidden"
																disabled={
																	disableSiteVerify ||
																	router.query.sid !== undefined
																		? true
																		: false
																}
																name="urlpath"
																value={urlProtocol + siteUrl}
															/>

															{(errorSiteUrlMsg && !siteUrl) ||
															dupSiteProtocolExists ? (
																<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
																	<svg
																		className="h-5 w-5 text-red-500"
																		fill="currentColor"
																		viewBox="0 0 20 20"
																	>
																		<path
																			fillRule="evenodd"
																			d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
																			clipRule="evenodd"
																		/>
																	</svg>
																</div>
															) : null}
														</div>

														{(errorSiteUrlMsg && !siteUrl) ||
														dupSiteProtocolExists ? (
															<div className="inline-block py-2">
																<div className="flex">
																	<div>
																		<h3 className="text-sm leading-5 font-medium text-red-800 break-words">
																			{errorSiteUrlMsg}
																		</h3>
																	</div>
																</div>
															</div>
														) : null}
													</div>

													<div className="sm:flex sm:items-center sm:justify-start">
														<div>
															{router.query.sid === undefined ? (
																<span className="inline-flex rounded-md shadow-xs-sm">
																	{disableSiteVerify ? (
																		<button
																			disabled="disabled"
																			type="submit"
																			className="mt-3 mr-3 shadow-xs sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 opacity-50 cursor-not-allowed"
																		>
																			{InformationLabel[6].label}
																		</button>
																	) : (
																		<button
																			type="submit"
																			className="mt-3 mr-3 shadow-xs sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-xs-outline-indigo focus:border-indigo-700 active:bg-indigo-700"
																		>
																			{InformationLabel[6].label}
																		</button>
																	)}
																</span>
															) : (
																<span className="inline-flex rounded-md shadow-xs-sm">
																	{disableSiteVerify ? (
																		<button
																			disabled="disabled"
																			type="submit"
																			className="mt-3 mr-3 shadow-xs sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 opacity-50 cursor-not-allowed"
																		>
																			Update Site Detail
																		</button>
																	) : (
																		<button
																			type="submit"
																			className="mt-3 mr-3 shadow-xs sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-xs-outline-indigo focus:border-indigo-700 active:bg-indigo-700"
																		>
																			Update Site Detail
																		</button>
																	)}
																</span>
															)}
														</div>

														{errorMsg && (
															<div className="inline-block p-2">
																<div className="flex">
																	<div>
																		<h3 className="text-sm leading-5 font-medium text-red-800 break-words">
																			{errorMsg}
																		</h3>
																	</div>
																</div>
															</div>
														)}
													</div>
												</form>
											</div>
										</div>
									</div>

									<div className="lg:col-span-1 bg-white overflow-hidden shadow-xs rounded-lg">
										<HowToSetup />
									</div>
								</div>
							</main>
						</div>
					</SitesInformationDiv>
				</>
			) : null}
		</Layout>
	);
};

SitesInformation.getInitialProps = ({ query }) => {
	return {
		sid: query.sid
	};
};

SitesInformation.propTypes = {
	disableSiteVerify: '',
	errorMsg: '',
	errorSiteUrlMsg: '',
	siteName: '',
	siteUrl: '',
	pageTitle: '',
	handleSubmit: '',
	handleUpdateSubmit: ''
};

export default withRouter(SitesInformation);

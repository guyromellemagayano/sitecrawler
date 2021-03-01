// React
import React, { useEffect, useState } from 'react';

// NextJS
import Router, { withRouter } from 'next/router';

// External
import { Formik } from 'formik';
import { NextSeo } from 'next-seo';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import styled from 'styled-components';
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
	const [errorMsg, setErrorMsg] = useState('');
	const [siteName, setSiteName] = useState('');
	const [siteUrl, setSiteUrl] = useState('');
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);

	const pageTitle = 'Add New Site';
	const siteApiEndpoint = '/api/site/';
	const urlRegex = /^(www.)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;

	const { router } = props;

	const { user: user } = useUser({
		redirectTo: '/',
		redirectIfFound: false
	});

	if (props.sid !== undefined && props.edit) {
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
												<Formik
													enableReinitialize={
														props.sid !== undefined && props.edit ? true : false
													}
													initialValues={{
														siteurlprotocol: 'https://',
														siteurl:
															props.sid !== undefined && props.edit
																? siteUrl.replace(/^\/\/|^.*?:(\/\/)?/, '')
																: '',
														sitename:
															props.sid !== undefined && props.edit
																? siteName
																: ''
													}}
													validationSchema={Yup.object({
														siteurl: Yup.string()
															.matches(urlRegex, InformationLabel[8].label)
															.required(InformationLabel[7].label),
														sitename: Yup.string().required(
															InformationLabel[7].label
														)
													})}
													onSubmit={async (
														values,
														{ setSubmitting, resetForm }
													) => {
														if (props.sid !== undefined && props.edit) {
															if (errorMsg) setErrorMsg('');

															const response = await useGetMethod(
																'/api/site/' + router.query.sid + '/'
															);

															if (Math.floor(response.status / 200) === 1) {
																const body = {
																	name: values.sitename
																};

																const siteResponse = await usePatchMethod(
																	'/api/site/' + router.query.sid + '/',
																	body
																);

																if (
																	Math.floor(siteResponse.status / 200) === 1
																) {
																	setSubmitting(false);

																	router.push({
																		pathname: '/dashboard/sites/verify-url',
																		query: {
																			sid: siteResponse.data.id,
																			sname: siteResponse.data.name,
																			surl: siteResponse.data.url,
																			vid: siteResponse.data.verification_id,
																			v: false
																		}
																	});
																} else {
																	// FIXME: Error handling for siteResponse
																	if (siteResponse.data) {
																		console.log('ERROR: ' + siteResponse.data);
																	} else {
																		setSubmitting(false);
																		resetForm({ values: '' });
																		setErrorMsg(InformationLabel[12]);
																	}
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
														} else {
															const body = {
																url: values.siteurlprotocol + values.siteurl,
																name: values.sitename
															};

															const response = await useGetMethod(
																siteApiEndpoint
															);

															if (errorMsg) setErrorMsg('');

															if (Math.floor(response.status / 200) === 1) {
																const siteResult = response.data.results.find(
																	(site) => site.url === body.url
																);

																if (siteResult !== undefined) {
																	setErrorMsg(InformationLabel[11].label);
																	return false;
																} else {
																	const siteResponse = await usePostMethod(
																		siteApiEndpoint,
																		body
																	);

																	if (
																		Math.floor(siteResponse.status / 200) === 1
																	) {
																		setSubmitting(false);
																		resetForm({ values: '' });

																		Router.push({
																			pathname: '/dashboard/sites/verify-url/',
																			query: {
																				sid: siteResponse.data.id,
																				sname: siteResponse.data.name,
																				surl: siteResponse.data.url,
																				vid: siteResponse.data.verification_id,
																				v: false
																			}
																		});
																	} else {
																		// FIXME: Error handling for siteResponse
																		if (siteResponse.data) {
																			console.log(
																				'ERROR: ' + siteResponse.data
																			);
																		} else {
																			setSubmitting(false);
																			resetForm({ values: '' });
																			setErrorMsg(InformationLabel[12]);
																		}
																	}
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
														}
													}}
												>
													{({
														values,
														errors,
														touched,
														handleChange,
														handleBlur,
														handleSubmit,
														isSubmitting
													}) => (
														<form onSubmit={handleSubmit}>
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
																		name="sitename"
																		disabled={isSubmitting}
																		placeholder={
																			InformationLabel[4].placeholder
																		}
																		className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:shadow-xs-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5 ${
																			isSubmitting
																				? 'opacity-50 bg-gray-300 cursor-not-allowed'
																				: ''
																		} ${
																			errors.sitename || errorMsg
																				? 'border-red-300'
																				: 'border-gray-300'
																		}`}
																		aria-describedby="sitename"
																		onChange={handleChange}
																		onBlur={handleBlur}
																		value={values.sitename}
																	/>
																</div>

																{errors.sitename && touched.sitename && (
																	<span className="block mt-2 text-xs leading-5 text-red-700">
																		{errors.sitename &&
																			touched.sitename &&
																			errors.sitename}
																	</span>
																)}
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
																			id="siteurlprotocol"
																			name="siteurlprotocol"
																			className={`form-select h-full py-0 pl-3 pr-8 border-transparent bg-transparent ${
																				props.sid !== undefined && props.edit
																					? 'text-gray-500'
																					: ''
																			} sm:text-sm sm:leading-5`}
																			disabled={
																				isSubmitting ||
																				(props.sid !== undefined && props.edit)
																					? true
																					: false
																			}
																			tabIndex="-1"
																			onChange={handleChange}
																			onBlur={handleBlur}
																			aria-label="siteurlprotocol"
																			value={values.siteurlprotocol}
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
																			isSubmitting ||
																			(props.sid !== undefined && props.edit)
																				? true
																				: false
																		}
																		className={`form-input block pl-24 w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5 ${
																			props.sid !== undefined && props.edit
																				? 'text-gray-500'
																				: isSubmitting
																				? 'text-gray-500 opacity-50 bg-gray-300 cursor-not-allowed'
																				: ''
																		} ${
																			(errors.siteurl || errorMsg) &&
																			props.sid === undefined &&
																			!props.edit
																				? 'border-red-300'
																				: 'border-gray-300'
																		}`}
																		placeholder={
																			InformationLabel[5].placeholder
																		}
																		aria-describedby="siteurl"
																		onChange={handleChange}
																		onBlur={handleBlur}
																		value={
																			props.sid !== undefined && props.edit
																				? siteUrl.replace(
																						/^\/\/|^.*?:(\/\/)?/,
																						''
																				  )
																				: values.siteurl
																		}
																	/>
																</div>

																{errors.siteurl &&
																	touched.siteurl &&
																	props.sid === undefined &&
																	!props.edit && (
																		<span className="block mt-2 text-xs leading-5 text-red-700">
																			{errors.siteurl &&
																				touched.siteurl &&
																				errors.siteurl}
																		</span>
																	)}
															</div>

															<div className="sm:flex sm:items-center sm:justify-start">
																<div>
																	{props.sid === undefined && !props.edit ? (
																		<span className="inline-flex rounded-md shadow-xs-sm">
																			<button
																				type="submit"
																				disabled={isSubmitting}
																				className={`mt-3 mr-3 shadow-xs sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 ${
																					isSubmitting
																						? 'opacity-50 bg-indigo-300 cursor-not-allowed'
																						: 'hover:bg-indigo-500 focus:outline-none focus:shadow-xs-outline-indigo focus:border-indigo-700 active:bg-indigo-700'
																				}`}
																			>
																				{isSubmitting
																					? InformationLabel[10].label
																					: InformationLabel[6].label}
																			</button>
																		</span>
																	) : (
																		<span className="inline-flex rounded-md shadow-xs-sm">
																			<button
																				type="submit"
																				disabled={isSubmitting}
																				className={`mt-3 mr-3 shadow-xs sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 ${
																					isSubmitting
																						? 'opacity-50 bg-indigo-300 cursor-not-allowed'
																						: 'hover:bg-indigo-500 focus:outline-none focus:shadow-xs-outline-indigo focus:border-indigo-700 active:bg-indigo-700'
																				}`}
																			>
																				{isSubmitting
																					? InformationLabel[10].label
																					: InformationLabel[9].label}
																			</button>
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
													)}
												</Formik>
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
		sid: query.sid,
		edit: query.edit
	};
};

SitesInformation.propTypes = {};

export default withRouter(SitesInformation);

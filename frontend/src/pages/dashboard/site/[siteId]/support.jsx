// React
import React, { Fragment, useState, useEffect } from 'react';

// NextJS
import { useRouter } from 'next/router';
import Link from 'next/link';

// External
import { Formik } from 'formik';
import { NextSeo } from 'next-seo';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import useSWR from 'swr';

// JSON
import SupportLabel from 'public/label/pages/site/support.json';

// Hooks
import usePostMethod from 'src/hooks/usePostMethod';
import useUser from 'src/hooks/useUser';

// Components
import Layout from 'src/components/Layout';
import MainSidebar from 'src/components/sidebar/MainSidebar';
import MobileSidebar from 'src/components/sidebar/MobileSidebar';
import SiteFooter from 'src/components/footer/SiteFooter';

const SupportDiv = styled.section``;

const Support = () => {
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
	const [disableSupportForm, setDisableSupportForm] = useState(false);
	const [successMsg, setSuccessMsg] = useState('');
	const [errorMsg, setErrorMsg] = useState('');
	const [siteName, setSiteName] = useState('');

	const pageTitle = 'Support |';
	const contactApiEndpoint = '/api/support/contact/';

	const { query } = useRouter();

	const { user: user, userError: userError } = useUser({
		redirectTo: '/',
		redirectIfFound: false
	});

	const { data: site, error: siteError } = useSWR(
		() => (query.siteId ? `/api/site/${query.siteId}/` : null),
		() => fetchSiteSettings(`/api/site/${query.siteId}/`)
	);

	const fetchSiteSettings = async (endpoint) => {
		const siteSettingsData = await fetchJson(endpoint, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'X-CSRFToken': Cookies.get('csrftoken')
			}
		});

		return siteSettingsData;
	};

	useEffect(() => {
		if (site !== '' && site !== undefined) {
			setSiteName(site.name);
		}
	}, [site]);

	{
		userError && <Layout>{userError.message}</Layout>;
	}
	{
		siteError && <Layout>{siteError.message}</Layout>;
	}

	return (
		<Layout>
			{user && site ? (
				<Fragment>
					<NextSeo title={pageTitle + siteName} />

					<SupportDiv className={`h-screen flex overflow-hidden bg-gray-200`}>
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
									<div>
										<nav className={`sm:hidden`}>
											<Link
												href={'/dashboard/site/' + query.siteId + '/support'}
											>
												<a
													className={`flex items-center text-sm leading-5 font-medium text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out`}
												>
													<svg
														className={`flex-shrink-0 -ml-1 mr-1 h-5 w-5 text-gray-400`}
														viewBox="0 0 20 20"
														fill="currentColor"
													>
														<path
															fillRule="evenodd"
															d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
															clipRule="evenodd"
														/>
													</svg>
													{SupportLabel[0].label}
												</a>
											</Link>
										</nav>
										<nav
											className={`hidden sm:flex items-center text-sm leading-5`}
										>
											<Link
												href={'/dashboard/site/' + query.siteId + '/support'}
											>
												<a
													className={`font-normal text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out`}
												>
													{siteName}
												</a>
											</Link>
											<svg
												className={`flex-shrink-0 mx-2 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor`}
											>
												<path
													fillRule="evenodd"
													d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
													clipRule="evenodd"
												/>
											</svg>
											<Link
												href={'/dashboard/site/' + query.siteId + '/support'}
											>
												<a
													className={`font-medium text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out`}
												>
													{SupportLabel[1].label}
												</a>
											</Link>
										</nav>
									</div>
									<div
										className={`mt-2 md:flex md:items-center md:justify-between`}
									>
										<div className={`flex-1 min-w-0`}>
											<h2
												className={`text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate`}
											>
												{SupportLabel[1].label}
											</h2>
										</div>
									</div>
								</div>
								<div className={`max-w-2xl px-4 py-4 sm:px-6 md:px-8`}>
									<div
										className={`max-w-full bg-white shadow rounded-lg overflow-hidden`}
									>
										<Formik
											initialValues={{
												message: ''
											}}
											validationSchema={Yup.object({
												message: Yup.string().required(SupportLabel[2].label)
											})}
											onSubmit={async (
												values,
												{ setSubmitting, resetForm }
											) => {
												const body = {
													message: values.message
												};

												const response = await usePostMethod(
													contactApiEndpoint,
													body
												);

												if (Math.floor(response.status / 200) === 1) {
													setErrorMsg('');
													setSuccessMsg(SupportLabel[3].label);
													setSubmitting(false);
													resetForm({ values: '' });
													setDisableSupportForm(!disableSupportForm);
												} else {
													if (response.data) {
														if (response.data.message) {
															setSuccessMsg('');
															setErrorMsg(response.data.message[0]);
														}

														if (!response.data.message) {
															setSuccessMsg('');
															setErrorMsg(SupportLabel[5].label);
														}
													} else {
														setSuccessMsg('');
														setErrorMsg(SupportLabel[5].label);
														setSubmitting(false);
														resetForm({ values: '' });
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
												<form
													className="px-4 py-5 bg-white sm:p-6"
													onSubmit={handleSubmit}
												>
													<div>
														<h3 className="text-lg leading-6 font-medium text-gray-900">
															{SupportLabel[6].label}
														</h3>
														<p className="mt-1 max-w-2xl text-sm leading-5 text-gray-500">
															{SupportLabel[7].label}
														</p>
													</div>
													<div className="mt-6 sm:mt-5">
														<div className="mt-6 sm:mt-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-300 sm:pt-5">
															<label
																htmlFor="about"
																className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
															>
																{SupportLabel[8].label}
															</label>
															<div className="mt-1 sm:mt-0 sm:col-span-2">
																<div className="max-w-lg flex rounded-md shadow-sm">
																	<textarea
																		id="message"
																		name="message"
																		rows={5}
																		disabled={isSubmitting}
																		className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:shadow-xs-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5 ${
																			isSubmitting &&
																			'opacity-50 bg-gray-300 cursor-not-allowed'
																		} ${
																			errors.message || errorMsg
																				? 'border-red-300'
																				: 'border-gray-300'
																		}`}
																		placeholder={SupportLabel[9].label}
																		onChange={handleChange}
																		onBlur={handleBlur}
																		value={values.message}
																	/>
																</div>
																{errors.message && touched.message && (
																	<span className="block mt-2 text-xs leading-5 text-red-700">
																		{errors.message &&
																			touched.message &&
																			errors.message}
																	</span>
																)}

																{successMsg && (
																	<span className="block mt-2 text-xs leading-5 text-green-700">
																		{successMsg}
																	</span>
																)}

																{errorMsg && (
																	<span className="block mt-2 text-xs leading-5 text-red-700">
																		{errorMsg}
																	</span>
																)}
															</div>
														</div>
													</div>
													<div className="mt-8 border-t border-gray-300 pt-5">
														<div className="flex justify-end">
															<span className="ml-3 inline-flex rounded-md shadow-sm">
																<button
																	type="submit"
																	disabled={isSubmitting}
																	className={`inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 transition duration-150 ease-in-out ${
																		isSubmitting
																			? 'opacity-50 bg-green-300 cursor-not-allowed'
																			: 'hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-xs-outline-green active:bg-green-700'
																	}`}
																>
																	{isSubmitting
																		? SupportLabel[11].label
																		: SupportLabel[10].label}
																</button>
															</span>
														</div>
													</div>
												</form>
											)}
										</Formik>
									</div>
								</div>

								<div
									className={`static bottom-0 w-full mx-auto px-4 sm:px-6 py-4`}
								>
									<SiteFooter />
								</div>
							</main>
						</div>
					</SupportDiv>
				</Fragment>
			) : null}
		</Layout>
	);
};

Support.propTypes = {};

export default Support;

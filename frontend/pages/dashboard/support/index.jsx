import 'core-js';
import { Formik } from 'formik';
import { Fragment, useState } from 'react';
import * as Yup from 'yup';
import Cookies from 'js-cookie';
import fetch from 'node-fetch';
import Head from 'next/head';
import Layout from 'components/Layout';
import MainSidebar from 'components/sidebar/MainSidebar';
import MobileSidebar from 'components/sidebar/MobileSidebar';
import PropTypes from 'prop-types';
import SiteFooter from 'components/footer/SiteFooter';
import styled from 'styled-components';
import SupportLabel from 'public/label/pages/site/support.json';
import useUser from 'hooks/useUser';

const SupportDiv = styled.section``;

const Support = () => {
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
	const [successMsg, setSuccessMsg] = useState('');
	const [errorMsg, setErrorMsg] = useState('');
	const pageTitle = 'Support';

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

					<SupportDiv className={`h-screen flex overflow-hidden bg-gray-1200`}>
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
												{pageTitle}
											</h2>
										</div>
									</div>
								</div>
								<div className={`max-w-2xl px-4 py-4 sm:px-6 md:px-8`}>
									<div className={`max-w-full bg-white shadow rounded-lg`}>
										<Formik
											initialValues={{
												message: ''
											}}
											validate={(values) => {
												const errors = {};

												if (!values.message) {
													errors.message = SupportLabel[2].label;
												}

												return errors;
											}}
											validationSchema={Yup.object({
												message: Yup.string()
											})}
											onSubmit={async (
												values,
												{ setSubmitting, resetForm }
											) => {
												const body = {
													message: values.message
												};

												const supportMailResponse = await fetch(
													'/api/support/contact/',
													{
														method: 'POST',
														headers: {
															'Accept': 'application/json',
															'Content-Type': 'application/json',
															'X-CSRFToken': Cookies.get('csrftoken')
														},
														body: JSON.stringify(body)
													}
												);

												const data = await supportMailResponse.json();

												setTimeout(() => {
													setSubmitting(false);
													resetForm({ values: '' });

													if (
														supportMailResponse.ok &&
														supportMailResponse.status === 200
													) {
														if (data) {
															setSuccessMsg(SupportLabel[3].label);
														} else {
															setErrorMsg(SupportLabel[4].label);
														}
													} else {
														const error = new Error(
															supportMailResponse.statusText
														);

														error.response = supportMailResponse;
														error.data = data;

														setErrorMsg(SupportLabel[5].label);

														throw error;
													}
												}, 400);
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
													className={`px-4 py-5 bg-white sm:p-6`}
													onSubmit={handleSubmit}
												>
													<div>
														<h3
															className={`text-lg leading-6 font-medium text-gray-900`}
														>
															{SupportLabel[6].label}
														</h3>
														<p
															className={`mt-1 max-w-2xl text-sm leading-5 text-gray-500`}
														>
															{SupportLabel[7].label}
														</p>
													</div>
													<div className={`mt-6 sm:mt-5`}>
														<div
															className={`mt-6 sm:mt-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5`}
														>
															<label
																htmlFor='about'
																className={`block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2`}
															>
																{SupportLabel[8].label}
															</label>
															<div className={`mt-1 sm:mt-0 sm:col-span-2`}>
																<div
																	className={`max-w-lg flex rounded-md shadow-sm`}
																>
																	<textarea
																		id={`message`}
																		rows={5}
																		className={`form-textarea block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5`}
																		name={`message`}
																		placeholder={SupportLabel[9].label}
																		onChange={handleChange}
																		onBlur={handleBlur}
																		value={values.message}
																	/>
																</div>
																{successMsg ? (
																	<span
																		className={`block mt-2 text-sm leading-5 font-medium text-green-800 break-words`}
																	>
																		{successMsg}
																	</span>
																) : (
																	<span
																		className={`block mt-2 text-sm leading-5 font-medium text-red-800 break-words`}
																	>
																		{errorMsg}
																	</span>
																)}
																<span
																	className={`block mt-2 text-sm leading-5 font-medium text-red-800 break-words`}
																>
																	{errors.message &&
																		touched.message &&
																		errors.message}
																</span>
															</div>
														</div>
													</div>
													<div className={`mt-8 border-t border-gray-200 pt-5`}>
														<div className={`flex justify-end`}>
															<span
																className={`ml-3 inline-flex rounded-md shadow-sm`}
															>
																<button
																	type='submit'
																	className={`inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 transition duration-150 ease-in-out`}
																	disabled={isSubmitting}
																>
																	{SupportLabel[10].label}
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

export default Support;

Support.propTypes = {
	openMobileSidebar: PropTypes.bool,
	pageTitle: PropTypes.string
};

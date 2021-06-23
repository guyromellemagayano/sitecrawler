// React
import { useState } from "react";

// NextJS
import Link from "next/link";

// External
import { Formik } from "formik";
import { NextSeo } from "next-seo";
import * as Yup from "yup";
import loadable from "@loadable/component";
import PasswordStrengthBar from "react-password-strength-bar";
import PropTypes from "prop-types";
import ReactHtmlParser from "react-html-parser";
import tw, { styled } from "twin.macro";

// JSON
import RegistrationLabel from "public/labels/pages/registration.json";

// Hooks
import usePostMethod from "src/hooks/usePostMethod";

// Layout
import Layout from "src/components/Layout";

// Components
const AppLogo = loadable(() => import("src/components/logos/AppLogo"));
const ErrorMessageAlert = loadable(() => import("src/components/alerts/ErrorMessageAlert"));
const LogoLabel = loadable(() => import("src/components/labels/LogoLabel"));
const SiteFooter = loadable(() => import("src/components/layouts/Footer"));
const SuccessMessageAlert = loadable(() => import("src/components/alerts/SuccessMessageAlert"));

const RegistrationDiv = styled.div``;

const Registration = () => {
	const [errorEmail, setErrorEmail] = useState(false);
	const [errorMsg, setErrorMsg] = useState([]);
	const [errorUsername, setErrorUsername] = useState(false);
	const [successMsg, setSuccessMsg] = useState([]);

	const pageTitle = "Registration";
	const registrationApiEndpoint = "/api/auth/registration/";

	return (
		<Layout>
			<NextSeo title={pageTitle} />

			<RegistrationDiv tw="bg-gray-50 min-h-screen">
				<div tw="relative overflow-auto">
					<div tw="relative pt-6 pb-12 md:pb-6">
						<main tw="mt-8 sm:mt-16 md:mt-20 lg:mt-24">
							<div tw="mx-auto max-w-screen-xl">
								<div tw="lg:grid lg:grid-cols-12 lg:gap-8">
									<div tw="px-4 sm:px-6 sm:text-center md:max-w-2xl md:mx-auto lg:col-span-7 lg:text-left lg:flex lg:items-center">
										<div>
											<AppLogo
												className={tw`flex justify-start h-12 w-auto mx-auto mb-8 md:mx-auto lg:mx-0`}
												src="/images/logos/site-logo-dark.svg"
												alt="app-logo"
											/>
											<h4 tw="mt-4 text-4xl tracking-tight text-center lg:text-left leading-10 font-bold text-gray-900 sm:mt-5 sm:leading-none">
												{RegistrationLabel[21].label}
												<span tw="text-red-600">{ReactHtmlParser(RegistrationLabel[22].label)}</span>
												<br tw="hidden md:inline" />
											</h4>
										</div>
									</div>
									<div tw="mt-12 sm:mt-16 lg:mt-0 lg:col-span-5">
										<LogoLabel isSignUp />

										<div tw="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
											{errorMsg.map((value, index) => {
												return <ErrorMessageAlert key={index} message={value} />;
											})}
											{successMsg.map((value, index) => {
												return <SuccessMessageAlert key={index} message={value} />;
											})}

											<div tw="bg-white mt-8 py-8 px-4 shadow-xl rounded-lg sm:px-10">
												<Formik
													initialValues={{
														firstname: "",
														lastname: "",
														username: "",
														email: "",
														password1: "",
														password2: ""
													}}
													validationSchema={Yup.object({
														firstname: Yup.string().required(RegistrationLabel[0].label),
														lastname: Yup.string().required(RegistrationLabel[0].label),
														username: Yup.string().required(RegistrationLabel[0].label),
														email: Yup.string().email(RegistrationLabel[1].label).required(RegistrationLabel[0].label),
														password1: Yup.string()
															.min(10, RegistrationLabel[12].label)
															.max(128, RegistrationLabel[13].label)
															.required(RegistrationLabel[0].label),
														password2: Yup.string()
															.when("password1", {
																is: (val) => val && val.length > 0,
																then: Yup.string().oneOf([Yup.ref("password1")], RegistrationLabel[14].label)
															})
															.required(RegistrationLabel[0].label)
													})}
													onSubmit={async (values, { setSubmitting, resetForm }) => {
														const body = {
															username: values.username,
															email: values.email,
															password1: values.password1,
															password2: values.password2,
															first_name: values.firstname,
															last_name: values.lastname
														};

														try {
															const response = await usePostMethod(registrationApiEndpoint, body);

															if (Math.floor(response.status / 200) === 1) {
																setErrorMsg([]);
																setSuccessMsg([]);
																resetForm({ values: "" });
																setSubmitting(false);
																setSuccessMsg((successMsg) => [...successMsg, RegistrationLabel[2].label]);
															} else {
																setErrorMsg([]);
																setSuccessMsg([]);

																if (response.data) {
																	if (response.data.username) {
																		setSubmitting(false);
																		setErrorMsg((errorMsg) => [...errorMsg, response.data.username]);
																		setErrorUsername(!errorUsername);
																	}

																	if (response.data.email) {
																		setSubmitting(false);
																		setErrorMsg((errorMsg) => [...errorMsg, response.data.email]);
																		setErrorEmail(!errorEmail);
																	}
																} else {
																	resetForm({ values: "" });
																	setSubmitting(false);
																	setErrorMsg(RegistrationLabel[3].label);
																}
															}
														} catch (error) {
															// FIXME: add logging solution here
															return null;
														}
													}}
												>
													{({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
														<form onSubmit={handleSubmit}>
															<div tw="mt-1">
																<label htmlFor="firstname" tw="block text-sm font-medium text-gray-700">
																	{RegistrationLabel[5].label}
																</label>
																<div tw="mt-1 rounded-md">
																	<input
																		id="firstname"
																		type="text"
																		name="firstname"
																		disabled={isSubmitting}
																		css={[
																			tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md`,
																			isSubmitting && tw`opacity-50 bg-gray-300 cursor-not-allowed pointer-events-none`,
																			errors.firstname ? tw`border-red-300` : tw`border-gray-300`
																		]}
																		aria-describedby="firstname"
																		onChange={handleChange}
																		value={values.firstname}
																	/>
																</div>

																{errors.firstname && touched.firstname && (
																	<span tw="block mt-2 text-xs leading-5 text-red-700">
																		{errors.firstname && touched.firstname && errors.firstname}
																	</span>
																)}
															</div>

															<div tw="mt-6">
																<label htmlFor="lastname" tw="block text-sm font-medium text-gray-700">
																	{RegistrationLabel[6].label}
																</label>
																<div tw="mt-1 rounded-md">
																	<input
																		id="lastname"
																		type="text"
																		name="lastname"
																		disabled={isSubmitting}
																		css={[
																			tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md`,
																			isSubmitting && tw`opacity-50 bg-gray-300 cursor-not-allowed pointer-events-none`,
																			errors.lastname ? tw`border-red-300` : tw`border-gray-300`
																		]}
																		aria-describedby="lastname"
																		onChange={handleChange}
																		value={values.lastname}
																	/>
																</div>

																{errors.lastname && touched.lastname && (
																	<span tw="block mt-2 text-xs leading-5 text-red-700">
																		{errors.lastname && touched.lastname && errors.lastname}
																	</span>
																)}
															</div>

															<div tw="mt-6">
																<label htmlFor="username" tw="block text-sm font-medium text-gray-700">
																	{RegistrationLabel[7].label}
																</label>
																<div tw="mt-1 rounded-md">
																	<input
																		id="username"
																		type="text"
																		name="username"
																		disabled={isSubmitting}
																		css={[
																			tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md`,
																			isSubmitting && tw`opacity-50 bg-gray-300 cursor-not-allowed pointer-events-none`,
																			errors.username || errorUsername ? tw`border-red-300` : tw`border-gray-300`
																		]}
																		aria-describedby="username"
																		onChange={handleChange}
																		value={values.username}
																	/>
																</div>

																{errors.username && touched.username && (
																	<span tw="block mt-2 text-xs leading-5 text-red-700">
																		{errors.username && touched.username && errors.username}
																	</span>
																)}
															</div>

															<div tw="mt-6">
																<label htmlFor="email" tw="block text-sm font-medium text-gray-700">
																	{RegistrationLabel[8].label}
																</label>
																<div tw="mt-1 rounded-md">
																	<input
																		id="email"
																		type="email"
																		name="email"
																		disabled={isSubmitting}
																		css={[
																			tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md`,
																			isSubmitting &&
																				tw`opacity-50 bg-gray-300 cursor-not-allowed pointer-events-none pointer-events-none`,
																			errors.email || errorEmail ? tw`border-red-300` : tw`border-gray-300`
																		]}
																		aria-describedby="email"
																		onChange={handleChange}
																		value={values.email}
																	/>
																</div>

																{errors.email && touched.email && (
																	<span tw="block mt-2 text-xs leading-5 text-red-700">
																		{errors.email && touched.email && errors.email}
																	</span>
																)}
															</div>

															<div tw="mt-6">
																<label htmlFor="password" tw="block text-sm font-medium text-gray-700">
																	{RegistrationLabel[9].label}
																</label>
																<div tw="mt-1 rounded-md">
																	<input
																		id="password1"
																		type="password"
																		name="password1"
																		disabled={isSubmitting}
																		css={[
																			tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md`,
																			isSubmitting && tw`opacity-50 bg-gray-300 cursor-not-allowed pointer-events-none`,
																			errors.password1 ? tw`border-red-300` : tw`border-gray-300`
																		]}
																		aria-describedby="password1"
																		onChange={handleChange}
																		value={values.password1}
																	/>
																</div>
																<PasswordStrengthBar password={values.password1} />

																{errors.password1 && touched.password1 && (
																	<span tw="block mt-2 text-xs leading-5 text-red-700">
																		{errors.password1 && touched.password1 && errors.password1}
																	</span>
																)}
															</div>

															<div tw="mt-6">
																<label htmlFor="password" tw="block text-sm font-medium text-gray-700">
																	{RegistrationLabel[10].label}
																</label>
																<div tw="mt-1 rounded-md">
																	<input
																		id="password2"
																		type="password"
																		name="password2"
																		disabled={isSubmitting}
																		css={[
																			tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md sm:text-sm sm:leading-5`,
																			isSubmitting && tw`opacity-50 bg-gray-300 cursor-not-allowed pointer-events-none`,
																			errors.password2 ? tw`border-red-300` : tw`border-gray-300`
																		]}
																		aria-describedby="password2"
																		onChange={handleChange}
																		value={values.password2}
																	/>
																</div>

																{errors.password2 && touched.password2 && (
																	<span tw="block mt-2 text-xs leading-5 text-red-700">
																		{errors.password2 && touched.password2 && errors.password2}
																	</span>
																)}
															</div>

															<div tw="mt-6">
																<span tw="block w-full rounded-md shadow-sm">
																	<button
																		type="submit"
																		disabled={isSubmitting}
																		css={[
																			tw`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600`,
																			isSubmitting
																				? tw`opacity-50 bg-indigo-300 cursor-not-allowed pointer-events-none`
																				: tw`hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
																		]}
																	>
																		{isSubmitting ? RegistrationLabel[15].label : RegistrationLabel[11].label}
																	</button>
																</span>
															</div>
														</form>
													)}
												</Formik>

												<div tw="mt-6">
													<div tw="relative">
														<div tw="relative flex justify-center flex-wrap flex-row text-sm leading-5">
															<span tw="px-2 bg-white text-gray-500 text-center">
																{ReactHtmlParser(RegistrationLabel[16].label)}
																<Link href="/service-terms">
																	<a tw="font-medium text-indigo-600 cursor-pointer hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
																		{RegistrationLabel[17].label}
																	</a>
																</Link>
																&nbsp;and&nbsp;
																<Link href="/privacy-policy">
																	<a tw="font-medium text-indigo-600 cursor-pointer hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
																		{RegistrationLabel[18].label}
																	</a>
																</Link>
															</span>
														</div>
													</div>
												</div>
											</div>

											<div tw="relative flex justify-center flex-wrap flex-row text-sm leading-5">
												<span tw="px-2 py-5 text-gray-600">
													{ReactHtmlParser(RegistrationLabel[19].label)}
													<Link href="/login">
														<a tw="font-medium text-indigo-600 cursor-pointer hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
															{RegistrationLabel[20].label}
														</a>
													</Link>
												</span>
											</div>
										</div>
									</div>
								</div>

								<div tw="px-4 xl:px-10 xl:mt-32">
									<SiteFooter />
								</div>
							</div>
						</main>
					</div>
				</div>
			</RegistrationDiv>
		</Layout>
	);
};

Registration.propTypes = {};

export default Registration;

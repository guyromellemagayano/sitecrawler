// React
import * as React from "react";

// NextJS
import { useRouter } from "next/router";

// External
import { Formik } from "formik";
import { NextSeo } from "next-seo";
import * as Yup from "yup";
import axios from "axios";
import Cookies from "js-cookie";
import loadable from "@loadable/component";
import PasswordStrengthBar from "react-password-strength-bar";
import tw from "twin.macro";

// Hooks
import SignupLabel from "public/labels/pages/signup.json";

// Layout
import Layout from "@components/layouts";

// Components
import SiteFooter from "src/components/layouts/Footer";
import LogoLabel from "src/components/labels/LogoLabel";

// Loadable
const ErrorMessageAlert = loadable(() => import("src/components/alerts/ErrorMessageAlert"));
const SuccessMessageAlert = loadable(() => import("src/components/alerts/SuccessMessageAlert"));

const SignupForm = (props) => {
	const [errorMsg, setErrorMsg] = React.useState(null);
	const [successMsg, setSuccessMsg] = React.useState(null);

	const router = useRouter();

	const pageTitle = "Sign Up Form";
	const signupConfirmApiEndpoint = "/api/signup/" + props.result.id[0] + "/confirm/";
	const sitesApiEndpoint = "/sites/";

	return (
		<Layout>
			<NextSeo title={pageTitle} />

			<div tw="bg-gray-50 min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
				<div tw="relative overflow-auto">
					<div tw="relative">
						<main tw="mt-8 sm:mt-16 md:mt-20 lg:mt-24">
							<div tw="mx-auto max-w-screen-xl">
								<div tw="lg:grid lg:grid-cols-12 lg:gap-8">
									<div tw="mt-12 sm:mt-16 lg:mt-0 lg:col-span-12">
										<LogoLabel isAddPassword />

										<div tw="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
											{errorMsg && <ErrorMessageAlert message={errorMsg} />}
											{successMsg && <SuccessMessageAlert message={successMsg} />}

											<div tw="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
												<Formik
													initialValues={{
														password: "",
														repeatPassword: ""
													}}
													validationSchema={Yup.object().shape({
														password: Yup.string()
															.min(10, SignupLabel[10].label)
															.max(128, SignupLabel[11].label)
															.required(SignupLabel[0].label),
														repeatPassword: Yup.string()
															.when("password", {
																is: (val) => (val && val.length > 0 ? true : false),
																then: Yup.string().oneOf([Yup.ref("password")], SignupLabel[3].label)
															})
															.required(SignupLabel[0].label)
													})}
													onSubmit={async (values, { setSubmitting, resetForm }) => {
														const body = {
															password: values.password
														};

														await axios
															.post(signupConfirmApiEndpoint, body, {
																headers: {
																	"Accept": "application/json",
																	"Content-Type": "application/json",
																	"X-CSRFToken": Cookies.get("csrftoken")
																}
															})
															.then((response) => {
																Math.floor(response.status / 200) === 1
																	? (() => {
																			console.log(response);

																			setSubmitting(false);
																			resetForm({ values: "" });
																			setSuccessMsg(SignupLabel[4].label);
																			setTimeout(() => {
																				setSubmitting(false);
																				router.push(sitesApiEndpoint);
																			}, 1000);
																	  })()
																	: null;
															})
															.catch((error) => {
																console.error(error.message);

																setSubmitting(false);
																resetForm({ values: "" });
																setErrorMsg(SignupLabel[5].label);
															});
													}}
												>
													{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
														<form onSubmit={handleSubmit}>
															<div tw="mt-1">
																<label htmlFor="password" tw="block text-sm font-medium leading-5 text-gray-700">
																	{SignupLabel[6].label}
																</label>
																<div tw="mt-1">
																	<input
																		id="password"
																		type="password"
																		name="password"
																		css={[
																			tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm`,
																			isSubmitting && tw`opacity-50 bg-gray-300 cursor-not-allowed`,
																			errors.password ? tw`border-red-300` : tw`border-gray-300`
																		]}
																		aria-describedby="password"
																		onChange={handleChange}
																		onBlur={handleBlur}
																		value={values.password}
																	/>
																	<PasswordStrengthBar password={values.password} />
																</div>

																{errors.password && touched.password && (
																	<span tw="block mt-2 text-xs leading-5 text-red-700">
																		{errors.password && touched.password && errors.password}
																	</span>
																)}
															</div>

															<div tw="mt-6">
																<label htmlFor="repeatPassword" tw="block text-sm font-medium leading-5 text-gray-700">
																	{SignupLabel[7].label}
																</label>
																<div tw="mt-1">
																	<input
																		id="repeatPassword"
																		type="password"
																		name="repeatPassword"
																		css={[
																			tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm`,
																			isSubmitting && tw`opacity-50 bg-gray-300 cursor-not-allowed`,
																			errors.repeatPassword ? tw`border-red-300` : tw`border-gray-300`
																		]}
																		aria-describedby="repeatPassword"
																		onChange={handleChange}
																		onBlur={handleBlur}
																		value={values.repeatPassword}
																	/>
																</div>

																{errors.repeatPassword && touched.repeatPassword && (
																	<span tw="block mt-2 text-xs leading-5 text-red-700">
																		{errors.repeatPassword && touched.repeatPassword && errors.repeatPassword}
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
																		{isSubmitting ? SignupLabel[9].label : SignupLabel[8].label}
																	</button>
																</span>
															</div>
														</form>
													)}
												</Formik>
											</div>
										</div>

										<div tw="px-4 xl:px-10 xl:mt-32">
											<SiteFooter />
										</div>
									</div>
								</div>
							</div>
						</main>
					</div>
				</div>
			</div>
		</Layout>
	);
};

SignupForm.propTypes = {};

export default SignupForm;

export async function getServerSideProps(ctx) {
	return {
		props: {
			result: ctx.query
		}
	};
}

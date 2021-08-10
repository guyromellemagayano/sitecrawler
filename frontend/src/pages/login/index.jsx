// React
import * as React from "react";

// NextJS
import Link from "next/link";
import Router from "next/router";

// External
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Formik } from "formik";
import { NextSeo } from "next-seo";
import { Scrollbars } from "react-custom-scrollbars-2";
import * as Yup from "yup";
import ReactHtmlParser from "react-html-parser";
import tw from "twin.macro";

// Enums
import { GlobalLabels } from "@enums/GlobalValues";
import { LoginApiEndpoint, GoogleLoginApiEndpoint } from "@enums/ApiEndpoints";
import { LoginLabels } from "@enums/LoginLabels";

// Hooks
import { usePostMethod } from "@hooks/useHttpMethod";
import { useShowPassword } from "@hooks/useShowPassword";

// Components
import AppLogo from "@components/logos/AppLogo";
import ErrorMessageAlert from "@components/alerts/ErrorMessageAlert";
import Footer from "@components/layouts/Footer";
import Layout from "@components/layouts";
import LogoLabel from "@components/labels/LogoLabel";
import SuccessMessageAlert from "@components/alerts/SuccessMessageAlert";

const Login = () => {
	const [disableLoginForm, setDisableLoginForm] = React.useState(false);
	const [errorMsg, setErrorMsg] = React.useState([]);
	const [successMsg, setSuccessMsg] = React.useState([]);

	const { passwordRef, isPasswordShown, setIsPasswordShown } = useShowPassword(false);
	const usernameRef = React.useRef();

	React.useEffect(() => {
		usernameRef.current.focus();
	}, []);

	return (
		<Layout>
			<NextSeo title={LoginLabels[20].label} />

			<div tw="h-screen bg-gray-50 flex flex-col justify-center">
				<Scrollbars universal>
					<div tw="relative overflow-auto py-12 sm:px-6 lg:px-8">
						<div tw="relative">
							<div tw="mt-8 sm:mt-16 md:mt-20 lg:mt-24">
								<div tw="mx-auto max-w-screen-xl">
									<div tw="lg:grid lg:grid-cols-12 lg:gap-8">
										<div tw="px-4 sm:px-6 sm:text-center md:max-w-2xl md:mx-auto lg:col-span-7 lg:text-left lg:flex lg:items-center">
											<div>
												<AppLogo
													tw="flex justify-start w-60 h-12 mb-8"
													src="/images/logos/site-logo-dark.svg"
													alt={GlobalLabels[0].label}
													width={320}
													height={60}
												/>
												<h4 tw="mt-4 text-4xl tracking-tight text-center lg:text-left leading-10 font-bold text-gray-900 sm:mt-5 sm:leading-none">
													{LoginLabels[0].label}
													<span tw="text-red-600">{ReactHtmlParser(LoginLabels[1].label)}</span>
													<br tw="hidden md:inline" />
												</h4>
											</div>
										</div>
										<div tw="mt-12 sm:mt-16 lg:mt-0 lg:col-span-5">
											<LogoLabel isLogin />

											<div tw="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
												{errorMsg.length > 0
													? errorMsg.map((value, index) => (
															<ErrorMessageAlert key={index} message={value} />
													  ))
													: null}

												{successMsg.length > 0
													? successMsg.map((value, index) => (
															<SuccessMessageAlert key={index} message={value} />
													  ))
													: null}

												<div tw="bg-white mt-8 py-8 px-4 shadow-xl rounded-lg sm:px-10">
													{/* TODO: Turn this into a single component, loginForm */}
													<Formik
														initialValues={{
															username: "",
															password: "",
															rememberme: false
														}}
														validationSchema={Yup.object({
															username: Yup.string().required(LoginLabels[10].label),
															password: Yup.string().required(LoginLabels[10].label)
														})}
														onSubmit={async (values, { setSubmitting, resetForm }) => {
															const body = {
																username: values.username,
																password: values.password
															};

															// FIXME: values.rememberme logic
															// if (values.rememberme === true) {
															// } else {
															// }

															try {
																const response = await usePostMethod(LoginApiEndpoint, body);
																const data = response.data;

																setErrorMsg([]);
																setSuccessMsg([]);

																if (Math.floor(response.status / 200) === 1) {
																	setSubmitting(false);
																	setDisableLoginForm(!disableLoginForm);

																	if (data.key && data.key !== undefined && data.key.length > 0) {
																		setSuccessMsg((successMsg) => [
																			...successMsg,
																			LoginLabels[12].label
																		]);

																		setTimeout(() => {
																			Router.push("/sites/");
																		}, 500);
																	}
																} else {
																	if (data) {
																		setSubmitting(false);
																		setErrorMsg((errorMsg) => [...errorMsg, data.non_field_errors]);
																	} else {
																		resetForm({ values: "" });
																		setSubmitting(false);
																		setErrorMsg(LoginLabels[11].label);
																	}
																}
															} catch (error) {
																return null;
															}
														}}
													>
														{({
															values,
															errors,
															touched,
															handleChange,
															handleSubmit,
															isSubmitting
														}) => (
															<>
																<form onSubmit={handleSubmit}>
																	<div tw="mt-1">
																		<label
																			htmlFor="username"
																			tw="block text-sm font-medium text-gray-700"
																		>
																			{LoginLabels[2].label}
																		</label>
																		<div tw="mt-1">
																			<input
																				ref={usernameRef}
																				id="username"
																				name="username"
																				type="text"
																				autoComplete="username"
																				autoFocus={true}
																				disabled={isSubmitting || disableLoginForm}
																				css={[
																					tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md`,
																					(isSubmitting || disableLoginForm) &&
																						tw`opacity-50 bg-gray-300 cursor-not-allowed pointer-events-none`,
																					errors.username || errorMsg.length
																						? tw`border-red-300`
																						: tw`border-gray-300`
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
																		<div tw="flex items-center justify-between">
																			<label
																				htmlFor="password"
																				tw="block text-sm font-medium text-gray-700"
																			>
																				{LoginLabels[3].label}
																			</label>
																			<div tw="text-xs">
																				<button
																					type="button"
																					css={[
																						tw`font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none cursor-pointer`,
																						(isSubmitting || disableLoginForm) &&
																							tw`opacity-50 text-gray-500 cursor-not-allowed pointer-events-none`
																					]}
																					onClick={() => setIsPasswordShown(!isPasswordShown)}
																				>
																					{isPasswordShown
																						? LoginLabels[15].label
																						: LoginLabels[14].label}
																				</button>
																			</div>
																		</div>
																		<div tw="mt-1">
																			<input
																				ref={passwordRef}
																				id="password"
																				name="password"
																				type="password"
																				autoComplete="current-password"
																				disabled={isSubmitting || disableLoginForm}
																				css={[
																					tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md`,
																					(isSubmitting || disableLoginForm) &&
																						tw`opacity-50 bg-gray-300 cursor-not-allowed pointer-events-none`,
																					errors.password || errorMsg.length
																						? tw`border-red-300`
																						: tw`border-gray-300`
																				]}
																				aria-describedby="password"
																				onChange={handleChange}
																				value={values.password}
																			/>
																		</div>

																		{errors.password && touched.password && (
																			<span tw="block mt-2 text-xs leading-5 text-red-700">
																				{errors.password && touched.password && errors.password}
																			</span>
																		)}
																	</div>

																	<div tw="mt-6 flex items-center justify-between">
																		<div tw="flex items-center">
																			<input
																				id="rememberme"
																				name="rememberme"
																				type="checkbox"
																				disabled={isSubmitting || disableLoginForm}
																				css={[
																					tw`h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded`,
																					(isSubmitting || disableLoginForm) &&
																						tw`opacity-50 bg-gray-300 cursor-not-allowed pointer-events-none`
																				]}
																				aria-describedby="rememberme"
																				onChange={handleChange}
																				value={values.rememberme}
																			/>
																			<label
																				htmlFor="rememberme"
																				tw="ml-2 block text-sm text-gray-900"
																			>
																				{LoginLabels[4].label}
																			</label>
																		</div>

																		<div tw="text-sm">
																			<Link href="/reset-password">
																				<a
																					css={[
																						tw`font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150 cursor-pointer`,
																						(isSubmitting || disableLoginForm) &&
																							tw`opacity-50 text-gray-500 cursor-not-allowed pointer-events-none`
																					]}
																				>
																					{LoginLabels[5].label}
																				</a>
																			</Link>
																		</div>
																	</div>

																	<div tw="mt-6">
																		<span tw="block w-full rounded-md shadow-sm">
																			<button
																				type="submit"
																				disabled={isSubmitting || disableLoginForm}
																				css={[
																					tw`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600`,
																					isSubmitting || disableLoginForm
																						? tw`opacity-50 bg-indigo-300 cursor-not-allowed pointer-events-none`
																						: tw`hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
																				]}
																			>
																				{isSubmitting || disableLoginForm
																					? LoginLabels[13].label
																					: LoginLabels[6].label}
																			</button>
																		</span>
																	</div>
																</form>

																<div tw="mt-6">
																	<div tw="relative">
																		<div tw="absolute inset-0 flex items-center">
																			<div tw="w-full border-t border-gray-300"></div>
																		</div>
																		<div tw="relative flex justify-center text-sm leading-5">
																			<span tw="px-2 bg-white text-gray-600">
																				{LoginLabels[7].label}
																			</span>
																		</div>
																	</div>

																	<div tw="mt-6 grid grid-cols-3 gap-3">
																		<div>
																			<span tw="w-full inline-flex rounded-md shadow-sm">
																				<a
																					href={GoogleLoginApiEndpoint}
																					css={[
																						tw`w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500`,
																						isSubmitting || disableLoginForm
																							? tw`bg-gray-300 cursor-not-allowed pointer-events-none`
																							: tw`hover:bg-gray-50`
																					]}
																				>
																					<span tw="sr-only">{LoginLabels[16].label}</span>
																					<FontAwesomeIcon icon={["fab", "google"]} tw="w-4 h-4" />
																				</a>
																			</span>
																		</div>

																		<div>
																			<span tw="w-full inline-flex rounded-md shadow-sm">
																				<a
																					href="#"
																					disabled={true}
																					tw="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-500 opacity-50 bg-gray-300 cursor-not-allowed pointer-events-none"
																				>
																					<span tw="sr-only">{LoginLabels[17].label}</span>
																					<FontAwesomeIcon
																						icon={["fab", "facebook-f"]}
																						tw="w-4 h-4"
																					/>
																				</a>
																			</span>
																		</div>

																		<div>
																			<span tw="w-full inline-flex rounded-md shadow-sm">
																				<a
																					href="#"
																					disabled={true}
																					tw="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-500 opacity-50 bg-gray-300 cursor-not-allowed pointer-events-none"
																				>
																					<span tw="sr-only">{LoginLabels[18].label}</span>
																					<FontAwesomeIcon
																						icon={["fab", "linkedin-in"]}
																						tw="w-4 h-4"
																					/>
																				</a>
																			</span>
																		</div>
																	</div>
																</div>
															</>
														)}
													</Formik>
												</div>

												<div tw="relative flex justify-center flex-wrap flex-row text-sm leading-5">
													<span tw="px-2 py-5 text-gray-600">
														{ReactHtmlParser(LoginLabels[8].label)}
														<Link href="/registration">
															<a tw="font-medium text-indigo-600 cursor-pointer hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
																{LoginLabels[9].label}
															</a>
														</Link>
													</span>
												</div>
											</div>
										</div>
									</div>

									<div tw="px-4 xl:px-10 xl:mt-32">
										<Footer />
									</div>
								</div>
							</div>
						</div>
					</div>
				</Scrollbars>
			</div>
		</Layout>
	);
};

export default Login;

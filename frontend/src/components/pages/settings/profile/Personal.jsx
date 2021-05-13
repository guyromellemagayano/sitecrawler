// React
import { useState, useEffect } from "react";

// External
import { Formik } from "formik";
import * as Yup from "yup";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import tw from "twin.macro";

// JSON
import PersonalLabel from "public/labels/components/profile/Personal.json";

// Hooks
import usePatchMethod from "src/hooks/usePatchMethod";

// Components
const ErrorNotification = loadable(() => import("src/components/notifications/ErrorNotification"));
const SuccessNotification = loadable(() => import("src/components/notifications/SuccessNotification"));
const SettingsPersonalSkeleton = loadable(() => import("src/components/skeletons/SettingsPersonalSkeleton"));

const SettingsPersonal = ({ user }) => {
	const [componentReady, setComponentReady] = useState(false);
	const [disableForm, setDisableForm] = useState(true);
	const [email, setEmail] = useState("");
	const [errorMsg, setErrorMsg] = useState("");
	const [errorMsgLoaded, setErrorMsgLoaded] = useState(false);
	const [firstname, setFirstname] = useState("");
	const [hasUsernameError, setHasUsernameError] = useState(false);
	const [lastname, setLastname] = useState("");
	const [successMsg, setSuccessMsg] = useState("");
	const [successMsgLoaded, setSuccessMsgLoaded] = useState(false);
	const [username, setUsername] = useState("");
	const [usernameError, setUsernameError] = useState("");

	const userApiEndpoint = "/api/auth/user/";

	const handleUserNameInputChange = (e) => {
		setUsername(e.target.value);
	};

	const handleFirstNameInputChange = (e) => {
		setFirstname(e.target.value);
	};

	const handleLastNameInputChange = (e) => {
		setLastname(e.target.value);
	};

	const handleEmailInputChange = (e) => {
		setEmail(e.target.value);
	};

	useEffect(() => {
		if (user && user !== undefined && Object.keys(user).length > 0) {
			setUsername(user.username);
			setFirstname(user.first_name);
			setLastname(user.last_name);
			setEmail(user.email);

			setTimeout(() => {
				setComponentReady(true);
			}, 500);
		}
	}, [user]);

	return componentReady ? (
		<div>
			<SuccessNotification
				successMsg={successMsg}
				successMsgLoaded={successMsgLoaded}
				setSuccessMsgLoaded={setSuccessMsgLoaded}
				successMsgTitle={PersonalLabel[14].label}
			/>
			<ErrorNotification
				errorMsg={usernameError}
				errorMsgLoaded={errorMsgLoaded}
				setErrorMsgLoaded={setErrorMsgLoaded}
				errorMsgTitle={PersonalLabel[13].label}
			/>
			<div tw="max-w-full py-4 px-8">
				<div tw="pt-4 m-auto">
					<h5 tw="text-xl leading-6 font-medium text-gray-900">{PersonalLabel[0].label}</h5>
					<p tw="max-w-full mt-2 text-sm leading-5 text-gray-500">{PersonalLabel[0].description}</p>
				</div>
			</div>
			<div tw="max-w-full lg:max-w-3xl p-8 pt-0 pb-2">
				<Formik
					enableReinitialize={true}
					initialValues={{
						username: username,
						firstname: firstname,
						lastname: lastname
					}}
					validationSchema={Yup.object().shape({
						username: Yup.string()
							.min(3, PersonalLabel[9].label)
							.max(30, PersonalLabel[10].label)
							.required(PersonalLabel[8].label),
						firstname: Yup.string()
							.min(2, PersonalLabel[9].label)
							.max(78, PersonalLabel[10].label)
							.required(PersonalLabel[8].label),
						lastname: Yup.string()
							.min(2, PersonalLabel[9].label)
							.max(78, PersonalLabel[10].label)
							.required(PersonalLabel[8].label)
					})}
					onSubmit={async (values, { setSubmitting }) => {
						const body = {
							username: values.username,
							first_name: values.firstname,
							last_name: values.lastname,
							settings: user.settings,
							large_page_size_threshold: user.large_page_size_threshold
						};

						try {
							const response = await usePatchMethod(userApiEndpoint, body);
							const data = await response.data;

							if (Math.floor(response.status / 200) === 1) {
								if (data) {
									setTimeout(() => {
										setSubmitting(false);
									}, 1000);

									setHasUsernameError(false);
									setDisableForm(true);
									setSuccessMsg(PersonalLabel[11].label);
									setSuccessMsgLoaded(true);
								}
							} else {
								if (data) {
									if (data.username) {
										setTimeout(() => {
											setSubmitting(false);
										}, 1000);

										setHasUsernameError(true);
										setDisableForm(false);
										setUsernameError(data.username);
										setErrorMsgLoaded(true);
									}
								}
							}
						} catch (error) {
							throw error.message;
						}
					}}
				>
					{({ values, errors, handleBlur, handleSubmit, isSubmitting, touched }) => (
						<form tw="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit}>
							<div tw="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-5">
								<div tw="sm:col-span-4">
									<label htmlFor="username" tw="block text-sm font-medium leading-5 text-gray-700">
										{PersonalLabel[1].label}
									</label>
									<div tw="mt-1 relative flex rounded-md shadow-sm">
										<input
											type="text"
											id="username"
											value={values.username}
											name="username"
											disabled={
												isSubmitting ? isSubmitting : disableForm && hasUsernameError ? !disableForm : disableForm
											}
											css={[
												tw`focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm`,
												(isSubmitting ? isSubmitting : disableForm && hasUsernameError ? !disableForm : disableForm) &&
													tw`opacity-50 bg-gray-300 cursor-not-allowed`,
												errors.username || hasUsernameError ? tw`border-red-300` : tw`border-gray-300`
											]}
											aria-describedby="username"
											onChange={handleUserNameInputChange}
											onBlur={handleBlur}
										/>
									</div>
									{errors.username && touched.username && (
										<span tw="block mt-2 text-xs leading-5 text-red-700">{errors.username && errors.username}</span>
									)}
								</div>

								<div tw="sm:col-span-2">
									<label htmlFor="firstname" tw="block text-sm font-medium leading-5 text-gray-700">
										{PersonalLabel[2].label}
									</label>
									<div tw="mt-1 relative rounded-md shadow-sm">
										<input
											type="text"
											id="firstname"
											value={values.firstname}
											name="firstname"
											disabled={
												isSubmitting ? isSubmitting : disableForm && hasUsernameError ? !disableForm : disableForm
											}
											css={[
												tw`focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm`,
												(isSubmitting ? isSubmitting : disableForm && hasUsernameError ? !disableForm : disableForm) &&
													tw`opacity-50 bg-gray-300 cursor-not-allowed`,
												errors.firstname ? tw`border-red-300` : tw`border-gray-300`
											]}
											aria-describedby="firstname"
											onChange={handleFirstNameInputChange}
											onBlur={handleBlur}
										/>
									</div>
									{errors.firstname && touched.firstname && (
										<span tw="block mt-2 text-xs leading-5 text-red-700">{errors.firstname && errors.firstname}</span>
									)}
								</div>

								<div tw="sm:col-span-2">
									<label htmlFor="lastname" tw="block text-sm font-medium leading-5 text-gray-700">
										{PersonalLabel[3].label}
									</label>
									<div tw="mt-1 relative rounded-md shadow-sm">
										<input
											type="text"
											id="lastname"
											value={values.lastname}
											name="lastname"
											disabled={
												isSubmitting ? isSubmitting : disableForm && hasUsernameError ? !disableForm : disableForm
											}
											css={[
												tw`focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm`,
												(isSubmitting ? isSubmitting : disableForm && hasUsernameError ? !disableForm : disableForm) &&
													tw`opacity-50 bg-gray-300 cursor-not-allowed`,
												errors.lastname ? tw`border-red-300` : tw`border-gray-300`
											]}
											aria-describedby="lastname"
											onChange={handleLastNameInputChange}
											onBlur={handleBlur}
										/>
									</div>
									{errors.lastname && touched.lastname && (
										<span tw="block mt-2 text-xs leading-5 text-red-700">{errors.lastname && errors.lastname}</span>
									)}
								</div>

								<div tw="sm:col-span-4">
									<label htmlFor="email" tw="block text-sm font-medium leading-5 text-gray-700">
										{PersonalLabel[4].label}
									</label>
									<div tw="mt-1 rounded-md shadow-sm">
										<input
											id="email"
											type="email"
											value={email}
											disabled={true}
											tw="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm border-gray-300 opacity-50 bg-gray-200 cursor-not-allowed"
											aria-describedby="email"
											onChange={handleEmailInputChange}
										/>
									</div>
								</div>

								<div tw="sm:col-span-4">
									<div tw="flex justify-between flex-col sm:flex-row md:flex-col lg:flex-row">
										<div tw="flex justify-start order-1 sm:flex-row sm:flex-initial sm:w-auto sm:mr-1 lg:order-1 lg:w-full">
											<span tw="inline-flex">
												{!disableForm ? (
													<button
														type="submit"
														disabled={isSubmitting || Object.keys(errors).length > 0}
														css={[
															tw`w-full mt-3 mr-3 sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600`,
															isSubmitting || Object.keys(errors).length > 0
																? tw`opacity-50 cursor-not-allowed`
																: tw`hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`
														]}
													>
														{isSubmitting
															? PersonalLabel[12].label
															: !disableForm
															? PersonalLabel[7].label
															: PersonalLabel[5].label}
													</button>
												) : hasUsernameError && !disableForm ? (
													<button
														type="submit"
														disabled={isSubmitting || Object.keys(errors).length > 0}
														css={[
															tw`w-full mt-3 mr-3 sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600`,
															isSubmitting || Object.keys(errors).length > 0
																? tw`opacity-50 cursor-not-allowed`
																: tw`hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`
														]}
													>
														{isSubmitting
															? PersonalLabel[12].label
															: !disableForm
															? PersonalLabel[7].label
															: PersonalLabel[5].label}
													</button>
												) : (
													<button
														type="button"
														disabled={isSubmitting || Object.keys(errors).length > 0}
														css={[
															tw`w-full mt-3 mr-3 sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600`,
															isSubmitting || Object.keys(errors).length > 0
																? tw`opacity-50 cursor-not-allowed`
																: tw`hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
														]}
														onClick={() => setDisableForm(!disableForm)}
													>
														{isSubmitting ? PersonalLabel[12].label : PersonalLabel[5].label}
													</button>
												)}
											</span>
										</div>
									</div>
								</div>
							</div>
						</form>
					)}
				</Formik>
			</div>
		</div>
	) : (
		<SettingsPersonalSkeleton />
	);
};

SettingsPersonal.propTypes = {};

export default SettingsPersonal;
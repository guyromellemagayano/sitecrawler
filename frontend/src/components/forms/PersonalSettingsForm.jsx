// React
import * as React from "react";

// External
import { Formik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import tw from "twin.macro";

// Enums
import { PersonalSettingsLabels } from "@enums/PersonalSettingsLabels";
import { UserApiEndpoint } from "@enums/ApiEndpoints";

// Hooks
import { usePatchMethod } from "@hooks/useHttpMethod";

const PersonalSettingsForm = ({ componentReady, mutateUser, setErrorMsg, setSuccessMsg, user }) => {
	const [disableForm, setDisableForm] = React.useState(true);
	const [email, setEmail] = React.useState("");
	const [firstname, setFirstname] = React.useState("");
	const [lastname, setLastname] = React.useState("");
	const [username, setUsername] = React.useState("");

	const firstnameRef = React.useRef();

	React.useEffect(() => {
		user
			? (() => {
					setUsername(user?.username);
					setFirstname(user?.first_name);
					setLastname(user?.last_name);
					setEmail(user?.email);
			  })()
			: null;

		return { username, firstname, lastname, email };
	}, [user]);

	React.useEffect(() => {
		!disableForm ? firstnameRef.current.focus() : setDisableForm(true);
	}, [disableForm]);

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

	return (
		<Formik
			enableReinitialize={true}
			initialValues={{
				username: username,
				firstname: firstname,
				lastname: lastname
			}}
			validationSchema={Yup.object().shape({
				username: Yup.string()
					.min(3, PersonalSettingsLabels[9].label)
					.max(30, PersonalSettingsLabels[10].label)
					.required(PersonalSettingsLabels[8].label),
				firstname: Yup.string()
					.min(2, PersonalSettingsLabels[9].label)
					.max(78, PersonalSettingsLabels[10].label)
					.required(PersonalSettingsLabels[8].label),
				lastname: Yup.string()
					.min(2, PersonalSettingsLabels[9].label)
					.max(78, PersonalSettingsLabels[10].label)
					.required(PersonalSettingsLabels[8].label)
			})}
			onSubmit={async (values, { setSubmitting, resetForm }) => {
				const body = {
					username: values.username,
					first_name: values.firstname,
					last_name: values.lastname,
					settings: user?.settings,
					large_page_size_threshold: user?.large_page_size_threshold
				};

				const { response, error } = await usePatchMethod(UserApiEndpoint, body);

				setErrorMsg([]);
				setSuccessMsg([]);

				Math.floor(response?.status / 200) === 1
					? (() => {
							resetForm({ values: "" });
							setSubmitting(false);
							setDisableForm(!disableForm);
							setSuccessMsg((successMsg) => [...successMsg, PersonalSettingsLabels[11].label]);

							mutateUser(UserApiEndpoint);
					  })()
					: (() => {
							resetForm({ values: "" });
							setSubmitting(false);
							setDisableForm(!disableForm);

							response?.data
								? setErrorMsg((errorMsg) => [...errorMsg, response?.data?.username])
								: setErrorMsg((errorMsg) => [...errorMsg, PasswordSettingsLabels[15].label]);

							return error;
					  })();
			}}
		>
			{({ errors, handleBlur, handleSubmit, isSubmitting, touched, values }) => (
				<form tw="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit}>
					<div tw="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-5">
						<div tw="sm:col-span-3">
							{componentReady ? (
								<>
									<label htmlFor="firstname" tw="block text-sm font-medium leading-5 text-gray-700">
										{PersonalSettingsLabels[2].label}
									</label>
									<div tw="mt-1 relative rounded-md shadow-sm">
										<input
											ref={firstnameRef}
											type="text"
											id="firstname"
											value={values.firstname}
											autoFocus={true}
											name="firstname"
											disabled={isSubmitting || disableForm}
											css={[
												tw`focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm`,
												(isSubmitting || disableForm) &&
													tw`opacity-50 bg-gray-300 cursor-not-allowed`,
												errors.firstname ? tw`border-red-300` : tw`border-gray-300`
											]}
											aria-describedby="firstname"
											onChange={handleFirstNameInputChange}
											onBlur={handleBlur}
										/>
									</div>
								</>
							) : (
								<>
									<Skeleton duration={2} width={150} height={20} tw="block text-sm" />
									<Skeleton duration={2} width={435.17} height={38} tw="mt-1 relative flex " />
								</>
							)}

							{errors.firstname && touched.firstname && (
								<span tw="block mt-2 text-xs leading-5 text-red-700">
									{errors.firstname && touched.firstname && errors.firstname}
								</span>
							)}
						</div>

						<div tw="sm:col-span-3">
							{componentReady ? (
								<>
									<label htmlFor="lastname" tw="block text-sm font-medium leading-5 text-gray-700">
										{PersonalSettingsLabels[3].label}
									</label>
									<div tw="mt-1 relative rounded-md shadow-sm">
										<input
											type="text"
											id="lastname"
											value={values.lastname}
											name="lastname"
											disabled={isSubmitting || disableForm}
											css={[
												tw`focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm`,
												(isSubmitting || disableForm) &&
													tw`opacity-50 bg-gray-300 cursor-not-allowed`,
												errors.lastname ? tw`border-red-300` : tw`border-gray-300`
											]}
											aria-describedby="lastname"
											onChange={handleLastNameInputChange}
											onBlur={handleBlur}
										/>
									</div>
								</>
							) : (
								<>
									<Skeleton duration={2} width={150} height={20} tw="block text-sm" />
									<Skeleton duration={2} width={435.17} height={38} tw="mt-1 relative flex " />
								</>
							)}

							{errors.lastname && touched.lastname && (
								<span tw="block mt-2 text-xs leading-5 text-red-700">
									{errors.lastname && touched.lastname && errors.lastname}
								</span>
							)}
						</div>

						<div tw="sm:col-span-3">
							{componentReady ? (
								<>
									<label htmlFor="username" tw="block text-sm font-medium leading-5 text-gray-700">
										{PersonalSettingsLabels[1].label}
									</label>
									<div tw="mt-1 relative flex rounded-md shadow-sm">
										<input
											type="text"
											id="username"
											value={values.username}
											name="username"
											disabled={isSubmitting || disableForm}
											css={[
												tw`focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm`,
												(isSubmitting || disableForm) &&
													tw`opacity-50 bg-gray-300 cursor-not-allowed`,
												errors.username ? tw`border-red-300` : tw`border-gray-300`
											]}
											aria-describedby="username"
											onChange={handleUserNameInputChange}
											onBlur={handleBlur}
										/>
									</div>
								</>
							) : (
								<>
									<Skeleton duration={2} width={150} height={20} tw="block text-sm" />
									<Skeleton duration={2} width={435.17} height={38} tw="mt-1 relative flex " />
								</>
							)}

							{errors.username && touched.username && (
								<span tw="block mt-2 text-xs leading-5 text-red-700">
									{errors.username && touched.username && errors.username}
								</span>
							)}
						</div>

						<div tw="sm:col-span-3">
							{componentReady ? (
								<>
									<label htmlFor="email" tw="block text-sm font-medium leading-5 text-gray-700">
										{PersonalSettingsLabels[4].label}
									</label>
									<div tw="mt-1 rounded-md shadow-sm">
										<input
											id="email"
											type="email"
											value={email}
											disabled={true}
											tw="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm border-gray-300 opacity-50 bg-gray-300 cursor-not-allowed"
											aria-describedby="email"
											onChange={handleEmailInputChange}
										/>
									</div>
								</>
							) : (
								<>
									<Skeleton duration={2} width={150} height={20} tw="block text-sm" />
									<Skeleton duration={2} width={435.17} height={38} tw="mt-1 relative flex " />
								</>
							)}
						</div>

						<div tw="sm:col-span-3">
							<div tw="flex justify-between flex-col sm:flex-row md:flex-col lg:flex-row">
								<div tw="flex justify-start order-1 sm:flex-row sm:flex-initial sm:w-auto sm:mr-1 lg:order-1 lg:w-full">
									<span tw="inline-flex">
										{componentReady ? (
											!disableForm ? (
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
														? PersonalSettingsLabels[12].label
														: !disableForm
														? PersonalSettingsLabels[7].label
														: PersonalSettingsLabels[5].label}
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
													{isSubmitting
														? PersonalSettingsLabels[12].label
														: !disableForm
														? PersonalSettingsLabels[7].label
														: PersonalSettingsLabels[5].label}
												</button>
											)
										) : (
											<Skeleton
												duration={2}
												width={82.39}
												height={38}
												tw="w-full mt-3 mr-3 sm:mt-0 relative inline-flex items-center px-4 py-2"
											/>
										)}
									</span>
								</div>
							</div>
						</div>
					</div>
				</form>
			)}
		</Formik>
	);
};

PersonalSettingsForm.propTypes = {
	componentReady: PropTypes.bool,
	email: PropTypes.string,
	first_name: PropTypes.string,
	large_page_size_threshold: PropTypes.number,
	last_name: PropTypes.string,
	mutateUser: PropTypes.func,
	setErrorMsg: PropTypes.func,
	setSuccessMsg: PropTypes.func,
	settings: PropTypes.object,
	username: PropTypes.string
};

PersonalSettingsForm.defaultProps = {
	componentReady: false,
	email: null,
	first_name: null,
	large_page_size_threshold: null,
	last_name: null,
	mutateUser: null,
	setErrorMsg: null,
	setSuccessMsg: null,
	settings: null,
	username: null
};

export default PersonalSettingsForm;

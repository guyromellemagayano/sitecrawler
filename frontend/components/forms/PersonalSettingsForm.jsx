import { MemoizedAlert } from "@components/alerts";
import { UserApiEndpoint } from "@constants/ApiEndpoints";
import { handlePatchMethod } from "@helpers/handleHttpMethods";
import { useAlertMessage } from "@hooks/useAlertMessage";
import { useLoading } from "@hooks/useLoading";
import { useUser } from "@hooks/useUser";
import { Formik } from "formik";
import useTranslation from "next-translate/useTranslation";
import { memo, useCallback, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSWRConfig } from "swr";
import tw from "twin.macro";
import * as Yup from "yup";

/**
 * Custom function to render the `PersonalSettingsForm` component
 */
const PersonalSettingsForm = () => {
	const [disableForm, setDisableForm] = useState(true);
	const [email, setEmail] = useState(null);
	const [firstname, setFirstname] = useState(null);
	const [lastname, setLastname] = useState(null);
	const [username, setUsername] = useState(null);

	// Translations
	const { t } = useTranslation();
	const saving = t("settings:saving");
	const saveChanges = t("settings:saveChanges");
	const firstName = t("common:firstName");
	const lastName = t("common:lastName");
	const userName = t("common:userName");
	const emailAddress = t("common:emailAddress");
	const update = t("common:update");
	const requiredField = t("common:requiredField");
	const tooShort = t("common:tooShort");
	const tooLong = t("common:tooLong");

	// SWR hooks
	const { user, errorUser, validatingUser } = useUser();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// Custom hooks
	const { isComponentReady } = useLoading();
	const { state, setConfig } = useAlertMessage();

	// Handle the population of form data
	const handleFormData = useCallback(async () => {
		if (!validatingUser) {
			if (!errorUser && typeof user !== "undefined" && user !== null && !user?.data?.detail) {
				setUsername(user?.data?.username ?? null);
				setFirstname(user?.data?.first_name ?? null);
				setLastname(user?.data?.last_name ?? null);
				setEmail(user?.data?.email ?? null);
			}
		}
	}, [user, errorUser, validatingUser]);

	useEffect(() => {
		handleFormData();
	}, [handleFormData]);

	const handleUserNameInputChange = async (e) => {
		setUsername(e.target.value);
	};

	const handleFirstNameInputChange = async (e) => {
		setFirstname(e.target.value);
	};

	const handleLastNameInputChange = async (e) => {
		setLastname(e.target.value);
	};

	const handleEmailInputChange = async (e) => {
		setEmail(e.target.value);
	};

	return (
		<>
			{state?.responses !== [] && state?.responses?.length > 0 ? (
				<div tw="fixed z-9999 right-2 top-4 bottom-4 flex flex-col justify-start items-end gap-4 overflow-y-auto">
					{state?.responses?.map((value, key) => {
						// Alert Messsages
						const responseText = value?.responseText ?? null;
						const isSuccess = value?.isSuccess ?? null;

						return <MemoizedAlert key={key} responseText={responseText} isSuccess={isSuccess} />;
					}) ?? null}
				</div>
			) : null}

			<Formik
				enableReinitialize={true}
				initialValues={{
					username: username,
					firstname: firstname,
					lastname: lastname,
					email: email
				}}
				validationSchema={Yup.object().shape({
					username: Yup.string().min(3, tooShort).max(30, tooLong).required(requiredField),
					firstname: Yup.string().min(2, tooShort).max(78, tooLong).required(requiredField),
					lastname: Yup.string().min(2, tooShort).max(78, tooLong).required(requiredField)
				})}
				onSubmit={async (values, { setSubmitting }) => {
					const body = {
						username: values.username,
						first_name: values.firstname,
						last_name: values.lastname,
						email: values.email,
						settings: user?.data?.settings ?? null,
						large_page_size_threshold: user?.data?.large_page_size_threshold ?? null
					};

					const personalSettingsResponse = await handlePatchMethod(UserApiEndpoint, body);
					const personalSettingsResponseData = personalSettingsResponse?.data ?? null;
					const personalSettingsResponseStatus = personalSettingsResponse?.status ?? null;
					const personalSettingsResponseMethod = personalSettingsResponse?.config?.method ?? null;

					if (personalSettingsResponseData !== null && Math.round(personalSettingsResponseStatus / 200) === 1) {
						// Disable submission and disable form as soon as 200 OK or 201 Created response was issued
						setSubmitting(false);
						setDisableForm(!disableForm);

						// Show alert message after successful 200 OK or 201 Created response is issued
						setConfig({
							isUser: true,
							method: personalSettingsResponseMethod,
							status: personalSettingsResponseStatus
						});

						// Mutate `user` endpoint after successful 200 OK or 201 Created response is issued
						await mutate(UserApiEndpoint, false);
					} else {
						// Disable submission as soon as 200 OK or 201 Created response was not issued
						setSubmitting(false);

						// Show alert message after unsuccessful 200 OK or 201 Created response is issued
						setConfig({
							isUser: true,
							method: personalSettingsResponseMethod,
							status: personalSettingsResponseStatus
						});
					}
				}}
			>
				{({ errors, handleBlur, handleSubmit, isSubmitting, touched, values }) => (
					<form tw="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit}>
						<div tw="mt-6 grid grid-cols-1 gap-y-6 gap-x-4">
							<div tw="sm:col-span-1">
								<label htmlFor="firstname" tw="block text-sm font-medium leading-5 text-gray-700">
									{isComponentReady ? firstName : <Skeleton duration={2} width={150} height={20} />}
								</label>
								<div tw="mt-1 relative rounded-md shadow-sm">
									{isComponentReady ? (
										<input
											type="text"
											id="firstname"
											value={values.firstname}
											name="firstname"
											disabled={isSubmitting || disableForm}
											css={[
												tw`focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm`,
												(isSubmitting || disableForm) && tw`opacity-50 bg-gray-300 cursor-not-allowed`,
												errors.firstname ? tw`border-red-300` : tw`border-gray-300`
											]}
											aria-describedby="firstname"
											onChange={handleFirstNameInputChange}
											onBlur={handleBlur}
										/>
									) : (
										<Skeleton duration={2} width={360} height={38} />
									)}
								</div>

								{errors.firstname || touched.firstname ? (
									<span tw="block mt-2 text-xs leading-5 text-red-700">{errors.firstname || touched.firstname}</span>
								) : null}
							</div>

							<div tw="sm:col-span-1">
								<label htmlFor="lastname" tw="block text-sm font-medium leading-5 text-gray-700">
									{isComponentReady ? lastName : <Skeleton duration={2} width={150} height={20} />}
								</label>
								<div tw="mt-1 relative rounded-md shadow-sm">
									{isComponentReady ? (
										<input
											type="text"
											id="lastname"
											value={values.lastname}
											name="lastname"
											disabled={isSubmitting || disableForm}
											css={[
												tw`focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm`,
												(isSubmitting || disableForm) && tw`opacity-50 bg-gray-300 cursor-not-allowed`,
												errors.lastname ? tw`border-red-300` : tw`border-gray-300`
											]}
											aria-describedby="lastname"
											onChange={handleLastNameInputChange}
											onBlur={handleBlur}
										/>
									) : (
										<Skeleton duration={2} width={360} height={38} />
									)}
								</div>

								{errors.lastname || touched.lastname ? (
									<span tw="block mt-2 text-xs leading-5 text-red-700">{errors.lastname || touched.lastname}</span>
								) : null}
							</div>

							<div tw="sm:col-span-1">
								<label htmlFor="username" tw="block text-sm font-medium leading-5 text-gray-700">
									{isComponentReady ? userName : <Skeleton duration={2} width={150} height={20} />}
								</label>
								<div tw="mt-1 relative flex rounded-md shadow-sm">
									{isComponentReady ? (
										<input
											type="text"
											id="username"
											value={values.username}
											name="username"
											disabled={isSubmitting || disableForm}
											css={[
												tw`focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm`,
												(isSubmitting || disableForm) && tw`opacity-50 bg-gray-300 cursor-not-allowed`,
												errors.username ? tw`border-red-300` : tw`border-gray-300`
											]}
											aria-describedby="username"
											onChange={handleUserNameInputChange}
											onBlur={handleBlur}
										/>
									) : (
										<Skeleton duration={2} width={360} height={38} />
									)}
								</div>

								{errors.username || touched.username ? (
									<span tw="block mt-2 text-xs leading-5 text-red-700">{errors.username || touched.username}</span>
								) : null}
							</div>

							<div tw="sm:col-span-1">
								<label htmlFor="email" tw="block text-sm font-medium leading-5 text-gray-700">
									{isComponentReady ? emailAddress : <Skeleton duration={2} width={150} height={20} />}
								</label>
								<div tw="mt-1 rounded-md shadow-sm">
									{isComponentReady ? (
										<input
											id="email"
											type="email"
											value={values.email}
											disabled={true}
											tw="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm border-gray-300 opacity-50 bg-gray-300 cursor-not-allowed"
											aria-describedby="email"
											onChange={handleEmailInputChange}
										/>
									) : (
										<Skeleton duration={2} width={360} height={38} />
									)}
								</div>
							</div>

							<div tw="sm:col-span-1">
								<div tw="flex justify-between flex-col sm:flex-row md:flex-col lg:flex-row">
									<div tw="flex justify-start order-1 sm:flex-row sm:flex-initial sm:w-auto sm:mr-1 lg:order-1 lg:w-full">
										<span tw="inline-flex">
											{isComponentReady ? (
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
														{isSubmitting ? saving : !disableForm ? saveChanges : update}
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
														{isSubmitting ? saving : !disableForm ? saveChanges : update}
													</button>
												)
											) : (
												<Skeleton
													duration={2}
													width={82.39}
													height={38}
													tw="w-full mt-3 mr-3 sm:mt-0 inline-flex items-center px-4 py-2"
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
		</>
	);
};

/**
 * Memoized custom `PersonalSettingsForm` component
 */
export const MemoizedPersonalSettingsForm = memo(PersonalSettingsForm);

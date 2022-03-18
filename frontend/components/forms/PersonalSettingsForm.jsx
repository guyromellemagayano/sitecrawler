import { UserApiEndpoint } from "@constants/ApiEndpoints";
import { handlePatchMethod } from "@helpers/handleHttpMethods";
import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import { Formik } from "formik";
import useTranslation from "next-translate/useTranslation";
import { memo, useContext, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSWRConfig } from "swr";
import * as Yup from "yup";

/**
 * Custom function to render the `PersonalSettingsForm` component
 */
const PersonalSettingsForm = () => {
	const [disableForm, setDisableForm] = useState(true);

	// Translations
	const { t } = useTranslation();
	const saving = t("common:saving");
	const saveChanges = t("common:save");
	const firstName = t("common:firstName");
	const lastName = t("common:lastName");
	const userName = t("common:userName");
	const emailAddress = t("common:emailAddress");
	const updateText = t("common:update");
	const requiredField = t("common:requiredField");
	const tooShort = t("common:tooShort");
	const tooLong = t("common:tooLong");

	// Custom context
	const { isComponentReady, setConfig } = useContext(SiteCrawlerAppContext);

	// SWR hooks
	const {
		user,
		username,
		setUsername,
		firstname,
		setFirstname,
		lastname,
		setLastname,
		email,
		setEmail,
		settings,
		largePageSizeThreshold
	} = useUser();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

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
					settings: settings,
					large_page_size_threshold: largePageSizeThreshold
				};

				const personalSettingsResponse = await handlePatchMethod(UserApiEndpoint, body);
				const personalSettingsResponseData = personalSettingsResponse?.data ?? null;
				const personalSettingsResponseStatus = personalSettingsResponse?.status ?? null;
				const personalSettingsResponseMethod = personalSettingsResponse?.config?.method ?? null;

				if (personalSettingsResponseData && Math.round(personalSettingsResponseStatus / 200) === 1) {
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
					mutate(UserApiEndpoint);
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
				<form className="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit}>
					<div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4">
						<div className="sm:col-span-1">
							<label htmlFor="firstname" className="block text-sm font-medium leading-5 text-gray-700">
								{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
									firstName
								) : (
									<Skeleton duration={2} width={150} height={20} />
								)}
							</label>
							<div className="relative mt-1 rounded-md shadow-sm">
								{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
									<input
										type="text"
										id="firstname"
										value={values.firstname}
										name="firstname"
										disabled={isSubmitting || disableForm}
										className={classnames(
											"block w-full rounded-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
											(isSubmitting || disableForm) && "cursor-not-allowed bg-gray-300 opacity-50",
											errors.firstname ? "border-red-300" : "border-gray-300"
										)}
										aria-describedby="firstname"
										onChange={handleFirstNameInputChange}
										onBlur={handleBlur}
									/>
								) : (
									<Skeleton duration={2} width={360} height={38} />
								)}
							</div>

							{errors.firstname || touched.firstname ? (
								<span className="mt-2 block text-xs leading-5 text-red-700">
									{errors.firstname || touched.firstname}
								</span>
							) : null}
						</div>

						<div className="sm:col-span-1">
							<label htmlFor="lastname" className="block text-sm font-medium leading-5 text-gray-700">
								{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
									lastName
								) : (
									<Skeleton duration={2} width={150} height={20} />
								)}
							</label>
							<div className="relative mt-1 rounded-md shadow-sm">
								{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
									<input
										type="text"
										id="lastname"
										value={values.lastname}
										name="lastname"
										disabled={isSubmitting || disableForm}
										className={classnames(
											"block w-full rounded-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
											(isSubmitting || disableForm) && "cursor-not-allowed bg-gray-300 opacity-50",
											errors.lastname ? "border-red-300" : "border-gray-300"
										)}
										aria-describedby="lastname"
										onChange={handleLastNameInputChange}
										onBlur={handleBlur}
									/>
								) : (
									<Skeleton duration={2} width={360} height={38} />
								)}
							</div>

							{errors.lastname || touched.lastname ? (
								<span className="mt-2 block text-xs leading-5 text-red-700">{errors.lastname || touched.lastname}</span>
							) : null}
						</div>

						<div className="sm:col-span-1">
							<label htmlFor="username" className="block text-sm font-medium leading-5 text-gray-700">
								{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
									userName
								) : (
									<Skeleton duration={2} width={150} height={20} />
								)}
							</label>
							<div className="relative mt-1 flex rounded-md shadow-sm">
								{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
									<input
										type="text"
										id="username"
										value={values.username}
										name="username"
										disabled={isSubmitting || disableForm}
										className={classnames(
											"block w-full rounded-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
											(isSubmitting || disableForm) && "cursor-not-allowed bg-gray-300 opacity-50",
											errors.username ? "border-red-300" : "border-gray-300"
										)}
										aria-describedby="username"
										onChange={handleUserNameInputChange}
										onBlur={handleBlur}
									/>
								) : (
									<Skeleton duration={2} width={360} height={38} />
								)}
							</div>

							{errors.username || touched.username ? (
								<span className="mt-2 block text-xs leading-5 text-red-700">{errors.username || touched.username}</span>
							) : null}
						</div>

						<div className="sm:col-span-1">
							<label htmlFor="email" className="block text-sm font-medium leading-5 text-gray-700">
								{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
									emailAddress
								) : (
									<Skeleton duration={2} width={150} height={20} />
								)}
							</label>
							<div className="mt-1 rounded-md shadow-sm">
								{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
									<input
										id="email"
										type="email"
										value={values.email}
										disabled={true}
										className="block w-full cursor-not-allowed rounded-md border-gray-300 bg-gray-300 opacity-50 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
										aria-describedby="email"
										onChange={handleEmailInputChange}
									/>
								) : (
									<Skeleton duration={2} width={360} height={38} />
								)}
							</div>
						</div>

						<div className="sm:col-span-1">
							<div className="flex flex-col justify-between sm:flex-row md:flex-col lg:flex-row">
								<div className="order-1 flex justify-start sm:mr-1 sm:w-auto sm:flex-initial sm:flex-row lg:order-1 lg:w-full">
									<span className="inline-flex">
										{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
											!disableForm ? (
												<button
													type="submit"
													disabled={isSubmitting || Object.keys(errors).length > 0}
													className={classnames(
														"relative mt-3 mr-3 inline-flex w-full items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium leading-5 text-white sm:mt-0",
														isSubmitting || Object.keys(errors).length > 0
															? "cursor-not-allowed opacity-50"
															: "hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
													)}
												>
													{isSubmitting ? saving : !disableForm ? saveChanges : updateText}
												</button>
											) : (
												<button
													type="button"
													disabled={isSubmitting || Object.keys(errors).length > 0}
													className={classnames(
														"relative mt-3 mr-3 inline-flex w-full items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium leading-5 text-white sm:mt-0",
														isSubmitting || Object.keys(errors).length > 0
															? "cursor-not-allowed opacity-50"
															: "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
													)}
													onClick={() => setDisableForm(!disableForm)}
												>
													{isSubmitting ? saving : !disableForm ? saveChanges : updateText}
												</button>
											)
										) : (
											<Skeleton
												duration={2}
												width={82.39}
												height={38}
												className="mt-3 mr-3 inline-flex w-full items-center px-4 py-2 sm:mt-0"
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

/**
 * Memoized custom `PersonalSettingsForm` component
 */
export const MemoizedPersonalSettingsForm = memo(PersonalSettingsForm);

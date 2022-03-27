import { UserApiEndpoint } from "@constants/ApiEndpoints";
import { FormStringMaxChars, FormStringMinChars, NotificationDisplayInterval } from "@constants/GlobalValues";
import { handlePatchMethod } from "@helpers/handleHttpMethods";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import { Formik } from "formik";
import useTranslation from "next-translate/useTranslation";
import { memo, useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSWRConfig } from "swr";
import * as Yup from "yup";

/**
 * Custom function to render the `PersonalSettingsForm` component
 */
const PersonalSettingsForm = () => {
	const [disableForm, setDisableForm] = useState(true);
	const [username, setUsername] = useState("");
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [email, setEmail] = useState("");
	const [settings, setSettings] = useState({});
	const [largePageSizeThreshold, setLargePageSizeThreshold] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Translations
	const { t } = useTranslation();
	const saving = t("common:saving");
	const saveChanges = t("common:save");
	const firstNameText = t("common:firstName");
	const lastNameText = t("common:lastName");
	const userNameText = t("common:userName");
	const emailText = t("common:emailAddress");
	const updateText = t("common:update");
	const requiredField = t("common:requiredField");
	const tooShort = t("common:tooShort");
	const tooLong = t("common:tooLong");
	const cancelText = t("common:cancel");

	// Custom context
	const { isComponentReady, setConfig, user, state } = useContext(SiteCrawlerAppContext);

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// Load `user` data from the API
	useEffect(() => {
		let initialFirstName = user?.data?.first_name ?? "";
		let initialLastName = user?.data?.last_name ?? "";
		let initialUsername = user?.data?.username ?? "";
		let initialEmail = user?.data?.email ?? "";
		let initialSettings = user?.data?.settings ?? {};
		let initialLargePageSizeThreshold = user?.data?.large_page_size_threshold ?? null;

		if (initialFirstName !== "" && initialLastName !== "" && initialUsername !== "" && initialEmail !== "") {
			setFirstname(initialFirstName);
			setLastname(initialLastName);
			setUsername(initialUsername);
			setEmail(initialEmail);
			setSettings(initialSettings);
			setLargePageSizeThreshold(initialLargePageSizeThreshold);
		}

		return { firstname, lastname, username, email, settings, largePageSizeThreshold };
	}, [user]);

	return (
		<Formik
			enableReinitialize={true}
			initialValues={{
				username: username,
				firstname: firstname,
				lastname: lastname,
				email: email,
				settings: settings,
				largePageSizeThreshold: largePageSizeThreshold
			}}
			validationSchema={Yup.object().shape({
				username: Yup.string()
					.min(FormStringMinChars, tooShort)
					.max(FormStringMaxChars, tooLong)
					.required(requiredField),
				firstname: Yup.string()
					.min(FormStringMinChars, tooShort)
					.max(FormStringMaxChars, tooLong)
					.required(requiredField),
				lastname: Yup.string()
					.min(FormStringMinChars, tooShort)
					.max(FormStringMaxChars, tooLong)
					.required(requiredField)
			})}
			onSubmit={async (values, { resetForm }) => {
				setIsSubmitting(true);

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

				// Show alert message after successful 200 OK or 201 Created response is issued
				setConfig({
					isUser: true,
					method: personalSettingsResponseMethod,
					status: personalSettingsResponseStatus,
					isAlert: false,
					isNotification: false
				});

				const personalSettingsResponseTimeout = setTimeout(() => {
					if (personalSettingsResponseData && Math.round(personalSettingsResponseStatus / 200) === 1) {
						// Mutate `user` endpoint after successful 200 OK or 201 Created response is issued
						mutate(
							UserApiEndpoint,
							{ ...user, data: personalSettingsResponseData },
							{ optimisticData: user?.data, rollbackOnError: true, revalidate: true }
						);

						// Disable submission and disable form as soon as 200 OK or 201 Created response was issued
						setIsSubmitting(false);
						resetForm({ values: "" });
						setDisableForm(!disableForm);
					} else {
						// Disable submission as soon as 200 OK or 201 Created response was not issued
						setIsSubmitting(false);
					}
				}, NotificationDisplayInterval);

				return () => {
					clearTimeout(personalSettingsResponseTimeout);
				};
			}}
		>
			{({ errors, handleBlur, handleChange, handleSubmit, handleReset, values }) => (
				<form className="space-y-8" onSubmit={handleSubmit}>
					<div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4">
						<div className="sm:col-span-1">
							<label htmlFor="firstname" className="block text-sm font-medium leading-5 text-gray-700">
								{isComponentReady ? firstNameText : <Skeleton duration={2} width={150} height={20} />}
							</label>
							<div className="my-1">
								{isComponentReady ? (
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
										onChange={handleChange}
										onBlur={handleBlur}
									/>
								) : (
									<Skeleton duration={2} height={38} />
								)}

								{errors.firstname ? (
									<span className="mt-2 block text-xs leading-5 text-red-700">{errors.firstname}</span>
								) : null}
							</div>
						</div>

						<div className="sm:col-span-1">
							<label htmlFor="lastname" className="block text-sm font-medium leading-5 text-gray-700">
								{isComponentReady ? lastNameText : <Skeleton duration={2} width={150} height={20} />}
							</label>
							<div className="my-1">
								{isComponentReady ? (
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
										onChange={handleChange}
										onBlur={handleBlur}
									/>
								) : (
									<Skeleton duration={2} height={38} />
								)}

								{errors.lastname ? (
									<span className="mt-2 block text-xs leading-5 text-red-700">{errors.lastname}</span>
								) : null}
							</div>
						</div>

						<div className="sm:col-span-1">
							<label htmlFor="username" className="block text-sm font-medium leading-5 text-gray-700">
								{isComponentReady ? userNameText : <Skeleton duration={2} width={150} height={20} />}
							</label>
							<div className="my-1">
								{isComponentReady ? (
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
										onChange={handleChange}
										onBlur={handleBlur}
									/>
								) : (
									<Skeleton duration={2} height={38} />
								)}
							</div>

							{errors.username ? (
								<span className="mt-2 block text-xs leading-5 text-red-700">{errors.username}</span>
							) : null}
						</div>

						<div className="sm:col-span-1">
							<label htmlFor="email" className="block text-sm font-medium leading-5 text-gray-700">
								{isComponentReady ? emailText : <Skeleton duration={2} width={150} height={20} />}
							</label>
							<div className="mt-1 rounded-md shadow-sm">
								{isComponentReady ? (
									<input
										id="email"
										type="email"
										value={values.email}
										disabled={true}
										className="block w-full cursor-not-allowed rounded-md border-gray-300 bg-gray-300 opacity-50 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
										aria-describedby="email"
										onChange={handleChange}
									/>
								) : (
									<Skeleton duration={2} height={38} />
								)}
							</div>
						</div>

						{state?.isUser && state?.responses?.length > 0 ? (
							<div className="sm:col-span-1">
								<div className="relative mt-1">
									{state.responses.map((value, key) => {
										// Alert Messsages
										const responseText = value.responseText;
										const isSuccess = value.isSuccess;

										return (
											<span
												key={key}
												className={classnames(
													"block break-words text-sm font-medium leading-5",
													isSuccess ? "text-green-800" : "text-red-800"
												)}
											>
												{responseText}
											</span>
										);
									})}
								</div>
							</div>
						) : null}

						<div className="sm:col-span-1">
							<div className="flex flex-col justify-between sm:flex-row md:flex-col lg:flex-row">
								<div className="order-1 flex justify-start sm:mr-1 sm:w-auto sm:flex-initial sm:flex-row lg:order-1 lg:w-full">
									<span className="inline-flex">
										{isComponentReady ? (
											!disableForm ? (
												<>
													<button
														type="button"
														disabled={isSubmitting || disableForm}
														className={classnames(
															"rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm",
															isSubmitting || disableForm
																? "cursor-not-allowed opacity-50"
																: "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
														)}
														onClick={(e) => {
															handleReset();
															setDisableForm(!disableForm);
														}}
													>
														{cancelText}
													</button>

													<button
														type="submit"
														disabled={
															isSubmitting ||
															Object.keys(errors).length > 0 ||
															!(
																disableForm ||
																values.firstname !== firstname ||
																values.lastname !== lastname ||
																values.username !== username
															)
														}
														aria-disabled={
															isSubmitting ||
															Object.keys(errors).length > 0 ||
															!(
																disableForm ||
																values.firstname !== firstname ||
																values.lastname !== lastname ||
																values.username !== username
															)
														}
														aria-hidden={
															isSubmitting ||
															Object.keys(errors).length > 0 ||
															!(
																disableForm ||
																values.firstname !== firstname ||
																values.lastname !== lastname ||
																values.username !== username
															)
														}
														className={classnames(
															"ml-3 inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm",
															isSubmitting ||
																Object.keys(errors).length > 0 ||
																!(disableForm,
																values.firstname !== firstname ||
																	values.lastname !== lastname ||
																	values.username !== username)
																? "cursor-not-allowed opacity-50"
																: "hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
														)}
													>
														{isSubmitting ? saving : saveChanges}
													</button>
												</>
											) : (
												<button
													type="button"
													disabled={!disableForm}
													className={classnames(
														"relative mt-3 mr-3 inline-flex w-full items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium leading-5 text-white sm:mt-0",
														!disableForm
															? "cursor-not-allowed opacity-50"
															: "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
													)}
													onClick={(e) => {
														handleReset();
														setDisableForm(!disableForm);
													}}
												>
													{updateText}
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

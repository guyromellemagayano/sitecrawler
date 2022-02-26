import { PasswordChangeApiEndpoint, UserApiEndpoint } from "@constants/ApiEndpoints";
import { handlePostMethod } from "@helpers/handleHttpMethods";
import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classNames } from "@utils/classNames";
import { Formik } from "formik";
import useTranslation from "next-translate/useTranslation";
import { memo, useContext, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import PasswordStrengthBar from "react-password-strength-bar";
import { useSWRConfig } from "swr";
import * as Yup from "yup";

/**
 * Custom function to render the `PasswordSettingsForm` component
 */
const PasswordSettingsForm = () => {
	const [disableForm, setDisableForm] = useState(true);

	// Translations
	const { t } = useTranslation();
	const saveChanges = t("settings:saveChanges");
	const saving = t("settings:saving");
	const newPassword = t("common:newPassword");
	const confirmPassword = t("common:confirmPassword");
	const update = t("common:update");
	const requiredField = t("common:requiredField");
	const tooShort = t("common:tooShort");
	const tooLong = t("common:tooLong");
	const bothPasswordsNeedSame = t("common:bothPasswordsNeedSame");

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// Custom context
	const { isComponentReady, setConfig } = useContext(SiteCrawlerAppContext);

	// SWR hooks
	const { user } = useUser();

	return (
		<Formik
			initialValues={{
				password1: "",
				password2: ""
			}}
			validationSchema={Yup.object().shape({
				password1: Yup.string().min(10, tooShort).max(128, tooLong).required(requiredField),
				password2: Yup.string()
					.when("password1", {
						is: (val) => val && val.length > 0,
						then: Yup.string().oneOf([Yup.ref("password1")], bothPasswordsNeedSame)
					})
					.required(requiredField)
			})}
			onSubmit={async (values, { setSubmitting, resetForm }) => {
				const body = {
					new_password1: values.password1,
					new_password2: values.password2
				};

				const passwordSettingsResponse = await handlePostMethod(PasswordChangeApiEndpoint, body);
				const passwordSettingsResponseData = passwordSettingsResponse?.data ?? null;
				const passwordSettingsResponseStatus = passwordSettingsResponse?.status ?? null;
				const passwordSettingsResponseMethod = passwordSettingsResponse?.config?.method ?? null;

				if (passwordSettingsResponseData !== null && Math.round(passwordSettingsResponseStatus / 200) === 1) {
					// Disable submission, reset, and disable form as soon as 200 OK or 201 Created response was issued
					setSubmitting(false);
					resetForm({ values: "" });
					setDisableForm(!disableForm);

					// Show alert message after successful 200 OK or 201 Created response is issued
					setConfig({
						isPasswordChange: true,
						method: passwordSettingsResponseMethod,
						status: passwordSettingsResponseStatus
					});

					// Mutate `user` endpoint after successful 200 OK or 201 Created response is issued
					mutate(UserApiEndpoint);
				} else {
					// Disable submission, reset, and disable form as soon as 200 OK or 201 Created response was not issued
					setSubmitting(false);
					resetForm({ values: "" });
					setDisableForm(!disableForm);

					// Show alert message after successful 200 OK or 201 Created response is issued
					setConfig({
						isPasswordChange: true,
						method: passwordSettingsResponseMethod,
						status: passwordSettingsResponseStatus
					});
				}
			}}
		>
			{({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
				<form className="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit}>
					<div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4">
						<div className="sm:col-span-1">
							<label htmlFor="password1" className="block text-sm font-medium leading-5 text-gray-700">
								{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
									newPassword
								) : (
									<Skeleton duration={2} width={150} height={20} />
								)}
							</label>
							<div className="relative mt-1 flex rounded-md shadow-sm">
								{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
									<input
										type="password"
										id="password1"
										value={values.password1}
										autoComplete="current-password"
										name="password1"
										disabled={isSubmitting || disableForm}
										className={classNames(
											"block w-full rounded-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
											isSubmitting || disableForm ? "cursor-not-allowed bg-gray-300 opacity-50" : null,
											errors.password1 ? "border-red-300" : "border-gray-300"
										)}
										aria-describedby="password1"
										onChange={handleChange}
										onBlur={handleBlur}
									/>
								) : (
									<Skeleton duration={2} width={360} height={38} />
								)}
							</div>
							<div className={classNames(!disableForm ? "block" : "hidden")}>
								<PasswordStrengthBar className="w-full" password={values.password1} />
							</div>

							{errors.password1 || touched.password1 ? (
								<span className="mt-2 block text-xs leading-5 text-red-700">
									{errors.password1 || touched.password1}
								</span>
							) : null}
						</div>

						<div className="sm:col-span-1">
							<label htmlFor="password2" className="block text-sm font-medium leading-5 text-gray-700">
								{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
									confirmPassword
								) : (
									<Skeleton duration={2} width={150} height={20} />
								)}
							</label>
							<div className="relative mt-1 flex rounded-md shadow-sm">
								{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
									<input
										type="password"
										id="password2"
										value={values.password2}
										name="password2"
										disabled={isSubmitting || disableForm}
										className={classNames(
											"block w-full rounded-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
											(isSubmitting || disableForm) && "cursor-not-allowed bg-gray-300 opacity-50",
											errors.password2 ? "border-red-300" : "border-gray-300"
										)}
										aria-describedby="password2"
										onChange={handleChange}
										onBlur={handleBlur}
									/>
								) : (
									<Skeleton duration={2} width={360} height={38} />
								)}
							</div>

							{errors.password2 || touched.password2 ? (
								<span className="mt-2 block text-xs leading-5 text-red-700">
									{errors.password2 || touched.password2}
								</span>
							) : null}
						</div>

						<div className="sm:col-span-1">
							<div className="flex flex-col justify-between sm:flex-row md:flex-col lg:flex-row">
								<div className="order-1 flex justify-start sm:mr-1 sm:w-auto sm:flex-initial sm:flex-row lg:order-1 lg:w-full">
									<span className="inline-flex">
										{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
											!disableForm ? (
												<button
													type="submit"
													disabled={
														isSubmitting ||
														Object.keys(errors).length > 0 ||
														(values.password1 === "" && values.password2 === "")
													}
													className={classNames(
														"relative mt-3 mr-3 inline-flex w-full items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium leading-5 text-white sm:mt-0",
														isSubmitting ||
															Object.keys(errors).length > 0 ||
															(values.password1 === "" && values.password2 === "")
															? "cursor-not-allowed opacity-50"
															: "hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
													)}
												>
													{isSubmitting ? saving : !disableForm ? saveChanges : update}
												</button>
											) : (
												<button
													type="button"
													disabled={isSubmitting || Object.keys(errors).length > 0}
													className={classNames(
														"relative mt-3 mr-3 inline-flex w-full items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium leading-5 text-white sm:mt-0",
														isSubmitting || Object.keys(errors).length > 0
															? "cursor-not-allowed opacity-50"
															: "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
													)}
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
												className="relative mt-3 mr-3 inline-flex w-full items-center px-4 py-2 sm:mt-0"
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
 * Memoized custom `PasswordSettingsForm` component
 */
export const MemoizedPasswordSettingsForm = memo(PasswordSettingsForm);

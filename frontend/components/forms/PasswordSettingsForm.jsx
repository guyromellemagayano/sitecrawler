import { MemoizedAlert } from "@components/alerts";
import { PasswordChangeApiEndpoint, UserApiEndpoint } from "@constants/ApiEndpoints";
import { handlePostMethod } from "@helpers/handleHttpMethods";
import { useAlertMessage } from "@hooks/useAlertMessage";
import { useLoading } from "@hooks/useLoading";
import { Formik } from "formik";
import useTranslation from "next-translate/useTranslation";
import { memo, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import PasswordStrengthBar from "react-password-strength-bar";
import { useSWRConfig } from "swr";
import tw from "twin.macro";
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

	// Custom hooks
	const { isComponentReady } = useLoading();
	const { state, setConfig } = useAlertMessage();

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
						await mutate(UserApiEndpoint, false);
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
					<form tw="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit}>
						<div tw="mt-6 grid grid-cols-1 gap-y-6 gap-x-4">
							<div tw="sm:col-span-1">
								<label htmlFor="password1" tw="block text-sm font-medium leading-5 text-gray-700">
									{isComponentReady ? newPassword : <Skeleton duration={2} width={150} height={20} />}
								</label>
								<div tw="mt-1 relative flex rounded-md shadow-sm">
									{isComponentReady ? (
										<input
											type="password"
											id="password1"
											value={values.password1}
											autoComplete="current-password"
											name="password1"
											disabled={isSubmitting || disableForm}
											css={[
												tw`focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm`,
												(isSubmitting || disableForm) && tw`opacity-50 bg-gray-300 cursor-not-allowed`,
												errors.password1 ? tw`border-red-300` : tw`border-gray-300`
											]}
											aria-describedby="password1"
											onChange={handleChange}
											onBlur={handleBlur}
										/>
									) : (
										<Skeleton duration={2} width={360} height={38} />
									)}
								</div>
								<div css={[!disableForm ? tw`block` : tw`hidden`]}>
									<PasswordStrengthBar className="w-full" password={values.password1} />
								</div>

								{errors.password1 || touched.password1 ? (
									<span tw="block mt-2 text-xs leading-5 text-red-700">{errors.password1 || touched.password1}</span>
								) : null}
							</div>

							<div tw="sm:col-span-1">
								<label htmlFor="password2" tw="block text-sm font-medium leading-5 text-gray-700">
									{isComponentReady ? confirmPassword : <Skeleton duration={2} width={150} height={20} />}
								</label>
								<div tw="mt-1 relative flex rounded-md shadow-sm">
									{isComponentReady ? (
										<input
											type="password"
											id="password2"
											value={values.password2}
											name="password2"
											disabled={isSubmitting || disableForm}
											css={[
												tw`focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm`,
												(isSubmitting || disableForm) && tw`opacity-50 bg-gray-300 cursor-not-allowed`,
												errors.password2 ? tw`border-red-300` : tw`border-gray-300`
											]}
											aria-describedby="password2"
											onChange={handleChange}
											onBlur={handleBlur}
										/>
									) : (
										<Skeleton duration={2} width={360} height={38} />
									)}
								</div>

								{errors.password2 || touched.password2 ? (
									<span tw="block mt-2 text-xs leading-5 text-red-700">{errors.password2 || touched.password2}</span>
								) : null}
							</div>

							<div tw="sm:col-span-1">
								<div tw="flex justify-between flex-col sm:flex-row md:flex-col lg:flex-row">
									<div tw="flex justify-start order-1 sm:flex-row sm:flex-initial sm:w-auto sm:mr-1 lg:order-1 lg:w-full">
										<span tw="inline-flex">
											{isComponentReady ? (
												!disableForm ? (
													<button
														type="submit"
														disabled={
															isSubmitting ||
															Object.keys(errors).length > 0 ||
															(values.password1 === "" && values.password2 === "")
														}
														css={[
															tw`w-full mt-3 mr-3 sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600`,
															isSubmitting ||
															Object.keys(errors).length > 0 ||
															(values.password1 === "" && values.password2 === "")
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
		</>
	);
};

/**
 * Memoized custom `PasswordSettingsForm` component
 */
export const MemoizedPasswordSettingsForm = memo(PasswordSettingsForm);

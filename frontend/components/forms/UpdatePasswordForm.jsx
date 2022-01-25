/* eslint-disable no-prototype-builtins */
import { MemoizedAlert } from "@components/alerts";
import { ConfirmResetPasswordApiEndpoint, UserApiEndpoint } from "@constants/ApiEndpoints";
import { FormPasswordMaxChars, FormPasswordMinChars } from "@constants/GlobalValues";
import { handlePostMethod } from "@helpers/handleHttpMethods";
import { useAlertMessage } from "@hooks/useAlertMessage";
import { Formik } from "formik";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { memo, useEffect, useState } from "react";
import PasswordStrengthBar from "react-password-strength-bar";
import { useSWRConfig } from "swr";
import tw from "twin.macro";
import * as Yup from "yup";

/**
 * Custom function to render the `UpdatePasswordForm` component
 */
const UpdatePasswordForm = () => {
	const [uid, setUid] = useState(null);
	const [token, setToken] = useState(null);

	// Translations
	const { t } = useTranslation();
	const bothPasswordsNeedSame = t("common:bothPasswordsNeedSame");
	const isResetPassword = t("common:isResetPassword");
	const password = t("common:password");
	const repeatPassword = t("common:repeatPassword");
	const requiredField = t("common:requiredField");
	const submitting = t("common:submitting");
	const tooLong = t("common:tooLong");
	const tooShort = t("common:tooShort");

	// Router
	const { query } = useRouter();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// Custom hooks
	const { state, setConfig } = useAlertMessage();

	// Set the `uid` and `token` from the URL query parameters
	useEffect(() => {
		const hasKeyProperty = query?.hasOwnProperty("id") ? true : false;

		if (Object.keys(query).length > 0 && hasKeyProperty) {
			setUid(query?.id[0] ?? null);
			setToken(query?.id[1] ?? null);
		}
	}, [query]);

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
					password2: "",
					uid: uid,
					token: token
				}}
				validationSchema={Yup.object({
					password1: Yup.string()
						.min(FormPasswordMinChars, tooShort)
						.max(FormPasswordMaxChars, tooLong)
						.required(requiredField),
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
						new_password2: values.password2,
						uid: uid,
						token: token
					};

					const updatePasswordResponse = await handlePostMethod(ConfirmResetPasswordApiEndpoint, body);
					const updatePasswordResponseData = updatePasswordResponse?.data ?? null;
					const updatePasswordResponseStatus = updatePasswordResponse?.status ?? null;
					const updatePasswordResponseMethod = updatePasswordResponse?.config?.method ?? null;

					if (updatePasswordResponseData !== null && Math.round(updatePasswordResponseStatus / 200) === 1) {
						// Disable submission and reset form as soon as 200 OK or 201 Created response was not issued
						setSubmitting(false);
						resetForm({ values: "" });

						// Mutate `user` endpoint after successful 200 OK or 201 Created response is issued
						await mutate(UserApiEndpoint, false);

						// Show alert message after successful 200 OK or 201 Created response is issued
						setConfig({
							isPasswordResetConfirm: true,
							method: updatePasswordResponseMethod,
							status: updatePasswordResponseStatus
						});
					} else {
						// Disable submission and reset form as soon as 200 OK or 201 Created response was not issued
						setSubmitting(false);
						resetForm({ values: "" });

						// Show alert message after successful 200 OK or 201 Created response is issued
						setConfig({
							isPasswordResetConfirm: true,
							method: updatePasswordResponseMethod,
							status: updatePasswordResponseStatus
						});
					}
				}}
			>
				{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
					<form onSubmit={handleSubmit}>
						<div tw="mt-1">
							<label htmlFor="password1" tw="block text-sm font-medium leading-5 text-gray-700">
								{password}
							</label>
							<div tw="mt-1 rounded-md shadow-sm">
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
									onBlur={handleBlur}
									value={values.password1}
								/>
							</div>
							<PasswordStrengthBar password={values.password1} />

							{errors.password1 || touched.password1 ? (
								<span tw="block mt-2 text-xs leading-5 text-red-700">{errors.password1 || touched.password1}</span>
							) : null}
						</div>

						<div tw="mt-6">
							<label htmlFor="password2" tw="block text-sm font-medium text-gray-700">
								{repeatPassword}
							</label>
							<div tw="mt-1 rounded-md">
								<input
									id="password2"
									type="password"
									name="password2"
									disabled={isSubmitting}
									css={[
										tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md sm:leading-5`,
										isSubmitting && tw`opacity-50 bg-gray-300 cursor-not-allowed pointer-events-none`,
										errors.password2 ? tw`border-red-300` : tw`border-gray-300`
									]}
									aria-describedby="password2"
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.password2}
								/>
							</div>

							{errors.password2 || touched.password2 ? (
								<span tw="block mt-2 text-xs leading-5 text-red-700">{errors.password2 || touched.password2}</span>
							) : null}
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
									{isSubmitting ? submitting : isResetPassword}
								</button>
							</span>
						</div>
					</form>
				)}
			</Formik>
		</>
	);
};

/**
 * Memoized custom `UpdatePasswordForm` component
 */
export const MemoizedUpdatePasswordForm = memo(UpdatePasswordForm);

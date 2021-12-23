/* eslint-disable jsx-a11y/anchor-is-valid */
import { MemoizedAlert } from "@components/alerts";
import { ResetPasswordApiEndpoint } from "@constants/ApiEndpoints";
import { handlePostMethod } from "@helpers/handleHttpMethods";
import { useAlertMessage } from "@hooks/useAlertMessage";
import { Formik } from "formik";
import useTranslation from "next-translate/useTranslation";
import { memo } from "react";
import tw from "twin.macro";
import * as Yup from "yup";

/**
 * Memoized function to render the `ResetPasswordForm` component.
 */
export function ResetPasswordForm() {
	// Translations
	const { t } = useTranslation();
	const requiredField = t("common:requiredField");
	const invalidEmail = t("common:invalidEmail");
	const emailAddress = t("common:emailAddress");
	const isResetPassword = t("common:isResetPassword");
	const submitting = t("common:submitting");

	// Custom hooks
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
					email: ""
				}}
				validationSchema={Yup.object({
					email: Yup.string().email(invalidEmail).required(requiredField)
				})}
				onSubmit={async (values, { setSubmitting, resetForm }) => {
					const body = {
						email: values.email
					};

					const resetPasswordResponse = await handlePostMethod(ResetPasswordApiEndpoint, body);
					const resetPasswordResponseData = resetPasswordResponse?.data ?? null;
					const resetPasswordResponseStatus = resetPasswordResponse?.status ?? null;
					const resetPasswordResponseMethod = resetPasswordResponse?.config?.method ?? null;

					if (resetPasswordResponseData !== null && Math.round(resetPasswordResponseStatus / 200) === 1) {
						// Disable submission and reset form as soon as 200 OK or 201 Created response was not issued
						setSubmitting(false);
						resetForm({ values: "" });

						// Show alert message after successful 200 OK or 201 Created response is issued
						setConfig({
							isPasswordReset: true,
							method: resetPasswordResponseMethod,
							status: resetPasswordResponseStatus
						});
					} else {
						// Disable submission and reset form as soon as 200 OK or 201 Created response was not issued
						setSubmitting(false);
						resetForm({ values: "" });

						// Show alert message after successful 200 OK or 201 Created response is issued
						setConfig({
							isPasswordReset: true,
							method: resetPasswordResponseMethod,
							status: resetPasswordResponseStatus
						});
					}
				}}
			>
				{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
					<form onSubmit={handleSubmit}>
						<div tw="mt-1">
							<label htmlFor="email" tw="block text-sm font-medium leading-5 text-gray-700">
								{emailAddress}
							</label>
							<div tw="mt-1 rounded-md shadow-sm">
								<input
									id="email"
									type="email"
									name="email"
									disabled={isSubmitting}
									css={[
										tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md`,
										isSubmitting && tw`opacity-50 bg-gray-300 cursor-not-allowed pointer-events-none`,
										errors.email ? tw`border-red-300` : tw`border-gray-300`
									]}
									aria-describedby="email"
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.email}
								/>
							</div>

							{errors.email && touched.email && (
								<span tw="block mt-2 text-xs leading-5 text-red-700">
									{errors.email && touched.email && errors.email}
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
									{isSubmitting ? submitting : isResetPassword}
								</button>
							</span>
						</div>
					</form>
				)}
			</Formik>
		</>
	);
}

/**
 * Memoized custom `ResetPasswordForm` component
 */
export const MemoizedResetPasswordForm = memo(ResetPasswordForm);

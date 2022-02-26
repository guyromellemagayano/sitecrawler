import { ResetPasswordApiEndpoint } from "@constants/ApiEndpoints";
import { handlePostMethod } from "@helpers/handleHttpMethods";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import { Formik } from "formik";
import useTranslation from "next-translate/useTranslation";
import { memo, useContext } from "react";
import * as Yup from "yup";

/**
 * Memoized function to render the `ResetPasswordForm` component.
 */
const ResetPasswordForm = () => {
	// Translations
	const { t } = useTranslation();
	const requiredField = t("common:requiredField");
	const invalidEmail = t("common:invalidEmail");
	const emailAddress = t("common:emailAddress");
	const isResetPassword = t("common:isResetPassword");
	const submitting = t("common:submitting");

	// Custom context
	const { setConfig } = useContext(SiteCrawlerAppContext);

	return (
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
					<div className="mt-1">
						<label htmlFor="email" className="block text-sm font-medium leading-5 text-gray-700">
							{emailAddress}
						</label>
						<div className="mt-1 rounded-md shadow-sm">
							<input
								id="email"
								type="email"
								name="email"
								disabled={isSubmitting}
								className={classnames(
									"block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
									isSubmitting && "pointer-events-none cursor-not-allowed bg-gray-300 opacity-50",
									errors.email ? "border-red-300" : "border-gray-300"
								)}
								aria-describedby="email"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.email}
							/>
						</div>

						{errors.email && touched.email && (
							<span className="mt-2 block text-xs leading-5 text-red-700">
								{errors.email && touched.email && errors.email}
							</span>
						)}
					</div>

					<div className="mt-6">
						<span className="block w-full rounded-md shadow-sm">
							<button
								type="submit"
								disabled={isSubmitting}
								className={classnames(
									"flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm",
									isSubmitting
										? "pointer-events-none cursor-not-allowed bg-indigo-300 opacity-50"
										: "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
								)}
							>
								{isSubmitting ? submitting : isResetPassword}
							</button>
						</span>
					</div>
				</form>
			)}
		</Formik>
	);
};

/**
 * Memoized custom `ResetPasswordForm` component
 */
export const MemoizedResetPasswordForm = memo(ResetPasswordForm);

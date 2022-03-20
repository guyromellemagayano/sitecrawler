/* eslint-disable no-prototype-builtins */
import { ConfirmResetPasswordApiEndpoint, UserApiEndpoint } from "@constants/ApiEndpoints";
import { FormPasswordMaxChars, FormPasswordMinChars } from "@constants/GlobalValues";
import { handlePostMethod } from "@helpers/handleHttpMethods";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import { Formik } from "formik";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { memo, useContext, useEffect, useState } from "react";
import PasswordStrengthBar from "react-password-strength-bar";
import { useSWRConfig } from "swr";
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

	// Custom context
	const { setConfig } = useContext(SiteCrawlerAppContext);

	// Set the "uid" and "token" from the URL query parameters
	useEffect(() => {
		const hasKeyProperty = query?.hasOwnProperty("id") ? true : false;

		if (Object.keys(query).length > 0 && hasKeyProperty) {
			setUid(query?.id[0] ?? null);
			setToken(query?.id[1] ?? null);
		}
	}, [query]);

	return (
		<Formik
			initialValues={{
				password1: "",
				password2: "",
				uid: uid,
				token: token
			}}
			validationSchema={Yup.object().shape({
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
					mutate(UserApiEndpoint);

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
					<div className="mt-1">
						<label htmlFor="password1" className="block text-sm font-medium leading-5 text-gray-700">
							{password}
						</label>
						<div className="mt-1 rounded-md shadow-sm">
							<input
								id="password1"
								type="password"
								name="password1"
								disabled={isSubmitting}
								className={classnames(
									"block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
									isSubmitting && "pointer-events-none cursor-not-allowed bg-gray-300 opacity-50",
									errors.password1 ? "border-red-300" : "border-gray-300"
								)}
								aria-describedby="password1"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.password1}
							/>
						</div>
						<PasswordStrengthBar password={values.password1} />

						{errors.password1 || touched.password1 ? (
							<span className="mt-2 block text-xs leading-5 text-red-700">{errors.password1 || touched.password1}</span>
						) : null}
					</div>

					<div className="mt-6">
						<label htmlFor="password2" className="block text-sm font-medium text-gray-700">
							{repeatPassword}
						</label>
						<div className="mt-1 rounded-md">
							<input
								id="password2"
								type="password"
								name="password2"
								disabled={isSubmitting}
								className={classnames(
									"block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm sm:leading-5",
									isSubmitting && "pointer-events-none cursor-not-allowed bg-gray-300 opacity-50",
									errors.password2 ? "border-red-300" : "border-gray-300"
								)}
								aria-describedby="password2"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.password2}
							/>
						</div>

						{errors.password2 || touched.password2 ? (
							<span className="mt-2 block text-xs leading-5 text-red-700">{errors.password2 || touched.password2}</span>
						) : null}
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
 * Memoized custom `UpdatePasswordForm` component
 */
export const MemoizedUpdatePasswordForm = memo(UpdatePasswordForm);

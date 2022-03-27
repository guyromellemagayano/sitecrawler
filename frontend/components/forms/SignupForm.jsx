/* eslint-disable no-prototype-builtins */
import { SignupApiEndpoint, UserApiEndpoint } from "@constants/ApiEndpoints";
import { FormPasswordMaxChars, FormPasswordMinChars, RedirectInterval } from "@constants/GlobalValues";
import { ConfirmSlug, DashboardSitesLink } from "@constants/PageLinks";
import { handlePostMethod } from "@helpers/handleHttpMethods";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import { Formik } from "formik";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { memo, useCallback, useContext, useEffect, useState } from "react";
import PasswordStrengthBar from "react-password-strength-bar";
import { useSWRConfig } from "swr";
import * as Yup from "yup";

/**
 * Custom function to render the `SignupForm` component
 */
const SignupForm = () => {
	const [uid, setUid] = useState(null);

	// Router
	const { query, push } = useRouter();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// Translations
	const { t } = useTranslation();
	const bothPasswordsNeedSame = t("common:bothPasswordsNeedSame");
	const completeSignup = t("signup:completeSignup");
	const password = t("common:password");
	const repeatPassword = t("common:repeatPassword");
	const requiredField = t("common:requiredField");
	const submitting = t("common:submitting");
	const tooLong = t("common:tooLong");
	const tooShort = t("common:tooShort");

	// Custom context
	const { setConfig, user } = useContext(SiteCrawlerAppContext);

	// Set the "uid" and "token" from the URL query parameters
	const handleUid = useCallback(async () => {
		const hasKeyProperty = query?.hasOwnProperty("id") ? true : false;

		if (Object.keys(query).length > 0 && hasKeyProperty) {
			setUid(query?.id[0]);
		}
	}, [query]);

	useEffect(() => {
		handleUid();
	}, [handleUid]);

	// Complete signup API endpoint
	let SignupConfirmApiEndpoint = SignupApiEndpoint + uid + ConfirmSlug;

	return (
		<Formik
			initialValues={{
				password: "",
				repeatPassword: ""
			}}
			validationSchema={Yup.object().shape({
				password: Yup.string()
					.min(FormPasswordMinChars, tooShort)
					.max(FormPasswordMaxChars, tooLong)
					.required(requiredField),
				repeatPassword: Yup.string()
					.when("password", {
						is: (val) => val && val.length > 0,
						then: Yup.string().oneOf([Yup.ref("password")], bothPasswordsNeedSame)
					})
					.required(requiredField)
			})}
			onSubmit={async (values, { setSubmitting, resetForm }) => {
				const body = {
					password: values.password
				};

				const signupResponse = await handlePostMethod(SignupConfirmApiEndpoint, body);
				const signupResponseData = signupResponse?.data ?? null;
				const signupResponseStatus = signupResponse?.status ?? null;
				const signupResponseMethod = signupResponse?.config?.method ?? null;

				if (signupResponseData !== null && Math.round(signupResponseStatus / 200) === 1) {
					// Disable submission and reset form as soon as 200 OK or 201 Created response was not issued
					setSubmitting(false);
					resetForm({ values: "" });

					// Mutate "user" endpoint after successful 200 OK or 201 Created response is issued
					mutate(UserApiEndpoint, null, { optimisticData: user?.data, rollbackOnError: true, revalidate: true });

					// Show alert message after successful 200 OK or 201 Created response is issued
					setConfig({
						isPasswordChange: true,
						method: signupResponseMethod,
						status: signupResponseStatus
					});

					// Redirect to sites dashboard page after successful 200 OK response is established
					setTimeout(() => {
						push(DashboardSitesLink);
					}, RedirectInterval);
				} else {
					// Disable submission and reset form as soon as 200 OK or 201 Created response was not issued
					setSubmitting(false);
					resetForm({ values: "" });

					// Show alert message after successful 200 OK or 201 Created response is issued
					setConfig({
						isPasswordChange: true,
						method: signupResponseMethod,
						status: signupResponseStatus
					});
				}
			}}
		>
			{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
				<form onSubmit={handleSubmit}>
					<div className="mt-1">
						<label htmlFor="password" className="block text-sm font-medium leading-5 text-gray-700">
							{password}
						</label>
						<div className="mt-1">
							<input
								id="password"
								type="password"
								name="password"
								disabled={isSubmitting}
								className={classnames(
									"block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
									isSubmitting && "cursor-not-allowed bg-gray-300 opacity-50",
									errors.password ? "border-red-300" : "border-gray-300"
								)}
								aria-describedby="password"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.password}
							/>
							<PasswordStrengthBar password={values.password} />
						</div>

						{errors.password || touched.password ? (
							<span className="mt-2 block text-xs leading-5 text-red-700">{errors.password || touched.password}</span>
						) : null}
					</div>

					<div className="mt-6">
						<label htmlFor="repeatPassword" className="block text-sm font-medium leading-5 text-gray-700">
							{repeatPassword}
						</label>
						<div className="mt-1">
							<input
								id="repeatPassword"
								type="password"
								name="repeatPassword"
								disabled={isSubmitting}
								className={classnames(
									"block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
									isSubmitting && "cursor-not-allowed bg-gray-300 opacity-50",
									errors.repeatPassword ? "border-red-300" : "border-gray-300"
								)}
								aria-describedby="repeatPassword"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.repeatPassword}
							/>
						</div>

						{errors.repeatPassword || touched.repeatPassword ? (
							<span className="mt-2 block text-xs leading-5 text-red-700">
								{errors.repeatPassword || touched.repeatPassword}
							</span>
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
								{isSubmitting ? submitting : completeSignup}
							</button>
						</span>
					</div>
				</form>
			)}
		</Formik>
	);
};

/**
 * Memoized custom `SignupForm` component
 */
export const MemoizedSignupForm = memo(SignupForm);

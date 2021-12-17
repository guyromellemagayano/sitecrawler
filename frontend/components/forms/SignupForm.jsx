/* eslint-disable no-prototype-builtins */
import { MemoizedAlert } from "@components/alerts";
import { SignupApiEndpoint, UserApiEndpoint } from "@constants/ApiEndpoints";
import { FormPasswordMaxChars, FormPasswordMinChars, RedirectInterval } from "@constants/GlobalValues";
import { ConfirmSlug, DashboardSitesLink } from "@constants/PageLinks";
import { handlePostMethod } from "@helpers/handleHttpMethods";
import { useAlertMessage } from "@hooks/useAlertMessage";
import { Formik } from "formik";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useState } from "react";
import PasswordStrengthBar from "react-password-strength-bar";
import { useSWRConfig } from "swr";
import tw from "twin.macro";
import * as Yup from "yup";

/**
 * Custom function to render the `SignupForm` component
 */
export function SignupForm() {
	const [uid, setUid] = useState(null);

	// Router
	const { query } = useRouter();
	const router = useRouter();

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

	// Custom hooks
	const { state, setConfig } = useAlertMessage();

	// Set the `uid` and `token` from the URL query parameters
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

						// Mutate `user` endpoint after successful 200 OK or 201 Created response is issued
						await mutate(UserApiEndpoint, null, false);

						// Show alert message after successful 200 OK or 201 Created response is issued
						setConfig({
							isPasswordChange: true,
							method: signupResponseMethod,
							status: signupResponseStatus
						});

						// Redirect to sites dashboard page after successful 200 OK response is established
						setTimeout(() => {
							router.push(DashboardSitesLink);
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
						<div tw="mt-1">
							<label htmlFor="password" tw="block text-sm font-medium leading-5 text-gray-700">
								{password}
							</label>
							<div tw="mt-1">
								<input
									id="password"
									type="password"
									name="password"
									disabled={isSubmitting}
									css={[
										tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm`,
										isSubmitting && tw`opacity-50 bg-gray-300 cursor-not-allowed`,
										errors.password ? tw`border-red-300` : tw`border-gray-300`
									]}
									aria-describedby="password"
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.password}
								/>
								<PasswordStrengthBar password={values.password} />
							</div>

							{errors.password || touched.password ? (
								<span tw="block mt-2 text-xs leading-5 text-red-700">{errors.password || touched.password}</span>
							) : null}
						</div>

						<div tw="mt-6">
							<label htmlFor="repeatPassword" tw="block text-sm font-medium leading-5 text-gray-700">
								{repeatPassword}
							</label>
							<div tw="mt-1">
								<input
									id="repeatPassword"
									type="password"
									name="repeatPassword"
									disabled={isSubmitting}
									css={[
										tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm`,
										isSubmitting && tw`opacity-50 bg-gray-300 cursor-not-allowed`,
										errors.repeatPassword ? tw`border-red-300` : tw`border-gray-300`
									]}
									aria-describedby="repeatPassword"
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.repeatPassword}
								/>
							</div>

							{errors.repeatPassword || touched.repeatPassword ? (
								<span tw="block mt-2 text-xs leading-5 text-red-700">
									{errors.repeatPassword || touched.repeatPassword}
								</span>
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
									{isSubmitting ? submitting : completeSignup}
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
 * Memoized custom `SignupForm` component
 */
export const MemoizedSignupForm = memo(SignupForm);

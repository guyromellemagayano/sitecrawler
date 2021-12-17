import { MemoizedAlert } from "@components/alerts";
import { RegistrationApiEndpoint, UserApiEndpoint } from "@constants/ApiEndpoints";
import {
	FormPasswordMaxChars,
	FormPasswordMinChars,
	FormStringMaxChars,
	FormStringMinChars
} from "@constants/GlobalValues";
import { handlePostMethod } from "@helpers/handleHttpMethods";
import { useAlertMessage } from "@hooks/useAlertMessage";
import { Formik } from "formik";
import useTranslation from "next-translate/useTranslation";
import { memo } from "react";
import PasswordStrengthBar from "react-password-strength-bar";
import { useSWRConfig } from "swr";
import tw from "twin.macro";
import * as Yup from "yup";

/**
 * Custom function to render the `RegistrationForm` component
 */
export function RegistrationForm() {
	// Translations
	const { t } = useTranslation();
	const firstName = t("common:firstName");
	const lastName = t("common:lastName");
	const username = t("common:userName");
	const emailAddress = t("common:emailAddress");
	const password = t("common:password");
	const repeatPassword = t("common:repeatPassword");
	const requiredField = t("common:requiredField");
	const invalidEmail = t("common:invalidEmail");
	const tooShort = t("common:tooShort");
	const tooLong = t("common:tooLong");
	const submitting = t("common:submitting");
	const createAccount = t("registration:createAccount");
	const bothPasswordsNeedSame = t("common:bothPasswordsNeedSame");
	const registrationUsernameAlreadyExistsError = t("alerts:auth.registration.misc.usernameAlreadyExists");
	const registrationEmailAlreadyExistsError = t("alerts:auth.registration.misc.emailAlreadyExists");

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

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
					firstname: "",
					lastname: "",
					username: "",
					email: "",
					password1: "",
					password2: ""
				}}
				validationSchema={Yup.object({
					firstname: Yup.string().required(requiredField),
					lastname: Yup.string().required(requiredField),
					username: Yup.string()
						.min(FormStringMinChars, tooShort)
						.max(FormStringMaxChars, tooLong)
						.required(requiredField),
					email: Yup.string().email(invalidEmail).required(requiredField),
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
				onSubmit={async (values, { setSubmitting, resetForm, setErrors }) => {
					const body = {
						username: values.username,
						email: values.email,
						password1: values.password1,
						password2: values.password2,
						first_name: values.firstname,
						last_name: values.lastname
					};

					const registrationResponse = await handlePostMethod(RegistrationApiEndpoint, body);
					const registrationResponseData = registrationResponse?.data ?? null;
					const registrationResponseStatus = registrationResponse?.status ?? null;
					const registrationResponseMethod = registrationResponse?.config?.method ?? null;

					if (registrationResponseData !== null && Math.round(registrationResponseStatus / 200) === 1) {
						// Mutate `user` endpoint after successful 200 OK or 201 Created response is issued
						await mutate(UserApiEndpoint, null, false);

						// Disable submission and reset form as soon as 200 OK or 201 Created response is issued
						setSubmitting(false);
						resetForm({ values: "" });

						// Show alert message after successful 200 OK or 201 Created response is issued
						setConfig({
							isRegistration: true,
							method: registrationResponseMethod,
							status: registrationResponseStatus
						});
					} else {
						// Disable submission and reset form as soon as 200 OK or 201 Created response was not issued
						setSubmitting(false);

						// Show alert message after failed response is issued
						setConfig({
							isRegistration: true,
							method: registrationResponseMethod,
							status: registrationResponseStatus
						});

						registrationResponseData.username
							? setErrors({ username: registrationUsernameAlreadyExistsError })
							: registrationResponseData.email
							? setErrors({ email: registrationEmailAlreadyExistsError })
							: null;
					}
				}}
			>
				{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
					<form onSubmit={handleSubmit}>
						<div tw="mt-1">
							<label htmlFor="firstname" tw="block text-sm font-medium text-gray-700">
								{firstName}
							</label>
							<div tw="mt-1 rounded-md">
								<input
									id="firstname"
									type="text"
									name="firstname"
									disabled={isSubmitting}
									css={[
										tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md`,
										isSubmitting && tw`opacity-50 bg-gray-300 cursor-not-allowed pointer-events-none`,
										errors.firstname ? tw`border-red-300` : tw`border-gray-300`
									]}
									aria-describedby="firstname"
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.firstname}
								/>
							</div>

							{errors.firstname || touched.firstname ? (
								<span tw="block mt-2 text-xs leading-5 text-red-700">{errors.firstname || touched.firstname}</span>
							) : null}
						</div>

						<div tw="mt-6">
							<label htmlFor="lastname" tw="block text-sm font-medium text-gray-700">
								{lastName}
							</label>
							<div tw="mt-1 rounded-md">
								<input
									id="lastname"
									type="text"
									name="lastname"
									disabled={isSubmitting}
									css={[
										tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md`,
										isSubmitting && tw`opacity-50 bg-gray-300 cursor-not-allowed pointer-events-none`,
										errors.lastname ? tw`border-red-300` : tw`border-gray-300`
									]}
									aria-describedby="lastname"
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.lastname}
								/>
							</div>

							{errors.lastname || touched.lastname ? (
								<span tw="block mt-2 text-xs leading-5 text-red-700">{errors.lastname || touched.lastname}</span>
							) : null}
						</div>

						<div tw="mt-6">
							<label htmlFor="username" tw="block text-sm font-medium text-gray-700">
								{username}
							</label>
							<div tw="mt-1 rounded-md">
								<input
									id="username"
									type="text"
									name="username"
									disabled={isSubmitting}
									css={[
										tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md`,
										isSubmitting && tw`opacity-50 bg-gray-300 cursor-not-allowed pointer-events-none`,
										errors.username ? tw`border-red-300` : tw`border-gray-300`
									]}
									aria-describedby="username"
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.username}
								/>
							</div>

							{errors.username || touched.username ? (
								<span tw="block mt-2 text-xs leading-5 text-red-700">{errors.username || touched.username}</span>
							) : null}
						</div>

						<div tw="mt-6">
							<label htmlFor="email" tw="block text-sm font-medium text-gray-700">
								{emailAddress}
							</label>
							<div tw="mt-1 rounded-md">
								<input
									id="email"
									type="email"
									name="email"
									disabled={isSubmitting}
									css={[
										tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md`,
										isSubmitting && tw`opacity-50 bg-gray-300 cursor-not-allowed pointer-events-none `,
										errors.email ? tw`border-red-300` : tw`border-gray-300`
									]}
									aria-describedby="email"
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.email}
								/>
							</div>

							{errors.email || touched.email ? (
								<span tw="block mt-2 text-xs leading-5 text-red-700">{errors.email || touched.email}</span>
							) : null}
						</div>

						<div tw="mt-6">
							<label htmlFor="password" tw="block text-sm font-medium text-gray-700">
								{password}
							</label>
							<div tw="mt-1 rounded-md">
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
							<label htmlFor="password" tw="block text-sm font-medium text-gray-700">
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
									{isSubmitting ? submitting : createAccount}
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
 * Memoized custom `RegistrationForm` component
 */
export const MemoizedRegistrationForm = memo(RegistrationForm);

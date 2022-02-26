import { RegistrationApiEndpoint } from "@constants/ApiEndpoints";
import {
	FormPasswordMaxChars,
	FormPasswordMinChars,
	FormStringMaxChars,
	FormStringMinChars
} from "@constants/GlobalValues";
import { handlePostMethod } from "@helpers/handleHttpMethods";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import { Formik } from "formik";
import useTranslation from "next-translate/useTranslation";
import { memo, useContext } from "react";
import PasswordStrengthBar from "react-password-strength-bar";
import * as Yup from "yup";

/**
 * Custom function to render the `RegistrationForm` component
 */
const RegistrationForm = () => {
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

	// Custom context
	const { setConfig } = useContext(SiteCrawlerAppContext);

	return (
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
					<div className="mt-1">
						<label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
							{firstName}
						</label>
						<div className="mt-1 rounded-md">
							<input
								id="firstname"
								type="text"
								name="firstname"
								disabled={isSubmitting}
								className={classnames(
									"block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
									isSubmitting && "pointer-events-none cursor-not-allowed bg-gray-300 opacity-50",
									errors.firstname ? "border-red-300" : "border-gray-300"
								)}
								aria-describedby="firstname"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.firstname}
							/>
						</div>

						{errors.firstname || touched.firstname ? (
							<span className="mt-2 block text-xs leading-5 text-red-700">{errors.firstname || touched.firstname}</span>
						) : null}
					</div>

					<div className="mt-6">
						<label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
							{lastName}
						</label>
						<div className="mt-1 rounded-md">
							<input
								id="lastname"
								type="text"
								name="lastname"
								disabled={isSubmitting}
								className={classnames(
									"block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
									isSubmitting && "pointer-events-none cursor-not-allowed bg-gray-300 opacity-50",
									errors.lastname ? "border-red-300" : "border-gray-300"
								)}
								aria-describedby="lastname"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.lastname}
							/>
						</div>

						{errors.lastname || touched.lastname ? (
							<span className="mt-2 block text-xs leading-5 text-red-700">{errors.lastname || touched.lastname}</span>
						) : null}
					</div>

					<div className="mt-6">
						<label htmlFor="username" className="block text-sm font-medium text-gray-700">
							{username}
						</label>
						<div className="mt-1 rounded-md">
							<input
								id="username"
								type="text"
								name="username"
								disabled={isSubmitting}
								className={classnames(
									"block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
									isSubmitting && "pointer-events-none cursor-not-allowed bg-gray-300 opacity-50",
									errors.username ? "border-red-300" : "border-gray-300"
								)}
								aria-describedby="username"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.username}
							/>
						</div>

						{errors.username || touched.username ? (
							<span className="mt-2 block text-xs leading-5 text-red-700">{errors.username || touched.username}</span>
						) : null}
					</div>

					<div className="mt-6">
						<label htmlFor="email" className="block text-sm font-medium text-gray-700">
							{emailAddress}
						</label>
						<div className="mt-1 rounded-md">
							<input
								id="email"
								type="email"
								name="email"
								disabled={isSubmitting}
								className={classnames(
									"block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
									isSubmitting && "pointer-events-none cursor-not-allowed bg-gray-300 opacity-50 ",
									errors.email ? "border-red-300" : "border-gray-300"
								)}
								aria-describedby="email"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.email}
							/>
						</div>

						{errors.email || touched.email ? (
							<span className="mt-2 block text-xs leading-5 text-red-700">{errors.email || touched.email}</span>
						) : null}
					</div>

					<div className="mt-6">
						<label htmlFor="password" className="block text-sm font-medium text-gray-700">
							{password}
						</label>
						<div className="mt-1 rounded-md">
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
						<label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
								{isSubmitting ? submitting : createAccount}
							</button>
						</span>
					</div>
				</form>
			)}
		</Formik>
	);
};

/**
 * Memoized custom `RegistrationForm` component
 */
export const MemoizedRegistrationForm = memo(RegistrationForm);

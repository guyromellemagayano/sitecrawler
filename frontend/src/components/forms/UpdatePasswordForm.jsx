import { Alert } from "@components/alerts";
import { ConfirmResetPasswordApiEndpoint, UserApiEndpoint } from "@configs/ApiEndpoints";
import { FormPasswordMaxChars, FormPasswordMinChars } from "@configs/GlobalValues";
import { usePostMethod } from "@hooks/useHttpMethod";
import * as Sentry from "@sentry/nextjs";
import { Formik } from "formik";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import * as React from "react";
import PasswordStrengthBar from "react-password-strength-bar";
import { useSWRConfig } from "swr";
import tw from "twin.macro";
import * as Yup from "yup";

/**
 * Memoized function to render the `UpdatePasswordForm` component.
 */
const UpdatePasswordForm = React.memo(() => {
	const [errorMessage, setErrorMessage] = React.useState([]);
	const [successMessage, setSuccessMessage] = React.useState([]);
	const [uid, setUid] = React.useState(null);
	const [token, setToken] = React.useState(null);

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
	const updatePasswordBadRequestPostError = t("alerts:updatePasswordBadRequestPostError");
	const updatePasswordOkSuccess = t("alerts:updatePasswordOkSuccess");
	const updatePasswordUnknownError = t("alerts:updatePasswordUnknownError");
	const updatePasswordInvalidTokenError = t("alerts:updatePasswordInvalidTokenError");

	// Router
	const { asPath } = useRouter();
	const { query } = useRouter();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// Set the `uid` and `token` from the URL query parameters
	React.useEffect(() => {
		const hasKeyProperty = query.hasOwnProperty("id") ? true : false;

		if (Object.keys(query).length > 0 && hasKeyProperty) {
			setUid(query.id[0]);
			setToken(query.id[1]);
		}
	}, [query]);

	return (
		<React.Fragment>
			{errorMessage !== [] && errorMessage.length > 0 ? (
				<div tw="fixed right-6 bottom-6 grid grid-flow-row gap-4">
					{errorMessage.map((value, key) => (
						<Alert key={key} message={value} isError />
					))}
				</div>
			) : null}

			{successMessage !== [] && successMessage.length > 0 ? (
				<div tw="fixed right-6 bottom-6 grid grid-flow-row gap-4">
					{successMessage.map((value, key) => (
						<Alert key={key} message={value} isSuccess />
					))}
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

					const updatePasswordResponse = await usePostMethod(ConfirmResetPasswordApiEndpoint, body);
					const updatePasswordResponseData = updatePasswordResponse.data ?? null;
					const updatePasswordResponseStatus = updatePasswordResponse.status ?? null;

					if (updatePasswordResponseData !== null && Math.round(updatePasswordResponseStatus / 200) === 1) {
						// Mutate `user` endpoint after successful 200 OK or 201 Created response is issued
						mutate(UserApiEndpoint, false);

						resetForm({ values: "" });
						setSubmitting(false);
						setSuccessMessage((prevState) => [
							...prevState,
							prevState.indexOf(updatePasswordOkSuccess) !== -1
								? prevState.find((prevState) => prevState === updatePasswordOkSuccess)
								: updatePasswordOkSuccess
						]);
					} else {
						let errorStatusCodeMessage = "";

						resetForm({ values: "" });
						setSubmitting(false);

						switch (updatePasswordResponseStatus) {
							case 400:
								errorStatusCodeMessage = updatePasswordBadRequestPostError;
								break;
							default:
								errorStatusCodeMessage = updatePasswordUnknownError;
								break;
						}

						setErrorMessage((prevState) => [
							...prevState,
							prevState.indexOf(errorStatusCodeMessage) !== -1
								? prevState.find((prevState) => prevState === errorStatusCodeMessage)
								: errorStatusCodeMessage
						]);

						updatePasswordResponseData.token
							? setErrorMessage((prevState) => [
									...prevState,
									prevState.indexOf(updatePasswordInvalidTokenError) !== -1
										? prevState.find((prevState) => prevState === updatePasswordInvalidTokenError)
										: updatePasswordInvalidTokenError
							  ])
							: null;

						// Capture unknown errors and send to Sentry
						Sentry.configureScope((scope) => {
							scope.setTag("route", asPath);
							scope.setTag("status", updatePasswordResponseStatus);
							scope.setTag(
								"message",
								errorMessage.find((message) => message === errorStatusCodeMessage)
							);
							Sentry.captureException(new Error(updatePasswordResponse));
						});
					}
				}}
			>
				{({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
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
									value={values.password1}
								/>
							</div>
							<PasswordStrengthBar password={values.password1} />

							{errors.password1 && touched.password1 && (
								<span tw="block mt-2 text-xs leading-5 text-red-700">
									{errors.password1 && touched.password1 && errors.password1}
								</span>
							)}
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
									value={values.password2}
								/>
							</div>

							{errors.password2 && touched.password2 && (
								<span tw="block mt-2 text-xs leading-5 text-red-700">
									{errors.password2 && touched.password2 && errors.password2}
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
		</React.Fragment>
	);
});

export default UpdatePasswordForm;

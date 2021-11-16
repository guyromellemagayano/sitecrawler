import Alert from "@components/alerts";
import { ResetPasswordApiEndpoint } from "@configs/ApiEndpoints";
import { usePostMethod } from "@hooks/useHttpMethod";
import * as Sentry from "@sentry/nextjs";
import { Formik } from "formik";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import * as React from "react";
import tw from "twin.macro";
import * as Yup from "yup";

const ResetPasswordForm = () => {
	const [errorMessage, setErrorMessage] = React.useState([]);
	const [successMessage, setSuccessMessage] = React.useState([]);

	// Router
	const { asPath } = useRouter();

	// Translations
	const { t } = useTranslation();
	const requiredField = t("common:requiredField");
	const invalidEmail = t("common:invalidEmail");
	const resetPasswordOkSuccess = t("alerts:resetPasswordOkSuccess");
	const resetPasswordBadRequestPostError = t("alerts:resetPasswordBadRequestPostError");
	const resetPasswordUnknownError = t("alerts:resetPasswordUnknownError");
	const emailAddress = t("common:emailAddress");
	const isResetPassword = t("common:isResetPassword");
	const submitting = t("common:submitting");

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
					email: ""
				}}
				validationSchema={Yup.object({
					email: Yup.string().email(invalidEmail).required(requiredField)
				})}
				onSubmit={async (values, { setSubmitting, resetForm }) => {
					const body = {
						email: values.email
					};

					const resetPasswordResponse = await usePostMethod(ResetPasswordApiEndpoint, body);
					const resetPasswordResponseData = resetPasswordResponse.data ?? null;
					const resetPasswordResponseStatus = resetPasswordResponse.status ?? null;

					if (resetPasswordResponseData !== null && Math.round(resetPasswordResponseStatus / 200) === 1) {
						resetForm({ values: "" });
						setSubmitting(false);
						setSuccessMessage((prevState) => [
							...prevState,
							prevState.indexOf(resetPasswordOkSuccess) !== -1
								? prevState.find((prevState) => prevState === resetPasswordOkSuccess)
								: resetPasswordOkSuccess
						]);
					} else {
						let errorStatusCodeMessage = "";

						resetForm({ values: "" });
						setSubmitting(false);

						switch (resetPasswordResponseStatus) {
							case 400:
								errorStatusCodeMessage = resetPasswordBadRequestPostError;
								break;
							default:
								errorStatusCodeMessage = resetPasswordUnknownError;
								break;
						}

						setErrorMessage((prevState) => [
							...prevState,
							prevState.indexOf(errorStatusCodeMessage) !== -1
								? prevState.find((prevState) => prevState === errorStatusCodeMessage)
								: errorStatusCodeMessage
						]);

						// Capture unknown errors and send to Sentry
						Sentry.configureScope((scope) => {
							scope.setTag("route", asPath);
							scope.setTag("status", resetPasswordResponseStatus);
							scope.setTag(
								"message",
								errorMessage.find((message) => message === errorStatusCodeMessage)
							);
							Sentry.captureException(new Error(resetPasswordResponse));
						});
					}
				}}
			>
				{({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
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
									autoFocus={true}
									css={[
										tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md`,
										isSubmitting && tw`opacity-50 bg-gray-300 cursor-not-allowed pointer-events-none`,
										errors.email ? tw`border-red-300` : tw`border-gray-300`
									]}
									aria-describedby="email"
									onChange={handleChange}
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
		</React.Fragment>
	);
};

export default ResetPasswordForm;

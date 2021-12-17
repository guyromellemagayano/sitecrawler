import { ContactApiEndpoint } from "@constants/ApiEndpoints";
import { handlePostMethod } from "@helpers/handleHttpMethods";
import { useLoading } from "@hooks/useLoading";
import { useUser } from "@hooks/useUser";
import { Formik } from "formik";
import useTranslation from "next-translate/useTranslation";
import { memo } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import tw from "twin.macro";
import * as Yup from "yup";

/**
 * Custom function to render the `HelpSupportSettingsForm` component
 */
export function HelpSupportSettingsForm() {
	const { t } = useTranslation();
	const helpSupportFormSuccess = t("settings:helpSupportForm.success");
	const helpSupportFormFailed = t("settings:helpSupportForm.failed");
	const tellIsYourThoughts = t("settings:tellUsYourThoughts");
	const message = t("settings:message");
	const submitForm = t("settings:submitForm");
	const submitting = t("common:submitting");
	const requiredField = t("common:requiredField");

	// SWR hooks
	const { user, errorUser, validatingUser } = useUser();

	// Custom hooks
	const { isComponentReady } = useLoading();

	return (
		<Formik
			initialValues={{
				message: ""
			}}
			validationSchema={Yup.object({
				message: Yup.string().required(requiredField)
			})}
			onSubmit={async (values, { setSubmitting, resetForm }) => {
				const body = {
					message: values.message
				};

				const helpSupportResponse = await handlePostMethod(ContactApiEndpoint, body);
				const helpSupportResponseData = helpSupportResponse?.data ?? null;
				const helpSupportResponseStatus = helpSupportResponse?.status ?? null;

				if (helpSupportResponseData !== null && Math.round(helpSupportResponseStatus / 200) === 1) {
					setSubmitting(false);
					resetForm({ values: "" });
					setSuccessMessage((prevState) => [
						...prevState,
						prevState.indexOf(helpSupportFormSuccess) !== -1
							? prevState.find((prevState) => prevState === helpSupportFormSuccess)
							: helpSupportFormSuccess
					]);
				} else {
					let errorStatusCodeMessage = "";

					setSubmitting(false);
					resetForm({ values: "" });

					switch (helpSupportResponseStatus) {
						default:
							errorStatusCodeMessage = helpSupportFormFailed;
							break;
					}

					setErrorMessage((prevState) => [
						...prevState,
						prevState.indexOf(errorStatusCodeMessage) !== -1
							? prevState.find((prevState) => prevState === errorStatusCodeMessage)
							: errorStatusCodeMessage
					]);
				}
			}}
		>
			{({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
				<form tw="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit}>
					<div tw="mt-6 grid grid-cols-1 gap-y-6 gap-x-4">
						<div tw="sm:col-span-1">
							<label htmlFor="about" tw="block text-sm font-medium text-gray-700">
								{isComponentReady && !validatingUser && !errorUser && typeof user !== "undefined" && user !== null ? (
									message
								) : (
									<Skeleton duration={2} width={150} height={20} />
								)}
							</label>
							<div tw="mt-1 relative rounded-md shadow-sm">
								{isComponentReady && !validatingUser && !errorUser && typeof user !== "undefined" && user !== null ? (
									<textarea
										id="message"
										name="message"
										aria-describedby="message"
										rows="8"
										disabled={isSubmitting}
										css={[
											tw`resize-none shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md`,
											isSubmitting && tw`opacity-50 bg-gray-300 cursor-not-allowed`,
											errors.message ? tw`border-red-300` : tw`border-gray-300`
										]}
										placeholder={tellIsYourThoughts}
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.message}
									/>
								) : (
									<Skeleton duration={2} width={448} height={178} />
								)}
							</div>

							{errors.message && touched.message && (
								<span tw="block mt-2 text-xs leading-5 text-red-700">
									{errors.message && touched.message && errors.message}
								</span>
							)}
						</div>

						<div tw="sm:col-span-1">
							<div tw="flex justify-between flex-col sm:flex-row md:flex-col lg:flex-row">
								<div tw="flex justify-start order-1 sm:flex-row sm:flex-initial sm:w-auto sm:mr-1 lg:order-1 lg:w-full">
									<span tw="inline-flex">
										{isComponentReady &&
										!validatingUser &&
										!errorUser &&
										typeof user !== "undefined" &&
										user !== null ? (
											<button
												type="submit"
												disabled={isSubmitting}
												css={[
													tw`cursor-pointer inline-flex sm:mt-0 relative items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600`,
													isSubmitting
														? tw`opacity-50 bg-green-400 cursor-not-allowed`
														: tw`hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`
												]}
											>
												{isSubmitting ? submitting : submitForm}
											</button>
										) : (
											<Skeleton
												duration={2}
												width={82.39}
												height={38}
												tw="w-full mt-3 mr-3 sm:mt-0 inline-flex items-center px-4 py-2"
											/>
										)}
									</span>
								</div>
							</div>
						</div>
					</div>
				</form>
			)}
		</Formik>
	);
}

/**
 * Memoized custom `HelpSupportSettingsForm` component
 */
export const MemoizedHelpSupportSettingsForm = memo(HelpSupportSettingsForm);

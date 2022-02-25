import { ContactApiEndpoint } from "@constants/ApiEndpoints";
import { handlePostMethod } from "@helpers/handleHttpMethods";
import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import { Formik } from "formik";
import useTranslation from "next-translate/useTranslation";
import { memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import * as Yup from "yup";

/**
 * Custom function to render the `HelpSupportSettingsForm` component
 */
const HelpSupportSettingsForm = () => {
	const { t } = useTranslation();
	const tellIsYourThoughts = t("settings:helpSupportForm.tellUsYourThoughts");
	const message = t("settings:helpSupportForm.message");
	const submitForm = t("settings:helpSupportForm.submitForm");
	const submitting = t("common:submitting");
	const requiredField = t("common:requiredField");

	// Custom context
	const { setConfig, isComponentReady } = useContext(SiteCrawlerAppContext);

	// SWR hooks
	const { user } = useUser();

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
				const helpSupportResponseMethod = helpSupportResponse?.config?.method ?? null;

				if (helpSupportResponseData !== null && Math.round(helpSupportResponseStatus / 200) === 1) {
					// Disable submission and disable form as soon as 200 OK or 201 Created response was issued
					setSubmitting(false);
					resetForm({ values: "" });

					// Show alert message after successful 200 OK or 201 Created response is issued
					setConfig({
						isSupport: true,
						method: helpSupportResponseMethod,
						status: helpSupportResponseStatus
					});
				} else {
					// Disable submission as soon as 200 OK or 201 Created response was not issued
					setSubmitting(false);

					// Show alert message after successful 200 OK or 201 Created response is issued
					setConfig({
						isSupport: true,
						method: helpSupportResponseMethod,
						status: helpSupportResponseStatus
					});
				}
			}}
		>
			{({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
				<form className="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit}>
					<div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4">
						<div className="sm:col-span-1">
							<label htmlFor="about" className="block text-sm font-medium text-gray-700">
								{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
									message
								) : (
									<Skeleton duration={2} width={150} height={20} />
								)}
							</label>
							<div className="relative mt-1 rounded-md shadow-sm">
								{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
									<textarea
										id="message"
										name="message"
										aria-describedby="message"
										rows="8"
										disabled={isSubmitting}
										css={[
											"resize-none shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md",
											isSubmitting && "opacity-50 bg-gray-300 cursor-not-allowed",
											errors.message ? "border-red-300" : "border-gray-300"
										]}
										placeholder={tellIsYourThoughts}
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.message}
									/>
								) : (
									<Skeleton duration={2} width={360} height={178} />
								)}
							</div>

							{errors.message && touched.message && (
								<span className="mt-2 block text-xs leading-5 text-red-700">
									{errors.message && touched.message && errors.message}
								</span>
							)}
						</div>

						<div className="sm:col-span-1">
							<div className="flex flex-col justify-between sm:flex-row md:flex-col lg:flex-row">
								<div className="order-1 flex justify-start sm:mr-1 sm:w-auto sm:flex-initial sm:flex-row lg:order-1 lg:w-full">
									<span className="inline-flex">
										{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
											<button
												type="submit"
												disabled={isSubmitting}
												css={[
													"cursor-pointer inline-flex sm:mt-0 relative items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600",
													isSubmitting
														? "opacity-50 bg-green-400 cursor-not-allowed"
														: "hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
												]}
											>
												{isSubmitting ? submitting : submitForm}
											</button>
										) : (
											<Skeleton
												duration={2}
												width={82.39}
												height={38}
												className="mt-3 mr-3 inline-flex w-full items-center px-4 py-2 sm:mt-0"
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
};

/**
 * Memoized custom `HelpSupportSettingsForm` component
 */
export const MemoizedHelpSupportSettingsForm = memo(HelpSupportSettingsForm);

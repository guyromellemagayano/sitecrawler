import { ContactApiEndpoint } from "@constants/ApiEndpoints";
import { NotificationDisplayInterval } from "@constants/GlobalValues";
import { handlePostMethod } from "@helpers/handleHttpMethods";
import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import { Formik } from "formik";
import useTranslation from "next-translate/useTranslation";
import { memo, useContext, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import * as Yup from "yup";

/**
 * Custom function to render the `HelpSupportSettingsForm` component
 */
const HelpSupportSettingsForm = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Translations
	const { t } = useTranslation();
	const tellIsYourThoughts = t("settings:helpSupportForm.tellUsYourThoughts");
	const message = t("settings:helpSupportForm.message");
	const submitForm = t("settings:helpSupportForm.submitForm");
	const submitting = t("common:submitting");
	const requiredField = t("common:requiredField");

	// Custom context
	const { setConfig, isComponentReady, state } = useContext(SiteCrawlerAppContext);

	// SWR hooks
	const { user } = useUser();

	return (
		<Formik
			initialValues={{
				message: ""
			}}
			validationSchema={Yup.object().shape({
				message: Yup.string().required(requiredField)
			})}
			onSubmit={async (values, { resetForm }) => {
				setIsSubmitting(true);

				const body = {
					message: values.message
				};

				const helpSupportResponse = await handlePostMethod(ContactApiEndpoint, body);
				const helpSupportResponseData = helpSupportResponse?.data ?? null;
				const helpSupportResponseStatus = helpSupportResponse?.status ?? null;
				const helpSupportResponseMethod = helpSupportResponse?.config?.method ?? null;

				// Show alert message after successful 200 OK or 201 Created response is issued
				setConfig({
					isSupport: true,
					method: helpSupportResponseMethod,
					status: helpSupportResponseStatus,
					isAlert: false,
					isNotification: false
				});

				const helpSupportResponseTimeout = setTimeout(() => {
					if (helpSupportResponseData && Math.round(helpSupportResponseStatus / 200) === 1) {
						// Disable submission and disable form as soon as 200 OK or 201 Created response was issued
						setIsSubmitting(false);
						resetForm({ values: "" });
					} else {
						// Disable submission as soon as 200 OK or 201 Created response was not issued
						setIsSubmitting(false);
					}
				}, NotificationDisplayInterval);

				return () => {
					clearTimeout(helpSupportResponseTimeout);
				};
			}}
		>
			{({ errors, handleBlur, handleChange, handleSubmit, values }) => (
				<form className="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit}>
					<div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4">
						<div className="sm:col-span-1">
							<label htmlFor="about" className="block text-sm font-medium text-gray-700">
								{isComponentReady ? message : <Skeleton duration={2} width={150} height={20} />}
							</label>
							<div className="relative mt-1 rounded-md shadow-sm">
								{isComponentReady ? (
									<textarea
										id="message"
										name="message"
										aria-describedby="message"
										rows="8"
										disabled={isSubmitting}
										className={classnames(
											"block w-full resize-none rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
											isSubmitting && "cursor-not-allowed bg-gray-300 opacity-50",
											errors.message ? "border-red-300" : "border-gray-300"
										)}
										placeholder={tellIsYourThoughts}
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.message}
									/>
								) : (
									<Skeleton duration={2} width={360} height={178} />
								)}
							</div>

							{errors.message ? (
								<span className="mt-2 block text-xs leading-5 text-red-700">{errors.message}</span>
							) : null}
						</div>

						{state?.isSupport && state?.responses?.length > 0 ? (
							<div className="sm:col-span-1">
								<div className="relative mt-1">
									{state.responses.map((value, key) => {
										// Alert Messsages
										const responseText = value.responseText;
										const isSuccess = value.isSuccess;

										return (
											<span
												key={key}
												className={classnames(
													"block break-words text-sm font-medium leading-5",
													isSuccess ? "text-green-800" : "text-red-800"
												)}
											>
												{responseText}
											</span>
										);
									})}
								</div>
							</div>
						) : null}

						<div className="sm:col-span-1">
							<div className="flex flex-col justify-between sm:flex-row md:flex-col lg:flex-row">
								<div className="order-1 flex justify-start sm:mr-1 sm:w-auto sm:flex-initial sm:flex-row lg:order-1 lg:w-full">
									<span className="inline-flex">
										{isComponentReady ? (
											<button
												type="submit"
												disabled={isSubmitting || Object.keys(errors).length > 0 || !(values.message !== "")}
												aria-disabled={isSubmitting || Object.keys(errors).length > 0 || !(values.message !== "")}
												aria-hidden={isSubmitting || Object.keys(errors).length > 0 || !(values.message !== "")}
												className={classnames(
													"relative inline-flex cursor-pointer items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium leading-5 text-white sm:mt-0",
													isSubmitting || Object.keys(errors).length > 0 || !(values.message !== "")
														? "cursor-not-allowed opacity-50"
														: "hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
												)}
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

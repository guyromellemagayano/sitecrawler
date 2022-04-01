import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import {
	DefaultlargePageSizeThreshold,
	FormStringMinChars,
	FormUrlNameMaxChars,
	NotificationDisplayInterval
} from "@constants/GlobalValues";
import { handlePutMethod } from "@helpers/handleHttpMethods";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import { Formik } from "formik";
import useTranslation from "next-translate/useTranslation";
import { memo, useContext, useMemo, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSWRConfig } from "swr";
import * as Yup from "yup";

/**
 * Custom function to render the `SiteInformationSettingsForm` component
 */
const SiteInformationSettingsForm = () => {
	const [disableForm, setDisableForm] = useState(true);
	const [siteUrl, setSiteUrl] = useState("");
	const [siteName, setSiteName] = useState("");
	const [largePageSizeThreshold, setLargePageSizeThreshold] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Translations
	const { t } = useTranslation();
	const saving = t("common:saving");
	const saveChanges = t("common:save");
	const siteNameText = t("common:siteName");
	const siteUrlText = t("common:siteUrl");
	const largePageThresholdSizeText = t("common:largePageThresholdSize");
	const updateText = t("common:update");
	const requiredField = t("common:requiredField");
	const tooShort = t("common:tooShort");
	const cancelText = t("common:cancel");
	const minLargePageThresholdText = t("common:minLargePageThreshold");
	const tooLong = t("common:tooLong");
	const submitting = t("common:submitting");
	const siteUrlAlreadyExists = t("alerts:sites.urlInformation.post.misc.siteUrlAlreadyExists");
	const enterValidSiteUrl = t("alerts:sites.urlInformation.post.misc.enterValidSiteUrl");

	// Custom context
	const { isComponentReady, setConfig, siteId, state, customSitesIdApiEndpoint, sites } =
		useContext(SiteCrawlerAppContext);

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// Load `siteId` data from the API
	useMemo(() => {
		let initialSiteName = siteId?.data?.name ?? "";
		let initialSiteUrl = siteId?.data?.url ?? "";
		let initialLargePageSizeThreshold = siteId?.data?.large_page_size_threshold ?? null;

		if (initialSiteName !== "" && initialSiteUrl !== "") {
			setSiteName(initialSiteName);
			setSiteUrl(initialSiteUrl);
			setLargePageSizeThreshold(initialLargePageSizeThreshold);
		}

		return { siteName, siteUrl, largePageSizeThreshold };
	}, [largePageSizeThreshold, siteId, siteName, siteUrl]);

	return (
		<Formik
			enableReinitialize={true}
			initialValues={{
				siteName: siteName,
				siteUrl: siteUrl,
				largePageSizeThreshold: largePageSizeThreshold
			}}
			validationSchema={Yup.object().shape({
				siteName: Yup.string()
					.min(FormStringMinChars, tooShort)
					.max(FormUrlNameMaxChars, tooLong)
					.required(requiredField),
				largePageSizeThreshold: Yup.number()
					.min(DefaultlargePageSizeThreshold, minLargePageThresholdText)
					.required(requiredField)
			})}
			onSubmit={async (values, { resetForm }) => {
				setIsSubmitting(true);

				const body = {
					name: values.siteName,
					url: siteUrl,
					large_page_size_threshold: values.largePageSizeThreshold
				};

				const siteIdSettingsResponse = await handlePutMethod(customSitesIdApiEndpoint + "/", body);
				const siteIdSettingsResponseData = siteIdSettingsResponse?.data ?? null;
				const siteIdSettingsResponseStatus = siteIdSettingsResponse?.status ?? null;
				const siteIdSettingsResponseMethod = siteIdSettingsResponse?.config?.method ?? null;

				// Show alert message after successful 200 OK or 201 Created response is issued
				setConfig({
					isSites: true,
					method: siteIdSettingsResponseMethod,
					status: siteIdSettingsResponseStatus,
					isAlert: false,
					isNotification: false
				});

				const siteIdSettingsResponseTimeout = setTimeout(() => {
					if (siteIdSettingsResponseData && Math.round(siteIdSettingsResponseStatus / 200) === 1) {
						// Mutate `siteId` endpoint after successful 200 OK or 201 Created response is issued
						mutate(
							customSitesIdApiEndpoint,
							{ ...siteId, data: siteIdSettingsResponseData },
							{ optimisticData: siteId?.data, rollbackOnError: true, revalidate: true }
						);
						mutate(SitesApiEndpoint, null, {
							optimisticData: sites?.data,
							rollbackOnError: true,
							revalidate: true
						});

						// Disable submission and disable form as soon as 200 OK or 201 Created response was issued
						setIsSubmitting(false);
						resetForm({ values: "" });
						setDisableForm(!disableForm);
					} else {
						// Disable submission as soon as 200 OK or 201 Created response was not issued
						setIsSubmitting(false);
						setDisableForm(!disableForm);
					}
				}, NotificationDisplayInterval);

				return () => {
					clearTimeout(siteIdSettingsResponseTimeout);
				};
			}}
		>
			{({ errors, handleBlur, handleChange, handleSubmit, handleReset, values }) => (
				<form className="space-y-8" onSubmit={handleSubmit}>
					<div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4">
						<div className="sm:col-span-1">
							<label htmlFor="siteName" className="block text-sm font-medium leading-5 text-gray-700">
								{isComponentReady ? siteNameText : <Skeleton duration={2} width={150} height={20} />}
							</label>
							<div className="mt-1">
								{isComponentReady ? (
									<input
										type="text"
										id="siteName"
										value={values.siteName}
										name="siteName"
										disabled={isSubmitting || disableForm}
										className={classnames(
											"block w-full rounded-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
											(isSubmitting || disableForm) && "cursor-not-allowed bg-gray-300 opacity-50",
											errors.siteName ? "border-red-300" : "border-gray-300"
										)}
										aria-describedby="siteName"
										onChange={handleChange}
										onBlur={handleBlur}
									/>
								) : (
									<Skeleton duration={2} height={38} />
								)}

								{errors.siteName ? (
									<span className="mt-2 block text-xs leading-5 text-red-700">{errors.siteName}</span>
								) : null}
							</div>
						</div>

						<div className="sm:col-span-1">
							<label htmlFor="siteUrl" className="block text-sm font-medium leading-5 text-gray-700">
								{isComponentReady ? siteUrlText : <Skeleton duration={2} width={150} height={20} />}
							</label>
							<div className="mt-1">
								{isComponentReady ? (
									<input
										type="url"
										id="siteUrl"
										value={values.siteUrl}
										disabled={true}
										className="block w-full cursor-not-allowed rounded-md border-gray-300 bg-gray-300 opacity-50 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
										aria-describedby="siteUrl"
										onChange={handleChange}
										onBlur={handleBlur}
									/>
								) : (
									<Skeleton duration={2} height={38} />
								)}
							</div>
						</div>

						<div className="sm:col-span-1">
							<label htmlFor="largePageSizeThreshold" className="block text-sm font-medium leading-5 text-gray-700">
								{isComponentReady ? largePageThresholdSizeText : <Skeleton duration={2} width={150} height={20} />}
							</label>
							<div className="mt-1 rounded-md shadow-sm">
								{isComponentReady ? (
									<input
										type="text"
										id="largePageSizeThreshold"
										value={values.largePageSizeThreshold}
										name="largePageSizeThreshold"
										disabled={isSubmitting || disableForm}
										className={classnames(
											"block w-full rounded-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
											(isSubmitting || disableForm) && "cursor-not-allowed bg-gray-300 opacity-50",
											errors.largePageSizeThreshold ? "border-red-300" : "border-gray-300"
										)}
										aria-describedby="largePageSizeThreshold"
										onChange={handleChange}
										onBlur={handleBlur}
									/>
								) : (
									<Skeleton duration={2} height={38} />
								)}

								{errors.largePageSizeThreshold ? (
									<span className="mt-2 block text-xs leading-5 text-red-700">{errors.largePageSizeThreshold}</span>
								) : null}
							</div>
						</div>

						{state?.isSites && state?.responses?.length > 0 ? (
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
											!disableForm ? (
												<>
													<button
														type="button"
														disabled={isSubmitting || disableForm}
														className={classnames(
															"rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm",
															isSubmitting || disableForm
																? "cursor-not-allowed opacity-50"
																: "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
														)}
														onClick={(e) => {
															handleReset();
															setDisableForm(!disableForm);
														}}
													>
														{cancelText}
													</button>

													<button
														type="submit"
														disabled={
															isSubmitting ||
															Object.keys(errors).length > 0 ||
															!(
																disableForm ||
																values.siteName !== siteName ||
																values.siteUrl !== siteUrl ||
																values.largePageSizeThreshold !== largePageSizeThreshold
															)
														}
														aria-disabled={
															isSubmitting ||
															Object.keys(errors).length > 0 ||
															!(
																disableForm ||
																values.siteName !== siteName ||
																values.siteUrl !== siteUrl ||
																values.largePageSizeThreshold !== largePageSizeThreshold
															)
														}
														aria-hidden={
															isSubmitting ||
															Object.keys(errors).length > 0 ||
															!(
																disableForm ||
																values.siteName !== siteName ||
																values.siteUrl !== siteUrl ||
																values.largePageSizeThreshold !== largePageSizeThreshold
															)
														}
														className={classnames(
															"ml-3 inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm",
															isSubmitting ||
																Object.keys(errors).length > 0 ||
																!(disableForm,
																values.siteName !== siteName ||
																	values.siteUrl !== siteUrl ||
																	values.largePageSizeThreshold !== largePageSizeThreshold)
																? "cursor-not-allowed opacity-50"
																: "hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
														)}
													>
														{isSubmitting ? saving : saveChanges}
													</button>
												</>
											) : (
												<button
													type="button"
													disabled={!disableForm}
													className={classnames(
														"relative mt-3 mr-3 inline-flex w-full items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium leading-5 text-white sm:mt-0",
														!disableForm
															? "cursor-not-allowed opacity-50"
															: "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
													)}
													onClick={(e) => {
														handleReset();
														setDisableForm(!disableForm);
													}}
												>
													{updateText}
												</button>
											)
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
 * Memoized custom `SiteInformationSettingsForm` component
 */
export const MemoizedSiteInformationSettingsForm = memo(SiteInformationSettingsForm);

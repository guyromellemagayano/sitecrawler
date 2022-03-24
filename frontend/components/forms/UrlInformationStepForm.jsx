/* eslint-disable-line no-useless-escape */
import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import {
	FormStringMinChars,
	FormSubmissionInterval,
	FormUrlMaxChars,
	FormUrlNameMaxChars,
	NotificationDisplayInterval
} from "@constants/GlobalValues";
import { AddNewSiteLink, DashboardSitesLink } from "@constants/PageLinks";
import { handleGetMethod, handlePostMethod, handlePutMethod } from "@helpers/handleHttpMethods";
import { useSiteId } from "@hooks/useSiteId";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import { Formik } from "formik";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo, useContext, useEffect, useMemo, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import stringSimilarity from "string-similarity";
import { useSWRConfig } from "swr";
import * as Yup from "yup";

/**
 * Custom function to render the `UrlInformationStepForm` component
 *
 * @param {number} step
 * @param {boolean} edit
 * @param {number} sid
 * @param {boolean} verified
 */
const UrlInformationStepForm = (props) => {
	const [siteUrlProtocol, setSiteUrlProtocol] = useState("");
	const [siteUrl, setSiteUrl] = useState("");
	const [siteName, setSiteName] = useState("");
	const [disableForm, setDisableForm] = useState(false);
	const [isAccessForbidden, setIsAccessForbidden] = useState(false);
	const [editMode, setEditMode] = useState(false);

	// Props
	const { step, edit, sid, verified } = props;

	// Translations
	const { t } = useTranslation();
	const tooLong = t("common:tooLong");
	const tooShort = t("common:tooShort");
	const submitting = t("common:submitting");
	const requiredField = t("common:requiredField");
	const updateSiteDetail = t("sites:updateSiteDetail");
	const proceedToStep2 = t("sites:proceedToStep2");
	const formSiteNameLabel = t("sites:form.siteName.label");
	const formSiteNamePlaceholder = t("sites:form.siteName.placeholder");
	const formSiteUrlLabel = t("sites:form.siteUrl.label");
	const formSiteUrlPlaceholder = t("sites:form.siteUrl.placeholder");
	const formSiteUrlProtocol = t("sites:form.siteUrl.protocol");
	const siteUrlAlreadyExists = t("alerts:sites.urlInformation.post.misc.siteUrlAlreadyExists");
	const enterValidSiteUrl = t("alerts:sites.urlInformation.post.misc.enterValidSiteUrl");

	// Router
	const { replace, query } = useRouter();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// Custom context
	const { isComponentReady, setConfig, user, state } = useContext(SiteCrawlerAppContext);

	// Custom variables
	const largePageSizeThreshold = user?.data?.large_page_size_threshold ?? null;
	const customSiteIdApiEndpoint = sid ? SitesApiEndpoint + sid + "/" : null;

	// SWR hooks
	const { siteId } = useSiteId(customSiteIdApiEndpoint);

	// Update "edit" state when props change
	useEffect(() => {
		// Update "editMode" state when "edit" prop changes
		if (edit && step === 1 && sid && !verified) {
			setEditMode(edit);
		}

		return { editMode };
	}, [edit, step, sid, verified]);

	useMemo(() => {
		editMode
			? (() => {
					let initialSiteUrl = siteId?.data?.url ?? "";
					let initialSiteName = siteId?.data?.name ?? "";
					let initialSiteUrlProtocol = siteId?.data?.url.split("://")[0] ?? "";

					if (initialSiteUrl !== "" && initialSiteName !== "" && initialSiteUrlProtocol !== "") {
						setSiteUrl(initialSiteUrl);
						setSiteName(initialSiteName);
						setSiteUrlProtocol(initialSiteUrlProtocol);
					}
			  })()
			: null;

		return { siteUrl, siteName, siteUrlProtocol };
	}, [editMode, siteId, sid]);

	// Update "isAccessForbidden" state when props change
	useEffect(() => {
		isAccessForbidden ? replace(DashboardSitesLink) : null;

		return () => {
			setIsAccessForbidden(false);
		};
	}, [isAccessForbidden]);

	const urlRegex = new RegExp(
		/^(www.)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)|\/|\?)*)?$/i
	);

	return (
		<Formik
			enableReinitialize={edit && step === 1 && sid && !verified ? true : false}
			initialValues={{
				siteurlprotocol: edit && step === 1 && sid && !verified ? siteUrlProtocol : "http://",
				siteurl: edit && step === 1 && sid && !verified ? siteUrl?.replace(/^\/\/|^.*?:(\/\/)?/, "") : "",
				sitename: edit && step === 1 && sid && !verified ? siteName : ""
			}}
			validationSchema={Yup.object().shape({
				siteurl: Yup.string()
					.matches(urlRegex, enterValidSiteUrl)
					.max(FormUrlMaxChars, tooLong)
					.required(requiredField),
				sitename: Yup.string()
					.min(FormStringMinChars, tooShort)
					.max(FormUrlNameMaxChars, tooLong)
					.required(requiredField)
			})}
			onSubmit={async (values, { setSubmitting, setErrors }) => {
				if (!editMode) {
					const body = {
						url: (values.siteurlprotocol !== "" ? values.siteurlprotocol : "https://") + values.siteurl,
						name: values.sitename,
						large_page_size_threshold: largePageSizeThreshold
					};

					const siteValidationResponse = await handleGetMethod(SitesApiEndpoint);
					const siteValidationResponseData = siteValidationResponse?.data ?? null;
					const siteValidationResponseStatus = siteValidationResponse?.status ?? null;
					const siteValidationResponseMethod = siteValidationResponse?.config?.method ?? null;

					// Enable next step in site verification process and disable site verification as soon as 200 OK or 201 Created response was issued
					const siteValidationResponseTimeout = setTimeout(() => {
						(async () => {
							if (siteValidationResponseData !== null && Math.round(siteValidationResponseStatus / 200) === 1) {
								let siteValidationResponseDataResultsArray = [];
								let siteValidationResponseDataResult = null;

								siteValidationResponseData?.results?.map((val) =>
									siteValidationResponseDataResultsArray.push(val.url)
								) ?? null;

								if (siteValidationResponseDataResultsArray?.length > 0) {
									siteValidationResponseDataResult = stringSimilarity.findBestMatch(
										body.url,
										siteValidationResponseDataResultsArray
									);
								}

								if (siteValidationResponseDataResult?.bestMatch?.rating === 1) {
									// Report error message that site URL already exists
									setErrors({ siteurl: siteUrlAlreadyExists });
								} else {
									const siteAdditionResponse = await handlePostMethod(SitesApiEndpoint, body);
									const siteAdditionResponseData = siteAdditionResponse?.data ?? null;
									const siteAdditionResponseStatus = siteAdditionResponse?.status ?? null;
									const siteAdditionResponseMethod = siteAdditionResponse?.config?.method ?? null;

									// Show alert message after successful 200 OK or 201 Created response is issued
									setConfig({
										isSites: true,
										method: siteAdditionResponseMethod,
										status: siteAdditionResponseStatus,
										isAlert: false,
										isNotification: false
									});

									// Enable next step in site verification process and disable site verification as soon as 200 OK or 201 Created response was issued
									const siteAdditionResponseTimeout = setTimeout(() => {
										if (siteAdditionResponseData !== null && Math.round(siteAdditionResponseStatus / 100) === 2) {
											// Disable form after successful 200 OK or 201 Created response is issued
											setDisableForm(true);

											// Update current URL with query for the next step
											replace({
												pathname: AddNewSiteLink,
												query: {
													step: step + 1,
													sid: siteAdditionResponseData?.id ?? null,
													edit: false,
													verified: false
												}
											});
										} else {
											// Disable form after unsuccessful 200 OK or 201 Created response is issued
											setDisableForm(false);

											// Disable submission and reset form as soon as 200 OK or 201 Created response was not issued
											setSubmitting(false);
										}
									}, NotificationDisplayInterval);

									return () => {
										clearTimeout(siteAdditionResponseTimeout);
									};
								}
							} else {
								// Disable form after unsuccessful 200 OK or 201 Created response is issued
								setDisableForm(false);

								// Disable submission and reset form as soon as 200 OK or 201 Created response was issued
								setSubmitting(false);
							}
						})();
					}, NotificationDisplayInterval);

					return () => {
						clearTimeout(siteValidationResponseTimeout);
					};
				} else {
					// Re-enable form for editing
					setDisableForm(!disableForm);

					const urlInformationStepFormResponse = await handleGetMethod(SitesApiEndpoint + sid + "/");
					const urlInformationStepFormResponseData = urlInformationStepFormResponse?.data ?? null;
					const urlInformationStepFormResponseStatus = urlInformationStepFormResponse?.status ?? null;
					const urlInformationStepFormResponseMethod = urlInformationStepFormResponse?.config?.method ?? null;

					// Enable next step in site verification process and disable site verification as soon as 200 OK or 201 Created response was issued
					const urlInformationStepFormResponseTimeout = setTimeout(async () => {
						if (
							urlInformationStepFormResponseData !== null &&
							Math.round(urlInformationStepFormResponseStatus / 200) === 1
						) {
							const body = {
								url: siteUrlProtocol + "://" + values.siteurl,
								name: values.sitename,
								large_page_size_threshold: largePageSizeThreshold
							};

							// If no changes has been made, direct user to the next step
							if (body.name === siteName) {
								// Update current URL with query for the next step
								replace({
									pathname: AddNewSiteLink,
									query: {
										step: step + 1,
										sid: sid,
										edit: false,
										verified: false
									}
								});
							} else {
								const putUrlInformationStepFormResponse = await handlePutMethod(customSiteIdApiEndpoint, body);
								const putUrlInformationStepFormResponseData = putUrlInformationStepFormResponse?.data ?? null;
								const putUrlInformationStepFormResponseStatus = putUrlInformationStepFormResponse?.status ?? null;
								const putUrlInformationStepFormResponseMethod =
									putUrlInformationStepFormResponse?.config?.method ?? null;

								// Show alert message after successful 200 OK or 201 Created response is issued
								setConfig({
									isUrlInformationStep: true,
									method: putUrlInformationStepFormResponseMethod,
									status: putUrlInformationStepFormResponseStatus,
									isAlert: false,
									isNotification: false
								});

								// Mutate current URL with query for the next step
								mutate(customSiteIdApiEndpoint, { ...siteId, data: putUrlInformationStepFormResponseData }, false);

								// Enable next step in site verification process and disable site verification as soon as 200 OK or 201 Created response was issued
								const timeout = setTimeout(() => {
									if (
										putUrlInformationStepFormResponseData !== null &&
										Math.round(putUrlInformationStepFormResponseStatus / 200) === 1
									) {
										if (!putUrlInformationStepFormResponseData?.verified) {
											// Disable form after successful 200 OK or 201 Created response is issued
											setDisableForm(!disableForm);

											// Update current URL with query for the next step
											replace({
												pathname: AddNewSiteLink,
												query: {
													step: step + 1,
													sid: putUrlInformationStepFormResponseData?.id ?? null,
													edit: false,
													verified: false
												}
											});

											// Enable next step in site verification process and disable site verification as soon as 200 OK or 201 Created response was issued
											setTimeout(() => {
												setDisableForm(false);
											}, FormSubmissionInterval);
										}
									} else {
										// Disable submission as soon as 200 OK or 201 Created response was not issued
										setSubmitting(false);

										// Update current URL with query for the previous step
										replace({
											pathname: AddNewSiteLink,
											query: {
												step: step + 1,
												sid: sid,
												edit: false,
												verified: false
											}
										});

										// Enable next step in site verification process and disable site verification as soon as 200 OK or 201 Created response was issued
										setTimeout(() => {
											setDisableForm(false);
										}, FormSubmissionInterval);
									}
								}, NotificationDisplayInterval);

								return () => {
									clearTimeout(timeout);
								};
							}
						} else {
							// Disable submission and reset form as soon as 200 OK or 201 Created response was not issued
							setSubmitting(false);

							// Enable next step in site verification process and disable site verification as soon as 200 OK or 201 Created response was issued
							setTimeout(() => {
								setDisableForm(false);
							}, FormSubmissionInterval);
						}
					}, NotificationDisplayInterval);

					return () => {
						clearTimeout(urlInformationStepFormResponseTimeout);
					};
				}
			}}
		>
			{({ values, errors, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
				<form className="space-y-8" onSubmit={handleSubmit}>
					<div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
						<div className="sm:col-span-3">
							<label htmlFor="sitename" className="block text-sm font-medium leading-5 text-gray-700">
								{isComponentReady ? formSiteNameLabel : <Skeleton duration={2} width={150} height={20} />}
							</label>
							<div className="my-1">
								{isComponentReady ? (
									<input
										id="sitename"
										type="text"
										name="sitename"
										disabled={isSubmitting || disableForm}
										placeholder={formSiteNamePlaceholder}
										className={classnames(
											"block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
											isSubmitting || disableForm ? "cursor-not-allowed bg-gray-300 opacity-50" : null,
											errors.sitename ? "border-red-300" : "border-gray-300"
										)}
										aria-describedby="sitename"
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.sitename}
									/>
								) : (
									<Skeleton duration={2} width={375.5} height={38} />
								)}

								{errors.sitename ? (
									<span className="mt-2 block text-xs leading-5 text-red-700">{errors.sitename}</span>
								) : null}
							</div>
						</div>
						<div className="sm:col-span-3">
							<label htmlFor="siteurl" className="block text-sm font-medium leading-5 text-gray-700">
								{isComponentReady ? formSiteUrlLabel : <Skeleton duration={2} width={150} height={20} />}
							</label>
							<div className="relative mt-1 rounded-md shadow-sm">
								{isComponentReady ? (
									<>
										<span className="absolute inset-y-0 left-0 flex items-center">
											<label htmlFor="siteurlprotocol" className="sr-only">
												{formSiteUrlProtocol}
											</label>
											<select
												id="siteurlprotocol"
												name="siteurlprotocol"
												className={classnames(
													"h-full rounded-md border-transparent bg-transparent py-0 pl-3 pr-7 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
													edit && step === 1 && sid && !verified ? "cursor-not-allowed bg-gray-300 opacity-50" : null
												)}
												disabled={isSubmitting || disableForm || (edit && step === 1 && sid && !verified)}
												onChange={handleChange}
												onBlur={handleBlur}
												value={edit && step === 1 && sid && !verified ? siteUrlProtocol : values.siteurlprotocol}
											>
												<option value="https://">https://</option>
												<option value="http://">http://</option>
											</select>
										</span>

										<input
											id="siteurl"
											type="text"
											name="siteurl"
											disabled={isSubmitting || disableForm || (edit && step === 1 && sid && !verified)}
											className={classnames(
												"block w-full rounded-md border-gray-300 pl-24 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
												(edit && step === 1 && sid && !verified) || isSubmitting || disableForm
													? "cursor-not-allowed bg-gray-300 text-gray-500 opacity-50"
													: null,
												errors.siteurl ? "border-red-300" : "border-gray-300"
											)}
											placeholder={formSiteUrlPlaceholder}
											aria-describedby="siteurl"
											onChange={handleChange}
											onBlur={handleBlur}
											value={values.siteurl}
										/>
									</>
								) : (
									<Skeleton duration={2} width={375.5} height={38} />
								)}
							</div>

							{errors.siteurl ? (
								<span className="mt-2 block text-xs leading-5 text-red-700">{errors.siteurl}</span>
							) : null}
						</div>

						{(state?.isUrlInformationStep || state?.isSites) && state?.responses?.length > 0 ? (
							<div className="sm:col-span-6">
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

						<div className="sm:col-span-6">
							<div className="flex justify-start">
								{isComponentReady ? (
									<button
										type="submit"
										disabled={isSubmitting || disableForm || !urlRegex.test(values.siteurl)}
										className={classnames(
											"relative mt-3 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium leading-5 text-white sm:mt-0",
											isSubmitting || disableForm || !urlRegex.test(values.siteurl)
												? "cursor-not-allowed bg-indigo-300 opacity-50"
												: "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
										)}
									>
										{isSubmitting || disableForm ? submitting : !edit ? proceedToStep2 : updateSiteDetail}
									</button>
								) : (
									<Skeleton
										duration={2}
										width={82.39}
										height={38}
										className="mt-3 mr-3 inline-flex w-full items-center px-4 py-2 sm:mt-0"
									/>
								)}
							</div>
						</div>
					</div>
				</form>
			)}
		</Formik>
	);
};

UrlInformationStepForm.propTypes = {
	edit: PropTypes.bool,
	sid: PropTypes.number,
	step: PropTypes.number,
	verified: PropTypes.bool
};

/**
 * Memoized custom `UrlInformationStepForm` component
 */
export const MemoizedUrlInformationStepForm = memo(UrlInformationStepForm);

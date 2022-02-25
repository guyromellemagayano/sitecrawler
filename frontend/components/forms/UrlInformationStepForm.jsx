/* eslint-disable-line no-useless-escape */
import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { FormSubmissionInterval } from "@constants/GlobalValues";
import { AddNewSiteLink } from "@constants/PageLinks";
import { handleGetMethod, handlePostMethod, handlePutMethod } from "@helpers/handleHttpMethods";
import { useSites } from "@hooks/useSites";
import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import { Formik } from "formik";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo, useContext, useMemo, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import stringSimilarity from "string-similarity";
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
	const { replace } = useRouter();

	// Custom context
	const { isComponentReady, setConfig } = useContext(SiteCrawlerAppContext);

	// SWR hooks
	const { user, largePageSizeThreshold } = useUser();
	const { sites, sitesResults } = useSites();

	useMemo(() => {
		let isMounted = true;

		if (isMounted) {
			// Update "editMode" state when "edit" prop changes
			if (edit && step === 1 && sid && !verified) {
				setEditMode(edit);
			}

			return { editMode };
		}

		return () => {
			isMounted = false;
		};
	}, [edit, step, sid, verified]);

	useMemo(() => {
		let isMounted = true;

		if (isMounted) {
			if (editMode) {
				if (sitesResults?.length > 0) {
					const siteResult = sitesResults.find((site) => site.id === sid);

					setSiteUrl(siteResult.url);
					setSiteName(siteResult.name);
					setSiteUrlProtocol(siteResult.url.split("://")[0] + "://");
				}
			}

			return { siteUrl, siteName, siteUrlProtocol };
		}

		return () => {
			isMounted = false;
		};
	}, [editMode, sitesResults, sid]);

	const urlRegex = new RegExp(
		/^(www.)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)|\/|\?)*)?$/i
	);

	return (
		<Formik
			enableReinitialize={editMode ? true : false}
			initialValues={{
				siteurlprotocol: editMode ? siteUrlProtocol : "http://",
				siteurl: editMode ? siteUrl?.replace(/^\/\/|^.*?:(\/\/)?/, "") : "",
				sitename: editMode ? siteName : ""
			}}
			validationSchema={Yup.object({
				siteurl: Yup.string().matches(urlRegex, enterValidSiteUrl).max(2048, tooLong).required(requiredField),
				sitename: Yup.string().min(1, tooShort).max(255, tooLong).required(requiredField)
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

					if (siteValidationResponseData !== null && Math.round(siteValidationResponseStatus / 200) === 1) {
						let siteValidationResponseDataResultsArray = [];
						let siteValidationResponseDataResult = null;

						siteValidationResponseData?.results?.map((val) => siteValidationResponseDataResultsArray.push(val.url));

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

							if (siteAdditionResponseData !== null && Math.round(siteAdditionResponseStatus / 100) === 2) {
								// Disable form after successful 200 OK or 201 Created response is issued
								setDisableForm(true);

								// Show alert message after successful 200 OK or 201 Created response is issued
								setConfig({
									isUrlInformationStep: true,
									method: siteAdditionResponseMethod,
									status: siteAdditionResponseStatus
								});

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

								// Show alert message after successful 200 OK or 201 Created response is not issued
								setConfig({
									isUrlInformationStep: true,
									method: siteAdditionResponseMethod,
									status: siteAdditionResponseStatus
								});
							}
						}
					} else {
						// Disable submission and reset form as soon as 200 OK or 201 Created response was issued
						setSubmitting(false);

						// Show alert message after successful 200 OK or 201 Created response is issued
						setConfig({
							isUrlInformationStep: true,
							method: siteValidationResponseMethod,
							status: siteValidationResponseStatus
						});
					}
				} else {
					// Re-enable form for editing
					setDisableForm(!disableForm);

					const urlInformationStepFormResponse = await handleGetMethod(SitesApiEndpoint + sid + "/");
					const urlInformationStepFormResponseData = urlInformationStepFormResponse?.data ?? null;
					const urlInformationStepFormResponseStatus = urlInformationStepFormResponse?.status ?? null;
					const urlInformationStepFormResponseMethod = urlInformationStepFormResponse?.config?.method ?? null;

					if (
						urlInformationStepFormResponseData !== null &&
						Math.round(urlInformationStepFormResponseStatus / 200) === 1
					) {
						const body = {
							url: (values.siteurlprotocol !== "" ? values.siteurlprotocol : "https://") + values.siteurl,
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
									sid: sid ?? null,
									edit: false,
									verified: false
								}
							});
						} else {
							const putUrlInformationStepFormResponse = await handlePutMethod(SitesApiEndpoint + sid + "/", body);
							const putUrlInformationStepFormResponseData = putUrlInformationStepFormResponse?.data ?? null;
							const putUrlInformationStepFormResponseStatus = putUrlInformationStepFormResponse?.status ?? null;
							const putUrlInformationStepFormResponseMethod = putUrlInformationStepFormResponse?.config?.method ?? null;

							if (
								putUrlInformationStepFormResponseData !== null &&
								Math.round(putUrlInformationStepFormResponseStatus / 200) === 1
							) {
								if (!putUrlInformationStepFormResponseData?.verified) {
									// Disable form after successful 200 OK or 201 Created response is issued
									setDisableForm(!disableForm);

									// Show alert message after successful 200 OK or 201 Created response is issued
									setConfig({
										isUrlInformationStep: true,
										method: putUrlInformationStepFormResponseMethod,
										status: putUrlInformationStepFormResponseStatus
									});

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

								// Show alert message after successful 200 OK or 201 Created response is issued
								setConfig({
									isUrlInformationStep: true,
									method: putUrlInformationStepFormResponseMethod,
									status: putUrlInformationStepFormResponseStatus
								});

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
							}
						}
					} else {
						// Disable submission and reset form as soon as 200 OK or 201 Created response was not issued
						setSubmitting(false);

						// Show alert message after successful 200 OK or 201 Created response is issued
						setConfig({
							isUrlInformationStep: true,
							method: urlInformationStepFormResponseMethod,
							status: urlInformationStepFormResponseStatus
						});
					}
				}
			}}
		>
			{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
				<form className="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit}>
					<div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
						<div className="sm:col-span-3">
							<label htmlFor="sitename" className="block text-sm font-medium leading-5 text-gray-700">
								{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
									formSiteNameLabel
								) : (
									<Skeleton duration={2} width={150} height={20} />
								)}
							</label>
							<div className="my-1">
								{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
									<input
										id="sitename"
										type="text"
										name="sitename"
										disabled={isSubmitting}
										placeholder={formSiteNamePlaceholder}
										className={[
											"block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
											isSubmitting || disableForm ? "cursor-not-allowed bg-gray-300 opacity-50" : null,
											errors.sitename && touched.sitename ? "border-red-300" : "border-gray-300"
										]}
										aria-describedby="sitename"
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.sitename}
									/>
								) : (
									<Skeleton duration={2} width={375.5} height={38} />
								)}

								{errors.sitename || touched.sitename ? (
									<span className="mt-2 block text-xs leading-5 text-red-700">
										{errors.sitename && touched.sitename}
									</span>
								) : null}
							</div>
						</div>
						<div className="sm:col-span-3">
							<label htmlFor="siteurl" className="block text-sm font-medium leading-5 text-gray-700">
								{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
									formSiteUrlLabel
								) : (
									<Skeleton duration={2} width={150} height={20} />
								)}
							</label>
							<div className="relative mt-1 rounded-md shadow-sm">
								{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
									<>
										<span className="absolute inset-y-0 left-0 flex items-center">
											<label htmlFor="siteurlprotocol" className="sr-only">
												{formSiteUrlProtocol}
											</label>
											<select
												id="siteurlprotocol"
												name="siteurlprotocol"
												className={[
													"h-full rounded-md border-transparent bg-transparent py-0 pl-3 pr-7 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
													editMode ? "cursor-not-allowed bg-gray-300 opacity-50" : null
												]}
												disabled={isSubmitting || editMode}
												onChange={handleChange}
												onBlur={handleBlur}
												value={editMode ? siteUrlProtocol : values.siteurlprotocol}
											>
												<option value="https://">https://</option>
												<option value="http://">http://</option>
											</select>
										</span>

										<input
											id="siteurl"
											type="text"
											name="siteurl"
											disabled={isSubmitting || editMode}
											className={[
												"block w-full rounded-md border-gray-300 pl-24 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
												editMode || disableForm || isSubmitting
													? "cursor-not-allowed bg-gray-300 text-gray-500 opacity-50"
													: null,
												!disableForm && (errors.siteurl || touched.siteurl) ? "border-red-300" : "border-gray-300"
											]}
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

							{errors.siteurl || touched.siteurl ? (
								<span className="mt-2 block text-xs leading-5 text-red-700">{errors.siteurl || touched.siteurl}</span>
							) : null}
						</div>
						<div className="sm:col-span-6">
							<div className="flex justify-start">
								{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
									<button
										type="submit"
										disabled={
											isSubmitting || disableForm || Object.keys(errors).length > 0 || !urlRegex.test(values.siteurl)
										}
										className={[
											"relative mt-3 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium leading-5 text-white sm:mt-0",
											isSubmitting || disableForm || Object.keys(errors).length > 0 || !urlRegex.test(values.siteurl)
												? "cursor-not-allowed bg-indigo-300 opacity-50"
												: "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
										]}
									>
										{isSubmitting ? submitting : !edit ? proceedToStep2 : updateSiteDetail}
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

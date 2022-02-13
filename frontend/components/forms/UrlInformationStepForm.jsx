/* eslint-disable-line no-useless-escape */
import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { FormSubmissionInterval } from "@constants/GlobalValues";
import { AddNewSiteLink } from "@constants/PageLinks";
import { handleGetMethod, handlePatchMethod, handlePostMethod } from "@helpers/handleHttpMethods";
import { useLoading } from "@hooks/useLoading";
import { useSites } from "@hooks/useSites";
import { SiteCrawlerAppContext } from "@pages/_app";
import { Formik } from "formik";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo, useContext, useEffect, useMemo, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import stringSimilarity from "string-similarity";
import { useSWRConfig } from "swr";
import tw from "twin.macro";
import * as Yup from "yup";

/**
 * Custom function to render the `UrlInformationStepForm` component
 *
 * @param {number} step
 * @param {boolean} edit
 * @param {number} sid
 */
const UrlInformationStepForm = ({ step = null, edit = false, sid = null }) => {
	const [siteData, setSiteData] = useState(null);
	const [siteUrlProtocol, setSiteUrlProtocol] = useState("");
	const [siteUrl, setSiteUrl] = useState("");
	const [siteName, setSiteName] = useState("");
	const [disableForm, setDisableForm] = useState(false);
	const [editMode, setEditMode] = useState(false);

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

	// Update `editMode` state when `edit` prop changes
	useEffect(() => {
		if (typeof edit !== "undefined" && edit !== null) {
			setEditMode(edit);
		}
	}, [edit]);

	// Custom context
	const { user, largePageSizeThreshold, setConfig } = useContext(SiteCrawlerAppContext);

	// SWR hooks
	const { sites, errorSites, validatingSites } = useSites();

	// Custom hooks
	const { isComponentReady } = useLoading();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	useMemo(() => {
		let isMounted = true;

		(async () => {
			if (isMounted) return;

			// Handle `site` data
			if (!validatingSites && !errorSites && sites && !sites?.data?.detail && sites?.data?.results?.length > 0) {
				setSiteData(sites.data.results.filter((site) => site.id === sid));
			}

			return siteData;
		})();

		return () => {
			isMounted = false;
		};
	}, [sid, sites, errorSites, validatingSites]);

	useMemo(() => {
		let isMounted = true;

		(() => {
			if (isMounted) return;

			// Handle `site` details form data
			if (siteData && edit) {
				setSiteUrlProtocol(
					(siteData?.[0]?.url?.indexOf("http://") == 0 || siteData?.[0]?.url?.indexOf("https://") == 0) ?? ""
				);
				setSiteUrl(siteData?.[0]?.url?.replace(/^\/\/|^.*?:(\/\/)?/, "") ?? "");
				setSiteName(siteData?.[0]?.name ?? "");
			} else {
				setSiteUrlProtocol("https://");
				setSiteUrl("");
				setSiteName("");
			}

			return { siteUrl, siteName, siteUrlProtocol };
		})();

		return () => {
			isMounted = false;
		};
	}, [edit, siteData, siteUrl, siteName, siteUrlProtocol]);

	const urlRegex = new RegExp(
		/^(www.)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)|\/|\?)*)?$/i
	);

	return (
		<Formik
			enableReinitialize={editMode}
			initialValues={{
				siteurlprotocol: siteUrlProtocol,
				siteurl: siteUrl,
				sitename: siteName
			}}
			validationSchema={Yup.object({
				siteurl: Yup.string().matches(urlRegex, enterValidSiteUrl).max(2048, tooLong).required(requiredField),
				sitename: Yup.string().min(1, tooShort).max(255, tooLong).required(requiredField)
			})}
			onSubmit={async (values, { setSubmitting, setErrors }) => {
				console.log(edit);

				if (edit) {
					// Re-enable form for editing
					setDisableForm(!disableForm);

					const urlInformationStepFormResponse = await handleGetMethod(SitesApiEndpoint + sid + "/");
					const urlInformationStepFormResponseData = urlInformationStepFormResponse?.data ?? null;
					const urlInformationStepFormResponseStatus = urlInformationStepFormResponse?.status ?? null;
					const urlInformationStepFormResponseMethod = urlInformationStepFormResponse?.config?.method ?? null;

					console.log(edit, urlInformationStepFormResponse);

					if (
						urlInformationStepFormResponseData !== null &&
						Math.round(urlInformationStepFormResponseStatus / 200) === 1
					) {
						// Mutate `sites` endpoint after successful 200 OK or 201 Created response is issued
						await mutate(SitesApiEndpoint);

						const body = {
							name: values.sitename
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
							const patchUrlInformationStepFormResponse = await handlePatchMethod(SitesApiEndpoint + sid + "/", body);
							const patchUrlInformationStepFormResponseData = patchUrlInformationStepFormResponse?.data ?? null;
							const patchUrlInformationStepFormResponseStatus = patchUrlInformationStepFormResponse?.status ?? null;
							const patchUrlInformationStepFormResponseMethod =
								patchUrlInformationStepFormResponse?.config?.method ?? null;

							if (
								patchUrlInformationStepFormResponseData !== null &&
								Math.round(patchUrlInformationStepFormResponseStatus / 200) === 1
							) {
								if (patchUrlInformationStepFormResponseData?.verified) {
									// Disable form after successful 200 OK or 201 Created response is issued
									setDisableForm(!disableForm);

									// Show alert message after successful 200 OK or 201 Created response is issued
									setConfig({
										isUrlInformationStep: true,
										method: patchUrlInformationStepFormResponseMethod,
										status: patchUrlInformationStepFormResponseStatus
									});

									// Update current URL with query for the next step
									replace({
										pathname: AddNewSiteLink,
										query: {
											step: step + 1,
											sid: patchUrlInformationStepFormResponseData?.id ?? null,
											edit: false,
											verified: false
										}
									});

									// Enable next step in site verification process and disable site verification as soon as 200 OK or 201 Created response was issued
									setTimeout(() => {
										setDisableForm(false);
									}, FormSubmissionInterval);
								} else {
									// Disable submission and disable site verification as soon as 200 OK or 201 Created response was not issued
									setSubmitting(false);
									setDisableForm(false);

									// Show alert message after successful 200 OK or 201 Created response is issued
									setConfig({
										isVerifyUrlStep: true,
										method: patchUrlInformationStepFormResponseMethod,
										status: patchUrlInformationStepFormResponseStatus,
										isError: true
									});
								}
							} else {
								// Disable submission as soon as 200 OK or 201 Created response was not issued
								setSubmitting(false);

								// Show alert message after successful 200 OK or 201 Created response is issued
								setConfig({
									isUrlInformationStep: true,
									method: patchUrlInformationStepFormResponseMethod,
									status: patchUrlInformationStepFormResponseStatus
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
				} else {
					const body = {
						url: values.siteurlprotocol !== "" ? values.siteurlprotocol : "https://" + values.siteurl,
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
									query: { step: step + 1, sid: siteAdditionResponseData?.id ?? null, edit: false, verified: false }
								});

								// Mutate `sites` endpoint after successful 200 OK or 201 Created response is issued
								await mutate(SitesApiEndpoint);
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
				}
			}}
		>
			{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
				<form tw="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit}>
					<div tw="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
						<div tw="sm:col-span-3">
							<label htmlFor="sitename" tw="block text-sm font-medium leading-5 text-gray-700">
								{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
									formSiteNameLabel
								) : (
									<Skeleton duration={2} width={150} height={20} />
								)}
							</label>
							<div tw="my-1">
								{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
									<input
										id="sitename"
										type="text"
										name="sitename"
										disabled={isSubmitting}
										placeholder={formSiteNamePlaceholder}
										css={[
											tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md`,
											isSubmitting || disableForm ? tw`opacity-50 bg-gray-300 cursor-not-allowed` : null,
											errors.sitename && touched.sitename ? tw`border-red-300` : tw`border-gray-300`
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
									<span tw="block mt-2 text-xs leading-5 text-red-700">{errors.sitename && touched.sitename}</span>
								) : null}
							</div>
						</div>
						<div tw="sm:col-span-3">
							<label htmlFor="siteurl" tw="block text-sm font-medium leading-5 text-gray-700">
								{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
									formSiteUrlLabel
								) : (
									<Skeleton duration={2} width={150} height={20} />
								)}
							</label>
							<div tw="mt-1 relative rounded-md shadow-sm">
								{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
									<>
										<span tw="absolute inset-y-0 left-0 flex items-center">
											<label htmlFor="siteurlprotocol" tw="sr-only">
												{formSiteUrlProtocol}
											</label>
											<select
												id="siteurlprotocol"
												name="siteurlprotocol"
												css={[
													tw`focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-3 pr-7 border-transparent bg-transparent sm:text-sm rounded-md`,
													editMode ? tw`opacity-50 bg-gray-300 cursor-not-allowed` : null
												]}
												disabled={isSubmitting || editMode}
												onChange={handleChange}
												onBlur={handleBlur}
												value={values.siteurlprotocol}
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
											css={[
												tw`focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-24 sm:text-sm border-gray-300 rounded-md`,
												editMode && disableForm
													? tw`opacity-50 bg-gray-300 cursor-not-allowed`
													: isSubmitting
													? tw`text-gray-500 opacity-50 bg-gray-300 cursor-not-allowed`
													: null,
												!disableForm && (errors.siteurl || touched.siteurl) ? tw`border-red-300` : tw`border-gray-300`
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
								<span tw="block mt-2 text-xs leading-5 text-red-700">{errors.siteurl || touched.siteurl}</span>
							) : null}
						</div>
						<div tw="sm:col-span-6">
							<div tw="flex justify-start">
								{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
									<button
										type="submit"
										disabled={
											isSubmitting || disableForm || Object.keys(errors).length > 0 || !urlRegex.test(values.siteurl)
										}
										css={[
											tw`mt-3 sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600`,
											isSubmitting || disableForm || Object.keys(errors).length > 0 || !urlRegex.test(values.siteurl)
												? tw`opacity-50 bg-indigo-300 cursor-not-allowed`
												: tw`hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
										]}
									>
										{isSubmitting
											? submitting
											: siteData?.id === undefined && !edit
											? proceedToStep2
											: updateSiteDetail}
									</button>
								) : (
									<Skeleton
										duration={2}
										width={82.39}
										height={38}
										tw="w-full mt-3 mr-3 sm:mt-0 inline-flex items-center px-4 py-2"
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
	step: PropTypes.number
};

/**
 * Memoized custom `UrlInformationStepForm` component
 */
export const MemoizedUrlInformationStepForm = memo(UrlInformationStepForm);

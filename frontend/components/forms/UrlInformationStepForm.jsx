/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable-line no-useless-escape */
import { MemoizedAlert } from "@components/alerts";
import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { AddNewSiteLink } from "@constants/PageLinks";
import { handleGetMethod, handlePatchMethod, handlePostMethod } from "@helpers/handleHttpMethods";
import { useAlertMessage } from "@hooks/useAlertMessage";
import { useLoading } from "@hooks/useLoading";
import { useSites } from "@hooks/useSites";
import { useUser } from "@hooks/useUser";
import { Formik } from "formik";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import stringSimilarity from "string-similarity";
import { useSWRConfig } from "swr";
import tw from "twin.macro";
import * as Yup from "yup";

/**
 * Custom function to render the `UrlInformationStepForm` component
 */
export function UrlInformationStepForm(props) {
	const [siteData, setSiteData] = useState(null);
	const [largePageSizeThreshold, setLargePageSizeThreshold] = useState(null);
	const [siteUrlProtocol, setSiteUrlProtocol] = useState("");
	const [siteUrl, setSiteUrl] = useState("");
	const [siteName, setSiteName] = useState("");

	// Props
	const { step, edit, sid } = props;

	// Translations
	const { t } = useTranslation();
	const tooLong = t("common:tooLong");
	const tooShort = t("common:tooShort");
	const submitting = t("common:submitting");
	const requiredField = t("common:requiredField");
	const updateSiteDetail = t("addSite:updateSiteDetail");
	const proceedToStep2 = t("addSite:proceedToStep2");
	const formSiteNameLabel = t("addSite:form.siteName.label");
	const formSiteNamePlaceholder = t("addSite:form.siteName.placeholder");
	const formSiteUrlLabel = t("addSite:form.siteUrl.label");
	const formSiteUrlPlaceholder = t("addSite:form.siteUrl.placeholder");
	const formSiteUrlProtocol = t("addSite:form.siteUrl.protocol");
	const siteUrlAlreadyExists = t("alerts:sites.urlInformation.post.misc.siteUrlAlreadyExists");
	const enterValidSiteUrl = t("alerts:sites.urlInformation.post.misc.enterValidSiteUrl");

	// Router
	const router = useRouter();

	// SWR hooks
	const { user, errorUser, validatingUser } = useUser();
	const { sites, errorSites, validatingSites } = useSites();

	// Custom hooks
	const { state, setConfig } = useAlertMessage();
	const { isComponentReady } = useLoading();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// Handle large page size threshold value from `user` API endpoint
	const handleLargePageSizeThreshold = useCallback(async () => {
		if (!validatingUser) {
			if (!errorUser && typeof user !== "undefined" && user !== null && !user?.data?.detail) {
				setLargePageSizeThreshold(user?.data?.large_page_size_threshold ?? null);
			}
		}
	}, [user, errorUser, validatingUser]);

	useEffect(() => {
		handleLargePageSizeThreshold();
	}, [handleLargePageSizeThreshold]);

	// Handle site data from `sites` API endpoint
	const handleSiteData = useCallback(async () => {
		if (!validatingSites) {
			if (!errorSites && typeof sites !== "undefined" && sites !== null) {
				setSiteData(sites?.data?.results?.length > 0 ? sites?.data?.results?.filter((site) => site?.id === sid) : null);
			}
		}
	}, [sid, sites, errorSites, validatingSites]);

	useEffect(() => {
		handleSiteData();
	}, [handleSiteData]);

	const handleFormData = useCallback(async () => {
		if (!validatingSites) {
			if (!errorSites && typeof sites !== "undefined" && sites !== null && !sites?.data?.detail) {
				if (edit) {
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
			}
		}
	}, [edit, siteData, sites, errorSites, validatingSites]);

	useEffect(() => {
		handleFormData();
	}, [handleFormData]);

	const urlRegex = new RegExp(
		/^(www.)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)|\/|\?)*)?$/i
	);

	return (
		<>
			{state?.responses !== [] && state?.responses?.length > 0 ? (
				<div tw="fixed z-9999 right-2 top-4 bottom-4 flex flex-col justify-start items-end gap-4 overflow-y-auto">
					{state?.responses?.map((value, key) => {
						// Alert Messsages
						const responseText = value?.responseText ?? null;
						const isSuccess = value?.isSuccess ?? null;

						return <MemoizedAlert key={key} responseText={responseText} isSuccess={isSuccess} />;
					}) ?? null}
				</div>
			) : null}

			<Formik
				enableReinitialize={edit ? true : false}
				initialValues={{
					siteurlprotocol: siteUrlProtocol,
					siteurl: siteUrl,
					sitename: siteName
				}}
				validationSchema={Yup.object({
					siteurl: Yup.string().matches(urlRegex, enterValidSiteUrl).max(2048, tooLong).required(requiredField),
					sitename: Yup.string().min(1, tooShort).max(255, tooLong).required(requiredField)
				})}
				onSubmit={async (values, { setSubmitting, resetForm, setErrors }) => {
					if (edit) {
						const urlInformationStepFormResponse = await handleGetMethod(SitesApiEndpoint + sid + "/");
						const urlInformationStepFormData = urlInformationStepFormResponse?.data ?? null;
						const urlInformationStepFormStatus = urlInformationStepFormResponse?.status ?? null;
						const urlInformationStepFormMethod = urlInformationStepFormResponse?.config?.method ?? null;

						if (urlInformationStepFormData !== null && Math.round(urlInformationStepFormStatus / 200) === 1) {
							// Mutate `sites` endpoint after successful 200 OK or 201 Created response is issued
							await mutate(SitesApiEndpoint, false);

							// Show alert message after successful 200 OK or 201 Created response is issued
							setConfig({
								isUrlInformationStep: true,
								method: urlInformationStepFormMethod,
								status: urlInformationStepFormStatus
							});

							const body = {
								name: values.sitename
							};

							const patchUrlInformationStepFormResponse = await handlePatchMethod(SitesApiEndpoint + sid + "/", body);
							const patchUrlInformationStepFormData = patchUrlInformationStepFormResponse?.data ?? null;
							const patchUrlInformationStepFormStatus = patchUrlInformationStepFormResponse?.status ?? null;
							const patchUrlInformationStepFormMethod = patchUrlInformationStepFormResponse?.config?.method ?? null;

							if (
								patchUrlInformationStepFormData !== null &&
								Math.round(patchUrlInformationStepFormStatus / 200) === 1
							) {
								// Show alert message after successful 200 OK or 201 Created response is issued
								setConfig({
									isUrlInformationStep: true,
									method: patchUrlInformationStepFormMethod,
									status: patchUrlInformationStepFormStatus
								});

								// Update current URL with query for the next step
								router.push(
									{
										pathname: AddNewSiteLink,
										query: { step: step + 1, sid: patchUrlInformationStepFormData?.id ?? null, edit: false }
									},
									undefined,
									{}
								);
							} else {
								// Disable submission as soon as 200 OK or 201 Created response was not issued
								setSubmitting(false);

								// Show alert message after successful 200 OK or 201 Created response is issued
								setConfig({
									isUrlInformationStep: true,
									method: patchUrlInformationStepFormMethod,
									status: patchUrlInformationStepFormStatus
								});
							}
						} else {
							// Disable submission and reset form as soon as 200 OK or 201 Created response was not issued
							setSubmitting(false);
							resetForm({ values: "" });
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

						if (
							siteValidationResponseData !== null &&
							Math.round(siteValidationResponseStatus / 200) === 1 &&
							siteValidationResponseData?.results?.length > 0
						) {
							let siteValidationResponseDataResultsArray = new Array();

							siteValidationResponseData?.results?.map((val) => siteValidationResponseDataResultsArray.push(val.url));

							const siteValidationResponseDataResult = stringSimilarity.findBestMatch(
								body.url,
								siteValidationResponseDataResultsArray
							);

							if (siteValidationResponseDataResult?.bestMatch?.rating === 1) {
								// Disable submission and reset form as soon as 200 OK or 201 Created response was issued
								setSubmitting(false);
								resetForm({ values: "" });
								setErrors({ siteurl: siteUrlAlreadyExists });
							} else {
								const siteAdditionResponse = await handlePostMethod(SitesApiEndpoint, body);
								const siteAdditionResponseData = siteAdditionResponse?.data ?? null;
								const siteAdditionResponseStatus = siteAdditionResponse?.status ?? null;
								const siteAdditionResponseMethod = siteAdditionResponse?.config?.method ?? null;

								if (siteAdditionResponseData !== null && Math.round(siteAdditionResponseStatus / 200) === 1) {
									// Mutate `sites` endpoint after successful 200 OK or 201 Created response is issued
									await mutate(SitesApiEndpoint, false);

									// Show alert message after successful 200 OK or 201 Created response is issued
									setConfig({
										isUrlInformationStep: true,
										method: siteAdditionResponseMethod,
										status: siteAdditionResponseStatus
									});

									// Update current URL with query for the next step
									router.push(
										{
											pathname: AddNewSiteLink,
											query: { step: step + 1, sid: siteAdditionResponseData?.id ?? null, edit: false, verified: false }
										},
										undefined,
										{}
									);
								} else {
									// Disable submission and reset form as soon as 200 OK or 201 Created response was issued
									setSubmitting(false);
									resetForm({ values: "" });

									// Show alert message after successful 200 OK or 201 Created response is issued
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
							resetForm({ values: "" });

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
									{isComponentReady ? formSiteNameLabel : <Skeleton duration={2} width={150} height={20} />}
								</label>
								<div tw="my-1">
									{isComponentReady ? (
										<input
											id="sitename"
											type="text"
											name="sitename"
											disabled={isSubmitting}
											placeholder={formSiteNamePlaceholder}
											css={[
												tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md`,
												isSubmitting && tw`opacity-50 bg-gray-300 cursor-not-allowed`,
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
									{isComponentReady ? formSiteUrlLabel : <Skeleton duration={2} width={150} height={20} />}
								</label>
								<div tw="mt-1 relative rounded-md shadow-sm">
									{isComponentReady ? (
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
														edit && tw`opacity-50 bg-gray-300 cursor-not-allowed`
													]}
													disabled={isSubmitting || edit}
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
												disabled={isSubmitting || edit ? true : false}
												css={[
													tw`focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-24 sm:text-sm border-gray-300 rounded-md`,
													edit
														? tw`opacity-50 bg-gray-300 cursor-not-allowed`
														: isSubmitting && tw`text-gray-500 opacity-50 bg-gray-300 cursor-not-allowed`,
													errors.siteurl || touched.siteurl ? tw`border-red-300` : tw`border-gray-300`
												]}
												placeholder={formSiteUrlPlaceholder}
												aria-describedby="siteurl"
												onChange={handleChange}
												onBlur={handleBlur}
												value={edit ? siteData?.[0]?.url?.replace(/^\/\/|^.*?:(\/\/)?/, "") : values.siteurl}
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
									{isComponentReady ? (
										<button
											type="submit"
											disabled={isSubmitting || Object.keys(errors).length > 0 || !urlRegex.test(values.siteurl)}
											css={[
												tw`mt-3 sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600`,
												isSubmitting || Object.keys(errors).length > 0 || !urlRegex.test(values.siteurl)
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
		</>
	);
}

/**
 * Memoized custom `UrlInformationStepForm` component
 */
export const MemoizedUrlInformationStepForm = memo(UrlInformationStepForm);

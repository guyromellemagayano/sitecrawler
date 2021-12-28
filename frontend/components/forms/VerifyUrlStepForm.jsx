/* eslint-disable jsx-a11y/anchor-is-valid */
import { MemoizedAlert } from "@components/alerts";
import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { FormSubmissionInterval } from "@constants/GlobalValues";
import { AddNewSiteLink, DashboardSitesLink } from "@constants/PageLinks";
import { handlePostMethod } from "@helpers/handleHttpMethods";
import { useAlertMessage } from "@hooks/useAlertMessage";
import { useLoading } from "@hooks/useLoading";
import { useSites } from "@hooks/useSites";
import { Formik } from "formik";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSWRConfig } from "swr";
import tw from "twin.macro";

/**
 * Custom function to render the `VerifyUrlStepForm` component
 */
export function VerifyUrlStepForm(props) {
	const [siteData, setSiteData] = useState(null);

	const { sid, step, verified, setDisableSiteVerify, enableNextStep, setEnableNextStep } = props;

	// Translations
	const { t } = useTranslation("sites");
	const goToSiteOverview = t("goToSiteOverview");
	const verifying = t("verifying");
	const verifySiteNow = t("verifySiteNow");
	const verifySiteLater = t("verifySiteLater");
	const updateSiteDetails = t("updateSiteDetails");

	// Router
	const router = useRouter();

	// SWR hooks
	const { sites, errorSites, validatingSites } = useSites();

	// Custom hooks
	const { state, setConfig } = useAlertMessage();
	const { isComponentReady } = useLoading();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	const handleEditMode = async (e) => {
		e.preventDefault();

		// Update current URL with query for the next step
		router.replace(
			{
				pathname: AddNewSiteLink,
				query: { step: step - 1, sid: sid ?? null, edit: true, verified: false }
			},
			undefined,
			{}
		);
	};

	// Handle site data selection based on the given `siteData` prop value
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

			<div tw="mb-5 sm:flex sm:justify-between">
				<div tw="sm:flex sm:justify-start w-full">
					<Formik
						enableReinitialize={true}
						initialValues={{
							verification_id: siteData?.verification_id ?? ""
						}}
						onSubmit={async (values, { setSubmitting }) => {
							const body = {
								verification_id: values.verification_id
							};

							const verifyUrlStepResponse = await handlePostMethod(SitesApiEndpoint + sid + "/verify/", body);
							const verifyUrlStepData = verifyUrlStepResponse?.data ?? null;
							const verifyUrlStepStatus = verifyUrlStepResponse?.status ?? null;
							const verifyUrlStepMethod = verifyUrlStepResponse?.config?.method ?? null;

							if (
								verifyUrlStepData !== null &&
								Math.round(verifyUrlStepStatus / 200) === 1 &&
								verifyUrlStepData?.verified
							) {
								// Mutate `sites` endpoint after successful 200 OK or 201 Created response is issued
								await mutate(SitesApiEndpoint, false);

								// Disable submission as soon as 200 OK or 201 Created response was issued
								setSubmitting(false);

								// Show alert message after successful 200 OK or 201 Created response is issued
								setConfig({
									isVerifyUrlStep: true,
									method: verifyUrlStepMethod,
									status: verifyUrlStepStatus
								});

								// Update router query
								router.replace({
									pathname: AddNewSiteLink,
									query: { step: step + 1, sid: sid ?? null, edit: false, verified: true }
								});

								// Enable next step in site verification process and disable site verification as soon as 200 OK or 201 Created response was issued
								setTimeout(() => {
									setEnableNextStep(!enableNextStep);
									setDisableSiteVerify(false);
								}, FormSubmissionInterval);
							} else {
								// Disable submission and disable site verification as soon as 200 OK or 201 Created response was not issued
								setSubmitting(false);
								setDisableSiteVerify(false);

								// Show alert message after successful 200 OK or 201 Created response is issued
								setConfig({
									isVerifyUrlStep: true,
									method: verifyUrlStepMethod,
									status: verifyUrlStepStatus
								});
							}
						}}
					>
						{({ handleSubmit, isSubmitting, handleChange, values }) => (
							<form tw="sm:flex sm:items-center w-full" onSubmit={handleSubmit}>
								<div tw="flex lg:justify-between w-full">
									{enableNextStep && verified && step == 3 ? (
										<span tw="inline-flex">
											{isComponentReady ? (
												<Link href="/site/[id]/overview/" as={`/site/${sid}/overview/`} passHref replace>
													<a tw="cursor-pointer inline-flex sm:mt-0 relative items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
														{goToSiteOverview}
													</a>
												</Link>
											) : (
												<Skeleton duration={2} width={160} height={38} tw="mr-3" />
											)}
										</span>
									) : isComponentReady && siteData !== null && Object.keys(siteData)?.length > 0 && !verified ? (
										<>
											<div tw="inline-flex items-center justify-start">
												<input
													id="siteVerificationId"
													type="hidden"
													name="sitename"
													disabled={true}
													tw="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md border-gray-300 opacity-50 bg-gray-300 cursor-not-allowed"
													aria-describedby="sitename"
													onChange={handleChange}
													value={values.verification_id}
												/>

												<span tw="inline-flex">
													<button
														type="submit"
														disabled={isSubmitting}
														css={[
															tw`w-full mt-3 mr-3 sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600`,
															isSubmitting
																? tw`opacity-50 cursor-not-allowed`
																: tw`hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
														]}
													>
														{isSubmitting ? verifying : verifySiteNow}
													</button>
												</span>

												<span tw="inline-flex">
													<Link href={DashboardSitesLink} passHref replace>
														<a
															disabled={isSubmitting}
															css={[
																tw`cursor-pointer w-full mt-3 mr-3 sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-yellow-600`,
																isSubmitting
																	? tw`opacity-50 cursor-not-allowed`
																	: tw`hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500`
															]}
														>
															{verifySiteLater}
														</a>
													</Link>
												</span>
											</div>

											<div>
												<span tw="inline-flex">
													<button
														disabled={isSubmitting}
														css={[
															tw`cursor-pointer w-full mt-3 mr-3 sm:mt-0 relative inline-flex items-center px-4 py-2 rounded-md border border-gray-300 text-sm leading-5 font-medium text-gray-700 bg-white`,
															isSubmitting
																? tw`opacity-50 cursor-not-allowed`
																: tw`hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
														]}
														onClick={handleEditMode}
													>
														{updateSiteDetails}
													</button>
												</span>
											</div>
										</>
									) : (
										<>
											<div tw="inline-flex items-center justify-start">
												<span tw="inline-flex">
													<Skeleton duration={2} width={135} height={38} tw="mr-3" />
												</span>

												<span tw="inline-flex">
													<Skeleton duration={2} width={140} height={38} tw="mr-3" />
												</span>
											</div>

											<div>
												<span tw="inline-flex">
													<Skeleton duration={2} width={161} height={38} tw="mr-3" />
												</span>
											</div>
										</>
									)}
								</div>
							</form>
						)}
					</Formik>
				</div>
			</div>
		</>
	);
}

/**
 * Memoized custom `VerifyUrlStepForm` component
 */
export const MemoizedVerifyUrlStepForm = memo(VerifyUrlStepForm);

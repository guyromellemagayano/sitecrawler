import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { FormSubmissionInterval } from "@constants/GlobalValues";
import { AddNewSiteLink, DashboardSitesLink, SiteOverviewSlug } from "@constants/PageLinks";
import { handlePostMethod } from "@helpers/handleHttpMethods";
import { useSites } from "@hooks/useSites";
import { SiteCrawlerAppContext } from "@pages/_app";
import { Formik } from "formik";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSWRConfig } from "swr";
import tw from "twin.macro";

/**
 * Custom function to render the `VerifyUrlStepForm` component
 *
 * @param {number} sid
 * @param {number} step
 * @param {boolean} verified
 * @param {function} setDisableSiteVerify
 */
const VerifyUrlStepForm = ({ sid = null, step = null, verified = false, setDisableSiteVerify }) => {
	const [siteData, setSiteData] = useState(null);

	// Translations
	const { t } = useTranslation("sites");
	const goToSiteOverview = t("goToSiteOverview");
	const verifying = t("verifying");
	const verifySiteNow = t("verifySiteNow");
	const verifySiteLater = t("verifySiteLater");
	const updateSiteDetails = t("updateSiteDetails");

	// Router
	const { replace } = useRouter();

	// Custom context
	const { user, isComponentReady, setConfig } = useContext(SiteCrawlerAppContext);

	// SWR hooks
	const { sites, errorSites } = useSites();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	const handleEditMode = async (e) => {
		e.preventDefault();

		// Update current URL with query for the next step
		replace(
			{
				pathname: AddNewSiteLink,
				query: { step: step - 1, sid: sid ?? null, edit: true, verified: false }
			},
			undefined,
			{}
		);
	};

	// Handle site data selection based on the given `siteData` prop value
	useEffect(() => {
		if (!errorSites && sites) {
			setSiteData(sites?.data?.results?.length > 0 ? sites?.data?.results?.filter((site) => site?.id === sid) : null);
		}
	}, [sid, sites, errorSites]);

	return (
		<div tw="mb-5 sm:flex sm:justify-between">
			<div tw="sm:flex sm:justify-start w-full">
				<Formik
					enableReinitialize={true}
					initialValues={{
						verification_id: siteData?.[0]?.verification_id ?? ""
					}}
					onSubmit={async (values, { setSubmitting }) => {
						const body = {
							verification_id: values.verification_id
						};

						const verifyUrlStepResponse = await handlePostMethod(SitesApiEndpoint + sid + "/verify/", body);
						const verifyUrlStepData = verifyUrlStepResponse?.data ?? null;
						const verifyUrlStepStatus = verifyUrlStepResponse?.status ?? null;
						const verifyUrlStepMethod = verifyUrlStepResponse?.config?.method ?? null;

						if (verifyUrlStepData !== null && Math.round(verifyUrlStepStatus / 200) === 1) {
							if (verifyUrlStepData?.verified) {
								// Disable submission as soon as 200 OK or 201 Created response was issued
								setSubmitting(false);

								// Show alert message after successful 200 OK or 201 Created response is issued
								setConfig({
									isVerifyUrlStep: true,
									method: verifyUrlStepMethod,
									status: verifyUrlStepStatus,
									isError: false
								});

								// Update router query
								replace({
									pathname: AddNewSiteLink,
									query: { step: step + 1, sid: sid ?? null, edit: false, verified: true }
								});

								// Enable next step in site verification process and disable site verification as soon as 200 OK or 201 Created response was issued
								setTimeout(() => {
									setDisableSiteVerify(false);
								}, FormSubmissionInterval);

								// Mutate `sites` endpoint after successful 200 OK or 201 Created response is issued
								await mutate(SitesApiEndpoint);
							} else {
								// Disable submission and disable site verification as soon as 200 OK or 201 Created response was not issued
								setSubmitting(false);
								setDisableSiteVerify(false);

								// Show alert message after successful 200 OK or 201 Created response is issued
								setConfig({
									isVerifyUrlStep: true,
									method: verifyUrlStepMethod,
									status: verifyUrlStepStatus,
									isError: true
								});
							}
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
								{isComponentReady &&
								user &&
								Math.round(user?.status / 100) === 2 &&
								!user?.data?.detail &&
								step === 3 &&
								verified &&
								sid !== null ? (
									<span tw="inline-flex">
										{siteData !== null && Object.keys(siteData)?.length > 0 ? (
											<Link
												href="/sites/[id]/overview/"
												as={`${DashboardSitesLink + sid + SiteOverviewSlug}`}
												passHref
												replace
											>
												<a tw="cursor-pointer inline-flex sm:mt-0 relative items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
													{goToSiteOverview}
												</a>
											</Link>
										) : (
											<Skeleton duration={2} width={160} height={38} tw="mr-3" />
										)}
									</span>
								) : isComponentReady &&
								  user &&
								  Math.round(user?.status / 100) === 2 &&
								  !user?.data?.detail &&
								  step === 2 &&
								  !verified &&
								  sid !== null ? (
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
	);
};

/**
 * Memoized custom `VerifyUrlStepForm` component
 */
export const MemoizedVerifyUrlStepForm = memo(VerifyUrlStepForm);

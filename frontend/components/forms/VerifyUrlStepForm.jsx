import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { FormSubmissionInterval } from "@constants/GlobalValues";
import { AddNewSiteLink, DashboardSitesLink, SiteOverviewSlug } from "@constants/PageLinks";
import { handlePostMethod } from "@helpers/handleHttpMethods";
import { useSites } from "@hooks/useSites";
import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import { Formik } from "formik";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useContext, useMemo, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the "VerifyUrlStepForm" component
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
	const { isComponentReady, setConfig } = useContext(SiteCrawlerAppContext);

	// SWR hooks
	const { user } = useUser();
	const { sites, sitesResults } = useSites();

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

	// Handle site data selection based on the given "siteData" prop value
	useMemo(() => {
		if (sitesResults && sid) {
			setSiteData(sitesResults.filter((site) => site.id === sid));
		}

		return { siteData };
	}, [sid, sitesResults]);

	return (
		<div className="mb-5 sm:flex sm:justify-between">
			<div className="w-full sm:flex sm:justify-start">
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

						if (verifyUrlStepData && Math.round(verifyUrlStepStatus / 200) === 1) {
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

								// Enable next step in site verification process and disable site verification as soon as 200 OK or 201 Created response was issued
								setTimeout(() => {
									setDisableSiteVerify(false);

									// Update router query
									replace({
										pathname: AddNewSiteLink,
										query: { step: step + 1, sid: sid ?? null, edit: false, verified: true }
									});
								}, FormSubmissionInterval);
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
						<form className="w-full sm:flex sm:items-center" onSubmit={handleSubmit}>
							<div className="flex w-full lg:justify-between">
								{isComponentReady &&
								user &&
								Math.round(user?.status / 100) === 2 &&
								!user?.data?.detail &&
								step === 3 &&
								verified &&
								sid ? (
									<span className="inline-flex">
										{siteData && Object.keys(siteData)?.length > 0 ? (
											<Link
												href={DashboardSitesLink + "[id]" + SiteOverviewSlug}
												as={DashboardSitesLink + sid + SiteOverviewSlug}
												passHref
												replace
											>
												<a className="relative inline-flex cursor-pointer items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium leading-5 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:mt-0">
													{goToSiteOverview}
												</a>
											</Link>
										) : (
											<Skeleton duration={2} width={160} height={38} className="mr-3" />
										)}
									</span>
								) : isComponentReady &&
								  user &&
								  Math.round(user?.status / 100) === 2 &&
								  !user?.data?.detail &&
								  step === 2 &&
								  !verified &&
								  sid ? (
									<>
										<div className="inline-flex items-center justify-start">
											<input
												id="siteVerificationId"
												type="hidden"
												name="sitename"
												disabled={true}
												className="block w-full cursor-not-allowed rounded-md border-gray-300 bg-gray-300 opacity-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
												aria-describedby="sitename"
												onChange={handleChange}
												value={values.verification_id}
											/>

											<span className="inline-flex">
												<button
													type="submit"
													disabled={isSubmitting}
													className={classnames(
														"relative mt-3 mr-3 inline-flex w-full items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium leading-5 text-white sm:mt-0",
														isSubmitting
															? "cursor-not-allowed opacity-50"
															: "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
													)}
												>
													{isSubmitting ? verifying : verifySiteNow}
												</button>
											</span>

											<span className="inline-flex">
												<Link href={DashboardSitesLink} passHref replace>
													<a
														disabled={isSubmitting}
														className={classnames(
															"relative mt-3 mr-3 inline-flex w-full cursor-pointer items-center rounded-md border border-transparent bg-yellow-600 px-4 py-2 text-sm font-medium leading-5 text-white sm:mt-0",
															isSubmitting
																? "cursor-not-allowed opacity-50"
																: "hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
														)}
														passHref
														replace
													>
														{verifySiteLater}
													</a>
												</Link>
											</span>
										</div>

										<div>
											<span className="inline-flex">
												<button
													disabled={isSubmitting}
													className={classnames(
														"relative mt-3 mr-3 inline-flex w-full cursor-pointer items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium leading-5 text-gray-700 sm:mt-0",
														isSubmitting
															? "cursor-not-allowed opacity-50"
															: "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
													)}
													onClick={handleEditMode}
												>
													{updateSiteDetails}
												</button>
											</span>
										</div>
									</>
								) : (
									<>
										<div className="inline-flex items-center justify-start">
											<span className="inline-flex">
												<Skeleton duration={2} width={135} height={38} className="mr-3" />
											</span>

											<span className="inline-flex">
												<Skeleton duration={2} width={140} height={38} className="mr-3" />
											</span>
										</div>

										<div>
											<span className="inline-flex">
												<Skeleton duration={2} width={161} height={38} className="mr-3" />
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
 * Memoized custom "VerifyUrlStepForm" component
 */
export const MemoizedVerifyUrlStepForm = memo(VerifyUrlStepForm);

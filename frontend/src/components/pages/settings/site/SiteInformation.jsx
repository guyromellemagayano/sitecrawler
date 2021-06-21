// React
import { useState, useEffect } from "react";

// External
import { Formik } from "formik";
import * as Yup from "yup";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import tw, { styled } from "twin.macro";

// Hooks
import usePatchMethod from "src/hooks/usePatchMethod";

// Components
const ErrorNotification = loadable(() => import("src/components/notifications/ErrorNotification"));
const SuccessNotification = loadable(() => import("src/components/notifications/SuccessNotification"));
const SettingsPersonalSkeleton = loadable(() => import("src/components/skeletons/SettingsPersonalSkeleton"));

const SiteInformationDiv = styled.div``;

const SiteInformation = ({ user, siteId, settingsLabel }) => {
	const [componentReady, setComponentReady] = useState(false);
	const [disableForm, setDisableForm] = useState(true);
	const [errorMsg, setErrorMsg] = useState("");
	const [errorMsgLoaded, setErrorMsgLoaded] = useState(false);
	const [sitename, setSitename] = useState("");
	const [siteurl, setSiteurl] = useState("");
	const [successMsg, setSuccessMsg] = useState("");
	const [successMsgLoaded, setSuccessMsgLoaded] = useState(false);

	const siteIdApiEndpoint = `/api/site/${siteId.id}/`;

	const handleSiteNameInputChange = (e) => {
		setSitename(e.target.value);
	};

	const handleSiteUrlInputChange = (e) => {
		setSiteurl(e.target.value);
	};

	useEffect(() => {
		if (
			user &&
			user !== undefined &&
			Object.keys(user).length > 0 &&
			siteId &&
			siteId !== undefined &&
			Object.keys(siteId).length > 0
		) {
			setSitename(siteId.name);
			setSiteurl(siteId.url);

			setTimeout(() => {
				setComponentReady(true);
			}, 500);
		}
	}, [user, siteId]);

	return componentReady ? (
		<SiteInformationDiv>
			<SuccessNotification
				successMsg={successMsg}
				successMsgLoaded={successMsgLoaded}
				setSuccessMsgLoaded={setSuccessMsgLoaded}
				successMsgTitle={settingsLabel[18].label}
			/>

			<ErrorNotification
				errorMsg={errorMsg}
				errorMsgLoaded={errorMsgLoaded}
				setErrorMsgLoaded={setErrorMsgLoaded}
				errorMsgTitle={settingsLabel[17].label}
			/>

			<div tw="max-w-full p-4">
				<div tw="pt-4 m-auto">
					<h5 tw="text-xl leading-6 font-medium text-gray-900">{settingsLabel[2].label}</h5>
					<p tw="max-w-full mt-2 text-sm leading-5 text-gray-500">{settingsLabel[2].description}</p>
				</div>
			</div>

			<div tw="max-w-full lg:max-w-3xl p-4 pt-0 pb-2">
				<Formik
					enableReinitialize={true}
					initialValues={{
						sitename: sitename
					}}
					validationSchema={Yup.object().shape({
						sitename: Yup.string()
							.min(3, settingsLabel[21].label)
							.max(63, settingsLabel[22].label)
							.required(settingsLabel[20].label)
					})}
					onSubmit={async (values, { setSubmitting }) => {
						const body = {
							name: values.sitename
						};

						try {
							const response = await usePatchMethod(siteIdApiEndpoint, body);
							const data = await response.data;

							if (Math.floor(response.status / 200) === 1) {
								if (data) {
									setTimeout(() => {
										setSubmitting(false);
									}, 1000);

									setDisableForm(true);
									setSuccessMsg(settingsLabel[15].label);
									setSuccessMsgLoaded(true);
								}
							} else {
								if (response) {
									// FIXME: fix error handling
									console.log(response);

									setDisableForm(false);
									setErrorMsg(settingsLabel[14].label);
									setErrorMsgLoaded(true);
								}
							}
						} catch (error) {
							throw error.message;
						}
					}}
				>
					{({ values, errors, handleBlur, handleSubmit, isSubmitting, touched }) => (
						<form tw="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit}>
							<div tw="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-5">
								<div tw="sm:col-span-4">
									<label htmlFor="sitename" tw="block text-sm font-medium leading-5 text-gray-700">
										{settingsLabel[4].label}
									</label>
									<div tw="mt-1 relative flex rounded-md shadow-sm">
										<input
											type="text"
											id="sitename"
											value={values.sitename}
											name="sitename"
											disabled={isSubmitting ? isSubmitting : disableForm}
											css={[
												tw`focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm`,
												(isSubmitting ? isSubmitting : disableForm) && tw`opacity-50 bg-gray-300 cursor-not-allowed`,
												errors.sitename ? tw`border-red-300` : tw`border-gray-300`
											]}
											aria-describedby="username"
											onChange={handleSiteNameInputChange}
											onBlur={handleBlur}
										/>
									</div>
									{errors.sitename && touched.sitename && (
										<span tw="block mt-2 text-xs leading-5 text-red-700">{errors.sitename && errors.sitename}</span>
									)}
								</div>

								<div tw="sm:col-span-4">
									<label htmlFor="siteurl" tw="block text-sm font-medium leading-5 text-gray-700">
										{settingsLabel[5].label}
									</label>
									<div tw="mt-1 rounded-md shadow-sm">
										<input
											id="siteurl"
											type="url"
											value={siteurl}
											disabled={true}
											tw="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm border-gray-300 opacity-50 bg-gray-200 cursor-not-allowed"
											aria-describedby="email"
											onChange={handleSiteUrlInputChange}
										/>
									</div>
								</div>

								<div tw="sm:col-span-4">
									<div tw="flex justify-between flex-col sm:flex-row md:flex-col lg:flex-row">
										<div tw="flex justify-start order-1 sm:flex-row sm:flex-initial sm:w-auto sm:mr-1 lg:order-1 lg:w-full">
											<span tw="inline-flex">
												{!disableForm ? (
													<button
														type="submit"
														disabled={isSubmitting || Object.keys(errors).length > 0}
														css={[
															tw`w-full mt-3 mr-3 sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600`,
															isSubmitting || Object.keys(errors).length > 0
																? tw`opacity-50 cursor-not-allowed`
																: tw`hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`
														]}
													>
														{isSubmitting
															? settingsLabel[19].label
															: !disableForm
															? settingsLabel[8].label
															: settingsLabel[6].label}
													</button>
												) : (
													<button
														type="button"
														disabled={isSubmitting || Object.keys(errors).length > 0}
														css={[
															tw`w-full mt-3 mr-3 sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600`,
															isSubmitting || Object.keys(errors).length > 0
																? tw`opacity-50 cursor-not-allowed`
																: tw`hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
														]}
														onClick={() => setDisableForm(!disableForm)}
													>
														{isSubmitting ? settingsLabel[19].label : settingsLabel[6].label}
													</button>
												)}
											</span>
										</div>
									</div>
								</div>
							</div>
						</form>
					)}
				</Formik>
			</div>
		</SiteInformationDiv>
	) : (
		// FIXME: update this skeleton
		<SettingsPersonalSkeleton />
	);
};

SiteInformation.propTypes = {};

export default SiteInformation;

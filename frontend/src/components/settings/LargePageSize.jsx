// React
import { useState, useEffect } from "react";

// External
import { Formik } from "formik";
import * as Yup from "yup";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import tw from "twin.macro";

// JSON
import GlobalLabel from "public/labels/pages/global.json";

// Hooks
import usePatchMethod from "src/hooks/usePatchMethod";

// Components
const ErrorNotification = loadable(() => import("src/components/notifications/ErrorNotification"));
const SuccessNotification = loadable(() => import("src/components/notifications/SuccessNotification"));
const SettingsLargePageSizeSkeleton = loadable(() => import("src/components/skeletons/SettingsLargePageSizeSkeleton"));

const LargePageSizeSettings = ({ user, site }) => {
	const [componentReady, setComponentReady] = useState(false);
	const [disableForm, setDisableForm] = useState(true);
	const [errorMsg, setErrorMsg] = useState("");
	const [errorMsgLoaded, setErrorMsgLoaded] = useState(false);
	const [largePageSizeThreshold, setLargePageSizeThreshold] = useState("");
	const [successMsg, setSuccessMsg] = useState("");
	const [successMsgLoaded, setSuccessMsgLoaded] = useState(false);

	const userApiEndpoint = "/api/auth/user/";

	useEffect(() => {
		if (
			user &&
			user !== undefined &&
			Object.keys(user).length > 0 &&
			site &&
			site !== undefined &&
			Object.keys(site).length > 0
		) {
			setLargePageSizeThreshold(user.large_page_size_threshold);

			setTimeout(() => {
				setComponentReady(true);
			}, 500);
		}
	}, [user, site]);

	const handleLargePageSizeInputChange = (e) => {
		setLargePageSizeThreshold(e.target.value);
	};

	return componentReady ? (
		<div>
			<SuccessNotification
				successMsg={successMsg}
				successMsgLoaded={successMsgLoaded}
				setSuccessMsgLoaded={setSuccessMsgLoaded}
				successMsgTitle={GlobalLabel[8].label}
			/>
			<ErrorNotification
				errorMsg={errorMsg}
				errorMsgLoaded={errorMsgLoaded}
				setErrorMsgLoaded={setErrorMsgLoaded}
				errorMsgTitle={GlobalLabel[7].label}
			/>
			<div tw="max-w-full py-4 px-8">
				<div tw="pt-4 m-auto">
					<h5 tw="text-xl leading-6 font-medium text-gray-900">{GlobalLabel[2].label}</h5>
					<p tw="max-w-full mt-2 text-sm leading-5 text-gray-500">{GlobalLabel[2].description}</p>
				</div>
			</div>
			<div tw="max-w-full lg:max-w-3xl p-8 pt-0 pb-2">
				<Formik
					enableReinitialize={true}
					initialValues={{ largepagesizethreshold: largePageSizeThreshold }}
					validationSchema={Yup.object().shape({
						largepagesizethreshold: Yup.number().required(GlobalLabel[12].label),
					})}
					onSubmit={async (values, { setSubmitting }) => {
						const body = {
							large_page_size_threshold: values.largepagesizethreshold,
						};

						try {
							const response = await usePatchMethod(userApiEndpoint, body);
							const data = await response.data;

							if (Math.floor(response.status / 200) === 1) {
								if (data) {
									setTimeout(() => {
										setSubmitting(false);
									}, 1000);

									setDisableForm(true);
									setSuccessMsg(GlobalLabel[13].label);
									setSuccessMsgLoaded(true);
								}
							} else {
								if (response) {
									console.log(response);
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
									<label htmlFor="largepagesizethreshold" tw="block text-sm font-medium leading-5 text-gray-700">
										{GlobalLabel[3].label}
									</label>
									<div tw="mt-1 relative flex rounded-md shadow-sm">
										<input
											type="number"
											id="largepagesizethreshold"
											value={values.largepagesizethreshold}
											name="largepagesizethreshold"
											disabled={isSubmitting || disableForm}
											css={[
												tw`focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm`,
												(isSubmitting || disableForm) && tw`opacity-50 bg-gray-300 cursor-not-allowed`,
												errors.largepagesizethreshold ? tw`border-red-300` : tw`border-gray-300`,
											]}
											aria-describedby="largepagesizethreshold"
											onChange={handleLargePageSizeInputChange}
											onBlur={handleBlur}
										/>
									</div>
									{errors.largepagesizethreshold && touched.largepagesizethreshold && (
										<span tw="block mt-2 text-xs leading-5 text-red-700">
											{errors.largepagesizethreshold && errors.largepagesizethreshold}
										</span>
									)}
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
															tw`w-full mt-3 mr-3 ring-1 ring-black ring-opacity-5 sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600`,
															isSubmitting || Object.keys(errors).length > 0
																? tw`opacity-50 cursor-not-allowed`
																: tw`hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`,
														]}
													>
														{isSubmitting
															? GlobalLabel[15].label
															: !disableForm
															? GlobalLabel[17].label
															: GlobalLabel[16].label}
													</button>
												) : (
													<button
														type="button"
														disabled={isSubmitting || Object.keys(errors).length > 0}
														css={[
															tw`w-full mt-3 mr-3 ring-1 ring-black ring-opacity-5 sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600`,
															isSubmitting || Object.keys(errors).length > 0
																? tw`opacity-50 cursor-not-allowed`
																: tw`hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`,
														]}
														onClick={() => setDisableForm(!disableForm)}
													>
														{isSubmitting ? GlobalLabel[15].label : GlobalLabel[16].label}
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
		</div>
	) : (
		<SettingsLargePageSizeSkeleton />
	);
};

LargePageSizeSettings.propTypes = {};

export default LargePageSizeSettings;

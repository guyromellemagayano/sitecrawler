// React
import * as React from "react";

// External
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Cookies from "js-cookie";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import tw, { styled } from "twin.macro";

// JSON
import GlobalLabel from "public/labels/pages/settings/global.json";

// Components
const ErrorNotification = loadable(() => import("src/components/notifications/ErrorNotification"));
const SuccessNotification = loadable(() => import("src/components/notifications/SuccessNotification"));

// Global axios defaults
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["X-CSRFToken"] = Cookies.get("csrftoken");

const LargePageSizeSettingsDiv = styled.div``;

const LargePageSizeSettings = (props) => {
	const [componentReady, setComponentReady] = React.useState(false);
	const [disableForm, setDisableForm] = React.useState(true);
	const [endpoint, setEndpoint] = React.useState("");
	const [errorMsg, setErrorMsg] = React.useState("");
	const [errorMsgLoaded, setErrorMsgLoaded] = React.useState(false);
	const [largePageSizeThreshold, setLargePageSizeThreshold] = React.useState(0);
	const [successMsg, setSuccessMsg] = React.useState("");
	const [successMsgLoaded, setSuccessMsgLoaded] = React.useState(false);

	let siteIdApiEndpoint = "";
	const userApiEndpoint = `/api/auth/user/`;

	React.useEffect(() => {
		props.user !== undefined && props.user.large_page_size_threshold !== null
			? (() => {
					props.siteId !== undefined
						? (() => {
								siteIdApiEndpoint = `/api/site/${props.siteId.id}/`;

								props.siteId.large_page_size_threshold !== null
									? (() => {
											setLargePageSizeThreshold(props.siteId.large_page_size_threshold);
											setEndpoint(siteIdApiEndpoint);
									  })()
									: (() => {
											setLargePageSizeThreshold(props.user.large_page_size_threshold);
											setEndpoint(siteIdApiEndpoint);
									  })();
						  })()
						: (() => {
								setLargePageSizeThreshold(props.user?.large_page_size_threshold);
								setEndpoint(userApiEndpoint);
						  })();
			  })()
			: (() => {
					setLargePageSizeThreshold(props.user.large_page_size_threshold);
					setEndpoint(userApiEndpoint);
			  })();

		props.user !== undefined || props.siteId !== undefined
			? (() => {
					setTimeout(() => {
						setComponentReady(true);
					}, 500);
			  })()
			: null;

		return setComponentReady(false);
	}, [props.user, props.siteId]);

	const handleLargePageSizeInputChange = (e) => {
		setLargePageSizeThreshold(e.target.value);
	};

	return (
		<LargePageSizeSettingsDiv>
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

			<div tw="max-w-full p-4">
				<div tw="pt-4 m-auto">
					<h5 tw="text-xl leading-6 font-medium text-gray-900">{GlobalLabel[2].label}</h5>
					<p tw="max-w-full mt-2 text-sm leading-5 text-gray-500">{GlobalLabel[2].description}</p>
				</div>
			</div>

			<div tw="max-w-full lg:max-w-3xl p-4 pt-0 pb-2">
				<Formik
					enableReinitialize={true}
					initialValues={{ largepagesizethreshold: largePageSizeThreshold }}
					validationSchema={Yup.object().shape({
						largepagesizethreshold: Yup.number().required(GlobalLabel[12].label)
					})}
					onSubmit={async (values, { setSubmitting }) => {
						const body = {
							large_page_size_threshold: values.largepagesizethreshold
						};

						try {
							const response = await axios
								.patch(endpoint, body)
								.then((response) => {
									return response;
								})
								.catch((error) => {
									return error.response;
								});
							const data = await response.data;

							if (Math.floor(response.status / 200) === 1) {
								if (data) {
									setTimeout(() => {
										setSubmitting(false);
									}, 1000);

									setDisableForm(true);
									setSuccessMsg(GlobalLabel[13].label);
									setSuccessMsgLoaded(true);

									if (
										user &&
										user !== undefined &&
										Object.keys(user).length > 0 &&
										user?.large_page_size_threshold &&
										user?.large_page_size_threshold !== null
									) {
										if (siteId && siteId !== undefined && Object.keys(siteId).length > 0) {
											props.mutateSiteId;
										} else {
											props.mutateUser;
										}
									}
								}
							} else {
								if (response) {
									setDisableForm(false);
									setErrorMsg(GlobalLabel[11].label);
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
								<div tw="sm:col-span-3">
									{componentReady ? (
										<>
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
														errors.largepagesizethreshold ? tw`border-red-300` : tw`border-gray-300`
													]}
													aria-describedby="largepagesizethreshold"
													onChange={handleLargePageSizeInputChange}
													onBlur={handleBlur}
												/>
											</div>
										</>
									) : (
										<>
											<Skeleton duration={2} width={150} height={20} tw="block text-sm" />
											<Skeleton duration={2} width={435.17} height={38} tw="mt-1 relative flex " />
										</>
									)}

									{errors.largepagesizethreshold && touched.largepagesizethreshold && (
										<span tw="block mt-2 text-xs leading-5 text-red-700">
											{errors.largepagesizethreshold && errors.largepagesizethreshold}
										</span>
									)}
								</div>

								<div tw="sm:col-span-3">
									<div tw="flex justify-between flex-col sm:flex-row md:flex-col lg:flex-row">
										<div tw="flex justify-start order-1 sm:flex-row sm:flex-initial sm:w-auto sm:mr-1 lg:order-1 lg:w-full">
											<span tw="inline-flex">
												{componentReady ? (
													!disableForm ? (
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
																tw`w-full mt-3 mr-3 sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600`,
																isSubmitting || Object.keys(errors).length > 0
																	? tw`opacity-50 cursor-not-allowed`
																	: tw`hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
															]}
															onClick={() => setDisableForm(!disableForm)}
														>
															{isSubmitting ? GlobalLabel[15].label : GlobalLabel[16].label}
														</button>
													)
												) : (
													<Skeleton
														duration={2}
														width={82.39}
														height={38}
														tw="w-full mt-3 mr-3 sm:mt-0 relative inline-flex items-center px-4 py-2"
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
			</div>
		</LargePageSizeSettingsDiv>
	);
};

LargePageSizeSettings.propTypes = {};

LargePageSizeSettings.defaultProps = {
	site: []
};

export default LargePageSizeSettings;

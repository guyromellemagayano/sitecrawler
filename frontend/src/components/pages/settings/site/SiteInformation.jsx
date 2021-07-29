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
import tw from "twin.macro";

// Components
const ErrorNotification = loadable(() => import("src/components/notifications/ErrorNotification"));
const SuccessNotification = loadable(() => import("src/components/notifications/SuccessNotification"));

// Global axios defaults
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["X-CSRFToken"] = Cookies.get("csrftoken");

const SiteInformation = (props) => {
	const [componentReady, setComponentReady] = React.useState(false);
	const [disableForm, setDisableForm] = React.useState(true);
	const [errorMsg, setErrorMsg] = React.useState("");
	const [errorMsgLoaded, setErrorMsgLoaded] = React.useState(false);
	const [sitename, setSitename] = React.useState("");
	const [siteurl, setSiteurl] = React.useState("");
	const [successMsg, setSuccessMsg] = React.useState("");
	const [successMsgLoaded, setSuccessMsgLoaded] = React.useState(false);

	const siteIdApiEndpoint = `/api/site/${props.siteId.id}/`;

	const handleSiteNameInputChange = (e) => {
		setSitename(e.target.value);
	};

	const handleSiteUrlInputChange = (e) => {
		setSiteurl(e.target.value);
	};

	React.useEffect(() => {
		props.user !== undefined && props.siteId !== undefined
			? (() => {
					setSitename(props.siteId.name);
					setSiteurl(props.siteId.url);

					setTimeout(() => {
						setComponentReady(true);
					}, 500);
			  })()
			: null;

		return setComponentReady(false);
	}, [props.user, props.siteId]);

	return (
		<div>
			<SuccessNotification
				successMsg={successMsg}
				successMsgLoaded={successMsgLoaded}
				setSuccessMsgLoaded={setSuccessMsgLoaded}
				successMsgTitle={props.settingsLabel[18].label}
			/>

			<ErrorNotification
				errorMsg={errorMsg}
				errorMsgLoaded={errorMsgLoaded}
				setErrorMsgLoaded={setErrorMsgLoaded}
				errorMsgTitle={props.settingsLabel[17].label}
			/>

			<div tw="max-w-full p-4">
				<div tw="pt-4 m-auto">
					<h5 tw="text-xl leading-6 font-medium text-gray-900">{props.settingsLabel[2].label}</h5>
					<p tw="max-w-full mt-2 text-sm leading-5 text-gray-500">{props.settingsLabel[2].description}</p>
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
							.min(1, props.settingsLabel[21].label)
							.max(255, props.settingsLabel[22].label)
							.required(props.settingsLabel[20].label)
					})}
					onSubmit={async (values, { setSubmitting }) => {
						const body = {
							name: values.sitename
						};

						const response = await axios
							.patch(siteIdApiEndpoint, body)
							.then((response) => {
								return response;
							})
							.catch((error) => {
								return error.response;
							});
						const data = await response.data;

						Math.floor(response.status / 200) === 1
							? data
								? (() => {
										setTimeout(() => {
											setSubmitting(false);
										}, 1000);

										setDisableForm(true);
										setSuccessMsg(props.settingsLabel[15].label);
										setSuccessMsgLoaded(true);
								  })()
								: null
							: (() => {
									setDisableForm(false);
									setErrorMsg(props.settingsLabel[14].label);
									setErrorMsgLoaded(true);
							  })();
					}}
				>
					{({ values, errors, handleBlur, handleSubmit, isSubmitting, touched }) => (
						<form tw="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit}>
							<div tw="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-5">
								<div tw="sm:col-span-3">
									{componentReady ? (
										<>
											<label htmlFor="sitename" tw="block text-sm font-medium leading-5 text-gray-700">
												{props.settingsLabel[4].label}
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
														(isSubmitting ? isSubmitting : disableForm) &&
															tw`opacity-50 bg-gray-300 cursor-not-allowed`,
														errors.sitename ? tw`border-red-300` : tw`border-gray-300`
													]}
													aria-describedby="username"
													onChange={handleSiteNameInputChange}
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

									{errors.sitename && touched.sitename && (
										<span tw="block mt-2 text-xs leading-5 text-red-700">{errors.sitename && errors.sitename}</span>
									)}
								</div>

								<div tw="sm:col-span-3">
									{componentReady ? (
										<>
											<label htmlFor="siteurl" tw="block text-sm font-medium leading-5 text-gray-700">
												{props.settingsLabel[5].label}
											</label>

											<div tw="mt-1 rounded-md shadow-sm">
												<input
													id="siteurl"
													type="url"
													value={siteurl}
													disabled={true}
													tw="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm border-gray-300 opacity-50 bg-gray-300 cursor-not-allowed"
													aria-describedby="email"
													onChange={handleSiteUrlInputChange}
												/>
											</div>
										</>
									) : (
										<>
											<Skeleton duration={2} width={150} height={20} tw="block text-sm" />
											<Skeleton duration={2} width={435.17} height={38} tw="mt-1 relative flex " />
										</>
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
																? props.settingsLabel[19].label
																: !disableForm
																? props.settingsLabel[8].label
																: props.settingsLabel[6].label}
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
															{isSubmitting ? props.settingsLabel[19].label : props.settingsLabel[6].label}
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
		</div>
	);
};

SiteInformation.propTypes = {};

export default SiteInformation;

// React
import * as React from "react";

// External
import { Formik } from "formik";
import { mutate } from "swr";
import * as Yup from "yup";
import axios from "axios";
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import tw from "twin.macro";

// Enums
import { InformationLabels } from "@enums/InformationLabels";
import { SiteApiEndpoint } from "@enums/ApiEndpoints";
import { AlertLoadInterval, ComponentReadyInterval } from "@enums/GlobalValues";

const UrlInformationStepForm = ({
	currentStep,
	editMode,
	errorMsg,
	errorMsgLoaded,
	setCurrentStep,
	setEditMode,
	setErrorMsg,
	setErrorMsgLoaded,
	setSiteData,
	siteData
}) => {
	const siteApiEndpoint = `${SiteApiEndpoint}?ordering=name`;
	const urlRegex =
		/^(www.)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;

	React.useEffect(() => {
		errorMsg
			? (() => {
					setTimeout(() => {
						setErrorMsgLoaded(true);
					}, ComponentReadyInterval);
			  })()
			: null;
	}, [errorMsg]);

	React.useEffect(() => {
		errorMsgLoaded
			? (() => {
					setTimeout(() => {
						setErrorMsgLoaded(false);
					}, AlertLoadInterval);
			  })()
			: null;
	}, [errorMsgLoaded]);

	const handleSiteSubmission = async (endpoint, body, setSubmitting, resetForm) => {
		const response = await axios
			.post(endpoint, body, {
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					"X-CSRFToken": Cookies.get("csrftoken")
				}
			})
			.then((response) => {
				return response;
			})
			.catch((error) => {
				return error.response;
			});
		const data = await response?.data;

		if (Math.floor(response?.status / 200) === 1) {
			setSubmitting(false);
			resetForm({ values: "" });
			mutate(endpoint);

			data
				? (() => {
						setSiteData({
							...siteData,
							...data
						});
						setCurrentStep(currentStep + 1);
				  })()
				: null;
		} else {
			setSubmitting(false);
			resetForm({ values: "" });
			setErrorMsg(InformationLabels[12]);
			setErrorMsgLoaded(!errorMsgLoaded);

			return null;
		}
	};

	const handleSiteValidation = async (endpoint, body, setSubmitting, resetForm) => {
		const response = await axios
			.get(endpoint, {
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					"X-CSRFToken": Cookies.get("csrftoken")
				}
			})
			.then((response) => {
				return response;
			})
			.catch((error) => {
				return error.response;
			});
		const data = await response?.data;

		if (Math.floor(response?.status / 200) === 1) {
			const siteResult = data?.results.find((site) => site?.url === body?.url);

			if (siteResult !== undefined && siteResult !== null) {
				setSubmitting(false);
				resetForm({ values: "" });
				setErrorMsg(InformationLabels[11].label);
				setErrorMsgLoaded(!errorMsgLoaded);
			} else {
				handleSiteSubmission(endpoint, body, setSubmitting, resetForm);
			}
		} else {
			setSubmitting(false);
			resetForm({ values: "" });
			setErrorMsg(InformationLabels[12]);
			setErrorMsgLoaded(!errorMsgLoaded);

			return null;
		}
	};

	const handleSiteInformationPatch = async (endpoint, body, setSubmitting, resetForm) => {
		const response = await axios
			.patch(endpoint, body, {
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					"X-CSRFToken": Cookies.get("csrftoken")
				}
			})
			.then((response) => {
				return response;
			})
			.catch((error) => {
				return error.response;
			});
		const data = await response?.data;

		if (Math.floor(response?.status / 200) === 1) {
			setSubmitting(false);

			data
				? (() => {
						setSiteData({
							...siteData,
							...data
						});
						setCurrentStep(currentStep + 1);
						setEditMode(false);
				  })()
				: null;
		} else {
			setSubmitting(false);
			resetForm({ values: "" });
			setErrorMsg(InformationLabels[12]);
			setErrorMsgLoaded(!errorMsgLoaded);

			return null;
		}
	};

	const handleSiteInformationUpdate = async (endpoint, values, setSubmitting, resetForm) => {
		const response = await axios
			.get(endpoint, {
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					"X-CSRFToken": Cookies.get("csrftoken")
				}
			})
			.then((response) => {
				return response;
			})
			.catch((error) => {
				return error.response;
			});

		if (Math.floor(response?.status / 200) === 1) {
			const body = {
				name: values?.sitename
			};

			handleSiteInformationPatch(endpoint, body, setSubmitting, resetForm);
		} else {
			setSubmitting(false);
			resetForm({ values: "" });
			setErrorMsg(InformationLabels[12]);
			setErrorMsgLoaded(!errorMsgLoaded);

			return null;
		}
	};

	return (
		<Formik
			enableReinitialize={editMode ? true : false}
			initialValues={{
				siteurlprotocol: "https://",
				siteurl: editMode ? siteData?.url.replace(/^\/\/|^.*?:(\/\/)?/, "") : "",
				sitename: editMode ? siteData?.name : ""
			}}
			validationSchema={Yup.object({
				siteurl: Yup.string()
					.matches(urlRegex, InformationLabels[8].label)
					.max(2048, InformationLabels[20].label)
					.required(InformationLabels[7].label),
				sitename: Yup.string()
					.min(1, InformationLabels[19].label)
					.max(255, InformationLabels[20].label)
					.required(InformationLabels[7].label)
			})}
			onSubmit={(values, { setSubmitting, resetForm }) => {
				if (editMode) {
					handleSiteInformationUpdate(
						SiteApiEndpoint + siteData?.id + "/",
						values,
						setSubmitting,
						resetForm
					);
				} else {
					const body = {
						url: values?.siteurlprotocol + values?.siteurl,
						name: values?.sitename
					};

					handleSiteValidation(siteApiEndpoint, body, setSubmitting, resetForm);
				}
			}}
		>
			{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
				<form tw="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit}>
					<div tw="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
						<div tw="sm:col-span-3">
							<label htmlFor="sitename" tw="block text-sm font-medium leading-5 text-gray-700">
								{InformationLabels[4].label}
							</label>
							<div tw="my-1">
								<input
									id="sitename"
									type="text"
									name="sitename"
									disabled={isSubmitting}
									placeholder={InformationLabels[4].placeholder}
									css={[
										tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md`,
										isSubmitting && tw`opacity-50 bg-gray-300 cursor-not-allowed`,
										(errors.sitename && touched.sitename) || errorMsg
											? tw`border-red-300`
											: tw`border-gray-300`
									]}
									aria-describedby="sitename"
									onChange={handleChange}
									onBlur={handleBlur}
									value={values?.sitename}
								/>

								{errors.sitename && touched.sitename && (
									<span tw="block mt-2 text-xs leading-5 text-red-700">
										{errors.sitename && touched.sitename && errors.sitename}
									</span>
								)}
							</div>
						</div>

						<div tw="sm:col-span-3">
							<label htmlFor="siteurl" tw="block text-sm font-medium leading-5 text-gray-700">
								{InformationLabels[5].label}
							</label>
							<div tw="mt-1 relative rounded-md shadow-sm">
								<div tw="absolute inset-y-0 left-0 flex items-center">
									<label htmlFor="siteurlprotocol" tw="sr-only">
										Site URL Protocol
									</label>
									<select
										id="siteurlprotocol"
										name="siteurlprotocol"
										css={[
											tw`focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-3 pr-7 border-transparent bg-transparent sm:text-sm rounded-md`,
											editMode && tw`opacity-50 bg-gray-300 cursor-not-allowed`
										]}
										disabled={isSubmitting || editMode ? true : false}
										onChange={handleChange}
										onBlur={handleBlur}
										value={values?.siteurlprotocol}
									>
										<option value="https://">https://</option>
										<option value="http://">http://</option>
									</select>
								</div>
								<input
									id="siteurl"
									type="text"
									name="siteurl"
									disabled={isSubmitting || editMode ? true : false}
									css={[
										tw`focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-24 sm:text-sm border-gray-300 rounded-md`,
										editMode
											? tw`opacity-50 bg-gray-300 cursor-not-allowed`
											: isSubmitting && tw`text-gray-500 opacity-50 bg-gray-300 cursor-not-allowed`,
										(errors.siteurl && touched.siteurl) || errorMsg
											? tw`border-red-300`
											: tw`border-gray-300`
									]}
									placeholder={InformationLabels[5].placeholder}
									aria-describedby="siteurl"
									onChange={handleChange}
									onBlur={handleBlur}
									value={
										editMode ? siteData?.url.replace(/^\/\/|^.*?:(\/\/)?/, "") : values?.siteurl
									}
								/>
							</div>

							{errors.siteurl && touched.siteurl && (
								<span tw="block mt-2 text-xs leading-5 text-red-700">
									{errors.siteurl && touched.siteurl && errors.siteurl}
								</span>
							)}
						</div>

						<div tw="sm:col-span-6">
							<div tw="flex justify-start">
								<button
									type="submit"
									disabled={
										isSubmitting ||
										Object.keys(errors).length > 0 ||
										(!Object.keys(values?.siteurl).length > 0 &&
											!urlRegex.test(values?.siteurl) &&
											!Object.keys(values?.sitename).length > 0)
									}
									css={[
										tw`mt-3 sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600`,
										isSubmitting ||
										Object.keys(errors).length > 0 ||
										(!Object.keys(values?.siteurl).length > 0 &&
											!urlRegex.test(values?.siteurl) &&
											!Object.keys(values?.sitename).length > 0)
											? tw`opacity-50 bg-indigo-300 cursor-not-allowed`
											: tw`hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
									]}
								>
									{isSubmitting
										? InformationLabels[10].label
										: siteData?.id === undefined && !editMode
										? InformationLabels[6].label
										: InformationLabels[9].label}
								</button>
							</div>
						</div>
					</div>
				</form>
			)}
		</Formik>
	);
};

UrlInformationStepForm.propTypes = {
	currentStep: PropTypes.number,
	editMode: PropTypes.bool,
	errorMsg: PropTypes.string,
	errorMsgLoaded: PropTypes.bool,
	id: PropTypes.any,
	name: PropTypes.any,
	setCurrentStep: PropTypes.func,
	setEditMode: PropTypes.func,
	setErrorMsg: PropTypes.func,
	setErrorMsgLoaded: PropTypes.func,
	setSiteData: PropTypes.func,
	siteData: PropTypes.shape({
		id: PropTypes.number,
		name: PropTypes.string,
		url: PropTypes.string
	}),
	url: PropTypes.any
};

UrlInformationStepForm.defaultProps = {
	currentStep: null,
	editMode: false,
	errorMsg: null,
	errorMsgLoaded: false,
	setCurrentStep: null,
	setEditMode: null,
	setErrorMsg: null,
	setErrorMsgLoaded: null,
	setSiteData: null,
	siteData: {
		id: null,
		name: null,
		url: null
	}
};

export default UrlInformationStepForm;

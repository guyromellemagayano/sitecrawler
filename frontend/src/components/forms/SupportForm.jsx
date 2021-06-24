// React
import * as React from "react";

// External
import { Formik } from "formik";
import * as Yup from "yup";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import tw from "twin.macro";

// JSON
import SupportLabel from "public/labels/pages/settings/support.json";

// Hooks
import usePostMethod from "src/hooks/usePostMethod";

// Components
const ErrorNotification = loadable(() => import("src/components/notifications/ErrorNotification"));
const SuccessNotification = loadable(() => import("src/components/notifications/SuccessNotification"));

const SupportForm = () => {
	const [disableSupportForm, setDisableSupportForm] = React.useState(false);
	const [errorMsg, setErrorMsg] = React.useState("");
	const [errorMsgLoaded, setErrorMsgLoaded] = React.useState(false);
	const [successMsg, setSuccessMsg] = React.useState("");
	const [successMsgLoaded, setSuccessMsgLoaded] = React.useState(false);

	const contactApiEndpoint = "/api/support/contact/";

	React.useEffect(() => {
		successMsg && successMsg !== ""
			? setTimeout(() => {
					setSuccessMsgLoaded(true);
			  }, 500)
			: null;

		errorMsg && errorMsg !== ""
			? setTimeout(() => {
					setErrorMsgLoaded(true);
			  }, 500)
			: null;
	}, [successMsg, errorMsg]);

	React.useEffect(() => {
		successMsgLoaded
			? setTimeout(() => {
					setSuccessMsgLoaded(false);
			  }, 3500)
			: null;

		errorMsgLoaded
			? setTimeout(() => {
					setErrorMsgLoaded(false);
			  }, 3500)
			: null;
	}, [successMsgLoaded, errorMsgLoaded]);

	return (
		<div>
			<SuccessNotification
				successMsg={successMsg}
				successMsgLoaded={successMsgLoaded}
				setSuccessMsgLoaded={setSuccessMsgLoaded}
				successMsgTitle={SupportLabel[13].label}
			/>

			<ErrorNotification
				errorMsg={errorMsg}
				errorMsgLoaded={errorMsgLoaded}
				setErrorMsgLoaded={setErrorMsgLoaded}
				errorMsgTitle={SupportLabel[12].label}
			/>

			<div tw="max-w-full p-4">
				<div tw="pt-4 m-auto">
					<h5 tw="text-xl leading-6 font-medium text-gray-900">{SupportLabel[6].label}</h5>
					<p tw="max-w-full mt-2 text-sm leading-5 text-gray-500">{SupportLabel[7].label}</p>
				</div>
			</div>

			<div tw="max-w-full lg:max-w-4xl p-4 pt-0 pb-2">
				<Formik
					initialValues={{
						message: ""
					}}
					validationSchema={Yup.object({
						message: Yup.string().required(SupportLabel[2].label)
					})}
					onSubmit={async (values, { setSubmitting, resetForm }) => {
						const body = {
							message: values.message
						};

						const response = await usePostMethod(contactApiEndpoint, body);
						const data = await response.data;

						if (Math.floor(response.status / 200) === 1) {
							if (data) {
								setSuccessMsg(SupportLabel[3].label);
								setSuccessMsgLoaded(!successMsgLoaded);
								setSubmitting(false);
								resetForm({ values: "" });
								setDisableSupportForm(!disableSupportForm);
							}
						} else {
							if (response.data) {
								if (response.data.message) {
									setErrorMsg(response.data.message[0]);
									setErrorMsgLoaded(!errorMsgLoaded);
								}

								if (!response.data.message) {
									setErrorMsg(SupportLabel[5].label);
									setErrorMsgLoaded(!errorMsgLoaded);
								}
							} else {
								setErrorMsg(SupportLabel[5].label);
								setErrorMsgLoaded(!errorMsgLoaded);
								setSubmitting(false);
								resetForm({ values: "" });
							}
						}
					}}
				>
					{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
						<form tw="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit}>
							<div tw="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
								<div tw="sm:col-span-4">
									<label htmlFor="about" tw="block text-sm font-medium text-gray-700">
										{SupportLabel[8].label}
									</label>
									<div tw="my-1">
										<textarea
											id="message"
											name="message"
											rows="8"
											disabled={isSubmitting}
											css={[
												tw`resize-none shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md`,
												isSubmitting && tw`opacity-50 bg-gray-300 cursor-not-allowed`,
												errors.message || errorMsg ? tw`border-red-300` : tw`border-gray-300`
											]}
											placeholder={SupportLabel[9].label}
											onChange={handleChange}
											onBlur={handleBlur}
											value={values.message}
										/>

										{errors.message && touched.message && (
											<span tw="block mt-2 text-xs leading-5 text-red-700">
												{errors.message && touched.message && errors.message}
											</span>
										)}
									</div>
								</div>

								<div tw="sm:col-span-4">
									<div tw="flex justify-start">
										<button
											type="submit"
											disabled={isSubmitting}
											css={[
												tw`cursor-pointer inline-flex sm:mt-0 relative items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600`,
												isSubmitting
													? tw`opacity-50 bg-green-400 cursor-not-allowed`
													: tw`hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`
											]}
										>
											{isSubmitting ? SupportLabel[11].label : SupportLabel[10].label}
										</button>
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

SupportForm.propTypes = {};

export default SupportForm;

// React
import * as React from "react";

// External
import { Formik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import tw from "twin.macro";

// Enums
import { ContactApiEndpoint } from "@enums/ApiEndpoints";
import { SupportFormLabels } from "@enums/SupportFormLabels";

// Hooks
import { usePostMethod } from "@hooks/useHttpMethod";

// Components
import ErrorMessageAlert from "@components/alerts/ErrorMessageAlert";
import SuccessMessageAlert from "@components/alerts/SuccessMessageAlert";

const SupportForm = ({ componentReady }) => {
	const [errorMsg, setErrorMsg] = React.useState([]);
	const [successMsg, setSuccessMsg] = React.useState([]);

	return (
		<div>
			{errorMsg.length > 0
				? errorMsg.map((value, index) => <ErrorMessageAlert key={index} message={value} />)
				: null}

			{successMsg.length > 0
				? successMsg.map((value, index) => <SuccessMessageAlert key={index} message={value} />)
				: null}

			{/* TODO: Develop a separate component, settingsLabel */}
			<div tw="max-w-full p-4">
				<div tw="pt-4 m-auto">
					<h5 tw="text-xl leading-6 font-medium text-gray-900">{SupportFormLabels[6].label}</h5>
					<p tw="max-w-full mt-2 text-sm leading-5 text-gray-500">{SupportFormLabels[7].label}</p>
				</div>
			</div>

			<div tw="max-w-full lg:max-w-3xl p-4 pt-0 pb-2">
				<Formik
					initialValues={{
						message: ""
					}}
					validationSchema={Yup.object({
						message: Yup.string().required(SupportFormLabels[2].label)
					})}
					onSubmit={async (values, { setSubmitting, resetForm }) => {
						const body = {
							message: values.message
						};

						const response = await usePostMethod(ContactApiEndpoint, body);

						setErrorMsg([]);
						setSuccessMsg([]);

						Math.floor(response?.status / 200) === 1
							? (() => {
									resetForm({ values: "" });
									setSubmitting(false);
									setSuccessMsg((successMsg) => [...successMsg, SupportFormLabels[3].label]);
							  })()
							: (() => {
									resetForm({ values: "" });
									setSubmitting(false);

									data
										? setErrorMsg((errorMsg) => [...errorMsg, response?.data?.message[0]])
										: setErrorMsg((errorMsg) => [...errorMsg, SupportFormLabels[5].label]);
							  })();
					}}
				>
					{({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
						<form tw="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit}>
							<div tw="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-5">
								<div tw="sm:col-span-3">
									{componentReady ? (
										<>
											<label htmlFor="about" tw="block text-sm font-medium text-gray-700">
												{SupportFormLabels[8].label}
											</label>
											<div tw="mt-1 relative rounded-md shadow-sm">
												<textarea
													id="message"
													name="message"
													autoFocus={true}
													aria-describedby="message"
													rows="8"
													disabled={isSubmitting}
													css={[
														tw`resize-none shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md`,
														isSubmitting && tw`opacity-50 bg-gray-300 cursor-not-allowed`,
														errors.message ? tw`border-red-300` : tw`border-gray-300`
													]}
													placeholder={SupportFormLabels[9].label}
													onChange={handleChange}
													onBlur={handleBlur}
													value={values.message}
												/>
											</div>
										</>
									) : (
										<>
											<Skeleton duration={2} width={150} height={20} tw="block text-sm" />
											<Skeleton duration={2} width={435.17} height={178} tw="mt-1 relative flex " />
										</>
									)}

									{errors.message && touched.message && (
										<span tw="block mt-2 text-xs leading-5 text-red-700">
											{errors.message && touched.message && errors.message}
										</span>
									)}
								</div>

								<div tw="sm:col-span-3">
									<div tw="flex justify-between flex-col sm:flex-row md:flex-col lg:flex-row">
										<div tw="flex justify-start order-1 sm:flex-row sm:flex-initial sm:w-auto sm:mr-1 lg:order-1 lg:w-full">
											<span tw="inline-flex">
												{componentReady ? (
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
														{isSubmitting
															? SupportFormLabels[11].label
															: SupportFormLabels[10].label}
													</button>
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

SupportForm.propTypes = {
	componentReady: PropTypes.bool
};

SupportForm.defaultProps = {
	componentReady: false
};

export default SupportForm;

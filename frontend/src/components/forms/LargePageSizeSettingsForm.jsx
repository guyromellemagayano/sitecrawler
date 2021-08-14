// React
import * as React from "react";

// External
import { Formik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import tw from "twin.macro";

// Enums
import { GlobalSettingsLabels } from "@enums/GlobalSettingsLabels";

// Hooks
import { usePatchMethod } from "@hooks/useHttpMethod";
import { UserApiEndpoint } from "@enums/ApiEndpoints";

const LargePageSizeSettingsForm = ({
	componentReady,
	endpoint,
	largePageSizeThreshold,
	mutateSiteId,
	mutateUser,
	setErrorMsg,
	siteIdApiEndpoint,
	setLargePageSizeThreshold,
	setSuccessMsg,
	siteId,
	user
}) => {
	const [disableForm, setDisableForm] = React.useState(true);

	const handleLargePageSizeInputChange = (e) => {
		setLargePageSizeThreshold(e.target.value);
	};

	return (
		<Formik
			enableReinitialize={true}
			initialValues={{ largepagesizethreshold: largePageSizeThreshold }}
			validationSchema={Yup.object().shape({
				largepagesizethreshold: Yup.number().required(GlobalSettingsLabels[12].label)
			})}
			onSubmit={async (values, { setSubmitting, resetForm }) => {
				const body = {
					large_page_size_threshold: values.largepagesizethreshold
				};

				const response = await usePatchMethod(endpoint, body);

				setErrorMsg([]);
				setSuccessMsg([]);

				Math.floor(response?.status / 200) === 1
					? (() => {
							resetForm({ values: "" });
							setSubmitting(false);
							setDisableForm(!disableForm);
							setSuccessMsg((successMsg) => [...successMsg, GlobalSettingsLabels[13].label]);
					  })()
					: (() => {
							resetForm({ values: "" });
							setSubmitting(false);
							setDisableForm(!disableForm);
							setErrorMsg((errorMsg) => [...errorMsg, GlobalSettingsLabels[11].label]);
					  })();

				user && user?.large_page_size_threshold
					? (() => {
							siteId && siteId?.large_page_size_threshold
								? (() => {
										mutateSiteId(siteIdApiEndpoint);
								  })()
								: mutateUser(UserApiEndpoint);
					  })()
					: null;
			}}
		>
			{({ errors, handleBlur, handleSubmit, isSubmitting, touched, values }) => (
				<form tw="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit}>
					<div tw="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-5">
						<div tw="sm:col-span-3">
							{componentReady ? (
								<>
									<label
										htmlFor="largepagesizethreshold"
										tw="block text-sm font-medium leading-5 text-gray-700"
									>
										{GlobalSettingsLabels[3].label}
									</label>
									<div tw="mt-1 relative flex rounded-md shadow-sm">
										<input
											type="number"
											id="largepagesizethreshold"
											value={values.largepagesizethreshold}
											autoFocus={true}
											name="largepagesizethreshold"
											disabled={isSubmitting || disableForm}
											css={[
												tw`focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm`,
												(isSubmitting || disableForm) &&
													tw`opacity-50 bg-gray-300 cursor-not-allowed`,
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
									{errors.largepagesizethreshold &&
										touched.largepagesizethreshold &&
										errors.largepagesizethreshold}
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
														? GlobalSettingsLabels[15].label
														: !disableForm
														? GlobalSettingsLabels[17].label
														: GlobalSettingsLabels[16].label}
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
													{isSubmitting
														? GlobalSettingsLabels[15].label
														: !disableForm
														? GlobalSettingsLabels[17].label
														: GlobalSettingsLabels[16].label}
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
	);
};

LargePageSizeSettingsForm.propTypes = {
	componentReady: PropTypes.bool,
	endpoint: PropTypes.string,
	large_page_size_threshold: PropTypes.number,
	largePageSizeThreshold: PropTypes.number,
	mutateSiteId: PropTypes.func,
	mutateUser: PropTypes.func,
	setErrorMsg: PropTypes.func,
	setLargePageSizeThreshold: PropTypes.func,
	setSuccessMsg: PropTypes.func,
	siteId: PropTypes.object,
	siteIdApiEndpoint: PropTypes.any
};

LargePageSizeSettingsForm.defaultProps = {
	componentReady: false,
	endpoint: null,
	large_page_size_threshold: null,
	largePageSizeThreshold: null,
	mutateSiteId: null,
	mutateUser: null,
	setErrorMsg: null,
	setLargePageSizeThreshold: null,
	setSuccessMsg: null,
	siteId: null,
	siteIdApiEndpoint: null
};

export default LargePageSizeSettingsForm;

// React
import * as React from "react";

// External
import { Formik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import tw from "twin.macro";

// Enums
import { SettingsLabels } from "@enums/SettingsLabels";
import { SiteApiEndpoint } from "@enums/ApiEndpoints";

// Hooks
import { usePatchMethod } from "@hooks/useHttpMethod";

const SiteInformationSettingsForm = ({
	componentReady,
	mutateSite,
	mutateSiteId,
	setErrorMsg,
	setSuccessMsg,
	siteId
}) => {
	const [disableForm, setDisableForm] = React.useState(true);
	const [sitename, setSitename] = React.useState("");
	const [siteurl, setSiteUrl] = React.useState("");

	const sitenameRef = React.useRef();
	const siteIdApiEndpoint = `${SiteApiEndpoint + siteId?.id}/`;

	React.useEffect(() => {
		siteId
			? (() => {
					setSitename(siteId?.name);
					setSiteUrl(siteId?.url);
			  })()
			: null;

		return { sitename, siteurl };
	}, [siteId]);

	React.useEffect(() => {
		!disableForm ? sitenameRef.current.focus() : setDisableForm(true);
	}, [disableForm]);

	const handleSiteNameInputChange = (e) => {
		setSitename(e.target.value);
	};

	const handleSiteUrlInputChange = (e) => {
		setSiteUrl(e.target.value);
	};

	return (
		<Formik
			enableReinitialize={true}
			initialValues={{
				sitename: sitename
			}}
			validationSchema={Yup.object().shape({
				sitename: Yup.string()
					.min(1, SettingsLabels[21].label)
					.max(255, SettingsLabels[22].label)
					.required(SettingsLabels[20].label)
			})}
			onSubmit={async (values, { setSubmitting, resetForm }) => {
				const body = {
					name: values.sitename
				};

				const response = await usePatchMethod(siteIdApiEndpoint, body);

				setErrorMsg([]);
				setSuccessMsg([]);

				Math.floor(response?.status / 200) === 1
					? (() => {
							resetForm({ values: "" });
							setSubmitting(false);
							setDisableForm(!disableForm);
							setSuccessMsg((successMsg) => [...successMsg, SettingsLabels[15].label]);
					  })()
					: (() => {
							resetForm({ values: "" });
							setSubmitting(false);
							setDisableForm(!disableForm);
							setErrorMsg((errorMsg) => [...errorMsg, SettingsLabels[14].label]);
					  })();

				mutateSiteId(siteIdApiEndpoint);
			}}
		>
			{({ errors, handleBlur, handleSubmit, isSubmitting, touched, values }) => (
				<form tw="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit}>
					<div tw="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-5">
						<div tw="sm:col-span-3">
							{componentReady ? (
								<>
									<label htmlFor="sitename" tw="block text-sm font-medium leading-5 text-gray-700">
										{SettingsLabels[4].label}
									</label>
									<div tw="mt-1 relative flex rounded-md shadow-sm">
										<input
											ref={sitenameRef}
											type="text"
											id="sitename"
											value={values.sitename}
											autoFocus={true}
											name="sitename"
											disabled={isSubmitting || disableForm}
											css={[
												tw`focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm`,
												(isSubmitting || disableForm) &&
													tw`opacity-50 bg-gray-300 cursor-not-allowed`,
												errors.sitename ? tw`border-red-300` : tw`border-gray-300`
											]}
											aria-describedby="sitename"
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
								<span tw="block mt-2 text-xs leading-5 text-red-700">
									{errors.sitename && touched.sitename && errors.sitename}
								</span>
							)}
						</div>

						<div tw="sm:col-span-3">
							{componentReady ? (
								<>
									<label htmlFor="siteurl" tw="block text-sm font-medium leading-5 text-gray-700">
										{SettingsLabels[5].label}
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
														? SettingsLabels[19].label
														: !disableForm
														? SettingsLabels[8].label
														: SettingsLabels[6].label}
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
														? SettingsLabels[19].label
														: !disableForm
														? SettingsLabels[8].label
														: SettingsLabels[6].label}
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

SiteInformationSettingsForm.propTypes = {
	componentReady: PropTypes.bool,
	mutateSite: PropTypes.func,
	mutateSiteId: PropTypes.func,
	mutateUser: PropTypes.func,
	setErrorMsg: PropTypes.func,
	setSuccessMsg: PropTypes.func,
	id: PropTypes.number,
	name: PropTypes.string,
	url: PropTypes.string,
	user: PropTypes.object
};

SiteInformationSettingsForm.defaultProps = {
	componentReady: false,
	mutateSite: null,
	mutateSiteId: null,
	mutateUser: null,
	setErrorMsg: null,
	setSuccessMsg: null,
	id: null,
	name: null,
	url: null,
	user: null
};

export default SiteInformationSettingsForm;

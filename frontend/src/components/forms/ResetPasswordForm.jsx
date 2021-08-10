// React
import * as React from "react";

// External
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Cookies from "js-cookie";
import tw from "twin.macro";

// Enums
import { ResetPasswordApiEndpoint } from "@enums/ApiEndpoints";
import { ResetPasswordLabels } from "@enums/ResetPasswordLabels";

// Components
import ErrorMessageAlert from "@components/alerts/ErrorMessageAlert";
import SuccessMessageAlert from "@components/alerts/SuccessMessageAlert";

const ResetPasswordForm = () => {
	const [errorMsg, setErrorMsg] = React.useState("");
	const [successMsg, setSuccessMsg] = React.useState("");

	return (
		<>
			{errorMsg ? (
				<ErrorMessageAlert message={errorMsg} />
			) : successMsg ? (
				<SuccessMessageAlert message={successMsg} />
			) : null}

			<Formik
				initialValues={{
					email: ""
				}}
				validationSchema={Yup.object({
					email: Yup.string()
						.email(ResetPasswordLabels[1].label)
						.required(ResetPasswordLabels[0].label)
				})}
				onSubmit={async (values, { setSubmitting, resetForm }) => {
					const body = {
						email: values.email
					};

					await axios
						.post(ResetPasswordApiEndpoint, body, {
							headers: {
								Accept: "application/json",
								"Content-Type": "application/json",
								"X-CSRFToken": Cookies.get("csrftoken")
							}
						})
						.then((response) => {
							Math.floor(response.status / 200) === 1
								? (() => {
										setErrorMsg("");
										resetForm({ values: "" });
										setSubmitting(false);
										setSuccessMsg(response.data.detail);
								  })()
								: (() => {
										setSubmitting(false);
										resetForm({ values: "" });
										setErrorMsg(ResetPasswordLabels[3].label);
								  })();
						})
						.catch((error) => {
							setSubmitting(false);
							resetForm({ values: "" });
							setErrorMsg(ResetPasswordLabels[3].label);
						});
				}}
			>
				{({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
					<form onSubmit={handleSubmit}>
						<div tw="mt-1">
							<label htmlFor="email" tw="block text-sm font-medium leading-5 text-gray-700">
								{ResetPasswordLabels[4].label}
							</label>
							<div tw="mt-1 rounded-md shadow-sm">
								<input
									id="email"
									type="email"
									name="email"
									disabled={isSubmitting}
									css={[
										tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md`,
										isSubmitting &&
											tw`opacity-50 bg-gray-300 cursor-not-allowed pointer-events-none`,
										errors.email || errorMsg ? tw`border-red-300` : tw`border-gray-300`
									]}
									aria-describedby="email"
									onChange={handleChange}
									value={values.email}
								/>
							</div>

							{errors.email && touched.email && (
								<span tw="block mt-2 text-xs leading-5 text-red-700">
									{errors.email && touched.email && errors.email}
								</span>
							)}
						</div>

						<div tw="mt-6">
							<span tw="block w-full rounded-md shadow-sm">
								<button
									type="submit"
									disabled={isSubmitting}
									css={[
										tw`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600`,
										isSubmitting
											? tw`opacity-50 bg-indigo-300 cursor-not-allowed pointer-events-none`
											: tw`hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
									]}
								>
									{isSubmitting ? ResetPasswordLabels[6].label : ResetPasswordLabels[5].label}
								</button>
							</span>
						</div>
					</form>
				)}
			</Formik>
		</>
	);
};

export default ResetPasswordForm;

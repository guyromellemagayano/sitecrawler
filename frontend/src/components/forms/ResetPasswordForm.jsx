// React
import * as React from "react";

// NextJS
import dynamic from "next/dynamic";

// External
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Cookies from "js-cookie";
import tw from "twin.macro";

// Enums
import { ResetPasswordApiEndpoint } from "@enums/ApiEndpoints";
import { ResetPasswordLabels } from "@enums/ResetPasswordLabels";
import { usePostMethod } from "@hooks/useHttpMethod";

// Components
const ErrorMessageAlert = dynamic(() => import("@components/alerts/ErrorMessageAlert"));
const SuccessMessageAlert = dynamic(() => import("@components/alerts/SuccessMessageAlert"));

const ResetPasswordForm = () => {
	const [errorMsg, setErrorMsg] = React.useState([]);
	const [successMsg, setSuccessMsg] = React.useState([]);

	return (
		<>
			{errorMsg.length > 0
				? errorMsg.map((value, index) => <ErrorMessageAlert key={index} message={value} />)
				: null}

			{successMsg.length > 0
				? successMsg.map((value, index) => <SuccessMessageAlert key={index} message={value} />)
				: null}

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

					const response = await usePostMethod(ResetPasswordApiEndpoint, body);

					Math.floor(response?.status / 200) === 1
						? (() => {
								resetForm({ values: "" });
								setSubmitting(false);
								setSuccessMsg((successMsg) => [...successMsg, response?.data?.detail]);
						  })()
						: (() => {
								resetForm({ values: "" });
								setSubmitting(false);
								setErrorMsg((errorMsg) => [...errorMsg, ResetPasswordLabels[3].label]);
						  })();
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
									autoFocus={true}
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

// React
import * as React from "react";

// NextJS
import Link from "next/link";

// External
import "twin.macro";
import { NextSeo } from "next-seo";
import { Scrollbars } from "react-custom-scrollbars-2";
import PropTypes from "prop-types";
import ReactHtmlParser from "react-html-parser";

// JSON
import ResetPasswordLabel from "public/labels/pages/reset-password.json";

// Layout
import Layout from "src/components/Layout";

// Components
import { UpdatePasswordForm } from "src/components/forms/ResetPasswordForm";
import LogoLabel from "src/components/labels/LogoLabel";

const ResetPasswordForm = ({ result }) => {
	const pageTitle = "Reset Password Form";
	const loginLink = "/login/";

	return (
		<Layout>
			<NextSeo title={pageTitle} />

			<div tw="bg-gray-50 overflow-auto h-screen">
				<Scrollbars universal>
					<div tw="flex flex-col justify-center h-full">
						<div tw="relative py-12 sm:px-6 lg:px-8">
							<LogoLabel isResetPassword />

							<div tw="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
								<UpdatePasswordForm
									result={result}
									label={[
										ResetPasswordLabel[0].label,
										ResetPasswordLabel[11].label,
										ResetPasswordLabel[3].label,
										ResetPasswordLabel[12].label,
										ResetPasswordLabel[13].label,
										ResetPasswordLabel[6].label,
										ResetPasswordLabel[5].label
									]}
								/>

								<div tw="relative flex justify-center flex-wrap flex-row text-sm leading-5">
									<span tw="px-2 py-5 text-gray-500">
										{ReactHtmlParser(ResetPasswordLabel[7].label)}
										<Link href={loginLink}>
											<a tw="font-medium text-indigo-600 cursor-pointer hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
												{ResetPasswordLabel[8].label}
											</a>
										</Link>
									</span>
								</div>
							</div>
						</div>
					</div>
				</Scrollbars>
			</div>
		</Layout>
	);
};

ResetPasswordForm.propTypes = {};

export default ResetPasswordForm;

export async function getServerSideProps(ctx) {
	return {
		props: {
			result: ctx.query
		}
	};
}

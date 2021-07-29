// React
import * as React from "react";

// NextJS
import Link from "next/link";

// External
import "twin.macro";
import { NextSeo } from "next-seo";
import { Scrollbars } from "react-custom-scrollbars-2";
import ReactHtmlParser from "react-html-parser";

// JSON
import ResetPasswordLabel from "public/labels/pages/reset-password.json";

// Layout
import Layout from "src/components/Layout";

// Components
import { ResetPasswordForm } from "src/components/forms/ResetPasswordForm";
import LogoLabel from "src/components/labels/LogoLabel";

const ResetPassword = () => {
	const pageTitle = "Reset Password";
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
								<ResetPasswordForm
									label={[
										ResetPasswordLabel[1].label,
										ResetPasswordLabel[0].label,
										ResetPasswordLabel[3].label,
										ResetPasswordLabel[4].label,
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

export default ResetPassword;

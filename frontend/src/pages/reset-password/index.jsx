// React
import * as React from "react";

// NextJS
import Link from "next/link";

// External
import "twin.macro";
import { NextSeo } from "next-seo";
import { Scrollbars } from "react-custom-scrollbars-2";
import ReactHtmlParser from "react-html-parser";

// Enums
import { LoginLink } from "@enums/PageLinks";
import { ResetPasswordLabels } from "@enums/ResetPasswordLabels";

// Components
import Layout from "@components/layouts";
import LogoLabel from "@components/labels/LogoLabel";
import ResetPasswordForm from "@components/forms/ResetPasswordForm";

const ResetPassword = () => {
	return (
		<Layout>
			<NextSeo title={ResetPasswordLabels[5].label} />

			<div tw="bg-gray-50 overflow-auto h-screen">
				<Scrollbars universal>
					<div tw="flex flex-col justify-center h-full">
						<div tw="relative py-12 sm:px-6 lg:px-8">
							<LogoLabel isResetPassword />

							<div tw="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
								<div tw="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
									<ResetPasswordForm />
								</div>

								<div tw="relative flex justify-center flex-wrap flex-row text-sm leading-5">
									<span tw="px-2 py-5 text-gray-500">
										{ReactHtmlParser(ResetPasswordLabels[7].label)}
										<Link href={LoginLink}>
											<a tw="font-medium text-indigo-600 cursor-pointer hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
												{ResetPasswordLabels[8].label}
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

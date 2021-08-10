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

// Enums
import { LoginLink } from "@enums/PageLinks";
import { ResetPasswordLabels } from "@enums/ResetPasswordLabels";

// Components
import Layout from "@components/layouts";
import LogoLabel from "@components/labels/LogoLabel";
import UpdatePasswordForm from "@components/forms/UpdatePasswordForm";

const ResetPasswordForm = ({ result }) => {
	return (
		<Layout>
			<NextSeo title={ResetPasswordLabels[14].label} />

			<div tw="bg-gray-50 overflow-auto h-screen">
				<Scrollbars universal>
					<div tw="flex flex-col justify-center h-full">
						<div tw="relative py-12 sm:px-6 lg:px-8">
							<LogoLabel isResetPassword />

							<div tw="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
								<div tw="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
									<UpdatePasswordForm result={result} />
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

ResetPasswordForm.propTypes = {
	result: PropTypes.shape({
		id: PropTypes.array
	})
};

ResetPasswordForm.propTypes = {
	result: {
		id: null
	}
};

export default ResetPasswordForm;

export async function getServerSideProps(ctx) {
	return {
		props: {
			result: ctx.query
		}
	};
}

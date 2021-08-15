// React
import * as React from "react";

// NextJS
import dynamic from "next/dynamic";
import Link from "next/link";

// External
import "twin.macro";
import { NextSeo } from "next-seo";
import { Scrollbars } from "react-custom-scrollbars-2";
import PropTypes from "prop-types";
import ReactHtmlParser from "react-html-parser";

// Enums
import { LoginLink } from "@enums/PageLinks";
import { SignupLabels } from "@enums/SignupLabels";

// Components
const Layout = dynamic(() => import("@components/layouts"));
const LogoLabel = dynamic(() => import("@components/labels/LogoLabel"));
const SignupForm = dynamic(() => import("@components/forms/SignupForm"));

const AddPassword = ({ result }) => {
	return (
		<Layout>
			<NextSeo title={SignupLabels[14].label} />

			<div tw="bg-gray-50 overflow-auto h-screen">
				<Scrollbars universal>
					<div tw="flex flex-col justify-center h-full">
						<div tw="relative py-12 sm:px-6 lg:px-8">
							<LogoLabel isAddPassword />

							<div tw="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
								<div tw="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
									<SignupForm result={result} />
								</div>

								<div tw="relative flex justify-center flex-wrap flex-row text-sm leading-5">
									<span tw="px-2 py-5 text-gray-500">
										{ReactHtmlParser(SignupLabels[12].label)}
										<Link href={LoginLink}>
											<a tw="font-medium text-indigo-600 cursor-pointer hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
												{SignupLabels[13].label}
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

AddPassword.propTypes = {
	id: PropTypes.array
};

AddPassword.defaultProps = {
	id: null
};

export default AddPassword;

export async function getServerSideProps(ctx) {
	return {
		props: {
			result: ctx.query
		}
	};
}

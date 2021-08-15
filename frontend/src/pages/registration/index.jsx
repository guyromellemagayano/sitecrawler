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
import { RegistrationLabels } from "@enums/RegistrationLabels";

// Components
import Layout from "@components/layouts";
import LogoLabel from "@components/labels/LogoLabel";
import RegistrationForm from "@components/forms/RegistrationForm";

const Registration = () => {
	return (
		<Layout>
			<NextSeo title={RegistrationLabels[23].label} />

			<div tw="bg-gray-50 overflow-auto h-screen">
				<Scrollbars universal>
					<div tw="block mx-auto xl:max-w-screen-xl mb-8 sm:mb-16 md:mb-20 lg:mb-24">
						<div tw="relative my-8 sm:my-16 md:my-20 lg:my-24">
							<LogoLabel isSignUp />

							<div tw="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
								<div tw="bg-white mt-8 py-8 px-4 shadow-xl rounded-lg sm:px-10">
									<RegistrationForm />
								</div>

								<div tw="relative flex justify-center flex-wrap flex-row text-sm leading-5">
									<span tw="text-center px-2 py-5 text-gray-500">
										{ReactHtmlParser(RegistrationLabels[16].label)}
										<a
											href="/service-terms"
											tw="font-medium text-indigo-600 cursor-pointer hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150"
										>
											{RegistrationLabels[17].label}
										</a>
										&nbsp;and&nbsp;
										<a
											href="/privacy-policy"
											tw="font-medium text-indigo-600 cursor-pointer hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150"
										>
											{RegistrationLabels[18].label}
										</a>
									</span>
								</div>

								<div tw="relative flex justify-center flex-wrap flex-row text-sm leading-5">
									<span tw="p-2 text-gray-600">
										{ReactHtmlParser(RegistrationLabels[19].label)}
										<Link href={LoginLink}>
											<a tw="font-medium text-indigo-600 cursor-pointer hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
												{RegistrationLabels[20].label}
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

export default Registration;

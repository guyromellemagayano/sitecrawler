// React
import * as React from "react";

// NextJS
import Link from "next/link";

// External
import { NextSeo } from "next-seo";
import { Scrollbars } from "react-custom-scrollbars-2";
import PropTypes from "prop-types";
import ReactHtmlParser from "react-html-parser";
import tw from "twin.macro";

// JSON
import RegistrationLabel from "public/labels/pages/registration.json";

// Layout
import Layout from "src/components/Layout";

// Components
import SiteFooter from "src/components/layouts/Footer";
import LogoLabel from "src/components/labels/LogoLabel";
import RegistrationForm from "src/components/forms/RegistrationForm";

const Registration = () => {
	const pageTitle = "Registration";

	return (
		<Layout>
			<NextSeo title={pageTitle} />

			<div tw="bg-gray-50 overflow-auto h-screen">
				<Scrollbars universal>
					<div tw="flex flex-col justify-start mx-auto h-full xl:max-w-screen-xl">
						<div tw="relative mt-8 sm:mt-16 md:mt-20 lg:mt-24">
							<LogoLabel isSignUp />

							<div tw="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
								<RegistrationForm
									label={[
										RegistrationLabel[0].label,
										RegistrationLabel[1].label,
										RegistrationLabel[10].label,
										RegistrationLabel[11].label,
										RegistrationLabel[12].label,
										RegistrationLabel[13].label,
										RegistrationLabel[14].label,
										RegistrationLabel[15].label,
										RegistrationLabel[2].label,
										RegistrationLabel[3].label,
										RegistrationLabel[5].label,
										RegistrationLabel[6].label,
										RegistrationLabel[7].label,
										RegistrationLabel[8].label,
										RegistrationLabel[9].label
									]}
								/>

								<div tw="relative flex justify-center flex-wrap flex-row text-sm leading-5">
									<span tw="text-center px-2 py-5 text-gray-500">
										{ReactHtmlParser(RegistrationLabel[16].label)}
										<Link href="/service-terms">
											<a tw="font-medium text-indigo-600 cursor-pointer hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
												{RegistrationLabel[17].label}
											</a>
										</Link>
										&nbsp;and&nbsp;
										<Link href="/privacy-policy">
											<a tw="font-medium text-indigo-600 cursor-pointer hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
												{RegistrationLabel[18].label}
											</a>
										</Link>
									</span>
								</div>

								<div tw="relative flex justify-center flex-wrap flex-row text-sm leading-5">
									<span tw="p-2 text-gray-600">
										{ReactHtmlParser(RegistrationLabel[19].label)}
										<Link href="/login">
											<a tw="font-medium text-indigo-600 cursor-pointer hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
												{RegistrationLabel[20].label}
											</a>
										</Link>
									</span>
								</div>
							</div>

							<div tw="px-4 xl:px-10 xl:mt-16">
								<SiteFooter />
							</div>
						</div>
					</div>
				</Scrollbars>
			</div>
		</Layout>
	);
};

Registration.propTypes = {};

export default Registration;

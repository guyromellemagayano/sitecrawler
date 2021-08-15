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
import { AccountExistsLabels } from "@enums/AccountExistsLabels";

// Components
import Layout from "@components/layouts";

const AccountExist = () => {
	const pageTitle = "Account Exist";

	return (
		<Layout>
			<NextSeo title={pageTitle} />

			<div tw="overflow-auto h-screen">
				<Scrollbars universal>
					{/* TODO: Update UI of this page */}
					<div tw="flex flex-col justify-center h-full">
						<div tw="relative py-12 sm:px-6 lg:px-8">
							{AccountExistsLabels.map((val, key) => {
								return (
									<div
										key={key}
										tw="max-w-lg min-h-screen flex flex-col justify-center mx-auto py-12 sm:px-6 lg:px-8"
									>
										<div tw="bg-white rounded-lg">
											<div tw="px-4 py-5 sm:p-6">
												<h3 tw="text-lg leading-6 font-medium text-red-600">{val.title}</h3>
												<div tw="mt-2 text-sm leading-5 text-gray-500">
													<p>{val.description}</p>
												</div>
												<div tw="mt-3 text-sm leading-5">
													{val.cta.map((val2, key) => {
														return (
															<Link key={key} href={val2.url} passHref>
																<a tw="font-medium text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150">
																	{ReactHtmlParser(val2.label)}
																</a>
															</Link>
														);
													})}
												</div>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</Scrollbars>
			</div>
		</Layout>
	);
};

export default AccountExist;

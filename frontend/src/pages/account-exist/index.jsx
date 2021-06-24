import { Fragment } from "react";
import Head from "next/head";
import Link from "next/link";
import styled from "styled-components";
import ReactHtmlParser from "react-html-parser";
import AccountExistContent from "public/data/account-exist.json";

const AccountExist = () => {
	const pageTitle = "Account Exists";

	return (
		<Fragment>
			<Head>
				<title>{pageTitle}</title>
			</Head>

			<div className={`min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8`}>
				<div className={`sm:mx-auto sm:w-full sm:max-w-md`}>
					{AccountExistContent.map((val, key) => {
						return (
							<Fragment key={key}>
								<div className={`min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8`}>
									<div className={`bg-white rounded-lg`}>
										<div className={`px-4 py-5 sm:p-6`}>
											<h3 className={`text-lg leading-6 font-medium text-red-600`}>{val.title}</h3>
											<div className={`mt-2 max-w-xl text-sm leading-5 text-gray-500`}>
												<p>{val.description}</p>
											</div>
											<div className={`mt-3 text-sm leading-5`}>
												{val.cta.map((val2, key) => {
													return (
														<Fragment key={key}>
															<Link href={`${val2.url}`}>
																<a
																	className={`font-medium text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}
																>
																	{ReactHtmlParser(val2.label)}
																</a>
															</Link>
														</Fragment>
													);
												})}
											</div>
										</div>
									</div>
								</div>
							</Fragment>
						);
					})}
				</div>
			</div>
		</Fragment>
	);
};

export default AccountExist;

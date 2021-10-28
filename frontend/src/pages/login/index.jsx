import LoginForm from "@components/forms/LoginForm";
import LogoLabel from "@components/labels/LogoLabel";
import { NoAuthLayout } from "@components/layouts";
import Footer from "@components/layouts/Footer";
import AppLogo from "@components/logos/AppLogo";
import { NoAuthAppLogo } from "@configs/GlobalValues";
import { RegistrationLink } from "@configs/PageLinks";
import { SiteLogoDark } from "@enums/GlobalValues";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import * as React from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import ReactHtmlParser from "react-html-parser";
import "twin.macro";

const Login = () => {
	const { t } = useTranslation("login");
	const login = t("login");
	const headline = t("headline");
	const tryFree = t("tryFree");
	const createAccount = t("createAccount");
	const noAccount = t("noAccount");

	return (
		<NoAuthLayout>
			<NextSeo title={login} />

			<div tw="h-screen bg-gray-50 flex flex-col justify-center">
				<Scrollbars universal>
					<div tw="relative overflow-auto py-12 sm:px-6 lg:px-8">
						<div tw="relative">
							<div tw="mt-8 sm:mt-16 md:mt-20 lg:mt-24">
								<div tw="mx-auto max-w-screen-xl">
									<div tw="lg:grid lg:grid-cols-12 lg:gap-8">
										<div tw="px-4 sm:px-6 sm:text-center md:max-w-2xl md:mx-auto lg:col-span-7 lg:text-left lg:flex lg:items-center">
											<div>
												<AppLogo
													className="flex"
													src={SiteLogoDark}
													alt={NoAuthAppLogo.label}
													width={NoAuthAppLogo.width}
													height={NoAuthAppLogo.height}
												/>
												<h4 tw="mt-4 text-4xl tracking-tight text-center lg:text-left leading-10 font-bold text-gray-900 sm:mt-5 sm:leading-none">
													{headline}
													<span tw="text-red-600">{ReactHtmlParser(tryFree)}</span>
													<br tw="hidden md:inline" />
												</h4>
											</div>
										</div>
										<div tw="mt-12 sm:mt-16 lg:mt-0 lg:col-span-5">
											<LogoLabel isLogin />

											<div tw="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
												<div tw="bg-white mt-8 py-8 px-4 shadow-xl rounded-lg sm:px-10">
													<LoginForm />
												</div>

												<div tw="relative flex justify-center flex-wrap flex-row text-sm leading-5">
													<span tw="px-2 py-5 text-gray-600">
														{ReactHtmlParser(noAccount)}
														<Link href={RegistrationLink}>
															<a tw="font-medium text-indigo-600 cursor-pointer hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
																{createAccount}
															</a>
														</Link>
													</span>
												</div>
											</div>
										</div>
									</div>

									<div tw="px-4 xl:px-10 xl:mt-32">
										<Footer />
									</div>
								</div>
							</div>
						</div>
					</div>
				</Scrollbars>
			</div>
		</NoAuthLayout>
	);
};

export default Login;

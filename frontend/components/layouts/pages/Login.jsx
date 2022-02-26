import { MemoizedLoginForm } from "@components/forms/LoginForm";
import { MemoizedLogoLabel } from "@components/labels/LogoLabel";
import { SiteLogoDark } from "@components/svgs/SiteLogo";
import { NoAuthAppLogo } from "@constants/GlobalValues";
import { RegistrationLink } from "@constants/PageLinks";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { memo } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { MemoizedFooter } from "../components/Footer";

/**
 * Custom function to render the `LoginPageLayout` component
 */
const LoginPageLayout = () => {
	// Translations
	const { t } = useTranslation();
	const headline = t("common:headline");
	const highlight = t("common:highlight");
	const createAccount = t("login:createAccount");
	const noAccount = t("login:noAccount");
	const loginText = t("login:login");

	return (
		<>
			<NextSeo title={loginText} />
			<Scrollbars autoHide universal>
				<section className="relative flex h-screen flex-col justify-center overflow-auto bg-gray-50 py-12 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-screen-xl">
						<div className="lg:grid lg:grid-cols-12 lg:gap-8">
							<div className="px-4 sm:px-6 sm:text-center md:mx-auto md:max-w-2xl lg:col-span-7 lg:flex lg:items-center lg:text-left">
								<div>
									<SiteLogoDark className="flex" width={NoAuthAppLogo.width} height={NoAuthAppLogo.height} />
									<h4 className="mt-4 text-center text-4xl font-bold leading-10 tracking-tight text-gray-900 sm:mt-5 sm:leading-none lg:text-left">
										{headline}&nbsp;
										<span className="text-red-600">{highlight}</span>
										<br className="hidden md:inline" />
									</h4>
								</div>
							</div>
							<div className="mt-12 sm:mt-16 lg:col-span-5 lg:mt-0">
								<MemoizedLogoLabel isLogin />

								<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
									<div className="mt-8 rounded-lg bg-white py-8 px-4 shadow-xl sm:px-10">
										<MemoizedLoginForm />
									</div>

									<div className="relative flex flex-row flex-wrap justify-center text-sm leading-5">
										<span className="px-2 py-5 text-gray-500">
											{noAccount}&nbsp;
											<Link href={RegistrationLink} passHref>
												<a className="cursor-pointer font-medium text-indigo-600 transition duration-150 ease-in-out hover:text-indigo-500 focus:underline focus:outline-none">
													{createAccount}
												</a>
											</Link>
										</span>
									</div>
								</div>
							</div>
						</div>

						<div className="px-4 xl:mt-32 xl:px-10">
							<MemoizedFooter />
						</div>
					</div>
				</section>
			</Scrollbars>
		</>
	);
};

/**
 * Memoized custom `LoginPageLayout` component
 */
export const MemoizedLoginPageLayout = memo(LoginPageLayout);

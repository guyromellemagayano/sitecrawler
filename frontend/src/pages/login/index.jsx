import Alert from "@components/alerts";
import LoginForm from "@components/forms/LoginForm";
import LogoLabel from "@components/labels/LogoLabel";
import Layout from "@components/layouts";
import Footer from "@components/layouts/Footer";
import Loader from "@components/loader";
import AppLogo from "@components/logos/AppLogo";
import RedirectingToPage from "@components/messages/RedirectingToPage";
import { UserApiEndpoint } from "@configs/ApiEndpoints";
import { NoAuthAppLogo } from "@configs/GlobalValues";
import { RegistrationLink, SitesLink } from "@configs/PageLinks";
import { server } from "@configs/ServerEnv";
import { SiteLogoDark } from "@enums/GlobalValues";
import { handleUser } from "@helpers/handleUser";
import axios from "axios";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import * as React from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import ReactHtmlParser from "react-html-parser";
import { SWRConfig } from "swr";
import "twin.macro";

export async function getServerSideProps({ req, query }) {
	const userResponse = await axios.get(`${server + UserApiEndpoint}`, {
		headers: req.headers,
		validateStatus: (status) => {
			return status < 500;
		}
	});
	const userData = userResponse?.data ?? null;
	const userStatus = userResponse?.status ?? null;

	return {
		props: {
			result: query ?? null,
			fallback: {
				userStatus: userStatus ?? null,
				userApiEndpoint: userData ?? null
			}
		}
	};
}

const LoginBody = ({ fallback = null, translationArray = null }) => {
	const { validatingUser, isUserReady, successMessage, setSuccessMessage, errorMessage, setErrorMessage, mutateUser } =
		handleUser({
			endpoint: fallback?.userApiEndpoint ?? null,
			status: fallback?.userStatus ?? null
		});

	return validatingUser && !isUserReady ? (
		<Loader />
	) : !validatingUser && isUserReady && Math.round(fallback?.userStatus / 200) === 1 ? (
		<RedirectingToPage page="Sites Dashboard" />
	) : !validatingUser && Math.round(fallback?.userStatus / 200) !== 1 ? (
		<React.Fragment>
			{errorMessage && errorMessage.length > 0
				? errorMessage.map((value, key) => <Alert key={key} message={value} page="login" isError />)
				: null}

			{successMessage && successMessage.length > 0
				? successMessage.map((value, key) => <Alert key={key} message={value} page="login" isSuccess />)
				: null}

			<section tw="h-screen bg-gray-50 flex flex-col justify-center">
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
													{translationArray[1]}
													<span tw="text-red-600">{ReactHtmlParser(translationArray[2])}</span>
													<br tw="hidden md:inline" />
												</h4>
											</div>
										</div>
										<div tw="mt-12 sm:mt-16 lg:mt-0 lg:col-span-5">
											<LogoLabel isLogin />

											<div tw="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
												<div tw="bg-white mt-8 py-8 px-4 shadow-xl rounded-lg sm:px-10">
													<LoginForm setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage} />
												</div>

												<div tw="relative flex justify-center flex-wrap flex-row text-sm leading-5">
													<span tw="px-2 py-5 text-gray-600">
														{ReactHtmlParser(translationArray[4])}
														<Link href={RegistrationLink}>
															<a tw="font-medium text-indigo-600 cursor-pointer hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
																{translationArray[3]}
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
			</section>
		</React.Fragment>
	) : null;
};

const Login = ({ fallback }) => {
	// Router
	const router = useRouter();

	// Translations
	const { t } = useTranslation("login");
	const translationArray = [t("login"), t("headline"), t("tryFree"), t("createAccount"), t("noAccount")];

	// Prefetch sites page for faster loading
	React.useEffect(() => {
		router.prefetch(SitesLink);
	}, []);

	return (
		<SWRConfig value={{ fallback }}>
			<Layout>
				<NextSeo title={translationArray[0]} />
				<LoginBody fallback={fallback} translationArray={translationArray} />
			</Layout>
		</SWRConfig>
	);
};

Login.propTypes = {
	fallback: PropTypes.any
};

export default Login;

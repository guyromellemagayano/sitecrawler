// React
import * as React from "react";

// NextJS
import Link from "next/link";
import { useRouter } from "next/router";

// External
import { NextSeo } from "next-seo";
import { Scrollbars } from "react-custom-scrollbars-2";
import axios from "axios";
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import tw from "twin.macro";

// JSON
import ConfirmEmailLabel from "public/labels/pages/confirm-email.json";

// Layout
import Layout from "src/components/Layout";

// Components
import AppLogo from "src/components/logos/AppLogo";

const ConfirmEmail = () => {
	const [success, setSuccess] = React.useState(false);
	const [failure, setFailure] = React.useState(false);
	const [errorMsg, setErrorMsg] = React.useState("");
	const [successMsg, setSuccessMsg] = React.useState("");

	const appLogoAltText = "app-logo";
	const pageTitle = "Confirm Email";
	const confirmEmailApiEndpoint = "/api/auth/registration/verify-email/";
	const loginPageLink = "/login/";

	const { query } = useRouter();

	const handlePageRefresh = (e) => {
		e.preventDefault();

		location.reload();
	};

	const handleSendPostRequest = async (data) => {
		return await axios
			.post(confirmEmailApiEndpoint, data, {
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json",
					"X-CSRFToken": Cookies.get("csrftoken")
				}
			})
			.then((response) => {
				Math.floor(response.status / 200) === 1
					? (() => {
							setSuccess(true);
							setSuccessMsg(ConfirmEmailLabel[0].label);
					  })()
					: (() => {
							Sentry.captureException(response);

							setSuccess(false);
							setFailure(true);
							setSuccessMsg(ConfirmEmailLabel[1].label);
					  })();
			})
			.catch((error) => {
				error.response.data
					? (() => {
							error.response.data.detail
								? (() => {
										Sentry.captureException(error.response.data.detail);

										setFailure(true);
										setErrorMsg(error.response.data.detail);
								  })()
								: null;
					  })()
					: (() => {
							Sentry.captureException(error.message);

							setFailure(true);
							setErrorMsg(ConfirmEmailLabel[1].label);
					  })();
			});
	};

	React.useEffect(() => {
		const secondLevelLocation = query.id[0];

		const body = {
			key: secondLevelLocation
		};

		setErrorMsg("");
		setSuccessMsg("");

		handleSendPostRequest(body);
	}, []);

	return (
		<Layout>
			<NextSeo title={pageTitle} />

			<div tw="bg-gray-50 min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
				<div tw="flex flex-col justify-center sm:mx-auto sm:w-full sm:max-w-md">
					<AppLogo
						tw="h-12 w-auto mx-auto mb-8 md:mx-auto"
						src="/images/logos/site-logo-dark.svg"
						alt={appLogoAltText}
						width={230}
						height={40}
					/>

					{!success && !failure ? (
						<div tw="px-4 py-5 sm:p-6 flex items-center justify-center">
							<h3 tw="text-lg leading-6 font-medium text-gray-500">{ConfirmEmailLabel[5].label}</h3>
						</div>
					) : success ? (
						<div tw="bg-white shadow rounded-lg">
							<div tw="text-center px-4 py-5 sm:p-6">
								<h3 tw="text-lg leading-6 font-medium text-gray-900">
									{ConfirmEmailLabel[2].label} {ConfirmEmailLabel[6].label}
								</h3>
								<div tw="mt-2 max-w-xl text-sm leading-5 text-gray-500">
									<p>{successMsg}</p>
								</div>
								<div tw="mt-5">
									<Link href={loginPageLink} passHref>
										<a tw="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm">
											{ConfirmEmailLabel[3].label}
										</a>
									</Link>
								</div>
							</div>
						</div>
					) : (
						<div tw="bg-white shadow rounded-lg">
							<div tw="text-center px-4 py-5 sm:p-6">
								<h3 tw="text-lg leading-6 font-medium text-gray-900">
									{ConfirmEmailLabel[2].label} {ConfirmEmailLabel[7].label}
								</h3>
								<div tw="mt-2 max-w-xl text-sm leading-5 text-gray-500">
									<p>{errorMsg}</p>
								</div>
								<div tw="mt-5">
									<button
										type="button"
										tw="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
										onClick={handlePageRefresh}
									>
										{ConfirmEmailLabel[4].label}
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</Layout>
	);
};

ConfirmEmail.propTypes = {};

export default ConfirmEmail;

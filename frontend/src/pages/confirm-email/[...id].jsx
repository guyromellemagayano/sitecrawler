// React
import { useState, useEffect } from "react";

// NextJS
import Link from "next/link";

// External
import { NextSeo } from "next-seo";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import tw from "twin.macro";

// JSON
import ConfirmEmailLabel from "public/labels/pages/confirm-email.json";

// Hooks
import usePostMethod from "src/hooks/usePostMethod";

// Layout
import Layout from "src/components/Layout";

// Components
const AppLogo = loadable(() => import("src/components/logos/AppLogo"));

const ConfirmEmail = () => {
	const [success, setSuccess] = useState(false);
	const [failure, setFailure] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");
	const [successMsg, setSuccessMsg] = useState("");

	const pageTitle = "Confirm Email";
	const confirmEmailApiEndpoint = "/api/auth/registration/verify-email/";

	const handlePageRefresh = (e) => {
		e.preventDefault();

		location.reload();
	};

	const handleSendPostRequest = async (data) => {
		try {
			const response = await usePostMethod(confirmEmailApiEndpoint, data);

			if (Math.floor(response.status / 200) === 1) {
				setErrorMsg("");
				setSuccess(!success);
				setSuccessMsg(ConfirmEmailLabel[0].label);
			} else {
				if (response.data) {
					setSuccessMsg("");
					setFailure(!failure);
					setErrorMsg(response.data.detail);
				} else {
					setErrorMsg(ConfirmEmailLabel[1].label);
				}
			}
		} catch (error) {
			// FIXME: add logging solution here
			return null;
		}
	};

	useEffect(() => {
		let pathArray = window.location.pathname.split("/sites");
		let secondLevelLocation = pathArray[2];

		if (errorMsg) setErrorMsg("");
		if (successMsg) setSuccessMsg("");

		const body = {
			key: secondLevelLocation
		};

		handleSendPostRequest(body);
	}, []);

	return (
		<Layout>
			<NextSeo title={pageTitle} />

			<div tw="bg-gray-50 min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
				<div tw="flex flex-col justify-center sm:mx-auto sm:w-full sm:max-w-md">
					<AppLogo
						className={tw`h-12 w-auto mx-auto mb-8 md:mx-auto lg:mx-0`}
						src="/images/logos/site-logo-dark.svg"
						alt="app-logo"
					/>
					{!success && !failure ? (
						<div tw="px-4 py-5 sm:p-6 flex items-center justify-center">
							<h3 tw="text-lg leading-6 font-medium text-gray-500">{ConfirmEmailLabel[5].label}</h3>
						</div>
					) : success ? (
						<div tw="bg-white shadow rounded-lg">
							<div tw="px-4 py-5 sm:p-6">
								<h3 tw="text-lg leading-6 font-medium text-gray-900">
									{ConfirmEmailLabel[2].label} {ConfirmEmailLabel[6].label}
								</h3>
								<div tw="mt-2 max-w-xl text-sm leading-5 text-gray-500">
									<p>{successMsg}</p>
								</div>
								<div tw="mt-5">
									<Link href="/sites">
										<a tw="relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white cursor-pointer bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
											{ConfirmEmailLabel[3].label}
										</a>
									</Link>
								</div>
							</div>
						</div>
					) : (
						<div tw="bg-white shadow rounded-lg">
							<div tw="px-4 py-5 sm:p-6">
								<h3 tw="text-lg leading-6 font-medium text-gray-900">
									{ConfirmEmailLabel[2].label} {ConfirmEmailLabel[7].label}
								</h3>
								<div tw="mt-2 max-w-xl text-sm leading-5 text-gray-500">
									<p>{errorMsg}</p>
								</div>
								<div tw="mt-5">
									<button
										type="button"
										tw="relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white cursor-pointer bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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

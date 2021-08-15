// React
import * as React from "react";

// NextJS
import dynamic from "next/dynamic";
import Link from "next/link";

// External
import "twin.macro";
import { NextSeo } from "next-seo";
import PropTypes from "prop-types";

// Enums
import { ConfirmEmailApiEndpoint } from "@enums/ApiEndpoints";
import { ConfirmEmailLabels } from "@enums/ConfirmEmailLabels";
import { GlobalLabels, SiteLogoDark } from "@enums/GlobalValues";
import { LoginLink } from "@enums/PageLinks";
import { usePostMethod } from "@hooks/useHttpMethod";

// Components
import AppLogo from "@components/logos/AppLogo";
import Layout from "@components/layouts";

const ConfirmEmail = ({ result }) => {
	const [success, setSuccess] = React.useState(false);
	const [failure, setFailure] = React.useState(false);
	const [errorMsg, setErrorMsg] = React.useState("");
	const [successMsg, setSuccessMsg] = React.useState("");

	const pageTitle = "Confirm Email";

	const handlePageRefresh = (e) => {
		e.preventDefault();

		location.reload();
	};

	React.useEffect(() => {
		(async () => {
			const secondLevelLocation = result?.id[0];

			const body = {
				key: secondLevelLocation
			};

			const response = await usePostMethod(ConfirmEmailApiEndpoint, body);

			setErrorMsg("");
			setSuccessMsg("");
			setSuccess(false);
			setFailure(false);

			Math.floor(response?.status / 200) === 1
				? (() => {
						setSuccess(true);
						setSuccessMsg(ConfirmEmailLabels[0].label);
				  })()
				: (() => {
						setFailure(true);
						setSuccessMsg(ConfirmEmailLabels[1].label);
				  })();
		})();
	}, [result]);

	return (
		<Layout>
			<NextSeo title={pageTitle} />

			<div tw="bg-gray-50 min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
				<div tw="flex flex-col justify-center sm:mx-auto sm:w-full sm:max-w-md">
					<AppLogo
						tw="h-12 w-auto mx-auto mb-8 md:mx-auto"
						src={SiteLogoDark}
						alt={GlobalLabels[0].label}
						width={GlobalLabels[0].width}
						height={GlobalLabels[0].height}
					/>

					{!success && !failure ? (
						<div tw="px-4 py-5 sm:p-6 flex items-center justify-center">
							<h3 tw="text-lg leading-6 font-medium text-gray-500">
								{ConfirmEmailLabels[5].label}
							</h3>
						</div>
					) : success ? (
						<div tw="bg-white shadow rounded-lg">
							<div tw="text-center px-4 py-5 sm:p-6">
								<h3 tw="text-lg leading-6 font-medium text-gray-900">
									{ConfirmEmailLabels[2].label} {ConfirmEmailLabels[6].label}
								</h3>
								<div tw="mt-2 max-w-xl text-sm leading-5 text-gray-500">
									<p>{successMsg}</p>
								</div>
								<div tw="mt-5">
									<Link href={LoginLink} passHref>
										<a tw="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm">
											{ConfirmEmailLabels[3].label}
										</a>
									</Link>
								</div>
							</div>
						</div>
					) : (
						<div tw="bg-white shadow rounded-lg">
							<div tw="text-center px-4 py-5 sm:p-6">
								<h3 tw="text-lg leading-6 font-medium text-gray-900">
									{ConfirmEmailLabels[2].label} {ConfirmEmailLabels[7].label}
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
										{ConfirmEmailLabels[4].label}
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

ConfirmEmail.propTypes = {
	id: PropTypes.array
};

ConfirmEmail.defaultProps = {
	id: null
};

export default ConfirmEmail;

export async function getServerSideProps(ctx) {
	return {
		props: {
			result: ctx.query
		}
	};
}

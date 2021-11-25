import Layout from "@components/layouts";
import { HelpAndSupportLink, HomeLink } from "@configs/PageLinks";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import PropTypes from "prop-types";
import * as React from "react";
import "twin.macro";

/**
 * @param {number} statusCode
 *
 * Memoized function to render the `ErrorPageLayout` component
 */
const ErrorPageLayout = React.memo(({ statusCode }) => {
	// Translations
	const { t } = useTranslation();
	const goBackHome = t("common:goBackHome");
	const contactSupport = t("common:contactSupport");
	const badRequestError = t("alerts:badRequestError");
	const pageBadRequestError = t("alerts:pageBadRequestError");
	const unauthorizedError = t("alerts:unauthorizedError");
	const pageUnauthorizedError = t("alerts:pageUnauthorizedError");
	const forbiddenError = t("alerts:forbiddenError");
	const pageForbiddenError = t("alerts:pageForbiddenError");
	const notFoundError = t("alerts:notFoundError");
	const pageNotFoundError = t("alerts:pageNotFoundError");
	const requestTimeoutError = t("alerts:requestTimeoutError");
	const pageRequestTimeoutError = t("alerts:pageRequestTimeoutError");
	const tooManyRequestsError = t("alerts:tooManyRequestsError");
	const pageTooManyRequestsError = t("alerts:pageTooManyRequestsError");
	const internalServerError = t("alerts:internalServerError");
	const pageInternalServerError = t("alerts:pageInternalServerError");
	const badGatewayError = t("alerts:badGatewayError");
	const pageBadGatewayError = t("alerts:pageBadGatewayError");
	const serviceUnavailableError = t("alerts:serviceUnavailableError");
	const pageServiceUnavailableError = t("alerts:pageServiceUnavailableError");
	const gatewayTimeoutError = t("alerts:gatewayTimeoutError");
	const pageGatewayTimeoutError = t("alerts:pageGatewayTimeoutError");
	const unknownError = t("alerts:unknownError");
	const pageUnknownError = t("alerts:pageUnknownError");

	let heading = "";
	let subheading = "";

	switch (statusCode) {
		case 400:
			heading = badRequestError;
			subheading = pageBadRequestError;
			break;
		case 401:
			heading = unauthorizedError;
			subheading = pageUnauthorizedError;
			break;
		case 403:
			heading = forbiddenError;
			subheading = pageForbiddenError;
			break;
		case 404:
			heading = notFoundError;
			subheading = pageNotFoundError;
			break;
		case 408:
			heading = requestTimeoutError;
			subheading = pageRequestTimeoutError;
			break;
		case 429:
			heading = tooManyRequestsError;
			subheading = pageTooManyRequestsError;
			break;
		case 500:
			heading = internalServerError;
			subheading = pageInternalServerError;
			break;
		case 502:
			heading = badGatewayError;
			subheading = pageBadGatewayError;
			break;
		case 503:
			heading = serviceUnavailableError;
			subheading = pageServiceUnavailableError;
			break;
		case 504:
			heading = gatewayTimeoutError;
			subheading = pageGatewayTimeoutError;
			break;
		default:
			heading = unknownError;
			subheading = pageUnknownError;
			break;
	}

	const pageTitle = statusCode + " " + heading;

	return (
		<Layout>
			<NextSeo title={pageTitle} />

			<div tw="bg-white min-h-screen px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
				<div tw="max-w-max mx-auto">
					<main tw="sm:flex">
						<p tw="text-4xl font-extrabold text-indigo-600 sm:text-5xl">{statusCode}</p>
						<div tw="sm:ml-6">
							<div tw="sm:border-l sm:border-gray-200 sm:pl-6">
								<h1 tw="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">{heading}</h1>
								<p tw="max-w-sm mt-1 text-base text-gray-500">{subheading}</p>
							</div>
							<div tw="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
								<Link href={HomeLink} passHref replace>
									<a tw="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
										{goBackHome}
									</a>
								</Link>
								<Link href={HelpAndSupportLink} passHref replace>
									<a tw="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
										{contactSupport}
									</a>
								</Link>
							</div>
						</div>
					</main>
				</div>
			</div>
		</Layout>
	);
});

ErrorPageLayout.propTypes = {
	statusCode: PropTypes.number
};

export default ErrorPageLayout

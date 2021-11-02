import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import * as React from "react";
import "twin.macro";

const FallbackErrorMessage = () => {
	const { t } = useTranslation("error");
	const fallbackErrorMessage = t("fallbackErrorMessage");

	return (
		<React.Fragment>
			<NextSeo title={fallbackErrorMessage} />

			<section tw="flex flex-col justify-center min-h-screen">
				<div tw="px-4 py-5 sm:p-6 flex items-center justify-center">
					<h3 tw="text-lg leading-6 font-medium text-gray-500">{fallbackErrorMessage}</h3>
				</div>
			</section>
		</React.Fragment>
	);
};

export default FallbackErrorMessage;

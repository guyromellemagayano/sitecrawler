import useTranslation from "next-translate/useTranslation";
import * as React from "react";
import "twin.macro";

/**
 * Memoized function to render the `LoadingMessage` component
 *
 * @param {string} message
 */
const LoadingMessage = React.memo((message = null) => {
	// Translations
	const { t } = useTranslation("common");
	const loaderMessage = t("loaderMessage");

	return (
		<section tw="flex flex-col justify-center min-h-screen">
			<div tw="px-4 py-5 sm:p-6 flex items-center justify-center">
				<h3 tw="text-lg leading-6 font-medium text-gray-500">{message !== null ? message : loaderMessage}</h3>
			</div>
		</section>
	);
});

export default LoadingMessage;

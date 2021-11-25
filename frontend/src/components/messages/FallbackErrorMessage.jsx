import useTranslation from "next-translate/useTranslation";
import * as React from "react";
import "twin.macro";
/**
 * Memoized function to render the `FallbackErrorMessage` component
 */
const FallbackErrorMessage = React.memo(({ message = null }) => {
	// Translations
	const { t } = useTranslation("alerts");
	const unknownError = t("unknownError");

	return (
		<section tw="flex flex-col justify-center min-h-screen">
			<div tw="px-4 py-5 sm:p-6 flex items-center justify-center">
				<h3 tw="text-lg leading-6 font-medium text-gray-500">{message !== null ? message : unknownError}</h3>
			</div>
		</section>
	);
});

export default FallbackErrorMessage;

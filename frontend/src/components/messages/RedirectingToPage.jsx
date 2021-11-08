import useTranslation from "next-translate/useTranslation";
import * as React from "react";
import "twin.macro";

const RedirectingToPage = ({ page }) => {
	const { t } = useTranslation("common");
	const redirectingToPage = t("redirectingToPage");
	const pageText = t("pageText");

	return (
		<section tw="flex flex-col justify-center min-h-screen">
			<div tw="px-4 py-5 sm:p-6 flex items-center justify-center">
				<h3 tw="text-lg leading-6 font-medium text-gray-500">
					{redirectingToPage + " " + page + " " + pageText + "..."}
				</h3>
			</div>
		</section>
	);
};

export default RedirectingToPage;

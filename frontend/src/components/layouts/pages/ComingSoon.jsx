import useTranslation from "next-translate/useTranslation";
import * as React from "react";
import "twin.macro";

/**
 * Memoized function to render the `ComingSoonPageLayout` component
 */
const ComingSoonPageLayout = React.memo((pageTitle = null) => {
	// Translations
	const { t } = useTranslation("common");
	const comingSoon = t("comingSoon");

	return (
		<div tw="flex flex-col w-0 flex-1 overflow-hidden">
			<main tw="flex-1 relative z-0 max-w-screen-2xl mx-auto overflow-y-auto focus:outline-none" tabIndex="0">
				<div tw="max-w-full p-4 sm:px-6 md:px-8">
					<div tw="w-full py-6 mx-auto grid gap-16 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-12">
						<div tw="max-w-full p-4">
							<Breadcrumbs isOther pageTitle={pageTitle} />

							<div tw="pt-4 m-auto">
								<h2 tw="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">{comingSoon}</h2>
							</div>
						</div>

						<div tw="space-y-12 divide-y divide-gray-200">{/* Place Content Here */}</div>
					</div>

					<div tw="static bottom-0 w-full mx-auto p-4 border-t border-gray-200 bg-white">
						<Footer />
					</div>
				</div>
			</main>
		</div>
	);
});

export default ComingSoonPageLayout;

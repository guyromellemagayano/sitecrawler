import { MemoizedBreadcrumbs } from "@components/breadcrumbs";
import { Loader } from "@components/loaders";
import { ComponentReadyInterval } from "@constants/GlobalValues";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo, useEffect, useState } from "react";
import "twin.macro";
import { MemoizedFooter } from "../components/Footer";

/**
 * Custom function to render the `ComingSoonPageLayout` component
 *
 * @param {string} pageTitle
 */
export function ComingSoonPageLayout({ pageTitle = null }) {
	const [isComponentReady, setIsComponentReady] = useState(false);

	const { isReady } = useRouter();

	useEffect(() => {
		if (isReady) {
			setTimeout(() => {
				setIsComponentReady(true);
			}, ComponentReadyInterval);
		}

		return () => {
			setIsComponentReady(false);
		};
	}, [isReady]);

	// Translations
	const { t } = useTranslation("common");
	const comingSoon = t("comingSoon");

	return isComponentReady ? (
		<section tw="min-h-screen flex flex-col justify-center px-4 py-12">
			<MemoizedBreadcrumbs isOther pageTitle={pageTitle} />

			<div tw="flex pt-12 pb-4">
				<h2 tw="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">{pageTitle}</h2>
			</div>

			<div tw="flex p-4 m-auto">
				<h4 tw="text-lg leading-6 font-medium text-gray-500">{comingSoon}</h4>
			</div>

			<MemoizedFooter />
		</section>
	) : (
		<Loader />
	);
}

ComingSoonPageLayout.propTypes = {
	pageTitle: PropTypes.string
};

/**
 * Memoized custom `ComingSoonPageLayout` component
 */
export const MemoizedComingSoonPageLayout = memo(ComingSoonPageLayout);

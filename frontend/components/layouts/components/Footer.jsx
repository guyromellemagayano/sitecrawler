import { FooterLabels } from "@constants/FooterLabels";
import useTranslation from "next-translate/useTranslation";
import { memo } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import "twin.macro";

/**
 * Custom function to render the `Footer` component
 */
export function Footer() {
	// Translations
	const { t } = useTranslation("common");
	const allRightsReserved = t("allRightsReserved");

	// Footer Labels
	const labelsArray = FooterLabels();

	return (
		<footer tw="flex-none w-full pt-8 pb-4 border-t border-gray-200">
			<div tw="flex flex-col xl:flex-row xl:items-center xl:justify-between px-4">
				<div tw="flex justify-center md:order-1">
					<nav tw="-mx-8 mt-2 mb-4 lg:-my-2 flex flex-wrap justify-center">
						{labelsArray.map((value, index) => (
							<div key={index} tw="px-2 py-1 xl:px-3 xl:py-2">
								<a
									href={value.link}
									tw="text-sm leading-6 text-gray-500 hover:text-indigo-500 transition duration-150 ease-in-out"
								>
									{value.label}
								</a>
							</div>
						))}
					</nav>
				</div>
				<div tw="md:order-2">
					<p tw="text-center text-sm leading-6 text-gray-500">
						&copy; {new Date().getFullYear()} SiteCrawler, Inc. {allRightsReserved}.
					</p>
				</div>
			</div>
		</footer>
	);
}

/**
 * Memoized custom `Footer` component
 */
export const MemoizedFooter = memo(Footer);

import { FooterLabels } from "@constants/FooterLabels";
import { useLoading } from "@hooks/useLoading";
import useTranslation from "next-translate/useTranslation";
import { memo } from "react";
import Skeleton from "react-loading-skeleton";
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

	// Custom hook
	const { isComponentReady } = useLoading();

	return (
		<footer tw="flex-none w-full pt-8 pb-4 border-t border-gray-200">
			<div tw="flex md:flex-col lg:flex-row md:flex md:items-center md:justify-between px-4">
				<div tw="flex justify-center md:order-1">
					<nav tw="-mx-8 -my-2 flex flex-wrap justify-center">
						{labelsArray.map((value, index) => (
							<div key={index} tw="px-3 py-2">
								{isComponentReady ? (
									<a
										href={value.link}
										tw="text-sm leading-6 text-gray-500 hover:text-indigo-500 transition duration-150 ease-in-out"
									>
										{value.label}
									</a>
								) : (
									<Skeleton duration={2} width={65} height={17} />
								)}
							</div>
						))}
					</nav>
				</div>
				<div tw="md:order-2">
					{isComponentReady ? (
						<p tw="text-center text-sm leading-6 text-gray-500">
							&copy; {new Date().getFullYear()} SiteCrawler, Inc. {allRightsReserved}.
						</p>
					) : (
						<Skeleton duration={2} width={289} height={17} />
					)}
				</div>
			</div>
		</footer>
	);
}

/**
 * Memoized custom `Footer` component
 */
export const MemoizedFooter = memo(Footer);

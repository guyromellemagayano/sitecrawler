import { FooterLabels } from "@constants/FooterLabels";
import useTranslation from "next-translate/useTranslation";
import { memo } from "react";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the `Footer` component
 */
const Footer = () => {
	// Translations
	const { t } = useTranslation("common");
	const allRightsReserved = t("allRightsReserved");

	// Footer labels
	const labelsArray = FooterLabels();

	// Custom variables
	const siteName = process.env.NEXT_PUBLIC_SITE_NAME;

	return (
		<footer className="w-full flex-none border-t border-gray-200 py-8">
			<div className="flex flex-col xl:flex-row xl:items-center xl:justify-between">
				<div className="flex justify-center md:order-1">
					<nav className="-mx-3 mt-2 mb-4 flex flex-wrap justify-center lg:-my-2">
						{labelsArray.map((value, index) => (
							<div key={index} className="px-2 py-1 xl:px-3 xl:py-2">
								<a
									href={value.link}
									className="text-sm leading-6 text-gray-500 transition duration-150 ease-in-out hover:text-indigo-500"
								>
									{value.label}
								</a>
							</div>
						))}
					</nav>
				</div>
				<div className="md:order-2">
					<p className="text-center text-sm leading-6 text-gray-500">
						&copy; {new Date().getFullYear() + " " + siteName + " " + allRightsReserved}
					</p>
				</div>
			</div>
		</footer>
	);
};

/**
 * Memoized custom `Footer` component
 */
export const MemoizedFooter = memo(Footer);

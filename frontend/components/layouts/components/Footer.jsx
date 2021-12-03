import { FooterLabels } from "@constants/FooterLabels";
import useTranslation from "next-translate/useTranslation";
import "twin.macro";

const Footer = () => {
	// Translations
	const { t } = useTranslation("common");
	const allRightsReserved = t("allRightsReserved");

	// Footer Labels
	const labelsArray = FooterLabels();

	return (
		<footer tw="max-w-full md:flex-col lg:flex-row p-3 md:flex md:items-center md:justify-between">
			<div tw="flex justify-center md:order-1">
				<nav tw="-mx-4 -my-2 flex flex-wrap justify-center">
					{labelsArray.map((value, index) => (
						<div key={index} tw="px-3 py-2">
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
		</footer>
	);
};

export default Footer;

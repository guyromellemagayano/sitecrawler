import { SidebarMenuLabels } from "@configs/SidebarMenuLabels";
import { SelectorIcon } from "@heroicons/react/solid";
import useTranslation from "next-translate/useTranslation";
import PropTypes from "prop-types";
import { memo } from "react";
import tw from "twin.macro";

/**
 * Memoized function to render `SiteSelectMenu` component
 */
const SiteSelectMenu = memo(
	({ selectedSite = null, selectedSiteDetails = null, isComponentVisible = false, setIsComponentVisible }) => {
		// Translations
		const { t } = useTranslation("sidebar");
		const recrawlingInProcess = t("recrawlingInProcess");
		const verified = t("verified");
		const notVerified = t("notVerified");

		// Sidebar Menu Labels
		const labelsArray = SidebarMenuLabels();

		return (
			<button
				type="button"
				aria-haspopup="listbox"
				aria-expanded="true"
				aria-labelledby="listbox-label"
				className="focus:ring-gray-1100"
				tw="cursor-default relative w-full rounded-md border border-gray-700 pl-3 pr-10 py-2 text-left bg-white focus:outline-none focus:ring-1 sm:text-sm sm:leading-5"
				onClick={() => setIsComponentVisible(!isComponentVisible)}
			>
				<div tw="flex items-center space-x-3">
					<span tw="block truncate text-gray-600">
						{typeof selectedSite !== "undefined" && selectedSite !== null && Object.keys(selectedSite).length > 0 ? (
							selectedSiteDetails ? (
								<div tw="flex items-center space-x-3">
									<span
										aria-label={
											selectedSiteDetails.verified ? (currentScan ? recrawlingInProcess : verified) : notVerified
										}
										css={[
											tw`flex-shrink-0 inline-block h-2 w-2 rounded-full`,
											selectedSiteDetails.verified
												? currentScan
													? tw`bg-yellow-400`
													: tw`bg-green-400`
												: tw`bg-red-400`
										]}
									></span>
									<span tw="font-medium block truncate text-gray-500">{selectedSite}</span>
								</div>
							) : null
						) : (
							labelsArray[0].label
						)}
					</span>
				</div>
				<span tw="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
					<SelectorIcon tw="w-4 h-4 text-gray-400" />
				</span>
			</button>
		);
	}
);

SiteSelectMenu.propTypes = {
	isComponentVisible: PropTypes.bool,
	selectedSite: PropTypes.any,
	selectedSiteDetails: PropTypes.shape({
		verified: PropTypes.any
	}),
	setIsComponentVisible: PropTypes.func
};

export default SiteSelectMenu;

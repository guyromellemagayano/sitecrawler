import { SidebarMenuLabels } from "@constants/SidebarMenuLabels";
import { SelectorIcon } from "@heroicons/react/solid";
import { useScan } from "@hooks/useScan";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo } from "react";
import tw from "twin.macro";

/**
 * Custom function to render the `SiteSelectMenu` component
 *
 * @param {string} selectedSite
 * @param {object} selectedSiteDetails
 * @param {function} handleOpenDropdown
 */
const SiteSelectMenu = ({ selectedSite = null, selectedSiteDetails = null, handleOpenDropdown }) => {
	// Router
	const { query } = useRouter();
	const { siteId } = query;

	// Custom hooks
	const { currentScan } = useScan(siteId);

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
			tw="cursor-default relative w-full rounded-md border border-gray-700 pl-3 pr-10 py-2 text-left bg-white focus:outline-none focus:ring-1 sm:text-sm sm:leading-5 focus:ring-gray-1100"
			onClick={handleOpenDropdown}
		>
			<div tw="flex items-center space-x-3">
				<span tw="block truncate text-gray-600">
					{selectedSite !== null ? (
						Object.keys(selectedSiteDetails)?.length > 0 ? (
							<div tw="flex items-center space-x-3">
								<span
									aria-label={
										selectedSiteDetails?.verified ? (currentScan ? recrawlingInProcess : verified) : notVerified
									}
									css={[
										tw`flex-shrink-0 inline-block h-2 w-2 rounded-full`,
										selectedSiteDetails?.verified
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
};

SiteSelectMenu.propTypes = {
	handleOpenDropdown: PropTypes.func,
	selectedSite: PropTypes.string,
	selectedSiteDetails: PropTypes.object
};

/**
 * Memoized custom `SiteSelectMenu` component
 */
export const MemoizedSiteSelectMenu = memo(SiteSelectMenu);

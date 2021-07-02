// React
import * as React from "react";

// External
import tw from "twin.macro";
import { SelectorIcon } from "@heroicons/react/solid";
import PropTypes from "prop-types";

const SiteSelectionMenu = (props) => {
	return (
		<button
			type="button"
			aria-haspopup="listbox"
			aria-expanded="true"
			aria-labelledby="listbox-label"
			className="focus:ring-gray-1100"
			tw="cursor-default relative w-full rounded-md border border-gray-700 pl-3 pr-10 py-2 text-left bg-white focus:outline-none focus:ring-1 sm:text-sm sm:leading-5"
			onClick={() => props.setIsComponentVisible(!props.isComponentVisible)}
		>
			<div tw="flex items-center space-x-3">
				<span tw="block truncate text-gray-600">
					{props.selectedSite !== null ? (
						props.selectedSiteDetails ? (
							<div tw="flex items-center space-x-3">
								<span
									aria-label={
										props.selectedSiteDetails?.verified
											? props.currentScan !== undefined
												? "Recrawling in Process"
												: "Verified"
											: "Not Verified"
									}
									css={[
										tw`flex-shrink-0 inline-block h-2 w-2 rounded-full`,
										props.selectedSiteDetails?.verified
											? props.currentScan !== undefined
												? tw`bg-yellow-400`
												: tw`bg-green-400`
											: tw`bg-red-400`
									]}
								></span>
								<span tw="font-medium block truncate text-gray-500">{props.selectedSite}</span>
							</div>
						) : null
					) : (
						props.label[0]
					)}
				</span>
			</div>
			<span tw="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
				<SelectorIcon tw="w-4 h-4 text-gray-400" />
			</span>
		</button>
	);
};

SiteSelectionMenu.propTypes = {};

export default SiteSelectionMenu;

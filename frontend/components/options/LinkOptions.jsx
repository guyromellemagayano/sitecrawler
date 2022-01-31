import { LinkOptionsLabels } from "@enums/LinkOptionsLabels";
import { SearchIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo } from "react";
import "twin.macro";

/**
 * Custom function to render the `LinkOptions` component
 *
 * @param {function} onSearchEvent
 * @param {array} permissions
 * @param {searchKey} string
 */
const LinkOptions = ({ onSearchEvent, permissions = null, searchKey = null }) => {
	// Router
	const { asPath } = useRouter();

	return (
		<div tw="z-10">
			<div tw="relative z-10 flex-shrink-0 flex bg-white border-b border-gray-200">
				<div tw="flex-1 p-4 flex justify-end">
					<div tw="flex-1 flex">
						<div tw="w-full flex lg:ml-0">
							<label htmlFor="searchSites" tw="sr-only">
								{LinkOptionsLabels[1].label}
							</label>
							<div tw="relative w-full text-gray-400 focus-within:text-gray-600 flex items-center">
								<div tw="absolute inset-y-0 left-0 flex items-center pointer-events-none">
									<SearchIcon tw="h-5 w-5 text-gray-400" />
								</div>
								{(permissions?.includes("can_see_pages") &&
									permissions?.includes("can_see_scripts") &&
									permissions?.includes("can_see_stylesheets") &&
									permissions?.includes("can_see_images")) ||
								asPath.includes("links") ? (
									<input
										type="search"
										name="search-links"
										id="searchLinks"
										tw="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
										placeholder={
											asPath.includes("pages")
												? LinkOptionsLabels[0].label
												: asPath.includes("links")
												? LinkOptionsLabels[1].label
												: asPath.includes("images")
												? LinkOptionsLabels[2].label
												: LinkOptionsLabels[3].label
										}
										onKeyUp={onSearchEvent}
										defaultValue={searchKey}
										autoFocus
									/>
								) : (
									<p tw="sm:text-sm placeholder-gray-500 pl-8">{LinkOptionsLabels[9].label}</p>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

LinkOptions.propTypes = {
	onSearchEvent: PropTypes.func,
	permissions: PropTypes.array,
	searchKey: PropTypes.string
};

/**
 * Memoized custom `LinkOptions` component
 */
export const MemoizedLinkOptions = memo(LinkOptions);

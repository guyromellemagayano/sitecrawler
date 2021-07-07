// React
import * as React from "react";

// NextJS
import { useRouter } from "next/router";

// External
import "twin.macro";
import { SearchIcon } from "@heroicons/react/solid";
import PropTypes from "prop-types";

// JSON
import LinkOptionsLabel from "./labels/LinkOptions.json";

const LinkOptions = (props) => {
	const { asPath } = useRouter();

	return (
		<div tw="flex flex-col w-0 flex-1 overflow-hidden z-10">
			<div tw="relative z-10 flex-shrink-0 flex bg-white border-b border-gray-200">
				<div tw="flex-1 p-4 flex justify-end">
					<div tw="flex-1 flex">
						<div tw="w-full flex lg:ml-0">
							<label htmlFor="searchSites" tw="sr-only">
								{LinkOptionsLabel[1].label}
							</label>
							<div tw="relative w-full text-gray-400 focus-within:text-gray-600 flex items-center">
								<div tw="absolute inset-y-0 left-0 flex items-center pointer-events-none">
									<SearchIcon tw="h-5 w-5 text-gray-400" />
								</div>
								{(props.permissions?.includes("can_see_pages") &&
									props.permissions?.includes("can_see_scripts") &&
									props.permissions?.includes("can_see_stylesheets") &&
									props.permissions?.includes("can_see_images")) ||
								asPath.includes("links") ? (
									<input
										type="search"
										name="search-links"
										id="searchLinks"
										tw="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
										placeholder={
											asPath.includes("pages")
												? LinkOptionsLabel[0].label
												: asPath.includes("links")
												? LinkOptionsLabel[1].label
												: asPath.includes("images")
												? LinkOptionsLabel[2].label
												: LinkOptionsLabel[3].label
										}
										onKeyUp={props.onSearchEvent}
										defaultValue={props.searchKey}
										autoFocus
									/>
								) : (
									<p tw="sm:text-sm placeholder-gray-500 pl-8">{LinkOptionsLabel[9].label}</p>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

LinkOptions.propTypes = {};

export default LinkOptions;

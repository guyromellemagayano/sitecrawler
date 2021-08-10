// React
import * as React from "react";

// NextJS
import Link from "next/link";

// External
import "twin.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PlusIcon } from "@heroicons/react/solid";
import { SearchIcon } from "@heroicons/react/solid";
import PropTypes from "prop-types";

// Enums
import { AddNewSiteLink } from "@enums/PageLinks";
import { AddSiteLabels } from "@enums/AddSiteLabels";

// Hooks
import { useComponentVisible } from "@hooks/useComponentVisible";

// Components
import UpgradeErrorModal from "@components/modals/UpgradeErrorModal";

const AddSite = ({ user, site, searchKey, onSearchEvent }) => {
	const [maxSiteLimit, setMaxSiteLimit] = React.useState(0);
	const [siteLimitCounter, setSiteLimitCounter] = React.useState(0);

	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

	const handleSiteLimit = (user, site) => {
		setSiteLimitCounter(site?.count);
		setMaxSiteLimit(user?.group?.max_sites);
	};

	React.useEffect(() => {
		user && site ? handleSiteLimit(user, site) : null;
	}, [user, site]);

	return (
		<div tw="flex flex-col w-0 flex-1 overflow-hidden">
			<UpgradeErrorModal
				ref={ref}
				showModal={isComponentVisible}
				setShowModal={setIsComponentVisible}
			/>

			<div tw="relative z-10 flex-shrink-0 flex  bg-white border-b border-gray-200">
				<div tw="flex-1 p-4 flex justify-between">
					<div tw="flex-1 flex">
						<div tw="w-full flex lg:ml-0">
							<label htmlFor="searchSites" tw="sr-only">
								{AddSiteLabels[3].label}
							</label>
							<div tw="relative w-full text-gray-400 focus-within:text-gray-600 flex items-center">
								<div tw="absolute inset-y-0 left-0 flex items-center pointer-events-none">
									<SearchIcon tw="h-5 w-5 text-gray-400" />
								</div>
								{site?.count > 0 ? (
									<input
										type="search"
										name="search-sites"
										id="searchSites"
										tw="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
										placeholder={AddSiteLabels[3].label}
										onKeyUp={onSearchEvent}
										defaultValue={searchKey}
										autoFocus
									/>
								) : (
									<p tw="sm:text-sm placeholder-gray-500 pl-8">{AddSiteLabels[4].label}</p>
								)}
							</div>
						</div>
					</div>
					<div tw="ml-4 flex items-center lg:ml-6 space-x-2">
						{siteLimitCounter === maxSiteLimit || siteLimitCounter > maxSiteLimit ? (
							<button
								type="button"
								tw="cursor-pointer relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 active:bg-yellow-700"
								onClick={() => setIsComponentVisible(!isComponentVisible)}
							>
								<span tw="flex items-center space-x-2">
									{user?.permissions &&
									user?.permissions !== undefined &&
									user?.permissions.includes("can_see_images") &&
									user?.permissions.includes("can_see_pages") &&
									user?.permissions.includes("can_see_scripts") &&
									user?.permissions.includes("can_see_stylesheets") &&
									user?.permissions.includes("can_start_scan") ? null : (
										<FontAwesomeIcon icon={["fas", "crown"]} tw="w-4 h-4 text-white" />
									)}
									<span>{AddSiteLabels[0].label}</span>
								</span>
							</button>
						) : (
							<Link href={AddNewSiteLink} passHref>
								<a tw="active:bg-green-700 bg-green-600 border border-transparent cursor-pointer inline-flex focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-medium hover:bg-green-700 items-center justify-center leading-5 px-4 py-2 rounded-md text-sm text-white w-full">
									<span tw="flex items-center space-x-2">
										<PlusIcon tw="mr-2 h-4 w-4 text-white" />
										{AddSiteLabels[0].label}
									</span>
								</a>
							</Link>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

AddSite.propTypes = {
	onSearchEvent: PropTypes.func,
	searchKey: PropTypes.string,
	site: PropTypes.object,
	user: PropTypes.object
};

AddSite.defaultProps = {
	onSearchEvent: null,
	searchKey: null,
	site: null,
	user: null
};

export default AddSite;

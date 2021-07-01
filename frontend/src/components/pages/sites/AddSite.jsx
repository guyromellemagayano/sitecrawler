// React
import * as React from "react";

// NextJS
import Link from "next/link";

// External
import "twin.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SearchIcon } from "@heroicons/react/solid";
import loadable from "@loadable/component";
import PropTypes from "prop-types";

// JSON
import AddSiteLabel from "public/labels/components/sites/AddSite.json";

// Loadable
const UpgradeErrorModal = loadable(() => import("src/components/modals/UpgradeErrorModal"));

const AddSite = ({ user, site, searchKey, onSearchEvent }) => {
	const [siteLimitCounter, setSiteLimitCounter] = React.useState(0);
	const [maxSiteLimit, setMaxSiteLimit] = React.useState(0);
	const [showUpgradeErrorModal, setShowUpgradeErrorModal] = React.useState(false);

	const informationPageLink = "/sites/add-new-site/";

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
				show={showUpgradeErrorModal}
				setShowModal={setShowUpgradeErrorModal}
				label={[AddSiteLabel[1].label, AddSiteLabel[2].label]}
			/>

			<div tw="relative z-10 flex-shrink-0 flex  bg-white border-b border-gray-200">
				<div tw="flex-1 p-4 flex justify-between">
					<div tw="flex-1 flex">
						<div tw="w-full flex lg:ml-0">
							<label htmlFor="searchSites" tw="sr-only">
								{AddSiteLabel[3].label}
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
										placeholder={AddSiteLabel[3].label}
										onKeyUp={onSearchEvent}
										defaultValue={searchKey}
										autoFocus
									/>
								) : (
									<p tw="sm:text-sm placeholder-gray-500 pl-8">{AddSiteLabel[4].label}</p>
								)}
							</div>
						</div>
					</div>
					<div tw="ml-4 flex items-center lg:ml-6 space-x-2">
						{siteLimitCounter === maxSiteLimit || siteLimitCounter > maxSiteLimit ? (
							<button
								type="button"
								tw="cursor-pointer relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 active:bg-yellow-700"
								onClick={() => setShowUpgradeErrorModal(!showUpgradeErrorModal)}
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
									<span>{AddSiteLabel[0].label}</span>
								</span>
							</button>
						) : (
							<Link href={informationPageLink} passHref>
								<a tw="cursor-pointer relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 active:bg-green-700">
									{AddSiteLabel[0].label}
								</a>
							</Link>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

AddSite.propTypes = {};

export default AddSite;

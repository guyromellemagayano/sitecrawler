// React
import { useState, useEffect } from "react";

// NextJS
import Link from "next/link";

// External
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import tw from "twin.macro";

// JSON
import AddSiteLabel from "public/labels/components/sites/AddSite.json";

// Components
const AddSiteErrorModal = loadable(() => import("src/components/modals/AddSiteErrorModal"));
const AddSiteSkeleton = loadable(() => import("src/components/skeletons/AddSiteSkeleton"));
const SearchSvg = loadable(() => import("src/components/svg/solid/SearchSvg"));

const AddSite = ({ user, site, searchKey, onSearchEvent }) => {
	const [siteLimitCounter, setSiteLimitCounter] = useState(0);
	const [maxSiteLimit, setMaxSiteLimit] = useState(0);
	const [showErrorModal, setShowErrorModal] = useState(false);
	const [componentReady, setComponentReady] = useState(false);

	const informationPageLink = "/add-site/information";

	useEffect(() => {
		if (
			user &&
			user !== undefined &&
			Object.keys(user).length > 0 &&
			site &&
			site !== undefined &&
			Object.keys(site).length > 0
		) {
			setSiteLimitCounter(site.count);
			setMaxSiteLimit(user.group.max_sites);

			setTimeout(() => {
				setComponentReady(true);
			}, 500);
		}
	}, [site, user]);

	return componentReady ? (
		<>
			<AddSiteErrorModal show={showErrorModal} setShowErrorModal={setShowErrorModal} label={AddSiteLabel} />

			<div tw="flex flex-col w-0 flex-1 overflow-hidden">
				<div tw="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200">
					<div tw="flex-1 p-4 flex justify-between">
						<div tw="flex-1 flex">
							<div tw="w-full flex lg:ml-0">
								<label htmlFor="searchSites" tw="sr-only">
									{AddSiteLabel[5].label}
								</label>
								<div tw="relative w-full text-gray-400 focus-within:text-gray-600">
									<div tw="absolute inset-y-0 left-0 flex items-center pointer-events-none">
										<SearchSvg className={tw`h-5 w-5 text-gray-400`} />
									</div>
									<input
										type="search"
										name="search-sites"
										id="searchSites"
										tw="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
										placeholder={AddSiteLabel[5].label}
										onKeyUp={onSearchEvent}
										defaultValue={searchKey}
										autoFocus
									/>
								</div>
							</div>
						</div>
						<div tw="ml-4 flex items-center lg:ml-6 space-x-2">
							{siteLimitCounter === maxSiteLimit || siteLimitCounter > maxSiteLimit ? (
								<button
									type="button"
									tw="cursor-pointer relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 active:bg-yellow-700"
									onClick={() => setShowErrorModal(!showErrorModal)}
								>
									{AddSiteLabel[1].label}
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
		</>
	) : (
		<AddSiteSkeleton />
	);
};

AddSite.propTypes = {};

export default AddSite;

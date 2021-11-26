import SiteLimitReachedModal from "@components/modals/SiteLimitReachedModal";
import { AddNewSiteLink } from "@configs/PageLinks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { handleScanApiEndpoint, handleSiteQueries, handleSiteSearch } from "@helpers/handleSiteQueries";
import { PlusIcon, SearchIcon } from "@heroicons/react/solid";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useSites } from "@hooks/useSites";
import { useUser } from "@hooks/useUser";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useState, useEffect } from "react";
import "twin.macro";

/**
 * Memoized function to render the `AddSite` component
 */
const AddSite = memo(() => {
	const [maxSiteLimit, setMaxSiteLimit] = useState(0);
	const [siteLimitCounter, setSiteLimitCounter] = useState(0);

	// Translations
	const { t } = useTranslation("addSite");
	const addNewSite = t("addNewSite");
	const searchSites = t("searchSites");
	const searchNotAvailable = t("searchNotAvailable");

	// Router
	const { query } = useRouter();

	// SWR hooks
	const { user, errorUser, validatingUser } = useUser();
	const { sites, errorSites, validatingSites } = useSites();

	// Custom hooks
	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

	// Helper functions
	const { searchKey, setSearchKey, linksPerPage } = handleSiteQueries(query);
	const { scanApiEndpoint } = handleScanApiEndpoint(query, linksPerPage);

	// Custom Functions
	const onHandleSiteSearch = async (event) => {
		return await handleSiteSearch(event, scanApiEndpoint, setSearchKey);
	};

	useEffect(() => {
		typeof user !== "undefined" &&
		user !== null &&
		!user.detail &&
		Object.keys(user).length > 0 &&
		typeof sites !== "undefined" &&
		sites !== null &&
		!sites.detail &&
		Object.keys(sites).length > 0 &&
		sites?.count
			? (() => {
					setSiteLimitCounter(sites.count);
					setMaxSiteLimit(user.plan.max_sites);
			  })()
			: null;
	}, [user, sites]);

	return (
		<div tw="flex flex-col w-0 flex-1 overflow-hidden">
			<SiteLimitReachedModal ref={ref} />

			<div tw="relative z-10 flex-shrink-0 flex  bg-white border-b border-gray-200">
				<div tw="flex-1 p-4 flex justify-between">
					<div tw="flex-1 flex">
						<div tw="w-full flex lg:ml-0">
							<label htmlFor="searchSites" tw="sr-only">
								{searchSites}
							</label>
							<div tw="relative w-full text-gray-400 focus-within:text-gray-600 flex items-center">
								<div tw="absolute inset-y-0 left-0 flex items-center pointer-events-none">
									<SearchIcon tw="h-5 w-5 text-gray-400" />
								</div>
								{sites?.count > 0 ? (
									<input
										type="search"
										name="search-sites"
										id="searchSites"
										tw="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900  focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
										placeholder={searchSites}
										onKeyUp={onHandleSiteSearch}
										defaultValue={searchKey}
										autoFocus
									/>
								) : (
									<p tw="sm:text-sm placeholder-gray-500 pl-8">{searchNotAvailable}</p>
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
									<span>{addNewSite}</span>
								</span>
							</button>
						) : (
							<Link href={AddNewSiteLink} passHref>
								<a tw="active:bg-green-700 bg-green-600 border border-transparent cursor-pointer inline-flex focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-medium hover:bg-green-700 items-center justify-center leading-5 px-4 py-2 rounded-md text-sm text-white w-full">
									<span tw="flex items-center space-x-2">
										<PlusIcon tw="mr-2 h-4 w-4 text-white" />
										{addNewSite}
									</span>
								</a>
							</Link>
						)}
					</div>
				</div>
			</div>
		</div>
	);
});

export default AddSite;

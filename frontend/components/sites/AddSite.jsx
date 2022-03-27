import { MemoizedMobileSidebarButton } from "@components/buttons/MobileSidebarButton";
import { MemoizedNotAllowedFeatureModal } from "@components/modals/NotAllowedFeatureModal";
import { MemoizedSiteLimitReachedModal } from "@components/modals/SiteLimitReachedModal";
import { ResetLoadingStateTimeout } from "@constants/GlobalValues";
import { AddNewSiteLink } from "@constants/PageLinks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { handleRemoveUrlParameter } from "@helpers/handleRemoveUrlParameter";
import { PlusIcon, SearchIcon } from "@heroicons/react/solid";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useScanApiEndpoint } from "@hooks/useScanApiEndpoint";
import { useSiteQueries } from "@hooks/useSiteQueries";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo, useContext, useState } from "react";
import { isBrowser } from "react-device-detect";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSWRConfig } from "swr";

/**
 * Custom function to render the `AddSite` component
 *
 * @param {function} handleOpenSidebar
 */
const AddSite = ({ handleOpenSidebar }) => {
	const [isLoading, setIsLoading] = useState(false);

	// Translations
	const { t } = useTranslation();
	const addNewSite = t("sites:addNewSite");
	const searchSites = t("sites:searchSites");
	const searchNotAvailable = t("sites:searchNotAvailable");
	const loaderMessage = t("common:loaderMessage");

	// Router
	const { asPath, push } = useRouter();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// Custom context
	const { isComponentReady, user, sites, hasSiteLimitReached } = useContext(SiteCrawlerAppContext);

	// Custom hooks
	const {
		ref: siteLimitReachedModalRef,
		isComponentVisible: isSiteLimitReachedModalVisible,
		setIsComponentVisible: setIsSiteLimitReachedModalVisible
	} = useComponentVisible(false);
	const {
		ref: NotAllowedFeatureModalRef,
		isComponentVisible: isNotAllowedFeatureModalVisible,
		setIsComponentVisible: setIsNotAllowedFeatureModalVisible
	} = useComponentVisible(false);

	// Helper functions
	const { searchKey, setSearchKey, linksPerPage, setPagePath } = useSiteQueries();
	const { scanApiEndpoint } = useScanApiEndpoint(linksPerPage);

	// Custom hook that handles site search
	const useHandleSiteSearch = (e) => {
		const searchTargetValue = e.target.value;

		if (e.keyCode !== 13) return false;

		let newPath = asPath;
		newPath = handleRemoveUrlParameter(newPath, "search");
		newPath = handleRemoveUrlParameter(newPath, "page");

		if (!/\S/.test(searchTargetValue)) {
			setSearchKey(searchTargetValue);
		} else {
			if (newPath.includes("?")) newPath += `&search=${searchTargetValue}`;
			else newPath += `?search=${searchTargetValue}`;

			setSearchKey(searchTargetValue);
		}

		if (newPath.includes("?")) setPagePath(`${newPath}&`);
		else setPagePath(`${newPath}?`);

		// Push new path
		push(newPath);

		// Mutate function here
		mutate(scanApiEndpoint, null, { rollbackOnError: true, revalidate: true });
	};

	// Handle `onClick` event on <Link> element
	const handleRouterOnClick = () => {
		let addNewSitePage = AddNewSiteLink + "?step=1&edit=false&verified=false";

		if (asPath.includes(AddNewSiteLink)) {
			setIsNotAllowedFeatureModalVisible(!isNotAllowedFeatureModalVisible);
		} else {
			setIsLoading(true);
			push(addNewSitePage);

			const timeout = setTimeout(() => {
				setIsLoading(false);
			}, ResetLoadingStateTimeout);

			return () => {
				clearTimeout(timeout);
			};
		}
	};

	return (
		<>
			<MemoizedSiteLimitReachedModal
				ref={siteLimitReachedModalRef}
				showModal={isSiteLimitReachedModalVisible}
				setShowModal={setIsSiteLimitReachedModalVisible}
			/>

			<MemoizedNotAllowedFeatureModal
				ref={NotAllowedFeatureModalRef}
				showModal={isNotAllowedFeatureModalVisible}
				setShowModal={setIsNotAllowedFeatureModalVisible}
			/>

			<div className="relative z-20 mx-auto flex w-full max-w-screen-2xl flex-1 flex-shrink-0 justify-between overflow-hidden xl:px-12 xl:py-4">
				<div className="flex flex-1">
					<MemoizedMobileSidebarButton handleOpenSidebar={handleOpenSidebar} />

					<div className="ml-4 flex w-full items-center lg:ml-0">
						{isBrowser ? (
							<>
								<label htmlFor="searchSites" className="sr-only">
									{searchSites}
								</label>
								<div className="relative flex w-full items-center text-gray-400 focus-within:text-gray-600">
									<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
										{isComponentReady ? (
											<SearchIcon className="h-4 w-4 text-gray-400" />
										) : (
											<Skeleton duration={2} width={20} height={20} />
										)}
									</div>
									{isComponentReady ? (
										sites?.data?.count > 0 ? (
											<input
												type="search"
												name="search-sites"
												id="searchSites"
												className="block h-full w-full border-transparent py-2 pl-8 pr-3 text-gray-900  focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
												placeholder={searchSites}
												onKeyUp={useHandleSiteSearch}
												defaultValue={searchKey}
											/>
										) : (
											<p className="flex-1 pl-8 placeholder-gray-500 sm:text-sm">{searchNotAvailable}</p>
										)
									) : (
										<Skeleton duration={2} width={320} height={20} />
									)}
								</div>
							</>
						) : null}
					</div>
				</div>
				<div className="ml-4 flex items-center space-x-2 p-4 lg:ml-6 xl:p-0">
					{isComponentReady ? (
						hasSiteLimitReached ? (
							<button
								type="button"
								disabled={isLoading}
								aria-disabled={isLoading}
								aria-hidden={isLoading}
								className="inline-flex w-full cursor-pointer items-center rounded-md border border-transparent bg-yellow-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
								onClick={(e) => setIsSiteLimitReachedModalVisible(!isSiteLimitReachedModalVisible)}
							>
								<span className="flex items-center space-x-2">
									<FontAwesomeIcon icon={["fas", "crown"]} className="mr-2 h-4 w-4 text-white" />
									{addNewSite}
								</span>
							</button>
						) : (
							<button
								type="button"
								disabled={isLoading}
								aria-disabled={isLoading}
								onClick={isLoading ? () => {} : handleRouterOnClick}
								aria-hidden={isLoading}
								className={classnames(
									"inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm",
									asPath.includes(AddNewSiteLink)
										? "cursor-pointer bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
										: isLoading
										? "cursor-not-allowed bg-green-500 opacity-50"
										: "cursor-pointer bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
								)}
							>
								<span className="flex items-center space-x-2">
									{!asPath.includes(AddNewSiteLink) && isLoading ? (
										loaderMessage
									) : (
										<>
											<PlusIcon className="mr-2 h-4 w-4 text-white" />
											{addNewSite}
										</>
									)}
								</span>
							</button>
						)
					) : (
						<Skeleton duration={2} width={147} height={38} />
					)}
				</div>
			</div>
		</>
	);
};

AddSite.propTypes = {
	handleOpenSidebar: PropTypes.func
};

/**
 * Memoized custom `AddSite` component
 */
export const MemoizedAddSite = memo(AddSite);

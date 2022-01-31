import { MemoizedMobileSidebarButton } from "@components/buttons/MobileSidebarButton";
import { MemoizedSiteLimitReachedModal } from "@components/modals/SiteLimitReachedModal";
import { AddNewSiteLink, AddNewSiteSlug } from "@constants/PageLinks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PlusIcon, SearchIcon } from "@heroicons/react/solid";
import { useAlertMessage } from "@hooks/useAlertMessage";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useLoading } from "@hooks/useLoading";
import { useScanApiEndpoint } from "@hooks/useScanApiEndpoint";
import { useSiteQueries } from "@hooks/useSiteQueries";
import { useSites } from "@hooks/useSites";
import { useSiteSearch } from "@hooks/useSiteSearch";
import { useUser } from "@hooks/useUser";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { isBrowser } from "react-device-detect";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import tw from "twin.macro";

/**
 * Custom function to render the `AddSite` component
 *
 * @param {function} handleOpenSidebar
 */
const AddSite = ({ handleOpenSidebar }) => {
	const [maxSiteLimit, setMaxSiteLimit] = useState(null);
	const [siteLimitCounter, setSiteLimitCounter] = useState(null);

	// Translations
	const { t } = useTranslation("sites");
	const addNewSite = t("addNewSite");
	const searchSites = t("searchSites");
	const searchNotAvailable = t("searchNotAvailable");

	// Router
	const { query, asPath } = useRouter();

	// SWR hooks
	const { user, errorUser, validatingUser } = useUser();
	const { sites, errorSites, validatingSites } = useSites();

	// Custom hooks
	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
	const { isComponentReady } = useLoading();
	const { state, setConfig } = useAlertMessage();

	// Helper functions
	const { searchKey, setSearchKey, linksPerPage } = useSiteQueries(query);
	const { scanApiEndpoint } = useScanApiEndpoint(query, linksPerPage);
	const { setPagePath } = useSiteQueries(query);

	// Custom hook that handles site search
	const useHandleSiteSearch = async ({ event }) => {
		return await useSiteSearch({
			event: event,
			scanApiEndpoint: scanApiEndpoint,
			setSearchKey: setSearchKey,
			setPagePath: setPagePath
		});
	};

	// Handle `maxSiteLimit` value
	const handleMaxSiteLimit = useCallback(async () => {
		if (!validatingUser) {
			if (!errorUser && typeof user !== "undefined" && user !== null && !user?.data?.detail) {
				setMaxSiteLimit(user?.data?.group?.max_sites ?? 3);
			}
		}
	}, [user, errorUser, validatingUser]);

	useEffect(() => {
		handleMaxSiteLimit();
	}, [handleMaxSiteLimit]);

	// TODO: Error handling for `user` SWR hook
	useMemo(() => {
		// Show alert message after failed `user` SWR hook
		errorSites?.length > 0
			? setConfig({
					isSites: true,
					method: errorSites?.config?.method ?? null,
					status: errorSites?.status ?? null
			  })
			: null;
	}, [errorSites]);

	// Handle `siteLimitCounter` value
	const handleSiteLimitCounter = useCallback(async () => {
		if (!validatingSites && !validatingUser) {
			if (!errorSites && !errorUser)
				if (
					typeof sites !== "undefined" &&
					sites !== null &&
					typeof user !== "undefined" &&
					user !== null &&
					!user?.data?.detail
				) {
					setSiteLimitCounter(sites?.data?.count ?? null);
					setMaxSiteLimit(user?.data?.group?.max_sites ?? null);
				}
		}

		return () => {
			setSiteLimitCounter(null);
			setMaxSiteLimit(null);
		};
	}, [sites, errorSites, validatingSites, user, errorUser, validatingUser]);

	useEffect(() => {
		handleSiteLimitCounter();
	}, [handleSiteLimitCounter]);

	return (
		<>
			<MemoizedSiteLimitReachedModal ref={ref} showModal={isComponentVisible} setShowModal={setIsComponentVisible} />

			<div tw="flex-1 xl:px-12 xl:py-4 flex justify-between relative z-20 flex-shrink-0 bg-white overflow-hidden w-full max-w-screen-2xl mx-auto">
				<div tw="flex-1 flex">
					<MemoizedMobileSidebarButton handleOpenSidebar={handleOpenSidebar} />

					<div tw="w-full flex items-center ml-4 lg:ml-0">
						{isBrowser ? (
							<>
								<label htmlFor="searchSites" tw="sr-only">
									{searchSites}
								</label>
								<div tw="relative w-full text-gray-400 focus-within:text-gray-600 flex items-center ">
									<div tw="absolute inset-y-0 left-0 flex items-center pointer-events-none">
										{isComponentReady ? (
											<SearchIcon tw="h-5 w-5 text-gray-400" />
										) : (
											<Skeleton duration={2} width={20} height={20} />
										)}
									</div>
									{siteLimitCounter !== null && siteLimitCounter > 0 ? (
										isComponentReady ? (
											<input
												type="search"
												name="search-sites"
												id="searchSites"
												tw="block w-full max-w-xs h-full pl-8 pr-3 py-2 border-transparent text-gray-900  focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
												placeholder={searchSites}
												onKeyUp={useHandleSiteSearch}
												defaultValue={searchKey}
											/>
										) : (
											<Skeleton duration={2} width={320} height={20} />
										)
									) : (
										<p tw="flex-1 sm:text-sm placeholder-gray-500 pl-8">
											{isComponentReady ? searchNotAvailable : <Skeleton duration={2} width={320} height={20} />}
										</p>
									)}
								</div>
							</>
						) : null}
					</div>
				</div>
				<div tw="ml-4 p-4 xl:p-0 flex items-center lg:ml-6 space-x-2">
					{isComponentReady ? (
						siteLimitCounter === maxSiteLimit || siteLimitCounter > maxSiteLimit ? (
							<button
								type="button"
								tw="cursor-pointer relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 active:bg-yellow-700"
								onClick={() => setIsComponentVisible(!isComponentVisible)}
							>
								<span tw="flex items-center space-x-2">
									{user?.data?.permissions &&
									typeof user?.data?.permissions !== "undefined" &&
									user?.data?.permissions?.includes("can_see_images") &&
									user?.data?.permissions?.includes("can_see_pages") &&
									user?.data?.permissions?.includes("can_see_scripts") &&
									user?.data?.permissions?.includes("can_see_stylesheets") &&
									user?.data?.permissions?.includes("can_start_scan") ? null : (
										<FontAwesomeIcon icon={["fas", "crown"]} tw="w-4 h-4 text-white" />
									)}
									<span>{addNewSite}</span>
								</span>
							</button>
						) : (
							<Link href={AddNewSiteLink + "?step=1&edit=false&verified=false"} passHref>
								<a
									disabled={asPath.includes(AddNewSiteSlug) ? true : false}
									css={[
										tw`border border-transparent inline-flex items-center justify-center leading-5 px-4 py-2 rounded-md text-sm text-white w-full`,
										asPath.includes(AddNewSiteSlug)
											? tw`opacity-50 bg-gray-300 cursor-not-allowed`
											: tw`cursor-pointer bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-medium hover:bg-green-700 active:bg-green-700 focus:outline-none`
									]}
								>
									<span tw="flex items-center space-x-2">
										<PlusIcon tw="mr-2 h-4 w-4 text-white" />
										{addNewSite}
									</span>
								</a>
							</Link>
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
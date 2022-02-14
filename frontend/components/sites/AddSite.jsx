import { MemoizedMobileSidebarButton } from "@components/buttons/MobileSidebarButton";
import { MemoizedSiteLimitReachedModal } from "@components/modals/SiteLimitReachedModal";
import { AddNewSiteLink, AddNewSiteSlug } from "@constants/PageLinks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { handleRemoveUrlParameter } from "@helpers/handleRemoveUrlParameter";
import { PlusIcon, SearchIcon } from "@heroicons/react/solid";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useScanApiEndpoint } from "@hooks/useScanApiEndpoint";
import { useSiteQueries } from "@hooks/useSiteQueries";
import { useSites } from "@hooks/useSites";
import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo, useContext, useEffect, useMemo, useState } from "react";
import { isBrowser } from "react-device-detect";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSWRConfig } from "swr";
import tw from "twin.macro";

/**
 * Custom function to render the `AddSite` component
 *
 * @param {function} handleOpenSidebar
 */
const AddSite = ({ handleOpenSidebar }) => {
	const [siteLimitCounter, setSiteLimitCounter] = useState(0);
	const [hasSiteLimitReached, setHasSiteLimitReached] = useState(false);

	// Translations
	const { t } = useTranslation("sites");
	const addNewSite = t("addNewSite");
	const searchSites = t("searchSites");
	const searchNotAvailable = t("searchNotAvailable");

	// Router
	const { asPath, push } = useRouter();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// Custom context
	const { isComponentReady } = useContext(SiteCrawlerAppContext);

	// SWR hooks
	const { user, maxSiteLimit } = useUser();
	const { sites, errorSites, validatingSites } = useSites();

	// update `siteLimitCounter` state value
	useMemo(() => {
		let isMounted = true;

		(async () => {
			if (!isMounted) return;

			// Handle `siteLimitCounter` value
			if (!validatingSites && !errorSites && sites && !sites?.data?.detail && sites?.data?.count) {
				setSiteLimitCounter(sites.data.count);
			}

			return siteLimitCounter;
		})();

		return () => {
			isMounted = false;
		};
	}, [sites, errorSites, validatingSites]);

	// Update `hasSiteLimitReached` state value
	useEffect(() => {
		let isMounted = true;

		(async () => {
			if (!isMounted) return;

			// Handle `hasSiteLimitReached` value
			if (maxSiteLimit && siteLimitCounter) {
				setHasSiteLimitReached(siteLimitCounter >= maxSiteLimit);
			}

			return hasSiteLimitReached;
		})();

		return () => {
			isMounted = false;
		};
	}, [siteLimitCounter, maxSiteLimit]);

	// Custom hooks
	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

	// Helper functions
	const { searchKey, setSearchKey, linksPerPage, setPagePath } = useSiteQueries();
	const { scanApiEndpoint } = useScanApiEndpoint(linksPerPage);

	// Custom hook that handles site search
	const useHandleSiteSearch = async (e) => {
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

		push(newPath);

		return await mutate(scanApiEndpoint);
	};

	// Handle `onClick` event on <Link> element
	const handleOnClick = (e) => {
		e.preventDefault();

		if (!asPath.includes(AddNewSiteSlug)) {
			push(AddNewSiteLink + "?step=1&edit=false&verified=false");
		} else return null;
	};

	return (
		<div tw="flex-1 xl:px-12 xl:py-4 flex justify-between relative z-20 flex-shrink-0 bg-white overflow-hidden w-full max-w-screen-2xl mx-auto">
			<MemoizedSiteLimitReachedModal ref={ref} showModal={isComponentVisible} setShowModal={setIsComponentVisible} />

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
									{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
										<SearchIcon tw="h-5 w-5 text-gray-400" />
									) : (
										<Skeleton duration={2} width={20} height={20} />
									)}
								</div>
								{siteLimitCounter > 0 ? (
									isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
										<input
											type="search"
											name="search-sites"
											id="searchSites"
											tw="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900  focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
											placeholder={searchSites}
											onKeyUp={useHandleSiteSearch}
											defaultValue={searchKey}
										/>
									) : (
										<Skeleton duration={2} width={320} height={20} />
									)
								) : (
									<p tw="flex-1 sm:text-sm placeholder-gray-500 pl-8">
										{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
											searchNotAvailable
										) : (
											<Skeleton duration={2} width={320} height={20} />
										)}
									</p>
								)}
							</div>
						</>
					) : null}
				</div>
			</div>
			<div tw="ml-4 p-4 xl:p-0 flex items-center lg:ml-6 space-x-2">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
					hasSiteLimitReached ? (
						<button
							type="button"
							tw="cursor-pointer relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 active:bg-yellow-700"
							onClick={() => setIsComponentVisible(!isComponentVisible)}
						>
							<span tw="flex items-center space-x-2">
								<FontAwesomeIcon icon={["fas", "crown"]} tw="w-4 h-4 text-white" />
								<span>{addNewSite}</span>
							</span>
						</button>
					) : (
						<Link href="/" passHref>
							<a
								role="button"
								tabIndex="0"
								onClick={handleOnClick}
								aria-hidden="true"
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
	);
};

AddSite.propTypes = {
	handleOpenSidebar: PropTypes.func
};

/**
 * Memoized custom `AddSite` component
 */
export const MemoizedAddSite = memo(AddSite);

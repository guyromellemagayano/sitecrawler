import { MemoizedSitesList } from "@components/lists/SitesList";
import { MemoizedSiteLimitReachedModal } from "@components/modals/SiteLimitReachedModal";
import { ComponentReadyInterval } from "@constants/GlobalValues";
import { AddNewSiteLink, DashboardSitesLink, SiteOverviewSlug } from "@constants/PageLinks";
import { SidebarMenuLabels } from "@constants/SidebarMenuLabels";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/solid";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useCrawl } from "@hooks/useCrawl";
import { SiteCrawlerAppContext } from "@pages/_app";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import { forwardRef, memo, useContext, useEffect, useMemo, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "twin.macro";

/**
 * Custom function to render the `SiteSelectDropdown` component
 *
 * @param {number} selectedSiteId
 * @param {function} handleSiteSelectOnClick
 * @param {boolean} openDropdown
 */
const SiteSelectDropdown = ({ selectedSiteId = null, handleSiteSelectOnClick, openDropdown = false }, ref) => {
	const [scanObjId, setScanObjId] = useState(null);
	const [siteLimitCounter, setSiteLimitCounter] = useState(null);
	const [hasSiteLimitReached, setHasSiteLimitReached] = useState(false);

	// Sidebar Menu Labels
	const labelsArray = SidebarMenuLabels();

	// Router
	const { push } = useRouter();

	// Translations
	const { t } = useTranslation("sites");
	const addNewSite = t("addNewSite");

	// Custom context
	const { user, maxSiteLimit, isComponentReady } = useContext(SiteCrawlerAppContext);

	// Custom hooks
	const { currentScan, previousScan, scanCount } = useCrawl(openDropdown ? selectedSiteId : null);
	const {
		ref: siteLimitRef,
		isComponentVisible: isSiteLimitComponentVisible,
		setIsComponentVisible: setIsSiteLimitComponentVisible
	} = useComponentVisible(false);

	// Handle site selection on load
	useMemo(() => {
		let isMounted = true;

		(async () => {
			if (!isMounted) return;

			if (previousScan !== null && currentScan !== null && scanCount !== null) {
				scanCount > 1 ? setScanObjId(previousScan?.id) : setScanObjId(currentScan?.id);
			}

			return { scanObjId };
		})();

		return () => {
			isMounted = false;
		};
	}, [scanCount, currentScan, previousScan]);

	// Handle site selection on click
	useEffect(() => {
		let isMounted = true;

		(async () => {
			if (!isMounted) return;

			if (scanObjId !== null && selectedSiteId !== null) {
				const timeout = setTimeout(() => {
					push({
						pathname: `${DashboardSitesLink}[siteId]${SiteOverviewSlug}`,
						query: {
							siteId: selectedSiteId,
							scanObjId: scanObjId
						}
					});
				}, ComponentReadyInterval);

				return () => {
					clearTimeout(timeout);
				};
			}
		})();

		return () => {
			isMounted = false;
		};
	}, [scanObjId, selectedSiteId]);

	return (
		<>
			<MemoizedSiteLimitReachedModal
				ref={siteLimitRef}
				showModal={isSiteLimitComponentVisible}
				setShowModal={setIsSiteLimitComponentVisible}
			/>
			<Transition
				show={openDropdown}
				enter="site-select-dropdown-enter"
				enterFrom="site-select-dropdown-enter-from"
				enterTo="site-select-dropdown-enter-to"
				leave="site-select-dropdown-leave"
				leaveFrom="site-select-dropdown-leave-from"
				leaveTo="site-select-dropdown-leave-to"
			>
				<div ref={ref} tw="absolute z-50 mt-1 w-full rounded-md bg-white shadow-lg overflow-hidden">
					<MemoizedSitesList isOpen={openDropdown} />
					<span tw="relative flex m-2 justify-center shadow-sm rounded-md">
						{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
							hasSiteLimitReached ? (
								<button
									type="button"
									tw="cursor-pointer relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 active:bg-yellow-700"
									onClick={() => setIsSiteLimitComponentVisible(!isSiteLimitComponentVisible)}
								>
									<span tw="flex items-center space-x-2">
										<FontAwesomeIcon icon={["fas", "crown"]} tw="w-4 h-4 text-white" />
										<span>{addNewSite}</span>
									</span>
								</button>
							) : (
								<Link href={AddNewSiteLink + "?step=1&edit=false&verified=false"} passHref>
									<a tw="active:bg-green-700 bg-green-600 border border-transparent cursor-pointer flex focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-medium hover:bg-green-700 items-center justify-center leading-4 px-3 py-2 rounded-md text-sm text-white w-full">
										<PlusIcon tw="-ml-3 mr-2 h-4 w-4" />
										{labelsArray[2]?.label ?? null}
									</a>
								</Link>
							)
						) : (
							<Skeleton duration={2} width={208} height={38} tw="rounded-md" />
						)}
					</span>
				</div>
			</Transition>
		</>
	);
};

/**
 * Memoized custom `SiteSelectDropdown` component
 */
const ForwardRefSiteSelectDropdown = forwardRef(SiteSelectDropdown);
export const MemoizedSiteSelectDropdown = memo(ForwardRefSiteSelectDropdown);

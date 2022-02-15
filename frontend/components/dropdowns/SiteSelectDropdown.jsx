import { MemoizedSitesList } from "@components/lists/SitesList";
import { MemoizedSiteLimitReachedModal } from "@components/modals/SiteLimitReachedModal";
import { AddNewSiteLink } from "@constants/PageLinks";
import { SidebarMenuLabels } from "@constants/SidebarMenuLabels";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/solid";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useSites } from "@hooks/useSites";
import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import { forwardRef, memo, useContext, useMemo, useState } from "react";
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
const SiteSelectDropdown = ({ handleSiteSelectOnClick, openDropdown = false }, ref) => {
	const [hasSiteLimitReached, setHasSiteLimitReached] = useState(false);

	// Sidebar Menu Labels
	const labelsArray = SidebarMenuLabels();

	// Router
	const { push } = useRouter();

	// Translations
	const { t } = useTranslation("sites");
	const addNewSite = t("addNewSite");

	// Custom context
	const { isComponentReady } = useContext(SiteCrawlerAppContext);

	// SWR hooks
	const { user, maxSiteLimit } = useUser();
	const { sitesCount } = useSites();

	// Custom hooks
	const {
		ref: siteLimitRef,
		isComponentVisible: isSiteLimitComponentVisible,
		setIsComponentVisible: setIsSiteLimitComponentVisible
	} = useComponentVisible(false);

	// Update `hasSiteLimitReached` state value
	useMemo(() => {
		let isMounted = true;

		(async () => {
			if (!isMounted) return;

			// Handle `hasSiteLimitReached` value
			if (maxSiteLimit && sitesCount) {
				setHasSiteLimitReached(sitesCount >= maxSiteLimit);
			}

			return hasSiteLimitReached;
		})();

		return () => {
			isMounted = false;
		};
	}, [sitesCount, maxSiteLimit]);

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
									tw="active:bg-yellow-700 bg-yellow-600 border border-transparent cursor-pointer flex focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 font-medium hover:bg-yellow-700 items-center justify-center leading-4 px-3 py-2 rounded-md text-sm text-white w-full"
									onClick={() => setIsSiteLimitComponentVisible(!isSiteLimitComponentVisible)}
								>
									<div tw="flex items-center space-x-2">
										<FontAwesomeIcon icon={["fas", "crown"]} tw="h-4 w-4" />
										<span>{addNewSite}</span>
									</div>
								</button>
							) : (
								<Link href={AddNewSiteLink + "?step=1&edit=false&verified=false"} passHref>
									<a tw="active:bg-green-700 bg-green-600 border border-transparent cursor-pointer flex focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-medium hover:bg-green-700 items-center justify-center leading-4 px-3 py-2 rounded-md text-sm text-white w-full">
										<div tw="flex items-center space-x-2">
											<PlusIcon tw="mr-2 h-4 w-4" />
											{labelsArray[2]?.label ?? null}
										</div>
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

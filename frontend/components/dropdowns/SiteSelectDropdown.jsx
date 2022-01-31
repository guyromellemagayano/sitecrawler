import { MemoizedSitesList } from "@components/lists/SitesList";
import { ComponentReadyInterval } from "@constants/GlobalValues";
import { AddNewSiteLink, DashboardSitesLink, SiteOverviewSlug } from "@constants/PageLinks";
import { SidebarMenuLabels } from "@constants/SidebarMenuLabels";
import { Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/solid";
import { useCrawl } from "@hooks/useCrawl";
import Link from "next/link";
import { useRouter } from "next/router";
import { forwardRef, memo, useEffect, useMemo, useState } from "react";
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

	// Sidebar Menu Labels
	const labelsArray = SidebarMenuLabels();

	// Router
	const router = useRouter();

	// Custom hooks
	const { currentScan, previousScan, scanCount } = useCrawl(openDropdown ? selectedSiteId : null);

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
					router.push({
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
					<Link href={AddNewSiteLink + "?step=1&edit=false&verified=false"} passHref>
						<a tw="active:bg-green-700 bg-green-600 border border-transparent cursor-pointer flex focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-medium hover:bg-green-700 items-center justify-center leading-4 px-3 py-2 rounded-md text-sm text-white w-full">
							<PlusIcon tw="-ml-3 mr-2 h-4 w-4" />
							{labelsArray[2]?.label ?? null}
						</a>
					</Link>
				</span>
			</div>
		</Transition>
	);
};

/**
 * Memoized custom `SiteSelectDropdown` component
 */
const ForwardRefSiteSelectDropdown = forwardRef(SiteSelectDropdown);
export const MemoizedSiteSelectDropdown = memo(ForwardRefSiteSelectDropdown);

/* eslint-disable jsx-a11y/anchor-is-valid */
import { MemoizedSitesList } from "@components/lists/SitesList";
import { ComponentReadyInterval } from "@constants/GlobalValues";
import { AddNewSiteLink, DashboardSiteSlug, SiteOverviewSlug } from "@constants/PageLinks";
import { SidebarMenuLabels } from "@constants/SidebarMenuLabels";
import { Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/solid";
import { useCrawl } from "@hooks/useCrawl";
import Link from "next/link";
import { useRouter } from "next/router";
import { forwardRef, memo, useMemo, useState } from "react";
import "twin.macro";

/**
 * Custom function to render the `SiteSelectDropdown` component
 */
export function SiteSelectDropdown({ selectedSiteId, handleSiteSelectOnLoad, openDropdown }, ref) {
	const [scanObjId, setScanObjId] = useState(null);

	// Sidebar Menu Labels
	const labelsArray = SidebarMenuLabels();

	// Router
	const router = useRouter();

	// Custom hooks
	const { currentScan, previousScan, scanCount } = useCrawl(selectedSiteId ?? null);

	useMemo(() => {
		const handleScanObjId = async (scanCount, currentScan, previousScan) => {
			scanCount > 1
				? previousScan !== undefined
					? setScanObjId(previousScan?.id)
					: false
				: currentScan !== undefined
				? setScanObjId(currentScan?.id)
				: setScanObjId(previousScan?.id);

			return scanObjId;
		};

		handleScanObjId(scanCount, currentScan, previousScan);
	}, [scanCount, currentScan, previousScan, scanObjId]);

	useMemo(() => {
		if (
			typeof scanObjId !== "undefined" &&
			scanObjId !== null &&
			scanObjId > 0 &&
			typeof selectedSiteId !== "undefined" &&
			selectedSiteId !== null &&
			selectedSiteId > 0
		) {
			setTimeout(() => {
				router.push({
					pathname: `${DashboardSiteSlug}[siteId]${SiteOverviewSlug}`,
					query: {
						siteId: selectedSiteId,
						scanObjId: scanObjId
					}
				});
			}, ComponentReadyInterval);
		}
	}, [router, scanObjId, selectedSiteId]);

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
				<MemoizedSitesList handleSiteSelectOnLoad={handleSiteSelectOnLoad} />
				<span tw="relative flex m-2 justify-center shadow-sm rounded-md">
					<Link href={AddNewSiteLink} passHref>
						<a tw="active:bg-green-700 bg-green-600 border border-transparent cursor-pointer flex focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-medium hover:bg-green-700 items-center justify-center leading-4 px-3 py-2 rounded-md text-sm text-white w-full">
							<PlusIcon tw="-ml-3 mr-2 h-4 w-4" />
							{labelsArray[2]?.label ?? null}
						</a>
					</Link>
				</span>
			</div>
		</Transition>
	);
}

/**
 * Memoized custom `SiteSelectDropdown` component
 */
export const ForwardRefSiteSelectDropdown = forwardRef(SiteSelectDropdown);
export const MemoizedSiteSelectDropdown = memo(ForwardRefSiteSelectDropdown);

import { ComponentReadyInterval } from "@constants/GlobalValues";
import { AddNewSiteLink, DashboardSiteSlug, SiteOverviewSlug } from "@constants/PageLinks";
import { SidebarMenuLabels } from "@constants/SidebarMenuLabels";
import { Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/solid";
import { useCrawl } from "@hooks/useCrawl";
import Link from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo, useMemo, useState } from "react";
import "twin.macro";

/**
 * Memoized function to render the `SiteSelectDropdown` component.
 */
const SiteSelectDropdown = memo(({ selectedSiteId = null, handleSiteSelectOnLoad, isComponentVisible = false }) => {
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
					? setScanObjId(previousScan.id)
					: false
				: currentScan !== undefined
				? setScanObjId(currentScan.id)
				: setScanObjId(previousScan.id);

			return scanObjId;
		};

		handleScanObjId(scanCount, currentScan, previousScan);
	}, [scanCount, currentScan, previousScan, scanObjId, selectedSiteId]);

	useMemo(() => {
		if (scanObjId && selectedSiteId) {
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
	}, [scanObjId, selectedSiteId]);

	return (
		<Transition
			show={isComponentVisible}
			enter="transition ease-out duration-100"
			enterFrom="transform opacity-0 scale-95"
			enterTo="transform opacity-100 scale-100"
			leave="transition ease-in duration-75"
			leaveFrom="transform opacity-100 scale-100"
			leaveTo="transform opacity-0 scale-95"
			tw="absolute mt-1 w-full rounded-md bg-white shadow-lg overflow-hidden"
		>
			<SitesList handleSiteSelectOnLoad={handleSiteSelectOnLoad} />
			<span tw="relative flex m-2 justify-center shadow-sm rounded-md">
				<Link href={AddNewSiteLink} passHref>
					<a tw="active:bg-green-700 bg-green-600 border border-transparent cursor-pointer flex focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-medium hover:bg-green-700 items-center justify-center leading-4 px-3 py-2 rounded-md text-sm text-white w-full">
						<PlusIcon tw="-ml-3 mr-2 h-4 w-4" />
						{labelsArray[2].label}
					</a>
				</Link>
			</span>
		</Transition>
	);
});

SiteSelectDropdown.propTypes = {
	handleSiteSelectOnLoad: PropTypes.any,
	isComponentVisible: PropTypes.bool,
	selectedSiteId: PropTypes.any
};

export default SiteSelectDropdown;

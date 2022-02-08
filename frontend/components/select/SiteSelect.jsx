import { MemoizedSiteSelectDropdown } from "@components/dropdowns/SiteSelectDropdown";
import { MemoizedSiteSelectMenu } from "@components/menus/SiteSelectMenu";
import { useLoading } from "@hooks/useLoading";
import { useSiteSelection } from "@hooks/useSiteSelection";
import { memo } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "twin.macro";

/**
 * Custom function to render the `SiteSelect` component
 */
const SiteSelect = () => {
	// Custom hooks
	const { isComponentReady } = useLoading();
	const {
		siteSelectRef,
		isSiteSelectComponentVisible,
		setIsSiteSelectComponentVisible,
		selectedSiteId,
		setSelectedSiteId,
		selectedSite,
		setSelectedSite,
		selectedSiteDetails,
		setSelectedSiteDetails,
		handleSiteSelectOnClick
	} = useSiteSelection();

	return (
		<div tw="relative space-y-1">
			<span tw="inline-block w-full rounded-md shadow-sm">
				{isComponentReady ? (
					<MemoizedSiteSelectMenu
						selectedSite={selectedSite}
						selectedSiteDetails={selectedSiteDetails}
						handleOpenDropdown={() => setIsSiteSelectComponentVisible(!isSiteSelectComponentVisible)}
					/>
				) : (
					<Skeleton width={224} height={38} tw="cursor-default relative w-full pl-3 pr-10 py-2" />
				)}
			</span>

			<MemoizedSiteSelectDropdown
				ref={siteSelectRef}
				selectedSiteId={selectedSiteId}
				handleSiteSelectOnClick={handleSiteSelectOnClick}
				openDropdown={isSiteSelectComponentVisible}
			/>
		</div>
	);
};

/**
 * Memoized custom `SiteSelect` component
 */
export const MemoizedSiteSelect = memo(SiteSelect);

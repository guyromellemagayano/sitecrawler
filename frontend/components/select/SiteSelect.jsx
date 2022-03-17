import { MemoizedSiteSelectDropdown } from "@components/dropdowns/SiteSelectDropdown";
import { MemoizedSiteSelectMenu } from "@components/menus/SiteSelectMenu";
import { useSiteSelection } from "@hooks/useSiteSelection";
import { SiteCrawlerAppContext } from "@pages/_app";
import { memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the `SiteSelect` component
 */
const SiteSelect = () => {
	// Custom context
	const { isComponentReady } = useContext(SiteCrawlerAppContext);

	// Custom hooks
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
		<div className="relative space-y-1">
			<span className="inline-block w-full rounded-md shadow-sm">
				{isComponentReady ? (
					<MemoizedSiteSelectMenu
						selectedSite={selectedSite}
						selectedSiteDetails={selectedSiteDetails}
						handleOpenDropdown={() => setIsSiteSelectComponentVisible(!isSiteSelectComponentVisible)}
					/>
				) : (
					<Skeleton width={224} height={38} className="relative w-full cursor-default py-2 pl-3 pr-10" />
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

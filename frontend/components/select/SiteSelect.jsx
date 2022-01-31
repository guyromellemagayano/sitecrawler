import { MemoizedAlert } from "@components/alerts";
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
		state,
		setConfig,
		selectedSiteId,
		setSelectedSiteId,
		selectedSite,
		setSelectedSite,
		selectedSiteDetails,
		setSelectedSiteDetails,
		handleSiteSelectOnClick
	} = useSiteSelection();

	return (
		<>
			{state?.responses !== [] && state?.responses?.length > 0 ? (
				<div tw="fixed right-6 bottom-6 grid grid-flow-row gap-4">
					{state?.responses?.map((value, key) => {
						// Alert Messsages
						const responseText = value?.responseText ?? null;
						const isSuccess = value?.isSuccess ?? null;

						return <MemoizedAlert key={key} responseText={responseText} isSuccess={isSuccess} />;
					}) ?? null}
				</div>
			) : null}

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
		</>
	);
};

/**
 * Memoized custom `SiteSelect` component
 */
export const MemoizedSiteSelect = memo(SiteSelect);

import { MemoizedHowToSetup } from "@components/sites/HowToSetup";
import { MemoizedAddSiteSteps } from "@components/steps/AddSiteSteps";
import { memo } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import "twin.macro";

/**
 * Custom function to render the `AddNewSitePageLayout` component
 */
export function AddNewSitePageLayout(props) {
	return (
		<div tw="w-full flex items-start py-4">
			<MemoizedAddSiteSteps {...props} />
			<MemoizedHowToSetup />
		</div>
	);
}

/**
 * Memoized custom `AddNewSitePageLayout` component
 */
export const MemoizedAddNewSitePageLayout = memo(AddNewSitePageLayout);

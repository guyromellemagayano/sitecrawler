import { MemoizedHowToSetup } from "@components/sites/HowToSetup";
import { MemoizedAddSiteSteps } from "@components/steps/AddSiteSteps";
import { memo } from "react";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the `AddNewSitePageLayout` component
 */
const AddNewSitePageLayout = (props) => {
	return (
		<div className="flex w-full items-start py-4">
			<MemoizedAddSiteSteps {...props} />
			<MemoizedHowToSetup />
		</div>
	);
};

/**
 * Memoized custom `AddNewSitePageLayout` component
 */
export const MemoizedAddNewSitePageLayout = memo(AddNewSitePageLayout);

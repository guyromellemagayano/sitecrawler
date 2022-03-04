import { BadgeCheckIcon } from "@heroicons/react/solid";
import { memo } from "react";

const SiteSuccessIcon = () => {
	return <BadgeCheckIcon className="inline-block h-4 w-4 text-green-400" />;
};

export const MemoizedSiteSuccessIcon = memo(SiteSuccessIcon);

import { BadgeCheckIcon } from "@heroicons/react/solid";
import { memo } from "react";
import "twin.macro";

const SiteSuccessIcon = () => {
	return <BadgeCheckIcon tw="inline-block h-5 w-5 text-green-400" />;
};

export const MemoizedSiteSuccessIcon = memo(SiteSuccessIcon);
